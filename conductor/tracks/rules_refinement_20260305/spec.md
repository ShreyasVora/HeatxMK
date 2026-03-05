# Specification: Rules Refinement & Coin Economy (rules_refinement_20260305)

## Overview
This track focuses on the mechanical balancing and systemic expansion of the HeatxMK item system. It transitions the item effects from AI-generated placeholders to player-refined rules while introducing a "Coin" economy and specific "Turn Timing" triggers to integrate more deeply with *Heat: Pedal to the Metal* mechanics.

## Functional Requirements
- **Collaborative Refinement:**
  - Sequential analysis of all 14 existing items.
  - Comparison of group-drafted ideas vs. current AI descriptions.
  - Finalization of a "Standardized Description" for each item.
- **Metadata Expansion (`items_config.json`):**
  - Add `usage_timing`: Specifies the *Heat* turn step (e.g., "Step 1: Shift Gear", "Step 9: End of Turn").
  - Add `coin_reward`: Metadata for coin gains (supports fixed values or rule-based variable rewards).
  - Add `coin_cost`: Specifies the number of coins required to activate an item or an enhanced effect.
  - Add `balancing_notes`: A field to persist the rationale behind the current ruleset.
- **UI Synchronization:**
  - Update the "Rules" page to display the new timing and coin metadata.
  - Update the "Item Spinner" result panel to clearly show timing and coin details.

## Non-Functional Requirements
- **Consistency:** Turn timing terminology must align perfectly with the physical *Heat* rulebook.
- **Transparency:** The `balancing_notes` field ensures that the "Why" behind each rule is visible to future contributors.

## Acceptance Criteria
- [ ] All 14 items have updated descriptions approved by the user.
- [ ] `items_config.json` is updated with `usage_timing`, `coin_reward`, and `coin_cost` for every item.
- [ ] The Rules page displays images, finalized descriptions, timing, and coin info.
- [ ] The Item Spinner result panel displays the finalized rules and timing.

## Out of Scope
- Implementing the "Shop" or "Sponsorship" purchase logic (this will be a separate track).
- Adding new visual assets.
