import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { STARTERS, decaysOf, rollMode, tokenInfo } from '../data/decays'
import { byId } from '../data/particles'
import Doodle from './Doodle'
import Bar from './Bar'

let uid = 0
const node = (token) => ({ key: ++uid, token, mode: null, children: [] })

/** Immutable update of the node with `key` anywhere in the tree. */
function update(tree, key, fn) {
  if (tree.key === key) return fn(tree)
  return { ...tree, children: tree.children.map((c) => update(c, key, fn)) }
}

/** Decay a node (and optionally its whole subtree) at random. */
function simulate(n, depth = 0) {
  const info = decaysOf(n.token)
  // muons fly out of real detectors before decaying — stop there when simulating
  if (!info || depth > 6 || n.token.replace('*', '').startsWith('mu')) return n
  const mode = rollMode(info.modes)
  return { ...n, mode, children: mode.p.map((t) => simulate(node(t), depth + 1)) }
}

function leaves(n, out = []) {
  if (!n.children.length) out.push(n)
  n.children.forEach((c) => leaves(c, out))
  return out
}

export default function DecayChains() {
  const [tree, setTree] = useState(() => node('H'))

  const start = (token) => setTree(node(token))
  const choose = (key, mode) => setTree((t) => update(t, key, (n) => ({ ...n, mode, children: mode.p.map(node) })))
  const collapse = (key) => setTree((t) => update(t, key, (n) => ({ ...n, mode: null, children: [] })))
  const roll = (key) => setTree((t) => update(t, key, (n) => simulate({ ...n, mode: null, children: [] })))

  return (
    <section>
      {/* starters */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {STARTERS.map((tok) => {
          const info = tokenInfo(tok)
          const active = tree.token === tok
          return (
            <motion.button
              key={tok}
              onClick={() => start(tok)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.96 }}
              aria-pressed={active}
              className={`shadow-ink flex flex-col items-center rounded-2xl border-[3px] border-ink p-2 ${active ? 'bg-ink text-paper' : 'bg-paper'}`}
            >
              <Doodle particle={byId[info.particle]} animated={false} className="h-16 w-16" />
              <span className="display text-2xl font-semibold leading-none">{info.label}</span>
              <span className="mt-1 text-[11px] font-semibold opacity-70">{info.name}</span>
            </motion.button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="shadow-ink-lg overflow-x-auto rounded-3xl border-[3px] border-ink bg-paper p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="hand text-2xl leading-none">tap a particle to decay it</p>
            <div className="flex gap-2">
              <button onClick={() => roll(tree.key)} className="rounded-full border-2 border-ink bg-ink px-4 py-1.5 text-sm font-semibold text-paper">
                🎲 Let nature decide
              </button>
              <button onClick={() => start(tree.token)} className="rounded-full border-2 border-ink bg-paper px-4 py-1.5 text-sm font-semibold">
                Reset
              </button>
            </div>
          </div>
          <NodeView n={tree} onChoose={choose} onCollapse={collapse} onRoll={roll} root />
        </div>

        <Summary tree={tree} />
      </div>
    </section>
  )
}

/* ── one node in the tree ────────────────────────────────── */

function NodeView({ n, onChoose, onCollapse, onRoll, root = false }) {
  const info = tokenInfo(n.token)
  const decays = decaysOf(n.token)
  const [open, setOpen] = useState(root)

  const status = !decays
    ? info.invisible
      ? 'escapes unseen'
      : info.jet
        ? '→ jet of hadrons'
        : info.stable
          ? 'stable'
          : ''
    : n.mode
      ? `lived ~${decays.life}`
      : 'unstable — tap to decay'

  return (
    <motion.div layout="position" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
      <button
        onClick={() => (decays ? (n.mode ? onCollapse(n.key) : setOpen((o) => !o)) : undefined)}
        className={`flex items-center gap-2 rounded-2xl border-2 border-ink px-2 py-1.5 text-left ${decays ? (n.mode ? 'bg-paper-2' : 'bg-gauge/25 hover:bg-gauge/40') : 'bg-paper'} ${
          info.virtual ? 'border-dashed' : ''
        }`}
        aria-expanded={decays ? open || !!n.mode : undefined}
        title={n.mode ? 'Tap to undo this decay' : undefined}
      >
        <Doodle particle={byId[info.particle]} animated={false} className={`h-9 w-9 shrink-0 ${info.anti ? 'hue-rotate-180' : ''}`} />
        <span>
          <span className="display text-xl font-semibold leading-none">
            <Bar text={info.label} />
          </span>
          <span className="block text-[11px] font-semibold leading-tight opacity-70">
            {info.virtual ? 'virtual · ' : ''}
            {status}
          </span>
        </span>
      </button>

      {/* mode picker */}
      <AnimatePresence>
        {decays && !n.mode && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 w-[min(100%,26rem)] rounded-2xl border-2 border-ink bg-paper p-3">
              <p className="mb-2 text-xs font-semibold opacity-70">
                Lives about {decays.life}. How does it decay?
              </p>
              <ul className="space-y-1.5">
                {decays.modes.map((m, i) => (
                  <li key={i}>
                    <button onClick={() => onChoose(n.key, m)} className="group w-full text-left">
                      <span className="flex items-center justify-between gap-3 text-sm font-semibold">
                        <span>
                          → <Bar text={m.p.map((t) => tokenInfo(t).label).join(' + ')} />
                        </span>
                        <span className="tabular-nums opacity-70">{m.br < 1 ? m.br.toFixed(m.br < 0.1 ? 3 : 2) : m.br}%</span>
                      </span>
                      <span className="mt-0.5 block h-2 overflow-hidden rounded-full border border-ink/40 bg-paper-2">
                        <motion.span
                          className="block h-full bg-gauge group-hover:bg-ink"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(1.5, m.br)}%` }}
                          transition={{ duration: 0.6, delay: i * 0.04 }}
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => onRoll(n.key)} className="mt-3 text-sm font-semibold underline decoration-2 underline-offset-4">
                🎲 roll it for me
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* children */}
      {n.mode && (
        <div className="ml-4 mt-2 border-l-[3px] border-ink/70 pl-4">
          <p className="mb-2 text-xs font-semibold opacity-70">
            {n.mode.br}% of the time{n.mode.note ? ` · ${n.mode.note}` : ''}
          </p>
          <div className="flex flex-col gap-2">
            {n.children.map((c) => (
              <div key={c.key} className="relative">
                <span className="absolute -left-4 top-5 h-[3px] w-3 bg-ink/70" />
                <NodeView n={c} onChoose={onChoose} onCollapse={onCollapse} onRoll={onRoll} />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── what a detector would see ───────────────────────────── */

function Summary({ tree }) {
  const ls = leaves(tree)
  const pending = ls.filter((n) => decaysOf(n.token) && !n.token.startsWith('mu'))
  const counts = { jets: 0, electrons: 0, muons: 0, taus: 0, photons: 0, neutrinos: 0 }
  ls.forEach((n) => {
    const i = tokenInfo(n.token)
    const t = n.token.replace('*', '')
    if (i.jet || ['b', 'bbar', 'c', 'cbar', 'q', 'qbar'].includes(t)) counts.jets += 1
    else if (t === 'em' || t === 'ep') counts.electrons += 1
    else if (t.startsWith('mu')) counts.muons += 1
    else if (t.startsWith('tau')) counts.taus += 1
    else if (t === 'gamma') counts.photons += 1
    else if (i.invisible) counts.neutrinos += 1
  })
  const rows = [
    ['Jets of hadrons', counts.jets, 'quarks & gluons dress up as sprays of particles'],
    ['Electrons / positrons', counts.electrons, 'stopped in the calorimeter'],
    ['Muons', counts.muons, 'punch through to the outer muon chambers'],
    ['Taus', counts.taus, 'decay almost instantly'],
    ['Photons', counts.photons, 'bright flashes in the calorimeter'],
    ['Neutrinos', counts.neutrinos, 'invisible — show up as “missing energy”'],
  ].filter(([, v]) => v > 0)

  return (
    <aside className="flex flex-col gap-4">
      <div className="shadow-ink rounded-2xl border-[3px] border-ink bg-paper p-5">
        <p className="hand mb-3 text-2xl leading-none">What the detector sees</p>
        {tree.children.length === 0 ? (
          <p className="text-sm opacity-70">Nothing yet — decay the particle on the left.</p>
        ) : (
          <ul className="space-y-2">
            {rows.map(([k, v, note]) => (
              <li key={k} className="flex items-start justify-between gap-3 border-b border-dashed border-ink/30 pb-2 last:border-0">
                <span>
                  <span className="font-semibold">{k}</span>
                  <span className="block text-xs opacity-60">{note}</span>
                </span>
                <span className="display text-2xl font-semibold">×{v}</span>
              </li>
            ))}
          </ul>
        )}
        {pending.length > 0 && tree.children.length > 0 && (
          <p className="mt-3 rounded-xl bg-gauge/25 px-3 py-2 text-xs font-semibold">
            {pending.length} particle{pending.length > 1 ? 's' : ''} still waiting to decay (orange).
          </p>
        )}
      </div>
      <div className="rounded-2xl border-2 border-dashed border-ink/50 p-4 text-sm leading-snug">
        <p className="hand mb-1 text-2xl leading-none">Why so fast?</p>
        The heavier a particle, the more ways it has to fall apart — so the Higgs, top, W and Z last less than 10⁻²¹ seconds. Nobody ever sees them directly;
        physicists rebuild them from the pieces in this box. Dashed boxes are <b>virtual</b> particles that only exist mid-decay.
      </div>
    </aside>
  )
}
