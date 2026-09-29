import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Callout } from '../shells/Page.jsx'
import { confidenceBand, confidenceColour } from './aiConfidence.js'

/**
 * Shared vocabulary for the AI module. The PRD applies the same four rules to
 * every feature here, so they get one consistent treatment rather than eight:
 *   1. output is a forecast, never a guaranteed outcome
 *   2. no figure appears without a confidence indicator
 *   3. every figure cites the report it came from
 *   4. nothing financial or stock-affecting happens without human confirmation
 */

/** Never render a forecast figure without one of these beside it. */
export function ConfidenceMeter({ value, compact }) {
  const band = confidenceBand(value)
  const colour = confidenceColour(value)
  if (compact) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 42, height: 4, borderRadius: 'var(--radius-full)', background: 'var(--surface-sunken)', overflow: 'hidden', display: 'inline-block' }}>
          <span style={{ display: 'block', width: `${value}%`, height: '100%', background: colour }} />
        </span>
        <span style={{ font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{value}%</span>
      </span>
    )
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{band.label}</span>
        <span style={{ font: 'var(--fw-bold) var(--text-sm)/1 var(--font-mono)', color: colour }}>{value}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 'var(--radius-full)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: colour }} />
      </div>
    </div>
  )
}

/** Marks output as a projection, distinct from a recorded figure. */
export function ForecastBadge({ children = 'Forecast' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 8px',
      borderRadius: 'var(--radius-sm)', background: 'var(--accent-violet-bg)', color: 'var(--accent-violet-fg)',
      font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', whiteSpace: 'nowrap',
    }}>
      <Icon name="sparkles" size={11} color="var(--accent-violet-fg)" />
      {children}
    </span>
  )
}

/** Every data-backed figure names the report it came from. */
export function SourceCite({ sources = [] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, flexWrap: 'wrap' }}>
      <Icon name="link" size={12} color="var(--text-subtle)" style={{ marginTop: 3 }} />
      <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
        Drawn from {sources.map((s, i) => (
          <span key={s}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 'var(--fw-semibold)' }}>{s}</span>
            {i < sources.length - 2 ? ', ' : i === sources.length - 2 ? ' and ' : ''}
          </span>
        ))}.
      </span>
    </div>
  )
}

/** States the human-confirmation boundary the PRD requires on every AI feature. */
export function HumanReviewNotice({ action = 'act on a suggestion', children }) {
  return (
    <Callout tone="info" icon="user-round-check" title="Human confirmation required">
      {children || `Nothing here changes stock or money on its own. An authorised user must ${action} before anything is recorded, and the manual workflow stays fully available alongside it.`}
    </Callout>
  )
}

/** Shown where the model does not have enough history to be trusted. */
export function InsufficientData({ children }) {
  return (
    <Callout tone="warning" icon="triangle-alert" title="Not enough history to forecast">
      {children}
    </Callout>
  )
}

export function AITone({ tone, children }) {
  return <Badge tone={tone}>{children}</Badge>
}
