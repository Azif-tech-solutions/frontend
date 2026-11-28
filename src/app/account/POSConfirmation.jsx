
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import TenantApi from '../../api/TenantApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()
const tenantApi = new TenantApi()

const PAGE_SIZE = 20

// The confirmation queue: payments that wait for the bank to be checked
const QUEUE_CHANNELS = 'POS,FUND_TRANSFER,CHEQUE'

const TABS = [
  { value: 'PENDING', label: 'Awaiting verification', icon: 'hourglass' },
  { value: 'APPROVED', label: 'Approved', icon: 'circle-check-big' },
  { value: 'DECLINED', label: 'Declined', icon: 'circle-x' },
]

const TONE = { PENDING: 'warning', APPROVED: 'success', DECLINED: 'danger', NOT_REQUIRED: 'neutral' }

const CHANNEL_OPTIONS = [
  { value: QUEUE_CHANNELS, label: 'All channels' },
  { value: 'POS', label: 'POS (card)' },
  { value: 'FUND_TRANSFER', label: 'Fund transfer' },
  { value: 'CHEQUE', label: 'Cheque' },
]

const pretty = (s) =>
  String(s || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const fmtDateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
}

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const bankLabel = (b) =>
  b ? [b.bankName, b.accountName || b.name].filter(Boolean).join(' · ') || b.code || '—' : '—'

const textareaStyle = {
  width: '100%',
  padding: '10px 12px',
  resize: 'vertical',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
  color: 'var(--text-strong)',
  outline: 'none',
}

// Small dialog that collects a required note
function ReasonModal({ title, description, label, confirmLabel, busy, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          padding: 22,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            font: 'var(--fw-bold) var(--text-lg)/1.3 var(--font-ui)',
            color: 'var(--text-strong)',
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{ marginTop: 4, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {description}
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              font: 'var(--type-label)',
              color: 'var(--text-strong)',
              marginBottom: 6,
            }}
          >
            {label}
          </div>
          <textarea
            rows={3}
            autoFocus
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={textareaStyle}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(reason.trim())} disabled={!reason.trim() || busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Download the receipt PDF (the endpoint needs the auth header, so it can't be a plain link)
async function downloadReceiptPdf(receipt, showToast) {
  try {
    const blob = await accountApi.fetchReceiptPdf(receipt.id)
    const pdf = new Blob([blob], { type: 'application/pdf' })
    const url = URL.createObjectURL(pdf)
    const a = document.createElement('a')
    a.href = url
    a.download = `${receipt.ref || 'receipt'}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 30000)
  } catch (e) {
    showToast('Could not download receipt', e.message, true)
  }
}

/* ------------------------------------------------------------------ */
/*  Receipt detail                                                     */
/* ------------------------------------------------------------------ */
function ReceiptDetail({ receiptId, crumbs, onBack, onApprove, onDecline, acting }) {
  const { showToast } = useStore()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    accountApi
      .getAccountReceipt(receiptId)
      .then((res) => !cancelled && setReceipt(res?.data || null))
      .catch((e) => !cancelled && showToast('Could not load receipt', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [receiptId, showToast])

  if (!receipt) {
    return (
      <>
        {loading && <Loader overlay label="Loading receipt…" />}
        <FormShell
          wide
          crumbs={crumbs}
          title="Receipt"
          icon="receipt"
          submitLabel={null}
          onCancel={onBack}
          headerActions={
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to queue
            </Button>
          }
        >
          <Panel title="Details">
            <div style={{ color: 'var(--text-muted)', padding: 12 }}>
              {loading ? 'Loading…' : 'This receipt could not be loaded.'}
            </div>
          </Panel>
        </FormShell>
      </>
    )
  }

  const pending = receipt.confirmationStatus === 'PENDING'

  return (
    <FormShell
      wide
      crumbs={crumbs}
      title={`Receipt ${receipt.ref}`}
      icon="receipt"
      description={`${pretty(receipt.sourceType) || 'Receipt'} · ${receipt.location?.name || '—'}`}
      submitLabel={null}
      onCancel={onBack}
      headerActions={
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {pending && (
            <Button iconLeft="check" onClick={() => onApprove(receipt)} disabled={acting}>
              Approve
            </Button>
          )}
          {pending && (
            <Button variant="secondary" onClick={() => onDecline(receipt)} disabled={acting}>
              Decline
            </Button>
          )}
          <Button
            variant="secondary"
            iconLeft="download"
            onClick={() => downloadReceiptPdf(receipt, showToast)}
          >
            Receipt PDF
          </Button>
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to queue
          </Button>
        </div>
      }
      aside={
        <Panel title="Summary">
          <MetaRow label="Amount" value={money(receipt.amount || 0)} mono />
          <MetaRow
            label="Confirmation"
            value={
              <Badge tone={TONE[receipt.confirmationStatus] || 'neutral'}>
                {pretty(receipt.confirmationStatus) || '—'}
              </Badge>
            }
          />
          <MetaRow label="Status" value={pretty(receipt.status) || '—'} />
          <MetaRow label="Channel" value={pretty(receipt.channel) || '—'} />
          <MetaRow label="Received" value={fmtDateTime(receipt.receivedAt)} />
        </Panel>
      }
    >
      {pending && (
        <Callout
          tone="warning"
          icon="hourglass"
          title="Awaiting verification"
          style={{ marginBottom: 14 }}
        >
          Check this payment against the receiving bank account before approving. Declining posts
          nothing and a note is required.
        </Callout>
      )}

      <Panel title="Payment">
        <FieldSet columns={2}>
          <MetaRow label="Reference" value={receipt.ref || '—'} mono />
          <MetaRow label="Kind" value={pretty(receipt.kind) || '—'} />
          <MetaRow label="Channel" value={pretty(receipt.channel) || '—'} />
          <MetaRow label="Amount" value={money(receipt.amount || 0)} mono />
          <MetaRow label="Receiving bank" value={bankLabel(receipt.receivingBankAccount)} />
          <MetaRow label="Terminal" value={receipt.terminalRef || '—'} mono />
          <MetaRow label="Payer reference" value={receipt.payerReference || '—'} mono />
          <MetaRow label="Till" value={receipt.cashAccount?.name || '—'} />
        </FieldSet>
      </Panel>

      <Panel title="Customer & source">
        <FieldSet columns={2}>
          <MetaRow
            label="Customer"
            value={receipt.customerName || receipt.customer?.name || '—'}
          />
          <MetaRow label="Code" value={receipt.customer?.code || '—'} mono />
          <MetaRow label="Cashier" value={receipt.cashier?.name || '—'} />
          <MetaRow label="Showroom" value={receipt.location?.name || '—'} />
          <MetaRow label="Source" value={pretty(receipt.sourceType) || '—'} />
          <MetaRow label="Source reference" value={receipt.sourceRef || '—'} mono />
          <MetaRow label="Description" value={receipt.description || '—'} />
        </FieldSet>
      </Panel>

      {(receipt.reviewedBy || receipt.declineNote) && (
        <Panel title="Review">
          <FieldSet columns={2}>
            <MetaRow label="Reviewed by" value={receipt.reviewedBy?.name || '—'} />
            <MetaRow label="Reviewed at" value={fmtDateTime(receipt.reviewedAt)} />
            <MetaRow label="Decline note" value={receipt.declineNote || '—'} />
          </FieldSet>
        </Panel>
      )}

      {receipt.voidReason && (
        <Callout tone="danger" icon="ban" title="Receipt voided">
          {receipt.voidReason}
        </Callout>
      )}
    </FormShell>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function POSConfirmation({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [tab, setTab] = useState('PENDING')
  const [refreshKey, setRefreshKey] = useState(0)

  // lookups
  const [showrooms, setShowrooms] = useState([])
  const [tills, setTills] = useState([])
  const [banks, setBanks] = useState([])
  const [cashiers, setCashiers] = useState([])
  const [loadingLookups, setLoadingLookups] = useState(true)

  // filters
  const [locationId, setLocationId] = useState('')
  const [tillFilter, setTillFilter] = useState('')
  const [bankFilter, setBankFilter] = useState('')
  const [cashierFilter, setCashierFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState(QUEUE_CHANNELS)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  // data
  const [rows, setRows] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  // actions
  const [activeId, setActiveId] = useState(null) // receipt detail
  const [declineTarget, setDeclineTarget] = useState(null)
  const [acting, setActing] = useState(false)

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(0)
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // ── lookups: showrooms, banks, cashiers (once) ───────────
  useEffect(() => {
    let cancelled = false
    Promise.all([
      showroomApi.listShowrooms({ status: ['ACTIVE'] }).catch(() => ({ data: { items: [] } })),
      accountApi.listBankAccounts({ status: 'ACTIVE' }).catch(() => ({ data: [] })),
      tenantApi.getTenantMemberList({ page: 0, size: 200 }).catch(() => ({ data: { items: [] } })),
    ])
      .then(([showroomRes, bankRes, memberRes]) => {
        if (cancelled) return
        const list = showroomRes?.data?.items || []
        setShowrooms(list.map((s) => ({ value: s.id, label: s.name })))
        setLocationId((prev) => prev || list[0]?.id || '')

        const b = bankRes?.data
        setBanks(
          (Array.isArray(b) ? b : b?.items ?? []).map((x) => ({
            value: x.id,
            label: `${x.bankName} · ${x.accountNumberMasked || x.accountNumber} — ${x.accountName}`,
          }))
        )

        setCashiers(
          (memberRes?.data?.items || [])
            .filter(
              (m) =>
                String(m.role?.name || '').toLowerCase() === 'cashier' && m.status === 'ACTIVE'
            )
            .map((m) => ({ value: m.userId, label: m.displayName || m.email }))
        )
      })
      .finally(() => !cancelled && setLoadingLookups(false))
    return () => {
      cancelled = true
    }
  }, [])

  // ── till accounts for the selected showroom (TILL only) ──
  useEffect(() => {
    setTillFilter('')
    if (!locationId) {
      setTills([])
      return
    }
    let cancelled = false
    accountApi
      .listCashAccounts({ kind: ['TILL'], locationId, status: 'ACTIVE' })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res?.data) ? res.data : []
        setTills(list.map((c) => ({ value: c.id, label: `${c.code} · ${c.name}` })))
      })
      .catch(() => !cancelled && setTills([]))
    return () => {
      cancelled = true
    }
  }, [locationId])

  // reset page on filter changes
  useEffect(() => {
    setPage(0)
  }, [tab, locationId, tillFilter, bankFilter, cashierFilter, channelFilter])

  // ── the queue ────────────────────────────────────────────
  useEffect(() => {
    if (!locationId) {
      setRows([])
      return
    }
    let cancelled = false
    setLoading(true)
    const q = {
      page,
      size: PAGE_SIZE,
      locationId,
      confirmationStatus: tab,
      channel: channelFilter,
    }
    if (tillFilter) q.cashAccountId = tillFilter
    if (bankFilter) q.receivingBankAccountId = bankFilter
    if (cashierFilter) q.cashierUserId = cashierFilter
    if (search) q.q = search

    accountApi
      .listAccountReceipts(q)
      .then((res) => {
        if (cancelled) return
        const d = res?.data || {}
        setRows(d.items || [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load receipts', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [
    locationId,
    tab,
    page,
    tillFilter,
    bankFilter,
    cashierFilter,
    channelFilter,
    search,
    refreshKey,
    showToast,
  ])

  // ── stats for the selected showroom ──────────────────────
  useEffect(() => {
    if (!locationId) {
      setStats(null)
      return
    }
    let cancelled = false
    accountApi
      .getConfirmationStats(locationId)
      .then((res) => !cancelled && setStats(res?.data || null))
      .catch(() => !cancelled && setStats(null))
    return () => {
      cancelled = true
    }
  }, [locationId, refreshKey])

  // ── approve / decline ────────────────────────────────────
  const approve = useCallback(
    async (receipt) => {
      setActing(true)
      try {
        await accountApi.approveAccountReceipt(receipt.id)
        showToast('Payment approved', `${receipt.ref} · ${money(receipt.amount || 0)} confirmed.`)
        setActiveId(null)
        setRefreshKey((k) => k + 1)
      } catch (e) {
        showToast('Could not approve payment', e.message, true)
      } finally {
        setActing(false)
      }
    },
    [showToast]
  )

  async function decline(note) {
    if (!declineTarget) return
    setActing(true)
    try {
      await accountApi.declineAccountReceipt(declineTarget.id, note)
      showToast('Payment declined', `${declineTarget.ref} was declined and flagged.`)
      setDeclineTarget(null)
      setActiveId(null)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      showToast('Could not decline payment', e.message, true)
    } finally {
      setActing(false)
    }
  }

  const declineModal = declineTarget && (
    <ReasonModal
      title="Decline this payment"
      description={`${declineTarget.ref} · ${money(declineTarget.amount || 0)}. Nothing will be posted, and a wallet funding is never credited.`}
      label="Note *"
      confirmLabel="Decline payment"
      busy={acting}
      onConfirm={decline}
      onCancel={() => setDeclineTarget(null)}
    />
  )

  // ── detail view ──────────────────────────────────────────
  if (activeId) {
    return (
      <>
        {acting && <Loader overlay label="Working…" />}
        {declineModal}
        <ReceiptDetail
          receiptId={activeId}
          crumbs={crumbs}
          acting={acting}
          onBack={() => setActiveId(null)}
          onApprove={approve}
          onDecline={setDeclineTarget}
        />
      </>
    )
  }

  // ── columns ──────────────────────────────────────────────
  const columns = [
    { key: 'ref', label: 'Transaction', width: 130, mono: true },
    {
      key: 'receivedAt',
      label: 'Date',
      width: 160,
      render: (r) => fmtDateTime(r.receivedAt),
    },
    {
      key: 'channel',
      label: 'Channel',
      width: 150,
      render: (r) => (
        <Badge tone={r.channel === 'POS' ? 'brand' : 'neutral'}>{pretty(r.channel)}</Badge>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      width: 220,
      render: (r) => r.customerName || r.customer?.name || '—',
    },
    { key: 'cashier', label: 'Cashier', width: 150, render: (r) => r.cashier?.name || '—' },
    {
      key: 'terminal',
      label: 'Terminal',
      width: 140,
      mono: true,
      render: (r) => r.terminalRef || '—',
    },
    {
      key: 'payer',
      label: 'Payer reference',
      width: 160,
      mono: true,
      render: (r) => r.payerReference || '—',
    },
    {
      key: 'bank',
      label: 'Receiving bank',
      width: 200,
      render: (r) => bankLabel(r.receivingBankAccount),
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) => money(r.amount || 0),
    },
    ...(tab === 'PENDING'
      ? [
          {
            key: 'action',
            label: 'Action',
            width: 190,
            sortable: false,
            render: (r) => (
              <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  iconLeft="check"
                  disabled={acting}
                  onClick={(e) => {
                    e.stopPropagation()
                    approve(r)
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={acting}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeclineTarget(r)
                  }}
                >
                  Decline
                </Button>
              </div>
            ),
          },
        ]
      : [
          {
            key: 'reviewedBy',
            label: 'Reviewed by',
            width: 150,
            render: (r) => r.reviewedBy?.name || '—',
          },
          {
            key: 'reviewedAt',
            label: 'Reviewed on',
            width: 160,
            render: (r) => fmtDateTime(r.reviewedAt),
          },
          {
            key: 'confirmationStatus',
            label: 'Outcome',
            width: 120,
            render: (r) => (
              <Badge tone={TONE[r.confirmationStatus] || 'neutral'}>
                {pretty(r.confirmationStatus)}
              </Badge>
            ),
          },
          {
            key: 'declineNote',
            label: 'Note',
            width: 280,
            render: (r) => r.declineNote || '—',
          },
        ]),
  ]

  const pageTotal = rows.reduce((n, r) => n + (r.amount || 0), 0)
  const pendingCount = stats?.pendingCount ?? 0
  const pendingValue = stats?.pendingValue ?? 0
  const declinedToday = stats?.declinedToday ?? 0

  return (
    <>
      {(loading || loadingLookups || acting) && (
        <Loader
          overlay
          label={acting ? 'Working…' : loadingLookups ? 'Loading…' : 'Loading payments…'}
        />
      )}
      {declineModal}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'POS/Fund Transfer Confirmation'}
        icon={leaf?.icon}
        description="Verify POS, fund transfer and cheque payments before they are finalised. Confirm the funds reached the company account, then approve — or decline and flag the transaction for investigation."
        tabs={TABS}
        tab={tab}
        onTabChange={setTab}
        searchPlaceholder="Search by transaction reference, customer or cashier…"
        search={searchInput}
        onSearch={setSearchInput}
        filters={
          <>
            <Select
              options={showrooms}
              value={locationId}
              onChange={(e) => setLocationId(val(e))}
              placeholder={showrooms.length ? 'Select showroom…' : 'No showrooms'}
              disabled={!showrooms.length}
              style={{ width: 210 }}
            />
            <Select
              options={CHANNEL_OPTIONS}
              value={channelFilter}
              onChange={(e) => setChannelFilter(val(e))}
              style={{ width: 170 }}
            />
            <Select
              options={[{ value: '', label: 'All tills' }, ...tills]}
              value={tillFilter}
              onChange={(e) => setTillFilter(val(e))}
              style={{ width: 190 }}
            />
            <Select
              options={[{ value: '', label: 'All banks' }, ...banks]}
              value={bankFilter}
              onChange={(e) => setBankFilter(val(e))}
              style={{ width: 220 }}
            />
            <Select
              options={[{ value: '', label: 'All cashiers' }, ...cashiers]}
              value={cashierFilter}
              onChange={(e) => setCashierFilter(val(e))}
              style={{ width: 170 }}
            />
          </>
        }
        stats={[
          {
            label: 'Awaiting verification',
            value: String(pendingCount),
            tone: pendingCount ? 'warning' : undefined,
          },
          { label: 'Value unverified', value: moneyShort(pendingValue) },
          { label: 'Approved today', value: String(stats?.approvedToday ?? 0) },
          {
            label: 'Declined today',
            value: String(declinedToday),
            tone: declinedToday ? 'negative' : undefined,
            hint: declinedToday ? 'Flagged for review' : undefined,
          },
        ]}
        columns={columns}
        rows={rows}
        pagination={{
          page,
          pageCount: pageInfo.totalPages,
          pageSize: PAGE_SIZE,
          total: pageInfo.totalItems,
          onPage: setPage,
        }}
        onRowClick={(r) => setActiveId(r.id)}
        totals={{ ref: 'Total (this page)', amount: money(pageTotal) }}
        emptyTitle={
          !locationId
            ? 'No showroom selected'
            : tab === 'PENDING'
              ? 'Nothing awaiting verification'
              : `No ${tab.toLowerCase()} transactions`
        }
        emptyDescription={
          !locationId
            ? 'Create or select a showroom to see its payments.'
            : tab === 'PENDING'
              ? 'Every POS, transfer and cheque payment here has been reviewed.'
              : undefined
        }
        footnote="A transaction is not treated as settled until it is approved here. Declined transactions remain on record and are flagged for investigation rather than deleted. Click a row for the full receipt."
      >
        {tab === 'PENDING' && pendingCount > 0 && (
          <Callout
            tone="warning"
            icon="hourglass"
            title={`${money(pendingValue)} awaiting verification`}
          >
            Check each payment against the receiving bank account before approving. Anything without a
            matching settlement should be declined and flagged rather than left pending.
          </Callout>
        )}
      </RegisterShell>
    </>
  )
}