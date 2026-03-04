# Implementation Plan: Item Image Representation

This plan covers the replacement of item names with images throughout the HeatxMK interface.

## Phase 1: Configuration & Assets Setup [checkpoint: 92de3cc]
Prepare the backend and configuration to support item images.

- [x] **Task: Update Item Configuration** (6053c72)
    - [x] Update `items_config.json` to include an `image_path` field for each item.
    - [ ] Add a `placeholder.png` image to `static/images/items/`.
- [x] **Task: Update ItemEngine for Image Metadata** (0122ae1)
    - [x] Ensure the `/api/item` and `/api/weights` endpoints return the `image_path`.
    - [x] Write unit tests to verify that `image_path` is correctly returned by the engine.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Configuration & Assets Setup' (Protocol in workflow.md)** (92de3cc)

## Phase 2: Core UI Updates (Spinner & Readout) [checkpoint: 34a7c7d]
Transform the main spinner page to use images.

- [x] **Task: Implement Spinner Image Logic** (ad52711)
    - [x] Update the `app.js` spinner animation to cycle through images.
    - [x] Update the final result display to show the item image.
    - [x] Style the spinner image for consistent sizing.
- [x] **Task: Implement Weight Readout Thumbnails** (9ebfbc6)
    - [x] Update the "Available Items" list to include a small image for each item.
    - [x] Style the list items to accommodate the thumbnails.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Core UI Updates' (Protocol in workflow.md)** (34a7c7d)

## Phase 3: Distribution Visualization & Placeholder Fallback
Refine the analytics page and ensure robustness.

- [x] **Task: Add Images to Distribution View** (be27c84)
    - [x] Update the LHS selector to show icons next to item names.
    - [x] Display the item image in the graph header/legend.
- [x] **Task: Implement Image Fallback Logic** (be27c84)
    - [x] Create a reusable `getImagePath` function in `app.js` that returns the placeholder if the provided path is invalid or missing.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Distribution Visualization' (Protocol in workflow.md)**

## Phase 4: Final Verification & Optimization
Perform comprehensive testing and refine the mobile experience.

- [ ] **Task: Responsive Optimization**
    - [ ] Ensure item images and thumbnails resize correctly on mobile devices.
- [ ] **Task: Final Verification**
    - [ ] Run full test suite.
    - [ ] Perform end-to-end manual check of all features.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Mobile Optimization' (Protocol in workflow.md)**
