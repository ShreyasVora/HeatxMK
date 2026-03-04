from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_item_valid():
    response = client.get("/api/item?distance=10")
    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert "distance_provided" in data
    assert data["distance_provided"] == 10
    # Description should be present in metadata
    assert "description" in data["metadata"]
    assert isinstance(data["metadata"]["description"], str)

def test_get_item_negative_distance():
    response = client.get("/api/item?distance=-5")
    # We expect a 400 Bad Request for negative distance
    assert response.status_code == 400
    assert response.json()["detail"] == "Distance must be non-negative"

def test_get_item_invalid_type():
    response = client.get("/api/item?distance=abc")
    # FastAPI automatically returns 422 for type mismatch
    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "Input should be a valid integer, unable to parse string as an integer"

def test_get_weights_valid():
    response = client.get("/api/weights?distance=0")
    assert response.status_code == 200
    data = response.json()
    assert "distance" in data
    assert "weights" in data
    assert isinstance(data["weights"], list)
    # At distance 0, weights list should not be empty
    assert len(data["weights"]) > 0
    # Check that percentages sum close to 100
    total_chance = sum(item["chance"] for item in data["weights"])
    assert 99 <= total_chance <= 101

def test_get_config():
    response = client.get("/api/config")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) > 0
    assert "weight_curve" in data["items"][0]
    assert "description" in data["items"][0]
