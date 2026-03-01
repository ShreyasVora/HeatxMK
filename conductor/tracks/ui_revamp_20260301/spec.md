# Specification: UI Revamp & Distribution Visualization (ui_revamp_20260301)

## Overview
This track involves a significant UI overhaul of the HeatxMK web companion. The current single-view interface will be expanded into a multi-tabbed SPA (Single Page App). Key additions include a real-time weight readout on the main page and a dedicated analytics view for visualizing the item probability curves using Chart.js.

## Functional Requirements
- **SPA Navigation:**
  - A navigation bar at the top or side to switch between "Item Spinner" and "Weight Distributions".
  - View switching must be handled without full page reloads.
- **Dynamic Weight Readout (Spinner Page):**
  - Below the item spinner, display a list of all items that have a weight > 0 for the current distance input.
  - Display the specific weight (or percentage chance) for each available item.
  - Update this list automatically whenever the distance input changes.
- **Weight Visualization Page:**
  - A layout featuring an item selector (list/buttons) on the left-hand side (LHS).
  - A main graph area on the right using **Chart.js**.
  - Selecting an item from the LHS should render its `weight_curve` as a line chart.
  - The X-axis should represent Distance, and the Y-axis should represent Weight.

## Non-Functional Requirements
- **Library Integration:** Include `Chart.js` via CDN for simplicity.
- **Responsiveness:** The UI should remain functional on mobile devices (standard for "race night" use).
- **Performance:** Real-time updates on the spinner page must be smooth and lag-free.

## Acceptance Criteria
- [ ] Users can switch between the Spinner and Distributions views.
- [ ] On the Spinner page, changing the distance input correctly updates the "Available Items" list with accurate weights from the `ItemEngine`.
- [ ] On the Distributions page, selecting an item displays a correct line graph of its `weight_curve`.
- [ ] The app uses Chart.js for all visualizations.

## Out of Scope
- Adding persistent user accounts or "history" of spins.
- Server-side rendering (SSR).
- Advanced 3D graphics for the spinner.
