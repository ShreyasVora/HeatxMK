# Track Specification: Rules Page and Item Details Revamp

## Overview
This track introduces a dedicated "Rules" page to the HeatxMK app, acting as a digital rulebook for game items. It also renames and restructures the existing "Weight Distribution" page to "Item Details" for better clarity and navigation.

## Functional Requirements
- **New "Rules" Page:**
    - A new tab/page titled "Rules" accessible from the navigation bar.
    - Navigation order: Home -> Rules -> Item Details.
    - Layout: A vertical list view of all game items.
    - For each item, display:
        - Item Image
        - Item Name
        - Item Description (mechanics in the physical game)
    - Interaction: Clicking an item in the list navigates the user directly to its specific distribution view on the "Item Details" page.
- **"Item Details" Revamp:**
    - Rename the "Weight Distribution" page to "Item Details".
    - Update the visible page title and navigation label.
    - Update the URL/route from `/distribution` (or similar) to `/item-details`.
    - Maintain existing functionality: selecting an item and viewing its probability distribution curve.

## Non-Functional Requirements
- **Visual Consistency:** The new "Rules" page must match the existing minimalist, high-contrast aesthetic.
- **Responsiveness:** The list view must be readable on mobile devices (standard for race night use).

## Acceptance Criteria
- [ ] A "Rules" tab is present in the navigation bar between "Home" and "Item Details".
- [ ] The "Rules" page displays a vertical list of all items with images, names, and descriptions.
- [ ] Clicking an item on the "Rules" page redirects to the "Item Details" page with that item selected.
- [ ] The "Weight Distribution" page is renamed to "Item Details" in the UI and URL.
- [ ] All existing probability visualization features remain functional under the new "Item Details" title.

## Out of Scope
- Adding new items or changing existing item mechanics/probabilities.
- Adding search or filter functionality to the Rules page.
