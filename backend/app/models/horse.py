from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Horse(Base):
    """出走馬情報（レースに紐付く）"""

    __tablename__ = "horses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    race_id: Mapped[int] = mapped_column(ForeignKey("races.id"), nullable=False, index=True)
    post_position: Mapped[int] = mapped_column(Integer, nullable=False)
    horse_name: Mapped[str] = mapped_column(String(100), nullable=False)
    jockey: Mapped[str | None] = mapped_column(String(50), nullable=True)
    odds: Mapped[float | None] = mapped_column(Float, nullable=True)

    # リレーション（Phase 4 以降で使用）
    race = relationship("Race", back_populates="horses")
