// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Switch } from '../../ds/components/forms/Switch.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { expenseCategories } from '../sampleAccount.js'

// const ACCOUNT_HEADS = [
//   { value: 'utilities', label: 'Utilities' },
//   { value: 'logistics', label: 'Logistics' },
//   { value: 'maintenance', label: 'Maintenance' },
//   { value: 'administrative', label: 'Administrative' },
//   { value: 'finance', label: 'Finance' },
// ]

// const columns = [
//   { key: 'code', label: 'Code', width: 100, mono: true },
//   { key: 'name', label: 'Expense category', width: 230 },
//   { key: 'description', label: 'Description', width: 360 },
//   { key: 'account', label: 'Account head', width: 170 },
//   {
//     key: 'pettyCashAllowed', label: 'Petty cash', width: 130,
//     render: (r) => <Badge tone={r.pettyCashAllowed === 'Yes' ? 'success' : 'neutral'}>{r.pettyCashAllowed === 'Yes' ? 'Allowed' : 'Not allowed'}</Badge>,
//   },
//   {
//     key: 'status', label: 'Status', width: 110,
//     render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
//   },
// ]

// function CategoryForm({ crumbs, onBack }) {
//   const [active, setActive] = useState(true)
//   const [petty, setPetty] = useState(true)
//   return (
//     <FormShell
//       crumbs={crumbs}
//       title="Register expense category"
//       icon="list-checks"
//       description="Add a category of payment or expense recognised by the company. Registered categories become selectable in Payment/Running Cost and petty cash transactions."
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to guide</Button>}
//       submitLabel="Register category"
//       onCancel={onBack}
//       note="Codes and names must be unique. Once registered, the category is immediately selectable in every dependent module."
//       aside={
//         <Panel title="Where it will be used">
//           <MetaRow label="Payment/Running Cost" value="Immediate" />
//           <MetaRow label="Petty Cash Payment" value={petty ? 'Immediate' : 'Not available'} />
//           <MetaRow label="Expenses/Payment Reports" value="Immediate" />
//           <MetaRow label="Cash Inflow/Outflow" value="As an out-flow head" />
//         </Panel>
//       }
//     >
//       <Panel title="Category details">
//         <FieldSet columns={2}>
//           <Input label="Category code" placeholder="e.g. EX-12" hint="Must be unique across the guide." />
//           <Input label="Category name" placeholder="e.g. Security Services" />
//           <Select label="Account head" options={ACCOUNT_HEADS} placeholder="Select head…" />
//           <Input label="Monthly cap (₦)" type="number" placeholder="0.00" hint="Optional spending ceiling." />
//         </FieldSet>
//         <div style={{ marginTop: 14 }}>
//           <label style={{ display: 'block' }}>
//             <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
//             <textarea
//               rows={3}
//               placeholder="What this category covers, so entries are classified consistently."
//               style={{
//                 width: '100%', padding: '10px 12px', resize: 'vertical',
//                 background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//                 borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//                 font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//               }}
//             />
//           </label>
//         </div>
//       </Panel>

//       <Panel title="Rules">
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <Switch checked={petty} onChange={setPetty} />
//             <div>
//               <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Payable from petty cash</div>
//               <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Larger heads such as bank charges are usually settled by transfer instead.</div>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <Switch checked={active} onChange={setActive} />
//             <div>
//               <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
//               <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive categories stay in historic reports but cannot be selected on new entries.</div>
//             </div>
//           </div>
//         </div>
//       </Panel>
//     </FormShell>
//   )
// }

// export default function ExpenseGuide({ leaf, moduleLabel, parentLabel }) {
//   const [mode, setMode] = useState('list')
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (mode === 'create') return <CategoryForm crumbs={crumbs} onBack={() => setMode('list')} />

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Expenses/Payment List Guide'}
//       icon={leaf?.icon}
//       description="The reference list of payment and expense categories the company recognises, so every payment is classified and recorded consistently across the system."
//       createLabel="Register category"
//       onCreate={() => setMode('create')}
//       searchPlaceholder="Search categories by code, name or description…"
//       filters={<Select options={ACCOUNT_HEADS} placeholder="All account heads" style={{ width: 200 }} />}
//       stats={[
//         { label: 'Categories registered', value: String(expenseCategories.length) },
//         { label: 'Active', value: String(expenseCategories.filter((c) => c.status === 'Active').length) },
//         { label: 'Petty-cash payable', value: String(expenseCategories.filter((c) => c.pettyCashAllowed === 'Yes').length) },
//         { label: 'Account heads', value: String(new Set(expenseCategories.map((c) => c.account)).size) },
//       ]}
//       columns={columns}
//       rows={expenseCategories}
//       onRowClick={() => {}}
//       emptyTitle="No expense categories registered"
//       emptyDescription="Register a category to make it selectable on payments and petty cash entries."
//       footnote="A category cannot be created with missing required fields or a code that duplicates an existing entry. Inactive categories are rejected on new payment entries."
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
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'

const accountApi = new AccountApi()

const ACCOUNT_HEADS = [
  { value: 'FINANCE', label: 'Finance' },
  { value: 'ADMINISTRATIVE', label: 'Administrative' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'LOGISTICS', label: 'Logistics' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
]
const ACCOUNT_HEAD_LABEL = Object.fromEntries(
  ACCOUNT_HEADS.map((h) => [h.value, h.label])
)

const STATUS_LABEL = { ACTIVE: 'Active', INACTIVE: 'Inactive' }
const STATUS_TONE = { ACTIVE: 'success', INACTIVE: 'neutral' }

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
]

const PETTY_CASH_FILTER_OPTIONS = [
  { value: '', label: 'Any category' },
  { value: 'yes', label: 'Petty cash payable only' },
]
const OVER_CAP_FILTER_OPTIONS = [
  { value: '', label: 'Any spending level' },
  { value: 'yes', label: 'Over monthly cap only' },
]

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

function capValue(monthlyCap) {
  const n = monthlyCap != null ? Number(monthlyCap) : 0
  return n > 0 ? money(n) : '—'
}

// ── Category form (create + edit) ─────────────────────────
function CategoryForm({ mode, category, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const isEdit = mode === 'edit'

  const [code, setCode] = useState(category?.code || '')
  const [name, setName] = useState(category?.name || '')
  const [description, setDescription] = useState(category?.description || '')
  const [accountHead, setAccountHead] = useState(category?.accountHead || '')
  const [monthlyCap, setMonthlyCap] = useState(
    category?.monthlyCap != null && category.monthlyCap !== ''
      ? String(category.monthlyCap)
      : ''
  )
  const [pettyCashAllowed, setPettyCashAllowed] = useState(
    category?.pettyCashAllowed != null ? !!category.pettyCashAllowed : true
  )
  const [submitting, setSubmitting] = useState(false)

  const missingFields = []
  if (!code.trim()) missingFields.push('Code')
  if (!name.trim()) missingFields.push('Name')
  if (!accountHead) missingFields.push('Account head')

  const canSubmit = missingFields.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      if (isEdit) {
        // EditExpenseCategoriesRequest: monthlyCap is string|null
        await accountApi.editExpenseCategories(category.id, {
          code: code.trim(),
          name: name.trim(),
          description: description.trim() || null,
          accountHead,
          monthlyCap: monthlyCap.trim() || null,
          pettyCashAllowed,
        })
        showToast('Category updated', `${name.trim()} saved.`)
      } else {
        // CreateExpenseCategoriesRequest: monthlyCap is number
        await accountApi.createExpenseCategories({
          code: code.trim(),
          name: name.trim(),
          description: description.trim() || null,
          accountHead,
          monthlyCap: Number(monthlyCap) || 0,
          pettyCashAllowed,
        })
        showToast('Category registered', `${name.trim()} added to the guide.`)
      }
      onDone()
    } catch (e) {
      showToast(
        isEdit ? 'Could not update category' : 'Could not register category',
        e.message,
        true
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && (
        <Loader
          overlay
          label={isEdit ? 'Saving changes…' : 'Registering category…'}
        />
      )}
      <FormShell
        crumbs={crumbs}
        title={isEdit ? `Edit ${category.name}` : 'Register expense category'}
        icon="list-checks"
        description="Add a category of payment or expense recognised by the company. Registered categories become selectable in Payment/Running Cost and petty cash transactions."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to guide
          </Button>
        }
        submitLabel={isEdit ? 'Save changes' : 'Register category'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="Codes and names must be unique. Once registered, the category is immediately selectable in every dependent module."
        aside={
          <Panel title="Where it will be used">
            <MetaRow label="Payment/Running Cost" value="Immediate" />
            <MetaRow
              label="Petty Cash Payment"
              value={pettyCashAllowed ? 'Immediate' : 'Not available'}
            />
            <MetaRow label="Expenses/Payment Reports" value="Immediate" />
            <MetaRow label="Cash Inflow/Outflow" value="As an out-flow head" />
          </Panel>
        }
      >
        {!canSubmit && missingFields.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these fields to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missingFields.join(' · ')}
          </Callout>
        )}

        <Panel title="Category details">
          <FieldSet columns={2}>
            <Input
              label="Category code *"
              placeholder="e.g. EX-12"
              hint="Must be unique across the guide."
              value={code}
              onChange={(e) => setCode(val(e))}
            />
            <Input
              label="Category name *"
              placeholder="e.g. Security Services"
              value={name}
              onChange={(e) => setName(val(e))}
            />
            <Select
              label="Account head *"
              options={ACCOUNT_HEADS}
              placeholder="Select head…"
              value={accountHead}
              onChange={(v) => setAccountHead(val(v))}
            />
            <Input
              label="Monthly cap (₦)"
              type="number"
              placeholder="0.00"
              hint="Leave blank for no cap. Spending above this flags the category as over cap."
              value={monthlyCap}
              onChange={(e) => setMonthlyCap(val(e))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Description
              </div>
              <textarea
                rows={3}
                placeholder="What this category covers, so entries are classified consistently."
                value={description}
                onChange={(e) => setDescription(val(e))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  resize: 'vertical',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-control)',
                  boxShadow: 'var(--shadow-xs)',
                  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
                  color: 'var(--text-strong)',
                  outline: 'none',
                }}
              />
            </label>
          </div>
        </Panel>

        <Panel title="Rules">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch
              checked={pettyCashAllowed}
              onChange={(v) =>
                setPettyCashAllowed(
                  typeof v === 'boolean' ? v : !!val(v)
                )
              }
            />
            <div>
              <div
                style={{
                  font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)',
                  color: 'var(--text-strong)',
                }}
              >
                Payable from petty cash
              </div>
              <div
                style={{
                  font: 'var(--type-caption)',
                  color: 'var(--text-muted)',
                  marginTop: 2,
                }}
              >
                Larger heads such as bank charges are usually settled by
                transfer instead.
              </div>
            </div>
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Status change ─────────────────────────────────────────
function StatusChangeForm({ category, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [submitting, setSubmitting] = useState(false)
  const nextStatus = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

  async function submit() {
    setSubmitting(true)
    try {
      await accountApi.updateStatusExpenseCategories(category.id, {
        status: nextStatus,
      })
      showToast(
        'Status updated',
        `${category.name} is now ${STATUS_LABEL[nextStatus].toLowerCase()}.`
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
            ? 'Deactivate category'
            : 'Activate category'
        }
        icon={nextStatus === 'INACTIVE' ? 'ban' : 'check'}
        description={
          nextStatus === 'INACTIVE'
            ? 'A deactivated category stays in historic reports but cannot be selected on new payment entries.'
            : 'Reactivate this category so it can be used again on payment and petty cash entries.'
        }
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to guide
          </Button>
        }
        submitLabel={nextStatus === 'INACTIVE' ? 'Deactivate' : 'Activate'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={submitting}
        aside={
          <Panel title="Category">
            <MetaRow label="Code" value={category.code} mono />
            <MetaRow label="Name" value={category.name} />
            <MetaRow
              label="Account head"
              value={
                ACCOUNT_HEAD_LABEL[category.accountHead] ||
                category.accountHead
              }
            />
            <MetaRow
              label="Current status"
              value={STATUS_LABEL[category.status] || category.status}
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
                You're about to deactivate <strong>{category.name}</strong>.
                Existing entries classified under it remain, but the category
                won't appear on new payment forms.
              </>
            ) : (
              <>
                Reactivating <strong>{category.name}</strong> makes it
                selectable again in Payment/Running Cost and petty cash
                entries.
              </>
            )}
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main list ─────────────────────────────────────────────
export default function ExpenseGuide({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list')
  const [active, setActive] = useState(null)

  const [accountHeadFilter, setAccountHeadFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pettyCashFilter, setPettyCashFilter] = useState('')
  const [overCapFilter, setOverCapFilter] = useState('')

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // Only include fields the user actually set. Sending `false` for a
      // boolean filter, or an empty array for an array filter, causes the
      // backend to filter to "nothing matches" rather than "no filter".
      // Same story with `q: ''` and `sort: ''` — omit them and the backend
      // falls back to its defaults, which is what the Swagger curl exercises.
      const query = {}
      if (accountHeadFilter) query.accountHead = [accountHeadFilter]
      if (statusFilter) query.status = statusFilter
      if (pettyCashFilter === 'yes') query.pettyCashAllowed = true
      if (overCapFilter === 'yes') query.overCap = true

      const data = await accountApi.listExpenseCategories(query)
      setRows(data || [])
    } catch (e) {
      showToast('Could not load expense categories', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [
    accountHeadFilter,
    statusFilter,
    pettyCashFilter,
    overCapFilter,
    showToast,
  ])

  useEffect(() => {
    load()
  }, [load])

  const afterMutation = () => {
    setMode('list')
    setActive(null)
    load()
  }

  if (mode === 'create') {
    return (
      <CategoryForm
        mode="create"
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }
  if (mode === 'edit' && active) {
    return (
      <CategoryForm
        mode="edit"
        category={active}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }
  if (mode === 'status' && active) {
    return (
      <StatusChangeForm
        category={active}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  const columns = [
    { key: 'code', label: 'Code', width: 100, mono: true },
    { key: 'name', label: 'Expense category', width: 220 },
    {
      key: 'description',
      label: 'Description',
      width: 300,
      render: (r) => r.description || '—',
    },
    {
      key: 'accountHead',
      label: 'Account head',
      width: 160,
      render: (r) =>
        ACCOUNT_HEAD_LABEL[r.accountHead] || r.accountHead || '—',
    },
    {
      key: 'pettyCashAllowed',
      label: 'Petty cash',
      width: 130,
      render: (r) => (
        <Badge tone={r.pettyCashAllowed ? 'success' : 'neutral'}>
          {r.pettyCashAllowed ? 'Allowed' : 'Not allowed'}
        </Badge>
      ),
    },
    {
      key: 'monthlyCap',
      label: 'Monthly cap',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => capValue(r.monthlyCap),
    },
    {
      key: 'spentThisMonth',
      label: 'Spent this month',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => (
        <span
          style={{
            color: r.overCap ? 'var(--danger)' : 'inherit',
            fontWeight: r.overCap ? 600 : undefined,
          }}
          title={r.overCap ? 'Over monthly cap' : undefined}
        >
          {money(r.spentThisMonth || 0)}
          {r.overCap ? ' ⚠' : ''}
        </span>
      ),
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
              setActive(r)
              setMode('edit')
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setActive(r)
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
  const pettyCount = rows.filter((r) => r.pettyCashAllowed).length
  const overCapCount = rows.filter((r) => r.overCap).length
  const totalCap = rows.reduce(
    (n, r) => n + (Number(r.monthlyCap) || 0),
    0
  )

  const headFilterOptions = [
    { value: '', label: 'All account heads' },
    ...ACCOUNT_HEADS,
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading categories…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Expenses/Payment List Guide'}
        icon={leaf?.icon}
        description="The reference list of payment and expense categories the company recognises, so every payment is classified and recorded consistently across the system."
        createLabel="Register category"
        onCreate={() => setMode('create')}
        searchPlaceholder="Search categories by code, name or description…"
        filters={
          <>
            <Select
              options={headFilterOptions}
              value={accountHeadFilter}
              onChange={(v) => setAccountHeadFilter(val(v))}
              style={{ width: 200 }}
            />
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 150 }}
            />
            <Select
              options={PETTY_CASH_FILTER_OPTIONS}
              value={pettyCashFilter}
              onChange={(v) => setPettyCashFilter(val(v))}
              style={{ width: 220 }}
            />
            <Select
              options={OVER_CAP_FILTER_OPTIONS}
              value={overCapFilter}
              onChange={(v) => setOverCapFilter(val(v))}
              style={{ width: 220 }}
            />
          </>
        }
        stats={[
          { label: 'Categories registered', value: String(rows.length) },
          { label: 'Active', value: String(activeCount) },
          { label: 'Petty-cash payable', value: String(pettyCount) },
          {
            label: 'Over cap',
            value: String(overCapCount),
            tone: overCapCount ? 'warning' : undefined,
            hint: overCapCount
              ? `${moneyShort(totalCap)} combined cap`
              : undefined,
          },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={() => {}}
        emptyTitle="No expense categories found"
        emptyDescription="Adjust the filters or register a new category to get started."
        footnote="A category cannot be created with missing required fields or a code that duplicates an existing entry. Inactive categories are rejected on new payment entries."
      />
    </>
  )
}