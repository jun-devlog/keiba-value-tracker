from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.bet import Bet
from app.models.bet_type import BetType
from app.models.result import Result
from app.schemas.stat import StatsByBetTypeResponse, StatsSummaryResponse

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


@router.get(
    "/stats/by-bet-type",
    response_model=list[StatsByBetTypeResponse],
    summary="馬券種別ごとの収支サマリー取得",
)
def get_stats_by_bet_type(db: Session = Depends(get_db)):
    """馬券種別ごとの投資額・払戻額・収支・ROI・購入件数を取得する。
    馬券購入実績のない種別も含まれる（金額は0件数0として返却）。
    """
    rows = (
        db.query(
            BetType.id.label("bet_type_id"),
            BetType.name.label("bet_type_name"),
            func.sum(Bet.amount).label("total_bet"),
            func.count(Bet.id).label("bet_count"),
        )
        .outerjoin(Bet, BetType.id == Bet.bet_type_id)
        .group_by(BetType.id, BetType.name)
        .order_by(BetType.id.asc())
        .all()
    )

    response_data = []
    for row in rows:
        total_bet = row.total_bet or 0
        bet_count = row.bet_count or 0

        # 注意: MVP暫定仕様として、現状払戻金は race 単位 (results テーブル) でのみ管理しており、
        # 馬券単位 (bet) の正確な払戻を把握できないため、total_return は 0 固定とする。
        # 正確な券種別回収率は、将来 result_returns テーブルが実装された後に対応する。
        total_return = 0

        profit = total_return - total_bet
        roi = (total_return / total_bet * 100) if total_bet > 0 else None

        response_data.append({
            "bet_type_id": row.bet_type_id,
            "bet_type_name": row.bet_type_name,
            "total_bet": total_bet,
            "total_return": total_return,
            "profit": profit,
            "roi": roi,
            "bet_count": bet_count,
        })

    return response_data

