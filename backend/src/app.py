from __future__ import annotations

import json
import os
import time
from decimal import Decimal
from typing import Any

import boto3
from boto3.dynamodb.conditions import Key

from .models import Deck, DeckVersion, DownloadToken
from .sample_data import SAMPLE_DECKS, SAMPLE_VERSIONS
from .signing import SigningNotConfigured, build_cloudfront_signed_url


class ApiError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


def handler(event: dict[str, Any], _context: Any) -> dict[str, Any]:
    try:
        method = _method(event)
        path = _path(event)

        if method == "GET" and path == "/health":
            return _json(200, {"ok": True, "service": "deckhub-api"})

        if method == "GET" and path == "/decks":
            return _json(200, {"items": [Deck(**deck).model_dump() for deck in _list_decks()]})

        parts = [part for part in path.split("/") if part]

        if method == "GET" and len(parts) == 2 and parts[0] == "decks":
            deck = _get_deck_by_slug(parts[1])
            if not deck:
                raise ApiError(404, "Deck not found.")
            return _json(200, Deck(**deck).model_dump())

        if method == "GET" and len(parts) == 3 and parts[0] == "decks" and parts[2] == "versions":
            versions = [DeckVersion(**item).model_dump() for item in _list_versions(parts[1])]
            return _json(200, {"items": versions})

        if method == "POST" and len(parts) == 2 and parts[0] == "downloads":
            token = _create_download_token(parts[1])
            return _json(201, token.model_dump())

        raise ApiError(404, "Route not found.")
    except SigningNotConfigured as exc:
        return _json(501, {"message": str(exc)})
    except ApiError as exc:
        return _json(exc.status_code, {"message": exc.message})


def _method(event: dict[str, Any]) -> str:
    return (
        event.get("requestContext", {})
        .get("http", {})
        .get("method", event.get("httpMethod", "GET"))
        .upper()
    )


def _path(event: dict[str, Any]) -> str:
    path = event.get("rawPath") or event.get("path") or "/"
    stage = event.get("requestContext", {}).get("stage")
    if stage and stage != "$default" and path.startswith(f"/{stage}/"):
        path = path[len(stage) + 1 :]
    return path.rstrip("/") or "/"


def _json(status_code: int, body: Any) -> dict[str, Any]:
    return {
        "statusCode": status_code,
        "headers": {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
        },
        "body": json.dumps(_to_jsonable(body), ensure_ascii=False),
    }


def _to_jsonable(value: Any) -> Any:
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    if isinstance(value, list):
        return [_to_jsonable(item) for item in value]
    if isinstance(value, dict):
        return {key: _to_jsonable(item) for key, item in value.items()}
    return value


def _dynamodb_table(env_name: str):
    table_name = os.environ.get(env_name)
    if not table_name:
        return None
    return boto3.resource("dynamodb").Table(table_name)


def _list_decks() -> list[dict[str, Any]]:
    table = _dynamodb_table("DECKS_TABLE_NAME")
    if table is None:
        return SAMPLE_DECKS
    response = table.scan(Limit=50)
    return response.get("Items", [])


def _get_deck_by_slug(slug: str) -> dict[str, Any] | None:
    table = _dynamodb_table("DECKS_TABLE_NAME")
    if table is None:
        return next((deck for deck in SAMPLE_DECKS if deck["slug"] == slug), None)

    response = table.query(
        IndexName="SlugIndex",
        KeyConditionExpression=Key("slug").eq(slug),
        Limit=1,
    )
    items = response.get("Items", [])
    return items[0] if items else None


def _list_versions(deck_id: str) -> list[dict[str, Any]]:
    table = _dynamodb_table("DECK_VERSIONS_TABLE_NAME")
    if table is None:
        return [version for version in SAMPLE_VERSIONS if version["deck_id"] == deck_id]

    response = table.query(KeyConditionExpression=Key("deck_id").eq(deck_id))
    return response.get("Items", [])


def _get_version_by_id(version_id: str) -> dict[str, Any] | None:
    table = _dynamodb_table("DECK_VERSIONS_TABLE_NAME")
    if table is None:
        return next((version for version in SAMPLE_VERSIONS if version["version_id"] == version_id), None)

    response = table.query(
        IndexName="VersionIdIndex",
        KeyConditionExpression=Key("version_id").eq(version_id),
        Limit=1,
    )
    items = response.get("Items", [])
    return items[0] if items else None


def _create_download_token(version_id: str) -> DownloadToken:
    version = _get_version_by_id(version_id)
    if not version:
        raise ApiError(404, "Deck version not found.")

    download_domain = os.environ.get("DOWNLOAD_DOMAIN")
    if not download_domain:
        raise SigningNotConfigured("Download CloudFront domain is not configured.")

    ttl_seconds = int(os.environ.get("DOWNLOAD_URL_TTL_SECONDS", "300"))
    expires_at = int(time.time()) + ttl_seconds
    url = build_cloudfront_signed_url(download_domain, version["s3_key"], expires_at)
    return DownloadToken(url=url, expires_at=expires_at, version_id=version_id)
