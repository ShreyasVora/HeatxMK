# Plan: Implement Item Logic and Spinner UI

## Phase 1: Backend Item Engine (FastAPI)
- [x] Task: Set up Python environment with FastAPI 8e35674
    - [x] Initialize project and `requirements.txt` with `fastapi` and `uvicorn`
    - [x] Create basic app structure (`main.py`)
- [x] Task: Implement flexible item selection logic aae9c6b
    - [x] Create `items_config.json` to store item names and base weights
    - [x] Write unit tests for the selection logic (verifying probability shifts based on distance)
    - [x] Implement `ItemEngine` class that reads from the config and selects an item
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Item Engine' (Protocol in workflow.md) 3655bf4

## Phase 2: API and Integration
- [x] Task: Create FastAPI endpoint for item retrieval bca9404
    - [x] Implement `GET /item` endpoint accepting `distance` parameter
    - [x] Add basic validation (e.g., distance must be non-negative)
- [x] Task: Conductor - User Manual Verification 'Phase 2: API and Integration' (Protocol in workflow.md) f28d101

## Phase 3: Spinner UI Implementation
- [x] Task: Create responsive Input & Spinner UI 00ef9e0
    - [x] Build minimalist HTML structure for distance input and "Spin" button
    - [x] Implement CSS for "Modern & Sleek" look (high contrast, whitespace)
- [x] Task: Implement JS Spinner Animation d596d2b
    - [x] Write JS to fetch item from FastAPI
    - [x] Create a "slot-machine" style text cycling animation
    - [x] Display the final item clearly for the user
- [x] Task: Conductor - User Manual Verification 'Phase 3: Web UI Implementation' (Protocol in workflow.md) 3c9e326
