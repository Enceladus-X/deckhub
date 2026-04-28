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
