from fastapi import FastAPI

from app.routers import venues_router, bet_types_router, races_router, horses_router

app = FastAPI(
    title="keiba-value-tracker API",
    description="競馬予想・購入履歴・回収率管理 API",
    version="0.1.0",
)

app.include_router(venues_router, prefix="/api/v1", tags=["venues"])
app.include_router(bet_types_router, prefix="/api/v1", tags=["bet_types"])
app.include_router(races_router, prefix="/api/v1", tags=["races"])
app.include_router(horses_router, prefix="/api/v1", tags=["horses"])


@app.get("/")
def root():
    return {"message": "keiba-value-tracker API"}
