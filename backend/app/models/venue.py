from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from .race import Race


class Venue(Base):
    """競馬場マスタ"""

    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    code: Mapped[str] = mapped_column(String(10), nullable=False, unique=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now(), nullable=False)

    # リレーション（Phase 4 以降で使用）
    races: Mapped[list["Race"]] = relationship("Race", back_populates="venue")

