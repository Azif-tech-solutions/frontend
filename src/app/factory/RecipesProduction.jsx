import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, OverheadsPanel, PriorRunsPanel } from './costParts.jsx'
import { factories, rawMaterials, inputUnitCosts, overheadHeads, registeredRecipes, recipeProductionRuns } from '../sample.js'
import { fmt, money } from '../utils.js'

const recipeOptions = registeredRecipes
  .filter((r) => r.sourcing === 'In-House Production' && r.status === 'Active')
  .map((r) => ({ value: r.code, label: `${r.code} · ${r.name}` }))

const blank = () => ({ id: Math.random().toString(36).slice(2), material: '', qty: '' })

export default function RecipesProduction({ leaf, moduleLabel, parentLabel }) {
  const [role, setRole] = useState('restricted')
  const [rows, setRows] = useState([blank()])
  const [produced, setProduced] = useState('')
  const canSeeCost = role === 'mgmt'

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const unitCost = inputUnitCosts[r.material]
    const qty = Number(r.qty) || 0
    const lineCost = unitCost != null ? unitCost * qty : undefined
    return {
      ...r,
      unitCost: unitCost == null ? undefined : canSeeCost ? money(unitCost) : '••••••',
      lineCost: lineCost == null ? undefined : canSeeCost ? money(lineCost) : '••••••',
    }
  })

  const materialCost = rows.reduce((n, r) => n + (inputUnitCosts[r.material] || 0) * (Number(r.qty) || 0), 0)
  const overhead = overheadHeads.reduce((n, h) => n + h.value, 0)
  const totalCost = materialCost + overhead
  const qtyProduced = Number(produced) || 0
  const unitCost = qtyProduced ? totalCost / qtyProduced : 0

  const active = rows.filter((r) => r.material)
  const columns = [
    { key: 'material', label: 'Imported raw material', type: 'select', options: rawMaterials, width: 260, placeholder: 'Select material…' },
    { key: 'qty', label: 'Quantity used', type: 'number', width: 150, placeholder: '0' },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'In-House Recipes — Production'}
      icon={leaf?.icon}
      description="Run the production cycle for an internally manufactured recipe. Select the registered imported materials required, and the completed recipe is stored in inventory for use in the company's main production processes."
      headerActions={<PreviewAsRole role={role} onChange={setRole} restrictedLabel="Factory personnel" />}
      submitLabel="Complete production cycle"
      onCancel={() => {}}
      note="Completing the cycle adds the recipe to inventory and sends the calculated production cost to Management and Administration."
      aside={
        <>
          <CostSummaryPanel
            canSeeCost={canSeeCost}
            title="Production cost"
            materialLabel="Material cost"
            unitLabel="Cost per unit"
            materialCost={materialCost}
            overhead={overhead}
            totalCost={totalCost}
            qtyProduced={qtyProduced}
            unitCost={unitCost}
          />

          {!canSeeCost && (
            <CostWithheldNotice title="Production cost withheld">
              The cost calculated on completion is communicated exclusively to Management and Administration.
              You can run the full cycle without seeing it.
            </CostWithheldNotice>
          )}

          <PriorRunsPanel
            title="Recent recipe production"
            canSeeCost={canSeeCost}
            runs={recipeProductionRuns.slice(0, 4).map((p) => ({
              key: p.batch,
              title: p.recipe,
              meta: `${p.batch} · ${p.date} · ${fmt(p.qty)} ${p.unit.toLowerCase()}`,
              cost: p.unitCost,
            }))}
          />
        </>
      }
    >
      <Panel title="Production cycle" description="The in-house recipe being produced.">
        <FieldSet columns={3}>
          <Select label="Recipe" options={recipeOptions} placeholder="Select registered recipe…" />
          <Select label="Producing factory" options={factories} placeholder="Select factory…" />
          <Input label="Production date" type="date" />
          <Input label="Batch number" placeholder="e.g. RB-1228" />
          <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="RP-0442" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">In-House Production</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            Only recipes registered as in-house and marked active can be produced here.
          </span>
        </div>
      </Panel>

      <Panel
        title="Imported materials consumed"
        description="Select the registered imported materials required for this recipe, according to production requirements."
      >
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add material"
          emptyLabel="No materials added yet."
          summary={[
            { label: 'Materials', value: active.length },
            { label: 'Material cost', value: canSeeCost ? money(materialCost) : '••••••' },
          ]}
        />
      </Panel>

      <OverheadsPanel canSeeCost={canSeeCost} />
    </FormShell>
  )
}
