from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.bet import Bet
from app.models.race import Race
from app.models.result import Result
from app.schemas.result import ResultCreate, ResultResponse

router = APIRouter()


def _build_result_response(result: Result, db: Session) -> dict:
    """DBの Result に、計算項目 (total_bet, profit, roi) を付与した辞書を返す"""
    total_bet = db.query(func.sum(Bet.amount)).filter(Bet.race_id == result.race_id).scalar() or 0
    profit = result.total_return - total_bet
    roi = (result.total_return / total_bet * 100) if total_bet > 0 else None

    # ResultResponse のスキーマに合わせた辞書を作成
    return {
        "id": result.id,
        "race_id": result.race_id,
        "order_of_finish": result.order_of_finish,
        "total_bet": total_bet,
        "total_return": result.total_return,
        "profit": profit,
        "roi": roi,
        "created_at": result.created_at,
    }


@router.post(
    "/races/{race_id}/result",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED,
    summary="レース結果登録",
)
def create_result(race_id: int, body: ResultCreate, db: Session = Depends(get_db)):
    """指定レースに結果と払戻金を登録する。
    race_id が存在しない場合は 404。
    既に結果が存在する場合は 400 を返す（1レース1結果）。
    """
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )

    if db.query(Result).filter(Result.race_id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"race_id={race_id} には既に結果が登録されています",
        )

    result = Result(race_id=race_id, **body.model_dump())
    db.add(result)
    db.commit()
    db.refresh(result)
    
    return _build_result_response(result, db)


@router.get(
    "/races/{race_id}/result",
    response_model=ResultResponse,
    summary="レース結果取得",
)
def get_result(race_id: int, db: Session = Depends(get_db)):
    """指定レースの結果を取得する。race_id が存在しない場合は 404。
    結果が存在しない場合も 404。
    """
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )

    result = db.query(Result).filter(Result.race_id == race_id).first()
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} の結果は存在しません",
        )

    return _build_result_response(result, db)
