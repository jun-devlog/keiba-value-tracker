from datetime import date, datetime

from sqlalchemy import Date, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Race(Base):
    """レース基本情報"""

    __tablename__ = "races"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), nullable=False, index=True)
    race_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    race_number: Mapped[int] = mapped_column(Integer, nullable=False)
    race_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    grade: Mapped[str | None] = mapped_column(String(10), nullable=True)
    distance: Mapped[int | None] = mapped_column(Integer, nullable=True)
    track_type: Mapped[str | None] = mapped_column(String(10), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now(), nullable=False)

    # リレーション（Phase 4 以降で使用）
    venue = relationship("Venue", back_populates="races")
    horses = relationship("Horse", back_populates="race", cascade="all, delete-orphan")
