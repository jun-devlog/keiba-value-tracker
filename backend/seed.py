"""
初期データ投入スクリプト（冪等）
実行: .venv\\Scripts\\python seed.py  （backend/ ディレクトリで実行）
"""
import sys
import os

# backend/ を sys.path に追加
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models.venue import Venue
from app.models.bet_type import BetType

VENUES = [
    {"name": "札幌", "code": "SAP"},
    {"name": "函館", "code": "HAK"},
    {"name": "福島", "code": "FUK"},
    {"name": "新潟", "code": "NII"},
    {"name": "東京", "code": "TOK"},
    {"name": "中山", "code": "NAK"},
    {"name": "中京", "code": "CHU"},
    {"name": "京都", "code": "KYO"},
    {"name": "阪神", "code": "HAN"},
    {"name": "小倉", "code": "OGU"},
]

BET_TYPES = [
    {"name": "単勝",   "code": "WIN"},
    {"name": "複勝",   "code": "PLC"},
    {"name": "枠連",   "code": "BRQ"},
    {"name": "馬連",   "code": "QNL"},
    {"name": "ワイド", "code": "WID"},
    {"name": "馬単",   "code": "EXA"},
    {"name": "三連複", "code": "TRO"},
    {"name": "三連単", "code": "TRI"},
]


def seed_model(db, model_class, records, key="code"):
    """既存レコードは key で照合してスキップ（冪等）。"""
    inserted = 0
    skipped = 0
    for data in records:
        exists = db.query(model_class).filter(
            getattr(model_class, key) == data[key]
        ).first()
        if exists:
            skipped += 1
        else:
            db.add(model_class(**data))
            inserted += 1
    db.commit()
    return inserted, skipped


def main():
    db = SessionLocal()
    try:
        print("--- venues ---")
        ins, skip = seed_model(db, Venue, VENUES)
        print(f"  inserted: {ins}, skipped: {skip}")

        print("--- bet_types ---")
        ins, skip = seed_model(db, BetType, BET_TYPES)
        print(f"  inserted: {ins}, skipped: {skip}")

        print("seed 完了")
    finally:
        db.close()


if __name__ == "__main__":
    main()
