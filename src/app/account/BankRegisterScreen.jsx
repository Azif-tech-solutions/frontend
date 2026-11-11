// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Switch } from '../../ds/components/forms/Switch.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { bankRegister } from '../sampleAccount.js'

// const ACCOUNT_TYPES = [
//   { value: 'current', label: 'Current' },
//   { value: 'collections', label: 'Collections' },
//   { value: 'payroll', label: 'Payroll' },
//   { value: 'savings', label: 'Savings' },
//   { value: 'domiciliary', label: 'Domiciliary' },
// ]

// const columns = [
//   { key: 'bank', label: 'Bank', width: 230 },
//   { key: 'accountNo', label: 'Account number', width: 170, mono: true },
//   { key: 'accountType', label: 'Account type', width: 150 },
//   { key: 'branch', label: 'Branch', width: 180 },
//   { key: 'signatory', label: 'Signatory', width: 170 },
//   { key: 'opened', label: 'Opened', width: 140 },
//   {
//     key: 'status', label: 'Status', width: 120,
//     render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
//   },
// ]

// function BankForm({ crumbs, onBack }) {
//   const [active, setActive] = useState(true)
//   return (
//     <FormShell
//       crumbs={crumbs}
//       title="Register bank account"
//       icon="building-2"
//       description="Add a banking institution and account the company transacts through. Registered accounts become available for fund transfers, payments, lodgements and reporting."
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
//       submitLabel="Register account"
//       onCancel={onBack}
//       note="Account numbers must be unique. Once registered, the account is immediately selectable across every financial module."
//       aside={
//         <Panel title="Where it will be used">
//           <MetaRow label="Bank Statement" value="Immediate" />
//           <MetaRow label="Credit Petty Cash" value="As a funding source" />
//           <MetaRow label="POS/Fund Transfer Confirmation" value="As a receiving account" />
//           <MetaRow label="Payment/Running Cost" value="As a payment source" />
//         </Panel>
//       }
//     >
//       <Panel title="Institution">
//         <FieldSet columns={2}>
//           <Input label="Bank name" placeholder="e.g. First Bank of Nigeria" />
//           <Input label="Branch" placeholder="e.g. Ikeja GRA" />
//           <Input label="Account name" placeholder="e.g. ZifIQ Manufacturing Ltd" />
//           <Input label="Account number" placeholder="10 digits" hint="Must be unique across the register." />
//           <Select label="Account type" options={ACCOUNT_TYPES} placeholder="Select type…" />
//           <Input label="Sort code / BIC" placeholder="Optional" />
//         </FieldSet>
//       </Panel>

//       <Panel title="Control">
//         <FieldSet columns={2}>
//           <Input label="Authorised signatory" placeholder="e.g. M. Okonkwo" />
//           <Input label="Date opened" type="date" />
//           <Input label="Opening balance (₦)" type="number" placeholder="0.00" />
//           <Input label="Relationship manager" placeholder="Optional" />
//         </FieldSet>
//         <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
//           <Switch checked={active} onChange={setActive} />
//           <div>
//             <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Dormant accounts stay in historic statements but cannot receive new transactions.</div>
//           </div>
//         </div>
//       </Panel>
//     </FormShell>
//   )
// }

// export default function BankRegisterScreen({ leaf, moduleLabel, parentLabel }) {
//   const [mode, setMode] = useState('list')
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (mode === 'create') return <BankForm crumbs={crumbs} onBack={() => setMode('list')} />

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Bank Register'}
//       icon={leaf?.icon}
//       description="The company's banking institutions and accounts. Registered banks are used throughout the system for transfers, payments, lodgements and reporting."
//       createLabel="Register account"
//       onCreate={() => setMode('create')}
//       searchPlaceholder="Search by bank, account number or branch…"
//       filters={<Select options={ACCOUNT_TYPES} placeholder="All account types" style={{ width: 190 }} />}
//       stats={[
//         { label: 'Accounts registered', value: String(bankRegister.length) },
//         { label: 'Active', value: String(bankRegister.filter((b) => b.status === 'Active').length) },
//         { label: 'Institutions', value: String(new Set(bankRegister.map((b) => b.bank)).size) },
//         { label: 'Account types', value: String(new Set(bankRegister.map((b) => b.accountType)).size) },
//       ]}
//       columns={columns}
//       rows={bankRegister}
//       onRowClick={() => {}}
//       emptyTitle="No bank accounts registered"
//       emptyDescription="Register an account to make it selectable in transfers, payments and reporting."
//       footnote="A record cannot be created with missing required fields or an account number that duplicates an existing entry."
//     />
//   )
// }
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()

// backend enum: COLLECTIONS | SINGLE | PAYROLL | CURRENT | SAVINGS
const ACCOUNT_TYPES = [
  { value: 'CURRENT', label: 'Current' },
  { value: 'COLLECTIONS', label: 'Collections' },
  { value: 'PAYROLL', label: 'Payroll' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'SINGLE', label: 'Single' },
]
const ACCOUNT_TYPE_LABEL = Object.fromEntries(
  ACCOUNT_TYPES.map((o) => [o.value, o.label])
)

const STATUS_LABEL = { ACTIVE: 'Active', DORMANT: 'Dormant' }
const STATUS_TONE = { ACTIVE: 'success', DORMANT: 'neutral' }
const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DORMANT', label: 'Dormant' },
]

const today = () => new Date().toISOString().slice(0, 10)

// DS Select fires the value directly, Input fires a native event.
// Handle both so this page keeps working whichever way the DS goes.
function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const COLUMNS = [
  { key: 'bankName', label: 'Bank', width: 220 },
  {
    key: 'accountNumber',
    label: 'Account number',
    width: 170,
    mono: true,
    render: (r) => r.accountNumberMasked || r.accountNumber || '—',
  },
  {
    key: 'accountType',
    label: 'Account type',
    width: 150,
    render: (r) => ACCOUNT_TYPE_LABEL[r.accountType] || r.accountType || '—',
  },
  { key: 'branch', label: 'Branch', width: 170 },
  {
    key: 'authorisedSignatory',
    label: 'Signatory',
    width: 170,
    render: (r) => r.authorisedSignatory || '—',
  },
  {
    key: 'currencyCode',
    label: 'Currency',
    width: 100,
    mono: true,
    render: (r) => r.currencyCode || '—',
  },
  {
    key: 'currentBalance',
    label: 'Current balance',
    width: 170,
    align: 'right',
    mono: true,
    render: (r) => money(r.currentBalance || 0),
  },
  {
    key: 'dateOpened',
    label: 'Opened',
    width: 130,
    render: (r) => (r.dateOpened ? fmtDate(r.dateOpened) : '—'),
  },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    render: (r) => (
      <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
        {STATUS_LABEL[r.status] || r.status || '—'}
      </Badge>
    ),
  },
]

// ── Create ────────────────────────────────────────────────
function BankForm({ crumbs, locations, onBack, onDone }) {
  const { showToast } = useStore()

  const [values, setValues] = useState({
    bankName: '',
    branch: '',
    accountName: '',
    accountNumber: '',
    accountType: 'CURRENT',
    currencyCode: 'NGN',
    sortCodeOrBic: '',
    authorisedSignatory: '',
    relationshipManager: '',
    dateOpened: today(),
    openingBalance: '',
    openingBalanceDate: today(),
    locationId: '',
    active: true,
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))

  const canSubmit =
    values.bankName.trim() &&
    values.accountName.trim() &&
    values.accountNumber.trim() &&
    values.accountType &&
    values.locationId &&
    !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.createBankAccount({
        bankName: values.bankName.trim(),
        branch: values.branch.trim(),
        accountName: values.accountName.trim(),
        accountNumber: values.accountNumber.trim(),
        accountType: values.accountType,
        currencyCode: values.currencyCode.trim() || 'NGN',
        sortCodeOrBic: values.sortCodeOrBic.trim(),
        authorisedSignatory: values.authorisedSignatory.trim(),
        relationshipManager: values.relationshipManager.trim(),
        dateOpened: values.dateOpened || today(),
        openingBalance: Number(values.openingBalance) || 0,
        openingBalanceDate: values.openingBalanceDate || values.dateOpened,
        locationId: values.locationId,
        active: values.active,
      })
      showToast(
        'Account registered',
        `${values.bankName} · ${values.accountNumber} added to the register.`
      )
      onDone()
    } catch (e) {
      showToast('Could not register account', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Registering account…" />}
      <FormShell
        crumbs={crumbs}
        title="Register bank account"
        icon="building-2"
        description="Add a banking institution and account the company transacts through. Registered accounts become available for fund transfers, payments, lodgements and reporting."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to register
          </Button>
        }
        submitLabel="Register account"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="Account numbers must be unique. Once registered, the account is immediately selectable across every financial module."
        aside={
          <Panel title="Where it will be used">
            <MetaRow label="Bank Statement" value="Immediate" />
            <MetaRow label="Credit Petty Cash" value="As a funding source" />
            <MetaRow
              label="POS/Fund Transfer Confirmation"
              value="As a receiving account"
            />
            <MetaRow
              label="Payment/Running Cost"
              value="As a payment source"
            />
          </Panel>
        }
      >
        <Panel title="Institution">
          <FieldSet columns={2}>
            <Input
              label="Bank name"
              placeholder="e.g. First Bank of Nigeria"
              value={values.bankName}
              onChange={(e) => set('bankName', val(e))}
            />
            <Input
              label="Branch"
              placeholder="e.g. Ikeja GRA"
              value={values.branch}
              onChange={(e) => set('branch', val(e))}
            />
            <Input
              label="Account name"
              placeholder="e.g. ZifIQ Manufacturing Ltd"
              value={values.accountName}
              onChange={(e) => set('accountName', val(e))}
            />
            <Input
              label="Account number"
              placeholder="10 digits"
              hint="Must be unique across the register."
              value={values.accountNumber}
              onChange={(e) => set('accountNumber', val(e))}
            />
            <Select
              label="Account type"
              options={ACCOUNT_TYPES}
              placeholder="Select type…"
              value={values.accountType}
              onChange={(v) => set('accountType', val(v))}
            />
            <Input
              label="Sort code / BIC"
              placeholder="Optional"
              value={values.sortCodeOrBic}
              onChange={(e) => set('sortCodeOrBic', val(e))}
            />
            <Select
              label="Location"
              options={locations}
              placeholder="Select location…"
              value={values.locationId}
              onChange={(v) => set('locationId', val(v))}
            />
            <Input
              label="Currency"
              placeholder="NGN"
              value={values.currencyCode}
              onChange={(e) => set('currencyCode', val(e))}
            />
          </FieldSet>
        </Panel>

        <Panel title="Control">
          <FieldSet columns={2}>
            <Input
              label="Authorised signatory"
              placeholder="e.g. M. Okonkwo"
              value={values.authorisedSignatory}
              onChange={(e) => set('authorisedSignatory', val(e))}
            />
            <Input
              label="Relationship manager"
              placeholder="Optional"
              value={values.relationshipManager}
              onChange={(e) => set('relationshipManager', val(e))}
            />
            <Input
              label="Date opened"
              type="date"
              value={values.dateOpened}
              onChange={(e) => set('dateOpened', val(e))}
            />
            <Input
              label="Opening balance"
              type="number"
              placeholder="0.00"
              value={values.openingBalance}
              onChange={(e) => set('openingBalance', val(e))}
            />
          </FieldSet>
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Switch
              checked={values.active}
              onChange={(v) => set('active', typeof v === 'boolean' ? v : val(v))}
            />
            <div>
              <div
                style={{
                  font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)',
                  color: 'var(--text-strong)',
                }}
              >
                Active
              </div>
              <div
                style={{
                  font: 'var(--type-caption)',
                  color: 'var(--text-muted)',
                  marginTop: 2,
                }}
              >
                Dormant accounts stay in historic statements but cannot receive
                new transactions.
              </div>
            </div>
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main list ─────────────────────────────────────────────
export default function BankRegisterScreen({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list')

  // filters
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  // data
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // location options for filter + create form
  const [locations, setLocations] = useState([])

  // fetch showrooms once so we can combine with factories
  useEffect(() => {
    let cancelled = false
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        const showroomOptions = (res.data || []).map((s) => ({
          value: s.id,
          label: `${s.label || s.name || s.code} (showroom)`,
        }))
        const factoryOptions = (factories || []).map((f) => ({
          value: f.id,
          label: `${f.name} (factory)`,
        }))
        setLocations([...factoryOptions, ...showroomOptions])
      })
      .catch(() => {
        // fall back to factories only
        if (cancelled) return
        setLocations(
          (factories || []).map((f) => ({
            value: f.id,
            label: `${f.name} (factory)`,
          }))
        )
      })
    return () => {
      cancelled = true
    }
  }, [factories])

  // load accounts whenever a server filter changes
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const query = {}
      if (statusFilter) query.status = statusFilter
      if (locationFilter) query.locationId = locationFilter

      const res = await accountApi.listBankAccounts(query)
      setRows(res.data || [])
    } catch (e) {
      showToast('Could not load bank accounts', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, locationFilter, showToast])

  useEffect(() => {
    load()
  }, [load])

  const afterCreate = () => {
    setMode('list')
    load()
  }

  if (mode === 'create') {
    return (
      <BankForm
        crumbs={crumbs}
        locations={locations}
        onBack={() => setMode('list')}
        onDone={afterCreate}
      />
    )
  }

  // stats (computed from the full list, since the endpoint isn't paginated)
  const activeCount = rows.filter((r) => r.status === 'ACTIVE').length
  const institutionCount = new Set(rows.map((r) => r.bankName).filter(Boolean)).size
  const totalBalance = rows.reduce((n, r) => n + (r.currentBalance || 0), 0)

  const locationFilterOptions = [
    { value: '', label: 'All locations' },
    ...locations,
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading bank accounts…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Bank Register'}
        icon={leaf?.icon}
        description="The company's banking institutions and accounts. Registered banks are used throughout the system for transfers, payments, lodgements and reporting."
        createLabel="Register account"
        onCreate={() => setMode('create')}
        searchPlaceholder="Search by bank, account number or branch…"
        filters={
          <>
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 160 }}
            />
            <Select
              options={locationFilterOptions}
              value={locationFilter}
              onChange={(v) => setLocationFilter(val(v))}
              style={{ width: 220 }}
            />
          </>
        }
        stats={[
          { label: 'Accounts registered', value: String(rows.length) },
          { label: 'Active', value: String(activeCount) },
          { label: 'Institutions', value: String(institutionCount) },
          { label: 'Total balance', value: money(totalBalance) },
        ]}
        columns={COLUMNS}
        rows={rows}
        onRowClick={() => {}}
        emptyTitle="No bank accounts registered"
        emptyDescription="Register an account to make it selectable in transfers, payments and reporting."
        footnote="A record cannot be created with missing required fields or an account number that duplicates an existing entry."
      />
    </>
  )
}