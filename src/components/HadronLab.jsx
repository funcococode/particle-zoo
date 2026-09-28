import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { FLAVOURS, QUARKS, RECIPES, formatCharge3, identify, parseRecipe, tokenCharge3, tokenName } from '../data/hadrons'
import { byId } from '../data/particles'
import Doodle from './Doodle'
import Bar from './Bar'

/** Quark symbol; antiquarks get a real overline (combining macrons render badly in display fonts). */
function QSym({ t }) {
  return <span style={t.anti ? { textDecoration: 'overline', textDecorationThickness: '0.08em' } : undefined}>{QUARKS[t.f].symbol}</span>
}


// colour charges (and their anticolours) for drawing
const COLOURS = { r: '#e63946', g: '#2a9d8f', b: '#3a6ea5' }
const ANTI = { r: '#4dd6df', g: '#d45fa8', b: '#e9c46a' } // anti-red = cyan-ish, etc.
const PULL_TO_SNAP = 110

let uid = 0
const mk = (t) => ({ ...t, key: ++uid })
// a drag also ends with a click — ignore clicks that belong to a drag
let dragging = false

/** Drag quarks into the bag to build hadrons — and try to pull one back out. */
export default function HadronLab() {
  const [bag, setBag] = useState(() => parseRecipe('u u d').map(mk))
  const [snap, setSnap] = useState(null) // result of breaking the colour string
  const bagRef = useRef(null)
  const result = identify(bag)

  const add = (t) => {
    setSnap(null)
    setBag((b) => (b.length >= 3 ? b : [...b, mk(t)]))
  }
  const remove = (key) => {
    setSnap(null)
    setBag((b) => b.filter((x) => x.key !== key))
  }
  const load = (recipe) => {
    setSnap(null)
    setBag(parseRecipe(recipe).map(mk))
  }

  const droppedOnBag = (point) => {
    const r = bagRef.current?.getBoundingClientRect()
    if (!r) return false
    const x = point.x - window.scrollX
    const y = point.y - window.scrollY
    return x > r.left && x < r.right && y > r.top && y < r.bottom
  }

  /** Pulling a quark out: the gluon string snaps and makes a new q q̄ pair. */
  const pullOut = (key) => {
    if (!result.valid) return remove(key)
    const pulled = bag.find((x) => x.key === key)
    const f = Math.random() < 0.5 ? 'u' : 'd'
    // the escaping quark grabs the new antiquark (or vice versa) → a meson flies off
    const partner = { f, anti: !pulled.anti }
    const mesonTokens = pulled.anti ? [partner, pulled] : [pulled, partner]
    const meson = identify(mesonTokens)
    // the hadron keeps the other half of the pair in place of the pulled quark
    const replacement = mk({ f, anti: pulled.anti })
    const newBag = bag.map((x) => (x.key === key ? replacement : x))
    setBag(newBag)
    setSnap({ pulled, meson, mesonTokens, newHadron: identify(newBag).hadron })
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* palette */}
      <div className="flex flex-col gap-5">
        <Palette title="Quarks" anti={false} onAdd={add} onDrop={droppedOnBag} disabled={bag.length >= 3} />
        <Palette title="Antiquarks" anti onAdd={add} onDrop={droppedOnBag} disabled={bag.length >= 3} />
        <div className="shadow-ink rounded-2xl border-[3px] border-ink bg-paper p-4">
          <p className="hand mb-2 text-2xl leading-none">Try a recipe</p>
          <div className="flex flex-wrap gap-2">
            {RECIPES.map((r) => (
              <button key={r.label} onClick={() => load(r.tokens)} className="rounded-full border-2 border-ink bg-paper-2 px-3 py-1 text-sm font-semibold hover:bg-ink hover:text-paper">
                {r.label}{' '}
                <span className="opacity-60">
                  {parseRecipe(r.tokens).map((t, i) => (
                    <span key={i} className="mr-0.5">
                      <QSym t={t} />
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border-2 border-dashed border-ink/50 p-4 text-sm leading-snug">
          <p className="hand mb-1 text-2xl leading-none">Why no lone quarks?</p>
          Quarks carry <b>colour charge</b> (red, green, blue — nothing to do with real colour). Only colour-neutral combos can exist: three
          quarks (r+g+b) or a quark with an antiquark (colour + anticolour). Try <b>dragging a quark out of the bag</b> to see what happens.
        </div>
      </div>

      {/* bag + readout */}
      <div className="flex flex-col gap-5">
        <Bag bagRef={bagRef} bag={bag} result={result} onRemove={remove} onPull={pullOut} />
        <AnimatePresence>{snap && <SnapCard snap={snap} onClose={() => setSnap(null)} />}</AnimatePresence>
        <Readout bag={bag} result={result} />
      </div>
    </section>
  )
}

/* ── palette ─────────────────────────────────────────────── */

function Palette({ title, anti, onAdd, onDrop, disabled }) {
  return (
    <div className="shadow-ink rounded-2xl border-[3px] border-ink bg-paper p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <p className="display text-xl font-semibold">{title}</p>
        <p className="text-xs font-semibold opacity-60">{disabled ? 'Bag is full (max 3)' : 'Drag into the bag — or tap'}</p>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {FLAVOURS.map((f) => {
          const t = { f, anti }
          return (
            <motion.button
              key={f}
              drag={!disabled}
              dragSnapToOrigin
              dragElastic={0.6}
              whileDrag={{ scale: 1.15, zIndex: 30, rotate: 6 }}
              whileHover={{ y: -3 }}
              onDragStart={() => (dragging = true)}
              onDragEnd={(_, info) => {
                if (onDrop(info.point)) onAdd(t)
                setTimeout(() => (dragging = false), 80)
              }}
              onClick={() => !disabled && !dragging && onAdd(t)}
              className={`relative flex touch-none flex-col items-center rounded-xl border-2 border-ink bg-paper-2 px-1 pb-1.5 pt-1 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing'}`}
              aria-label={`Add ${tokenName(t)} quark (charge ${formatCharge3(tokenCharge3(t))})`}
            >
              <Doodle particle={byId[QUARKS[f].particle]} animated={false} className={`pointer-events-none h-12 w-12 ${anti ? 'hue-rotate-180' : ''}`} />
              <span className="display text-xl font-semibold leading-none"><QSym t={t} /></span>
              <span className="text-[10px] font-semibold opacity-60">{formatCharge3(tokenCharge3(t))}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ── the bag ─────────────────────────────────────────────── */

const SLOTS = {
  1: [[0, 0]],
  2: [
    [-70, 0],
    [70, 0],
  ],
  3: [
    [0, -72],
    [-72, 48],
    [72, 48],
  ],
}

function colourFor(bag, i, result) {
  const order = ['r', 'g', 'b']
  if (result.kind === 'meson') return bag[i].anti ? ANTI.r : COLOURS.r
  const c = order[i % 3]
  return bag[i].anti ? ANTI[c] : COLOURS[c]
}

function Bag({ bagRef, bag, result, onRemove, onPull }) {
  const [pulls, setPulls] = useState({}) // key → {x,y} while dragging
  const slots = SLOTS[bag.length] ?? []
  const ok = result.valid

  return (
    <div
      ref={bagRef}
      className={`shadow-ink-lg relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-3xl border-[3px] border-ink transition-colors md:h-[440px] ${
        ok ? 'bg-paper' : 'bg-paper-2'
      }`}
    >
      <p className="hand absolute left-4 top-3 text-2xl opacity-70">the bag</p>
      {/* hadron boundary */}
      <motion.div
        className="absolute rounded-full border-[3px] border-dashed"
        animate={{
          width: bag.length ? 300 : 200,
          height: bag.length ? 300 : 200,
          borderColor: ok ? 'var(--color-lepton)' : bag.length ? 'var(--color-quark)' : 'var(--color-ink)',
          rotate: 360,
        }}
        transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' }, default: { type: 'spring', stiffness: 120, damping: 14 } }}
        style={{ opacity: 0.6 }}
      />

      {/* gluon springs between quarks + stretched strings while pulling */}
      <svg className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2" viewBox="-230 -230 460 460">
        {slots.length > 1 &&
          slots.map((a, i) => {
            const b = slots[(i + 1) % slots.length]
            if (slots.length === 2 && i === 1) return null
            return <GluonLink key={i} a={a} b={b} />
          })}
        {bag.map((t, i) => {
          const p = pulls[t.key]
          if (!p || !ok) return null
          const [x, y] = slots[i]
          const dist = Math.hypot(p.x, p.y)
          const w = Math.max(2, 10 - dist / 16)
          return <line key={t.key} x1={0} y1={0} x2={x + p.x} y2={y + p.y} stroke="var(--color-gauge)" strokeWidth={w} strokeLinecap="round" opacity="0.8" />
        })}
      </svg>

      {bag.length === 0 && <p className="hand relative text-3xl opacity-60">drop quarks here</p>}

      <AnimatePresence>
        {bag.map((t, i) => {
          const [x, y] = slots[i]
          return (
            <motion.div
              key={t.key}
              className="absolute"
              initial={{ scale: 0, x, y }}
              animate={{ scale: 1, x, y }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <motion.button
                drag
                dragSnapToOrigin
                dragElastic={ok ? 0.35 : 0.9}
                onDrag={(_, info) => setPulls((s) => ({ ...s, [t.key]: { x: info.offset.x, y: info.offset.y } }))}
                onDragEnd={(_, info) => {
                  setPulls((s) => ({ ...s, [t.key]: null }))
                  if (Math.hypot(info.offset.x, info.offset.y) > PULL_TO_SNAP) onPull(t.key)
                }}
                onDoubleClick={() => onRemove(t.key)}
                whileDrag={{ scale: 1.1 }}
                className="relative flex h-22 w-22 touch-none cursor-grab flex-col items-center justify-center rounded-full border-[3px] border-ink bg-paper active:cursor-grabbing"
                style={{ boxShadow: `0 0 0 6px ${colourFor(bag, i, result)}` }}
                aria-label={`${tokenName(t)} quark — drag it out, double-click to remove`}
              >
                <span className="display text-3xl font-semibold leading-none"><QSym t={t} /></span>
                <span className="text-[11px] font-bold opacity-60">{formatCharge3(tokenCharge3(t))}</span>
              </motion.button>
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* colour-neutral indicator */}
      {bag.length > 0 && (
        <div className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-xs font-bold">
          <span className="flex">
            {bag.map((t, i) => (
              <span key={t.key} className="-ml-1 h-4 w-4 rounded-full border-2 border-ink first:ml-0" style={{ background: colourFor(bag, i, result) }} />
            ))}
          </span>
          {ok ? '= colour-neutral ✓' : 'not neutral ✗'}
        </div>
      )}
      <p className="absolute bottom-3 left-4 text-[11px] font-semibold opacity-50">double-click a quark to remove it</p>
    </div>
  )
}

function GluonLink({ a, b }) {
  // a springy wiggle between two quark positions
  const n = 60
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy)
  const px = -dy / len
  const py = dx / len
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const o = Math.sin(t * Math.PI * 10) * 7
    pts.push(`${(a[0] + dx * t + px * o).toFixed(1)},${(a[1] + dy * t + py * o).toFixed(1)}`)
  }
  return (
    <motion.path
      d={`M${pts.join('L')}`}
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.55"
      animate={{ pathOffset: [0, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      style={{ pathLength: 1 }}
    />
  )
}

/* ── readout ─────────────────────────────────────────────── */

function Readout({ bag, result }) {
  const h = result.hadron
  const baryon = result.baryon3 / 3
  return (
    <div className="shadow-ink rounded-2xl border-[3px] border-ink bg-paper p-5">
      <AnimatePresence mode="wait">
        <motion.div key={h ? h.name : result.kind + bag.length} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                {result.valid ? { baryon: 'Baryon', antibaryon: 'Antibaryon', meson: 'Meson' }[result.kind] : 'Not allowed'}
              </p>
              <h3 className="display text-4xl font-semibold leading-tight">{h ? h.name : result.kind === 'empty' ? 'Empty bag' : 'Not a hadron'}</h3>
            </div>
            {h && (
              <span className="display text-5xl font-semibold">
                <Bar text={h.symbol} />
              </span>
            )}
          </div>
          <p className={`mt-2 text-[15px] font-semibold ${result.valid ? 'text-lepton' : 'text-quark'}`}>{result.reason}</p>
          {h?.note && <p className="mt-2 text-sm opacity-80">{h.note}</p>}
        </motion.div>
      </AnimatePresence>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat k="Charge" v={formatCharge3(result.charge3)} sub={bag.length ? bag.map((t) => formatCharge3(tokenCharge3(t))).join(' ') : '—'} />
        <Stat k="Baryon no." v={bag.length ? (Number.isInteger(baryon) ? String(baryon) : `${result.baryon3}/3`) : '0'} sub="+⅓ per quark" />
        <Stat k="Mass" v={h?.mass ?? '—'} />
        <Stat k="Lifetime" v={h?.life ?? '—'} />
      </dl>
    </div>
  )
}

function Stat({ k, v, sub }) {
  return (
    <div className="rounded-xl border-2 border-ink px-3 py-2">
      <dt className="text-[10px] font-bold uppercase tracking-wider opacity-60">{k}</dt>
      <dd className="text-sm font-bold leading-tight">{v}</dd>
      {sub && <dd className="mt-0.5 text-[10px] opacity-60">{sub}</dd>}
    </div>
  )
}

function SnapCard({ snap, onClose }) {
  const { pulled, meson, mesonTokens, newHadron } = snap
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative rounded-2xl border-[3px] border-ink bg-gauge/25 p-5"
      role="status"
    >
      <button onClick={onClose} className="absolute right-3 top-2 text-xl font-bold" aria-label="Dismiss">
        ×
      </button>
      <p className="hand text-3xl leading-none">Snap! 💥</p>
      <p className="mt-2 text-[15px] leading-snug">
        Pulling the <b>{tokenName(pulled)}</b> stretched the gluon field until it held enough energy to create a new quark–antiquark pair. Instead of a free
        quark, you got a <b>{meson.hadron?.name ?? 'meson'}</b> (
        {mesonTokens.map((t, i) => (
          <span key={i}>
            <QSym t={t} />
          </span>
        ))}
        ) flying off
        {newHadron ? (
          <>
            {' '}
            — and the bag is now a <b>{newHadron.name}</b>.
          </>
        ) : (
          '.'
        )}
      </p>
      <p className="mt-2 text-xs opacity-70">This is confinement: you can never isolate a single quark. At colliders this is why quarks show up as “jets” of hadrons.</p>
    </motion.div>
  )
}
