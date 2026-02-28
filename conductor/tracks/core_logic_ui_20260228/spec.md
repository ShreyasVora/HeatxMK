# Specification: HeatxMK Core Logic and Spinner UI

## Overview
This track implements the "Mario Kart" item randomization logic for *Heat: Pedal to the Metal*. The engine must be highly flexible to allow for post-playtest tuning of item probabilities.

## Functional Requirements
- **Primary Input:** A single field for "Distance to First Place" (integer).
- **Flexible Item Engine:**
    - Item definitions and probability weightings must be decoupled from logic (e.g., stored in a JSON configuration).
    - Probabilities must be calculated based on the distance input.
- **Spinner UI:**
    - A minimalist web interface with a "Spin" button.
    - A visual "cycling" animation that lands on a clear, high-contrast item name.
- **Backend API:** A FastAPI endpoint `GET /get-item?distance=X` that returns the selected item and its metadata.

## Technical Constraints
- **Backend:** Python 3.9 (FastAPI).
- **Frontend:** Vanilla HTML5/CSS/JS (Modern & Sleek).
- **Configuration:** Externalized item/probability weights for easy editing.
