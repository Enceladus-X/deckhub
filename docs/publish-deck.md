# Publish a Deck

DeckHub is a maintainer-curated archive. External deck submissions are disabled.
A deck appears on GitHub Pages only after the maintainer uploads an APKG file to
GitHub Releases and commits a manifest under `decks/`.

## 1. Export APKG

Export the deck from Anki as `.apkg`.

Compute SHA256:

```powershell
Get-FileHash .\deck.apkg -Algorithm SHA256
```

Analyze the APKG so the manifest can use real card, note, media, note type, and
tag counts:

```powershell
python scripts/analyze-apkg.py .\deck.apkg
```

If the APKG uses Anki's newer zstd-compressed format, install the optional
Python dependency once:

```powershell
python -m pip install zstandard
```

Use tag counts as optional scope labels such as `Level 1`, `Part 2`, or
`Full scope`.

## 2. Create a GitHub Release

Create a release tag, then attach the APKG file.

Example tag:

```text
hsk-vocabulary-v2026.06
```

Do not commit APKG files directly to Git.

## 3. Link the Release to the Catalog

Run the helper script from the repository root:

```powershell
npm run deck:link-release -- --category language --slug hsk-vocabulary --title "HSK Vocabulary" --summary "HSK vocabulary deck." --exam HSK --deck-version 2026.06 --release hsk-vocabulary-v2026.06 --asset hsk-vocabulary.apkg --sha256 <64-char-sha256> --cards 600 --notes 600 --media 0 --scope "Level 1,Level 2,Level 3"
```

This creates:

```text
decks/language/hsk-vocabulary/deck.json
```

## 4. Build and Validate

```powershell
npm run catalog:build
npm run catalog:check
npm run frontend:build
```

Commit and push to `main`. GitHub Actions will publish the updated static
catalog to GitHub Pages.
