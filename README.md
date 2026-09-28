# Particle Zoo ⚛️

Flip cards for all 17 particles of the Standard Model — mass, charge, spin, what each one does, a fun fact and a hand-drawn doodle — plus a **“Which particle am I?”** quiz.

React 19 · Vite · Tailwind CSS v4 · Framer Motion

## Run it

Requires **Node 20.19+ or 22.12+** (`nvm use` picks up `.nvmrc`).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Features

- **The Zoo** — 17 flip cards (click, Enter or Space to flip). Filter by family, search, sort by family / mass / discovery year, or flip them all at once.
- **Chart view** — the classic Standard Model table; tap a tile to open its card.
- **Doodles** — every particle is a little SVG character: quarks are squishy blobs with colour-charge moons, neutrinos are shy ghosts, the photon is a wave packet, the gluon a spring, W/Z are heavy blocks and the Higgs wades through a crowd of field dots. A turbulence filter gives the lines a hand-inked wobble.
- **Mass ruler** — each card back shows the mass on a log scale from 1 eV to 1 TeV.
- **Quiz** — 10 rounds. Guess the silhouette from clues; you start with 2 clues and each extra clue costs a point (5 → 1). Streaks, a rank at the end, best score saved in the browser, and a share button. Keys: `1–4` answer, `H` extra clue, `Enter` next. `/#quiz` links straight to it.

## Data

All values live in `src/data/particles.js`. Masses follow the Particle Data Group’s *Review of Particle Physics* (2024); quark masses are MS-bar values, and neutrino masses are experimental upper limits.

## Structure

```
src/
  data/particles.js        the 17 particles (edit facts & doodle moods here)
  lib/family.js            family colours, log-mass helper
  components/
    Doodle.jsx             procedural SVG mascots
    ParticleCard.jsx       3D flip card
    Zoo.jsx                filters, search, sort, grid
    ChartView.jsx          Standard Model chart + card modal
    Quiz.jsx               "Which particle am I?"
    Sym.jsx                symbols with subscripts (νₑ, ν_μ, ν_τ)
  App.jsx                  header, hero, tabs, footer
```
