import pytest
import json
import os
from item_engine import ItemEngine

@pytest.fixture
def config_file(tmp_path):
    config = {
        "items": [
            {"name": "Common Item", "base_weight": 100, "distance_multiplier": 0.1},
            {"name": "Rare Item", "base_weight": 10, "distance_multiplier": 2.0}
        ]
    }
    file = tmp_path / "test_config.json"
    file.write_text(json.dumps(config))
    return str(file)

def test_item_selection_structure(config_file):
    engine = ItemEngine(config_file)
    item = engine.select_item(distance=0)
    assert "name" in item
    assert item["name"] in ["Common Item", "Rare Item"]

def test_distance_impact(config_file):
    engine = ItemEngine(config_file)
    
    # At distance 0, Common Item should be very likely
    samples_near = [engine.select_item(0)["name"] for _ in range(100)]
    common_count_near = samples_near.count("Common Item")
    
    # At distance 100, Rare Item should become much more likely
    samples_far = [engine.select_item(100)["name"] for _ in range(100)]
    rare_count_far = samples_far.count("Rare Item")
    
    assert common_count_near > 50
    assert rare_count_far > common_count_near # Rare item weight increases with distance
