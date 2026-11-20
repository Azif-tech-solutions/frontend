// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { cashiers, tenderablePayable, tenderableReceipts, walletFunding } from '../sampleAccount.js'
// import { showrooms, dealerWallets } from '../sampleShowroom.js'
// import { fmt, money, moneyShort } from '../utils.js'

// const TABS = [
//   { value: 'transactions', label: 'Transactions', icon: 'receipt' },
//   { value: 'wallet', label: 'Wallet Funds', icon: 'wallet' },
//   { value: 'general', label: 'General Report', icon: 'chart-column' },
// ]

// const SUB_TABS = [
//   { value: 'payable', label: 'Payable' },
//   { value: 'receipts', label: 'Receipt Track' },
// ]

// const CHANNELS = ['ftf', 'cash', 'pos', 'wallet']
// const sum = (rows, k) => rows.reduce((n, r) => n + r[k], 0)
// /** Net realised per row: all channels less refunds. */
// const net = (r) => CHANNELS.reduce((n, k) => n + r[k], 0) - r.refund

// /** Sub-tab 1 — exact amount realised by each cashier, by date and channel. */
// function buildPayable() {
//   const rows = tenderablePayable.map((r) => ({ ...r, total: net(r) }))
//   const totals = {
//     date: 'Total',
//     ftf: money(sum(rows, 'ftf')), cash: money(sum(rows, 'cash')), pos: money(sum(rows, 'pos')),
//     wallet: money(sum(rows, 'wallet')), refund: money(sum(rows, 'refund')), total: money(sum(rows, 'total')),
//   }
//   return {
//     columns: [
//       { key: 'date', label: 'Date', width: 130 },
//       { key: 'cashier', label: 'Cashier', width: 170 },
//       { key: 'ftf', label: 'FTF', width: 150, align: 'right', mono: true, render: (r) => (r.ftf ? money(r.ftf) : '—') },
//       { key: 'cash', label: 'Cash', width: 150, align: 'right', mono: true, render: (r) => (r.cash ? money(r.cash) : '—') },
//       { key: 'pos', label: 'POS', width: 150, align: 'right', mono: true, render: (r) => (r.pos ? money(r.pos) : '—') },
//       { key: 'wallet', label: 'Wallet', width: 150, align: 'right', mono: true, render: (r) => (r.wallet ? money(r.wallet) : '—') },
//       {
//         key: 'refund', label: 'Refund', width: 145, align: 'right', mono: true,
//         render: (r) => (r.refund ? <span style={{ color: 'var(--danger)' }}>{money(r.refund)}</span> : '—'),
//       },
//       { key: 'total', label: 'Net realised', width: 175, align: 'right', mono: true, render: (r) => money(r.total) },
//     ],
//     rows,
//     totals,
//     stats: [
//       { label: 'Net realised', value: moneyShort(sum(rows, 'total')) },
//       { label: 'Cash collected', value: moneyShort(sum(rows, 'cash')) },
//       { label: 'Electronic (FTF + POS)', value: moneyShort(sum(rows, 'ftf') + sum(rows, 'pos')) },
//       { label: 'Refunded', value: moneyShort(sum(rows, 'refund')), tone: 'negative', hint: 'Deducted from realised' },
//     ],
//     tableTitle: 'Amount realised by cashier',
//   }
// }

// /** Sub-tab 2 — every invoice or receipt issued, for a complete audit trail. */
// function buildReceipts() {
//   const rows = tenderableReceipts
//   const issued = rows.filter((r) => r.status === 'Issued')
//   return {
//     columns: [
//       { key: 'receipt', label: 'Receipt no.', width: 140, mono: true },
//       { key: 'date', label: 'Date', width: 130 },
//       { key: 'cashier', label: 'Cashier', width: 170 },
//       { key: 'customer', label: 'Customer', width: 250 },
//       {
//         key: 'channel', label: 'Channel', width: 160,
//         render: (r) => <Badge tone={r.channel === 'Cash' ? 'neutral' : 'brand'}>{r.channel}</Badge>,
//       },
//       { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
//       {
//         key: 'status', label: 'Status', width: 130,
//         render: (r) => <Badge tone={r.status === 'Issued' ? 'success' : 'danger'}>{r.status}</Badge>,
//       },
//     ],
//     rows,
//     totals: { receipt: 'Total', amount: money(issued.reduce((n, r) => n + r.amount, 0)) },
//     stats: [
//       { label: 'Receipts issued', value: String(issued.length) },
//       { label: 'Value issued', value: moneyShort(issued.reduce((n, r) => n + r.amount, 0)) },
//       { label: 'Voided', value: String(rows.length - issued.length), tone: rows.length - issued.length ? 'negative' : undefined },
//       { label: 'Cashiers active', value: String(new Set(rows.map((r) => r.cashier)).size) },
//     ],
//     tableTitle: 'Receipt and invoice audit trail',
//   }
// }

// /** Tab 2 — how dealers' wallets were funded. */
// function buildWalletFunds() {
//   const rows = walletFunding
//   const confirmed = rows.filter((r) => r.status === 'Confirmed')
//   return {
//     columns: [
//       { key: 'ref', label: 'Reference', width: 120, mono: true },
//       { key: 'date', label: 'Date', width: 130 },
//       { key: 'dealer', label: 'Dealer', width: 250 },
//       { key: 'method', label: 'Funding method', width: 170 },
//       { key: 'bank', label: 'Bank', width: 200 },
//       { key: 'amount', label: 'Amount funded', width: 175, align: 'right', mono: true, render: (r) => money(r.amount) },
//       { key: 'confirmedBy', label: 'Confirmed by', width: 160 },
//       {
//         key: 'status', label: 'Status', width: 190,
//         render: (r) => <Badge tone={r.status === 'Confirmed' ? 'success' : 'warning'}>{r.status}</Badge>,
//       },
//     ],
//     rows,
//     totals: { ref: 'Total', amount: money(confirmed.reduce((n, r) => n + r.amount, 0)) },
//     stats: [
//       { label: 'Wallets funded', value: String(new Set(rows.map((r) => r.dealer)).size) },
//       { label: 'Value confirmed', value: moneyShort(confirmed.reduce((n, r) => n + r.amount, 0)) },
//       { label: 'Awaiting confirmation', value: String(rows.length - confirmed.length), tone: rows.length - confirmed.length ? 'warning' : undefined },
//       { label: 'Total wallet balances', value: moneyShort(dealerWallets.reduce((n, d) => n + d.balance, 0)) },
//     ],
//     tableTitle: 'Dealer wallet funding',
//   }
// }

// /** Tab 3 — funds realised per cashier, consolidated across channels and dates. */
// function buildGeneral() {
//   const byCashier = Object.values(
//     tenderablePayable.reduce((acc, r) => {
//       acc[r.cashier] ||= { cashier: r.cashier, ftf: 0, cash: 0, pos: 0, wallet: 0, refund: 0, days: new Set() }
//       CHANNELS.forEach((k) => { acc[r.cashier][k] += r[k] })
//       acc[r.cashier].refund += r.refund
//       acc[r.cashier].days.add(r.date)
//       return acc
//     }, {})
//   ).map((c) => ({ ...c, days: c.days.size, total: CHANNELS.reduce((n, k) => n + c[k], 0) - c.refund }))
//     .sort((a, b) => b.total - a.total)

//   return {
//     columns: [
//       { key: 'cashier', label: 'Cashier', width: 190 },
//       { key: 'days', label: 'Days active', width: 130, align: 'right', mono: true, render: (r) => fmt(r.days) },
//       { key: 'ftf', label: 'FTF', width: 155, align: 'right', mono: true, render: (r) => money(r.ftf) },
//       { key: 'cash', label: 'Cash', width: 155, align: 'right', mono: true, render: (r) => money(r.cash) },
//       { key: 'pos', label: 'POS', width: 155, align: 'right', mono: true, render: (r) => money(r.pos) },
//       { key: 'wallet', label: 'Wallet', width: 155, align: 'right', mono: true, render: (r) => money(r.wallet) },
//       {
//         key: 'refund', label: 'Refund', width: 145, align: 'right', mono: true,
//         render: (r) => (r.refund ? <span style={{ color: 'var(--danger)' }}>{money(r.refund)}</span> : '—'),
//       },
//       { key: 'total', label: 'Net realised', width: 180, align: 'right', mono: true, render: (r) => money(r.total) },
//     ],
//     rows: byCashier,
//     totals: {
//       cashier: 'Total',
//       ftf: money(sum(byCashier, 'ftf')), cash: money(sum(byCashier, 'cash')), pos: money(sum(byCashier, 'pos')),
//       wallet: money(sum(byCashier, 'wallet')), refund: money(sum(byCashier, 'refund')), total: money(sum(byCashier, 'total')),
//     },
//     stats: [
//       { label: 'Cashiers reporting', value: String(byCashier.length) },
//       { label: 'Total realised', value: moneyShort(sum(byCashier, 'total')) },
//       { label: 'Top cashier', value: byCashier[0].cashier.split(' ')[1] || byCashier[0].cashier, hint: moneyShort(byCashier[0].total) },
//       { label: 'Cash share', value: `${((sum(byCashier, 'cash') / sum(byCashier, 'total')) * 100).toFixed(0)}%`, hint: 'Of net realised' },
//     ],
//     tableTitle: 'Consolidated funds realised by cashier',
//   }
// }

// export default function Tenderable({ leaf, moduleLabel, parentLabel }) {
//   const [tab, setTab] = useState('transactions')
//   const [sub, setSub] = useState('payable')

//   const view = tab === 'transactions'
//     ? (sub === 'payable' ? buildPayable() : buildReceipts())
//     : tab === 'wallet' ? buildWalletFunds() : buildGeneral()

//   const filters = [
//     { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
//     ...(tab === 'wallet'
//       ? [{ key: 'dealer', label: 'Dealer', type: 'select', options: dealerWallets }]
//       : [{ key: 'cashier', label: 'Cashier', type: 'select', options: cashiers }]),
//     ...(tab === 'transactions' && sub === 'receipts'
//       ? [{ key: 'channel', label: 'Channel', type: 'select', options: [{ value: 'cash', label: 'Cash' }, { value: 'pos', label: 'POS' }, { value: 'ftf', label: 'Fund transfer' }, { value: 'wallet', label: 'Wallet' }] }]
//       : []),
//     { key: 'from', label: 'Date from', type: 'date' },
//     { key: 'to', label: 'Date to', type: 'date' },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Tenderable'}
//       icon={leaf?.icon}
//       description="Track what each cashier has realised at any point in time, reconciled across every payment channel — fund transfer, cash, POS and dealer wallet — net of refunds."
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       filters={filters}
//       stats={view.stats}
//       columns={view.columns}
//       rows={view.rows}
//       totals={view.totals}
//       tableTitle={view.tableTitle}
//       tableActions={tab === 'transactions' ? <Segmented options={SUB_TABS} value={sub} onChange={setSub} size="sm" /> : null}
//       emptyTitle="No transactions match these filters"
//       emptyDescription="Widen the date range or clear the cashier filter, then generate again."
//       footnote="FTF is the fund-transfer amount realised; Wallet is value deducted from authorised dealers' wallets. Net realised is all channels less refunds, and is the figure each cashier is accountable for."
//     />
//   )
// }
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import CustomerApi from '../../api/CustomerApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import FactoryApi from '../../api/FactoryApi.js'

const accountApi = new AccountApi()
const customerApi = new CustomerApi()
const showroomApi = new ShowroomApi()
const factoryApi = new FactoryApi()

const PAGE_SIZE = 50

const TABS = [
  { value: 'transactions', label: 'Transactions', icon: 'receipt' },
  { value: 'wallet', label: 'Wallet Funds', icon: 'wallet' },
  { value: 'general', label: 'General Report', icon: 'chart-column' },
]

const SUB_TABS = [
  { value: 'payable', label: 'Payable' },
  { value: 'receipts', label: 'Receipt Track' },
]

// Enum → display. Backend sends SCREAMING_SNAKE_CASE.
const CHANNEL_LABEL = {
  CASH: 'Cash',
  POS: 'POS',
  FTF: 'Fund transfer',
  WALLET: 'Wallet',
  DEPOSIT: 'Deposit',
  BANK_TRANSFER: 'Bank transfer',
  CARD: 'Card',
}
const channelLabel = (v) =>
  CHANNEL_LABEL[String(v || '').toUpperCase()] || v || '—'

const STATUS_TONE = {
  ISSUED: 'success',
  VOIDED: 'danger',
  CONFIRMED: 'success',
  PENDING: 'warning',
  PENDING_CONFIRMATION: 'warning',
  DECLINED: 'danger',
  FAILED: 'danger',
  POSTED: 'success',
  REVERSED: 'neutral',
}
const statusTone = (s) =>
  STATUS_TONE[String(s || '').toUpperCase()] || 'neutral'
const statusLabel = (s) => {
  if (!s) return '—'
  return String(s)
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// Shorthand renderers
const moneyOrDash = (v) => (v ? money(v) : '—')
const countOrDash = (v) => (v ? fmt(v) : '—')

export default function Tenderable({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [tab, setTab] = useState('transactions')
  const [sub, setSub] = useState('payable')

  // filters (kept flat; only the relevant ones are sent per tab)
  const [locationId, setLocationId] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [page, setPage] = useState(0)

  // data
  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [generalTotals, setGeneralTotals] = useState(null)

  // lookups
  const [locations, setLocations] = useState([])
  const [dealers, setDealers] = useState([])

  // ── locations (factories + showrooms) ───────────────────
  useEffect(() => {
    let cancelled = false
    Promise.all([
      factoryApi.listFactories().catch(() => ({ data: [] })),
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch(() => ({ data: [] })),
    ]).then(([factoriesRes, showroomsRes]) => {
      if (cancelled) return
      const factoryOptions = (factoriesRes.data || []).map((f) => ({
        value: f.id,
        label: `${f.name} (factory)`,
      }))
      const showroomOptions = (showroomsRes.data || []).map((s) => ({
        value: s.id,
        label: `${s.label || s.name || s.code} (showroom)`,
      }))
      setLocations([...factoryOptions, ...showroomOptions])
    })
    return () => {
      cancelled = true
    }
  }, [])

  // ── dealers (AUTHORISED_DEALER customers) ───────────────
  useEffect(() => {
    let cancelled = false
    customerApi
      .listCustomers({
        type: ['AUTHORISED_DEALER'],
        page: 0,
        size: 200,
      })
      .then((res) => {
        if (cancelled) return
        const list = res.data?.items || []
        setDealers(
          list.map((d) => ({
            value: d.id,
            label: `${d.code} · ${d.name}`,
          }))
        )
      })
      .catch(() => {
        /* non-fatal */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── auto-select defaults ────────────────────────────────
  useEffect(() => {
    if (!locationId && locations.length) {
      setLocationId(locations[0].value)
    }
  }, [locations, locationId])

  useEffect(() => {
    if (!customerId && dealers.length) {
      setCustomerId(dealers[0].value)
    }
  }, [dealers, customerId])

  // ── reset page when the effective query changes ─────────
  useEffect(() => {
    setPage(0)
  }, [tab, sub, locationId, customerId, from, to])

  // ── load the right endpoint for the current tab ─────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (tab === 'transactions') {
        if (!locationId) {
          setRows([])
          setTotalPages(0)
          setTotalItems(0)
          return
        }
        const fn =
          sub === 'payable'
            ? accountApi.getTenderablePayable.bind(accountApi)
            : accountApi.getTenderableReceipt.bind(accountApi)
        const res = await fn({
          locationId,
          from: from || undefined,
          to: to || undefined,
          page,
          size: PAGE_SIZE,
        })
        const paged = res.data
        setRows(paged.items || [])
        setTotalPages(paged.totalPages || 0)
        setTotalItems(paged.totalItems || 0)
      } else if (tab === 'wallet') {
        if (!customerId) {
          setRows([])
          setTotalPages(0)
          setTotalItems(0)
          return
        }
        const res = await accountApi.getTenderableWalletFunds({
          customerId,
          from: from || undefined,
          to: to || undefined,
          page,
          size: PAGE_SIZE,
        })
        const paged = res.data
        setRows(paged.items || [])
        setTotalPages(paged.totalPages || 0)
        setTotalItems(paged.totalItems || 0)
      } else if (tab === 'general') {
        if (!locationId) {
          setRows([])
          setGeneralTotals(null)
          return
        }
        const res = await accountApi.getTenderableGeneralReport({
          locationId,
          from: from || undefined,
          to: to || undefined,
        })
        const d = res.data
        setRows(d.rows || [])
        setGeneralTotals(d.totals || null)
        setTotalPages(1)
        setTotalItems((d.rows || []).length)
      }
    } catch (e) {
      showToast('Could not load report', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [tab, sub, locationId, customerId, from, to, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  // ── handlers ────────────────────────────────────────────
  const handleGenerate = useCallback((vals) => {
    if ('locationId' in vals) setLocationId(vals.locationId || '')
    if ('customerId' in vals) setCustomerId(vals.customerId || '')
    if ('from' in vals) setFrom(vals.from || '')
    if ('to' in vals) setTo(vals.to || '')
  }, [])

  const handleTabChange = useCallback((t) => {
    setTab(t)
    setPage(0)
    if (t !== 'transactions') setSub('payable')
  }, [])

  const handleSubChange = useCallback((s) => {
    setSub(s)
    setPage(0)
  }, [])

  // ── filters (per tab) ───────────────────────────────────
  const filters = useMemo(() => {
    const dateFilters = [
      {
        key: 'from',
        label: 'Date from',
        type: 'date',
        defaultValue: from,
      },
      {
        key: 'to',
        label: 'Date to',
        type: 'date',
        defaultValue: to,
      },
    ]
    if (tab === 'wallet') {
      return [
        {
          key: 'customerId',
          label: 'Dealer',
          type: 'select',
          options: dealers,
          defaultValue: customerId,
        },
        ...dateFilters,
      ]
    }
    return [
      {
        key: 'locationId',
        label: 'Showroom / factory',
        type: 'select',
        options: locations,
        defaultValue: locationId,
      },
      ...dateFilters,
    ]
  }, [tab, dealers, locations, customerId, locationId, from, to])

  // ── view model (columns / totals / stats per tab) ───────
  const view = useMemo(() => {
    if (tab === 'transactions' && sub === 'payable') {
      const sum = (k) => rows.reduce((n, r) => n + (r[k] || 0), 0)
      return {
        columns: [
          {
            key: 'date',
            label: 'Date',
            width: 130,
            render: (r) => fmtDate(r.date),
          },
          {
            key: 'cashier',
            label: 'Cashier',
            width: 180,
            render: (r) => r.cashier?.name || '—',
          },
          {
            key: 'ftf',
            label: 'FTF',
            width: 140,
            align: 'right',
            mono: true,
            render: (r) => moneyOrDash(r.ftf),
          },
          {
            key: 'cash',
            label: 'Cash',
            width: 140,
            align: 'right',
            mono: true,
            render: (r) => moneyOrDash(r.cash),
          },
          {
            key: 'pos',
            label: 'POS',
            width: 140,
            align: 'right',
            mono: true,
            render: (r) => moneyOrDash(r.pos),
          },
          {
            key: 'wallet',
            label: 'Wallet',
            width: 140,
            align: 'right',
            mono: true,
            render: (r) => moneyOrDash(r.wallet),
          },
          {
            key: 'deposit',
            label: 'Deposit',
            width: 140,
            align: 'right',
            mono: true,
            render: (r) => moneyOrDash(r.deposit),
          },
          {
            key: 'refund',
            label: 'Refund',
            width: 140,
            align: 'right',
            mono: true,
            render: (r) =>
              r.refund ? (
                <span style={{ color: 'var(--danger)' }}>
                  {money(r.refund)}
                </span>
              ) : (
                '—'
              ),
          },
          {
            key: 'pendingConfirmation',
            label: 'Pending',
            width: 110,
            align: 'right',
            mono: true,
            render: (r) => countOrDash(r.pendingConfirmation),
          },
          {
            key: 'declined',
            label: 'Declined',
            width: 110,
            align: 'right',
            mono: true,
            render: (r) =>
              r.declined ? (
                <span style={{ color: 'var(--danger)' }}>
                  {fmt(r.declined)}
                </span>
              ) : (
                '—'
              ),
          },
          {
            key: 'total',
            label: 'Net realised',
            width: 170,
            align: 'right',
            mono: true,
            render: (r) => money(r.total || 0),
          },
        ],
        totals: {
          date: 'Total',
          ftf: money(sum('ftf')),
          cash: money(sum('cash')),
          pos: money(sum('pos')),
          wallet: money(sum('wallet')),
          deposit: money(sum('deposit')),
          refund: money(sum('refund')),
          total: money(sum('total')),
        },
        stats: [
          {
            label: 'Net realised',
            value: moneyShort(sum('total')),
            hint: 'This page',
          },
          {
            label: 'Cash collected',
            value: moneyShort(sum('cash')),
          },
          {
            label: 'Electronic (FTF + POS)',
            value: moneyShort(sum('ftf') + sum('pos')),
          },
          {
            label: 'Refunded',
            value: moneyShort(sum('refund')),
            tone: 'negative',
            hint: 'Deducted from realised',
          },
        ],
        tableTitle: 'Amount realised by cashier',
        emptyTitle: 'No payable data',
        emptyDescription:
          'Adjust the date range or select a different showroom.',
      }
    }

    if (tab === 'transactions' && sub === 'receipts') {
      const issuedRows = rows.filter(
        (r) => String(r.status || '').toUpperCase() === 'ISSUED'
      )
      const issuedAmt = issuedRows.reduce(
        (n, r) => n + (r.amount || 0),
        0
      )
      return {
        columns: [
          { key: 'ref', label: 'Receipt no.', width: 140, mono: true },
          {
            key: 'receivedAt',
            label: 'Date',
            width: 130,
            render: (r) => fmtDate(r.receivedAt),
          },
          {
            key: 'cashier',
            label: 'Cashier',
            width: 160,
            render: (r) => r.cashier?.name || '—',
          },
          {
            key: 'customer',
            label: 'Customer',
            width: 220,
            render: (r) => r.customer?.name || r.customerName || '—',
          },
          {
            key: 'channel',
            label: 'Channel',
            width: 150,
            render: (r) => (
              <Badge
                tone={/cash/i.test(r.channel || '') ? 'neutral' : 'brand'}
              >
                {channelLabel(r.channel)}
              </Badge>
            ),
          },
          {
            key: 'sourceRef',
            label: 'Source ref',
            width: 140,
            mono: true,
            render: (r) => r.sourceRef || '—',
          },
          {
            key: 'incomeCategory',
            label: 'Category',
            width: 170,
            render: (r) => r.incomeCategory || '—',
          },
          {
            key: 'amount',
            label: 'Amount',
            width: 150,
            align: 'right',
            mono: true,
            render: (r) => money(r.amount || 0),
          },
          {
            key: 'status',
            label: 'Status',
            width: 130,
            render: (r) => (
              <Badge tone={statusTone(r.status)}>
                {statusLabel(r.status)}
              </Badge>
            ),
          },
        ],
        totals: { ref: 'Total', amount: money(issuedAmt) },
        stats: [
          {
            label: 'Receipts issued',
            value: String(issuedRows.length),
            hint: 'This page',
          },
          { label: 'Value issued', value: moneyShort(issuedAmt) },
          {
            label: 'Voided',
            value: String(rows.length - issuedRows.length),
            tone:
              rows.length - issuedRows.length ? 'negative' : undefined,
          },
          {
            label: 'Cashiers active',
            value: String(
              new Set(
                rows.map((r) => r.cashier?.id).filter(Boolean)
              ).size
            ),
          },
        ],
        tableTitle: 'Receipt and invoice audit trail',
        emptyTitle: 'No receipts match these filters',
        emptyDescription:
          'Widen the date range or try a different showroom.',
      }
    }

    if (tab === 'wallet') {
      const confirmed = rows.filter(
        (r) => String(r.status || '').toUpperCase() === 'CONFIRMED'
      )
      const confirmedAmt = confirmed.reduce(
        (n, r) => n + (r.amount || 0),
        0
      )
      const totalAmt = rows.reduce(
        (n, r) => n + (r.amount || 0),
        0
      )
      return {
        columns: [
          { key: 'ref', label: 'Reference', width: 130, mono: true },
          {
            key: 'date',
            label: 'Date',
            width: 130,
            render: (r) => fmtDate(r.date),
          },
          {
            key: 'customer',
            label: 'Dealer',
            width: 220,
            render: (r) => r.customer?.name || r.dealer || '—',
          },
          {
            key: 'method',
            label: 'Funding method',
            width: 160,
            render: (r) => channelLabel(r.method),
          },
          {
            key: 'bank',
            label: 'Bank',
            width: 200,
            render: (r) => r.bank || '—',
          },
          {
            key: 'amount',
            label: 'Amount funded',
            width: 170,
            align: 'right',
            mono: true,
            render: (r) => money(r.amount || 0),
          },
          {
            key: 'confirmedBy',
            label: 'Confirmed by',
            width: 160,
            render: (r) => r.confirmedBy || '—',
          },
          {
            key: 'status',
            label: 'Status',
            width: 140,
            render: (r) => (
              <Badge tone={statusTone(r.status)}>
                {statusLabel(r.status)}
              </Badge>
            ),
          },
        ],
        totals: { ref: 'Total', amount: money(totalAmt) },
        stats: [
          {
            label: 'Fundings',
            value: String(rows.length),
            hint: 'This page',
          },
          {
            label: 'Value confirmed',
            value: moneyShort(confirmedAmt),
          },
          {
            label: 'Awaiting confirmation',
            value: String(rows.length - confirmed.length),
            tone:
              rows.length - confirmed.length ? 'warning' : undefined,
          },
          {
            label: 'Total funded',
            value: moneyShort(totalAmt),
          },
        ],
        tableTitle: 'Dealer wallet funding',
        emptyTitle: 'No wallet fundings',
        emptyDescription:
          'Choose a different dealer or widen the date range.',
      }
    }

    // general
    const totalNet =
      generalTotals?.total ??
      rows.reduce((n, r) => n + (r.total || 0), 0)
    const cashTotal =
      generalTotals?.cash ??
      rows.reduce((n, r) => n + (r.cash || 0), 0)
    const top = rows
      .slice()
      .sort((a, b) => (b.total || 0) - (a.total || 0))[0]

    return {
      columns: [
        {
          key: 'cashier',
          label: 'Cashier',
          width: 200,
          render: (r) => r.cashier?.name || '—',
        },
        {
          key: 'daysActive',
          label: 'Days active',
          width: 120,
          align: 'right',
          mono: true,
          render: (r) => fmt(r.daysActive || 0),
        },
        {
          key: 'ftf',
          label: 'FTF',
          width: 145,
          align: 'right',
          mono: true,
          render: (r) => money(r.ftf || 0),
        },
        {
          key: 'cash',
          label: 'Cash',
          width: 145,
          align: 'right',
          mono: true,
          render: (r) => money(r.cash || 0),
        },
        {
          key: 'pos',
          label: 'POS',
          width: 145,
          align: 'right',
          mono: true,
          render: (r) => money(r.pos || 0),
        },
        {
          key: 'wallet',
          label: 'Wallet',
          width: 145,
          align: 'right',
          mono: true,
          render: (r) => money(r.wallet || 0),
        },
        {
          key: 'deposit',
          label: 'Deposit',
          width: 145,
          align: 'right',
          mono: true,
          render: (r) => money(r.deposit || 0),
        },
        {
          key: 'refund',
          label: 'Refund',
          width: 140,
          align: 'right',
          mono: true,
          render: (r) =>
            r.refund ? (
              <span style={{ color: 'var(--danger)' }}>
                {money(r.refund)}
              </span>
            ) : (
              '—'
            ),
        },
        {
          key: 'total',
          label: 'Net realised',
          width: 170,
          align: 'right',
          mono: true,
          render: (r) => money(r.total || 0),
        },
      ],
      totals: generalTotals
        ? {
            cashier: 'Total',
            ftf: money(generalTotals.ftf || 0),
            cash: money(generalTotals.cash || 0),
            pos: money(generalTotals.pos || 0),
            wallet: money(generalTotals.wallet || 0),
            deposit: money(generalTotals.deposit || 0),
            refund: money(generalTotals.refund || 0),
            total: money(generalTotals.total || 0),
          }
        : null,
      stats: [
        {
          label: 'Cashiers reporting',
          value: String(rows.length),
        },
        {
          label: 'Total realised',
          value: moneyShort(totalNet),
        },
        {
          label: 'Top cashier',
          value: top?.cashier?.name || '—',
          hint: top ? moneyShort(top.total) : undefined,
        },
        {
          label: 'Cash share',
          value: totalNet
            ? `${((cashTotal / totalNet) * 100).toFixed(0)}%`
            : '—',
          hint: 'Of net realised',
        },
      ],
      tableTitle: 'Consolidated funds realised by cashier',
      emptyTitle: 'No general report data',
      emptyDescription:
        'Widen the date range or try a different showroom.',
    }
  }, [tab, sub, rows, generalTotals])

  // ── render ──────────────────────────────────────────────
  const paginated = tab !== 'general'

  return (
    <>
      {loading && <Loader overlay label="Loading report…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Tenderable'}
        icon={leaf?.icon}
        description="Track what each cashier has realised at any point in time, reconciled across every payment channel — fund transfer, cash, POS and dealer wallet — net of refunds."
        tabs={TABS}
        tab={tab}
        onTabChange={handleTabChange}
        onGenerate={handleGenerate}
        filters={filters}
        stats={view.stats}
        columns={view.columns}
        rows={rows}
        totals={view.totals}
        tableTitle={view.tableTitle}
        tableActions={
          tab === 'transactions' ? (
            <Segmented
              options={SUB_TABS}
              value={sub}
              onChange={handleSubChange}
              size="sm"
            />
          ) : null
        }
        {...(paginated
          ? {
              pagination: {
                page,
                pageCount: totalPages,
                pageSize: PAGE_SIZE,
                total: totalItems,
                onPage: setPage,
              },
            }
          : {})}
        emptyTitle={view.emptyTitle}
        emptyDescription={view.emptyDescription}
        footnote="FTF is the fund-transfer amount realised; Wallet is value deducted from authorised dealers' wallets. Net realised is all channels less refunds, and is the figure each cashier is accountable for."
      />
    </>
  )
}