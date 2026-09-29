import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { showrooms, storageAreas, showroomStock, CURRENT_SHOWROOM } from '../sampleShowroom.js'
import { adjustmentReasons } from '../sample.js'
import { fmt } from '../utils.js'

const MODES = [
  { value: 'delta', label: 'Adjust by quantity', icon: 'diff' },
  { value: 'count', label: 'Enter counted quantity', icon: 'clipboard-check' },
]

const stockOptions = showroomStock.map((s, i) => ({ value: String(i), label: `${s.detail} — ${s.area}` }))
const onHandFor = (v) => (v === '' || v == null ? undefined : showroomStock[Number(v)]?.qty)

const blank = () => ({ id: Math.random().toString(36).slice(2), item: '', delta: '', counted: '', reason: '', note: '' })

export default function ShowroomAdjustment({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('delta')
  const [rows, setRows] = useState([blank()])
  const isCount = mode === 'count'

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const recorded = onHandFor(r.item)
    const delta = isCount
      ? (r.counted !== '' && recorded != null ? Number(r.counted) - recorded : undefined)
      : (r.delta !== '' ? Number(r.delta) : undefined)
    const newQty = recorded != null && delta != null ? recorded + delta : undefined
    return {
      ...r,
      recorded: recorded == null ? undefined : fmt(recorded),
      variance: delta == null ? undefined : `${delta > 0 ? '+' : ''}${fmt(delta)}`,
      newQty: newQty == null ? undefined : fmt(newQty),
    }
  })

  // Stock may never be adjusted below zero.
  const errors = rows.map((r) => {
    const recorded = onHandFor(r.item)
    if (recorded == null) return null
    const delta = isCount
      ? (r.counted !== '' ? Number(r.counted) - recorded : null)
      : (r.delta !== '' ? Number(r.delta) : null)
    if (delta == null) return null
    if (recorded + delta < 0) {
      return { field: isCount ? 'counted' : 'delta', message: `Adjustment would take stock below zero — only ${fmt(recorded)} on hand.` }
    }
    return null
  })

  const columns = [
    { key: 'item', label: 'Product & location', type: 'select', options: stockOptions, width: 300, placeholder: 'Select stock item…' },
    { key: 'recorded', label: 'Recorded qty', type: 'static', align: 'right', width: 130 },
    isCount
      ? { key: 'counted', label: 'Counted qty', type: 'number', width: 140, placeholder: '0' }
      : { key: 'delta', label: 'Adjustment (±)', type: 'number', width: 140, placeholder: '0' },
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
  const blocked = errors.some(Boolean)

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Quantity Adjustment'}
      icon={leaf?.icon}
      description="Adjust showroom stock up or down with a documented reason — for example reducing live stock by the number of items damaged or spoiled, or correcting a count after physical verification."
      submitLabel="Post adjustment"
      onCancel={() => {}}
      note="Every line is logged with its reason, a timestamp, and your identity. Adjustments are restricted to the Stock Keeper role."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <Panel title="Adjustment summary">
          <MetaRow label="Lines" value={active.length || '—'} mono />
          <MetaRow label="Increases" value={increases || '—'} mono tone={increases ? 'positive' : undefined} />
          <MetaRow label="Decreases" value={decreases || '—'} mono tone={decreases ? 'negative' : undefined} />
          <MetaRow label="Net change" value={net ? `${net > 0 ? '+' : ''}${fmt(net)}` : '—'} mono tone={net > 0 ? 'positive' : net < 0 ? 'negative' : undefined} />
          <MetaRow label="Showroom" value={CURRENT_SHOWROOM} />
          {blocked && (
            <Callout tone="danger" icon="circle-alert" title="Adjustment blocked" style={{ marginTop: 14 }}>
              One or more lines would take stock below zero. Correct the quantity before posting.
            </Callout>
          )}
          {!blocked && missingReason && (
            <Callout tone="warning" icon="circle-alert" style={{ marginTop: 14 }}>
              A reason is required on every line. Lines without one will block submission.
            </Callout>
          )}
        </Panel>
      }
    >
      <Panel title="Adjustment details">
        <FieldSet columns={4}>
          <Select label="Showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
          <Select label="Storage area" options={storageAreas} placeholder="All areas" />
          <Input label="Adjustment date" type="date" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="QA-134" />
        </FieldSet>
      </Panel>

      <Panel
        title="Items"
        description={isCount
          ? 'Enter the quantity physically counted. The system derives the variance against recorded stock.'
          : 'Enter the quantity to add or remove. Use a negative number to reduce stock — for example spoilage or damage.'}
        actions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
      >
        <LineItems
          columns={columns}
          rows={decorated}
          errors={errors}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add item"
          emptyLabel="No items added yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Net change', value: net ? `${net > 0 ? '+' : ''}${fmt(net)}` : '0' },
          ]}
        />
      </Panel>
    </FormShell>
  )
}
