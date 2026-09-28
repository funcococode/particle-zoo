import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FAMILIES, PARTICLES } from '../data/particles'
import { FAMILY_COLOR, generationLabel } from '../lib/family'
import Doodle from './Doodle'
import Sym from './Sym'

const ROUNDS = 10
const START_CLUES = 2
const BEST_KEY = 'pz-best'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Clues from hardest to easiest. None of them mention the particle’s name. */
function cluesFor(p) {
  const massClue =
    p.mass === '0' ? 'I have no mass at all.' : p.mass.startsWith('<') ? `Nobody knows my exact mass — only that it’s ${p.mass}.` : `I weigh about ${p.mass}.`
  const genClue = p.generation ? `I live in generation ${generationLabel(p.generation)}.` : 'I don’t belong to any generation — I carry or give something instead.'
  return [
    `I was discovered in ${p.discovered}.`,
    `My electric charge is ${p.charge === '0' ? 'zero' : p.charge}, and my spin is ${p.spin}.`,
    genClue,
    massClue,
    `I’m one of the ${FAMILIES[p.family].label.toLowerCase()}. ${FAMILIES[p.family].blurb}`,
  ]
}

/** Three distractors — mostly from the same family, to keep it honest. */
function optionsFor(p) {
  const same = shuffle(PARTICLES.filter((x) => x.id !== p.id && x.family === p.family))
  const other = shuffle(PARTICLES.filter((x) => x.family !== p.family))
  return shuffle([p, ...[...same.slice(0, 2), ...other].slice(0, 3)])
}

const rankFor = (score, max) => {
  const r = score / max
  if (r >= 0.9) return { title: 'Higgs-level genius', note: 'You give everything mass. Especially meaning.' }
  if (r >= 0.7) return { title: 'Boson boss', note: 'You carry the force. Impressive.' }
  if (r >= 0.45) return { title: 'Lepton lover', note: 'Light on your feet, heavy on curiosity.' }
  if (r >= 0.2) return { title: 'Quark apprentice', note: 'Confined for now — but with great potential energy.' }
  return { title: 'Neutrino', note: 'Passed straight through. Try again?' }
}

export default function Quiz() {
  const [order, setOrder] = useState(() => shuffle(PARTICLES).slice(0, ROUNDS))
  const [round, setRound] = useState(0)
  const [revealed, setRevealed] = useState(START_CLUES)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY)) || 0
    } catch {
      return 0
    }
  })

  const done = round >= ROUNDS
  const p = order[Math.min(round, ROUNDS - 1)]
  const clues = useMemo(() => cluesFor(p), [p])
  const options = useMemo(() => optionsFor(p), [p])
  const points = Math.max(1, 5 - (revealed - START_CLUES))
  const answered = picked !== null
  const correct = picked === p.id

  const choose = useCallback(
    (id) => {
      if (answered) return
      setPicked(id)
      if (id === p.id) {
        setScore((s) => s + points)
        setStreak((s) => s + 1)
      } else setStreak(0)
    },
    [answered, p.id, points],
  )

  const next = useCallback(() => {
    setPicked(null)
    setRevealed(START_CLUES)
    setRound((r) => r + 1)
  }, [])

  const restart = () => {
    setOrder(shuffle(PARTICLES).slice(0, ROUNDS))
    setRound(0)
    setScore(0)
    setStreak(0)
    setPicked(null)
    setRevealed(START_CLUES)
  }

  // save best score
  useEffect(() => {
    if (!done || score <= best) return
    setBest(score)
    try {
      localStorage.setItem(BEST_KEY, String(score))
    } catch {
      /* ignore */
    }
  }, [done, score, best])

  // keyboard: 1–4 to answer, H for a hint, Enter for next
  useEffect(() => {
    const onKey = (e) => {
      if (done || e.target.tagName === 'INPUT') return
      if (['1', '2', '3', '4'].includes(e.key)) choose(options[Number(e.key) - 1].id)
      if (e.key.toLowerCase() === 'h' && !answered) setRevealed((r) => Math.min(clues.length, r + 1))
      if (e.key === 'Enter' && answered) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, options, choose, answered, next, clues.length])

  if (done) return <Results score={score} max={ROUNDS * 5} best={best} onRestart={restart} />

  return (
    <section className="mx-auto max-w-4xl">
      {/* progress */}
      <div className="mb-6 flex items-center gap-4">
        <span className="text-sm font-bold">
          {round + 1}/{ROUNDS}
        </span>
        <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-paper">
          <motion.div className="h-full bg-ink" animate={{ width: `${(round / ROUNDS) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>
        <span className="chip bg-paper">Score {score}</span>
        {streak >= 2 && (
          <motion.span key={streak} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="chip bg-gauge">
            🔥 {streak}
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, x: 60, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          exit={{ opacity: 0, x: -60, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          className="shadow-ink-lg grid overflow-hidden rounded-3xl border-[3px] border-ink bg-paper md:grid-cols-[1fr_1.2fr]"
        >
          {/* mystery doodle */}
          <div className="relative flex min-h-[280px] items-center justify-center border-b-[3px] border-ink bg-paper-2 md:border-b-0 md:border-r-[3px]">
            {/* silhouette until answered — "who's that particle?" */}
            <motion.div key={answered ? 'shown' : 'hidden'} initial={{ scale: 0.9, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }}>
              <Doodle particle={p} silhouette={!answered} className="h-60 w-60" />
            </motion.div>
            {!answered && <span className="display absolute text-8xl font-bold text-paper">?</span>}
            <span className="hand absolute bottom-3 left-4 text-2xl opacity-70">{answered ? p.name : 'Which particle am I?'}</span>
          </div>

          {/* clues + answers */}
          <div className="flex flex-col p-5 md:p-7">
            <div className="flex items-center justify-between">
              <h2 className="display text-2xl font-semibold">Clues</h2>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Worth {answered ? '—' : `${points} pt${points > 1 ? 's' : ''}`}
              </span>
            </div>
            <ol className="mt-3 space-y-2">
              <AnimatePresence initial={false}>
                {clues.slice(0, revealed).map((c, i) => (
                  <motion.li
                    key={c}
                    initial={{ opacity: 0, height: 0, x: -10 }}
                    animate={{ opacity: 1, height: 'auto', x: 0 }}
                    className="flex gap-3 overflow-hidden text-[15px] leading-snug"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {c}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
            {!answered && revealed < clues.length && (
              <button
                onClick={() => setRevealed((r) => r + 1)}
                className="mt-3 self-start text-sm font-semibold underline decoration-2 underline-offset-4"
              >
                Reveal another clue (−1 pt) · H
              </button>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              {options.map((o, i) => {
                const isRight = answered && o.id === p.id
                const isWrong = answered && o.id === picked && !correct
                return (
                  <motion.button
                    key={o.id}
                    onClick={() => choose(o.id)}
                    disabled={answered}
                    whileHover={answered ? undefined : { y: -3 }}
                    whileTap={answered ? undefined : { scale: 0.96 }}
                    animate={isWrong ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`shadow-ink relative flex items-center gap-2 rounded-2xl border-[3px] border-ink px-3 py-3 text-left font-semibold transition-colors ${
                      isRight ? 'text-paper' : isWrong ? 'line-through opacity-60' : 'bg-paper'
                    } ${answered && !isRight && !isWrong ? 'opacity-50' : ''}`}
                    style={isRight ? { background: FAMILY_COLOR[o.family], color: 'var(--color-ink)' } : undefined}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink text-xs">{i + 1}</span>
                    <span className="leading-tight">
                      {o.name} <Sym p={o} className="opacity-60" />
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 border-t-2 border-dashed border-ink/40 pt-4">
                  <p className="hand text-3xl">{correct ? `Yes! +${points}` : `Nope — it was the ${p.name}.`}</p>
                  <p className="mt-1 text-sm leading-snug opacity-80">{p.fact}</p>
                  <button onClick={next} className="shadow-ink mt-4 rounded-full border-2 border-ink bg-ink px-5 py-2 font-semibold text-paper">
                    {round + 1 === ROUNDS ? 'See results' : 'Next particle'} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="mt-5 text-center text-xs opacity-60">Keys: 1–4 answer · H reveal a clue · Enter next</p>
    </section>
  )
}

function Results({ score, max, best, onRestart }) {
  const rank = rankFor(score, max)
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const text = `I scored ${score}/${max} on Particle Zoo and I'm a ${rank.title}! ⚛️`
    try {
      if (navigator.share) await navigator.share({ text, url: window.location.href })
      else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`)
        setCopied(true)
      }
    } catch {
      /* cancelled */
    }
  }
  const mascot = PARTICLES.find((p) => p.id === (score / max >= 0.9 ? 'higgs' : score / max >= 0.7 ? 'w' : score / max >= 0.45 ? 'electron' : score / max >= 0.2 ? 'up' : 'nu-e'))

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="shadow-ink-lg mx-auto max-w-xl rounded-3xl border-[3px] border-ink bg-paper p-8 text-center"
    >
      <Doodle particle={mascot} className="mx-auto h-48 w-48" />
      <p className="hand text-3xl opacity-70">you are a…</p>
      <h2 className="display text-5xl font-semibold">{rank.title}</h2>
      <p className="mt-2 opacity-80">{rank.note}</p>
      <p className="display mt-6 text-7xl font-bold">
        {score}
        <span className="text-3xl opacity-50">/{max}</span>
      </p>
      <p className="mt-1 text-sm opacity-60">Best: {Math.max(best, score)}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={onRestart} className="shadow-ink rounded-full border-2 border-ink bg-ink px-5 py-2 font-semibold text-paper">
          Play again
        </button>
        <button onClick={share} className="shadow-ink rounded-full border-2 border-ink bg-paper px-5 py-2 font-semibold">
          {copied ? 'Copied!' : 'Share score'}
        </button>
      </div>
    </motion.section>
  )
}
