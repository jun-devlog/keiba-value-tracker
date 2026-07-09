from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bet import Bet
from app.models.bet_type import BetType
from app.models.race import Race
from app.schemas.bet import BetCreate, BetResponse

router = APIRouter()


@router.post(
    "/races/{race_id}/bets",
    response_model=BetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="馬券登録",
)
def create_bet(race_id: int, body: BetCreate, db: Session = Depends(get_db)):
    """指定レースに購入馬券を登録する。
    race_id が存在しない場合は 404、bet_type_id が存在しない場合は 404 を返す。
    """
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )

    if not db.query(BetType).filter(BetType.id == body.bet_type_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"bet_type_id={body.bet_type_id} は存在しません",
        )

    bet = Bet(race_id=race_id, **body.model_dump())
    db.add(bet)
    db.commit()
    db.refresh(bet)
    return bet


@router.get(
    "/races/{race_id}/bets",
    response_model=list[BetResponse],
    summary="馬券一覧",
)
def list_bets(race_id: int, db: Session = Depends(get_db)):
    """指定レースの購入馬券一覧を返す。race_id が存在しない場合は 404。id 昇順。"""
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )
    return (
        db.query(Bet)
        .filter(Bet.race_id == race_id)
        .order_by(Bet.id.asc())
        .all()
    )
