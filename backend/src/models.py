from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


DeckStatus = Literal["draft", "published", "archived"]


class Deck(BaseModel):
    model_config = ConfigDict(extra="allow")

    deck_id: str
    slug: str
    title: str
    certification_code: str
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
    certification_code: str
    version: str
    file_name: str
    sha256: str | None = None


class UploadResult(BaseModel):
    upload_id: str
    status: Literal["review_pending"]
    title: str


class ReviewQueueItem(BaseModel):
    upload_id: str
    title: str
    category: str
    uploader: str
    risk: Literal["low", "medium", "high"]


class ModerationDecision(BaseModel):
    decision: Literal["approve", "reject"]
    note: str = ""
