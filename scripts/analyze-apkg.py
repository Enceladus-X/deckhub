#!/usr/bin/env python3
"""Inspect an Anki APKG file for DeckHub manifest metadata."""

from __future__ import annotations

import argparse
import io
import json
import sqlite3
import sys
import tempfile
import zipfile
from collections import Counter
from pathlib import Path
from typing import Any

ZSTD_MAGIC = b"\x28\xb5\x2f\xfd"
COLLECTION_CANDIDATES = ("collection.anki21b", "collection.anki21", "collection.anki2")
NON_MEDIA_ENTRIES = {"meta", "media", *COLLECTION_CANDIDATES}


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract cards, notes, media, note types, decks, and tag counts from APKG.",
    )
    parser.add_argument("apkg", type=Path, help="Path to an .apkg file exported from Anki.")
    parser.add_argument(
        "output_path",
        nargs="?",
        type=Path,
        help="Optional JSON output path, useful when running through npm.",
    )
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON.")
    parser.add_argument("--output", type=Path, help="Write machine-readable JSON as UTF-8.")
    args = parser.parse_args()
    output_path = args.output or args.output_path

    try:
        result = analyze_apkg(args.apkg)
    except ApkgAnalysisError as error:
        print(f"error: {error}", file=sys.stderr)
        return 1

    serialized = json.dumps(result, ensure_ascii=False, indent=2)
    if output_path:
        output_path.write_text(f"{serialized}\n", encoding="utf-8")
        if not args.json:
            print(f"Wrote {output_path}")

    if args.json:
        print(serialized)
    elif not output_path:
        print_summary(result)

    return 0


def analyze_apkg(apkg_path: Path) -> dict[str, Any]:
    if not apkg_path.exists():
        raise ApkgAnalysisError(f"{apkg_path} does not exist.")

    with zipfile.ZipFile(apkg_path) as archive:
        names = set(archive.namelist())
        collection_name = next((name for name in COLLECTION_CANDIDATES if name in names), None)
        if collection_name is None:
            raise ApkgAnalysisError("No Anki collection file was found in the APKG.")

        collection_data = maybe_decompress(archive.read(collection_name), collection_name)
        media_count = count_media_entries(archive, names)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".anki2") as temp_file:
        temp_file.write(collection_data)
        temp_path = Path(temp_file.name)

    try:
        connection = sqlite3.connect(temp_path)
        connection.create_collation("unicase", compare_unicase)
        try:
            return inspect_collection(connection, apkg_path, collection_name, media_count)
        finally:
            connection.close()
    finally:
        temp_path.unlink(missing_ok=True)


def maybe_decompress(data: bytes, entry_name: str) -> bytes:
    if not data.startswith(ZSTD_MAGIC):
        return data

    try:
        import zstandard as zstd
    except ModuleNotFoundError as error:
        raise ApkgAnalysisError(
            f"{entry_name} is zstd-compressed. Install support with: python -m pip install zstandard",
        ) from error

    with zstd.ZstdDecompressor().stream_reader(io.BytesIO(data)) as reader:
        return reader.read()


def count_media_entries(archive: zipfile.ZipFile, names: set[str]) -> int:
    numbered_entries = [name for name in names if name not in NON_MEDIA_ENTRIES]
    if numbered_entries:
        return len(numbered_entries)

    if "media" not in names:
        return 0

    media_data = maybe_decompress(archive.read("media"), "media")
    try:
        return len(json.loads(media_data.decode("utf-8")))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return 0


def inspect_collection(
    connection: sqlite3.Connection,
    apkg_path: Path,
    collection_name: str,
    media_count: int,
) -> dict[str, Any]:
    cursor = connection.cursor()
    cards = cursor.execute("select count(*) from cards").fetchone()[0]
    notes = cursor.execute("select count(*) from notes").fetchone()[0]

    return {
        "file": str(apkg_path),
        "collection": collection_name,
        "cards": cards,
        "notes": notes,
        "media": media_count,
        "decks": read_decks(cursor),
        "noteTypes": read_note_types(cursor),
        "tagCounts": read_tag_counts(cursor),
    }


def read_decks(cursor: sqlite3.Cursor) -> list[str]:
    if has_table(cursor, "decks"):
        return [
            clean_text(row[0])
            for row in cursor.execute("select name from decks order by name").fetchall()
        ]

    decks_json = read_col_json(cursor, "decks")
    return sorted(clean_text(deck.get("name", "")) for deck in decks_json.values() if deck.get("name"))


def read_note_types(cursor: sqlite3.Cursor) -> list[dict[str, Any]]:
    if has_table(cursor, "notetypes"):
        note_types = []
        for note_type_id, name in cursor.execute("select id, name from notetypes order by name"):
            fields = [
                row[0]
                for row in cursor.execute(
                    "select name from fields where ntid = ? order by ord",
                    (note_type_id,),
                ).fetchall()
            ]
            templates = [
                row[0]
                for row in cursor.execute(
                    "select name from templates where ntid = ? order by ord",
                    (note_type_id,),
                ).fetchall()
            ]
            note_count = cursor.execute(
                "select count(*) from notes where mid = ?",
                (note_type_id,),
            ).fetchone()[0]
            card_count = cursor.execute(
                "select count(*) from cards where nid in (select id from notes where mid = ?)",
                (note_type_id,),
            ).fetchone()[0]
            note_types.append(
                {
                    "name": clean_text(name),
                    "fields": [clean_text(field) for field in fields],
                    "templates": [clean_text(template) for template in templates],
                    "notes": note_count,
                    "cards": card_count,
                },
            )
        return note_types

    models = read_col_json(cursor, "models")
    note_types = []
    for model in models.values():
        model_id = int(model.get("id", 0))
        note_count = cursor.execute(
            "select count(*) from notes where mid = ?",
            (model_id,),
        ).fetchone()[0]
        card_count = cursor.execute(
            "select count(*) from cards where nid in (select id from notes where mid = ?)",
            (model_id,),
        ).fetchone()[0]
        note_types.append(
            {
                "name": clean_text(model.get("name", "")),
                "fields": [clean_text(field.get("name", "")) for field in model.get("flds", [])],
                "templates": [
                    clean_text(template.get("name", "")) for template in model.get("tmpls", [])
                ],
                "notes": note_count,
                "cards": card_count,
            },
        )
    return note_types


def read_tag_counts(cursor: sqlite3.Cursor) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for (tags,) in cursor.execute("select tags from notes").fetchall():
        for tag in tags.split():
            counts[tag] += 1
    return dict(sorted(counts.items(), key=lambda item: (-item[1], item[0].casefold())))


def read_col_json(cursor: sqlite3.Cursor, column: str) -> dict[str, Any]:
    value = cursor.execute(f"select {column} from col").fetchone()[0]
    if not value:
        return {}
    return json.loads(value)


def has_table(cursor: sqlite3.Cursor, table_name: str) -> bool:
    return (
        cursor.execute(
            "select count(*) from sqlite_master where type = 'table' and name = ?",
            (table_name,),
        ).fetchone()[0]
        > 0
    )


def compare_unicase(left: str, right: str) -> int:
    return (left.casefold() > right.casefold()) - (left.casefold() < right.casefold())


def clean_text(value: str) -> str:
    if not isinstance(value, str) or contains_hangul(value):
        return value

    try:
        repaired = value.encode("latin-1").decode("cp949")
    except UnicodeError:
        return value

    return repaired if contains_hangul(repaired) else value


def contains_hangul(value: str) -> bool:
    return any("\uac00" <= char <= "\ud7a3" for char in value)


def print_summary(result: dict[str, Any]) -> None:
    print(f"APKG: {result['file']}")
    print(f"Collection: {result['collection']}")
    print(f"Cards: {result['cards']}")
    print(f"Notes: {result['notes']}")
    print(f"Media: {result['media']}")

    if result["decks"]:
        print("\nDecks:")
        for deck in result["decks"]:
            print(f"- {deck}")

    if result["noteTypes"]:
        print("\nNote types:")
        for note_type in result["noteTypes"]:
            print(f"- {note_type['name']}: {note_type['notes']} notes, {note_type['cards']} cards")
            print(f"  fields: {', '.join(note_type['fields'])}")
            print(f"  templates: {', '.join(note_type['templates'])}")

    if result["tagCounts"]:
        print("\nTags:")
        for tag, count in result["tagCounts"].items():
            print(f"- {tag}: {count}")


class ApkgAnalysisError(Exception):
    """Raised when an APKG cannot be inspected."""


if __name__ == "__main__":
    raise SystemExit(main())
