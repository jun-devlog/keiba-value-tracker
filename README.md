# keiba-value-tracker

競馬データ分析・収支管理アプリ（バックエンド MVP）

自身の競馬予想のプロセスや過去の成績（収支・回収率）を記録し、客観的に分析・管理するためのアプリケーションです。

## アプリの目的
自身の予想とその結果を一元管理し、振り返りを行いやすくすることを目的としています。

> [!WARNING]
> **対象外の機能**  
> 本アプリはあくまで「データの記録・分析」を目的としています。以下のような機能は**対象外**です。
> - 必ず利益が出るような「必勝予想」の提供
> - 競馬サイトからのオッズ等の自動スクレイピング
> - 実際の馬券の自動購入

## 技術スタック
- **Language**: Python 3.11+
- **Framework**: FastAPI
- **Database**: SQLite
- **ORM / Migration**: SQLAlchemy, Alembic

## 主な機能 (MVPでできること)
MVP（Minimum Viable Product）フェーズの現在、以下の機能がAPI経由で利用可能です。
- 開催場所・券種マスタの取得
- レース情報と出走馬の管理（登録・取得・削除）
- ユーザーの予想の管理（自信度・メモ・予想印の記録）
- 馬券購入履歴の記録
- レース結果・払戻金の登録
- 全体の収支サマリー取得（投資額、払戻額、回収率、的中数など）
- 券種ごとの購入件数・投資額の集計

## API一覧
アプリ起動後、Swagger UI (`http://localhost:8000/docs`) にて詳細な仕様を確認できます。
主なエンドポイント：
- `/api/v1/venues/` (GET)
- `/api/v1/bet_types/` (GET)
- `/api/v1/races/` (GET, POST, GET/{race_id}, PATCH, DELETE)
- `/api/v1/races/{race_id}/horses/` (GET, POST)
- `/api/v1/horses/{horse_id}` (GET, PATCH, DELETE)
- `/api/v1/races/{race_id}/predictions` (GET, POST)
- `/api/v1/predictions/{prediction_id}` (GET, PATCH, DELETE)
- `/api/v1/races/{race_id}/bets` (GET, POST)
- `/api/v1/bets/{bet_id}` (GET, PATCH, DELETE)
- `/api/v1/races/{race_id}/result` (GET, POST)
- `/api/v1/results/{result_id}` (PATCH, DELETE)
- `/api/v1/stats/summary` (GET)
- `/api/v1/stats/by-bet-type` (GET)

## DBテーブル概要
- `venues`: 開催場所マスタ
- `bet_types`: 券種マスタ
- `races`: レース情報
- `horses`: 出走馬情報
- `predictions`: 予想情報
- `bets`: 馬券購入情報
- `results`: レース結果・払戻金情報

## セットアップ手順
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows の場合
# source .venv/bin/activate    # Mac/Linux の場合
pip install -r requirements.txt
```

## データベースの構築とSeed実行方法
Alembicを用いてデータベーススキーマを作成し、初期マスタデータ（会場・券種など）を投入します。
```bash
cd backend
# マイグレーションの実行
alembic upgrade head

# 初期データ（Seed）の投入
python seed.py
```

## 起動方法
```bash
cd backend
# 開発用サーバーの起動
uvicorn app.main:app --reload
```
起動後、ブラウザで `http://localhost:8000/docs` にアクセスすると Swagger UI を確認できます。

## `requests.http` の使い方
VS Code拡張機能「REST Client」用のテストファイル `backend/requests.http` を同梱しています。
1. アプリを起動した状態で `requests.http` を開きます。
2. ファイル内の `Send Request` リンクをクリックすると、各APIエンドポイントの動作確認（CRUDや集計など）を手軽に行うことができます。
3. 一部のエンドポイントは変数（`@raceId`, `@horseId` など）を使用しています。必要に応じてファイル先頭の変数定義を書き換えてテストしてください。

## 今後の拡張予定
- **券種別回収率の正確な算出**: 
  現在、払戻金はレース単位（`results`テーブル）で管理しています。馬券単位（`bets`テーブル）の払戻金データ構造（`result_returns`）が未実装のため、MVPの現状では `/api/v1/stats/by-bet-type` の払戻金（`total_return`）は一律 `0` を返す暫定仕様となっています。今後の機能追加で正確な券種別回収率を実装予定です。
- フロントエンドWebアプリケーションの構築
- 過去データのインポート機能
