import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms, outsourcePartners } from '../sampleShowroom.js'
import { outsourceRecords } from '../sampleOthers.js'
import { fmt, money, moneyShort } from '../utils.js'

const STATUS_TONE = { 'In stock': 'success', 'Sold out': 'neutral', Suspended: 'warning' }

export default function OutsourceStockReport({ leaf, moduleLabel, parentLabel }) {
  const rows = outsourceRecords.map((r) => ({
    ...r,
    remaining: r.qty - r.sold,
    cost: r.qty * r.unitCost,
    revenue: r.sold * r.price,
    margin: r.sold * (r.price - r.unitCost),
    sellThrough: (r.sold / r.qty) * 100,
  }))

  const cost = rows.reduce((n, r) => n + r.cost, 0)
  const revenue = rows.reduce((n, r) => n + r.revenue, 0)
  const margin = rows.reduce((n, r) => n + r.margin, 0)
  const unsold = rows.reduce((n, r) => n + r.remaining, 0)

  const columns = [
    { key: 'date', label: 'Received', width: 135 },
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'product', label: 'Product', width: 250 },
    { key: 'vendor', label: 'External vendor', width: 210 },
    { key: 'showroom', label: 'Showroom', width: 180 },
    { key: 'qty', label: 'Qty sourced', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'sold', label: 'Qty sold', width: 125, align: 'right', mono: true, render: (r) => fmt(r.sold) },
    {
      key: 'remaining', label: 'Remaining', width: 130, align: 'right', mono: true,
      render: (r) => (r.remaining ? fmt(r.remaining) : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'sellThrough', label: 'Sell-through', width: 145, align: 'right', mono: true,
      render: (r) => `${r.sellThrough.toFixed(0)}%`,
    },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'price', label: 'Selling price', width: 155, align: 'right', mono: true, render: (r) => money(r.price) },
    { key: 'margin', label: 'Margin realised', width: 180, align: 'right', mono: true, render: (r) => money(r.margin) },
    {
      key: 'status', label: 'Status', width: 140,
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Out-Source Stock Report'}
      icon={leaf?.icon}
      description="Goods the company sources from external vendors rather than manufacturing — what was received, how much has sold, and the margin realised on each line."
      filters={[
        { key: 'vendor', label: 'External vendor', type: 'select', options: outsourcePartners },
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'status', label: 'Status', type: 'select', options: Object.keys(STATUS_TONE).map((s) => ({ value: s, label: s })) },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Cost of goods sourced', value: moneyShort(cost) },
        { label: 'Revenue realised', value: moneyShort(revenue) },
        { label: 'Margin realised', value: moneyShort(margin), tone: 'positive', delta: `${((margin / revenue) * 100).toFixed(1)}% of revenue` },
        { label: 'Units unsold', value: fmt(unsold), hint: 'Still held in stock' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', qty: fmt(rows.reduce((n, r) => n + r.qty, 0)), sold: fmt(rows.reduce((n, r) => n + r.sold, 0)), remaining: fmt(unsold), margin: money(margin) }}
      tableTitle="Externally sourced goods"
      emptyTitle="No outsourced stock in this period"
      emptyDescription="Widen the date range or change the vendor filter, then generate again."
      footnote="Only company-registered outsourced products appear here. Sell-through shows how much of each consignment has moved; suspended lines are held back from sale and will show no further movement until resumed."
    />
  )
}
