import json
import random
import math

class ItemEngine:
    def __init__(self, config_path="items_config.json"):
        with open(config_path, "r") as f:
            self.config = json.load(f)
        self.items = self.config["items"]

    def select_item(self, distance: int):
        weighted_items = []
        for item in self.items:
            # Multiplicative scaling for more dramatic shifts
            # Weight = base * (multiplier ^ (distance / 10))
            # If multiplier > 1, weight grows with distance
            # If multiplier < 1, weight shrinks with distance
            multiplier = item.get("distance_multiplier", 1.0)
            weight = item["base_weight"] * math.pow(multiplier, distance / 10.0)
            weighted_items.append((item, max(0.01, weight)))

        total_weight = sum(w for _, w in weighted_items)
        r = random.uniform(0, total_weight)
        upto = 0
        for item, weight in weighted_items:
            if upto + weight >= r:
                return item
            upto += weight
        
        return self.items[-1]
