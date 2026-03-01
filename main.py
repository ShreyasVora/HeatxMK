from fastapi import FastAPI, Query, HTTPException
from item_engine import ItemEngine

app = FastAPI(title="HeatxMK API")
engine = ItemEngine()

@app.get("/")
async def root():
    return {"message": "Welcome to HeatxMK API"}

@app.get("/item")
async def get_item(distance: int = Query(..., description="Distance to first place")):
    if distance < 0:
        raise HTTPException(status_code=400, detail="Distance must be non-negative")
    
    item = engine.select_item(distance)
    return {
        "name": item["name"],
        "distance_provided": distance,
        "metadata": item
    }
