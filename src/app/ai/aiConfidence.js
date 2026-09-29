// Confidence banding shared across the AI module. Kept out of aiParts.jsx so
// that file exports components only and stays fast-refresh friendly.

export const CONFIDENCE = {
  high: { label: 'High confidence', tone: 'success', min: 80 },
  medium: { label: 'Medium confidence', tone: 'warning', min: 55 },
  low: { label: 'Low confidence', tone: 'danger', min: 0 },
}

export function confidenceBand(pct) {
  if (pct >= CONFIDENCE.high.min) return CONFIDENCE.high
  if (pct >= CONFIDENCE.medium.min) return CONFIDENCE.medium
  return CONFIDENCE.low
}

/** Colour token for a confidence percentage. */
export function confidenceColour(pct) {
  const band = confidenceBand(pct)
  return band.tone === 'success' ? 'var(--success)' : band.tone === 'warning' ? 'var(--warning)' : 'var(--danger)'
}
