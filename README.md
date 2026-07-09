# keiba-value-tracker

競馬の予想・購入履歴・回収率を管理するWebアプリ。

## 目的

- 予想精度と収支の可視化
- 馬券種別・競馬場ごとの回収率分析

> **禁止事項**: 必勝予想、自動購入、違法スクレイピングは対象外

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 18 + TypeScript + Vite |
| UIコンポーネント | shadcn/ui + Tailwind CSS（Phase 3〜） |
| バックエンド | FastAPI (Python 3.11+) |
| DB | SQLite |
| ORM | SQLAlchemy 2.x + Alembic |
| API通信 | TanStack Query（Phase 3〜） |

---

## セットアップ

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

確認: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

確認: http://localhost:5173

---

## ディレクトリ構成

```
keiba-value-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI エントリポイント
│   │   ├── database.py      # SQLAlchemy エンジン
│   │   ├── models/          # SQLAlchemy モデル
│   │   ├── schemas/         # Pydantic スキーマ
│   │   └── routers/         # FastAPI ルーター
│   ├── alembic/             # マイグレーション
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## 開発フェーズ

| Phase | 内容 |
|---|---|
| 1 | プロジェクト骨格（現在） |
| 2 | DB & API 基盤（SQLAlchemy + Alembic） |
| 3 | マスタ API + フロントベース |
| 4 | レース・出走馬 CRUD |
| 5 | 予想入力・購入入力 |
| 6 | 結果入力・払戻計算 |
| 7 | 統計・ダッシュボード |
| 8 | UI ポリッシュ・レスポンシブ |
