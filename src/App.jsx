import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Doodle from './components/Doodle'
import Quiz from './components/Quiz'
import Zoo from './components/Zoo'
import { byId } from './data/particles'

const TABS = [
  { id: 'zoo', label: 'The Zoo' },
  { id: 'quiz', label: 'Which particle am I?' },
]

// the hash keeps the tab shareable: /#quiz opens straight into the quiz
const fromHash = () => (window.location.hash === '#quiz' ? 'quiz' : 'zoo')

export default function App() {
  const [tab, setTab] = useState(fromHash)

  useEffect(() => {
    const onHash = () => setTab(fromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (id) => {
    window.location.hash = id === 'quiz' ? 'quiz' : ''
    setTab(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <Header tab={tab} go={go} />
        <Hero tab={tab} />
        <AnimatePresence mode="wait">
          <motion.main
            key={tab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            {tab === 'zoo' ? <Zoo /> : <Quiz />}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
    </MotionConfig>
  )
}

function Header({ tab, go }) {
  return (
    <header className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
      <button onClick={() => go('zoo')} className="flex items-center gap-3" aria-label="Particle Zoo home">
        <Logo />
        <span className="display text-2xl font-semibold">Particle Zoo</span>
      </button>
      <LayoutGroup id="tabs">
        <nav className="flex rounded-full border-[3px] border-ink bg-paper p-1" aria-label="Mode">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => go(t.id)} aria-current={tab === t.id} className="relative rounded-full px-4 py-1.5 text-sm font-semibold">
              {tab === t.id && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className={`relative ${tab === t.id ? 'text-paper' : ''}`}>{t.label}</span>
            </button>
          ))}
        </nav>
      </LayoutGroup>
    </header>
  )
}

function Logo() {
  return (
    <motion.svg viewBox="0 0 64 64" className="h-10 w-10" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
      <circle cx="32" cy="32" r="7" fill="var(--color-ink)" />
      {['var(--color-quark)', 'var(--color-lepton)', 'var(--color-gauge)'].map((c, i) => (
        <ellipse key={c} cx="32" cy="32" rx="26" ry="9" fill="none" stroke={c} strokeWidth="4" transform={`rotate(${i * 60} 32 32)`} />
      ))}
    </motion.svg>
  )
}

function Hero({ tab }) {
  const cast = ['up', 'electron', 'photon', 'higgs', 'nu-e', 'gluon']
  return (
    <section className="relative mb-10 mt-4 grid items-center gap-6 md:grid-cols-[1.3fr_1fr]">
      <div>
        <p className="hand text-2xl opacity-70">a field guide to everything that exists (so far)</p>
        <h1 className="display mt-1 text-6xl font-semibold leading-[0.95] md:text-8xl">
          {tab === 'quiz' ? (
            <>
              Which particle <em className="italic">am I?</em>
            </>
          ) : (
            <>
              The <em className="italic">Particle</em> Zoo
            </>
          )}
        </h1>
        <p className="mt-4 max-w-lg text-lg opacity-80">
          {tab === 'quiz'
            ? 'Read the clues, guess the silhouette. Fewer clues, more points — ten particles per round.'
            : 'Meet the 17 residents of the Standard Model — the quarks, leptons and bosons that everything is made of. Flip a card to see what makes each one tick.'}
        </p>
      </div>
      <div className="relative hidden h-64 md:block" aria-hidden>
        {cast.map((id, i) => (
          <motion.div
            key={id}
            className="absolute"
            style={{ left: `${[4, 38, 64, 18, 52, 76][i]}%`, top: `${[4, 0, 18, 46, 52, 62][i]}%` }}
            initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: [-6, 6, -4][i % 3] }}
            transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.1 + i * 0.08 }}
          >
            <Doodle particle={byId[id]} className="h-28 w-28" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-20 flex flex-col justify-between gap-2 border-t-[3px] border-ink pt-6 text-sm opacity-80 md:flex-row">
      <span>
        Data: Particle Data Group, <em>Review of Particle Physics</em> (2024). Neutrino masses are upper limits.
      </span>
      <span>
        Built by <span className="font-semibold">Rachit Shrivastava</span>
      </span>
    </footer>
  )
}
