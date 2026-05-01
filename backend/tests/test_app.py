import json

from src.app import handler


def event(method: str, path: str, body=None):
    return {
        "version": "2.0",
        "rawPath": path,
        "body": json.dumps(body) if body is not None else None,
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


def test_upload_creates_review_pending_record():
    response = handler(
        event(
            "POST",
            "/uploads",
            {
                "title": "정보보안기사 필기 요약 덱",
                "category": "IT",
                "version": "2026.05",
                "file_name": "security.apkg",
            },
        ),
        None,
    )
    body = json.loads(response["body"])

    assert response["statusCode"] == 202
    assert body["status"] == "review_pending"


def test_recommendation_endpoint_returns_incremented_count():
    response = handler(
        event("POST", "/decks/aws-solutions-architect-associate/recommendations"),
        None,
    )
    body = json.loads(response["body"])

    assert response["statusCode"] == 200
    assert body["recommended"] is True


def test_report_requires_reason():
    response = handler(
        event("POST", "/decks/aws-solutions-architect-associate/reports", {"reason": "x"}),
        None,
    )

    assert response["statusCode"] == 422


def test_comment_endpoint_creates_comment():
    response = handler(
        event(
            "POST",
            "/decks/aws-solutions-architect-associate/comments",
            {"author": "guest", "body": "시험 범위가 잘 맞습니다."},
        ),
        None,
    )
    body = json.loads(response["body"])

    assert response["statusCode"] == 201
    assert body["body"] == "시험 범위가 잘 맞습니다."


def test_review_queue_and_decision():
    queue_response = handler(event("GET", "/admin/review-queue"), None)
    queue_body = json.loads(queue_response["body"])

    decision_response = handler(
        event(
            "POST",
            f"/admin/review-queue/{queue_body['items'][0]['upload_id']}",
            {"decision": "approve", "note": "Looks good."},
        ),
        None,
    )
    decision_body = json.loads(decision_response["body"])

    assert queue_response["statusCode"] == 200
    assert decision_response["statusCode"] == 200
    assert decision_body["status"] == "approved"
