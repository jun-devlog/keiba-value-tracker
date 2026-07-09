from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.horse import Horse
from app.models.race import Race
from app.schemas.horse import HorseCreate, HorseResponse, HorseUpdate

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


@router.get(
    "/horses/{horse_id}",
    response_model=HorseResponse,
    summary="出走馬詳細",
)
def get_horse(horse_id: int, db: Session = Depends(get_db)):
    """指定 ID の出走馬を返す。存在しない場合は 404。"""
    horse = db.query(Horse).filter(Horse.id == horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"horse_id={horse_id} は存在しません",
        )
    return horse


@router.patch(
    "/horses/{horse_id}",
    response_model=HorseResponse,
    summary="出走馬部分更新",
)
def update_horse(horse_id: int, body: HorseUpdate, db: Session = Depends(get_db)):
    """渡されたフィールドのみ更新する（PATCH）。存在しない場合は 404。"""
    horse = db.query(Horse).filter(Horse.id == horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"horse_id={horse_id} は存在しません",
        )
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(horse, field, value)
    db.commit()
    db.refresh(horse)
    return horse


@router.delete(
    "/horses/{horse_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="出走馬削除",
)
def delete_horse(horse_id: int, db: Session = Depends(get_db)):
    """指定 ID の出走馬を削除する。存在しない場合は 404。"""
    horse = db.query(Horse).filter(Horse.id == horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"horse_id={horse_id} は存在しません",
        )
    db.delete(horse)
    db.commit()
