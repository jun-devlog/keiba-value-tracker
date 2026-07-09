from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.venue import Venue
from app.schemas.venue import VenueResponse

router = APIRouter()


@router.get("/venues", response_model=list[VenueResponse], summary="競馬場マスタ一覧")
def list_venues(db: Session = Depends(get_db)):
    """登録済みの競馬場マスタを id 昇順で返す。"""
    return db.query(Venue).order_by(Venue.id).all()
