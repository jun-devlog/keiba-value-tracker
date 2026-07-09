from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class RaceCreate(BaseModel):
    venue_id: int
    race_date: date
    race_number: int
    race_name: str | None = None
    grade: str | None = None
    distance: int | None = None
    track_type: str | None = None


class RaceUpdate(BaseModel):
    venue_id: int | None = None
    race_date: date | None = None
    race_number: int | None = None
    race_name: str | None = None
    grade: str | None = None
    distance: int | None = None
    track_type: str | None = None


class RaceResponse(BaseModel):
    id: int
    venue_id: int
    race_date: date
    race_number: int
    race_name: str | None
    grade: str | None
    distance: int | None
    track_type: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
