# Implementation Plan: Rules Page and Item Details Revamp

## Phase 1: Navigation and Route Refactoring [checkpoint: 3f88438]
This phase focuses on renaming the existing "Weight Distribution" page and its associated routes to "Item Details", and updating the navigation menu to reflect the new structure.

- [x] Task: Update the "Weight Distribution" navigation link and page title to "Item Details". (da5949c)
    - [x] Update labels in `static/index.html`.
    - [x] Update any references in `static/app.js`.
- [x] Task: Refactor routing to use `/item-details` instead of the current distribution route. (da5949c)
    - [x] Identify and update the route in the frontend and backend (if applicable).
    - [x] Ensure navigation between Home and Item Details remains functional.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Navigation and Route Refactoring' (Protocol in workflow.md) (3f88438)

## Phase 2: "Rules" Page Structure and Content
This phase implements the new "Rules" page, its vertical list layout, and the content for each item.

- [~] Task: Create the base HTML and CSS structure for the "Rules" page list view.
    - [ ] Add a "Rules" section to `static/index.html`.
    - [ ] Define CSS styles in `static/style.css` for a vertical list layout (image, name, description).
- [ ] Task: Integrate item images, names, and descriptions into the "Rules" page list.
    - [ ] Update `static/app.js` to dynamically populate the "Rules" list from `items_config.json`.
    - [ ] Ensure images are sized correctly and descriptions are readable on mobile.
- [ ] Task: Add the "Rules" tab to the navigation bar.
    - [ ] Insert the "Rules" link in the correct order: Home -> Rules -> Item Details.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Rules Page Structure and Content' (Protocol in workflow.md)

## Phase 3: Interaction and Final Polish
This phase connects the "Rules" page to the "Item Details" page and performs final verification.

- [ ] Task: Implement navigation from "Rules" items to "Item Details".
    - [ ] Add click event listeners to items in the "Rules" list.
    - [ ] On click, navigate to "Item Details" and select the clicked item for its probability view.
- [ ] Task: Final UI polish and responsiveness check.
    - [ ] Verify consistent spacing and high-contrast styling across both pages.
    - [ ] Confirm layout integrity on mobile-sized viewports.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Interaction and Final Polish' (Protocol in workflow.md)
