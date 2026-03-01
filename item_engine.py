import json
import random

class ItemEngine:
    def __init__(self, config_path="items_config.json"):
        with open(config_path, "r") as f:
            self.config = json.load(f)
        self.items = self.config["items"]

    def _get_weight_for_item(self, item, distance: float) -> float:
        """Calculates weight based on piecewise linear curve."""
        curve = item.get("weight_curve", [])
        if not curve:
            return 0.0
        
        # 1. Handle distance before first point
        if distance <= curve[0][0]:
            return float(curve[0][1])
        
        # 2. Handle distance after last point
        if distance >= curve[-1][0]:
            return float(curve[-1][1])
        
        # 3. Find segments and interpolate
        for i in range(len(curve) - 1):
            p1, p2 = curve[i], curve[i+1]
            if p1[0] <= distance <= p2[0]:
                # Linear Interpolation (lerp)
                t = (distance - p1[0]) / (p2[0] - p1[0])
                return float(p1[1] + t * (p2[1] - p1[1]))
                
        return 0.0

    def select_item(self, distance: int):
        weighted_items = []
        for item in self.items:
            weight = self._get_weight_for_item(item, float(distance))
            # We only add items that have a probability greater than 0
            if weight > 0:
                weighted_items.append((item, weight))

        if not weighted_items:
            # Fallback if distance is outside all curves (should be rare)
            return self.items[0]

        total_weight = sum(w for _, w in weighted_items)
        r = random.uniform(0, total_weight)
        upto = 0
        for item, weight in weighted_items:
            if upto + weight >= r:
                return item
            upto += weight
        
        return weighted_items[-1][0]
