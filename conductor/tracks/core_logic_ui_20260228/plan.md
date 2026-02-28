# Plan: Implement Item Logic and Spinner UI

## Phase 1: Backend Item Engine (FastAPI)
- [ ] Task: Set up Python environment with FastAPI
    - [ ] Initialize project and `requirements.txt` with `fastapi` and `uvicorn`
    - [ ] Create basic app structure (`main.py`)
- [ ] Task: Implement flexible item selection logic
    - [ ] Create `items_config.json` to store item names and base weights
    - [ ] Write unit tests for the selection logic (verifying probability shifts based on distance)
    - [ ] Implement `ItemEngine` class that reads from the config and selects an item
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend Item Engine' (Protocol in workflow.md)

## Phase 2: API and Integration
- [ ] Task: Create FastAPI endpoint for item retrieval
    - [ ] Implement `GET /item` endpoint accepting `distance` parameter
    - [ ] Add basic validation (e.g., distance must be non-negative)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: API and Integration' (Protocol in workflow.md)

## Phase 3: Spinner UI Implementation
- [ ] Task: Create responsive Input & Spinner UI
    - [ ] Build minimalist HTML structure for distance input and "Spin" button
    - [ ] Implement CSS for "Modern & Sleek" look (high contrast, whitespace)
- [ ] Task: Implement JS Spinner Animation
    - [ ] Write JS to fetch item from FastAPI
    - [ ] Create a "slot-machine" style text cycling animation
    - [ ] Display the final item clearly for the user
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Web UI Implementation' (Protocol in workflow.md)
