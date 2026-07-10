from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.bet import Bet
from app.models.result import Result
from app.schemas.stat import StatsSummaryResponse

router = APIRouter()


@router.get(
    "/stats/summary",
    response_model=StatsSummaryResponse,
    summary="収支サマリー取得",
)
def get_stats_summary(db: Session = Depends(get_db)):
    """ダッシュボード表示用に、全体の収支サマリーを取得する。"""
    
    total_bet = db.query(func.sum(Bet.amount)).scalar() or 0
    total_return = db.query(func.sum(Result.total_return)).scalar() or 0
    race_count = db.query(func.count(Result.id)).scalar() or 0
    hit_count = db.query(func.count(Result.id)).filter(Result.total_return > 0).scalar() or 0

    profit = total_return - total_bet
    roi = (total_return / total_bet * 100) if total_bet > 0 else None

    return {
        "total_bet": total_bet,
        "total_return": total_return,
        "profit": profit,
        "roi": roi,
        "race_count": race_count,
        "hit_count": hit_count,
    }
