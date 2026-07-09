from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.horse import Horse
from app.models.prediction import Prediction
from app.models.race import Race
from app.schemas.prediction import PredictionCreate, PredictionResponse, PredictionUpdate

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


@router.get(
    "/predictions/{prediction_id}",
    response_model=PredictionResponse,
    summary="予想詳細",
)
def get_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """指定予想の詳細を返す。prediction_id が存在しない場合は 404。"""
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"prediction_id={prediction_id} は存在しません",
        )
    return prediction


@router.patch(
    "/predictions/{prediction_id}",
    response_model=PredictionResponse,
    summary="予想部分更新",
)
def update_prediction(prediction_id: int, body: PredictionUpdate, db: Session = Depends(get_db)):
    """指定予想を部分更新する。
    prediction_id が存在しない場合は 404。
    horse_id を更新する場合、horse_id が存在しなければ 404、
    horse の race_id が予想の race_id と一致しなければ 400。race_id は変更不可。
    """
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"prediction_id={prediction_id} は存在しません",
        )

    updates = body.model_dump(exclude_unset=True)

    if "horse_id" in updates:
        horse = db.query(Horse).filter(Horse.id == updates["horse_id"]).first()
        if not horse:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"horse_id={updates['horse_id']} は存在しません",
            )
        if horse.race_id != prediction.race_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"horse_id={updates['horse_id']} は race_id={prediction.race_id} に紐づいていません",
            )

    for key, value in updates.items():
        setattr(prediction, key, value)

    db.commit()
    db.refresh(prediction)
    return prediction


@router.delete(
    "/predictions/{prediction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="予想削除",
)
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    """指定予想を削除する。prediction_id が存在しない場合は 404。成功時は 204 No Content。"""
    prediction = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"prediction_id={prediction_id} は存在しません",
        )
    db.delete(prediction)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
