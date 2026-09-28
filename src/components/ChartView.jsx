import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { byId } from '../data/particles'
import { FAMILY_COLOR } from '../lib/family'
import Doodle from './Doodle'
import Sym from './Sym'
import ParticleCard from './ParticleCard'

// The classic Standard Model chart: 3 generations × (2 quark rows + 2 lepton rows),
// force carriers in the 4th column, Higgs on the side.
const GRID = [
  ['up', 'charm', 'top', 'gluon'],
  ['down', 'strange', 'bottom', 'photon'],
  ['electron', 'muon', 'tau', 'z'],
  ['nu-e', 'nu-mu', 'nu-tau', 'w'],
]

export default function ChartView() {
  const [open, setOpen] = useState(null)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const show = (id) => {
    setFlipped(false)
    setOpen(id)
  }

  return (
    <div>
      <div className="overflow-x-auto pb-4">
        <div className="mx-auto grid min-w-[720px] max-w-5xl grid-cols-[auto_repeat(4,1fr)_1fr] gap-3">
          {/* column heads */}
          <span />
          {['I', 'II', 'III'].map((g) => (
            <span key={g} className="text-center text-xs font-bold uppercase tracking-wider opacity-60">
              Generation {g}
            </span>
          ))}
          <span className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Force carriers</span>
          <span className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Scalar</span>

          {GRID.map((row, r) => (
            <Row key={r} r={r} row={row} onPick={show} />
          ))}
        </div>
      </div>
      <p className="hand mt-4 text-center text-2xl opacity-70">tap any tile to meet the particle →</p>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              className="w-full max-w-sm"
              initial={{ scale: 0.8, y: 40, rotate: -4 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={byId[open].name}
            >
              <ParticleCard particle={byId[open]} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
              <button
                onClick={() => setOpen(null)}
                className="mx-auto mt-5 block rounded-full border-2 border-paper px-4 py-1.5 text-sm font-semibold text-paper"
              >
                Close (Esc)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ r, row, onPick }) {
  const label = ['Quarks', '', 'Leptons', ''][r]
  return (
    <>
      <span className="flex items-center justify-end pr-1 text-xs font-bold uppercase tracking-wider opacity-60 [writing-mode:vertical-rl] rotate-180">
        {label}
      </span>
      {row.map((id, c) => (
        <Tile key={id} p={byId[id]} i={r * 4 + c} onPick={onPick} />
      ))}
      {r === 0 ? (
        <div className="row-span-4 flex items-center">
          <Tile p={byId.higgs} i={16} onPick={onPick} tall />
        </div>
      ) : null}
    </>
  )
}

function Tile({ p, i, onPick, tall = false }) {
  return (
    <motion.button
      onClick={() => onPick(p.id)}
      className={`shadow-ink relative flex w-full flex-col justify-between rounded-2xl border-[3px] border-ink bg-paper p-3 text-left ${
        tall ? 'aspect-[3/4]' : 'aspect-square'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: i * 0.03 }}
      whileHover={{ y: -4, rotate: i % 2 ? 1.5 : -1.5 }}
      whileTap={{ scale: 0.96 }}
      style={{ background: `color-mix(in srgb, ${FAMILY_COLOR[p.family]} 18%, var(--color-paper))` }}
    >
      <span className="text-[10px] font-semibold leading-tight opacity-70">{p.mass === '0' ? '0' : p.mass}</span>
      <Doodle particle={p} animated={false} className="absolute right-1 top-1 h-12 w-12 opacity-90" />
      <Sym p={p} className="display text-4xl font-semibold leading-none" />
      <span className="text-xs font-semibold leading-tight">{p.name}</span>
    </motion.button>
  )
}
