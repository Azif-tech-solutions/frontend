import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, OverheadsPanel, PriorRunsPanel } from './costParts.jsx'
import { rawMaterials, inHouseRecipes, inputUnitCosts, overheadHeads, factoryLines, priorCostings } from '../sample.js'
import { money } from '../utils.js'

const blank = () => ({ id: Math.random().toString(36).slice(2), input: '', qty: '', proportion: '' })

export default function ProductionCostCalculator({ leaf, moduleLabel, parentLabel, factoryKey = 'fa' }) {
  const [role, setRole] = useState('restricted')
  const [rows, setRows] = useState([blank()])
  const [produced, setProduced] = useState('')

  const factory = factoryLines[factoryKey]
  const canSeeCost = role === 'mgmt'

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const inputOptions = [...inHouseRecipes.map((r) => ({ value: r.value, label: r.label })), ...rawMaterials]

  const decorated = rows.map((r) => {
    const unitCost = inputUnitCosts[r.input]
    const qty = Number(r.qty) || 0
    const lineCost = unitCost != null ? unitCost * qty : undefined
    return {
      ...r,
      unitCost: unitCost == null ? undefined : canSeeCost ? money(unitCost) : '••••••',
      lineCost: lineCost == null ? undefined : canSeeCost ? money(lineCost) : '••••••',
    }
  })

  const materialCost = rows.reduce((n, r) => n + (inputUnitCosts[r.input] || 0) * (Number(r.qty) || 0), 0)
  const overhead = overheadHeads.reduce((n, h) => n + h.value, 0)
  const totalCost = materialCost + overhead
  const qtyProduced = Number(produced) || 0
  const unitLanding = qtyProduced ? totalCost / qtyProduced : 0

  const active = rows.filter((r) => r.input)
  const columns = [
    { key: 'input', label: 'Recipe / raw material', type: 'select', options: inputOptions, width: 260, placeholder: 'Select input…' },
    { key: 'qty', label: 'Quantity used', type: 'number', width: 140, placeholder: '0' },
    { key: 'proportion', label: 'Proportion (%)', type: 'number', width: 140, placeholder: '0' },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || `Production Cost Calculator — ${factory.name}`}
      icon={leaf?.icon}
      description={`Run at the completion of every production cycle to determine the exact landing cost of a finished product. ${factory.name} specialises in ${factory.specialisation.toLowerCase()}.`}
      headerActions={<PreviewAsRole role={role} onChange={setRole} />}
      submitLabel={canSeeCost ? 'Approve landing cost' : 'Submit to Management'}
      onCancel={() => {}}
      note={canSeeCost
        ? 'Approving records this landing cost against the batch, where it becomes the basis for pricing and mark-up decisions.'
        : 'Submitting sends this costing to Management for review. You will not see the resulting landing cost value.'}
      aside={
        <>
          <CostSummaryPanel
            canSeeCost={canSeeCost}
            title="Landing cost"
            unitLabel="Unit landing cost"
            materialCost={materialCost}
            overhead={overhead}
            totalCost={totalCost}
            qtyProduced={qtyProduced}
            unitCost={unitLanding}
          />

          {!canSeeCost && (
            <CostWithheldNotice title="Cost values withheld">
              You can complete this costing in full without seeing the values. Landing cost is visible only to
              Management and Administration, who use it to set pricing and mark-up.
            </CostWithheldNotice>
          )}

          <PriorRunsPanel
            title="Recent costings"
            canSeeCost={canSeeCost}
            runs={priorCostings.map((p) => ({ key: p.batch, title: p.product, meta: `${p.batch} · ${p.when}`, cost: p.unitCost }))}
          />
        </>
      }
    >
      <Panel title="Production run" description="The completed cycle being costed.">
        <FieldSet columns={3}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Finished product</div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 'var(--field-h)', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)' }}>
              <select style={{ appearance: 'none', width: '100%', height: '100%', border: 'none', outline: 'none', background: 'transparent', padding: '0 30px 0 10px', font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)', color: 'var(--text-strong)', cursor: 'pointer' }}>
                <option value="">Select product…</option>
                {factory.products.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <span style={{ position: 'absolute', right: 9, pointerEvents: 'none', display: 'flex' }}><Icon name="chevron-down" size={15} color="var(--text-muted)" /></span>
            </div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>Limited to {factory.name}&rsquo;s production line.</div>
          </label>
          <Input label="Batch number" placeholder="e.g. B-3401" />
          <Input label="Production date" type="date" />
          <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
          <Input label="Unit" value="Cartons" onChange={() => {}} />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="PC-1187" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">{factory.name} — {factory.location}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{factory.specialisation}</span>
        </div>
      </Panel>

      <Panel
        title="Recipes & raw materials consumed"
        description="Select every input used in the run with its quantity or proportion. Landing cost is derived from these lines plus overheads."
      >
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add input"
          emptyLabel="No inputs added yet."
          summary={[
            { label: 'Inputs', value: active.length },
            { label: 'Material cost', value: canSeeCost ? money(materialCost) : '••••••' },
          ]}
        />
      </Panel>

      <OverheadsPanel canSeeCost={canSeeCost} />
    </FormShell>
  )
}
