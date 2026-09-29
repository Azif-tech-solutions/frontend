import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { cashiers, tenderablePayable, tenderableReceipts, walletFunding } from '../sampleAccount.js'
import { showrooms, dealerWallets } from '../sampleShowroom.js'
import { fmt, money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'transactions', label: 'Transactions', icon: 'receipt' },
  { value: 'wallet', label: 'Wallet Funds', icon: 'wallet' },
  { value: 'general', label: 'General Report', icon: 'chart-column' },
]

const SUB_TABS = [
  { value: 'payable', label: 'Payable' },
  { value: 'receipts', label: 'Receipt Track' },
]

const CHANNELS = ['ftf', 'cash', 'pos', 'wallet']
const sum = (rows, k) => rows.reduce((n, r) => n + r[k], 0)
/** Net realised per row: all channels less refunds. */
const net = (r) => CHANNELS.reduce((n, k) => n + r[k], 0) - r.refund

/** Sub-tab 1 — exact amount realised by each cashier, by date and channel. */
function buildPayable() {
  const rows = tenderablePayable.map((r) => ({ ...r, total: net(r) }))
  const totals = {
    date: 'Total',
    ftf: money(sum(rows, 'ftf')), cash: money(sum(rows, 'cash')), pos: money(sum(rows, 'pos')),
    wallet: money(sum(rows, 'wallet')), refund: money(sum(rows, 'refund')), total: money(sum(rows, 'total')),
  }
  return {
    columns: [
      { key: 'date', label: 'Date', width: 130 },
      { key: 'cashier', label: 'Cashier', width: 170 },
      { key: 'ftf', label: 'FTF', width: 150, align: 'right', mono: true, render: (r) => (r.ftf ? money(r.ftf) : '—') },
      { key: 'cash', label: 'Cash', width: 150, align: 'right', mono: true, render: (r) => (r.cash ? money(r.cash) : '—') },
      { key: 'pos', label: 'POS', width: 150, align: 'right', mono: true, render: (r) => (r.pos ? money(r.pos) : '—') },
      { key: 'wallet', label: 'Wallet', width: 150, align: 'right', mono: true, render: (r) => (r.wallet ? money(r.wallet) : '—') },
      {
        key: 'refund', label: 'Refund', width: 145, align: 'right', mono: true,
        render: (r) => (r.refund ? <span style={{ color: 'var(--danger)' }}>{money(r.refund)}</span> : '—'),
      },
      { key: 'total', label: 'Net realised', width: 175, align: 'right', mono: true, render: (r) => money(r.total) },
    ],
    rows,
    totals,
    stats: [
      { label: 'Net realised', value: moneyShort(sum(rows, 'total')) },
      { label: 'Cash collected', value: moneyShort(sum(rows, 'cash')) },
      { label: 'Electronic (FTF + POS)', value: moneyShort(sum(rows, 'ftf') + sum(rows, 'pos')) },
      { label: 'Refunded', value: moneyShort(sum(rows, 'refund')), tone: 'negative', hint: 'Deducted from realised' },
    ],
    tableTitle: 'Amount realised by cashier',
  }
}

/** Sub-tab 2 — every invoice or receipt issued, for a complete audit trail. */
function buildReceipts() {
  const rows = tenderableReceipts
  const issued = rows.filter((r) => r.status === 'Issued')
  return {
    columns: [
      { key: 'receipt', label: 'Receipt no.', width: 140, mono: true },
      { key: 'date', label: 'Date', width: 130 },
      { key: 'cashier', label: 'Cashier', width: 170 },
      { key: 'customer', label: 'Customer', width: 250 },
      {
        key: 'channel', label: 'Channel', width: 160,
        render: (r) => <Badge tone={r.channel === 'Cash' ? 'neutral' : 'brand'}>{r.channel}</Badge>,
      },
      { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
      {
        key: 'status', label: 'Status', width: 130,
        render: (r) => <Badge tone={r.status === 'Issued' ? 'success' : 'danger'}>{r.status}</Badge>,
      },
    ],
    rows,
    totals: { receipt: 'Total', amount: money(issued.reduce((n, r) => n + r.amount, 0)) },
    stats: [
      { label: 'Receipts issued', value: String(issued.length) },
      { label: 'Value issued', value: moneyShort(issued.reduce((n, r) => n + r.amount, 0)) },
      { label: 'Voided', value: String(rows.length - issued.length), tone: rows.length - issued.length ? 'negative' : undefined },
      { label: 'Cashiers active', value: String(new Set(rows.map((r) => r.cashier)).size) },
    ],
    tableTitle: 'Receipt and invoice audit trail',
  }
}

/** Tab 2 — how dealers' wallets were funded. */
function buildWalletFunds() {
  const rows = walletFunding
  const confirmed = rows.filter((r) => r.status === 'Confirmed')
  return {
    columns: [
      { key: 'ref', label: 'Reference', width: 120, mono: true },
      { key: 'date', label: 'Date', width: 130 },
      { key: 'dealer', label: 'Dealer', width: 250 },
      { key: 'method', label: 'Funding method', width: 170 },
      { key: 'bank', label: 'Bank', width: 200 },
      { key: 'amount', label: 'Amount funded', width: 175, align: 'right', mono: true, render: (r) => money(r.amount) },
      { key: 'confirmedBy', label: 'Confirmed by', width: 160 },
      {
        key: 'status', label: 'Status', width: 190,
        render: (r) => <Badge tone={r.status === 'Confirmed' ? 'success' : 'warning'}>{r.status}</Badge>,
      },
    ],
    rows,
    totals: { ref: 'Total', amount: money(confirmed.reduce((n, r) => n + r.amount, 0)) },
    stats: [
      { label: 'Wallets funded', value: String(new Set(rows.map((r) => r.dealer)).size) },
      { label: 'Value confirmed', value: moneyShort(confirmed.reduce((n, r) => n + r.amount, 0)) },
      { label: 'Awaiting confirmation', value: String(rows.length - confirmed.length), tone: rows.length - confirmed.length ? 'warning' : undefined },
      { label: 'Total wallet balances', value: moneyShort(dealerWallets.reduce((n, d) => n + d.balance, 0)) },
    ],
    tableTitle: 'Dealer wallet funding',
  }
}

/** Tab 3 — funds realised per cashier, consolidated across channels and dates. */
function buildGeneral() {
  const byCashier = Object.values(
    tenderablePayable.reduce((acc, r) => {
      acc[r.cashier] ||= { cashier: r.cashier, ftf: 0, cash: 0, pos: 0, wallet: 0, refund: 0, days: new Set() }
      CHANNELS.forEach((k) => { acc[r.cashier][k] += r[k] })
      acc[r.cashier].refund += r.refund
      acc[r.cashier].days.add(r.date)
      return acc
    }, {})
  ).map((c) => ({ ...c, days: c.days.size, total: CHANNELS.reduce((n, k) => n + c[k], 0) - c.refund }))
    .sort((a, b) => b.total - a.total)

  return {
    columns: [
      { key: 'cashier', label: 'Cashier', width: 190 },
      { key: 'days', label: 'Days active', width: 130, align: 'right', mono: true, render: (r) => fmt(r.days) },
      { key: 'ftf', label: 'FTF', width: 155, align: 'right', mono: true, render: (r) => money(r.ftf) },
      { key: 'cash', label: 'Cash', width: 155, align: 'right', mono: true, render: (r) => money(r.cash) },
      { key: 'pos', label: 'POS', width: 155, align: 'right', mono: true, render: (r) => money(r.pos) },
      { key: 'wallet', label: 'Wallet', width: 155, align: 'right', mono: true, render: (r) => money(r.wallet) },
      {
        key: 'refund', label: 'Refund', width: 145, align: 'right', mono: true,
        render: (r) => (r.refund ? <span style={{ color: 'var(--danger)' }}>{money(r.refund)}</span> : '—'),
      },
      { key: 'total', label: 'Net realised', width: 180, align: 'right', mono: true, render: (r) => money(r.total) },
    ],
    rows: byCashier,
    totals: {
      cashier: 'Total',
      ftf: money(sum(byCashier, 'ftf')), cash: money(sum(byCashier, 'cash')), pos: money(sum(byCashier, 'pos')),
      wallet: money(sum(byCashier, 'wallet')), refund: money(sum(byCashier, 'refund')), total: money(sum(byCashier, 'total')),
    },
    stats: [
      { label: 'Cashiers reporting', value: String(byCashier.length) },
      { label: 'Total realised', value: moneyShort(sum(byCashier, 'total')) },
      { label: 'Top cashier', value: byCashier[0].cashier.split(' ')[1] || byCashier[0].cashier, hint: moneyShort(byCashier[0].total) },
      { label: 'Cash share', value: `${((sum(byCashier, 'cash') / sum(byCashier, 'total')) * 100).toFixed(0)}%`, hint: 'Of net realised' },
    ],
    tableTitle: 'Consolidated funds realised by cashier',
  }
}

export default function Tenderable({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('transactions')
  const [sub, setSub] = useState('payable')

  const view = tab === 'transactions'
    ? (sub === 'payable' ? buildPayable() : buildReceipts())
    : tab === 'wallet' ? buildWalletFunds() : buildGeneral()

  const filters = [
    { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
    ...(tab === 'wallet'
      ? [{ key: 'dealer', label: 'Dealer', type: 'select', options: dealerWallets }]
      : [{ key: 'cashier', label: 'Cashier', type: 'select', options: cashiers }]),
    ...(tab === 'transactions' && sub === 'receipts'
      ? [{ key: 'channel', label: 'Channel', type: 'select', options: [{ value: 'cash', label: 'Cash' }, { value: 'pos', label: 'POS' }, { value: 'ftf', label: 'Fund transfer' }, { value: 'wallet', label: 'Wallet' }] }]
      : []),
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Tenderable'}
      icon={leaf?.icon}
      description="Track what each cashier has realised at any point in time, reconciled across every payment channel — fund transfer, cash, POS and dealer wallet — net of refunds."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      filters={filters}
      stats={view.stats}
      columns={view.columns}
      rows={view.rows}
      totals={view.totals}
      tableTitle={view.tableTitle}
      tableActions={tab === 'transactions' ? <Segmented options={SUB_TABS} value={sub} onChange={setSub} size="sm" /> : null}
      emptyTitle="No transactions match these filters"
      emptyDescription="Widen the date range or clear the cashier filter, then generate again."
      footnote="FTF is the fund-transfer amount realised; Wallet is value deducted from authorised dealers' wallets. Net realised is all channels less refunds, and is the figure each cashier is accountable for."
    />
  )
}
