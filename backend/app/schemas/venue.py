from pydantic import BaseModel, ConfigDict


class VenueResponse(BaseModel):
    id: int
    name: str
    code: str

    model_config = ConfigDict(from_attributes=True)
