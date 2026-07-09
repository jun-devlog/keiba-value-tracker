from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bet import Bet
from app.models.bet_type import BetType
from app.models.race import Race
from app.schemas.bet import BetCreate, BetResponse, BetUpdate

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


@router.get(
    "/bets/{bet_id}",
    response_model=BetResponse,
    summary="馬券詳細",
)
def get_bet(bet_id: int, db: Session = Depends(get_db)):
    """指定馬券の詳細を返す。bet_id が存在しない場合は 404。"""
    bet = db.query(Bet).filter(Bet.id == bet_id).first()
    if not bet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"bet_id={bet_id} は存在しません",
        )
    return bet


@router.patch(
    "/bets/{bet_id}",
    response_model=BetResponse,
    summary="馬券部分更新",
)
def update_bet(bet_id: int, body: BetUpdate, db: Session = Depends(get_db)):
    """指定馬券を部分更新する。
    bet_id が存在しない場合は 404。
    bet_type_id を更新する場合、bet_type_id が存在しなければ 404。
    race_id は変更不可。
    """
    bet = db.query(Bet).filter(Bet.id == bet_id).first()
    if not bet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"bet_id={bet_id} は存在しません",
        )

    updates = body.model_dump(exclude_unset=True)

    if "bet_type_id" in updates:
        bet_type = db.query(BetType).filter(BetType.id == updates["bet_type_id"]).first()
        if not bet_type:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"bet_type_id={updates['bet_type_id']} は存在しません",
            )

    for key, value in updates.items():
        setattr(bet, key, value)

    db.commit()
    db.refresh(bet)
    return bet


@router.delete(
    "/bets/{bet_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="馬券削除",
)
def delete_bet(bet_id: int, db: Session = Depends(get_db)):
    """指定馬券を削除する。bet_id が存在しない場合は 404。成功時は 204 No Content。"""
    bet = db.query(Bet).filter(Bet.id == bet_id).first()
    if not bet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"bet_id={bet_id} は存在しません",
        )
    db.delete(bet)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
