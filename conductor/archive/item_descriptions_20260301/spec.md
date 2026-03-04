# Specification: Item Descriptions (item_descriptions_20260301)

## Overview
This track involves adding descriptive text to all items in the HeatxMK app. These descriptions will explain the "Mario Kart" item's specific mechanical effect in the context of the *Heat: Pedal to the Metal* board game, providing immediate clarity to players after they spin.

## Functional Requirements
- **Config Update:**
  - Add a `"description"` property (String, HTML allowed) to each item in `items_config.json`.
- **API Update:**
  - Ensure `/api/item`, `/api/weights`, and `/api/config` endpoints return the `description` field for each item.
- **Spinner View (Main Page):**
  - Implement a new `Info Panel` component below the spinner.
  - After the spin animation completes, the panel should reveal the HTML description of the selected item.
- **Distributions View (Analytics Page):**
  - Add a description container below the `Chart.js` graph.
  - Automatically update the container with the selected item's description when its curve is rendered.

## Non-Functional Requirements
- **UI Consistency:** The description text should follow the project's typography and color scheme (Inter font, neutral colors).
- **Graceful Failure:** If an item's description is missing, the panel/container should remain hidden or show a default "No description available" message.

## Acceptance Criteria
- [ ] `items_config.json` contains valid HTML descriptions for all items.
- [ ] After spinning on the main page, the item's description appears in a dedicated panel.
- [ ] On the Weight Distributions page, selecting an item displays its description below its graph.
- [ ] Both the Spinner and Distributions views handle HTML tags (e.g., `<b>`, `<i>`, `<br>`) correctly.

## Out of Scope
- Interactive links or buttons inside the description text.
- Image/video embeds within the descriptions.
- Multi-language/translation support.
