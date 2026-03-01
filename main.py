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

@app.get("/api/weights")
async def get_weights(distance: int = Query(..., description="Distance to first place")):
    if distance < 0:
        raise HTTPException(status_code=400, detail="Distance must be non-negative")
    
    weights = []
    total_weight = 0
    
    for item in engine.items:
        w = engine._get_weight_for_item(item, float(distance))
        if w > 0:
            weights.append({"name": item["name"], "weight": round(w, 2)})
            total_weight += w
            
    # Add percentage chance
    for item_data in weights:
        item_data["chance"] = round((item_data["weight"] / total_weight) * 100, 1) if total_weight > 0 else 0
        
    return {
        "distance": distance,
        "weights": sorted(weights, key=lambda x: x["weight"], reverse=True)
    }

@app.get("/api/config")
async def get_config():
    """Returns the full item configuration for plotting."""
    return engine.config

# Serve Static Files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join("static", "index.html"))
