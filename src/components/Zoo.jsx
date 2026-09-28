import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { FAMILIES, PARTICLES } from '../data/particles'
import { FAMILY_COLOR } from '../lib/family'
import ChartView from './ChartView'
import ParticleCard from './ParticleCard'

const FILTERS = [{ id: 'all', label: 'All 17' }, ...Object.entries(FAMILIES).map(([id, f]) => ({ id, label: f.label }))]
const SORTS = [
  { id: 'family', label: 'Family' },
  { id: 'mass', label: 'Lightest first' },
  { id: 'year', label: 'Discovery year' },
]

/** The browsable zoo: filter, sort, search and flip every card. */
export default function Zoo() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('family')
  const [query, setQuery] = useState('')
  const [flipped, setFlipped] = useState(() => new Set())
  const [view, setView] = useState('cards')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = PARTICLES.filter((p) => filter === 'all' || p.family === filter)
    if (q) out = out.filter((p) => `${p.name} ${p.symbol} ${p.family} ${p.role}`.toLowerCase().includes(q))
    if (sort === 'mass') out = [...out].sort((a, b) => (a.massMeV ?? 0) - (b.massMeV ?? 0))
    if (sort === 'year') out = [...out].sort((a, b) => a.discovered - b.discovered)
    return out
  }, [filter, sort, query])

  const toggle = (id) =>
    setFlipped((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const allFlipped = list.length > 0 && list.every((p) => flipped.has(p.id))
  const flipAll = () => setFlipped(allFlipped ? new Set() : new Set(list.map((p) => p.id)))

  return (
    <section>
      {/* controls */}
      <div className="shadow-ink z-20 mb-8 md:sticky md:top-3 flex flex-col gap-3 rounded-2xl border-[3px] border-ink bg-paper/95 p-3 backdrop-blur md:flex-row md:items-center md:justify-between">
        <LayoutGroup id="filters">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by family">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className="relative rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-semibold"
              >
                {filter === f.id && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: f.id === 'all' ? 'var(--color-ink)' : FAMILY_COLOR[f.id] }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative ${filter === f.id && f.id === 'all' ? 'text-paper' : ''}`}>{f.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div className="flex flex-wrap items-center gap-2">
          <label className="relative">
            <span className="sr-only">Search particles</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-36 rounded-full border-2 border-ink bg-paper px-3.5 py-1.5 text-sm outline-none placeholder:opacity-50 focus:w-48 md:transition-[width]"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort"
            className="rounded-full border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="flex overflow-hidden rounded-full border-2 border-ink text-sm font-semibold">
            {['cards', 'chart'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-3 py-1.5 capitalize ${view === v ? 'bg-ink text-paper' : ''}`}
              >
                {v}
              </button>
            ))}
          </div>
          {view === 'cards' && (
            <button onClick={flipAll} className="rounded-full border-2 border-ink bg-ink px-3.5 py-1.5 text-sm font-semibold text-paper">
              {allFlipped ? 'Flip all back' : 'Flip all'}
            </button>
          )}
        </div>
      </div>

      {view === 'chart' ? (
        <ChartView />
      ) : (
        <>
          <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 40, rotate: -3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 160, damping: 20, delay: Math.min(i, 8) * 0.03 }}
                >
                  <ParticleCard particle={p} flipped={flipped.has(p.id)} onFlip={() => toggle(p.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {list.length === 0 && (
            <p className="hand py-20 text-center text-3xl opacity-70">No particle by that name… maybe it’s dark matter?</p>
          )}
        </>
      )}
    </section>
  )
}
