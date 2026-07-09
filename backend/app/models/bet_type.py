from datetime import datetime

from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BetType(Base):
    """馬券種別マスタ（単勝・複勝・馬連 等）"""

    __tablename__ = "bet_types"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    code: Mapped[str] = mapped_column(String(10), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now(), nullable=False)
