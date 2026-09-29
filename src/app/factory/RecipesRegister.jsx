import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { factories, sourcingTypes, registeredRecipes } from '../sample.js'
import { unitOptions } from '../unitOptions.js'
import { useStore } from '../store.jsx'

const columns = [
  { key: 'code', label: 'Code', width: 100, mono: true },
  { key: 'name', label: 'Recipe name', width: 200 },
  { key: 'description', label: 'Description', width: 340 },
  { key: 'unit', label: 'Unit', width: 110 },
  {
    key: 'sourcing', label: 'Sourcing', width: 180,
    render: (r) => <Badge tone={r.sourcing === 'In-House Production' ? 'brand' : 'neutral'}>{r.sourcing}</Badge>,
  },
  { key: 'yield', label: 'Yield / batch', width: 130, align: 'right', mono: true },
  { key: 'factory', label: 'Factory', width: 130 },
  {
    key: 'status', label: 'Status', width: 110,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

function RecipeForm({ crumbs, onBack }) {
  const { units } = useStore()
  const [active, setActive] = useState(true)
  return (
    <FormShell
      crumbs={crumbs}
      title="Register in-house recipe"
      icon="book-open"
      description="Record the name and description of a recipe produced internally. Recipes must be registered here before they can be viewed, selected or used in the Production Cost Calculator."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel="Register recipe"
      onCancel={onBack}
      note="Codes must be unique. Once registered, the recipe is immediately selectable in In-House Production and the Production Cost Calculator."
      aside={
        <Panel title="Availability once registered">
          <MetaRow label="In-House Production" value="Immediate" />
          <MetaRow label="Production Cost Calculator" value="Immediate" />
          <MetaRow label="Total Cost for Selected Recipes" value="Immediate" />
          <MetaRow label="Stock Refill — Raw Material" value="Immediate" />
        </Panel>
      }
    >
      <Panel title="Identity" description="How this recipe is named and coded across the system.">
        <FieldSet columns={2}>
          <Input label="Recipe code" placeholder="e.g. RC-06" hint="Must be unique across the register." />
          <Input label="Recipe name" placeholder="e.g. Vanilla Extract Base" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
            <textarea
              rows={3}
              placeholder="What this recipe is and which products it feeds into."
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

      <Panel title="Sourcing & output" description="Raw materials and recipes are sourced either by direct importation or in-house production.">
        <FieldSet columns={3}>
          <Select label="Sourcing method" options={sourcingTypes} placeholder="Select method…" />
          <Select label="Producing factory" options={factories} placeholder="Select factory…" />
          <Select label="Unit of measure" options={unitOptions(units)} placeholder="Select unit…" />
          <Input label="Standard yield per batch" type="number" placeholder="0" hint="Expected output from one production cycle." />
          <Input label="Shelf life (days)" type="number" placeholder="0" />
          <Input label="Re-order level" type="number" placeholder="0" />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={active} onChange={setActive} />
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive recipes stay in reports but cannot be selected in new production cycles.</div>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function RecipesRegister({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <RecipeForm crumbs={crumbs} onBack={() => setMode('list')} />

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'In-House Recipes — Register'}
      icon={leaf?.icon}
      description="Register recipes produced internally by the company. These must exist here before they can be selected and used in the Production Cost Calculator."
      createLabel="Register recipe"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search recipes by code, name or description…"
      filters={
        <>
          <Select options={factories} placeholder="All factories" style={{ width: 180 }} />
          <Select options={sourcingTypes} placeholder="All sourcing" style={{ width: 190 }} />
        </>
      }
      stats={[
        { label: 'Recipes registered', value: String(registeredRecipes.length) },
        { label: 'In-house produced', value: String(registeredRecipes.filter((r) => r.sourcing === 'In-House Production').length) },
        { label: 'Directly imported', value: String(registeredRecipes.filter((r) => r.sourcing === 'Direct Importation').length) },
        { label: 'Active', value: String(registeredRecipes.filter((r) => r.status === 'Active').length) },
      ]}
      columns={columns}
      rows={registeredRecipes}
      onRowClick={() => {}}
      emptyTitle="No recipes registered"
      emptyDescription="Register a recipe to make it selectable in production and costing."
      footnote="A record cannot be created with missing required fields or a code that duplicates an existing entry."
    />
  )
}
