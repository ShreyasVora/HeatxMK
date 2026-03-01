import pytest
import json
import os
from item_engine import ItemEngine

@pytest.fixture
def config_file(tmp_path):
    config = {
        "items": [
            {
                "name": "Front Only",
                "weight_curve": [[0, 100], [20, 0]]
            },
            {
                "name": "Back Only",
                "weight_curve": [[40, 0], [60, 100]]
            }
        ]
    }
    file = tmp_path / "test_config.json"
    file.write_text(json.dumps(config))
    return str(file)

def test_item_selection_structure(config_file):
    engine = ItemEngine(config_file)
    item = engine.select_item(distance=0)
    assert "name" in item
    assert item["name"] == "Front Only"

def test_impossible_items(config_file):
    engine = ItemEngine(config_file)
    
    # At distance 0, Back Only should be impossible (weight 0)
    samples_near = [engine.select_item(0)["name"] for _ in range(50)]
    assert "Back Only" not in samples_near
    assert all(s == "Front Only" for s in samples_near)
    
    # At distance 100, Front Only should be impossible (weight 0)
    samples_far = [engine.select_item(100)["name"] for _ in range(50)]
    assert "Front Only" not in samples_far
    assert all(s == "Back Only" for s in samples_far)

def test_interpolation(tmp_path):
    # Test linear interpolation between points
    config = {
        "items": [
            {"name": "Item A", "weight_curve": [[0, 100], [10, 0]]},
            {"name": "Item B", "weight_curve": [[0, 0], [10, 100]]}
        ]
    }
    file = tmp_path / "interp_config.json"
    file.write_text(json.dumps(config))
    engine = ItemEngine(str(file))
    
    # At distance 5, weights should be roughly equal (50 each)
    samples = [engine.select_item(5)["name"] for _ in range(200)]
    count_a = samples.count("Item A")
    count_b = samples.count("Item B")
    
    # Allow for some statistical variance but they should be close
    assert 70 <= count_a <= 130
    assert 70 <= count_b <= 130
