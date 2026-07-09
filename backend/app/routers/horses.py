from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.horse import Horse
from app.models.race import Race
from app.schemas.horse import HorseCreate, HorseResponse

router = APIRouter()


@router.post(
    "/races/{race_id}/horses",
    response_model=HorseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="出走馬登録",
)
def create_horse(race_id: int, body: HorseCreate, db: Session = Depends(get_db)):
    """指定レースに出走馬を登録する。race_id が存在しない場合は 404 を返す。"""
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )
    horse = Horse(race_id=race_id, **body.model_dump())
    db.add(horse)
    db.commit()
    db.refresh(horse)
    return horse


@router.get(
    "/races/{race_id}/horses",
    response_model=list[HorseResponse],
    summary="出走馬一覧",
)
def list_horses(race_id: int, db: Session = Depends(get_db)):
    """指定レースの出走馬一覧を返す。race_id が存在しない場合は 404。post_position 昇順。"""
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )
    return (
        db.query(Horse)
        .filter(Horse.race_id == race_id)
        .order_by(Horse.post_position.asc())
        .all()
    )
