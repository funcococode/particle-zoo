// ─────────────────────────────────────────────────────────────
//  Quarks, antiquarks and the hadrons they build.
//  Masses: PDG Review of Particle Physics (2024), lightest state for each
//  quark content (J/ψ, φ and Υ are shown for cc̄, ss̄ and bb̄ because they
//  are the famous ones — noted in `note`).
// ─────────────────────────────────────────────────────────────

// charge in thirds of e, so arithmetic stays exact
export const QUARKS = {
  u: { id: 'u', name: 'up', symbol: 'u', charge3: 2, particle: 'up' },
  d: { id: 'd', name: 'down', symbol: 'd', charge3: -1, particle: 'down' },
  s: { id: 's', name: 'strange', symbol: 's', charge3: -1, particle: 'strange' },
  c: { id: 'c', name: 'charm', symbol: 'c', charge3: 2, particle: 'charm' },
  b: { id: 'b', name: 'bottom', symbol: 'b', charge3: -1, particle: 'bottom' },
  t: { id: 't', name: 'top', symbol: 't', charge3: 2, particle: 'top' },
}

export const FLAVOURS = ['u', 'd', 's', 'c', 'b', 't']

/** A token is a flavour plus an `anti` flag, e.g. { f: 'u', anti: true } = ū */
export const tokenSymbol = (t) => (t.anti ? `${QUARKS[t.f].symbol}̄` : QUARKS[t.f].symbol)
export const tokenName = (t) => `${t.anti ? 'anti-' : ''}${QUARKS[t.f].name}`
export const tokenCharge3 = (t) => (t.anti ? -1 : 1) * QUARKS[t.f].charge3

/** Format a charge given in thirds: 2 → "+2/3", -3 → "−1", 0 → "0" */
export function formatCharge3(q3) {
  if (q3 === 0) return '0'
  const sign = q3 > 0 ? '+' : '−'
  const a = Math.abs(q3)
  return a % 3 === 0 ? `${sign}${a / 3}` : `${sign}${a}/3`
}

// Baryons keyed by sorted flavour string (spin-½ ground state where one exists)
const BARYONS = {
  uud: { name: 'Proton', symbol: 'p', mass: '938.27 MeV', life: 'Stable (as far as we know)', note: 'The core of every hydrogen atom.' },
  ddu: { name: 'Neutron', symbol: 'n', mass: '939.57 MeV', life: '≈ 15 minutes when free', note: 'Stable inside most nuclei; alone it β-decays into a proton.' },
  dsu: { name: 'Lambda', symbol: 'Λ⁰', mass: '1115.68 MeV', life: '2.6 × 10⁻¹⁰ s', note: 'Same quarks as the Σ⁰ — they differ in how the quarks’ spins line up.' },
  suu: { name: 'Sigma plus', symbol: 'Σ⁺', mass: '1189.37 MeV', life: '8.0 × 10⁻¹¹ s' },
  dds: { name: 'Sigma minus', symbol: 'Σ⁻', mass: '1197.45 MeV', life: '1.5 × 10⁻¹⁰ s' },
  ssu: { name: 'Xi zero', symbol: 'Ξ⁰', mass: '1314.86 MeV', life: '2.9 × 10⁻¹⁰ s' },
  dss: { name: 'Xi minus', symbol: 'Ξ⁻', mass: '1321.71 MeV', life: '1.6 × 10⁻¹⁰ s' },
  sss: { name: 'Omega minus', symbol: 'Ω⁻', mass: '1672.45 MeV', life: '8.2 × 10⁻¹¹ s', note: 'Predicted by Gell-Mann’s quark model before it was found in 1964 — a big win for quarks.' },
  uuu: { name: 'Delta plus-plus', symbol: 'Δ⁺⁺', mass: '≈ 1232 MeV', life: '≈ 5.6 × 10⁻²⁴ s', note: 'Three identical quarks with aligned spins — part of the puzzle that led to colour charge.' },
  ddd: { name: 'Delta minus', symbol: 'Δ⁻', mass: '≈ 1232 MeV', life: '≈ 5.6 × 10⁻²⁴ s' },
  cdu: { name: 'Lambda-c plus', symbol: 'Λc⁺', mass: '2286.46 MeV', life: '2.0 × 10⁻¹³ s' },
  cuu: { name: 'Sigma-c plus-plus', symbol: 'Σc⁺⁺', mass: '2453.97 MeV', life: 'strong decay' },
  cdd: { name: 'Sigma-c zero', symbol: 'Σc⁰', mass: '2453.75 MeV', life: 'strong decay' },
  csu: { name: 'Xi-c plus', symbol: 'Ξc⁺', mass: '2467.71 MeV', life: '4.5 × 10⁻¹³ s' },
  cds: { name: 'Xi-c zero', symbol: 'Ξc⁰', mass: '2470.44 MeV', life: '1.5 × 10⁻¹³ s' },
  css: { name: 'Omega-c zero', symbol: 'Ωc⁰', mass: '2695.2 MeV', life: '2.7 × 10⁻¹³ s' },
  ccu: { name: 'Xi-cc plus-plus', symbol: 'Ξcc⁺⁺', mass: '3621.6 MeV', life: '2.6 × 10⁻¹³ s', note: 'A doubly-charmed baryon, first seen by LHCb in 2017.' },
  bdu: { name: 'Lambda-b zero', symbol: 'Λb⁰', mass: '5619.60 MeV', life: '1.5 × 10⁻¹² s' },
}

// Mesons keyed by "quark|antiquark"
const MESONS = {
  'u|d': { name: 'Pion plus', symbol: 'π⁺', mass: '139.57 MeV', life: '2.6 × 10⁻⁸ s', note: 'The lightest charged hadron — it decays into a muon and a neutrino.' },
  'd|u': { name: 'Pion minus', symbol: 'π⁻', mass: '139.57 MeV', life: '2.6 × 10⁻⁸ s' },
  'u|u': { name: 'Neutral pion', symbol: 'π⁰', mass: '134.98 MeV', life: '8.5 × 10⁻¹⁷ s', note: 'Really a quantum mix of uū and dd̄. Decays into two photons.' },
  'd|d': { name: 'Neutral pion', symbol: 'π⁰', mass: '134.98 MeV', life: '8.5 × 10⁻¹⁷ s', note: 'Really a quantum mix of uū and dd̄. Decays into two photons.' },
  's|s': { name: 'Phi', symbol: 'φ', mass: '1019.46 MeV', life: '1.5 × 10⁻²² s', note: 'The classic ss̄ state (spin 1). ss̄ also mixes into the η and η′.' },
  'u|s': { name: 'Kaon plus', symbol: 'K⁺', mass: '493.68 MeV', life: '1.2 × 10⁻⁸ s' },
  's|u': { name: 'Kaon minus', symbol: 'K⁻', mass: '493.68 MeV', life: '1.2 × 10⁻⁸ s' },
  'd|s': { name: 'Neutral kaon', symbol: 'K⁰', mass: '497.61 MeV', life: 'mixes with K̄⁰', note: 'K⁰ and its antiparticle turn into each other — where CP violation was discovered in 1964.' },
  's|d': { name: 'Anti-kaon zero', symbol: 'K̄⁰', mass: '497.61 MeV', life: 'mixes with K⁰' },
  'c|d': { name: 'D plus', symbol: 'D⁺', mass: '1869.66 MeV', life: '1.0 × 10⁻¹² s' },
  'd|c': { name: 'D minus', symbol: 'D⁻', mass: '1869.66 MeV', life: '1.0 × 10⁻¹² s' },
  'c|u': { name: 'D zero', symbol: 'D⁰', mass: '1864.84 MeV', life: '4.1 × 10⁻¹³ s' },
  'u|c': { name: 'Anti-D zero', symbol: 'D̄⁰', mass: '1864.84 MeV', life: '4.1 × 10⁻¹³ s' },
  'c|s': { name: 'D-s plus', symbol: 'Ds⁺', mass: '1968.35 MeV', life: '5.0 × 10⁻¹³ s' },
  's|c': { name: 'D-s minus', symbol: 'Ds⁻', mass: '1968.35 MeV', life: '5.0 × 10⁻¹³ s' },
  'c|c': { name: 'J/psi', symbol: 'J/ψ', mass: '3096.90 MeV', life: '7.1 × 10⁻²¹ s', note: 'Its 1974 discovery (the “November Revolution”) proved charm was real.' },
  'u|b': { name: 'B plus', symbol: 'B⁺', mass: '5279.41 MeV', life: '1.6 × 10⁻¹² s' },
  'b|u': { name: 'B minus', symbol: 'B⁻', mass: '5279.41 MeV', life: '1.6 × 10⁻¹² s' },
  'd|b': { name: 'B zero', symbol: 'B⁰', mass: '5279.72 MeV', life: '1.5 × 10⁻¹² s' },
  'b|d': { name: 'Anti-B zero', symbol: 'B̄⁰', mass: '5279.72 MeV', life: '1.5 × 10⁻¹² s' },
  's|b': { name: 'B-s zero', symbol: 'Bs⁰', mass: '5366.93 MeV', life: '1.5 × 10⁻¹² s' },
  'b|s': { name: 'Anti-B-s zero', symbol: 'B̄s⁰', mass: '5366.93 MeV', life: '1.5 × 10⁻¹² s' },
  'c|b': { name: 'B-c plus', symbol: 'Bc⁺', mass: '6274.47 MeV', life: '5.1 × 10⁻¹³ s' },
  'b|c': { name: 'B-c minus', symbol: 'Bc⁻', mass: '6274.47 MeV', life: '5.1 × 10⁻¹³ s' },
  'b|b': { name: 'Upsilon', symbol: 'Υ', mass: '9460.40 MeV', life: '1.2 × 10⁻²⁰ s', note: 'Its 1977 discovery at Fermilab revealed the bottom quark.' },
}

const ORDER = 'udscbt'
const sortFlavours = (fs) => [...fs].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join('')
// baryon keys above use the order of the source table, so normalise both ways
const BARYON_INDEX = Object.fromEntries(Object.entries(BARYONS).map(([k, v]) => [sortFlavours(k.split('')), v]))

/**
 * Work out what a bag of quark tokens is.
 * Returns { kind, valid, hadron?, reason, charge3, baryon3 }
 */
export function identify(tokens) {
  const charge3 = tokens.reduce((s, t) => s + tokenCharge3(t), 0)
  const baryon3 = tokens.reduce((s, t) => s + (t.anti ? -1 : 1), 0) // baryon number × 3
  const q = tokens.filter((t) => !t.anti)
  const aq = tokens.filter((t) => t.anti)
  const base = { charge3, baryon3 }

  if (tokens.length === 0) return { ...base, kind: 'empty', valid: false, reason: 'Drop some quarks in to start.' }
  if (tokens.some((t) => t.f === 't'))
    return {
      ...base,
      kind: 'top',
      valid: false,
      reason: 'Top quarks decay in about 5 × 10⁻²⁵ s — faster than the strong force can bind them. No top hadrons exist.',
    }

  if (tokens.length === 3 && (q.length === 3 || aq.length === 3)) {
    const anti = aq.length === 3
    const key = sortFlavours(tokens.map((t) => t.f))
    const found = BARYON_INDEX[key]
    const hadron = found
      ? anti
        ? { ...found, name: `Anti${found.name.toLowerCase()}`, symbol: antiSymbol(found.symbol), note: 'The antimatter twin — same mass, opposite charge.' }
        : found
      : { name: anti ? 'An antibaryon' : 'A baryon', symbol: '?', mass: 'heavy & exotic', life: 'short', note: 'Colour-neutral and allowed — just not one of the famous ones listed here.' }
    return { ...base, kind: anti ? 'antibaryon' : 'baryon', valid: true, hadron, reason: 'Red + green + blue = colour-neutral. Allowed!' }
  }

  if (tokens.length === 2 && q.length === 1 && aq.length === 1) {
    const found = MESONS[`${q[0].f}|${aq[0].f}`]
    const hadron = found ?? { name: 'A meson', symbol: '?', mass: '—', life: '—', note: 'Colour-neutral and allowed.' }
    return { ...base, kind: 'meson', valid: true, hadron, reason: 'A colour and its anticolour cancel out. Allowed!' }
  }

  // everything else is not colour-neutral
  let reason = 'This combination can’t cancel its colour charge, so it can’t exist on its own.'
  if (tokens.length === 1) reason = 'A lone quark carries bare colour charge. Nature never allows that — this is “confinement”.'
  if (tokens.length === 2 && aq.length === 0) reason = 'Two quarks can’t cancel their colours. Add a third quark to make a baryon.'
  if (tokens.length === 2 && q.length === 0) reason = 'Two antiquarks can’t cancel their colours. Add a third to make an antibaryon.'
  if (tokens.length === 3) reason = 'Mix of quarks and antiquarks that isn’t colour-neutral. Try 3 quarks, 3 antiquarks, or 1 + 1.'
  return { ...base, kind: 'invalid', valid: false, reason }
}

function antiSymbol(sym) {
  // flip the charge superscript and add a bar
  const flipped = sym.replace('⁺⁺', '⁻⁻').replace(/⁺/g, '§').replace(/⁻(?!⁻)/g, '⁺').replace(/§/g, '⁻')
  const [first, ...rest] = [...flipped]
  return `${first}̄${rest.join('')}`
}

/** Suggested recipes for the “try these” buttons. */
export const RECIPES = [
  { label: 'Proton', tokens: 'u u d' },
  { label: 'Neutron', tokens: 'u d d' },
  { label: 'Pion⁺', tokens: 'u d̄' },
  { label: 'Kaon⁺', tokens: 'u s̄' },
  { label: 'Ω⁻', tokens: 's s s' },
  { label: 'J/ψ', tokens: 'c c̄' },
  { label: 'Antiproton', tokens: 'ū ū d̄' },
]

export const parseRecipe = (str) =>
  str
    .normalize('NFD') // 'ū' → 'u' + combining macron
    .split(' ')
    .map((s) => ({ f: s[0], anti: s.length > 1 }))
