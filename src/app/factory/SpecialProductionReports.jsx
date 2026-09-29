import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { factories, specialClients, specialProducts, specialProductionRuns, specialStockCardRows, specialStockOpening, withRunningBalance } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const VIEWS = [
  { value: 'production', label: 'Production records', icon: 'list' },
  { value: 'stockcard', label: 'Stock card', icon: 'layers' },
]

const STATUS_TONE = { Delivered: 'success', 'In production': 'info', 'Awaiting dispatch': 'warning' }

/** Special production activity, with the materials each customised run consumed. */
function buildProductionView() {
  const rows = specialProductionRuns.map((r) => ({
    ...r,
    totalCost: r.qty * r.unitCost,
    margin: (r.price - r.unitCost) * r.qty,
  }))
  const totalQty = rows.reduce((n, r) => n + r.qty, 0)
  const totalCost = rows.reduce((n, r) => n + r.totalCost, 0)
  const totalMargin = rows.reduce((n, r) => n + r.margin, 0)

  return {
    columns: [
      { key: 'date', label: 'Production date', width: 140 },
      { key: 'order', label: 'Order ref.', width: 115, mono: true },
      { key: 'batch', label: 'Batch no.', width: 115, mono: true },
      { key: 'client', label: 'Special client', width: 220 },
      { key: 'product', label: 'Special product', width: 250 },
      { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
      { key: 'unit', label: 'Unit', width: 100 },
      { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 145, align: 'right', mono: true, render: (r) => money(r.unitCost) },
      { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => money(r.totalCost) },
      {
        key: 'status', label: 'Status', width: 150,
        render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge>,
      },
      { key: 'materials', label: 'Materials used', width: 340 },
    ],
    rows,
    totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
    stats: [
      { label: 'Special orders', value: String(rows.length) },
      { label: 'Total produced', value: fmt(totalQty) },
      { label: 'Total production cost', value: moneyShort(totalCost) },
      { label: 'Clients served', value: String(new Set(rows.map((r) => r.client)).size), hint: `${moneyShort(totalMargin)} gross margin` },
    ],
    tableTitle: 'Special production activity',
    emptyTitle: 'No special production in this period',
  }
}

/** Movement history for a special product, mirroring the normal stock card. */
function buildStockCardView() {
  const rows = withRunningBalance(specialStockCardRows, specialStockOpening, 'balance')
  const totalIn = specialStockCardRows.reduce((n, r) => n + r.qtyIn, 0)
  const totalOut = specialStockCardRows.reduce((n, r) => n + r.qtyOut, 0)
  const closing = specialStockOpening + totalIn - totalOut

  return {
    columns: [
      { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
      { key: 'date', label: 'Date', width: 130 },
      { key: 'remark', label: 'Remark', width: 440 },
      { key: 'qtyIn', label: 'Qty in', width: 120, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{fmt(r.qtyIn)}</span> : '—') },
      { key: 'qtyOut', label: 'Qty out', width: 120, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyOut)}</span> : '—') },
      { key: 'balance', label: 'Balance', width: 140, align: 'right', mono: true, render: (r) => fmt(r.balance) },
    ],
    rows,
    totals: { sn: 'Total', qtyIn: fmt(totalIn), qtyOut: fmt(totalOut), balance: fmt(closing) },
    stats: [
      { label: 'Opening balance', value: fmt(specialStockOpening), hint: 'Made to order' },
      { label: 'Produced in period', value: fmt(totalIn) },
      { label: 'Dispatched / withdrawn', value: fmt(totalOut), tone: 'negative' },
      { label: 'Closing balance', value: fmt(closing), hint: 'Awaiting dispatch' },
    ],
    tableTitle: 'Special product movement',
    emptyTitle: 'No movement for this special product',
  }
}

export default function SpecialProductionReports({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('production')
  const isProduction = view === 'production'
  const data = isProduction ? buildProductionView() : buildStockCardView()

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Special Production — Reports'}
      icon={leaf?.icon}
      description="Production and movement history for special finished products, including production records and material usage for every customised order."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'client', label: 'Special client', type: 'select', options: specialClients },
        { key: 'product', label: 'Special product', type: 'select', options: specialProducts },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={data.stats}
      columns={data.columns}
      rows={data.rows}
      totals={data.totals}
      tableTitle={data.tableTitle}
      tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
      emptyTitle={data.emptyTitle}
      emptyDescription="Widen the date range or change the client filter, then generate again."
      footnote="Cost columns are visible only to Administrators and Management. Special production is tracked separately from regular factory production."
    />
  )
}
