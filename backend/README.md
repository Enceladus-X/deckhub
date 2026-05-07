# DeckHub Backend

Python Lambda native handler for the DeckHub API.

## Commands

```powershell
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements-dev.txt
.venv/Scripts/python.exe -m pytest
```

## Routes

- `GET /health`
- `GET /decks`
- `GET /decks/{slug}`
- `GET /decks/{deck_id}/versions`
- `GET /card-templates`
- `GET /card-templates/{template_id}`
- `POST /card-templates`
- `POST /downloads/{version_id}`

Download URLs require `DOWNLOAD_DOMAIN`, `CLOUDFRONT_KEY_PAIR_ID`, and a CloudFront private key supplied directly for local use or through Secrets Manager in AWS.
