import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FilterBar } from '../shells/FilterBar.jsx'
import { Callout } from '../shells/Page.jsx'
import { money, moneyShort } from '../utils.js'
import { buildFilters } from '../utils.js'
import { useStore } from '../store.jsx'
import AccountApi from '../../api/AccountApi.js'

const accountApi = new AccountApi()

const PAGE_SIZE = 20

const TABS = [
  { value: 'Awaiting', label: 'Awaiting confirmation', icon: 'hourglass' },
  { value: 'Queried', label: 'Queried', icon: 'circle-help' },
  { value: 'Confirmed', label: 'Confirmed', icon: 'circle-check-big' },
]

// Which backend statuses each tab shows. Adjust if your backend means something different.
const TAB_STATUS = {
  Awaiting: 'AWAITING',
  Queried: 'REJECTED',
  Confirmed: 'CONFIRMED,PARTIALLY_CONFIRMED',
}

const STATUS_TONE = {
  AWAITING: 'warning',
  REJECTED: 'danger',
  CONFIRMED: 'success',
  PARTIALLY_CONFIRMED: 'warning',
}

const sentence = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Drop empty filter values so they are not sent as blank query params.
const cleanFilters = (values = {}) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v !== '' && v != null))

export default function FundsAwaitingReception({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  const [tab, setTab] = useState('Awaiting')

  // filters
  const [meta, setMeta] = useState(null)
  const [values, setValues] = useState({}) // what the inputs currently show
  const [applied, setApplied] = useState({}) // what the list is currently using

  // data
  const [page, setPage] = useState(0)
  const [items, setItems] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)

  // Filter definitions come from the backend.
  useEffect(() => {
    let cancelled = false
    accountApi
      .getFundsDisbursementFilters()
      .then((res) => !cancelled && setMeta(res.data))
      .catch((e) => !cancelled && showToast('Could not load filters', e.message, true))
    return () => { cancelled = true }
  }, [showToast])

  // Rebuilt when the factories list changes, so Destination options appear as soon as they exist.
  const filters = useMemo(
    () =>
      buildFilters(meta, {
        locations: (factories || []).map((f) => ({ value: f.id, label: f.name })),
        exclude: ['status'], // the tabs drive status
      }),
    [meta, factories],
  )

  // value -> label for the channel column
  const channelLabels = useMemo(() => {
    const f = (meta?.fields || []).find((x) => x.key === 'channel')
    return Object.fromEntries((f?.options || []).map((o) => [o.value, o.label]))
  }, [meta])

  // One page of disbursements. Runs again when the tab, applied filters or page change.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    accountApi
      .getFundsDisbursements({
        ...applied,
        status: TAB_STATUS[tab],
        page,
        size: PAGE_SIZE,
      })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load disbursements', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [applied, tab, page, showToast])

  const changeTab = (t) => {
    setTab(t)
    setPage(0)
  }

  const generate = () => {
    setApplied(cleanFilters(values))
    setPage(0)
  }

  const reset = () => {
    setValues({})
    setApplied({})
    setPage(0)
  }

  // Normalise API rows for the table.
  const rows = useMemo(
    () =>
      items.map((r) => ({
        id: r.id,
        ref: r.ref || '—',
        date: fmtDate(r.sentAt ?? r.date),
        purpose: r.purpose || '—',
        sentBy: r.sentBy?.name || '—',
        channel: channelLabels[r.channel] || sentence(r.channel) || '—',
        destination: r.destinationLocation?.name || '—',
        sent: Number(r.sent) || 0,
        received: Number(r.received) || 0,
        shortfall: Number(r.shortfall) || 0,
        status: r.status,
        confirmedBy: r.confirmedBy?.name
          ? `${r.confirmedBy.name} · ${fmtDate(r.dateReceived)}`
          : '—',
        rejectionReason: r.rejectionReason || '—',
      })),
    [items, channelLabels],
  )

  // Totals cover the rows on this page only; the endpoint is paged.
  const sentTotal = rows.reduce((n, r) => n + r.sent, 0)
  const receivedTotal = rows.reduce((n, r) => n + r.received, 0)
  const shortfallTotal = rows.reduce((n, r) => n + r.shortfall, 0)

  const isOpen = tab !== 'Confirmed'

  const columns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'date', label: 'Sent', width: 130 },
    { key: 'purpose', label: 'Purpose', width: 300 },
    { key: 'sentBy', label: 'Sent by', width: 200 },
    { key: 'channel', label: 'Channel', width: 140 },
    { key: 'destination', label: 'Destination', width: 160 },
    { key: 'sent', label: 'Amount sent', width: 170, align: 'right', mono: true, render: (r) => money(r.sent) },
    {
      key: 'status', label: 'Status', width: 170,
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{sentence(r.status)}</Badge>,
    },
    ...(tab === 'Confirmed'
      ? [
          { key: 'received', label: 'Received', width: 170, align: 'right', mono: true, render: (r) => money(r.received) },
          {
            key: 'shortfall', label: 'Shortfall', width: 150, align: 'right', mono: true,
            render: (r) => (r.shortfall > 0
              ? <span style={{ color: 'var(--danger)' }}>{money(r.shortfall)}</span>
              : money(0)),
          },
          { key: 'confirmedBy', label: 'Confirmed by', width: 220 },
        ]
      : tab === 'Queried'
        ? [
            { key: 'rejectionReason', label: 'Reason', width: 260 },
            {
              key: 'actions', label: 'Action', width: 120, sortable: false,
              render: () => <Button size="sm" iconLeft="check">Resolve</Button>,
            },
          ]
        : [{
            key: 'actions', label: 'Action', width: 210, sortable: false,
            render: () => (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="sm" iconLeft="check">Confirm receipt</Button>
                <Button size="sm" variant="secondary">Query</Button>
              </div>
            ),
          }]),
  ]

  const totals =
    tab === 'Confirmed'
      ? { ref: 'Total (this page)', sent: money(sentTotal), received: money(receivedTotal), shortfall: money(shortfallTotal) }
      : { ref: 'Total (this page)', sent: money(sentTotal) }

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Funds Awaiting Reception'}
      icon={leaf?.icon}
      description="Funds disbursed for factory internal operations are held here until the factory accountant acknowledges and confirms they were received."
      tabs={TABS}
      tab={tab}
      onTabChange={changeTab}
      searchPlaceholder="Search by reference, purpose or disbursing officer…"
      stats={[
        { label: TABS.find((t) => t.value === tab)?.label, value: String(pageInfo.totalItems), hint: 'Matching the filters' },
        { label: 'Amount sent', value: moneyShort(sentTotal), hint: 'This page' },
        { label: 'Amount received', value: moneyShort(receivedTotal), hint: 'This page' },
        { label: 'Shortfall', value: moneyShort(shortfallTotal), tone: shortfallTotal > 0 ? 'negative' : undefined, hint: 'This page' },
      ]}
      columns={columns}
      rows={rows}
      totals={totals}
      pagination={{
        page,
        pageCount: pageInfo.totalPages,
        pageSize: PAGE_SIZE,
        total: pageInfo.totalItems,
        onPage: setPage,
      }}
      emptyTitle={
        tab === 'Awaiting' ? 'Nothing awaiting confirmation'
          : tab === 'Queried' ? 'No queried disbursements'
            : 'No confirmed disbursements in this period'
      }
      emptyDescription={
        tab === 'Awaiting'
          ? 'All disbursed funds have been acknowledged by the factory accountant.'
          : 'Widen the date range or clear the filters, then generate again.'
      }
      footnote="Funds are not recorded against the factory's operating balance, and cannot be utilised, until confirmed here."
    >
      {loading && <Loader overlay label="Loading disbursements…" />}

      {filters.length > 0 && (
        <FilterBar
          fields={filters}
          values={values}
          onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))}
          onGenerate={generate}
          onReset={reset}
        />
      )}

      {isOpen && rows.length > 0 && (
        <Callout
          tone={tab === 'Queried' ? 'danger' : 'warning'}
          icon={tab === 'Queried' ? 'circle-alert' : 'hourglass'}
          title={
            tab === 'Queried'
              ? 'Queried disbursements need resolution'
              : `${money(sentTotal)} held pending acknowledgement (this page)`
          }
        >
          {tab === 'Queried'
            ? 'These disbursements were disputed by the receiving factory. Resolve each with the disbursing officer before they can be confirmed and utilised.'
            : 'These funds have left Management but have not yet been acknowledged as received. They remain unavailable for factory use until confirmed.'}
        </Callout>
      )}
    </RegisterShell>
  )
}