# Implementation Plan: Item Image Representation

This plan covers the replacement of item names with images throughout the HeatxMK interface.

## Phase 1: Configuration & Assets Setup
Prepare the backend and configuration to support item images.

- [ ] **Task: Update Item Configuration**
    - [ ] Update `items_config.json` to include an `image_path` field for each item.
    - [ ] Add a `placeholder.png` image to `static/images/items/`.
- [ ] **Task: Update ItemEngine for Image Metadata**
    - [ ] Ensure the `/api/item` and `/api/weights` endpoints return the `image_path`.
    - [ ] Write unit tests to verify that `image_path` is correctly returned by the engine.
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Configuration & Assets Setup' (Protocol in workflow.md)**

## Phase 2: Core UI Updates (Spinner & Readout)
Transform the main spinner page to use images.

- [ ] **Task: Implement Spinner Image Logic**
    - [ ] Update the `app.js` spinner animation to cycle through images.
    - [ ] Update the final result display to show the item image.
    - [ ] Style the spinner image for consistent sizing.
- [ ] **Task: Implement Weight Readout Thumbnails**
    - [ ] Update the "Available Items" list to include a small image for each item.
    - [ ] Style the list items to accommodate the thumbnails.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Core UI Updates' (Protocol in workflow.md)**

## Phase 3: Distribution Visualization & Placeholder Fallback
Refine the analytics page and ensure robustness.

- [ ] **Task: Add Images to Distribution View**
    - [ ] Update the LHS selector to show icons next to item names.
    - [ ] Display the item image in the graph header/legend.
- [ ] **Task: Implement Image Fallback Logic**
    - [ ] Create a reusable `getImagePath` function in `app.js` that returns the placeholder if the provided path is invalid or missing.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Distribution Visualization' (Protocol in workflow.md)**

## Phase 4: Final Verification & Optimization
Perform comprehensive testing and refine the mobile experience.

- [ ] **Task: Responsive Optimization**
    - [ ] Ensure item images and thumbnails resize correctly on mobile devices.
- [ ] **Task: Final Verification**
    - [ ] Run full test suite.
    - [ ] Perform end-to-end manual check of all features.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Mobile Optimization' (Protocol in workflow.md)**
