import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { factories, categories, stockGroups, comprehensivePart1, comprehensivePart2 } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'part1', label: 'Part 1 — All stock', icon: 'layers' },
  { value: 'part2', label: 'Part 2 — Finished products by group', icon: 'package' },
]

export default function ComprehensiveStockReport({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('part1')
  const isPart1 = tab === 'part1'
  const source = isPart1 ? comprehensivePart1 : comprehensivePart2

  const rows = source.map((r, i) => ({ ...r, ln: i + 1, totalCost: r.unitCost * r.qtyLeft }))
  const totalQty = rows.reduce((n, r) => n + r.qtyLeft, 0)
  const totalValue = rows.reduce((n, r) => n + r.totalCost, 0)

  const columns = [
    { key: 'ln', label: 'LN', width: 60, align: 'right', mono: true },
    isPart1
      ? {
          key: 'category', label: 'Category', width: 160,
          render: (r) => <Badge tone={r.category === 'Finished Product' ? 'brand' : 'neutral'}>{r.category}</Badge>,
        }
      : { key: 'group', label: 'Group', width: 160 },
    { key: 'detail', label: 'Stock detail', width: 280 },
    { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'qtyLeft', label: 'Quantity left', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qtyLeft) },
    { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => money(r.totalCost) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Comprehensive Stock Report'}
      icon={leaf?.icon}
      description="Live stock position across factories, showing availability, quantity remaining and stock value for finished products and raw materials."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        ...(isPart1
          ? [{ key: 'category', label: 'Category', type: 'select', options: [{ value: 'fp', label: 'Finished Product' }, { value: 'rm', label: 'Raw Material' }] }]
          : [{ key: 'group', label: 'Group', type: 'select', options: stockGroups }]),
        { key: 'productCategory', label: 'Product category', type: 'select', options: categories },
        { key: 'asOf', label: 'As at date', type: 'date' },
      ]}
      stats={[
        { label: 'Line items', value: String(rows.length) },
        { label: 'Total quantity', value: fmt(totalQty) },
        { label: 'Total stock value', value: moneyShort(totalValue) },
        {
          label: isPart1 ? 'Categories' : 'Groups',
          value: String(new Set(rows.map((r) => (isPart1 ? r.category : r.group))).size),
        },
      ]}
      columns={columns}
      rows={rows}
      totals={{ ln: 'Total', qtyLeft: fmt(totalQty), totalCost: money(totalValue) }}
      tableTitle={isPart1 ? 'Finished products and raw materials' : 'Finished products by group'}
      emptyTitle="No stock matches these filters"
      emptyDescription="Adjust the factory or category filters and generate again."
      footnote="Unit cost and total cost are landing-cost figures, visible only to Administrators and Management. Quantities reflect live stock at the moment of generation."
    />
  )
}
