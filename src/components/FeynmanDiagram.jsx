import { motion } from 'framer-motion'
import Bar from './Bar'

/**
 * Draws a Feynman-style diagram and reveals it phase by phase.
 * `stage` = how many phases are visible (0–3). Lines whose phase < stage are drawn.
 */
const BOSON_COLOR = {
  photon: 'var(--color-gauge)',
  W: 'var(--color-gauge)',
  Z: 'var(--color-gauge)',
  gluon: 'var(--color-gauge)',
}

export default function FeynmanDiagram({ diagram, stage, runId }) {
  return (
    <svg viewBox="-24 0 648 362" className="h-auto w-full" role="img" aria-label={`Feynman diagram: ${diagram.equation}`}>
      {/* time arrow */}
      <g opacity="0.45">
        <path d="M60 350 H540" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 5" />
        <path d="M540 350 l-8 -4 v8 z" fill="var(--color-ink)" />
        <text x="300" y="344" textAnchor="middle" className="hand" fontSize="16" fill="var(--color-ink)">
          time →
        </text>
      </g>

      {diagram.braces?.map((b, i) => (
        <Brace key={i} {...b} visible={b.side === 'left' ? stage >= 1 : stage >= 3} />
      ))}

      {diagram.lines.map((l, i) => (
        <Line key={`${runId}-${i}`} line={l} visible={l.phase < stage} />
      ))}

      {diagram.vertices.map(([x, y], i) => (
        <motion.g key={`${runId}-v${i}`} initial={false} animate={{ scale: stage >= 2 ? 1 : 0 }} style={{ originX: `${x}px`, originY: `${y}px` }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.1 * i }}>
          <circle cx={x} cy={y} r="14" fill="var(--color-gauge)" opacity="0.25" />
          <circle cx={x} cy={y} r="6" fill="var(--color-ink)" />
        </motion.g>
      ))}
    </svg>
  )
}

/* ── line styles ─────────────────────────────────────────── */

function unit(from, to) {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const len = Math.hypot(dx, dy)
  return { len, ux: dx / len, uy: dy / len, px: -dy / len, py: dx / len }
}

function pathFor(line) {
  const { from, to, type } = line
  const { len, ux, uy, px, py } = unit(from, to)
  if (type === 'photon' || type === 'W' || type === 'Z') {
    const amp = type === 'photon' ? 7 : 9
    const wl = type === 'photon' ? 16 : 22
    const n = Math.max(20, Math.round(len / 3))
    const pts = []
    for (let i = 0; i <= n; i++) {
      const s = (i / n) * len
      const env = Math.min(1, s / 12, (len - s) / 12) // taper at the ends
      const o = Math.sin((s / wl) * Math.PI * 2) * amp * env
      pts.push(`${(from[0] + ux * s + px * o).toFixed(1)},${(from[1] + uy * s + py * o).toFixed(1)}`)
    }
    return `M${pts.join('L')}`
  }
  if (type === 'gluon') {
    const r = 8
    const loops = Math.max(4, Math.round(len / 18))
    const n = loops * 24
    const pts = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const a = t * loops * Math.PI * 2
      const along = t * len - r * Math.sin(a) * 0.9
      const side = r * (1 - Math.cos(a))
      pts.push(`${(from[0] + ux * along + px * side).toFixed(1)},${(from[1] + uy * along + py * side).toFixed(1)}`)
    }
    return `M${pts.join('L')}`
  }
  return `M${from[0]},${from[1]} L${to[0]},${to[1]}`
}

function Line({ line, visible }) {
  const d = pathFor(line)
  const { len, ux, uy, px, py } = unit(line.from, line.to)
  const isBoson = !['fermion', 'anti'].includes(line.type)
  const color = isBoson ? BOSON_COLOR[line.type] : 'var(--color-ink)'
  const mid = [line.from[0] + (ux * len) / 2, line.from[1] + (uy * len) / 2]
  const dir = line.type === 'anti' ? -1 : 1
  const labelOffset = line.span ? -12 : 18
  const lx = mid[0] + px * labelOffset * (isBoson ? 1.3 : 1)
  const ly = mid[1] + py * labelOffset * (isBoson ? 1.3 : 1)

  return (
    <g>
      {isBoson && (
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.25"
          initial={false}
          animate={{ pathLength: visible ? 1 : 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
      )}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={isBoson ? 2.5 : 3}
        strokeLinecap="round"
        strokeDasharray={line.type === 'Z' ? undefined : undefined}
        initial={false}
        animate={{ pathLength: visible ? 1 : 0, opacity: line.span && visible ? 0.45 : 1 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
      {/* fermion arrow (antiparticles point backwards in time) */}
      {!isBoson && (
        <motion.path
          d={`M${mid[0] + ux * 7 * dir},${mid[1] + uy * 7 * dir} L${mid[0] - ux * 6 * dir + px * 6},${mid[1] - uy * 6 * dir + py * 6} L${mid[0] - ux * 6 * dir - px * 6},${mid[1] - uy * 6 * dir - py * 6} Z`}
          fill="var(--color-ink)"
          initial={false}
          animate={{ opacity: visible ? (line.span ? 0.45 : 1) : 0 }}
          transition={{ delay: visible ? 0.5 : 0 }}
        />
      )}
      {/* travelling particle */}
      {visible && !line.span && (
        <circle r="6" fill={isBoson ? color : 'var(--color-paper)'} stroke="var(--color-ink)" strokeWidth="2.5">
          <animateMotion dur="0.9s" fill="freeze" path={d} />
          <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="0.9s" fill="freeze" />
        </circle>
      )}
      <motion.g initial={false} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }} transition={{ delay: visible ? 0.4 : 0 }}>
        <rect x={lx - 18} y={ly - 13} width="36" height="24" rx="12" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2" />
        <text x={lx} y={ly + 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-ink)">
          <Bar text={line.label} svg />
        </text>
      </motion.g>
    </g>
  )
}

function Brace({ x, y1, y2, label, side, visible }) {
  const s = side === 'left' ? -1 : 1
  const my = (y1 + y2) / 2
  const d = `M${x},${y1} q${8 * s},0 ${8 * s},12 V${my - 10} q0,10 ${8 * s},10 q${-8 * s},0 ${-8 * s},10 V${y2 - 12} q0,12 ${-8 * s},12`
  return (
    <motion.g initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.5 }}>
      <path d={d} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" transform={side === 'left' ? `translate(${-8},0)` : ''} />
      <text x={x + 26 * s} y={my + 6} textAnchor="middle" className="display" fontSize="22" fontWeight="600" fill="var(--color-ink)">
        {label}
      </text>
    </motion.g>
  )
}
