# Implementation Plan: Rules Refinement & Coin Economy

This plan covers the transition of item mechanics from placeholders to player-refined rules, including turn timing and coin integration.

## Phase 1: Collaborative Refinement Workshop [checkpoint: ff99c4a]
This phase is an interactive process between the AI and the User to finalize the mechanics for all 14 items.

- [x] **Task: Sequential Item Analysis** (d3a9bb6)
    - [x] Prompt user for each item (1-14) with current rules.
    - [x] Perform pros/cons analysis on group-drafted suggestions.
    - [x] Finalize description, `usage_timing`, `coin_reward`, and `coin_cost`.
- [x] **Task: Data Consolidation** (d3a9bb6)
    - [x] Create a temporary staging object/file to hold approved rules.
- [x] **Task: Conductor - User Manual Verification 'Phase 1: Collaborative Refinement' (Protocol in workflow.md)** (ff99c4a)

## Phase 2: Configuration & Backend Updates
Apply the finalized rules to the data layer and update tests.

- [x] **Task: Update `items_config.json`** (ed6292a)
    - [x] Add new fields: `usage_timing`, `coin_reward`, `coin_cost`, and `balancing_notes`.
    - [x] Overwrite old descriptions with finalized versions.
- [~] **Task: Update ItemEngine Tests**
    - [ ] Write tests in `test_item_engine.py` to verify that the new metadata fields are present and correctly formatted.
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Configuration & Backend' (Protocol in workflow.md)**

## Phase 3: Frontend Synchronization
Update the SPA views to display the expanded rulebook and coin data.

- [ ] **Task: Enhance 'Rules' Page**
    - [ ] Update `populateRulesList` in `app.js` to render Timing and Coin info.
    - [ ] Add CSS for highlighting timing steps (e.g., color-coded by turn step).
- [ ] **Task: Update 'Item Spinner' Result Panel**
    - [ ] Update `finalizeSpin` in `app.js` to display the timing and coin metadata prominently after a result.
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Frontend Synchronization' (Protocol in workflow.md)**

## Phase 4: Final Verification
Ensure the rulebook feels professional and consistent.

- [ ] **Task: Rules Audit**
    - [ ] Verify that all 14 items maintain a consistent tone and follow standard *Heat* turn terminology.
- [ ] **Task: Full Application Walkthrough**
    - [ ] Manual test of all 3 views (Home, Rules, Item Details) ensuring all metadata displays correctly.
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)**
