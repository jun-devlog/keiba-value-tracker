from pydantic import BaseModel, ConfigDict, Field


class HorseCreate(BaseModel):
    post_position: int = Field(..., description="馬番", ge=1)
    horse_name: str = Field(..., description="馬名", max_length=100)
    jockey: str | None = Field(None, description="騎手名", max_length=50)
    odds: float | None = Field(None, description="単勝オッズ", ge=0)


class HorseResponse(BaseModel):
    id: int
    race_id: int
    post_position: int
    horse_name: str
    jockey: str | None
    odds: float | None

    model_config = ConfigDict(from_attributes=True)


class HorseUpdate(BaseModel):
    post_position: int | None = Field(None, description="馬番", ge=1)
    horse_name: str | None = Field(None, description="馬名", max_length=100)
    jockey: str | None = Field(None, description="騎手名", max_length=50)
    odds: float | None = Field(None, description="単勝オッズ", ge=0)
