import { motion } from 'framer-motion'
import { useId, useMemo } from 'react'
import { FAMILY_COLOR } from '../lib/family'

/**
 * Hand-drawn-looking particle mascots. Every doodle is plain SVG pushed
 * through a turbulence filter so the lines wobble like ink on paper.
 * Shape, size and mood come from the particle's `doodle` field.
 */
export default function Doodle({ particle, className = '', animated = true, silhouette = false }) {
  const uid = useId().replace(/:/g, '')
  const { doodle, family } = particle
  const color = FAMILY_COLOR[family]
  const seed = useMemo(() => [...particle.id].reduce((a, c) => a + c.charCodeAt(0), 0) % 97, [particle.id])
  const Shape = SHAPES[doodle.shape] ?? Blob

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`Doodle of the ${particle.name}`}>
      <defs>
        <filter id={`sketch-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale="3.5" result="sketched" />
          {/* silhouette mode: every colour becomes solid ink */}
          {silhouette && (
            <feColorMatrix in="sketched" type="matrix" values="0 0 0 0 0.106  0 0 0 0 0.102  0 0 0 0 0.09  0 0 0 14 0" />
          )}
        </filter>
      </defs>
      {/* ground shadow */}
      <ellipse cx="100" cy="182" rx={30 + doodle.size * 50} ry="6" fill="var(--color-ink)" opacity="0.08" />
      <motion.g
        filter={`url(#sketch-${uid})`}
        animate={animated ? { y: [0, -5, 0] } : undefined}
        transition={{ duration: 3 + (seed % 5) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Shape d={doodle} color={color} seed={seed} animated={animated} />
      </motion.g>
    </svg>
  )
}

const INK = 'var(--color-ink)'

/* ── helpers ─────────────────────────────────────────────── */

function wobblyCircle(cx, cy, r, seed, amp = 0.05) {
  const pts = []
  for (let i = 0; i <= 64; i++) {
    const t = (i / 64) * Math.PI * 2
    const k = 1 + amp * Math.sin(3 * t + seed) + amp * 0.6 * Math.sin(5 * t + seed * 2)
    pts.push(`${(cx + Math.cos(t) * r * k).toFixed(1)},${(cy + Math.sin(t) * r * k).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}

function Face({ cx, cy, s, mood }) {
  const ex = s * 0.34
  const ey = cy - s * 0.12
  const er = Math.max(3, s * 0.09)
  const my = cy + s * 0.22
  const mw = s * 0.28
  const stroke = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', fill: 'none' }

  const eye = (x, kind) => {
    switch (kind) {
      case 'closed':
        return <path d={`M${x - er} ${ey} q${er} ${er * 0.9} ${er * 2} 0`} {...stroke} />
      case 'cross':
        return <path d={`M${x - er} ${ey - er}l${er * 2} ${er * 2}M${x + er} ${ey - er}l${-er * 2} ${er * 2}`} {...stroke} />
      case 'big':
        return (
          <g>
            <circle cx={x} cy={ey} r={er * 1.5} fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx={x} cy={ey + 1} r={er * 0.7} fill={INK} />
          </g>
        )
      case 'down':
        return <circle cx={x} cy={ey + er * 0.6} r={er * 0.8} fill={INK} />
      case 'proud':
        return <path d={`M${x - er} ${ey + 2} q${er} ${-er * 1.2} ${er * 2} 0`} {...stroke} />
      default:
        return (
          <g>
            <circle cx={x} cy={ey} r={er} fill={INK} />
            <circle cx={x + er * 0.35} cy={ey - er * 0.35} r={er * 0.3} fill="#fff" />
          </g>
        )
    }
  }

  const eyes = {
    happy: ['dot', 'dot'],
    sleepy: ['closed', 'closed'],
    wink: ['dot', 'closed'],
    dizzy: ['cross', 'cross'],
    proud: ['proud', 'proud'],
    calm: ['dot', 'dot'],
    surprised: ['big', 'big'],
    shy: ['down', 'down'],
    determined: ['dot', 'dot'],
  }[mood] ?? ['dot', 'dot']

  const mouth = {
    happy: <path d={`M${cx - mw} ${my} q${mw} ${s * 0.22} ${mw * 2} 0`} {...stroke} />,
    proud: <path d={`M${cx - mw} ${my - 2} q${mw} ${s * 0.3} ${mw * 2} 0`} {...stroke} fill={INK} />,
    wink: <path d={`M${cx - mw * 0.8} ${my} q${mw * 0.8} ${s * 0.18} ${mw * 1.6} 0`} {...stroke} />,
    sleepy: <circle cx={cx} cy={my + 2} r={s * 0.06} {...stroke} />,
    dizzy: <path d={`M${cx - mw} ${my} q${mw / 2} -6 ${mw} 0 t${mw} 0`} {...stroke} />,
    calm: <path d={`M${cx - mw * 0.6} ${my + 2} h${mw * 1.2}`} {...stroke} />,
    surprised: <ellipse cx={cx} cy={my + 3} rx={s * 0.08} ry={s * 0.11} fill={INK} />,
    shy: <path d={`M${cx - mw * 0.5} ${my} q${mw * 0.5} ${s * 0.1} ${mw} 0`} {...stroke} />,
    determined: <path d={`M${cx - mw * 0.7} ${my + 4} q${mw * 0.7} ${-s * 0.1} ${mw * 1.4} 0`} {...stroke} />,
  }[mood]

  const blush = ['happy', 'proud', 'shy', 'wink'].includes(mood)

  return (
    <g>
      {blush && (
        <g fill="#f28b9b" opacity="0.55">
          <ellipse cx={cx - ex - er * 1.4} cy={my - s * 0.08} rx={s * 0.1} ry={s * 0.06} />
          <ellipse cx={cx + ex + er * 1.4} cy={my - s * 0.08} rx={s * 0.1} ry={s * 0.06} />
        </g>
      )}
      {mood === 'determined' && (
        <path d={`M${cx - ex - er * 1.4} ${ey - er * 2.2} l${er * 2.4} ${er}M${cx + ex + er * 1.4} ${ey - er * 2.2} l${-er * 2.4} ${er}`} {...stroke} />
      )}
      {eye(cx - ex, eyes[0])}
      {eye(cx + ex, eyes[1])}
      {mouth}
    </g>
  )
}

/* ── shapes ──────────────────────────────────────────────── */

/** Quarks: a squishy blob with three little colour-charge moons. */
function Blob({ d, color, seed, animated }) {
  const r = 26 + d.size * 50
  const cy = 110
  return (
    <g>
      <path d={wobblyCircle(100, cy, r, seed)} fill={color} fillOpacity="0.28" stroke={INK} strokeWidth="3.5" />
      <path d={wobblyCircle(100 - r * 0.25, cy - r * 0.3, r * 0.28, seed + 3, 0.1)} fill="#fff" opacity="0.5" />
      <Face cx={100} cy={cy} s={r} mood={d.mood} />
      {d.colorCharge && (
        <motion.g
          style={{ originX: '100px', originY: `${cy}px` }}
          animate={animated ? { rotate: 360 } : undefined}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          {['#e63946', '#2a9d8f', '#3a6ea5'].map((c, i) => {
            const a = (i / 3) * Math.PI * 2 - Math.PI / 2
            return (
              <circle
                key={c}
                cx={100 + Math.cos(a) * (r + 14)}
                cy={cy + Math.sin(a) * (r + 14)}
                r="6"
                fill={c}
                stroke={INK}
                strokeWidth="2"
              />
            )
          })}
        </motion.g>
      )}
    </g>
  )
}

/** Charged leptons: a round orb with an electron-cloud orbit. */
function Orb({ d, color, seed, animated }) {
  const r = 24 + d.size * 48
  const cy = 108
  return (
    <g>
      <ellipse cx="100" cy={cy} rx={r + 30} ry="16" fill="none" stroke={INK} strokeWidth="2" strokeDasharray="5 6" transform={`rotate(-18 100 ${cy})`} />
      <circle cx="100" cy={cy} r={r} fill={color} fillOpacity="0.28" stroke={INK} strokeWidth="3.5" />
      <circle cx={100 - r * 0.35} cy={cy - r * 0.35} r={r * 0.22} fill="#fff" opacity="0.5" />
      <Face cx={100} cy={cy} s={r} mood={d.mood} />
      <motion.g
        style={{ originX: '100px', originY: `${cy}px` }}
        animate={animated ? { rotate: [0, 360] } : undefined}
        transition={{ duration: 5 + (seed % 3), repeat: Infinity, ease: 'linear' }}
      >
        <g transform={`rotate(-18 100 ${cy})`}>
          <circle cx={100 + r + 30} cy={cy} r="7" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d={`M${100 + r + 26} ${cy}h8`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </motion.g>
    </g>
  )
}

/** Neutrinos: shy, see-through ghosts. */
function Ghost({ d, color, animated }) {
  const w = 44 + d.size * 60
  const top = 60
  const bottom = 150
  const x0 = 100 - w / 2
  const waves = 4
  const seg = w / waves
  let wave = `M${x0 + w} ${bottom}`
  for (let i = 0; i < waves; i++) wave += ` q${-seg / 4} 12 ${-seg / 2} 0 t${-seg / 2} 0`
  const path = `M${x0} ${bottom} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x0 + w} ${top + w / 2} V${bottom} ${wave.slice(wave.indexOf('q') - 1)}Z`
  return (
    <motion.g animate={animated ? { opacity: [1, 0.55, 1] } : undefined} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
      <path d={path} fill={color} fillOpacity="0.14" stroke={INK} strokeWidth="3" strokeDasharray="7 5" strokeLinejoin="round" />
      <Face cx={100} cy={top + w * 0.55} s={w * 0.55} mood={d.mood} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${x0 - 16 - i * 8} ${top + 40 + i * 22}h-${14 - i * 3}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      ))}
    </motion.g>
  )
}

/** Photon: a travelling wave packet with a little face at the front. */
function Wave({ d, color, animated }) {
  const pts = []
  for (let x = -40; x <= 150; x += 4) {
    const env = Math.exp(-Math.pow((x - 70) / 70, 2))
    pts.push(`${x},${(100 - Math.sin(x / 9) * 30 * env).toFixed(1)}`)
  }
  const path = `M${pts.join('L')}`
  return (
    <g>
      <clipPath id="photon-clip">
        <rect x="10" y="40" width="150" height="120" />
      </clipPath>
      <g clipPath="url(#photon-clip)">
        <motion.g animate={animated ? { x: [0, 18, 0] } : undefined} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
          <path d={path} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.45" />
          <path d={path} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </motion.g>
      </g>
      <circle cx="160" cy="100" r="22" fill={color} fillOpacity="0.35" stroke={INK} strokeWidth="3.5" />
      <Face cx={160} cy={100} s={22} mood={d.mood} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${186 + i * 2} ${86 + i * 14}l8 ${-2 + i * 2}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      ))}
    </g>
  )
}

/** Gluon: a springy coil that squishes and stretches. */
function Spring({ d, color, animated }) {
  const pts = []
  const loops = 6
  for (let i = 0; i <= 240; i++) {
    const t = i / 240
    const a = t * Math.PI * 2 * loops
    pts.push(`${(30 + t * 110 + Math.cos(a) * 12).toFixed(1)},${(105 + Math.sin(a) * 26).toFixed(1)}`)
  }
  return (
    <g>
      <motion.g
        style={{ originX: '30px', originY: '105px' }}
        animate={animated ? { scaleX: [1, 0.82, 1] } : undefined}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d={`M${pts.join('L')}`} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" opacity="0.4" />
        <path d={`M${pts.join('L')}`} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </motion.g>
      <circle cx="160" cy="105" r="24" fill={color} fillOpacity="0.35" stroke={INK} strokeWidth="3.5" />
      <Face cx={160} cy={105} s={24} mood={d.mood} />
      <circle cx="26" cy="105" r="7" fill={INK} />
    </g>
  )
}

/** W and Z: heavy, chunky blocks (W comes as a +/− pair). */
function Block({ d, color }) {
  const one = (cx, w, sign, key) => {
    const h = w * 0.9
    const y = 170 - h
    return (
      <g key={key}>
        <rect x={cx - w / 2} y={y} width={w} height={h} rx="14" fill={color} fillOpacity="0.3" stroke={INK} strokeWidth="3.5" />
        <rect x={cx - w / 2 + 8} y={y + 8} width={w * 0.3} height="8" rx="4" fill="#fff" opacity="0.55" />
        <Face cx={cx} cy={y + h * 0.5} s={w * 0.45} mood={d.mood} />
        {sign && (
          <g>
            <circle cx={cx + w / 2 - 4} cy={y + 4} r="11" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <path d={`M${cx + w / 2 - 10} ${y + 4}h12${sign === '+' ? `M${cx + w / 2 - 4} ${y - 2}v12` : ''}`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}
        {/* little feet — it’s heavy */}
        <path d={`M${cx - w / 4} 170v6M${cx + w / 4} 170v6`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
    )
  }
  if (d.twins) return <g>{[one(64, 70, '+', 'a'), one(138, 70, '−', 'b')]}</g>
  return <g>{one(100, 60 + d.size * 50, null, 'z')}</g>
}

/** Higgs: a proud blob wading through a crowd of field “dots”. */
function Crowd({ d, color, seed, animated }) {
  const dots = useMemo(() => {
    const out = []
    for (let y = 30; y <= 180; y += 18) {
      for (let x = 14; x <= 186; x += 18) {
        const jx = ((x * 7 + y * 13 + seed) % 7) - 3
        const jy = ((x * 11 + y * 5 + seed) % 7) - 3
        const dist = Math.hypot(x - 100, y - 110)
        if (dist > 58) out.push({ x: x + jx, y: y + jy, dist })
      }
    }
    return out
  }, [seed])
  const r = 30 + d.size * 22
  return (
    <g>
      {dots.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3.2"
          fill={INK}
          opacity="0.35"
          animate={animated ? { scale: [1, 1.6, 1] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity, delay: p.dist / 70, ease: 'easeInOut' }}
          style={{ originX: `${p.x}px`, originY: `${p.y}px` }}
        />
      ))}
      <path d={wobblyCircle(100, 110, r, seed, 0.04)} fill={color} fillOpacity="0.4" stroke={INK} strokeWidth="3.5" />
      <Face cx={100} cy={110} s={r} mood={d.mood} />
      {/* tiny crown */}
      <path d={`M${100 - 16} ${110 - r - 2} l6 -16 l10 10 l10 -10 l6 16 z`} fill={color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  )
}

const SHAPES = { blob: Blob, orb: Orb, ghost: Ghost, wave: Wave, spring: Spring, block: Block, crowd: Crowd }
