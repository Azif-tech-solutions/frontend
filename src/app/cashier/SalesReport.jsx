import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms } from '../sampleShowroom.js'
import { cashiers } from '../sampleAccount.js'
import { VAT_RATE } from '../sample.js'
import { dailySales } from '../sampleCashier.js'
import { fmt, money, moneyShort } from '../utils.js'

export default function SalesReport({ leaf, moduleLabel, parentLabel }) {
  const rows = dailySales.map((d) => {
    const net = d.gross - d.discount
    return { ...d, net, vat: net * VAT_RATE, avgSale: net / d.transactions }
  })

  const gross = rows.reduce((n, r) => n + r.gross, 0)
  const discount = rows.reduce((n, r) => n + r.discount, 0)
  const net = rows.reduce((n, r) => n + r.net, 0)
  const vat = rows.reduce((n, r) => n + r.vat, 0)
  const units = rows.reduce((n, r) => n + r.units, 0)
  const transactions = rows.reduce((n, r) => n + r.transactions, 0)
  const best = rows.reduce((m, r) => (r.net > m.net ? r : m), rows[0])

  const columns = [
    { key: 'date', label: 'Date', width: 140 },
    { key: 'showroom', label: 'Showroom', width: 180 },
    { key: 'transactions', label: 'Transactions', width: 140, align: 'right', mono: true, render: (r) => fmt(r.transactions) },
    { key: 'units', label: 'Units sold', width: 130, align: 'right', mono: true, render: (r) => fmt(r.units) },
    { key: 'gross', label: 'Gross sales', width: 165, align: 'right', mono: true, render: (r) => money(r.gross) },
    {
      key: 'discount', label: 'Discount', width: 150, align: 'right', mono: true,
      render: (r) => (r.discount ? <span style={{ color: 'var(--danger)' }}>{money(r.discount)}</span> : '—'),
    },
    { key: 'net', label: 'Net sales', width: 175, align: 'right', mono: true, render: (r) => money(r.net) },
    { key: 'vat', label: 'VAT', width: 155, align: 'right', mono: true, render: (r) => money(r.vat) },
    { key: 'avgSale', label: 'Avg. transaction', width: 165, align: 'right', mono: true, render: (r) => money(r.avgSale) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Sales Report'}
      icon={leaf?.icon}
      description="Daily summary of sales activity — transactions, units moved and revenue generated per day, for monitoring performance over a chosen period."
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'cashier', label: 'Cashier', type: 'select', options: cashiers },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Net sales', value: moneyShort(net), delta: `${fmt(transactions)} transactions` },
        { label: 'Units sold', value: fmt(units) },
        { label: 'Average transaction', value: money(net / transactions) },
        { label: 'Best day', value: best.date.split(' ').slice(0, 2).join(' '), hint: moneyShort(best.net) },
      ]}
      columns={columns}
      rows={rows}
      totals={{
        date: 'Total',
        transactions: fmt(transactions),
        units: fmt(units),
        gross: money(gross),
        discount: money(discount),
        net: money(net),
        vat: money(vat),
      }}
      tableTitle="Daily sales summary"
      emptyTitle="No sales in this period"
      emptyDescription="Widen the date range or change the showroom, then generate again."
      footnote="Net sales are gross less discounts. VAT is calculated on net at the rate configured for the showroom, and reconciles to the Showroom VAT Report for the same period."
    />
  )
}
