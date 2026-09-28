// ─────────────────────────────────────────────────────────────
//  Feynman-style diagrams. Time flows left → right.
//  Lines: `type` is fermion | anti (antifermion, arrow points backwards)
//  | photon | W | Z | gluon. `phase` 0 = incoming, 1 = exchange, 2 = outgoing.
//  Coordinates live in a 600 × 360 box.
// ─────────────────────────────────────────────────────────────

export const INTERACTIONS = [
  {
    id: 'beta',
    title: 'Neutron decay',
    equation: 'n → p + e⁻ + ν̄ₑ',
    force: 'Weak force (W⁻)',
    realWorld: 'Radioactive β-decay. A free neutron lasts about 15 minutes on average (878 s).',
    captions: [
      'A neutron (u d d) is drifting along.',
      'One down quark turns into an up quark by emitting a virtual W⁻ boson.',
      'The W⁻ instantly becomes an electron and an electron antineutrino. The neutron is now a proton (u u d).',
    ],
    before: [{ label: 'n', charge: 0 }],
    after: [
      { label: 'p', charge: 1 },
      { label: 'e⁻', charge: -1 },
      { label: 'ν̄ₑ', charge: 0 },
    ],
    braces: [
      { x: 30, y1: 60, y2: 210, label: 'n', side: 'left' },
      { x: 570, y1: 60, y2: 210, label: 'p', side: 'right' },
    ],
    lines: [
      { from: [40, 70], to: [560, 70], type: 'fermion', label: 'u', phase: 0, span: true },
      { from: [40, 130], to: [560, 130], type: 'fermion', label: 'd', phase: 0, span: true },
      { from: [40, 200], to: [260, 200], type: 'fermion', label: 'd', phase: 0 },
      { from: [260, 200], to: [560, 200], type: 'fermion', label: 'u', phase: 2 },
      { from: [260, 200], to: [370, 285], type: 'W', label: 'W⁻', phase: 1 },
      { from: [370, 285], to: [560, 250], type: 'fermion', label: 'e⁻', phase: 2 },
      { from: [370, 285], to: [560, 330], type: 'anti', label: 'ν̄ₑ', phase: 2 },
    ],
    vertices: [
      [260, 200],
      [370, 285],
    ],
  },
  {
    id: 'annihilation',
    title: 'Electron–positron annihilation',
    equation: 'e⁻ + e⁺ → γ* → μ⁻ + μ⁺',
    force: 'Electromagnetic (virtual photon)',
    realWorld: 'How colliders like LEP made new particles: matter + antimatter → pure energy → something new.',
    captions: [
      'An electron and its antimatter twin, a positron, rush toward each other.',
      'They annihilate into a single virtual photon — pure energy, for an instant.',
      'The photon’s energy re-materialises as a brand-new muon and antimuon.',
    ],
    before: [
      { label: 'e⁻', charge: -1 },
      { label: 'e⁺', charge: 1 },
    ],
    after: [
      { label: 'μ⁻', charge: -1 },
      { label: 'μ⁺', charge: 1 },
    ],
    lines: [
      { from: [50, 50], to: [240, 180], type: 'fermion', label: 'e⁻', phase: 0 },
      { from: [50, 310], to: [240, 180], type: 'anti', label: 'e⁺', phase: 0 },
      { from: [240, 180], to: [360, 180], type: 'photon', label: 'γ*', phase: 1 },
      { from: [360, 180], to: [550, 50], type: 'fermion', label: 'μ⁻', phase: 2 },
      { from: [360, 180], to: [550, 310], type: 'anti', label: 'μ⁺', phase: 2 },
    ],
    vertices: [
      [240, 180],
      [360, 180],
    ],
  },
  {
    id: 'pet',
    title: 'Annihilation into light',
    equation: 'e⁻ + e⁺ → γ + γ',
    force: 'Electromagnetic',
    realWorld: 'This is how PET scans work: positrons from a tracer annihilate in your body, sending out two 511 keV photons back to back.',
    captions: [
      'An electron meets a positron.',
      'They swap a virtual electron between them…',
      '…and vanish, leaving two photons flying apart in opposite directions.',
    ],
    before: [
      { label: 'e⁻', charge: -1 },
      { label: 'e⁺', charge: 1 },
    ],
    after: [
      { label: 'γ', charge: 0 },
      { label: 'γ', charge: 0 },
    ],
    lines: [
      { from: [50, 70], to: [300, 110], type: 'fermion', label: 'e⁻', phase: 0 },
      { from: [50, 290], to: [300, 250], type: 'anti', label: 'e⁺', phase: 0 },
      { from: [300, 110], to: [300, 250], type: 'fermion', label: 'e*', phase: 1 },
      { from: [300, 110], to: [550, 60], type: 'photon', label: 'γ', phase: 2 },
      { from: [300, 250], to: [550, 300], type: 'photon', label: 'γ', phase: 2 },
    ],
    vertices: [
      [300, 110],
      [300, 250],
    ],
  },
  {
    id: 'repulsion',
    title: 'Why like charges repel',
    equation: 'e⁻ + e⁻ → e⁻ + e⁻',
    force: 'Electromagnetic (photon exchange)',
    realWorld: 'Every push between charges — static cling, the “solidity” of your chair — is photon exchange like this.',
    captions: [
      'Two electrons head toward each other.',
      'They exchange a virtual photon, passing momentum between them.',
      'Each gets a kick and they fly apart — that is electric repulsion.',
    ],
    before: [
      { label: 'e⁻', charge: -1 },
      { label: 'e⁻', charge: -1 },
    ],
    after: [
      { label: 'e⁻', charge: -1 },
      { label: 'e⁻', charge: -1 },
    ],
    lines: [
      { from: [50, 80], to: [300, 120], type: 'fermion', label: 'e⁻', phase: 0 },
      { from: [50, 280], to: [300, 240], type: 'fermion', label: 'e⁻', phase: 0 },
      { from: [300, 120], to: [300, 240], type: 'photon', label: 'γ', phase: 1 },
      { from: [300, 120], to: [550, 40], type: 'fermion', label: 'e⁻', phase: 2 },
      { from: [300, 240], to: [550, 320], type: 'fermion', label: 'e⁻', phase: 2 },
    ],
    vertices: [
      [300, 120],
      [300, 240],
    ],
  },
  {
    id: 'muon',
    title: 'Muon decay',
    equation: 'μ⁻ → ν_μ + e⁻ + ν̄ₑ',
    force: 'Weak force (W⁻)',
    realWorld: 'Cosmic-ray muons live 2.2 μs at rest — relativity stretches that so they reach the ground.',
    captions: [
      'A muon — a heavy cousin of the electron.',
      'It becomes a muon neutrino by emitting a virtual W⁻.',
      'The W⁻ turns into an electron and an electron antineutrino.',
    ],
    before: [{ label: 'μ⁻', charge: -1 }],
    after: [
      { label: 'ν_μ', charge: 0 },
      { label: 'e⁻', charge: -1 },
      { label: 'ν̄ₑ', charge: 0 },
    ],
    lines: [
      { from: [50, 180], to: [250, 180], type: 'fermion', label: 'μ⁻', phase: 0 },
      { from: [250, 180], to: [550, 80], type: 'fermion', label: 'ν_μ', phase: 2 },
      { from: [250, 180], to: [370, 265], type: 'W', label: 'W⁻', phase: 1 },
      { from: [370, 265], to: [550, 215], type: 'fermion', label: 'e⁻', phase: 2 },
      { from: [370, 265], to: [550, 320], type: 'anti', label: 'ν̄ₑ', phase: 2 },
    ],
    vertices: [
      [250, 180],
      [370, 265],
    ],
  },
  {
    id: 'pion',
    title: 'Pion decay',
    equation: 'π⁺ → μ⁺ + ν_μ',
    force: 'Weak force (W⁺)',
    realWorld: 'Where most cosmic-ray muons come from — and how accelerators make neutrino beams.',
    captions: [
      'A positive pion: an up quark bound to an anti-down.',
      'The quark and antiquark annihilate into a virtual W⁺.',
      'The W⁺ becomes an antimuon and a muon neutrino.',
    ],
    before: [{ label: 'π⁺', charge: 1 }],
    after: [
      { label: 'μ⁺', charge: 1 },
      { label: 'ν_μ', charge: 0 },
    ],
    braces: [{ x: 30, y1: 100, y2: 260, label: 'π⁺', side: 'left' }],
    lines: [
      { from: [45, 110], to: [240, 180], type: 'fermion', label: 'u', phase: 0 },
      { from: [45, 250], to: [240, 180], type: 'anti', label: 'd̄', phase: 0 },
      { from: [240, 180], to: [360, 180], type: 'W', label: 'W⁺', phase: 1 },
      { from: [360, 180], to: [550, 70], type: 'anti', label: 'μ⁺', phase: 2 },
      { from: [360, 180], to: [550, 290], type: 'fermion', label: 'ν_μ', phase: 2 },
    ],
    vertices: [
      [240, 180],
      [360, 180],
    ],
  },
  {
    id: 'neutral',
    title: 'Neutrino scattering (Z)',
    equation: 'ν_μ + e⁻ → ν_μ + e⁻',
    force: 'Weak neutral current (Z⁰)',
    realWorld: 'Neutral-current events like this were first spotted at CERN’s Gargamelle bubble chamber in 1973 — evidence for the Z a decade before it was produced.',
    captions: [
      'A ghostly muon neutrino passes near an electron.',
      'They exchange a virtual Z boson — no charge changes hands.',
      'The neutrino carries on; the electron recoils out of nowhere.',
    ],
    before: [
      { label: 'ν_μ', charge: 0 },
      { label: 'e⁻', charge: -1 },
    ],
    after: [
      { label: 'ν_μ', charge: 0 },
      { label: 'e⁻', charge: -1 },
    ],
    lines: [
      { from: [50, 70], to: [300, 115], type: 'fermion', label: 'ν_μ', phase: 0 },
      { from: [50, 290], to: [300, 245], type: 'fermion', label: 'e⁻', phase: 0 },
      { from: [300, 115], to: [300, 245], type: 'Z', label: 'Z⁰', phase: 1 },
      { from: [300, 115], to: [550, 50], type: 'fermion', label: 'ν_μ', phase: 2 },
      { from: [300, 245], to: [550, 310], type: 'fermion', label: 'e⁻', phase: 2 },
    ],
    vertices: [
      [300, 115],
      [300, 245],
    ],
  },
]
