import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { INTERACTIONS } from '../data/interactions'
import FeynmanDiagram from './FeynmanDiagram'
import Bar from './Bar'

const STEP_MS = 1500
const fmt = (q) => (q > 0 ? `+${q}` : q < 0 ? `−${Math.abs(q)}` : '0')

/** Pick a process and watch its Feynman diagram play out, step by step. */
export default function Interactions() {
  const [active, setActive] = useState(INTERACTIONS[0].id)
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [runId, setRunId] = useState(0)
  const timer = useRef(null)
  const diagram = INTERACTIONS.find((d) => d.id === active)

  const play = useCallback(() => {
    clearInterval(timer.current)
    setRunId((r) => r + 1)
    setStage(0)
    setPlaying(true)
    let s = 0
    timer.current = setInterval(() => {
      s += 1
      setStage(s)
      if (s >= 3) {
        clearInterval(timer.current)
        setPlaying(false)
      }
    }, STEP_MS)
    // show the first phase almost immediately
    setTimeout(() => setStage((x) => Math.max(x, 1)), 150)
  }, [])

  useEffect(() => {
    play()
    return () => clearInterval(timer.current)
  }, [active, play])

  const jump = (s) => {
    clearInterval(timer.current)
    setPlaying(false)
    setStage(s)
  }

  const before = diagram.before.reduce((a, p) => a + p.charge, 0)
  const after = diagram.after.reduce((a, p) => a + p.charge, 0)

  return (
    <section>
      {/* process picker */}
      <div className="mb-6 flex flex-wrap gap-2">
        {INTERACTIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setActive(d.id)}
            aria-pressed={active === d.id}
            className={`rounded-full border-2 border-ink px-3.5 py-1.5 text-sm font-semibold transition-colors ${active === d.id ? 'bg-ink text-paper' : 'bg-paper hover:bg-paper-2'}`}
          >
            {d.title}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* diagram */}
        <div className="shadow-ink-lg overflow-hidden rounded-3xl border-[3px] border-ink bg-paper">
          <div className="flex items-center justify-between border-b-[3px] border-ink px-5 py-3">
            <p className="display text-xl font-semibold md:text-2xl">
              <Bar text={diagram.equation} />
            </p>
            <span className="chip bg-gauge/30 !text-xs">{diagram.force}</span>
          </div>
          <div className="px-2 pt-4 md:px-6">
            <FeynmanDiagram diagram={diagram} stage={stage} runId={`${active}-${runId}`} />
          </div>

          {/* step captions */}
          <div className="border-t-[3px] border-ink p-5">
            <div className="mb-3 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => jump(s)}
                  aria-label={`Show step ${s}`}
                  className={`h-2.5 flex-1 rounded-full border-2 border-ink transition-colors ${stage >= s ? 'bg-ink' : 'bg-paper'}`}
                />
              ))}
              <button onClick={play} className="ml-2 rounded-full border-2 border-ink bg-ink px-4 py-1 text-sm font-semibold text-paper">
                {playing ? 'Playing…' : '↺ Replay'}
              </button>
            </div>
            <div className="min-h-[3.5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${active}-${stage}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-[15px] leading-snug"
                >
                  {stage === 0 ? 'Get ready…' : (
                    <>
                      <span className="mr-2 font-bold">Step {stage}.</span>
                      {diagram.captions[stage - 1]}
                    </>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* info panel */}
        <div className="flex flex-col gap-4">
          <InfoCard title="In the real world">
            <p className="text-[15px] leading-snug">{diagram.realWorld}</p>
          </InfoCard>

          <InfoCard title="Charge check">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
              <Side items={diagram.before} total={before} />
              <span className="display text-2xl">→</span>
              <Side items={diagram.after} total={after} />
            </div>
            <p className="mt-3 text-center text-sm font-semibold">
              {before === after ? `✓ Charge is conserved: ${fmt(before)} = ${fmt(after)}` : '✗ Charge not conserved'}
            </p>
          </InfoCard>

          <InfoCard title="How to read it">
            <ul className="space-y-2 text-sm">
              <Legend kind="fermion">Matter particle (arrow = direction in time)</Legend>
              <Legend kind="anti">Antiparticle — drawn with the arrow pointing backwards</Legend>
              <Legend kind="wave">Photon, W or Z — force carriers</Legend>
              <Legend kind="dot">Vertex — where particles meet and change</Legend>
            </ul>
          </InfoCard>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ title, children }) {
  return (
    <div className="shadow-ink rounded-2xl border-[3px] border-ink bg-paper p-5">
      <p className="hand mb-2 text-2xl leading-none">{title}</p>
      {children}
    </div>
  )
}

function Side({ items, total }) {
  return (
    <div className="rounded-xl border-2 border-ink p-2">
      <div className="flex flex-wrap justify-center gap-1.5">
        {items.map((p, i) => (
          <span key={i} className="rounded-md bg-paper-2 px-1.5 py-0.5 text-sm font-bold">
            <Bar text={p.label} />
            <sup className="ml-0.5 text-[10px] opacity-60">{fmt(p.charge)}</sup>
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-xs font-semibold opacity-70">total {fmt(total)}</p>
    </div>
  )
}

function Legend({ kind, children }) {
  const icon = {
    fermion: <path d="M4 10 H36 M22 10 l-6 -4 v8 z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" />,
    anti: <path d="M4 10 H36 M16 10 l6 -4 v8 z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" />,
    wave: <path d="M4 10 q4 -7 8 0 t8 0 t8 0 t8 0" stroke="currentColor" strokeWidth="2.5" fill="none" />,
    dot: <circle cx="20" cy="10" r="5" fill="currentColor" />,
  }[kind]
  return (
    <li className="flex items-center gap-3">
      <svg width="40" height="20" viewBox="0 0 40 20" className="shrink-0">
        {icon}
      </svg>
      <span>{children}</span>
    </li>
  )
}
