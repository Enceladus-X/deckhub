import json

from src.app import handler


def event(method: str, path: str):
    return {
        "version": "2.0",
        "rawPath": path,
        "requestContext": {
            "stage": "$default",
            "http": {
                "method": method,
                "path": path,
            },
        },
    }


def test_health():
    response = handler(event("GET", "/health"), None)

    assert response["statusCode"] == 200
    assert json.loads(response["body"])["service"] == "deckhub-api"


def test_list_decks_uses_seed_data_without_table_env():
    response = handler(event("GET", "/decks"), None)
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert body["items"][0]["slug"] == "aws-solutions-architect-associate"


def test_download_requires_cloudfront_configuration():
    response = handler(event("POST", "/downloads/ver_aws_saa_c03_2026_04"), None)

    assert response["statusCode"] == 501
