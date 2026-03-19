# All Vall Minigames

Interactive and stimulative minigames hub (Jocs Interactius / Videos Estimulatius).

## Structure

- **Entry:** `index.html` — single hub with five panels (Jocs Interactius pages 1–4 and Videos Estimulatius). Panels are switched via the URL hash: `#page1`, `#page2`, `#page3`, `#page4`, `#page5`.
- **Styles:** `styles.css` — shared layout, navigation, cards, and orange accent (`oklch(0.769 0.188 70.08)`).
- **Games:** `Games/` — minigames grouped by author (e.g. `Games/Ruben/`, `Games/Laia/`). Each game has its own folder with `index.html` (or named HTML), CSS, JS, and assets.
- **Stimulative content:** `Estimulacio/` — non-interactive / video content (e.g. `Estimulacio/Hatim/Estimulacio/`, `Estimulacio/Pau/videos/`).
- **Captures:** `Capturas/` — preview images used in the hub grids.

## Navigation

- One `index.html`: use the left/right arrows to move between panels (page1 ↔ page2 ↔ page3 ↔ page4). Page 5 is "Videos Estimulatius" (link in top nav).
- Direct links: `index.html`, `index.html#page2`, `index.html#page3`, `index.html#page4`, `index.html#page5`.
- Top-left: home button (back to `index.html#page1`), and links to "Videos Estimulatius" (`#page5`) and "Jocs Interactius" (`#page1`).

## Minigames and back button

Each minigame should include a **back button** (Enrere / Volver) that links to the hub with the correct hash:

- Games from panel 1 → `../../../index.html#page1`
- Games from panel 2 → `../../../index.html#page2` (or `../../../../index.html#page2` if three levels deep, e.g. `Games/Artur/js/joc1/`)
- Games from panel 3 → `../../../index.html#page3`
- Games from panel 4 → `../../../index.html#page4`
- Videos / stimulative from panel 5 → `../../../index.html#page5`

Reference implementation: **Une los puntos** (`Games/Laia/conecta puntos/`): top-left circular button with house icon (SVG), linking to `../../../index.html#page4`.
