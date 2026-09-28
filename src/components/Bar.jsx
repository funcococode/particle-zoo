/**
 * Renders particle labels nicely:
 *  - combining macrons ("ν̄", "K̄⁰") become a real overline
 *  - "_x" becomes a subscript ("ν_μ" → ν with a subscript μ)
 * Use `svg` inside <text> elements.
 */
export default function Bar({ text, svg = false }) {
  const chars = [...String(text)]
  const out = []
  const over = { textDecoration: 'overline', textDecorationThickness: '0.08em' }
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    if (c === '_' && chars[i + 1]) {
      const sub = chars[i + 1]
      out.push(
        svg ? (
          <tspan key={i} baselineShift="sub" fontSize="70%">
            {sub}
          </tspan>
        ) : (
          <sub key={i} className="text-[0.65em]">
            {sub}
          </sub>
        ),
      )
      i++
    } else if (chars[i + 1] === '̄') {
      out.push(
        svg ? (
          <tspan key={i} style={over}>
            {c}
          </tspan>
        ) : (
          <span key={i} style={over}>
            {c}
          </span>
        ),
      )
      i++
    } else out.push(c)
  }
  return svg ? <>{out}</> : <span>{out}</span>
}
