from fastapi import FastAPI, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from item_engine import ItemEngine
import os

app = FastAPI(title="HeatxMK API")
engine = ItemEngine()

# API Endpoints
@app.get("/api/item")
async def get_item(distance: int = Query(..., description="Distance to first place")):
    if distance < 0:
        raise HTTPException(status_code=400, detail="Distance must be non-negative")
    
    item = engine.select_item(distance)
    return {
        "name": item["name"],
        "distance_provided": distance,
        "metadata": item
    }

# Serve Static Files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join("static", "index.html"))
