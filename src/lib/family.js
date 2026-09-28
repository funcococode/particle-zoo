// Colour + label helpers shared by cards, doodles and the quiz.
export const FAMILY_COLOR = {
  quark: 'var(--color-quark)',
  lepton: 'var(--color-lepton)',
  gauge: 'var(--color-gauge)',
  scalar: 'var(--color-scalar)',
}

export const FAMILY_BG = {
  quark: 'bg-quark',
  lepton: 'bg-lepton',
  gauge: 'bg-gauge',
  scalar: 'bg-scalar',
}

/** Position of a mass on a log scale from 1 eV (0) to 1 TeV (1). */
export const massPosition = (massMeV) => {
  if (massMeV == null) return 0
  const lo = Math.log10(1e-6) // 1 eV in MeV
  const hi = Math.log10(1e6) // 1 TeV in MeV
  return Math.min(1, Math.max(0, (Math.log10(massMeV) - lo) / (hi - lo)))
}

export const generationLabel = (g) => (g ? ['I', 'II', 'III'][g - 1] : '—')
