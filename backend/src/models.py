from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


DeckStatus = Literal["draft", "published", "archived"]
TemplateTone = Literal["clinical", "exam", "dark"]
TemplateStatus = Literal["published", "review_pending", "archived"]


def _validate_template_html(value: str) -> str:
    lowered = value.lower()
    if "<script" in lowered or "javascript:" in lowered:
        raise ValueError("Template HTML must not contain scripts.")
    return value


def _validate_template_css(value: str) -> str:
    lowered = value.lower()
    blocked_tokens = ["<script", "javascript:", "@import"]
    if any(token in lowered for token in blocked_tokens):
        raise ValueError("Template CSS must not contain scripts or external imports.")
    return value


class Deck(BaseModel):
    model_config = ConfigDict(extra="allow")

    deck_id: str
    slug: str
    title: str
    latest_version_id: str | None = None
    status: DeckStatus = "draft"


class DeckVersion(BaseModel):
    model_config = ConfigDict(extra="allow")

    deck_id: str
    version: str
    version_id: str
    s3_key: str
    sha256: str
    file_size: int = Field(ge=0)
    published_at: str
    changelog: str = ""
    is_latest: bool = False


class DownloadToken(BaseModel):
    url: str
    expires_at: int
    version_id: str


class RecommendationResult(BaseModel):
    slug: str
    recommendations: int
    recommended: bool = True


class ReportRequest(BaseModel):
    reason: str = Field(min_length=2, max_length=200)


class ReportResult(BaseModel):
    slug: str
    status: Literal["accepted"]


class CommentRequest(BaseModel):
    body: str = Field(min_length=1, max_length=600)
    author: str = Field(default="guest", max_length=40)


class CommentResult(BaseModel):
    id: str
    author: str
    body: str
    created_at: str
    helpful_count: int = 0


class UploadRequest(BaseModel):
    title: str = Field(min_length=2, max_length=120)
    category: str
    version: str
    file_name: str
    sha256: str | None = None


class UploadResult(BaseModel):
    upload_id: str
    status: Literal["review_pending"]
    title: str


class CardTemplate(BaseModel):
    model_config = ConfigDict(extra="allow")

    template_id: str
    name: str
    author: str
    summary: str
    tone: TemplateTone
    recommendations: int = Field(default=0, ge=0)
    downloads: int = Field(default=0, ge=0)
    front_html: str = Field(min_length=20, max_length=5000)
    back_html: str = Field(min_length=20, max_length=5000)
    css: str = Field(min_length=20, max_length=12000)
    status: TemplateStatus = "published"

    @field_validator("front_html", "back_html")
    @classmethod
    def validate_html(cls, value: str) -> str:
        return _validate_template_html(value)

    @field_validator("css")
    @classmethod
    def validate_css(cls, value: str) -> str:
        return _validate_template_css(value)


class TemplateSubmissionRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    author: str = Field(default="guest", min_length=2, max_length=40)
    summary: str = Field(min_length=10, max_length=240)
    tone: TemplateTone = "clinical"
    front_html: str = Field(min_length=20, max_length=5000)
    back_html: str = Field(min_length=20, max_length=5000)
    css: str = Field(min_length=20, max_length=12000)

    @field_validator("front_html", "back_html")
    @classmethod
    def validate_html(cls, value: str) -> str:
        return _validate_template_html(value)

    @field_validator("css")
    @classmethod
    def validate_css(cls, value: str) -> str:
        return _validate_template_css(value)


class TemplateSubmissionResult(BaseModel):
    template_id: str
    status: Literal["review_pending"]
    name: str


class ReviewQueueItem(BaseModel):
    upload_id: str
    title: str
    category: str
    uploader: str
    risk: Literal["low", "medium", "high"]


class ModerationDecision(BaseModel):
    decision: Literal["approve", "reject"]
    note: str = ""
