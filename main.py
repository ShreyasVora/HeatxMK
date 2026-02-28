from fastapi import FastAPI

app = FastAPI(title="HeatxMK API")

@app.get("/")
async def root():
    return {"message": "Welcome to HeatxMK API"}
