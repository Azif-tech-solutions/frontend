import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, OverheadsPanel, PriorRunsPanel } from './costParts.jsx'
import { factories, rawMaterials, inHouseRecipes, inputUnitCosts, overheadHeads, specialClients, specialProducts, specialProductionRuns } from '../sample.js'
import { fmt, money } from '../utils.js'

const blank = () => ({ id: Math.random().toString(36).slice(2), input: '', qty: '', proportion: '' })

export default function SpecialProduction({ leaf, moduleLabel, parentLabel }) {
  const [role, setRole] = useState('restricted')
  const [rows, setRows] = useState([blank()])
  const [produced, setProduced] = useState('')
  const [clientId, setClientId] = useState('sc-01')

  const canSeeCost = role === 'mgmt'
  const client = specialClients.find((c) => c.value === clientId) || specialClients[0]

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
  const unitCost = qtyProduced ? totalCost / qtyProduced : 0

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
      title={leaf?.label || 'Special Production'}
      icon={leaf?.icon}
      description="Cost a customised production order for a special client. Operates like the Factory A and B calculators, but is dedicated exclusively to special products and kept separate from regular factory production."
      headerActions={<PreviewAsRole role={role} onChange={setRole} />}
      submitLabel={canSeeCost ? 'Approve special costing' : 'Submit to Management'}
      onCancel={() => {}}
      note={canSeeCost
        ? 'Approving records this costing against the special order, where it becomes the basis for the quoted price.'
        : 'Submitting sends this costing to Management for review. You will not see the resulting cost value.'}
      aside={
        <>
          <CostSummaryPanel
            canSeeCost={canSeeCost}
            title="Special order cost"
            materialLabel="Material & recipe cost"
            unitLabel="Cost per unit"
            materialCost={materialCost}
            overhead={overhead}
            totalCost={totalCost}
            qtyProduced={qtyProduced}
            unitCost={unitCost}
          />

          {!canSeeCost && (
            <CostWithheldNotice title="Cost values withheld">
              You can complete this special costing in full without seeing the values. Cost is visible only to
              Management and Administration, who use it to quote the client.
            </CostWithheldNotice>
          )}

          <PriorRunsPanel
            title="Recent special orders"
            canSeeCost={canSeeCost}
            runs={specialProductionRuns.slice(0, 4).map((r) => ({
              key: r.batch,
              title: r.product,
              meta: `${r.order} · ${r.client} · ${fmt(r.qty)} ${r.unit.toLowerCase()}`,
              cost: r.unitCost,
            }))}
          />
        </>
      }
    >
      <Panel title="Special order" description="Who requested this production and against which order.">
        <FieldSet columns={3}>
          <Select label="Special client" options={specialClients} value={clientId} onChange={(e) => setClientId(e.target.value)} />
          <Input label="Order reference" placeholder="e.g. SO-0434" />
          <Input label="Requested delivery date" type="date" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="warning">Special order</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{client.terms}</span>
        </div>
      </Panel>

      <Panel title="Production run" description="The customised finished product being made.">
        <FieldSet columns={3}>
          <Select label="Special product" options={specialProducts} placeholder="Select special product…" />
          <Select label="Producing factory" options={factories} placeholder="Select factory…" />
          <Input label="Production date" type="date" />
          <Input label="Batch number" placeholder="e.g. SB-0798" />
          <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="SP-0184" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Customisation notes</div>
            <textarea
              rows={3}
              placeholder="Label artwork, pack format, or specification differences from the standard product."
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </div>
      </Panel>

      <Panel
        title="Recipes & raw materials consumed"
        description="Configure the recipe for this special product. Inputs may differ from the standard product's composition."
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
