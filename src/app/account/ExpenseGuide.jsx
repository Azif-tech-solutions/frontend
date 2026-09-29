import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { expenseCategories } from '../sampleAccount.js'

const ACCOUNT_HEADS = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'finance', label: 'Finance' },
]

const columns = [
  { key: 'code', label: 'Code', width: 100, mono: true },
  { key: 'name', label: 'Expense category', width: 230 },
  { key: 'description', label: 'Description', width: 360 },
  { key: 'account', label: 'Account head', width: 170 },
  {
    key: 'pettyCashAllowed', label: 'Petty cash', width: 130,
    render: (r) => <Badge tone={r.pettyCashAllowed === 'Yes' ? 'success' : 'neutral'}>{r.pettyCashAllowed === 'Yes' ? 'Allowed' : 'Not allowed'}</Badge>,
  },
  {
    key: 'status', label: 'Status', width: 110,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

function CategoryForm({ crumbs, onBack }) {
  const [active, setActive] = useState(true)
  const [petty, setPetty] = useState(true)
  return (
    <FormShell
      crumbs={crumbs}
      title="Register expense category"
      icon="list-checks"
      description="Add a category of payment or expense recognised by the company. Registered categories become selectable in Payment/Running Cost and petty cash transactions."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to guide</Button>}
      submitLabel="Register category"
      onCancel={onBack}
      note="Codes and names must be unique. Once registered, the category is immediately selectable in every dependent module."
      aside={
        <Panel title="Where it will be used">
          <MetaRow label="Payment/Running Cost" value="Immediate" />
          <MetaRow label="Petty Cash Payment" value={petty ? 'Immediate' : 'Not available'} />
          <MetaRow label="Expenses/Payment Reports" value="Immediate" />
          <MetaRow label="Cash Inflow/Outflow" value="As an out-flow head" />
        </Panel>
      }
    >
      <Panel title="Category details">
        <FieldSet columns={2}>
          <Input label="Category code" placeholder="e.g. EX-12" hint="Must be unique across the guide." />
          <Input label="Category name" placeholder="e.g. Security Services" />
          <Select label="Account head" options={ACCOUNT_HEADS} placeholder="Select head…" />
          <Input label="Monthly cap (₦)" type="number" placeholder="0.00" hint="Optional spending ceiling." />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
            <textarea
              rows={3}
              placeholder="What this category covers, so entries are classified consistently."
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

      <Panel title="Rules">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={petty} onChange={setPetty} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Payable from petty cash</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Larger heads such as bank charges are usually settled by transfer instead.</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={active} onChange={setActive} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive categories stay in historic reports but cannot be selected on new entries.</div>
            </div>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function ExpenseGuide({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <CategoryForm crumbs={crumbs} onBack={() => setMode('list')} />

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Expenses/Payment List Guide'}
      icon={leaf?.icon}
      description="The reference list of payment and expense categories the company recognises, so every payment is classified and recorded consistently across the system."
      createLabel="Register category"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search categories by code, name or description…"
      filters={<Select options={ACCOUNT_HEADS} placeholder="All account heads" style={{ width: 200 }} />}
      stats={[
        { label: 'Categories registered', value: String(expenseCategories.length) },
        { label: 'Active', value: String(expenseCategories.filter((c) => c.status === 'Active').length) },
        { label: 'Petty-cash payable', value: String(expenseCategories.filter((c) => c.pettyCashAllowed === 'Yes').length) },
        { label: 'Account heads', value: String(new Set(expenseCategories.map((c) => c.account)).size) },
      ]}
      columns={columns}
      rows={expenseCategories}
      onRowClick={() => {}}
      emptyTitle="No expense categories registered"
      emptyDescription="Register a category to make it selectable on payments and petty cash entries."
      footnote="A category cannot be created with missing required fields or a code that duplicates an existing entry. Inactive categories are rejected on new payment entries."
    />
  )
}
