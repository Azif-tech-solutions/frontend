import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms, storageAreas, showroomStock } from '../sampleShowroom.js'
import { fmt, money, moneyShort } from '../utils.js'

const SOURCE_TONE = { 'Finished Product': 'brand', Outsource: 'info', 'Direct entry': 'neutral' }

// Design scaffold — real builds derive this from the signed-in role.
const ROLES = [
  { value: 'staff', label: 'Showroom staff', icon: 'user-round' },
  { value: 'admin', label: 'Administrator', icon: 'shield-check' },
]

export default function ShowroomStockReport({ leaf, moduleLabel, parentLabel }) {
  const [role, setRole] = useState('staff')
  const canSeeCost = role === 'admin'

  const rows = showroomStock.map((s, i) => ({ ...s, ln: i + 1, totalCost: s.qty * s.unitCost, totalValue: s.qty * s.price }))
  const totalQty = rows.reduce((n, r) => n + r.qty, 0)
  const totalCost = rows.reduce((n, r) => n + r.totalCost, 0)
  const totalRetail = rows.reduce((n, r) => n + r.totalValue, 0)

  // The PRD requires cost columns to be hidden outright, not zeroed.
  const columns = [
    { key: 'ln', label: 'LN', width: 60, align: 'right', mono: true },
    { key: 'detail', label: 'Product description', width: 280 },
    { key: 'group', label: 'Group', width: 150 },
    {
      key: 'source', label: 'Source', width: 160,
      render: (r) => <Badge tone={SOURCE_TONE[r.source] || 'neutral'}>{r.source}</Badge>,
    },
    { key: 'area', label: 'Area', width: 130 },
    { key: 'qty', label: 'Quantity available', width: 160, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    ...(canSeeCost
      ? [
          { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
          { key: 'totalCost', label: 'Total stock value', width: 180, align: 'right', mono: true, render: (r) => money(r.totalCost) },
        ]
      : []),
    { key: 'price', label: 'Selling price', width: 150, align: 'right', mono: true, render: (r) => money(r.price) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Comprehensive Stock Report'}
      icon={leaf?.icon}
      description="Up-to-date view of every stock item held at the selected showroom, with quantities available and — for authorised personnel — unit costs and total stock value."
      headerActions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Preview as</span>
          <Segmented options={ROLES} value={role} onChange={setRole} size="sm" />
        </div>
      }
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'area', label: 'Operational area', type: 'select', options: storageAreas },
        { key: 'source', label: 'Source', type: 'select', options: [{ value: 'fp', label: 'Finished Product' }, { value: 'os', label: 'Outsource' }, { value: 'de', label: 'Direct entry' }] },
        { key: 'asOf', label: 'As at date', type: 'date' },
      ]}
      stats={[
        { label: 'Line items', value: String(rows.length) },
        { label: 'Total quantity', value: fmt(totalQty) },
        ...(canSeeCost
          ? [{ label: 'Total stock value', value: moneyShort(totalCost) }]
          : [{ label: 'Storage areas', value: String(new Set(rows.map((r) => r.area)).size) }]),
        { label: 'Retail value', value: moneyShort(totalRetail), hint: 'At current selling price' },
      ]}
      columns={columns}
      rows={rows}
      totals={canSeeCost
        ? { ln: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) }
        : { ln: 'Total', qty: fmt(totalQty) }}
      tableTitle="Live showroom stock"
      emptyTitle="No stock matches these filters"
      emptyDescription="Change the showroom or area filter and generate again."
      footnote={canSeeCost
        ? 'Quantities reflect live stock at the moment of generation, combining factory supplies, outsourced products and directly entered goods. Unit cost and stock value are restricted to administrative personnel.'
        : 'Quantities reflect live stock at the moment of generation, combining factory supplies, outsourced products and directly entered goods.'}
    />
  )
}
