# Publish a Deck

DeckHub is currently a maintainer-curated archive. External deck submissions
are disabled. A deck becomes public only when the maintainer adds a manifest
and merges it into the repository.

## 1. Export the APKG

Export your deck from Anki as `.apkg`.

Compute a SHA256 digest:

```powershell
Get-FileHash .\deck.apkg -Algorithm SHA256
```

Record:

- File name
- SHA256
- File size in bytes
- Card count
- Note count
- Media count
- Optional split ranges such as `Level 1`, `Part 2`, `Beginner`, or `Full scope`

## 2. Attach the APKG to a GitHub Release

Create a release tag such as:

```text
hsk-vocabulary-v2026.06
```

Attach the APKG file to that release. Do not commit APKG files directly.

## 3. Add or update the manifest

Create a manifest skeleton:

```powershell
npm run deck:new -- language hsk-vocabulary
```

Edit:

```text
decks/language/hsk-vocabulary/deck.json
```

If the same deck should be downloadable in smaller pieces, add `segments`:

```json
{
  "id": "level-1",
  "label": "Level 1",
  "description": "Only Level 1 vocabulary",
  "scope": ["Level 1"],
  "cards": 150
}
```

If a segment has its own APKG file, add an `apkg` object inside that segment.

## 4. Build and validate

```powershell
npm run catalog:build
npm run catalog:check
npm run frontend:lint
npm run frontend:build
```

Push the commit. GitHub Actions will publish the updated static catalog to
GitHub Pages after the change lands on `main`.
