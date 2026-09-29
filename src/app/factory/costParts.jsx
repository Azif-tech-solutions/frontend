import { Icon } from '../../ds/components/core/Icon.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { Panel, MetaRow, Callout, MaskedValue } from '../shells/Page.jsx'
import { overheadHeads } from '../sample.js'
import { fmt, money } from '../utils.js'

/**
 * Design scaffold that lets both authorisation states be reviewed on one screen.
 * Real builds derive visibility from the signed-in user's role — remove this control.
 */
export function PreviewAsRole({ role, onChange, restrictedLabel = 'Quality Control' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Preview as</span>
      <Segmented
        options={[
          { value: 'restricted', label: restrictedLabel, icon: 'flask-conical' },
          { value: 'mgmt', label: 'Management', icon: 'shield-check' },
        ]}
        value={role}
        onChange={onChange}
        size="sm"
      />
    </div>
  )
}

/**
 * Landing / production cost breakdown. Every figure masks for roles that may not
 * see cost, so the cycle can be completed in full without the values being exposed.
 */
export function CostSummaryPanel({
  canSeeCost, title = 'Landing cost', materialLabel = 'Material & recipe cost',
  unitLabel = 'Unit landing cost', materialCost, overhead, totalCost, qtyProduced, unitCost,
}) {
  const row = (label, value) =>
    canSeeCost
      ? <MetaRow label={label} value={money(value)} mono />
      : <MetaRow label={label} value={<MaskedValue />} />

  return (
    <Panel title={title}>
      {row(materialLabel, materialCost)}
      {row('Overheads', overhead)}
      {row('Total production cost', totalCost)}
      <MetaRow label="Quantity produced" value={qtyProduced ? fmt(qtyProduced) : '—'} mono />
      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: canSeeCost ? 'var(--brand-subtle)' : 'var(--surface-sunken)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{unitLabel}</div>
        <div style={{ marginTop: 8 }}>
          {canSeeCost ? (
            <span style={{ font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
              {qtyProduced ? money(unitCost) : '—'}
            </span>
          ) : (
            <MaskedValue chars={9} align="left" />
          )}
        </div>
      </div>
    </Panel>
  )
}

/** Explains why the figures are masked, shown only to restricted roles. */
export function CostWithheldNotice({ title, children }) {
  return (
    <Callout tone="info" icon="lock" title={title}>{children}</Callout>
  )
}

/** Overhead heads that roll into cost beyond material consumption. */
export function OverheadsPanel({ canSeeCost }) {
  return (
    <Panel title="Overheads" description="Costs beyond material consumption that roll into the production cost.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 32px' }}>
        {overheadHeads.map((h) => (
          canSeeCost
            ? <MetaRow key={h.key} label={h.label} value={money(h.value)} mono />
            : <MetaRow key={h.key} label={h.label} value={<MaskedValue />} />
        ))}
      </div>
    </Panel>
  )
}

/** Prior runs listed beside the one being costed; figures hide for restricted roles. */
export function PriorRunsPanel({ title = 'Recent costings', runs = [], canSeeCost }) {
  return (
    <Panel title={title} padding={0}>
      <div style={{ padding: '4px 16px 12px' }}>
        {runs.map((p) => (
          <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{p.meta}</div>
            </div>
            {canSeeCost
              ? <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-body)', flexShrink: 0 }}>{money(p.cost)}</span>
              : <Icon name="lock" size={12} color="var(--text-subtle)" />}
          </div>
        ))}
      </div>
    </Panel>
  )
}
