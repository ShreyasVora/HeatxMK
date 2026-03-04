# Implementation Plan: Item Descriptions

This plan covers the addition of descriptive metadata for items and its display across the Spinner and Distributions views.

## Phase 1: Data & API Setup [checkpoint: df8a1fc]
Update the item configuration and verify that the description metadata is correctly exposed via the API.

- [x] **Task: Update Item Configuration** (b79f296)
    - [x] Add a `"description"` field to all items in `items_config.json` with HTML content.
- [x] **Task: Verify API Response** (b79f296)
    - [x] Write a test in `test_main.py` to ensure the `description` field is present in the `/api/item` and `/api/config` responses.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Data & API Setup' (Protocol in workflow.md)** (df8a1fc)

## Phase 2: Spinner Page Implementation
Add the info panel to the main spinner page and display the description after a successful spin.

- [x] **Task: Create Info Panel UI** (d22a153)
    - [x] Add a container `<div id="item-info-panel">` to `index.html` within the spinner section.
    - [x] Style the panel in `style.css` (initially hidden, clean typography, neutral background).
- [x] **Task: Implement Selection Reveal Logic** (39f0d9e)
    - [x] Update `app.js` in the `finalizeSpin` function to populate the info panel with the item's description.
    - [x] Add a transition effect to show the panel once the spin is complete.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Spinner Page Implementation' (Protocol in workflow.md)**

## Phase 3: Distributions Page Implementation
Add the description readout below the weight distribution graph.

- [ ] **Task: Create Description Container**
    - [ ] Add a container `<div id="chart-description">` below the canvas in the distributions section of `index.html`.
    - [ ] Style the container for readability.
- [ ] **Task: Implement Selective Readout Logic**
    - [ ] Update the `renderCurve` function in `app.js` to populate the description container whenever a new item is selected.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Distributions Page Implementation' (Protocol in workflow.md)**

## Phase 4: Final Polishing & Verification
Ensure a cohesive user experience and mobile compatibility.

- [ ] **Task: UI Refinement**
    - [ ] Ensure consistent spacing and responsive behavior for the new text blocks.
    - [ ] Handle the case where an item might have a missing description.
- [ ] **Task: Final Verification**
    - [ ] Perform a full walkthrough of both views to ensure descriptions display as expected.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Verification' (Protocol in workflow.md)**
