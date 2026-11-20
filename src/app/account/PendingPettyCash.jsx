// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { Callout } from '../shells/Page.jsx'
// import { showrooms } from '../sampleShowroom.js'
// import { pendingPettyCash } from '../sampleAccount.js'
// import { money, moneyShort } from '../utils.js'

// const TABS = [
//   { value: 'Pending', label: 'Awaiting response', icon: 'hourglass' },
//   { value: 'Accepted', label: 'Accepted', icon: 'circle-check-big' },
//   { value: 'Rejected', label: 'Rejected', icon: 'circle-x' },
// ]

// const TONE = { Pending: 'warning', Accepted: 'success', Rejected: 'danger' }

// export default function PendingPettyCash({ leaf, moduleLabel, parentLabel }) {
//   const [tab, setTab] = useState('Pending')
//   const rows = pendingPettyCash.filter((p) => p.status === tab)

//   const pending = pendingPettyCash.filter((p) => p.status === 'Pending')
//   const pendingValue = pending.reduce((n, p) => n + p.amount, 0)
//   const accepted = pendingPettyCash.filter((p) => p.status === 'Accepted')
//   const rejected = pendingPettyCash.filter((p) => p.status === 'Rejected')

//   const columns = [
//     { key: 'ref', label: 'Reference', width: 120, mono: true },
//     { key: 'date', label: 'Sent on', width: 130 },
//     { key: 'branch', label: 'Branch', width: 190 },
//     { key: 'purpose', label: 'Purpose', width: 320 },
//     { key: 'sentBy', label: 'Sent by', width: 180 },
//     { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (p) => money(p.amount) },
//     ...(tab === 'Pending'
//       ? [{
//           key: 'action', label: 'Action', width: 175, sortable: false,
//           render: () => (
//             <div style={{ display: 'flex', gap: 6 }}>
//               <Button size="sm" iconLeft="check">Accept</Button>
//               <Button size="sm" variant="secondary">Reject</Button>
//             </div>
//           ),
//         }]
//       : [
//           {
//             key: 'status', label: 'Outcome', width: 120,
//             render: (p) => <Badge tone={TONE[p.status]}>{p.status}</Badge>,
//           },
//           { key: 'respondedBy', label: 'Responded by', width: 160 },
//           { key: 'respondedOn', label: 'Responded on', width: 140 },
//           { key: 'note', label: 'Note', width: 300, render: (p) => p.note || '—' },
//         ]),
//   ]

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Accept or Reject Pending Petty Cash'}
//       icon={leaf?.icon}
//       description="Petty cash allocations sent to a branch. The branch account officer verifies receipt and either accepts the allocation — crediting it to the branch account — or rejects it for correction."
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       searchPlaceholder="Search by reference, branch or purpose…"
//       filters={<Select options={showrooms} placeholder="All branches" style={{ width: 190 }} />}
//       stats={[
//         { label: 'Awaiting response', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
//         { label: 'Value pending', value: moneyShort(pendingValue) },
//         { label: 'Accepted this period', value: moneyShort(accepted.reduce((n, p) => n + p.amount, 0)) },
//         { label: 'Rejected', value: String(rejected.length), tone: rejected.length ? 'negative' : undefined, hint: rejected.length ? 'Needs correction' : undefined },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ ref: 'Total', amount: money(rows.reduce((n, p) => n + p.amount, 0)) }}
//       emptyTitle={tab === 'Pending' ? 'Nothing awaiting response' : `No ${tab.toLowerCase()} allocations`}
//       emptyDescription={tab === 'Pending' ? 'Every petty cash allocation sent to your branch has been reviewed.' : undefined}
//       footnote="An allocation is credited to the branch petty cash account only once accepted. Rejected allocations are flagged for correction and stay on record for review."
//     >
//       {tab === 'Pending' && pending.length > 0 && (
//         <Callout tone="warning" icon="hourglass" title={`${money(pendingValue)} awaiting acceptance`}>
//           Verify each amount reached the branch account before accepting. Reject anything unverified so it can be
//           corrected rather than sitting unacknowledged.
//         </Callout>
//       )}
//     </RegisterShell>
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
import { money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import FactoryApi from '../../api/FactoryApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()
const factoryApi = new FactoryApi()
const PAGE_SIZE = 50

const TABS = [
  { value: 'PENDING', label: 'Awaiting response', icon: 'hourglass' },
  { value: 'ACCEPTED', label: 'Accepted', icon: 'circle-check-big' },
  { value: 'REJECTED', label: 'Rejected', icon: 'circle-x' },
]

const STATUS_LABEL = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}
const STATUS_TONE = {
  PENDING: 'warning',
  ACCEPTED: 'success',
  REJECTED: 'danger',
}

const SOURCE_KINDS = [
  { value: 'BANK', label: 'Bank account' },
  { value: 'CASH', label: 'Cash account' },
]

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

function bankOption(b) {
  if (!b?.id) return null
  const label =
    [b.bankName, b.accountNumber].filter(Boolean).join(' · ') ||
    b.accountName ||
    b.code ||
    b.id
  return { value: b.id, label }
}

function cashOption(a) {
  if (!a?.id) return null
  return {
    value: a.id,
    label: `${a.code} · ${a.name}${
      a.location?.name ? ` (${a.location.name})` : ''
    }`,
  }
}

// ── Create form ───────────────────────────────────────────
function CreateAllocationForm({
  crumbs,
  bankAccounts,
  cashAccounts,
  pettyCashAccounts,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()

  const [sourceKind, setSourceKind] = useState('BANK')
  const [sourceBankAccountId, setSourceBankAccountId] = useState('')
  const [sourceCashAccountId, setSourceCashAccountId] = useState('')
  const [destinationPettyCashAccountId, setDestinationPettyCashAccountId] =
    useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isBank = sourceKind === 'BANK'
  const sourceOptions = isBank ? bankAccounts : cashAccounts
  const requested = Number(amount) || 0

  useEffect(() => {
    if (isBank) setSourceCashAccountId('')
    else setSourceBankAccountId('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKind])

  const missingFields = []
  if (!sourceKind) missingFields.push('Source kind')
  if (isBank && !sourceBankAccountId)
    missingFields.push('Source bank account')
  if (!isBank && !sourceCashAccountId)
    missingFields.push('Source cash account')
  if (!destinationPettyCashAccountId)
    missingFields.push('Destination petty cash account')
  if (requested <= 0) missingFields.push('Amount')
  if (!purpose.trim()) missingFields.push('Purpose')

  const canSubmit = missingFields.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.createPettyCashAllocation({
        sourceKind,
        sourceBankAccountId: isBank ? sourceBankAccountId : '',
        sourceCashAccountId: isBank ? '' : sourceCashAccountId,
        destinationPettyCashAccountId,
        amount: requested,
        purpose: purpose.trim(),
      })
      showToast(
        'Allocation created',
        `${money(requested)} dispatched — awaiting branch acceptance.`
      )
      onDone()
    } catch (e) {
      showToast('Could not create allocation', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Creating allocation…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title="Create petty cash allocation"
        icon="send"
        description="Move funds from a central bank or cash account into a branch's petty cash account. The branch account officer must accept before the balance is credited."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to allocations
          </Button>
        }
        submitLabel="Create allocation"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="A new allocation appears on the branch's awaiting-response tab immediately and only moves the balance once accepted."
        aside={
          <Panel title="Dispatch summary">
            <MetaRow
              label="Source kind"
              value={
                SOURCE_KINDS.find((s) => s.value === sourceKind)?.label ||
                '—'
              }
            />
            <MetaRow
              label="Amount"
              value={requested ? money(requested) : '—'}
              mono
            />
            <MetaRow
              label="Destination"
              value={
                pettyCashAccounts.find(
                  (a) => a.value === destinationPettyCashAccountId
                )?.label || '—'
              }
            />
          </Panel>
        }
      >
        {missingFields.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these fields to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missingFields.join(' · ')}
          </Callout>
        )}

        <Panel title="Funding">
          <FieldSet columns={2}>
            <Select
              label="Source kind *"
              options={SOURCE_KINDS}
              value={sourceKind}
              onChange={(v) => setSourceKind(val(v))}
            />
            {isBank ? (
              <Select
                label="Source bank account *"
                options={bankAccounts}
                placeholder={
                  bankAccounts.length
                    ? 'Select bank account…'
                    : 'No bank accounts registered'
                }
                value={sourceBankAccountId}
                onChange={(v) => setSourceBankAccountId(val(v))}
                disabled={!bankAccounts.length}
              />
            ) : (
              <Select
                label="Source cash account *"
                options={cashAccounts}
                placeholder={
                  cashAccounts.length
                    ? 'Select cash account…'
                    : 'No cash accounts registered'
                }
                value={sourceCashAccountId}
                onChange={(v) => setSourceCashAccountId(val(v))}
                disabled={!cashAccounts.length}
              />
            )}
            <Select
              label="Destination petty cash account *"
              options={pettyCashAccounts}
              placeholder={
                pettyCashAccounts.length
                  ? 'Select petty cash account…'
                  : 'No petty cash accounts registered'
              }
              value={destinationPettyCashAccountId}
              onChange={(v) => setDestinationPettyCashAccountId(val(v))}
              disabled={!pettyCashAccounts.length}
            />
            <Input
              label="Amount (₦) *"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(val(e))}
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
                Purpose *
              </div>
              <textarea
                rows={2}
                placeholder="Why this allocation is being sent to the branch."
                value={purpose}
                onChange={(e) => setPurpose(val(e))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  resize: 'vertical',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-control)',
                  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
                  color: 'var(--text-strong)',
                  outline: 'none',
                }}
              />
            </label>
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Reject form ───────────────────────────────────────────
function RejectAllocationForm({ allocation, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = note.trim() && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.rejectPettyCashAllocation(allocation.id, {
        note: note.trim(),
      })
      showToast(
        'Allocation rejected',
        `${allocation.ref} has been flagged for correction.`
      )
      onDone()
    } catch (e) {
      showToast('Could not reject allocation', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Rejecting…" />}
      <FormShell
        crumbs={crumbs}
        title={`Reject ${allocation.ref}`}
        icon="x"
        description="Reject this allocation so the sending officer can correct and resend. The reason is recorded against the allocation."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Reject allocation"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Allocation">
            <MetaRow label="Ref" value={allocation.ref} mono />
            <MetaRow
              label="Branch"
              value={allocation.destinationLocation?.name || '—'}
            />
            <MetaRow
              label="Amount"
              value={money(allocation.amount || 0)}
              mono
            />
            <MetaRow
              label="Sent by"
              value={allocation.sentBy?.name || '—'}
            />
            <MetaRow
              label="Purpose"
              value={allocation.purpose || '—'}
            />
          </Panel>
        }
      >
        <Panel
          title="Reason"
          description="Required — this is shown to the sending officer."
        >
          <textarea
            rows={3}
            placeholder="Why are you rejecting this allocation?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              resize: 'vertical',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)',
              font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
              color: 'var(--text-strong)',
              outline: 'none',
            }}
          />
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main page ─────────────────────────────────────────────
export default function PendingPettyCash({ leaf, moduleLabel, parentLabel }) {
  const store = useStore()
  const showToast = store.showToast
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list') // 'list' | 'create' | 'reject'
  const [rejecting, setRejecting] = useState(null)

  const [tab, setTab] = useState('PENDING')
  const [branchFilter, setBranchFilter] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(0)

  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // lookups
  const [locations, setLocations] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [cashAccounts, setCashAccounts] = useState([])
  const [pettyCashAccounts, setPettyCashAccounts] = useState([])

  // per-row accept loading
  const [acceptingId, setAcceptingId] = useState(null)

  // ── lookups ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    Promise.all([
      factoryApi.listFactories().catch(() => ({ data: [] })),
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch(() => ({ data: [] })),
      accountApi
        .listBankAccounts({ status: 'ACTIVE' })
        .catch(() => ({ data: [] })),
      accountApi
        .listCashAccounts({ kind: ['TILL', 'VAULT'] })
        .catch(() => ({ data: [] })),
      accountApi
        .listCashAccounts({ kind: ['PETTY_CASH'] })
        .catch(() => ({ data: [] })),
    ]).then(([fRes, sRes, bRes, cRes, pcRes]) => {
      if (cancelled) return
      const factories = (fRes.data || []).map((f) => ({
        value: f.id,
        label: `${f.name} (factory)`,
      }))
      const showrooms = (sRes.data || []).map((s) => ({
        value: s.id,
        label: `${s.label || s.name || s.code} (showroom)`,
      }))
      setLocations([...factories, ...showrooms])

      const banks = (Array.isArray(bRes.data) ? bRes.data : [])
        .map(bankOption)
        .filter(Boolean)
      setBankAccounts(banks)

      const cashes = (Array.isArray(cRes.data) ? cRes.data : [])
        .map(cashOption)
        .filter(Boolean)
      setCashAccounts(cashes)

      const pcs = (Array.isArray(pcRes.data) ? pcRes.data : [])
        .map(cashOption)
        .filter(Boolean)
      setPettyCashAccounts(pcs)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // ── reset page when tab / filters change ────────────────
  useEffect(() => {
    setPage(0)
  }, [tab, branchFilter, from, to])

  // ── load list ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE, status: [tab] }
      if (branchFilter) q.locationId = branchFilter
      if (from) q.from = from
      if (to) q.to = to

      const res = await accountApi.listPettyCashAllocation(q)
      setRows(res.data?.items || [])
      setTotalPages(res.data?.totalPages || 0)
      setTotalItems(res.data?.totalItems || 0)
    } catch (e) {
      showToast('Could not load allocations', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [page, tab, branchFilter, from, to, showToast])

  useEffect(() => {
    load()
  }, [load])

  // ── accept ──────────────────────────────────────────────
  async function handleAccept(allocation) {
    setAcceptingId(allocation.id)
    try {
      await accountApi.acceptPettyCashAllocation(allocation.id)
      showToast(
        'Allocation accepted',
        `${allocation.ref} credited to ${
          allocation.destinationLocation?.name || 'the branch'
        }.`
      )
      await load()
    } catch (e) {
      showToast('Could not accept allocation', e.message, true)
    } finally {
      setAcceptingId(null)
    }
  }

  // ── post-mutation return ────────────────────────────────
  const afterMutation = () => {
    setMode('list')
    setRejecting(null)
    load()
  }

  // ── mode guards ─────────────────────────────────────────
  if (mode === 'create') {
    return (
      <CreateAllocationForm
        crumbs={crumbs}
        bankAccounts={bankAccounts}
        cashAccounts={cashAccounts}
        pettyCashAccounts={pettyCashAccounts}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  if (mode === 'reject' && rejecting) {
    return (
      <RejectAllocationForm
        allocation={rejecting}
        crumbs={crumbs}
        onBack={() => {
          setMode('list')
          setRejecting(null)
        }}
        onDone={afterMutation}
      />
    )
  }

  // ── derived ─────────────────────────────────────────────
  const tabLabel = TABS.find((t) => t.value === tab)?.label || tab
  const pageValue = rows.reduce((n, r) => n + (r.amount || 0), 0)
  const branchCount = new Set(
    rows.map((r) => r.destinationLocation?.id).filter(Boolean)
  ).size

  // ── columns ─────────────────────────────────────────────
  const columns = [
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    {
      key: 'date',
      label: 'Sent on',
      width: 130,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'destinationLocation',
      label: 'Branch',
      width: 180,
      render: (r) => r.destinationLocation?.name || '—',
    },
    {
      key: 'destinationAccountCode',
      label: 'Dest. account',
      width: 140,
      mono: true,
      render: (r) => r.destinationAccountCode || '—',
    },
    {
      key: 'purpose',
      label: 'Purpose',
      width: 260,
      render: (r) => r.purpose || '—',
    },
    {
      key: 'sourceName',
      label: 'Source',
      width: 180,
      render: (r) => r.sourceName || '—',
    },
    {
      key: 'sentBy',
      label: 'Sent by',
      width: 160,
      render: (r) => r.sentBy?.name || '—',
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => money(r.amount || 0),
    },
    ...(tab === 'PENDING'
      ? [
          {
            key: 'action',
            label: 'Action',
            width: 200,
            sortable: false,
            render: (r) => (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button
                  size="sm"
                  iconLeft="check"
                  onClick={() => handleAccept(r)}
                  disabled={acceptingId === r.id}
                >
                  {acceptingId === r.id ? '…' : 'Accept'}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setRejecting(r)
                    setMode('reject')
                  }}
                  disabled={acceptingId === r.id}
                >
                  Reject
                </Button>
              </div>
            ),
          },
        ]
      : [
          {
            key: 'status',
            label: 'Outcome',
            width: 120,
            render: (r) => (
              <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
                {STATUS_LABEL[r.status] || r.status || '—'}
              </Badge>
            ),
          },
          {
            key: 'respondedBy',
            label: 'Responded by',
            width: 160,
            render: (r) => r.respondedBy?.name || '—',
          },
          {
            key: 'respondedOn',
            label: 'Responded on',
            width: 140,
            render: (r) => (r.respondedOn ? fmtDate(r.respondedOn) : '—'),
          },
          {
            key: 'note',
            label: 'Note',
            width: 260,
            render: (r) => r.note || '—',
          },
        ]),
  ]

  const branchOptions = [
    { value: '', label: 'All branches' },
    ...locations,
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading allocations…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Accept or Reject Pending Petty Cash'}
        icon={leaf?.icon}
        description="Petty cash allocations sent to a branch. The branch account officer verifies receipt and either accepts the allocation — crediting it to the branch account — or rejects it for correction."
        createLabel="Create allocation"
        onCreate={() => setMode('create')}
        tabs={TABS}
        tab={tab}
        onTabChange={setTab}
        searchPlaceholder="Search by reference, branch or purpose…"
        filters={
          <>
            <Select
              options={branchOptions}
              value={branchFilter}
              onChange={(v) => setBranchFilter(val(v))}
              style={{ width: 200 }}
            />
            <Input
              label="Sent from"
              type="date"
              value={from}
              onChange={(e) => setFrom(val(e))}
              style={{ width: 160 }}
            />
            <Input
              label="Sent to"
              type="date"
              value={to}
              onChange={(e) => setTo(val(e))}
              style={{ width: 160 }}
            />
          </>
        }
        stats={[
          { label: tabLabel, value: String(totalItems) },
          {
            label: 'Value this page',
            value: moneyShort(pageValue),
            hint: `${rows.length} items`,
          },
          {
            label: 'Branches',
            value: String(branchCount),
            hint: 'This page',
          },
          {
            label: 'Latest',
            value: rows[0]?.date ? fmtDate(rows[0].date) : '—',
          },
        ]}
        columns={columns}
        rows={rows}
        totals={{ ref: 'Total', amount: money(pageValue) }}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        emptyTitle={
          tab === 'PENDING'
            ? 'Nothing awaiting response'
            : `No ${tabLabel.toLowerCase()} allocations`
        }
        emptyDescription={
          tab === 'PENDING'
            ? 'Every petty cash allocation sent to your branch has been reviewed.'
            : undefined
        }
        footnote="An allocation is credited to the branch petty cash account only once accepted. Rejected allocations are flagged for correction and stay on record for review."
      >
        {tab === 'PENDING' && rows.length > 0 && (
          <Callout
            tone="warning"
            icon="hourglass"
            title={`${money(pageValue)} awaiting acceptance`}
          >
            Verify each amount reached the branch account before accepting.
            Reject anything unverified so it can be corrected rather than
            sitting unacknowledged.
          </Callout>
        )}
      </RegisterShell>
    </>
  )
}