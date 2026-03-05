# Product Definition: HeatxMK (Heat: Pedal to the Metal Mario Kart Mod)

## Overview
HeatxMK is a web-based companion app for a real-life modification of the board game *Heat: Pedal to the Metal*. It introduces a "Mario Kart" style item system where players collect items from boxes on the track. The app acts as a digital randomizer (spinner) that determines which item a player receives based on their current standing in the race.

## Target Audience
- **Real-life Players:** People playing the physical board game who need a quick, interactive way to determine their items without complex manual tables.

## Primary Goal
- **Item Selection Logic:** To provide a digital "spinner" that calculates and displays a random item based on the player's distance from first place and other game variables.

## Key Features
- **Dynamic Input:** A web UI where users specify the distance between them and the race leader.
- **Randomized Spinner:** An interactive UI element that "spins" through items before landing on the selected one.
- **Multi-tabbed SPA Interface:** A Single Page App layout allowing users to switch between the item spinner and distribution analytics.
- **Real-time Weight Analytics:** Live readout of item probabilities on the spinner page and interactive weight-curve graphs on the distributions page.
- **Item Mechanical Descriptions:** Detailed explanations of each item's effect within the physical board game, displayed automatically after a spin and on the analytics page.
- **Python Logic Engine:** A backend that handles the probability distribution of items (e.g., players further back get more powerful "catch-up" items).
- **Physical Token Integration:** The app displays visual representations (images) of items, making it easy for the user to identify which physical token to pull from their bag.

## Deployment & Integration
- **Standalone Web App:** A Python backend (FastAPI/Flask) serving a simple HTML/JS frontend, accessible via a local network or hosted simply.
