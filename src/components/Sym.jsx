/** Particle symbol with an optional subscript (ν + e → νₑ). */
export default function Sym({ p, className = '' }) {
  return (
    <span className={className}>
      {p.symbol}
      {p.sub && <sub className="text-[0.5em]">{p.sub}</sub>}
    </span>
  )
}
