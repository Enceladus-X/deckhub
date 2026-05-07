SAMPLE_DECKS = [
    {
        "deck_id": "deck_aws_saa_c03",
        "slug": "aws-solutions-architect-associate",
        "title": "AWS Solutions Architect Associate",
        "latest_version_id": "ver_aws_saa_c03_2026_04",
        "status": "published",
    },
    {
        "deck_id": "deck_aws_soa_c03",
        "slug": "aws-sysops-administrator-associate",
        "title": "AWS SysOps Administrator Associate",
        "latest_version_id": "ver_aws_soa_c03_2026_03",
        "status": "published",
    },
]

SAMPLE_VERSIONS = [
    {
        "deck_id": "deck_aws_saa_c03",
        "version": "2026.04",
        "version_id": "ver_aws_saa_c03_2026_04",
        "s3_key": "decks/deck_aws_saa_c03/2026.04/sample-sha256.apkg",
        "sha256": "sample-sha256",
        "file_size": 25165824,
        "published_at": "2026-04-27T00:00:00Z",
        "changelog": "Initial portfolio seed version.",
        "is_latest": True,
    }
]

SAMPLE_REVIEW_QUEUE = [
    {
        "upload_id": "upload-20260501-001",
        "title": "정보보안기사 필기 요약 덱",
        "category": "IT",
        "uploader": "sec-study",
        "risk": "medium",
    },
    {
        "upload_id": "upload-20260501-002",
        "title": "소방설비기사 전기분야",
        "category": "안전",
        "uploader": "fire-note",
        "risk": "low",
    },
]

SAMPLE_CARD_TEMPLATES = [
    {
        "template_id": "clean-review",
        "name": "Clean Review",
        "author": "DeckHub",
        "summary": "A calm default template for certification terminology and short answers.",
        "tone": "clinical",
        "recommendations": 148,
        "downloads": 932,
        "front_html": '<div class="deckhub-card"><p class="deckhub-card__label">Question</p><h1 class="deckhub-card__question">{{Front}}</h1><footer>{{DeckTitle}} · v{{Version}}</footer></div>',
        "back_html": '<div class="deckhub-card"><p class="deckhub-card__label">Answer</p><h1 class="deckhub-card__answer">{{Back}}</h1><p class="deckhub-card__note">{{Extra}}</p><footer>{{DeckTitle}} · v{{Version}}</footer></div>',
        "css": ".deckhub-card { min-height: 360px; border: 1px solid #d4d4d8; border-radius: 8px; background: #ffffff; color: #18181b; } .deckhub-card__label { color: #0f766e; font-weight: 800; } .deckhub-card__question { font-size: 30px; font-weight: 800; } .deckhub-card__answer { font-size: 22px; font-weight: 700; }",
        "status": "published",
    },
    {
        "template_id": "exam-contrast",
        "name": "Exam Contrast",
        "author": "study-lab",
        "summary": "A high-contrast template for formulas, statutes, and last-minute review.",
        "tone": "exam",
        "recommendations": 96,
        "downloads": 544,
        "front_html": '<div class="deckhub-card"><p class="deckhub-card__label">EXAM PROMPT</p><h1 class="deckhub-card__question">{{Front}}</h1><footer>{{Category}} · {{DeckTitle}}</footer></div>',
        "back_html": '<div class="deckhub-card"><p class="deckhub-card__label">KEY ANSWER</p><h1 class="deckhub-card__answer">{{Back}}</h1><p class="deckhub-card__note">{{Extra}}</p><footer>Updated v{{Version}}</footer></div>',
        "css": ".deckhub-card { min-height: 360px; border: 1px solid #f59e0b; border-radius: 8px; background: #fffbeb; color: #1c1917; } .deckhub-card__label { color: #b45309; font-weight: 900; } .deckhub-card__question { font-size: 32px; font-weight: 900; } .deckhub-card__answer { font-size: 23px; font-weight: 800; }",
        "status": "published",
    },
]
