import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { customers, distributorActivity, walkInActivity } from '../sampleOthers.js'
import { fmt, money, moneyShort } from '../utils.js'

/**
 * Serves §5.7.2 Distributors, §5.7.3 No Credit Customers and §5.7.4 Special
 * Customer. The PRD says the Special Customer report "follows the same structure
 * as the Distributors report", differing in that they draw against a deposit
 * held with the company rather than paying per transaction.
 */
const CONFIG = {
  distributors: {
    title: 'Customers/Distributors — Distributors',
    description: 'Complete overview of a dealer’s activity over a date range — products received, quantities supplied and how each transaction was paid, across cash, POS, fund transfer and wallet.',
    type: 'Authorised Dealer',
    tableTitle: 'Distributor activity',
  },
  nocredit: {
    title: 'Customers/Distributors — No Credit Customers',
    description: 'Comprehensive record of walk-in customers, who pay in full at the point of sale and hold no credit line with the company.',
    type: 'No Credit / Walk-in',
    tableTitle: 'Walk-in customer activity',
  },
  special: {
    title: 'Customers/Distributors — Special Customer',
    description: 'Contractors and project customers who place a substantial deposit with the company in advance and draw against it as goods are required. Structured like the Distributors report, with the deposit balance in place of payment channels.',
    type: 'Special Customer',
    tableTitle: 'Special customer activity',
  },
}

export default function CustomersComprehensive({ leaf, moduleLabel, parentLabel, kind = 'distributors' }) {
  const cfg = CONFIG[kind] || CONFIG.distributors
  const isWalkIn = kind === 'nocredit'
  const isSpecial = kind === 'special'

  const people = customers.filter((c) => c.type === cfg.type)
  const names = new Set(people.map((p) => p.name))

  const rows = isWalkIn
    ? walkInActivity
    : distributorActivity.filter((a) => names.has(a.customer))

  const value = rows.reduce((n, r) => n + (isWalkIn ? r.value : r.value), 0)
  const qty = rows.reduce((n, r) => n + (isWalkIn ? r.qty : r.qty), 0)
  const depositHeld = people.reduce((n, p) => n + p.deposit, 0)

  const walkInColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Receipt', width: 130, mono: true },
    { key: 'customer', label: 'Customer', width: 230 },
    { key: 'items', label: 'Items', width: 100, align: 'right', mono: true, render: (r) => fmt(r.items) },
    { key: 'qty', label: 'Units', width: 110, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    {
      key: 'method', label: 'Payment method', width: 165,
      render: (r) => <Badge tone={r.method === 'Cash' ? 'neutral' : 'brand'}>{r.method}</Badge>,
    },
    { key: 'cashier', label: 'Cashier', width: 160 },
    { key: 'value', label: 'Value', width: 170, align: 'right', mono: true, render: (r) => money(r.value) },
  ]

  const dealerColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Invoice', width: 125, mono: true },
    { key: 'customer', label: isSpecial ? 'Special customer' : 'Distributor', width: 230 },
    { key: 'product', label: 'Product received', width: 250 },
    { key: 'qty', label: 'Qty supplied', width: 135, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'value', label: 'Transaction value', width: 180, align: 'right', mono: true, render: (r) => money(r.value) },
    ...(isSpecial
      ? [{ key: 'deposit', label: 'Drawn from deposit', width: 190, align: 'right', mono: true, render: (r) => money(r.deposit || 0) }]
      : [
          { key: 'cash', label: 'Cash', width: 150, align: 'right', mono: true, render: (r) => (r.cash ? money(r.cash) : '—') },
          { key: 'pos', label: 'POS', width: 150, align: 'right', mono: true, render: (r) => (r.pos ? money(r.pos) : '—') },
          { key: 'transfer', label: 'Fund transfer', width: 165, align: 'right', mono: true, render: (r) => (r.transfer ? money(r.transfer) : '—') },
          { key: 'wallet', label: 'Wallet', width: 150, align: 'right', mono: true, render: (r) => (r.wallet ? money(r.wallet) : '—') },
        ]),
    {
      key: 'waybill', label: 'Waybill', width: 130, mono: true,
      render: (r) => (r.waybill === '—' ? <span style={{ color: 'var(--text-subtle)' }}>Pending</span> : r.waybill),
    },
  ]

  const columns = isWalkIn ? walkInColumns : dealerColumns

  const totals = isWalkIn
    ? { date: 'Total', qty: fmt(qty), value: money(value) }
    : isSpecial
      ? { date: 'Total', qty: fmt(qty), value: money(value), deposit: money(rows.reduce((n, r) => n + (r.deposit || 0), 0)) }
      : {
          date: 'Total', qty: fmt(qty), value: money(value),
          cash: money(rows.reduce((n, r) => n + r.cash, 0)),
          pos: money(rows.reduce((n, r) => n + r.pos, 0)),
          transfer: money(rows.reduce((n, r) => n + r.transfer, 0)),
          wallet: money(rows.reduce((n, r) => n + r.wallet, 0)),
        }

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || cfg.title}
      icon={leaf?.icon}
      description={cfg.description}
      filters={[
        ...(isWalkIn
          ? []
          : [{ key: 'customer', label: isSpecial ? 'Special customer' : 'Distributor', type: 'select', options: people.map((p) => ({ value: p.name, label: p.name })) }]),
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: isWalkIn ? 'Transactions' : `${isSpecial ? 'Special customers' : 'Distributors'} active`, value: String(isWalkIn ? rows.length : people.length) },
        { label: 'Units supplied', value: fmt(qty) },
        { label: 'Transaction value', value: moneyShort(value) },
        isSpecial
          ? { label: 'Deposits held', value: moneyShort(depositHeld), hint: 'Available to draw against' }
          : { label: 'Average transaction', value: money(value / rows.length) },
      ]}
      columns={columns}
      rows={rows}
      totals={totals}
      tableTitle={cfg.tableTitle}
      emptyTitle="No activity in this period"
      emptyDescription="Widen the date range or change the showroom filter, then generate again."
      footnote={isSpecial
        ? 'Special customers draw against a deposit lodged in advance rather than paying per transaction. Their remaining deposit is shown below and reduces as goods are supplied.'
        : isWalkIn
          ? 'Walk-in customers settle in full at the point of sale and hold no credit line. Returns credit a temporary wallet that is removed once its balance reaches zero.'
          : 'Payment columns show how each transaction was settled. A transaction may be split across several channels, so the columns together sum to the transaction value.'}
    >
      {isSpecial && (
        <Panel title="Deposits held" description="Funds lodged in advance and drawn down as goods are supplied.">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {people.map((p) => (
              <div key={p.code} style={{ padding: '14px 16px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{p.name}</div>
                <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                  {money(p.deposit)}
                </div>
                <div style={{ marginTop: 6, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                  {p.code} · {p.showroom} · since {p.since}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {!isWalkIn && !isSpecial && (
        <Panel title="Distributors in this report">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
            {people.map((p) => (
              <div key={p.code}>
                <MetaRow label={p.name} value={money(p.wallet)} mono />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
            Wallet balances shown. Purchases settled from a wallet debit these immediately.
          </div>
        </Panel>
      )}
    </ReportShell>
  )
}
