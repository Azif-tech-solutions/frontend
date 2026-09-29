import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { stockKindOf } from '../sample.js'

/**
 * The name and kind of the stock a card covers, shown beside the card's own
 * title. Without it a card is a table of numbers with nothing saying what
 * stock it belongs to, or which refill that stock arrives on.
 */
export function CardIdentity({ group, suffix }) {
  const kind = stockKindOf(group.kind)
  return (
    <>
      <Badge tone="brand" uppercase>{group.label}{suffix ? ` · ${suffix}` : ''}</Badge>
      <Badge tone={kind.tone}>{kind.label}</Badge>
    </>
  )
}

/** Shown above every group card so the reader knows what the group contains. */
export function GroupMembers({ group }) {
  const kind = stockKindOf(group.kind)
  return (
    <Panel
      title={`Stock — ${group.label}`}
      description={`Every transaction involving any member below is recorded as a single entry on this card.`}
      actions={<Badge tone={kind.tone}>{kind.label}</Badge>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px', marginBottom: 14 }}>
        <div>
          <MetaRow label="Stock name" value={group.label} />
          <MetaRow label="Stock type" value={kind.label} />
        </div>
        <div>
          <MetaRow label="Brand" value={group.brand} />
          <MetaRow label="Unit" value={group.unit || '—'} />
        </div>
      </div>

      <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
        Members on this card
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {group.members.map((m) => (
          <span key={m} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px',
            background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)', font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', color: 'var(--text-body)',
          }}>
            <Icon name={group.kind === 'raw' ? 'box' : 'package'} size={13} color="var(--text-subtle)" />
            {group.label} {m}
          </span>
        ))}
      </div>
    </Panel>
  )
}
