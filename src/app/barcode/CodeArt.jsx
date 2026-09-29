/**
 * Visual stand-ins for a printed code. Bar widths and module positions are
 * derived deterministically from the code's characters so the same value always
 * draws the same mark — but this is a preview, not a real EAN-13 or QR
 * encoding. The scannable encoding is applied by the label renderer at print.
 */

const hash = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function BarcodeMark({ value, height = 54, width = 200 }) {
  const seed = hash(value)
  const bars = []
  let x = 0
  let i = 0
  while (x < width && i < 96) {
    const w = 1 + ((seed >> (i % 24)) & 3)
    const isBar = ((seed >> (i % 29)) & 1) === 1 || i % 5 === 0
    if (isBar && x + w <= width) bars.push({ x, w })
    x += w + 1
    i += 1
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Barcode preview for ${value}`}>
      <rect width={width} height={height} fill="#fff" />
      {bars.map((b, bi) => (
        <rect key={bi} x={b.x} y={0} width={b.w} height={height} fill="var(--n-950)" />
      ))}
    </svg>
  )
}

export function QRMark({ value, size = 72 }) {
  const seed = hash(value)
  const grid = 13
  const cell = size / grid
  const cells = []
  for (let r = 0; r < grid; r += 1) {
    for (let c = 0; c < grid; c += 1) {
      const inFinder =
        (r < 4 && c < 4) || (r < 4 && c > grid - 5) || (r > grid - 5 && c < 4)
      if (inFinder) continue
      const bit = (seed >> ((r * grid + c) % 31)) & 1
      const alt = (r * 7 + c * 13 + (seed % 17)) % 3
      if (bit && alt !== 0) cells.push({ r, c })
    }
  }
  const finder = (ox, oy) => (
    <g key={`${ox}-${oy}`}>
      <rect x={ox * cell} y={oy * cell} width={cell * 3.5} height={cell * 3.5} fill="var(--n-950)" />
      <rect x={(ox + 0.7) * cell} y={(oy + 0.7) * cell} width={cell * 2.1} height={cell * 2.1} fill="#fff" />
      <rect x={(ox + 1.2) * cell} y={(oy + 1.2) * cell} width={cell * 1.1} height={cell * 1.1} fill="var(--n-950)" />
    </g>
  )
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`QR preview for ${value}`}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map((c, i) => (
        <rect key={i} x={c.c * cell} y={c.r * cell} width={cell} height={cell} fill="var(--n-950)" />
      ))}
      {finder(0, 0)}
      {finder(grid - 3.5, 0)}
      {finder(0, grid - 3.5)}
    </svg>
  )
}

/** Chooses the right mark for an item's symbology. */
export function CodeMark({ value, symbology, ...rest }) {
  if (!value) return null
  return symbology === 'QR' ? <QRMark value={value} {...rest} /> : <BarcodeMark value={value} {...rest} />
}
