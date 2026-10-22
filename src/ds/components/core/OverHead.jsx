import { Input } from '../forms/Input.jsx'
import { Panel } from '../../../app/shells/Page.jsx'
import { overheadHeads } from '../../../app/sample.js'
import { money } from '../../../app/utils.js'

export const uid = () => Math.random().toString(36).slice(2)

/** Default overheads from sample.js, as editable rows. */
export const defaultOverheads = () =>
  overheadHeads.map((h) => ({ id: uid(), label: h.label, amount: String(h.value) }))

export const newOverhead = () => ({ id: uid(), label: '', amount: '' })

export const sumOverheads = (overheads) =>
  overheads.reduce((n, o) => n + (Number(o.amount) || 0), 0)

/** API shape. Overheads are only sent when Management can see costs. */
export const overheadsPayload = (overheads, canSeeCost) =>
  canSeeCost
    ? overheads
        .filter((o) => o.label.trim())
        .map((o) => ({ label: o.label.trim(), amount: Number(o.amount) || 0 }))
    : []

const buttonStyle = {
  height: 'var(--field-h)',
  padding: '0 14px',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  color: 'var(--text-strong)',
  font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
  cursor: 'pointer',
}

/** Editable overheads: edit, remove, add. Controlled by the parent. */
export function OverheadsEditor({ overheads, onChange, onAdd, onRemove }) {
  return (
    <Panel
      title="Overheads"
      description="Defaults are pre-filled. Edit an amount, remove a line, or add your own. These are sent with the costing."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {overheads.length === 0 && (
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            No overheads. Cost will be based on materials only.
          </div>
        )}

        {overheads.map((o, i) => (
          <div key={o.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <Input
                label={i === 0 ? 'Overhead' : undefined}
                placeholder="e.g. Direct labour"
                value={o.label}
                onChange={(e) => onChange(i, 'label', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label={i === 0 ? 'Amount' : undefined}
                type="number"
                placeholder="0"
                value={o.amount}
                onChange={(e) => onChange(i, 'amount', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${o.label || 'overhead'}`}
              style={{ ...buttonStyle, background: 'transparent', color: 'var(--text-muted)' }}
            >
              Remove
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <button type="button" onClick={onAdd} style={buttonStyle}>Add overhead</button>
          <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)' }}>
            Total overheads: {money(sumOverheads(overheads))}
          </div>
        </div>
      </div>
    </Panel>
  )
}