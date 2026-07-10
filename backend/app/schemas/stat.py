from pydantic import BaseModel


class StatsSummaryResponse(BaseModel):
    total_bet: int
    total_return: int
    profit: int
    roi: float | None
    race_count: int
    hit_count: int
