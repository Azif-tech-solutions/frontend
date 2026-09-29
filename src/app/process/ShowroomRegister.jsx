import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { showroomRegister, nigerianStates } from '../sampleProcess.js'

const columns = [
  { key: 'code', label: 'Branch code', width: 130, mono: true },
  { key: 'name', label: 'Showroom', width: 220 },
  { key: 'address', label: 'Address', width: 320 },
  { key: 'state', label: 'State', width: 120 },
  { key: 'manager', label: 'Manager', width: 160 },
  { key: 'phone', label: 'Phone', width: 170, mono: true },
  { key: 'opened', label: 'Opened', width: 140 },
  { key: 'vatRate', label: 'VAT rate', width: 110, align: 'right', mono: true },
  {
    key: 'status', label: 'Status', width: 160,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge>,
  },
]

function ShowroomForm({ crumbs, onBack }) {
  const [active, setActive] = useState(true)
  const nextCode = `BR-${String(showroomRegister.length + 1).padStart(3, '0')}`

  return (
    <FormShell
      crumbs={crumbs}
      title="Register showroom"
      icon="store"
      description="Create a new showroom, also referred to as a branch. A unique branch code is generated automatically on registration for identification and tracking."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel="Register showroom"
      onCancel={onBack}
      note="Once registered, the showroom is immediately selectable for transfers, stock, sales and financial reporting."
      aside={
        <>
          <Panel title="Branch code">
            <div style={{ padding: '18px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Will be assigned</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{nextCode}</div>
            </div>
            <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Generated on save and used to identify this branch across stock, transfers and financial records.
            </div>
          </Panel>

          <Panel title="Set up after registration">
            <MetaRow label="VAT rate" value="Via VAT Control" />
            <MetaRow label="Opening stock" value="Via Stock Entry" />
            <MetaRow label="Assigned staff" value="Via User Register" />
            <MetaRow label="Correspondent" value="Via Correspondent" />
          </Panel>
        </>
      }
    >
      <Panel title="Showroom details">
        <FieldSet columns={2}>
          <Input label="Showroom name" placeholder="e.g. Showroom Kano" />
          <Select label="State" options={nigerianStates} placeholder="Select state…" />
          <Input label="Street address" placeholder="e.g. 48 Murtala Mohammed Way" />
          <Input label="City / town" placeholder="e.g. Kano" />
          <Input label="Phone number" placeholder="+234 …" />
          <Input label="Email address" placeholder="branch@zifiq.com" />
        </FieldSet>
      </Panel>

      <Panel title="Management & operations">
        <FieldSet columns={2}>
          <Input label="Branch manager" placeholder="e.g. A. Yusuf" />
          <Input label="Date opened" type="date" />
          <Input label="Storage capacity" placeholder="Optional" />
          <Input label="Operating hours" placeholder="e.g. Mon–Sat, 08:00–18:00" />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={active} onChange={setActive} />
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active on registration</div>
            <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
              Leave off to register a branch that has not yet opened for trading.
            </div>
          </div>
        </div>
        {!active && (
          <Callout tone="info" icon="info" style={{ marginTop: 14 }}>
            The showroom will be registered as <strong>Pending opening</strong>. It can receive stock but cannot
            transact until activated.
          </Callout>
        )}
      </Panel>
    </FormShell>
  )
}

export default function ShowroomRegister({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <ShowroomForm crumbs={crumbs} onBack={() => setMode('list')} />

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Showroom Register'}
      icon={leaf?.icon}
      description="Create and manage showrooms, also referred to as branches. Each registered showroom carries a unique branch code used to track its transactions, stock and financial activity."
      createLabel="Register showroom"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by name, branch code or address…"
      filters={<Select options={nigerianStates} placeholder="All states" style={{ width: 180 }} />}
      stats={[
        { label: 'Showrooms registered', value: String(showroomRegister.length) },
        { label: 'Active', value: String(showroomRegister.filter((s) => s.status === 'Active').length) },
        { label: 'Pending opening', value: String(showroomRegister.filter((s) => s.status !== 'Active').length) },
        { label: 'States covered', value: String(new Set(showroomRegister.map((s) => s.state)).size) },
      ]}
      columns={columns}
      rows={showroomRegister}
      onRowClick={() => {}}
      emptyTitle="No showrooms registered"
      emptyDescription="Register a branch to begin tracking its stock and transactions."
      footnote="A showroom cannot be created with missing required fields or a name that duplicates an existing branch. Branch codes are generated by the system and cannot be edited."
    />
  )
}
