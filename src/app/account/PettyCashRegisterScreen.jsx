// import { useEffect, useState, useCallback } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Switch } from '../../ds/components/forms/Switch.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { useStore } from '../store.jsx'
// import { money, fmtDate } from '../utils.js'
// import AccountApi from '../../api/AccountApi.js'
// import ShowroomApi from '../../api/ShowroomApi.js'

// const accountApi = new AccountApi()
// const showroomApi = new ShowroomApi()

// // backend enum: PETTY_CASH | TILL | VAULT
// const KINDS = [
//   { value: 'PETTY_CASH', label: 'Petty cash' },
//   { value: 'TILL', label: 'Till' },
//   { value: 'VAULT', label: 'Vault' },
// ]
// const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.value, k.label]))
// const KIND_TONE = { PETTY_CASH: 'brand', TILL: 'info', VAULT: 'neutral' }

// const STATUS_LABEL = { ACTIVE: 'Active', INACTIVE: 'Inactive' }
// const STATUS_TONE = { ACTIVE: 'success', INACTIVE: 'neutral' }

// const STATUS_FILTER_OPTIONS = [
//   { value: '', label: 'All statuses' },
//   { value: 'ACTIVE', label: 'Active' },
//   { value: 'INACTIVE', label: 'Inactive' },
// ]

// const today = () => new Date().toISOString().slice(0, 10)

// // DS Select fires the value directly, Input fires a native event.
// function val(payload) {
//   if (payload == null) return payload
//   if (typeof payload === 'object') {
//     if (payload.target && 'value' in payload.target) return payload.target.value
//     if ('value' in payload) return payload.value
//   }
//   return payload
// }

// // ── Create ────────────────────────────────────────────────
// function CreateCashAccountForm({ crumbs, locations, banks, onBack, onDone }) {
//   const { showToast } = useStore()

//   const [values, setValues] = useState({
//     code: '',
//     name: '',
//     kind: 'PETTY_CASH',
//     locationId: '',
//     currencyCode: 'NGN',
//     openingBalance: '',
//     floatLimit: '',
//     posTerminalRef: '',
//     posSettlementBankAccountIdId: '',
//   })
//   const [submitting, setSubmitting] = useState(false)

//   const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))

//   const isTill = values.kind === 'TILL'

//   const canSubmit =
//     values.code.trim() &&
//     values.name.trim() &&
//     values.kind &&
//     values.locationId &&
//     values.currencyCode.trim() &&
//     !submitting &&
//     (!isTill ||
//       (values.posTerminalRef.trim() &&
//         values.posSettlementBankAccountIdId))

//   async function submit() {
//     if (!canSubmit) return
//     setSubmitting(true)
//     try {
//       await accountApi.createCashAccount({
//         code: values.code.trim(),
//         name: values.name.trim(),
//         kind: values.kind,
//         locationId: values.locationId,
//         currencyCode: values.currencyCode.trim() || 'NGN',
//         openingBalance: Number(values.openingBalance) || 0,
//         floatLimit: Number(values.floatLimit) || 0,
//         posTerminalRef: isTill ? values.posTerminalRef.trim() : '',
//         posSettlementBankAccountIdId: isTill
//           ? values.posSettlementBankAccountIdId
//           : '',
//       })
//       showToast(
//         'Cash account created',
//         `${values.name} (${values.code}) added to the register.`
//       )
//       onDone()
//     } catch (e) {
//       showToast('Could not create cash account', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <>
//       {submitting && <Loader overlay label="Creating cash account…" />}
//       <FormShell
//         crumbs={crumbs}
//         title="Create cash account"
//         icon="wallet"
//         description="Register a petty cash account, till or vault. Petty cash accounts are used for daily operational spending and are typically topped up to a set float limit."
//         headerActions={
//           <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
//             Back to register
//           </Button>
//         }
//         submitLabel="Create account"
//         onSubmit={submit}
//         onCancel={onBack}
//         submitDisabled={!canSubmit}
//         note="Once created, the account is immediately available for running costs, fund disbursements and cash reconciliation."
//         aside={
//           <Panel title="Where it will be used">
//             <MetaRow label="Running cost payments" value="Immediate" />
//             <MetaRow label="Fund disbursement" value="Immediate" />
//             <MetaRow label="Cash flow statement" value="Immediate" />
//             <MetaRow label="Till/POS settlement" value={isTill ? 'Immediate' : '—'} />
//           </Panel>
//         }
//       >
//         <Panel title="Account details">
//           <FieldSet columns={2}>
//             <Input
//               label="Account code"
//               placeholder="e.g. PC-001"
//               hint="Unique across the register."
//               value={values.code}
//               onChange={(e) => set('code', val(e))}
//             />
//             <Input
//               label="Account name"
//               placeholder="e.g. Head office petty cash"
//               value={values.name}
//               onChange={(e) => set('name', val(e))}
//             />
//             <Select
//               label="Kind"
//               options={KINDS}
//               value={values.kind}
//               onChange={(v) => set('kind', val(v))}
//             />
//             <Select
//               label="Location"
//               options={locations}
//               placeholder="Select location…"
//               value={values.locationId}
//               onChange={(v) => set('locationId', val(v))}
//             />
//             <Input
//               label="Currency"
//               placeholder="NGN"
//               value={values.currencyCode}
//               onChange={(e) => set('currencyCode', val(e))}
//             />
//             <Input
//               label="Opening balance"
//               type="number"
//               placeholder="0.00"
//               value={values.openingBalance}
//               onChange={(e) => set('openingBalance', val(e))}
//             />
//             <Input
//               label="Float limit"
//               type="number"
//               placeholder="0.00"
//               hint="Alerts you when the balance falls below this."
//               value={values.floatLimit}
//               onChange={(e) => set('floatLimit', val(e))}
//             />
//           </FieldSet>
//         </Panel>

//         {isTill && (
//           <Panel
//             title="POS settlement"
//             description="Required for till accounts so terminal settlements can be matched to a bank account."
//           >
//             <FieldSet columns={2}>
//               <Input
//                 label="POS terminal reference"
//                 placeholder="e.g. POS-IKJ-01"
//                 value={values.posTerminalRef}
//                 onChange={(e) => set('posTerminalRef', val(e))}
//               />
//               <Select
//                 label="Settlement bank account"
//                 options={banks}
//                 placeholder={
//                   banks.length
//                     ? 'Select bank account…'
//                     : 'No bank accounts registered'
//                 }
//                 value={values.posSettlementBankAccountIdId}
//                 onChange={(v) =>
//                   set('posSettlementBankAccountIdId', val(v))
//                 }
//                 disabled={!banks.length}
//               />
//             </FieldSet>
//             {!banks.length && (
//               <Callout
//                 tone="warning"
//                 icon="building-2"
//                 title="No bank accounts yet"
//                 style={{ marginTop: 14 }}
//               >
//                 Register a bank account first — till settlements need one to
//                 reconcile against.
//               </Callout>
//             )}
//           </Panel>
//         )}
//       </FormShell>
//     </>
//   )
// }

// // ── Edit (only name / float / POS settlement are editable) ─
// function EditCashAccountForm({ account, crumbs, banks, onBack, onDone }) {
//   const { showToast } = useStore()

//   const [values, setValues] = useState({
//     name: account.name || '',
//     floatLimit: account.floatLimit != null ? String(account.floatLimit) : '',
//     posTerminalRef: account.posTerminalRef || '',
//     posSettlementBankAccountIdId: account.posSettlementBankAccount?.id || '',
//   })
//   const [submitting, setSubmitting] = useState(false)

//   const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))
//   const isTill = account.kind === 'TILL'

//   const canSubmit =
//     values.name.trim() &&
//     !submitting &&
//     (!isTill || (values.posTerminalRef.trim() && values.posSettlementBankAccountIdId))

//   async function submit() {
//     if (!canSubmit) return
//     setSubmitting(true)
//     try {
//       await accountApi.editCashAccount(account.id, {
//         name: values.name.trim(),
//         floatLimit: Number(values.floatLimit) || 0,
//         posTerminalRef: isTill ? values.posTerminalRef.trim() : '',
//         posSettlementBankAccountIdId: isTill
//           ? values.posSettlementBankAccountIdId
//           : '',
//       })
//       showToast('Cash account updated', `${values.name} saved.`)
//       onDone()
//     } catch (e) {
//       showToast('Could not update account', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <>
//       {submitting && <Loader overlay label="Saving changes…" />}
//       <FormShell
//         crumbs={crumbs}
//         title={`Edit ${account.name}`}
//         icon="wallet"
//         description="Update the account name, float limit and POS settlement details. Code, kind, location and opening balance are locked after creation."
//         headerActions={
//           <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
//             Back to register
//           </Button>
//         }
//         submitLabel="Save changes"
//         onSubmit={submit}
//         onCancel={onBack}
//         submitDisabled={!canSubmit}
//         aside={
//           <Panel title="Account">
//             <MetaRow label="Code" value={account.code} mono />
//             <MetaRow
//               label="Kind"
//               value={KIND_LABEL[account.kind] || account.kind}
//             />
//             <MetaRow
//               label="Location"
//               value={account.location?.name || '—'}
//             />
//             <MetaRow
//               label="Currency"
//               value={account.currencyCode || '—'}
//               mono
//             />
//             <MetaRow
//               label="Opening balance"
//               value={money(account.openingBalance || 0)}
//               mono
//             />
//             <MetaRow
//               label="Current balance"
//               value={money(account.currentBalance || 0)}
//               mono
//               tone={account.belowFloat ? 'negative' : 'positive'}
//             />
//           </Panel>
//         }
//       >
//         <Panel title="Editable details">
//           <FieldSet columns={2}>
//             <Input
//               label="Account name"
//               value={values.name}
//               onChange={(e) => set('name', val(e))}
//             />
//             <Input
//               label="Float limit"
//               type="number"
//               placeholder="0.00"
//               hint="Alerts you when the balance falls below this."
//               value={values.floatLimit}
//               onChange={(e) => set('floatLimit', val(e))}
//             />
//           </FieldSet>
//         </Panel>

//         {isTill && (
//           <Panel title="POS settlement">
//             <FieldSet columns={2}>
//               <Input
//                 label="POS terminal reference"
//                 placeholder="e.g. POS-IKJ-01"
//                 value={values.posTerminalRef}
//                 onChange={(e) => set('posTerminalRef', val(e))}
//               />
//               <Select
//                 label="Settlement bank account"
//                 options={banks}
//                 placeholder={
//                   banks.length
//                     ? 'Select bank account…'
//                     : 'No bank accounts registered'
//                 }
//                 value={values.posSettlementBankAccountIdId}
//                 onChange={(v) =>
//                   set('posSettlementBankAccountIdId', val(v))
//                 }
//                 disabled={!banks.length}
//               />
//             </FieldSet>
//           </Panel>
//         )}
//       </FormShell>
//     </>
//   )
// }

// // ── Status change (confirmation) ──────────────────────────
// function ChangeStatusForm({ account, crumbs, onBack, onDone }) {
//   const { showToast } = useStore()
//   const [submitting, setSubmitting] = useState(false)

//   const nextStatus = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

//   async function submit() {
//     setSubmitting(true)
//     try {
//       await accountApi.editCashAccountStatus(account.id, { status: nextStatus })
//       showToast(
//         'Status updated',
//         `${account.name} is now ${STATUS_LABEL[nextStatus].toLowerCase()}.`
//       )
//       onDone()
//     } catch (e) {
//       showToast('Could not change status', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   return (
//     <>
//       {submitting && <Loader overlay label="Updating status…" />}
//       <FormShell
//         crumbs={crumbs}
//         title={nextStatus === 'INACTIVE' ? 'Deactivate account' : 'Activate account'}
//         icon={nextStatus === 'INACTIVE' ? 'ban' : 'check'}
//         description={
//           nextStatus === 'INACTIVE'
//             ? 'A deactivated account stays visible in historic statements but cannot receive or disburse cash until reactivated.'
//             : 'Reactivate this account so it can be used again for petty cash transactions and fund disbursements.'
//         }
//         headerActions={
//           <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
//             Back to register
//           </Button>
//         }
//         submitLabel={nextStatus === 'INACTIVE' ? 'Deactivate' : 'Activate'}
//         onSubmit={submit}
//         onCancel={onBack}
//         submitDisabled={submitting}
//         aside={
//           <Panel title="Account">
//             <MetaRow label="Code" value={account.code} mono />
//             <MetaRow label="Name" value={account.name} />
//             <MetaRow
//               label="Kind"
//               value={KIND_LABEL[account.kind] || account.kind}
//             />
//             <MetaRow
//               label="Location"
//               value={account.location?.name || '—'}
//             />
//             <MetaRow
//               label="Current status"
//               value={STATUS_LABEL[account.status] || account.status}
//             />
//           </Panel>
//         }
//       >
//         <Panel title="Confirmation">
//           <div style={{ color: 'var(--text-strong)', font: 'var(--type-body)' }}>
//             {nextStatus === 'INACTIVE' ? (
//               <>
//                 You're about to deactivate <strong>{account.name}</strong>. Historic
//                 statements and reconciliation records are kept, but no new
//                 transactions can be recorded against this account.
//               </>
//             ) : (
//               <>
//                 Reactivating <strong>{account.name}</strong> makes it selectable
//                 again in running costs, fund disbursements and cash reporting.
//               </>
//             )}
//           </div>
//         </Panel>
//       </FormShell>
//     </>
//   )
// }

// // ── Main list ─────────────────────────────────────────────
// export default function CashAccountRegister({ leaf, moduleLabel, parentLabel }) {
//   const { factories, showToast } = useStore()
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   const [mode, setMode] = useState('list')
//   const [activeAccount, setActiveAccount] = useState(null)

//   // filters
//   const [statusFilter, setStatusFilter] = useState('')
//   const [kindFilter, setKindFilter] = useState('')
//   const [locationFilter, setLocationFilter] = useState('')

//   // data
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)

//   // lookups
//   const [locations, setLocations] = useState([])
//   const [banks, setBanks] = useState([])

//   // ── load locations + banks once ─────────────────────────
//   useEffect(() => {
//     let cancelled = false

//     // combined factory + showroom list for the location picker
//     showroomApi
//       .lookupPickerWithAreas({ status: ['ACTIVE'] })
//       .then((res) => {
//         if (cancelled) return
//         const showroomOptions = (res.data || []).map((s) => ({
//           value: s.id,
//           label: `${s.label || s.name || s.code} (showroom)`,
//         }))
//         const factoryOptions = (factories || []).map((f) => ({
//           value: f.id,
//           label: `${f.name} (factory)`,
//         }))
//         setLocations([...factoryOptions, ...showroomOptions])
//       })
//       .catch(() => {
//         if (cancelled) return
//         setLocations(
//           (factories || []).map((f) => ({
//             value: f.id,
//             label: `${f.name} (factory)`,
//           }))
//         )
//       })

//     // banks for the POS settlement dropdown (only used for TILL)
//     accountApi
//       .listBankAccounts({ status: ['ACTIVE'] })
//       .then((res) => {
//         if (cancelled) return
//         const list = Array.isArray(res.data) ? res.data : res.data?.items || []
//         setBanks(
//           list.map((b) => ({
//             value: b.id,
//             label:
//               `${b.bankName || b.name || '—'}` +
//               (b.accountNumber || b.account
//                 ? ` · ${b.accountNumber || b.account}`
//                 : ''),
//           }))
//         )
//       })
//       .catch(() => {
//         /* non-fatal — dropdown shows "No bank accounts registered" if TILL picked */
//       })

//     return () => {
//       cancelled = true
//     }
//   }, [factories])

//   // ── load list ───────────────────────────────────────────
//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const query = {}
//       if (statusFilter) query.status = statusFilter
//       if (kindFilter) query.kind = [kindFilter]
//       if (locationFilter) query.locationId = locationFilter

//       const res = await accountApi.listCashAccounts(query)
//       setRows(res.data || [])
//     } catch (e) {
//       showToast('Could not load cash accounts', e.message, true)
//     } finally {
//       setLoading(false)
//     }
//   }, [statusFilter, kindFilter, locationFilter, showToast])

//   useEffect(() => {
//     load()
//   }, [load])

//   const afterMutation = () => {
//     setMode('list')
//     setActiveAccount(null)
//     load()
//   }

//   if (mode === 'create') {
//     return (
//       <CreateCashAccountForm
//         crumbs={crumbs}
//         locations={locations}
//         banks={banks}
//         onBack={() => setMode('list')}
//         onDone={afterMutation}
//       />
//     )
//   }
//   if (mode === 'edit' && activeAccount) {
//     return (
//       <EditCashAccountForm
//         account={activeAccount}
//         crumbs={crumbs}
//         banks={banks}
//         onBack={() => setMode('list')}
//         onDone={afterMutation}
//       />
//     )
//   }
//   if (mode === 'status' && activeAccount) {
//     return (
//       <ChangeStatusForm
//         account={activeAccount}
//         crumbs={crumbs}
//         onBack={() => setMode('list')}
//         onDone={afterMutation}
//       />
//     )
//   }

//   // ── columns ─────────────────────────────────────────────
//   const columns = [
//     { key: 'code', label: 'Code', width: 110, mono: true },
//     { key: 'name', label: 'Name', width: 220 },
//     {
//       key: 'kind',
//       label: 'Kind',
//       width: 130,
//       render: (r) => (
//         <Badge tone={KIND_TONE[r.kind] || 'neutral'}>
//           {KIND_LABEL[r.kind] || r.kind || '—'}
//         </Badge>
//       ),
//     },
//     {
//       key: 'location',
//       label: 'Location',
//       width: 190,
//       render: (r) => r.location?.name || '—',
//     },
//     {
//       key: 'currencyCode',
//       label: 'Currency',
//       width: 100,
//       mono: true,
//       render: (r) => r.currencyCode || '—',
//     },
//     {
//       key: 'openingBalance',
//       label: 'Opening balance',
//       width: 150,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.openingBalance || 0),
//     },
//     {
//       key: 'currentBalance',
//       label: 'Current balance',
//       width: 160,
//       align: 'right',
//       mono: true,
//       render: (r) => (
//         <span
//           style={{
//             color: r.belowFloat ? 'var(--danger)' : 'inherit',
//             fontWeight: r.belowFloat ? 600 : undefined,
//           }}
//           title={r.belowFloat ? 'Below float — needs replenishment' : undefined}
//         >
//           {money(r.currentBalance || 0)}
//           {r.belowFloat ? ' ⚠' : ''}
//         </span>
//       ),
//     },
//     {
//       key: 'floatLimit',
//       label: 'Float limit',
//       width: 140,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.floatLimit || 0),
//     },
//     {
//       key: 'posSettlementBankAccount',
//       label: 'Settlement account',
//       width: 200,
//       render: (r) =>
//         r.kind === 'TILL' && r.posSettlementBankAccount
//           ? r.posSettlementBankAccount.name || '—'
//           : '—',
//     },
//     {
//       key: 'status',
//       label: 'Status',
//       width: 110,
//       render: (r) => (
//         <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
//           {STATUS_LABEL[r.status] || r.status || '—'}
//         </Badge>
//       ),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       width: 210,
//       sortable: false,
//       render: (r) => (
//         <div style={{ display: 'flex', gap: 6 }}>
//           <Button
//             size="sm"
//             variant="secondary"
//             onClick={() => {
//               setActiveAccount(r)
//               setMode('edit')
//             }}
//           >
//             Edit
//           </Button>
//           <Button
//             size="sm"
//             variant="secondary"
//             onClick={() => {
//               setActiveAccount(r)
//               setMode('status')
//             }}
//           >
//             {r.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
//           </Button>
//         </div>
//       ),
//     },
//   ]

//   // ── stats ───────────────────────────────────────────────
//   const activeCount = rows.filter((r) => r.status === 'ACTIVE').length
//   const belowFloatCount = rows.filter((r) => r.belowFloat).length
//   const totalBalance = rows.reduce((n, r) => n + (r.currentBalance || 0), 0)
//   const totalFloat = rows.reduce((n, r) => n + (r.floatLimit || 0), 0)

//   const locationOptions = [
//     { value: '', label: 'All locations' },
//     ...locations,
//   ]
//   const kindOptions = [
//     { value: '', label: 'All kinds' },
//     ...KINDS,
//   ]

//   return (
//     <>
//       {loading && <Loader overlay label="Loading cash accounts…" />}
//       <RegisterShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'Cash Accounts'}
//         icon={leaf?.icon}
//         description="Petty cash accounts, tills and vaults held across factories and showrooms. Each account tracks its own float so you can see when replenishment is due."
//         createLabel="Create cash account"
//         onCreate={() => setMode('create')}
//         searchPlaceholder="Search by name, code or location…"
//         filters={
//           <>
//             <Select
//               options={kindOptions}
//               value={kindFilter}
//               onChange={(v) => setKindFilter(val(v))}
//               style={{ width: 160 }}
//             />
//             <Select
//               options={locationOptions}
//               value={locationFilter}
//               onChange={(v) => setLocationFilter(val(v))}
//               style={{ width: 220 }}
//             />
//             <Select
//               options={STATUS_FILTER_OPTIONS}
//               value={statusFilter}
//               onChange={(v) => setStatusFilter(val(v))}
//               style={{ width: 150 }}
//             />
//           </>
//         }
//         stats={[
//           { label: 'Accounts', value: String(rows.length) },
//           { label: 'Active', value: String(activeCount) },
//           {
//             label: 'Below float',
//             value: String(belowFloatCount),
//             tone: belowFloatCount ? 'warning' : undefined,
//             hint: belowFloatCount ? 'Needs replenishment' : undefined,
//           },
//           { label: 'Total balance', value: money(totalBalance) },
//         ]}
//         columns={columns}
//         rows={rows}
//         onRowClick={() => {}}
//         emptyTitle="No cash accounts registered"
//         emptyDescription="Create a petty cash account to start tracking daily operational spending."
//         footnote={`Float limit represents the target balance for each account. Accounts whose current balance falls below their float limit are flagged for replenishment. Combined float across this register: ${money(totalFloat)}.`}
//       />
//     </>
//   )
// }


import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()

const KINDS = [
  { value: 'PETTY_CASH', label: 'Petty cash' },
  { value: 'TILL', label: 'Till' },
  { value: 'VAULT', label: 'Vault' },
]
const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.value, k.label]))
const KIND_TONE = { PETTY_CASH: 'brand', TILL: 'info', VAULT: 'neutral' }

const STATUS_LABEL = { ACTIVE: 'Active', INACTIVE: 'Inactive' }
const STATUS_TONE = { ACTIVE: 'success', INACTIVE: 'neutral' }
const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

function toBankOption(b) {
  if (!b?.id) return null
  const label =
    [b.bankName, b.accountNumber].filter(Boolean).join(' · ') ||
    b.accountName ||
    b.code ||
    b.id
  return { value: b.id, label }
}

// ── Create ────────────────────────────────────────────────
function CreateCashAccountForm({
  crumbs,
  locations,
  banks,
  loadingBanks,
  banksError,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()

  const [values, setValues] = useState({
    code: '',
    name: '',
    kind: 'PETTY_CASH',
    locationId: '',
    currencyCode: 'NGN',
    openingBalance: '',
    floatLimit: '',
    posTerminalRef: '',
    posSettlementBankAccountIdId: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))
  const isTill = values.kind === 'TILL'

  const canSubmit =
    values.code.trim() &&
    values.name.trim() &&
    values.kind &&
    values.locationId &&
    values.currencyCode.trim() &&
    !submitting &&
    (!isTill ||
      (values.posTerminalRef.trim() &&
        values.posSettlementBankAccountIdId))

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.createCashAccount({
        code: values.code.trim(),
        name: values.name.trim(),
        kind: values.kind,
        locationId: values.locationId,
        currencyCode: values.currencyCode.trim() || 'NGN',
        openingBalance: Number(values.openingBalance) || 0,
        floatLimit: Number(values.floatLimit) || 0,
        // only tills carry POS data; petty cash and vault send empty strings
        posTerminalRef: isTill ? values.posTerminalRef.trim() : '',
        posSettlementBankAccountIdId: isTill
          ? values.posSettlementBankAccountIdId
          : '',
      })
      showToast(
        'Cash account created',
        `${values.name} (${values.code}) added to the register.`
      )
      onDone()
    } catch (e) {
      showToast('Could not create cash account', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Creating cash account…" />}
      <FormShell
        crumbs={crumbs}
        title="Create cash account"
        icon="wallet"
        description="Register a petty cash account, till or vault. Petty cash accounts are used for daily operational spending and are typically topped up to a set float limit."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to register
          </Button>
        }
        submitLabel="Create account"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="Once created, the account is immediately available for running costs, fund disbursements and cash reconciliation."
        aside={
          <Panel title="Where it will be used">
            <MetaRow label="Running cost payments" value="Immediate" />
            <MetaRow label="Fund disbursement" value="Immediate" />
            <MetaRow label="Cash flow statement" value="Immediate" />
            <MetaRow
              label="Till/POS settlement"
              value={isTill ? 'Immediate' : '—'}
            />
          </Panel>
        }
      >
        <Panel title="Account details">
          <FieldSet columns={2}>
            <Input
              label="Account code"
              placeholder="e.g. PC-001"
              hint="Unique across the register."
              value={values.code}
              onChange={(e) => set('code', val(e))}
            />
            <Input
              label="Account name"
              placeholder="e.g. Head office petty cash"
              value={values.name}
              onChange={(e) => set('name', val(e))}
            />
            <Select
              label="Kind"
              options={KINDS}
              value={values.kind}
              onChange={(v) => set('kind', val(v))}
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
            <Input
              label="Opening balance"
              type="number"
              placeholder="0.00"
              value={values.openingBalance}
              onChange={(e) => set('openingBalance', val(e))}
            />
            <Input
              label="Float limit"
              type="number"
              placeholder="0.00"
              hint="Alerts you when the balance falls below this."
              value={values.floatLimit}
              onChange={(e) => set('floatLimit', val(e))}
            />
          </FieldSet>
        </Panel>

        {isTill && (
          <Panel
            title="POS settlement"
            description="Required for till accounts so terminal settlements can be matched to a bank account."
          >
            <FieldSet columns={2}>
              <Input
                label="POS terminal reference"
                placeholder="e.g. POS-IKJ-01"
                value={values.posTerminalRef}
                onChange={(e) => set('posTerminalRef', val(e))}
              />
              <Select
                label="Settlement bank account"
                options={banks}
                placeholder={
                  loadingBanks
                    ? 'Loading bank accounts…'
                    : banksError
                      ? 'Could not load bank accounts'
                      : banks.length
                        ? 'Select bank account…'
                        : 'No bank accounts registered'
                }
                value={values.posSettlementBankAccountIdId}
                onChange={(v) =>
                  set('posSettlementBankAccountIdId', val(v))
                }
                disabled={loadingBanks || banks.length === 0}
              />
            </FieldSet>
            {!loadingBanks && banks.length === 0 && (
              <Callout
                tone={banksError ? 'danger' : 'warning'}
                icon={banksError ? 'circle-alert' : 'building-2'}
                title={
                  banksError
                    ? 'Could not load bank accounts'
                    : 'No bank accounts registered yet'
                }
                style={{ marginTop: 14 }}
              >
                {banksError
                  ? `The settlement dropdown is empty because the bank account list failed to load (${banksError}).`
                  : 'Register a bank account under Banking → Bank Register first. Till settlements need one to reconcile against.'}
              </Callout>
            )}
          </Panel>
        )}
      </FormShell>
    </>
  )
}

// ── Edit ──────────────────────────────────────────────────
function EditCashAccountForm({
  account,
  crumbs,
  banks,
  loadingBanks,
  banksError,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()

  const [values, setValues] = useState({
    name: account.name || '',
    floatLimit:
      account.floatLimit != null ? String(account.floatLimit) : '',
    posTerminalRef: account.posTerminalRef || '',
    posSettlementBankAccountIdId:
      account.posSettlementBankAccount?.id || '',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }))
  const isTill = account.kind === 'TILL'

  const canSubmit =
    values.name.trim() &&
    !submitting &&
    (!isTill ||
      (values.posTerminalRef.trim() &&
        values.posSettlementBankAccountIdId))

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.editCashAccount(account.id, {
        name: values.name.trim(),
        floatLimit: Number(values.floatLimit) || 0,
        posTerminalRef: isTill ? values.posTerminalRef.trim() : '',
        posSettlementBankAccountIdId: isTill
          ? values.posSettlementBankAccountIdId
          : '',
      })
      showToast('Cash account updated', `${values.name} saved.`)
      onDone()
    } catch (e) {
      showToast('Could not update account', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Saving changes…" />}
      <FormShell
        crumbs={crumbs}
        title={`Edit ${account.name}`}
        icon="wallet"
        description="Update the account name, float limit and POS settlement details. Code, kind, location and opening balance are locked after creation."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to register
          </Button>
        }
        submitLabel="Save changes"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Account">
            <MetaRow label="Code" value={account.code} mono />
            <MetaRow
              label="Kind"
              value={KIND_LABEL[account.kind] || account.kind}
            />
            <MetaRow
              label="Location"
              value={account.location?.name || '—'}
            />
            <MetaRow
              label="Currency"
              value={account.currencyCode || '—'}
              mono
            />
            <MetaRow
              label="Opening balance"
              value={money(account.openingBalance || 0)}
              mono
            />
            <MetaRow
              label="Current balance"
              value={money(account.currentBalance || 0)}
              mono
              tone={account.belowFloat ? 'negative' : 'positive'}
            />
          </Panel>
        }
      >
        <Panel title="Editable details">
          <FieldSet columns={2}>
            <Input
              label="Account name"
              value={values.name}
              onChange={(e) => set('name', val(e))}
            />
            <Input
              label="Float limit"
              type="number"
              placeholder="0.00"
              hint="Alerts you when the balance falls below this."
              value={values.floatLimit}
              onChange={(e) => set('floatLimit', val(e))}
            />
          </FieldSet>
        </Panel>

        {isTill && (
          <Panel title="POS settlement">
            <FieldSet columns={2}>
              <Input
                label="POS terminal reference"
                placeholder="e.g. POS-IKJ-01"
                value={values.posTerminalRef}
                onChange={(e) => set('posTerminalRef', val(e))}
              />
              <Select
                label="Settlement bank account"
                options={banks}
                placeholder={
                  loadingBanks
                    ? 'Loading bank accounts…'
                    : banksError
                      ? 'Could not load bank accounts'
                      : banks.length
                        ? 'Select bank account…'
                        : 'No bank accounts registered'
                }
                value={values.posSettlementBankAccountIdId}
                onChange={(v) =>
                  set('posSettlementBankAccountIdId', val(v))
                }
                disabled={loadingBanks || banks.length === 0}
              />
            </FieldSet>
            {!loadingBanks && banks.length === 0 && (
              <Callout
                tone={banksError ? 'danger' : 'warning'}
                icon={banksError ? 'circle-alert' : 'building-2'}
                title={
                  banksError
                    ? 'Could not load bank accounts'
                    : 'No bank accounts registered yet'
                }
                style={{ marginTop: 14 }}
              >
                {banksError
                  ? `The bank account list failed to load (${banksError}).`
                  : 'Register a bank account under Banking → Bank Register first.'}
              </Callout>
            )}
          </Panel>
        )}
      </FormShell>
    </>
  )
}

// ── Status change ─────────────────────────────────────────
function ChangeStatusForm({ account, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [submitting, setSubmitting] = useState(false)

  const nextStatus = account.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

  async function submit() {
    setSubmitting(true)
    try {
      await accountApi.editCashAccountStatus(account.id, {
        status: nextStatus,
      })
      showToast(
        'Status updated',
        `${account.name} is now ${STATUS_LABEL[nextStatus].toLowerCase()}.`
      )
      onDone()
    } catch (e) {
      showToast('Could not change status', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Updating status…" />}
      <FormShell
        crumbs={crumbs}
        title={
          nextStatus === 'INACTIVE'
            ? 'Deactivate account'
            : 'Activate account'
        }
        icon={nextStatus === 'INACTIVE' ? 'ban' : 'check'}
        description={
          nextStatus === 'INACTIVE'
            ? 'A deactivated account stays visible in historic statements but cannot receive or disburse cash until reactivated.'
            : 'Reactivate this account so it can be used again for petty cash transactions and fund disbursements.'
        }
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to register
          </Button>
        }
        submitLabel={nextStatus === 'INACTIVE' ? 'Deactivate' : 'Activate'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={submitting}
        aside={
          <Panel title="Account">
            <MetaRow label="Code" value={account.code} mono />
            <MetaRow label="Name" value={account.name} />
            <MetaRow
              label="Kind"
              value={KIND_LABEL[account.kind] || account.kind}
            />
            <MetaRow
              label="Location"
              value={account.location?.name || '—'}
            />
            <MetaRow
              label="Current status"
              value={STATUS_LABEL[account.status] || account.status}
            />
          </Panel>
        }
      >
        <Panel title="Confirmation">
          <div
            style={{
              color: 'var(--text-strong)',
              font: 'var(--type-body)',
            }}
          >
            {nextStatus === 'INACTIVE' ? (
              <>
                You're about to deactivate <strong>{account.name}</strong>.
                Historic statements and reconciliation records are kept, but
                no new transactions can be recorded against this account.
              </>
            ) : (
              <>
                Reactivating <strong>{account.name}</strong> makes it
                selectable again in running costs, fund disbursements and cash
                reporting.
              </>
            )}
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main list ─────────────────────────────────────────────
export default function CashAccountRegister({
  leaf,
  moduleLabel,
  parentLabel,
}) {
  const { factories, showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list')
  const [activeAccount, setActiveAccount] = useState(null)

  const [statusFilter, setStatusFilter] = useState('')
  const [kindFilter, setKindFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const [locations, setLocations] = useState([])
  const [banks, setBanks] = useState([])
  const [loadingBanks, setLoadingBanks] = useState(false)
  const [banksError, setBanksError] = useState('')

  // locations
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

  // banks — split out so it can't be cancelled by the locations effect
  useEffect(() => {
    let cancelled = false
    setLoadingBanks(true)
    accountApi
      .listBankAccounts({ status: 'ACTIVE' })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setBanks(list.map(toBankOption).filter(Boolean))
        setBanksError('')
      })
      .catch((e) => {
        if (cancelled) return
        setBanksError(e.message || 'Could not load bank accounts')
      })
      .finally(() => {
        if (!cancelled) setLoadingBanks(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // cash accounts
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const query = {}
      if (statusFilter) query.status = statusFilter
      if (kindFilter) query.kind = [kindFilter]
      if (locationFilter) query.locationId = locationFilter

      const res = await accountApi.listCashAccounts(query)
      setRows(res.data || [])
    } catch (e) {
      showToast('Could not load cash accounts', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, kindFilter, locationFilter, showToast])

  useEffect(() => {
    load()
  }, [load])

  const afterMutation = () => {
    setMode('list')
    setActiveAccount(null)
    load()
  }

  if (mode === 'create') {
    return (
      <CreateCashAccountForm
        crumbs={crumbs}
        locations={locations}
        banks={banks}
        loadingBanks={loadingBanks}
        banksError={banksError}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }
  if (mode === 'edit' && activeAccount) {
    return (
      <EditCashAccountForm
        account={activeAccount}
        crumbs={crumbs}
        banks={banks}
        loadingBanks={loadingBanks}
        banksError={banksError}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }
  if (mode === 'status' && activeAccount) {
    return (
      <ChangeStatusForm
        account={activeAccount}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Name', width: 220 },
    {
      key: 'kind',
      label: 'Kind',
      width: 130,
      render: (r) => (
        <Badge tone={KIND_TONE[r.kind] || 'neutral'}>
          {KIND_LABEL[r.kind] || r.kind || '—'}
        </Badge>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      width: 190,
      render: (r) => r.location?.name || '—',
    },
    {
      key: 'currencyCode',
      label: 'Currency',
      width: 100,
      mono: true,
      render: (r) => r.currencyCode || '—',
    },
    {
      key: 'openingBalance',
      label: 'Opening balance',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => money(r.openingBalance || 0),
    },
    {
      key: 'currentBalance',
      label: 'Current balance',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => (
        <span
          style={{
            color: r.belowFloat ? 'var(--danger)' : 'inherit',
            fontWeight: r.belowFloat ? 600 : undefined,
          }}
          title={
            r.belowFloat ? 'Below float — needs replenishment' : undefined
          }
        >
          {money(r.currentBalance || 0)}
          {r.belowFloat ? ' ⚠' : ''}
        </span>
      ),
    },
    {
      key: 'floatLimit',
      label: 'Float limit',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => money(r.floatLimit || 0),
    },
    {
      key: 'posSettlementBankAccount',
      label: 'Settlement account',
      width: 200,
      render: (r) =>
        r.kind === 'TILL' && r.posSettlementBankAccount
          ? r.posSettlementBankAccount.name || '—'
          : '—',
    },
    {
      key: 'status',
      label: 'Status',
      width: 110,
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
          {STATUS_LABEL[r.status] || r.status || '—'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 210,
      sortable: false,
      render: (r) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setActiveAccount(r)
              setMode('edit')
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setActiveAccount(r)
              setMode('status')
            }}
          >
            {r.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ]

  const activeCount = rows.filter((r) => r.status === 'ACTIVE').length
  const belowFloatCount = rows.filter((r) => r.belowFloat).length
  const totalBalance = rows.reduce(
    (n, r) => n + (r.currentBalance || 0),
    0
  )
  const totalFloat = rows.reduce((n, r) => n + (r.floatLimit || 0), 0)

  const locationOptions = [
    { value: '', label: 'All locations' },
    ...locations,
  ]
  const kindOptions = [{ value: '', label: 'All kinds' }, ...KINDS]

  return (
    <>
      {loading && <Loader overlay label="Loading cash accounts…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Cash Accounts'}
        icon={leaf?.icon}
        description="Petty cash accounts, tills and vaults held across factories and showrooms. Each account tracks its own float so you can see when replenishment is due."
        createLabel="Create cash account"
        onCreate={() => setMode('create')}
        searchPlaceholder="Search by name, code or location…"
        filters={
          <>
            <Select
              options={kindOptions}
              value={kindFilter}
              onChange={(v) => setKindFilter(val(v))}
              style={{ width: 160 }}
            />
            <Select
              options={locationOptions}
              value={locationFilter}
              onChange={(v) => setLocationFilter(val(v))}
              style={{ width: 220 }}
            />
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 150 }}
            />
          </>
        }
        stats={[
          { label: 'Accounts', value: String(rows.length) },
          { label: 'Active', value: String(activeCount) },
          {
            label: 'Below float',
            value: String(belowFloatCount),
            tone: belowFloatCount ? 'warning' : undefined,
            hint: belowFloatCount ? 'Needs replenishment' : undefined,
          },
          { label: 'Total balance', value: money(totalBalance) },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={() => {}}
        emptyTitle="No cash accounts registered"
        emptyDescription="Create a petty cash account to start tracking daily operational spending."
        footnote={`Float limit represents the target balance for each account. Accounts whose current balance falls below their float limit are flagged for replenishment. Combined float across this register: ${money(
          totalFloat
        )}.`}
      />
    </>
  )
}