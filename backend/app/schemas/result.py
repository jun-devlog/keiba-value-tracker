from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResultCreate(BaseModel):
    order_of_finish: str | None = Field(None, description="確定着順", max_length=255)
    total_return: int = Field(..., description="払戻金合計", ge=0)


class ResultResponse(BaseModel):
    id: int
    race_id: int
    order_of_finish: str | None
    total_bet: int
    total_return: int
    profit: int
    roi: float | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
