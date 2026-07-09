from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Result(Base):
    """レース結果情報"""

    __tablename__ = "results"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    race_id: Mapped[int] = mapped_column(ForeignKey("races.id"), nullable=False, unique=True, index=True)
    order_of_finish: Mapped[str | None] = mapped_column(String(255), nullable=True)
    total_return: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
