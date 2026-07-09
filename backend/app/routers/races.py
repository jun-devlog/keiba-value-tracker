from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.race import Race
from app.models.venue import Venue
from app.schemas.race import RaceCreate, RaceResponse, RaceUpdate

router = APIRouter()


@router.post(
    "/races",
    response_model=RaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="レース登録",
)
def create_race(body: RaceCreate, db: Session = Depends(get_db)):
    """新しいレースを登録する。venue_id が存在しない場合は 404 を返す。"""
    if not db.query(Venue).filter(Venue.id == body.venue_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"venue_id={body.venue_id} は存在しません",
        )
    race = Race(**body.model_dump())
    db.add(race)
    db.commit()
    db.refresh(race)
    return race


@router.get(
    "/races",
    response_model=list[RaceResponse],
    summary="レース一覧",
)
def list_races(
    venue_id: int | None = None,
    race_date: date | None = None,
    db: Session = Depends(get_db),
):
    """レース一覧を返す。venue_id・race_date でフィルタ可能。race_date 降順 → race_number 昇順。"""
    query = db.query(Race)
    if venue_id is not None:
        query = query.filter(Race.venue_id == venue_id)
    if race_date is not None:
        query = query.filter(Race.race_date == race_date)
    return query.order_by(Race.race_date.desc(), Race.race_number.asc()).all()


@router.get(
    "/races/{race_id}",
    response_model=RaceResponse,
    summary="レース詳細",
)
def get_race(race_id: int, db: Session = Depends(get_db)):
    """指定 ID のレースを返す。存在しない場合は 404。"""
    race = db.query(Race).filter(Race.id == race_id).first()
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )
    return race


@router.patch(
    "/races/{race_id}",
    response_model=RaceResponse,
    summary="レース部分更新",
)
def update_race(race_id: int, body: RaceUpdate, db: Session = Depends(get_db)):
    """渡されたフィールドのみ更新する（PATCH）。存在しない場合は 404。"""
    race = db.query(Race).filter(Race.id == race_id).first()
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )

    updates = body.model_dump(exclude_unset=True)

    if "venue_id" in updates:
        if not db.query(Venue).filter(Venue.id == updates["venue_id"]).first():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"venue_id={updates['venue_id']} は存在しません",
            )

    for field, value in updates.items():
        setattr(race, field, value)

    db.commit()
    db.refresh(race)
    return race


@router.delete(
    "/races/{race_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="レース削除",
)
def delete_race(race_id: int, db: Session = Depends(get_db)):
    """指定 ID のレースを削除する。存在しない場合は 404。"""
    race = db.query(Race).filter(Race.id == race_id).first()
    if not race:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )
    db.delete(race)
    db.commit()
