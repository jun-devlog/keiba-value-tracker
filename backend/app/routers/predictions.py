from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.horse import Horse
from app.models.prediction import Prediction
from app.models.race import Race
from app.schemas.prediction import PredictionCreate, PredictionResponse

router = APIRouter()


@router.post(
    "/races/{race_id}/predictions",
    response_model=PredictionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="予想登録",
)
def create_prediction(race_id: int, body: PredictionCreate, db: Session = Depends(get_db)):
    """指定レースに予想を登録する。
    race_id が存在しない場合は 404、horse_id が存在しない場合は 404、
    horse_id が race_id に紐づかない場合は 400 を返す。
    """
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )

    horse = db.query(Horse).filter(Horse.id == body.horse_id).first()
    if not horse:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"horse_id={body.horse_id} は存在しません",
        )

    if horse.race_id != race_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"horse_id={body.horse_id} は race_id={race_id} に紐づいていません",
        )

    prediction = Prediction(race_id=race_id, **body.model_dump())
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction


@router.get(
    "/races/{race_id}/predictions",
    response_model=list[PredictionResponse],
    summary="予想一覧",
)
def list_predictions(race_id: int, db: Session = Depends(get_db)):
    """指定レースの予想一覧を返す。race_id が存在しない場合は 404。rank 昇順・id 昇順。"""
    if not db.query(Race).filter(Race.id == race_id).first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"race_id={race_id} は存在しません",
        )
    return (
        db.query(Prediction)
        .filter(Prediction.race_id == race_id)
        .order_by(Prediction.rank.asc(), Prediction.id.asc())
        .all()
    )
