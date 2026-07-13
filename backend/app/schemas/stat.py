from pydantic import BaseModel


class StatsSummaryResponse(BaseModel):
    total_bet: int
    total_return: int
    profit: int
    roi: float | None
    race_count: int
    hit_count: int


class StatsByBetTypeResponse(BaseModel):
    bet_type_id: int
    bet_type_name: str
    total_bet: int
    total_return: int
    profit: int
    roi: float | None
    bet_count: int

