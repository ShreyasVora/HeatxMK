# Specification: Item Image Representation (item_images_20260301)

## Overview
This track involves replacing all text-based item names with visual image representations throughout the HeatxMK web application. This will enhance the "Mario Kart" feel and make the interface more intuitive during gameplay.

## Functional Requirements
- **Config Update:**
  - Add an `image_path` property to each item in `items_config.json`.
  - Example: `"image_path": "static/images/items/mushroom.png"`
- **Spinner UI:**
  - Update the item spinner to display images during the "spinning" animation.
  - The final selected item must be shown as a large, centered image.
- **Weight Readout:**
  - The "Available Items" list on the spinner page should display small thumbnails of the items alongside their weights/percentages.
- **Distributions Page:**
  - The LHS item selector should display small thumbnails or icons next to (or instead of) the item names.
  - The Chart.js graph should use the item's image in the legend or as a title graphic where applicable.
- **Error Handling (Fallback):**
  - Implement a check for image existence.
  - Display a `placeholder.png` image if the specified `image_path` is invalid or missing.

## Non-Functional Requirements
- **Asset Management:** Standardize on PNG/JPG format.
- **Storage:** All item images must reside in `static/images/items/`.
- **UI Performance:** Ensure images are optimized for fast loading and smooth spinner animation.

## Acceptance Criteria
- [ ] `items_config.json` includes valid `image_path` entries for all items.
- [ ] The spinner animation cycles through item images correctly.
- [ ] The final result of a spin is displayed as an image.
- [ ] The Weight Readout list correctly displays item thumbnails.
- [ ] A placeholder image is shown if an item image is missing.

## Out of Scope
- Dynamic image generation or procedural icons.
- Support for animated GIFs or video icons.
- User-uploaded item images.
