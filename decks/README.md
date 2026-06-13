# Deck Manifests

DeckHub treats this directory as the source of truth.

Each public deck lives in:

```text
decks/<category>/<slug>/deck.json
```

The `.apkg` file itself should be attached to a GitHub Release. The manifest stores
the release asset URL, SHA256 hash, size, version metadata, optional split segments,
and optional Anki note type summaries.

Create a new manifest:

```powershell
npm run deck:new -- language hsk-vocabulary
```

Validate and rebuild the catalog:

```powershell
npm run catalog:build
npm run catalog:check
```

For the exact shape, see [`_schema/deck.schema.json`](./_schema/deck.schema.json).
