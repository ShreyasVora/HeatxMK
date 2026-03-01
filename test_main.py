from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_item_valid():
    response = client.get("/item?distance=10")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "distance_provided" in data
    assert data["distance_provided"] == 10

def test_get_item_negative_distance():
    response = client.get("/item?distance=-5")
    # We expect a 400 Bad Request for negative distance
    assert response.status_code == 400
    assert response.json()["detail"] == "Distance must be non-negative"

def test_get_item_invalid_type():
    response = client.get("/item?distance=abc")
    # FastAPI automatically returns 422 for type mismatch
    assert response.status_code == 422
