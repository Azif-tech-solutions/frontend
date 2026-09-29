import { Icon } from '../../ds/components/core/Icon.jsx'

/** Content column every screen sits in. */
export function Page({ children, wide }) {
  return (
    <div style={{ padding: '28px var(--gutter) 72px', maxWidth: wide ? 1560 : 'var(--content-max)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {children}
    </div>
  )
}

/** White hairline card — the universal container. */
export function Panel({ title, description, actions, children, padding = 20, style }) {
  const hasHead = title || actions
  return (
    <section style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden', ...style }}>
      {hasHead && (
        <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && <div style={{ font: 'var(--fw-bold) var(--text-md)/1.3 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{title}</div>}
            {description && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{description}</div>}
          </div>
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{actions}</div>}
        </header>
      )}
      {children != null && <div style={{ padding }}>{children}</div>}
    </section>
  )
}

/** Labelled group of fields inside a form. */
export function FieldSet({ legend, hint, columns = 2, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {legend && (
        <div>
          <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{legend}</div>
          {hint && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 4 }}>{hint}</div>}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 14 }} className="zq-fieldgrid">
        {children}
      </div>
    </div>
  )
}

/** Label : value row — the standard way to render dense record data. */
export function MetaRow({ label, value, mono, tone }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ flex: '0 0 auto', minWidth: 150, font: 'var(--fw-medium) var(--text-sm)/1.4 var(--font-ui)', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{
        flex: 1, textAlign: 'right',
        font: mono ? 'var(--fw-semibold) var(--text-sm)/1.4 var(--font-mono)' : 'var(--fw-semibold) var(--text-sm)/1.4 var(--font-ui)',
        fontVariantNumeric: mono ? 'tabular-nums' : undefined,
        color: tone === 'positive' ? 'var(--success)' : tone === 'negative' ? 'var(--danger)' : 'var(--text-strong)',
      }}>{value}</span>
    </div>
  )
}

/** KPI strip. stats: { label, value, delta?, tone?, hint? }[] */
export function StatRow({ stats = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: 14 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', padding: '16px 18px' }}>
          <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</div>
          <div style={{ marginTop: 10, font: 'var(--fw-bold) var(--text-2xl)/1.05 var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{s.value}</div>
          {(s.delta || s.hint) && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              {s.delta && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', color: s.tone === 'negative' ? 'var(--danger)' : s.tone === 'warning' ? 'var(--warning)' : 'var(--success)' }}>
                  <Icon name={s.tone === 'negative' ? 'trending-down' : 'trending-up'} size={12} />
                  {s.delta}
                </span>
              )}
              {s.hint && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{s.hint}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const CALLOUT = {
  info: { bg: 'var(--info-bg)', fg: 'var(--accent-blue-fg)', icon: 'info' },
  warning: { bg: 'var(--warning-bg)', fg: 'var(--accent-amber-fg)', icon: 'triangle-alert' },
  danger: { bg: 'var(--danger-bg)', fg: '#8A1C21', icon: 'octagon-alert' },
  success: { bg: 'var(--success-bg)', fg: 'var(--accent-green-fg)', icon: 'circle-check' },
  neutral: { bg: 'var(--surface-card)', fg: 'var(--text-muted)', icon: 'info', border: '1px solid var(--border-default)' },
}

/** Tinted inline notice — permissions, restrictions, data caveats. */
export function Callout({ tone = 'info', icon, title, children, style }) {
  const t = CALLOUT[tone] || CALLOUT.info
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: 12, background: t.bg, border: t.border, borderRadius: 'var(--radius-md)', ...style }}>
      <Icon name={icon || t.icon} size={14} color={t.fg} style={{ marginTop: 1 }} />
      <div style={{ minWidth: 0 }}>
        {title && <div style={{ font: 'var(--fw-bold) var(--text-xs)/1.4 var(--font-ui)', color: t.fg, marginBottom: 3 }}>{title}</div>}
        <div style={{ font: 'var(--type-caption)', color: t.fg, lineHeight: 1.55 }}>{children}</div>
      </div>
    </div>
  )
}

/** Column label carrying a lock glyph — the value is visible only to authorised roles. */
export function RestrictedLabel({ children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      {children}
      <Icon name="lock" size={10} color="var(--text-subtle)" />
    </span>
  )
}

/**
 * Stands in for a cost figure the current role may not see. Deliberately shows
 * that a value exists and is withheld, rather than rendering a misleading zero.
 */
export function MaskedValue({ chars = 6, align = 'right' }) {
  return (
    <span
      title="Hidden — visible to Management and Administration only"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        font: 'var(--fw-bold) var(--text-sm)/1 var(--font-mono)', color: 'var(--text-subtle)', letterSpacing: '0.12em',
      }}
    >
      {'•'.repeat(chars)}
      <Icon name="lock" size={11} color="var(--text-subtle)" />
    </span>
  )
}

/**
 * Restricted-column notice. Cost and value columns must be hidden or zeroed for
 * users without authorisation — an acceptance criterion on nearly every report.
 */
export function RestrictedColumnsNotice({ children }) {
  return (
    <Callout tone="neutral" icon="lock" title="Cost and value columns hidden">
      {children || (
        <>Your role does not permit landing cost or stock value visibility, so those columns are omitted from this
          report and from any export you generate. Quantity columns are unaffected.</>
      )}
    </Callout>
  )
}

/** No-records / not-yet state. */
export function EmptyState({ icon = 'inbox', title, description, action, compact }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', textAlign: 'center', padding: compact ? '32px 20px' : '64px 20px', gap: 4 }}>
      <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', marginBottom: 10 }}>
        <Icon name={icon} size={19} color="var(--text-subtle)" />
      </span>
      <div style={{ font: 'var(--fw-semibold) var(--text-md)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{title}</div>
      {description && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', maxWidth: '46ch', marginTop: 2 }}>{description}</div>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  )
}
