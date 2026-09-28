// ─────────────────────────────────────────────────────────────
//  Decay chains. Branching ratios (%) are rounded from the PDG (2024)
//  and the LHC Higgs Cross Section Working Group (H at 125 GeV).
//  “*” marks a virtual (off-shell) particle — e.g. the Higgs is too light
//  to make two real W bosons, so one of them is virtual.
// ─────────────────────────────────────────────────────────────

// Every thing that can appear in a chain. `particle` links to a zoo card for the doodle.
export const TOKENS = {
  H: { label: 'H', name: 'Higgs boson', particle: 'higgs', charge: 0 },
  t: { label: 't', name: 'top quark', particle: 'top', charge: 2 / 3 },
  tbar: { label: 't̄', name: 'anti-top', particle: 'top', charge: -2 / 3, anti: true },
  Wp: { label: 'W⁺', name: 'W⁺ boson', particle: 'w', charge: 1 },
  Wm: { label: 'W⁻', name: 'W⁻ boson', particle: 'w', charge: -1 },
  Z: { label: 'Z⁰', name: 'Z boson', particle: 'z', charge: 0 },
  b: { label: 'b', name: 'bottom quark', particle: 'bottom', charge: -1 / 3 },
  bbar: { label: 'b̄', name: 'anti-bottom', particle: 'bottom', charge: 1 / 3, anti: true },
  c: { label: 'c', name: 'charm quark', particle: 'charm', charge: 2 / 3 },
  cbar: { label: 'c̄', name: 'anti-charm', particle: 'charm', charge: -2 / 3, anti: true },
  s: { label: 's', name: 'strange quark', particle: 'strange', charge: -1 / 3, jet: true },
  sbar: { label: 's̄', name: 'anti-strange', particle: 'strange', charge: 1 / 3, anti: true, jet: true },
  u: { label: 'u', name: 'up quark', particle: 'up', charge: 2 / 3, jet: true },
  ubar: { label: 'ū', name: 'anti-up', particle: 'up', charge: -2 / 3, anti: true, jet: true },
  d: { label: 'd', name: 'down quark', particle: 'down', charge: -1 / 3, jet: true },
  dbar: { label: 'd̄', name: 'anti-down', particle: 'down', charge: 1 / 3, anti: true, jet: true },
  g: { label: 'g', name: 'gluon', particle: 'gluon', charge: 0, jet: true },
  gamma: { label: 'γ', name: 'photon', particle: 'photon', charge: 0, stable: true },
  em: { label: 'e⁻', name: 'electron', particle: 'electron', charge: -1, stable: true },
  ep: { label: 'e⁺', name: 'positron', particle: 'electron', charge: 1, stable: true, anti: true },
  mum: { label: 'μ⁻', name: 'muon', particle: 'muon', charge: -1 },
  mup: { label: 'μ⁺', name: 'antimuon', particle: 'muon', charge: 1, anti: true },
  taum: { label: 'τ⁻', name: 'tau', particle: 'tau', charge: -1 },
  taup: { label: 'τ⁺', name: 'antitau', particle: 'tau', charge: 1, anti: true },
  nue: { label: 'νₑ', name: 'electron neutrino', particle: 'nu-e', charge: 0, stable: true, invisible: true },
  nuebar: { label: 'ν̄ₑ', name: 'electron antineutrino', particle: 'nu-e', charge: 0, stable: true, invisible: true, anti: true },
  numu: { label: 'ν_μ', name: 'muon neutrino', particle: 'nu-mu', charge: 0, stable: true, invisible: true },
  numubar: { label: 'ν̄_μ', name: 'muon antineutrino', particle: 'nu-mu', charge: 0, stable: true, invisible: true, anti: true },
  nutau: { label: 'ν_τ', name: 'tau neutrino', particle: 'nu-tau', charge: 0, stable: true, invisible: true },
  nutaubar: { label: 'ν̄_τ', name: 'tau antineutrino', particle: 'nu-tau', charge: 0, stable: true, invisible: true, anti: true },
  q: { label: 'q', name: 'quark (becomes a jet)', particle: 'up', charge: null, jet: true },
  qbar: { label: 'q̄', name: 'antiquark (becomes a jet)', particle: 'up', charge: null, anti: true, jet: true },
  hadrons: { label: 'hadrons', name: 'a spray of hadrons (mostly pions)', particle: 'gluon', charge: null, jet: true },
}

const CONJ = {
  t: 'tbar', Wp: 'Wm', q: 'qbar', b: 'bbar', c: 'cbar', s: 'sbar', u: 'ubar', d: 'dbar', mum: 'mup', taum: 'taup', em: 'ep', nue: 'nuebar', numu: 'numubar', nutau: 'nutaubar',
}
Object.entries({ ...CONJ }).forEach(([a, b]) => (CONJ[b] = a))
export const conj = (t) => CONJ[t] ?? t

// Decay tables for particles; antiparticles are derived by conjugating every product.
const TABLE = {
  H: {
    life: '1.6 × 10⁻²² s',
    modes: [
      { p: ['b', 'bbar'], br: 58.2 },
      { p: ['Wp', 'Wm*'], br: 21.4, note: 'One W must be virtual — the Higgs isn’t heavy enough for two real ones.' },
      { p: ['g', 'g'], br: 8.2, note: 'Via a loop of top quarks — the Higgs doesn’t touch gluons directly.' },
      { p: ['taup', 'taum'], br: 6.3 },
      { p: ['c', 'cbar'], br: 2.9 },
      { p: ['Z', 'Z*'], br: 2.6, note: 'The “golden channel” — Z Z* → four leptons helped discover the Higgs in 2012.' },
      { p: ['gamma', 'gamma'], br: 0.23, note: 'Rare, but very clean — the other discovery channel.' },
      { p: ['Z', 'gamma'], br: 0.15 },
      { p: ['mup', 'mum'], br: 0.022 },
    ],
  },
  t: {
    life: '5 × 10⁻²⁵ s',
    modes: [
      { p: ['Wp', 'b'], br: 99.8, note: 'So fast it never forms a hadron.' },
      { p: ['Wp', 's'], br: 0.2 },
    ],
  },
  Wp: {
    life: '3 × 10⁻²⁵ s',
    modes: [
      { p: ['u', 'dbar'], br: 33.7, note: 'Quark pairs (ud̄, cs̄ …) together make up about 67% of W decays.' },
      { p: ['c', 'sbar'], br: 33.7 },
      { p: ['ep', 'nue'], br: 10.7 },
      { p: ['mup', 'numu'], br: 10.6 },
      { p: ['taup', 'nutau'], br: 11.4 },
    ],
  },
  Z: {
    life: '2.6 × 10⁻²⁵ s',
    modes: [
      { p: ['q', 'qbar'], br: 69.9, note: 'A quark–antiquark pair that becomes two jets.' },
      { p: ['nue', 'nuebar'], br: 6.67, note: 'Invisible! All three neutrino pairs add up to 20% — which is how we know there are exactly 3 light neutrinos.' },
      { p: ['numu', 'numubar'], br: 6.67 },
      { p: ['nutau', 'nutaubar'], br: 6.67 },
      { p: ['em', 'ep'], br: 3.36 },
      { p: ['mum', 'mup'], br: 3.37 },
      { p: ['taum', 'taup'], br: 3.37 },
    ],
  },
  taum: {
    life: '2.9 × 10⁻¹³ s',
    modes: [
      { p: ['nutau', 'hadrons'], br: 64.8, note: 'The only lepton heavy enough to decay into hadrons.' },
      { p: ['em', 'nuebar', 'nutau'], br: 17.8 },
      { p: ['mum', 'numubar', 'nutau'], br: 17.4 },
    ],
  },
  mum: {
    life: '2.2 × 10⁻⁶ s',
    modes: [{ p: ['em', 'nuebar', 'numu'], br: 100, note: 'Long-lived enough that fast muons usually fly right through a detector first.' }],
  },
  b: {
    life: '≈ 1.5 × 10⁻¹² s (inside a B hadron)',
    modes: [
      { p: ['c', 'Wm*'], br: 98, note: 'The b first dresses up as a B hadron, then its b quark decays.' },
      { p: ['u', 'Wm*'], br: 2 },
    ],
  },
  c: {
    life: '≈ 0.4–1 × 10⁻¹² s (inside a D hadron)',
    modes: [
      { p: ['s', 'Wp*'], br: 95 },
      { p: ['d', 'Wp*'], br: 5 },
    ],
  },
}

/** Decay info for any token (handles antiparticles and virtual “*” bosons). */
export function decaysOf(token) {
  const base = token.replace('*', '')
  if (TABLE[base]) return TABLE[base]
  const c = conj(base)
  if (TABLE[c]) return { ...TABLE[c], modes: TABLE[c].modes.map((m) => ({ ...m, p: m.p.map((x) => conj(x.replace('*', '')) + (x.endsWith('*') ? '*' : '')) })) }
  return null
}

export const tokenInfo = (token) => {
  const base = token.replace('*', '')
  const info = TOKENS[base]
  return { ...info, virtual: token.endsWith('*'), label: info.label + (token.endsWith('*') ? '*' : '') }
}

export const STARTERS = ['H', 't', 'Z', 'Wp', 'taum', 'mum']

/** Pick a mode at random, weighted by branching ratio. */
export function rollMode(modes) {
  const total = modes.reduce((s, m) => s + m.br, 0)
  let r = Math.random() * total
  for (const m of modes) {
    r -= m.br
    if (r <= 0) return m
  }
  return modes[modes.length - 1]
}
