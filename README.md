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

- **Hadron Lab** (`/#lab`) — drag quarks and antiquarks into the bag (or tap them). It works out the charge and baryon number live, checks colour neutrality, and names what you built (proton, neutron, pions, kaons, Ω⁻, J/ψ, B mesons, antiprotons…). Try **pulling a quark out**: the gluon string snaps, a new quark–antiquark pair appears and a meson flies off — confinement in action. Top quarks are refused, because they decay before they can bind.
- **Interactions** (`/#interactions`) — animated Feynman-style diagrams for neutron β-decay, e⁺e⁻ → μ⁺μ⁻, e⁺e⁻ → γγ (PET scans), electron repulsion, muon decay, pion decay and neutrino–electron scattering via the Z. Step-by-step captions, a live charge-conservation check and a “how to read it” legend.
- **Decay Chains** (`/#decays`) — start from a Higgs, top, Z, W, tau or muon, pick a decay mode (with branching ratios) or roll the dice, and follow the chain down. A side panel shows what a detector would actually see: jets, leptons, photons and missing energy from neutrinos.

## Data

All values live in `src/data/`. Masses, lifetimes and branching ratios follow the Particle Data Group’s *Review of Particle Physics* (2024); quark masses are MS-bar values, and neutrino masses are experimental upper limits.

## Structure

```
src/
  data/particles.js        the 17 particles (edit facts & doodle moods here)
  data/hadrons.js          quark charges + baryon/meson lookup table
  data/interactions.js     Feynman diagram definitions (lines, vertices, captions)
  data/decays.js           decay modes & branching ratios
  lib/family.js            family colours, log-mass helper
  components/
    Doodle.jsx             procedural SVG mascots
    ParticleCard.jsx       3D flip card
    Zoo.jsx                filters, search, sort, grid
    ChartView.jsx          Standard Model chart + card modal
    Quiz.jsx               "Which particle am I?"
    Sym.jsx                symbols with subscripts (νₑ, ν_μ, ν_τ)
    Bar.jsx                overlines for antiparticles + subscripts in labels
    HadronLab.jsx          build-a-hadron drag & drop
    Interactions.jsx       process picker, captions, charge check
    FeynmanDiagram.jsx     SVG renderer (fermion arrows, wavy bosons, vertices)
    DecayChains.jsx        interactive decay tree + detector summary
  App.jsx                  header, hero, tabs, footer
```
