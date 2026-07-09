from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PredictionCreate(BaseModel):
    horse_id: int = Field(..., description="出走馬 ID")
    rank: int | None = Field(None, description="予想順位", ge=1)
    confidence: float | None = Field(None, description="自信度（0.0〜1.0）", ge=0.0, le=1.0)
    memo: str | None = Field(None, description="メモ", max_length=255)


class PredictionResponse(BaseModel):
    id: int
    race_id: int
    horse_id: int
    rank: int | None
    confidence: float | None
    memo: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
