import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { factories, finishedProducts, rawMaterials, adjustmentReasons, liveQuantities, recentAdjustments } from '../sample.js'

const MODES = [
  { value: 'delta', label: 'Adjust by quantity', icon: 'diff' },
  { value: 'count', label: 'Enter counted quantity', icon: 'clipboard-check' },
]

const blank = () => ({ id: Math.random().toString(36).slice(2), item: '', delta: '', counted: '', reason: '', note: '' })

export default function QuantityAdjustment({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('delta')
  const [rows, setRows] = useState([blank()])
  const isCount = mode === 'count'

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const recorded = liveQuantities[r.item]
    const delta = isCount
      ? (r.counted !== '' && recorded != null ? Number(r.counted) - recorded : undefined)
      : (r.delta !== '' ? Number(r.delta) : undefined)
    const newQty = recorded != null && delta != null ? recorded + delta : undefined
    return {
      ...r,
      recorded: recorded?.toLocaleString(),
      variance: delta == null ? undefined : `${delta > 0 ? '+' : ''}${delta.toLocaleString()}`,
      newQty: newQty?.toLocaleString(),
    }
  })

  const columns = [
    { key: 'item', label: 'Product / material', type: 'select', options: [...finishedProducts, ...rawMaterials], width: 250, placeholder: 'Select item…' },
    { key: 'recorded', label: 'Recorded qty', type: 'static', align: 'right', width: 130 },
    isCount
      ? { key: 'counted', label: 'Counted qty', type: 'number', width: 140, placeholder: '0' }
      : { key: 'delta', label: 'Adjustment (± )', type: 'number', width: 140, placeholder: '0' },
    { key: isCount ? 'variance' : 'newQty', label: isCount ? 'Variance' : 'New quantity', type: 'static', align: 'right', width: 130 },
    { key: 'reason', label: 'Reason *', type: 'select', options: adjustmentReasons, width: 220, placeholder: 'Select reason…' },
    { key: 'note', label: 'Note', type: 'text', width: 240, placeholder: 'Optional detail' },
  ]

  const active = rows.filter((r) => r.item)
  const deltas = decorated.filter((r) => r.item && r.variance != null).map((r) => Number(String(r.variance).replace(/[+,]/g, '')))
  const increases = deltas.filter((d) => d > 0).length
  const decreases = deltas.filter((d) => d < 0).length
  const net = deltas.reduce((n, d) => n + d, 0)
  const missingReason = rows.some((r) => r.item && !r.reason)

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Quantity Adjustment'}
      icon={leaf?.icon}
      description="Correct the live quantity of finished products or raw materials, positively or negatively. Useful during stock taking, where recorded stock differs from actual stock on hand."
      submitLabel="Post adjustment"
      onCancel={() => {}}
      note="Every line is logged with its reason, a timestamp, and your identity, and is reflected immediately in the Bin Card and stock reports."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Adjustment summary">
            <MetaRow label="Lines" value={active.length || '—'} mono />
            <MetaRow label="Increases" value={increases || '—'} mono tone={increases ? 'positive' : undefined} />
            <MetaRow label="Decreases" value={decreases || '—'} mono tone={decreases ? 'negative' : undefined} />
            <MetaRow
              label="Net change"
              value={net ? `${net > 0 ? '+' : ''}${net.toLocaleString()}` : '—'}
              mono
              tone={net > 0 ? 'positive' : net < 0 ? 'negative' : undefined}
            />
            {missingReason && (
              <Callout tone="warning" icon="circle-alert" style={{ marginTop: 14 }}>
                A reason is required on every line. Lines without one will block submission.
              </Callout>
            )}
          </Panel>

          <Panel title="Recent adjustments" padding={0}>
            <div style={{ padding: '4px 16px 12px' }}>
              {recentAdjustments.map((a) => (
                <div key={a.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.item}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{a.reason} · {a.when} · {a.by}</div>
                  </div>
                  <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: a.change > 0 ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
                    {a.change > 0 ? '+' : ''}{a.change.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Adjustment details">
        <FieldSet columns={3}>
          <Select label="Factory" options={factories} placeholder="Select factory…" />
          <Input label="Adjustment date" type="date" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="QA-122" />
        </FieldSet>
      </Panel>

      <Panel
        title="Items"
        description={isCount
          ? 'Enter the quantity physically counted. The system derives the variance against recorded stock.'
          : 'Enter the quantity to add or remove. Use a negative number to reduce stock.'}
        actions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
      >
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add item"
          emptyLabel="No items added yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Net change', value: net ? `${net > 0 ? '+' : ''}${net.toLocaleString()}` : '0' },
          ]}
        />
      </Panel>
    </FormShell>
  )
}
