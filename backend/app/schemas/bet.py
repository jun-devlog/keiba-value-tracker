from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BetCreate(BaseModel):
    bet_type_id: int = Field(..., description="馬券種別 ID")
    amount: int = Field(..., description="購入金額（100円以上）", ge=100)
    combination: str = Field(..., description="買い目（例: 1-2）", max_length=255)


class BetResponse(BaseModel):
    id: int
    race_id: int
    bet_type_id: int
    amount: int
    combination: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
