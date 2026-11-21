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
import { fmt, money, moneyShort } from '../utils.js'
import CashierApi from '../../api/CashierApi.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const cashierApi = new CashierApi()
const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 20

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const normStatus = (s) => String(s || '').toUpperCase()
const isOpen = (s) => normStatus(s) === 'OPEN'

const STATUS_CONFIG = {
  OPEN: { label: 'Open', tone: 'success' },
  CLOSED: { label: 'Closed', tone: 'neutral' },
}
const statusOf = (s) =>
  STATUS_CONFIG[normStatus(s)] || { label: s || '—', tone: 'neutral' }

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
]

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

const varianceTone = (v) => (v == null || v === 0 ? undefined : 'negative')
const signed = (v) =>
  v == null ? '—' : v === 0 ? money(0) : `${v > 0 ? '+' : '−'} ${money(Math.abs(v))}`

// Recognises the "you have no open till" failure from the backend
export const isNoTillError = (e) => {
  const code = e?.code ?? e?.error?.code ?? e?.response?.data?.error?.code
  return (
    code === 'NO_OPEN_TILL_SESSION' ||
    e?.status === 404 ||
    /till session/i.test(String(e?.message || ''))
  )
}

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

/* ------------------------------------------------------------------ */
/*  Open-till panel (also used inside the New sale form)               */
/* ------------------------------------------------------------------ */
export function OpenTillPanel({ onOpened }) {
  const { showToast } = useStore()

  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [listUnavailable, setListUnavailable] = useState(false)
  const [cashAccountId, setCashAccountId] = useState('')
  const [openingFloat, setOpeningFloat] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        // ⚠️ Replace with whatever endpoint lists TILL cash accounts in your AccountApi.
        // If it doesn't exist yet, the panel falls back to a manual account ID field.
        if (typeof accountApi.listCashAccounts !== 'function') {
          throw new Error('listCashAccounts is not available')
        }
        const res = await accountApi.listCashAccounts({ type: 'TILL', status: 'ACTIVE' })
        if (cancelled) return
        const d = res?.data
        setAccounts(Array.isArray(d) ? d : d?.items ?? [])
      } catch {
        if (!cancelled) setListUnavailable(true)
      } finally {
        if (!cancelled) setLoadingAccounts(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  const accountOptions = [
    { value: '', label: loadingAccounts ? 'Loading…' : 'Select till account…' },
    ...accounts.map((a) => ({
      value: a.id,
      label: `${a.code ? `${a.code} · ` : ''}${a.name || a.accountName || a.id}${
        a.location?.name ? ` (${a.location.name})` : ''
      }`,
    })),
  ]

  const canOpen =
    cashAccountId.trim() &&
    openingFloat !== '' &&
    Number(openingFloat) >= 0 &&
    !saving

  async function open() {
    if (!canOpen) return
    setSaving(true)
    try {
      const res = await cashierApi.createCashierTillSession({
        cashAccountId: cashAccountId.trim(),
        openingFloat: Number(openingFloat),
      })
      showToast('Till opened', 'You can now start selling.')
      onOpened(res.data)
    } catch (e) {
      showToast('Could not open till', e.message, true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel
      title="Open a till session"
      description="Pick the till's cash account at your showroom and enter the cash float you're starting the day with."
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ width: 320 }}>
          {listUnavailable ? (
            <Input
              label="Till cash account ID *"
              placeholder="Paste the till cash account ID"
              value={cashAccountId}
              onChange={(e) => setCashAccountId(val(e))}
            />
          ) : (
            <Select
              label="Till cash account *"
              options={accountOptions}
              value={cashAccountId}
              onChange={(v) => setCashAccountId(val(v))}
            />
          )}
        </div>
        <div style={{ width: 180 }}>
          <Input
            label="Opening float (₦) *"
            type="number"
            placeholder="0.00"
            value={openingFloat}
            onChange={(e) => setOpeningFloat(val(e))}
          />
        </div>
        <Button iconLeft="play" onClick={open} disabled={!canOpen}>
          {saving ? 'Opening…' : 'Open till'}
        </Button>
      </div>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
/*  Open-till page                                                     */
/* ------------------------------------------------------------------ */
function OpenTillForm({ crumbs, onBack, onOpened }) {
  return (
    <FormShell
      crumbs={crumbs}
      title="Open till"
      icon="play"
      description="Start a till session so you can ring up sales. Each cashier can have one open session at a time."
      headerActions={
        <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
          Back
        </Button>
      }
      submitLabel={null}
      onCancel={onBack}
    >
      <OpenTillPanel onOpened={onOpened} />
    </FormShell>
  )
}

/* ------------------------------------------------------------------ */
/*  Detail view                                                        */
/* ------------------------------------------------------------------ */
function TillDetail({ session, loading, crumbs, onBack, onRefresh, onClose }) {
  if (loading || !session) {
    return (
      <>
        {loading && <Loader overlay label="Loading till session…" />}
        <FormShell
          crumbs={crumbs}
          title="Loading…"
          icon="wallet"
          submitLabel={null}
          onCancel={onBack}
          headerActions={
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to list
            </Button>
          }
        >
          <Panel title="Details">
            <div style={{ color: 'var(--text-muted)', padding: 12 }}>Loading…</div>
          </Panel>
        </FormShell>
      </>
    )
  }

  const open = isOpen(session.status)
  const cfg = statusOf(session.status)
  const r = session.running || {}
  const expected = open ? r.expectedCashNow : session.expectedCash

  return (
    <FormShell
      wide
      crumbs={crumbs}
      title={`${session.till?.name || 'Till'} — ${session.cashier?.name || '—'}`}
      icon="wallet"
      description={`${session.location?.name || '—'} · Opened ${fmtDateTime(session.openedAt)}${
        session.closedAt ? ` · Closed ${fmtDateTime(session.closedAt)}` : ''
      }`}
      submitLabel={null}
      onCancel={onBack}
      headerActions={
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="secondary" iconLeft="rotate-cw" onClick={onRefresh}>
            Refresh
          </Button>
          {open && (
            <Button iconLeft="lock" onClick={onClose}>
              Close till
            </Button>
          )}
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        </div>
      }
      aside={
        <Panel title="Cash reconciliation">
          <MetaRow label="Status" value={<Badge tone={cfg.tone}>{cfg.label}</Badge>} />
          <MetaRow label="Opening float" value={money(session.openingFloat || 0)} mono />
          <MetaRow
            label={open ? 'Expected cash now' : 'Expected cash'}
            value={expected != null ? money(expected) : '—'}
            mono
          />
          <MetaRow
            label="Counted cash"
            value={session.countedCash != null ? money(session.countedCash) : '—'}
            mono
          />
          <MetaRow
            label="Variance"
            value={signed(session.variance)}
            mono
            tone={varianceTone(session.variance)}
          />
        </Panel>
      }
    >
      <Panel title="Session">
        <FieldSet columns={2}>
          <MetaRow label="Till" value={session.till?.name || '—'} />
          <MetaRow label="Till code" value={session.till?.code || '—'} mono />
          <MetaRow label="Showroom" value={session.location?.name || '—'} />
          <MetaRow label="Cashier" value={session.cashier?.name || '—'} />
          <MetaRow label="Opened" value={fmtDateTime(session.openedAt)} />
          <MetaRow label="Closed" value={fmtDateTime(session.closedAt)} />
          <MetaRow label="Closed by" value={session.closedBy?.name || '—'} />
        </FieldSet>
      </Panel>

      <Panel
        title={open ? 'Takings so far' : 'Takings'}
        description="What was collected during this session, by payment type."
      >
        <FieldSet columns={2}>
          <MetaRow label="Sales" value={fmt(r.salesCount || 0)} mono />
          <MetaRow label="On account" value={money(r.onAccount || 0)} mono />
          <MetaRow label="Cash" value={money(r.cashTaken || 0)} mono />
          <MetaRow label="Card" value={money(r.cardTaken || 0)} mono />
          <MetaRow label="Transfer" value={money(r.transferTaken || 0)} mono />
          <MetaRow label="Wallet" value={money(r.walletTaken || 0)} mono />
          <MetaRow label="Deposit" value={money(r.depositTaken || 0)} mono />
        </FieldSet>
      </Panel>

      {session.forceClosed && (
        <Callout tone="warning" icon="circle-alert" title="Force closed">
          This session was closed by someone other than the cashier.
        </Callout>
      )}

      {session.closeNote && (
        <Callout tone="info" icon="circle-alert" title="Closing note">
          {session.closeNote}
        </Callout>
      )}
    </FormShell>
  )
}

/* ------------------------------------------------------------------ */
/*  Close form                                                         */
/* ------------------------------------------------------------------ */
function CloseTillForm({ session, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [countedCash, setCountedCash] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const expected = Number(session.running?.expectedCashNow) || 0
  const counted = Number(countedCash)
  const variance = countedCash === '' ? null : Math.round((counted - expected) * 100) / 100

  const missing = []
  if (countedCash === '' || Number.isNaN(counted) || counted < 0) missing.push('Counted cash')
  if (variance != null && variance !== 0 && !note.trim()) missing.push('A note explaining the variance')

  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await cashierApi.closeCashierTillSession(session.id, {
        countedCash: counted,
        note: note.trim(),
      })
      showToast('Till closed', 'The session has been closed and reconciled.')
      onDone()
    } catch (e) {
      showToast('Could not close till', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Closing till…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Close ${session.till?.name || 'till'}`}
        icon="lock"
        description="Count the cash in the drawer and enter it below. The difference from the expected amount is recorded as the variance."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Close till"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Expected vs counted">
            <MetaRow label="Opening float" value={money(session.openingFloat || 0)} mono />
            <MetaRow label="Cash taken" value={money(session.running?.cashTaken || 0)} mono />
            <MetaRow label="Expected cash" value={money(expected)} mono />
            <MetaRow
              label="Counted cash"
              value={countedCash === '' ? '—' : money(counted)}
              mono
            />
            <MetaRow
              label="Variance"
              value={signed(variance)}
              mono
              tone={varianceTone(variance)}
            />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these fields to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}

        <Panel title="Cash count">
          <div style={{ width: 240 }}>
            <Input
              label="Counted cash (₦) *"
              type="number"
              placeholder="0.00"
              value={countedCash}
              onChange={(e) => setCountedCash(val(e))}
              hint={`Expected: ${money(expected)}`}
            />
          </div>
        </Panel>

        <Panel
          title="Note"
          description="Required when the counted cash doesn't match what was expected."
        >
          <textarea
            rows={3}
            placeholder="e.g. Short by ₦500 — change given in error."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={textareaStyle}
          />
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function TillSessions({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list') // list | open | detail | close
  const [active, setActive] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // The caller's own open session (if any)
  const [current, setCurrent] = useState(null)

  // List state
  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Lookups
  const [showrooms, setShowrooms] = useState([])

  useEffect(() => {
    let cancelled = false
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        setShowrooms(
          (res.data || []).map((s) => ({
            value: s.id,
            label: s.label || s.name || s.code,
          }))
        )
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const loadCurrent = useCallback(async () => {
    try {
      const res = await cashierApi.getCurrentCashierTillSession()
      setCurrent(res?.data || null)
    } catch (e) {
      setCurrent(null)
      if (!isNoTillError(e)) showToast('Could not check your till', e.message, true)
    }
  }, [showToast])

  useEffect(() => {
    loadCurrent()
  }, [loadCurrent])

  useEffect(() => {
    setPage(0)
  }, [statusFilter, locationFilter, fromDate, toDate])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (statusFilter) q.status = statusFilter
      if (locationFilter) q.locationId = locationFilter
      if (fromDate) q.from = fromDate
      if (toDate) q.to = toDate

      const res = await cashierApi.listCashierTillSessions(q)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load till sessions', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, locationFilter, fromDate, toDate, showToast])

  useEffect(() => {
    load()
  }, [load])

  const loadSession = useCallback(
    async (id) => {
      setLoadingDetail(true)
      try {
        const res = await cashierApi.getTierTillSession(id)
        setActive(res.data)
        return res.data
      } catch (e) {
        showToast('Could not load till session', e.message, true)
        return null
      } finally {
        setLoadingDetail(false)
      }
    },
    [showToast]
  )

  async function openSession(row) {
    setActive(null)
    setMode('detail')
    await loadSession(row.id)
  }

  function backToList() {
    setMode('list')
    setActive(null)
    load()
    loadCurrent()
  }

  // ── Render branches ───────────────────────────────────
  if (mode === 'open') {
    return (
      <OpenTillForm
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onOpened={async (session) => {
          setCurrent(session)
          setActive(session)
          setMode('detail')
          load()
        }}
      />
    )
  }

  if (mode === 'close' && active) {
    return (
      <CloseTillForm
        session={active}
        crumbs={crumbs}
        onBack={() => setMode('detail')}
        onDone={async () => {
          setMode('detail')
          await loadSession(active.id)
          loadCurrent()
          load()
        }}
      />
    )
  }

  if (mode === 'detail') {
    return (
      <TillDetail
        session={active}
        loading={loadingDetail}
        crumbs={crumbs}
        onBack={backToList}
        onRefresh={() => active && loadSession(active.id)}
        onClose={() => setMode('close')}
      />
    )
  }

  // ── List view ─────────────────────────────────────────
  const columns = [
    {
      key: 'till',
      label: 'Till',
      width: 170,
      render: (r) => r.till?.name || r.till?.code || '—',
    },
    {
      key: 'location',
      label: 'Showroom',
      width: 180,
      render: (r) => r.location?.name || '—',
    },
    {
      key: 'cashier',
      label: 'Cashier',
      width: 170,
      render: (r) => r.cashier?.name || '—',
    },
    {
      key: 'openedAt',
      label: 'Opened',
      width: 170,
      render: (r) => fmtDateTime(r.openedAt),
    },
    {
      key: 'openingFloat',
      label: 'Float',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) => money(r.openingFloat || 0),
    },
    {
      key: 'sales',
      label: 'Sales',
      width: 80,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.running?.salesCount || 0),
    },
    {
      key: 'expected',
      label: 'Expected cash',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => {
        const v = isOpen(r.status) ? r.running?.expectedCashNow : r.expectedCash
        return v != null ? money(v) : '—'
      },
    },
    {
      key: 'variance',
      label: 'Variance',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) => signed(r.variance),
    },
    {
      key: 'status',
      label: 'Status',
      width: 120,
      render: (r) => {
        const c = statusOf(r.status)
        return <Badge tone={c.tone}>{c.label}</Badge>
      },
    },
  ]

  const showroomFilterOptions = [{ value: '', label: 'All showrooms' }, ...showrooms]
  const openCount = rows.filter((r) => isOpen(r.status)).length
  const varianceTotal = rows.reduce((n, r) => n + (Number(r.variance) || 0), 0)

  return (
    <>
      {(loading || loadingDetail) && (
        <Loader overlay label={loadingDetail ? 'Loading till session…' : 'Loading till sessions…'} />
      )}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Till sessions'}
        icon={leaf?.icon}
        description="Open a till before selling and close it at the end of your shift with a cash count. Click a session to see its takings and reconciliation."
        createLabel="Open till"
        onCreate={() => setMode('open')}
        headerActions={
          current ? (
            <Button
              variant="secondary"
              iconLeft="lock"
              onClick={() => {
                setActive(current)
                setMode('close')
              }}
            >
              Close my till
            </Button>
          ) : null
        }
        filters={
          <>
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 170 }}
            />
            <Select
              options={showroomFilterOptions}
              value={locationFilter}
              onChange={(v) => setLocationFilter(val(v))}
              style={{ width: 200 }}
            />
            <Input
              type="date"
              aria-label="From date"
              value={fromDate}
              onChange={(e) => setFromDate(val(e))}
              style={{ width: 150 }}
            />
            <Input
              type="date"
              aria-label="To date"
              value={toDate}
              onChange={(e) => setToDate(val(e))}
              style={{ width: 150 }}
            />
          </>
        }
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        stats={[
          { label: 'Sessions', value: String(totalItems) },
          {
            label: 'My till',
            value: current ? `Open · ${current.till?.name || current.till?.code || ''}` : 'Not open',
          },
          { label: 'Open (this page)', value: String(openCount) },
          { label: 'Net variance (this page)', value: varianceTotal ? signed(varianceTotal) : moneyShort(0) },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={openSession}
        emptyTitle="No till sessions yet"
        emptyDescription="Open a till to start a session."
        footnote="A till session must be open before a sale can be started."
      />
    </>
  )
}