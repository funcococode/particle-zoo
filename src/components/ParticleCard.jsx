import { motion } from 'framer-motion'
import { FAMILIES } from '../data/particles'
import { FAMILY_BG, FAMILY_COLOR, generationLabel, massPosition } from '../lib/family'
import Doodle from './Doodle'
import Sym from './Sym'

/**
 * A trading-card that flips in 3D. Front: doodle, symbol, name.
 * Back: the numbers (mass, charge, spin), what it does, and a fun fact.
 */
export default function ParticleCard({ particle: p, flipped, onFlip, className = '' }) {
  return (
    <div className={`group relative h-[460px] [perspective:1400px] ${className}`}>
      <motion.div
        role="button"
        tabIndex={0}
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onFlip()
          }
        }}
        aria-pressed={flipped}
        aria-label={`${p.name} card — ${flipped ? 'showing details, press to flip back' : 'press to see details'}`}
        className="preserve-3d relative h-full w-full cursor-pointer text-left"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        whileHover={{ y: -6 }}
      >
        <Front p={p} />
        <Back p={p} />
      </motion.div>
    </div>
  )
}

function Frame({ p, children, back = false }) {
  return (
    <div
      className={`backface-hidden shadow-ink absolute inset-0 flex flex-col overflow-hidden rounded-3xl border-[3px] border-ink bg-paper transition-shadow duration-300 group-hover:shadow-ink-lg ${
        back ? '[transform:rotateY(180deg)]' : ''
      }`}
    >
      <div className={`h-3 border-b-[3px] border-ink ${FAMILY_BG[p.family]}`} />
      {children}
    </div>
  )
}

function Front({ p }) {
  return (
    <Frame p={p}>
      <div className="flex items-center justify-between px-5 pt-4 text-xs font-semibold uppercase tracking-wider">
        <span className="chip !px-2.5 !py-0.5 !text-[11px]" style={{ background: `color-mix(in srgb, ${FAMILY_COLOR[p.family]} 25%, transparent)` }}>
          {FAMILIES[p.family].label.replace(/s$/, '')}
        </span>
        <span className="opacity-60">Gen {generationLabel(p.generation)}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <Doodle particle={p} className="h-56 w-56" />
        <span className="display pointer-events-none absolute right-5 top-2 text-6xl font-semibold opacity-90"><Sym p={p} /></span>
      </div>

      <div className="border-t-[3px] border-ink px-5 py-4">
        <h3 className="display text-3xl font-semibold leading-none">{p.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="hand text-xl opacity-70">{p.mass === '0' ? 'massless' : p.mass}</span>
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-60">
            Flip
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5" />
            </svg>
          </span>
        </div>
      </div>
    </Frame>
  )
}

function Back({ p }) {
  const stats = [
    ['Mass', p.mass === '0' ? '0' : p.mass],
    ['Charge', p.charge],
    ['Spin', p.spin],
  ]
  return (
    <Frame p={p} back>
      <div className="flex items-baseline justify-between px-5 pt-4">
        <h3 className="display text-2xl font-semibold">{p.name}</h3>
        <span className="display text-3xl font-semibold"><Sym p={p} /></span>
      </div>

      <dl className="mx-5 mt-3 grid grid-cols-3 overflow-hidden rounded-xl border-2 border-ink">
        {stats.map(([k, v], i) => (
          <div key={k} className={`px-2 py-2 text-center ${i < 2 ? 'border-r-2 border-ink' : ''}`}>
            <dt className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{k}</dt>
            <dd className="mt-0.5 text-sm font-bold leading-tight">{v}</dd>
          </div>
        ))}
      </dl>

      <MassBar p={p} />

      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-4 text-[13.5px] leading-snug">
        <p>
          <span className="font-bold">What it does · </span>
          {p.role}
        </p>
        <p className="rounded-xl border-2 border-dashed border-ink/40 p-2.5">
          <span className="hand mr-1 text-lg leading-none">Fun fact:</span>
          {p.fact}
        </p>
        <p className="text-xs opacity-70">
          <span className="font-semibold">Antiparticle:</span> {p.antiparticle}
          <br />
          <span className="font-semibold">Discovered:</span> {p.discovered} — {p.where}
        </p>
      </div>
    </Frame>
  )
}

/** Log-scale ruler from 1 eV to 1 TeV with a marker for this particle. */
function MassBar({ p }) {
  const pos = massPosition(p.massMeV)
  const ticks = ['eV', 'keV', 'MeV', 'GeV', 'TeV']
  return (
    <div className="mx-5 mt-3" aria-label={`Mass on a log scale: ${p.mass}`}>
      <div className="relative h-3 rounded-full border-2 border-ink bg-paper-2">
        {p.massMeV != null ? (
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pos * 100}%`, background: FAMILY_COLOR[p.family] }} />
        ) : null}
        <div
          className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ink bg-paper"
          style={{ left: `${pos * 100}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wider opacity-50">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}
