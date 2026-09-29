import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { bankRegister } from '../sampleAccount.js'

const ACCOUNT_TYPES = [
  { value: 'current', label: 'Current' },
  { value: 'collections', label: 'Collections' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'savings', label: 'Savings' },
  { value: 'domiciliary', label: 'Domiciliary' },
]

const columns = [
  { key: 'bank', label: 'Bank', width: 230 },
  { key: 'accountNo', label: 'Account number', width: 170, mono: true },
  { key: 'accountType', label: 'Account type', width: 150 },
  { key: 'branch', label: 'Branch', width: 180 },
  { key: 'signatory', label: 'Signatory', width: 170 },
  { key: 'opened', label: 'Opened', width: 140 },
  {
    key: 'status', label: 'Status', width: 120,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

function BankForm({ crumbs, onBack }) {
  const [active, setActive] = useState(true)
  return (
    <FormShell
      crumbs={crumbs}
      title="Register bank account"
      icon="building-2"
      description="Add a banking institution and account the company transacts through. Registered accounts become available for fund transfers, payments, lodgements and reporting."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel="Register account"
      onCancel={onBack}
      note="Account numbers must be unique. Once registered, the account is immediately selectable across every financial module."
      aside={
        <Panel title="Where it will be used">
          <MetaRow label="Bank Statement" value="Immediate" />
          <MetaRow label="Credit Petty Cash" value="As a funding source" />
          <MetaRow label="POS/Fund Transfer Confirmation" value="As a receiving account" />
          <MetaRow label="Payment/Running Cost" value="As a payment source" />
        </Panel>
      }
    >
      <Panel title="Institution">
        <FieldSet columns={2}>
          <Input label="Bank name" placeholder="e.g. First Bank of Nigeria" />
          <Input label="Branch" placeholder="e.g. Ikeja GRA" />
          <Input label="Account name" placeholder="e.g. ZifIQ Manufacturing Ltd" />
          <Input label="Account number" placeholder="10 digits" hint="Must be unique across the register." />
          <Select label="Account type" options={ACCOUNT_TYPES} placeholder="Select type…" />
          <Input label="Sort code / BIC" placeholder="Optional" />
        </FieldSet>
      </Panel>

      <Panel title="Control">
        <FieldSet columns={2}>
          <Input label="Authorised signatory" placeholder="e.g. M. Okonkwo" />
          <Input label="Date opened" type="date" />
          <Input label="Opening balance (₦)" type="number" placeholder="0.00" />
          <Input label="Relationship manager" placeholder="Optional" />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={active} onChange={setActive} />
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Dormant accounts stay in historic statements but cannot receive new transactions.</div>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function BankRegisterScreen({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <BankForm crumbs={crumbs} onBack={() => setMode('list')} />

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Bank Register'}
      icon={leaf?.icon}
      description="The company's banking institutions and accounts. Registered banks are used throughout the system for transfers, payments, lodgements and reporting."
      createLabel="Register account"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by bank, account number or branch…"
      filters={<Select options={ACCOUNT_TYPES} placeholder="All account types" style={{ width: 190 }} />}
      stats={[
        { label: 'Accounts registered', value: String(bankRegister.length) },
        { label: 'Active', value: String(bankRegister.filter((b) => b.status === 'Active').length) },
        { label: 'Institutions', value: String(new Set(bankRegister.map((b) => b.bank)).size) },
        { label: 'Account types', value: String(new Set(bankRegister.map((b) => b.accountType)).size) },
      ]}
      columns={columns}
      rows={bankRegister}
      onRowClick={() => {}}
      emptyTitle="No bank accounts registered"
      emptyDescription="Register an account to make it selectable in transfers, payments and reporting."
      footnote="A record cannot be created with missing required fields or an account number that duplicates an existing entry."
    />
  )
}
