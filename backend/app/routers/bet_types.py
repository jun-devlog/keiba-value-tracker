from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bet_type import BetType
from app.schemas.bet_type import BetTypeResponse

router = APIRouter()


@router.get("/bet_types", response_model=list[BetTypeResponse], summary="馬券種別マスタ一覧")
def list_bet_types(db: Session = Depends(get_db)):
    """登録済みの馬券種別マスタを id 昇順で返す。"""
    return db.query(BetType).order_by(BetType.id).all()
