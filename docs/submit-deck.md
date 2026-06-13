# Submit a Deck

## 1. Prepare the APKG

Export the deck from Anki as `.apkg`.

Compute a SHA256 digest:

```powershell
Get-FileHash .\deck.apkg -Algorithm SHA256
```

## 2. Attach the file to a GitHub Release

Create a release tag such as:

```text
hsk-vocabulary-v2026.06
```

Attach the APKG file to that release. Do not commit APKG files directly.

## 3. Add the manifest

Create a manifest skeleton:

```powershell
npm run deck:new -- language hsk-vocabulary
```

Edit:

```text
decks/language/hsk-vocabulary/deck.json
```

Add split `segments` when users may want only part of the same deck, for example:

```json
{
  "id": "level-1",
  "label": "1급",
  "description": "HSK 1급 단어만 포함",
  "scope": ["1급"],
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

Open a pull request. The catalog workflow must pass before merge.
