# Implementation Plan: UI Revamp & Distribution Visualization

This plan covers the transformation of the HeatxMK web interface into a multi-tabbed SPA with real-time analytics and item weight visualization.

## Phase 1: SPA Foundation & Navigation [checkpoint: f509b66]
This phase focuses on restructuring the existing `index.html` and `app.js` to support tabbed navigation.

- [x] **Task: Define SPA Structure in HTML** (6f60192)
    - [ ] Create a `<nav>` element with buttons for "Spinner" and "Distributions".
    - [ ] Wrap existing spinner content in a `<section id="view-spinner">`.
    - [ ] Create an empty `<section id="view-distributions" style="display:none">`.
- [x] **Task: Implement Tab Switching Logic** (e5347cc)
    - [ ] Write tests in `static/test_app.js` (or similar) to verify tab visibility toggling.
    - [ ] Implement `switchView(viewId)` function in `app.js`.
    - [ ] Add event listeners to nav buttons.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: SPA Foundation & Navigation' (Protocol in workflow.md)** (f509b66)

## Phase 2: Dynamic Weight Readout (Spinner Page)
Enhance the main page to show real-time item weights based on the distance input.

- [x] **Task: Create Weight Readout UI** (016b157)
    - [ ] Add a container `<div id="weight-readout">` below the spinner in `index.html`.
    - [ ] Style the readout for clarity and mobile readability.
- [x] **Task: Implement Real-time Weight Updates** (c40302c)
    - [ ] Update `app.js` to fetch or calculate weights for all items whenever the distance input changes.
    - [ ] Render a list of items with their current weights/probabilities.
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Dynamic Weight Readout' (Protocol in workflow.md)** (0460bd5)

## Phase 3: Weight Distribution Visualization (Analytics Page) [checkpoint: 0460bd5]
Implement the Chart.js visualization for item curves.

- [~] **Task: Integrate Chart.js**
    - [ ] Add Chart.js CDN script to `index.html`.
    - [ ] Verify library is loaded in `app.js`.
- [ ] **Task: Create Distributions Page Layout**
    - [ ] Implement the LHS item selector (list of item names).
    - [ ] Implement the RHS `<canvas id="distribution-chart">`.
- [ ] **Task: Implement Curve Plotting Logic**
    - [ ] Write tests for the data transformation logic (Curve points -> Chart.js dataset).
    - [ ] Implement `renderCurve(itemName)` which fetches the `weight_curve` from the config and plots it.
    - [ ] Ensure the chart updates smoothly when a new item is selected.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Weight Distribution Visualization' (Protocol in workflow.md)**

## Phase 4: Final Polishing & Mobile Optimization
Refine the UI and ensure everything works perfectly on mobile devices.

- [ ] **Task: UI/UX Refinement**
    - [ ] Apply consistent styling to the new components.
    - [ ] Ensure touch targets for the LHS selector are adequate (44x44px).
- [ ] **Task: Final Verification**
    - [ ] Run full test suite.
    - [ ] Perform end-to-end manual check of all features.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Mobile Optimization' (Protocol in workflow.md)**
