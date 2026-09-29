import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { factories, finishedProducts, rawMaterials, productionRuns, suppliedRuns, rawMaterialMovement } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'finished', label: 'Finished products', icon: 'package' },
  { value: 'raw', label: 'Raw materials', icon: 'box' },
]

const SUB_TABS = [
  { value: 'production', label: 'Finished Product Report' },
  { value: 'supplied', label: 'Supplied Report' },
]

/** Sub-tab 1 — daily production activity and the raw materials each run consumed. */
function buildProductionView() {
  const rows = productionRuns.map((r) => ({ ...r, totalCost: r.qty * r.unitCost }))
  const totalQty = rows.reduce((n, r) => n + r.qty, 0)
  const totalCost = rows.reduce((n, r) => n + r.totalCost, 0)

  return {
    columns: [
      { key: 'date', label: 'Production date', width: 140 },
      { key: 'batch', label: 'Batch no.', width: 110, mono: true },
      { key: 'product', label: 'Product description', width: 240 },
      { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
      { key: 'unitCost', label: <RestrictedLabel>Unit landing cost</RestrictedLabel>, width: 165, align: 'right', mono: true, render: (r) => money(r.unitCost) },
      { key: 'totalCost', label: <RestrictedLabel>Total landing cost</RestrictedLabel>, width: 175, align: 'right', mono: true, render: (r) => money(r.totalCost) },
      { key: 'materials', label: 'Raw materials used', width: 380 },
    ],
    rows,
    totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
    stats: [
      { label: 'Production runs', value: String(rows.length) },
      { label: 'Total produced', value: fmt(totalQty) },
      { label: 'Total landing cost', value: moneyShort(totalCost) },
      { label: 'Products covered', value: String(new Set(rows.map((r) => r.product)).size) },
    ],
    tableTitle: 'Daily production activity',
  }
}

/** Sub-tab 2 — distribution to showrooms and authorised distributors. */
function buildSuppliedView() {
  const rows = suppliedRuns
  const totalSupplied = rows.reduce((n, r) => n + r.qtySupplied, 0)
  const totalReceived = rows.reduce((n, r) => n + r.qtyReceived, 0)
  const totalRejected = rows.reduce((n, r) => n + r.qtyRejected, 0)

  return {
    columns: [
      { key: 'waybill', label: 'Waybill no.', width: 120, mono: true },
      { key: 'driver', label: 'Driver name', width: 150 },
      { key: 'destination', label: 'Destination', width: 190 },
      { key: 'supplied', label: 'Supplied date', width: 135 },
      {
        key: 'received', label: 'Received date', width: 140,
        render: (r) => (r.received === '—' ? <Badge tone="warning">In transit</Badge> : r.received),
      },
      { key: 'product', label: 'Product description', width: 240 },
      { key: 'qtySupplied', label: 'Qty supplied', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qtySupplied) },
      { key: 'qtyReceived', label: 'Qty received', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qtyReceived) },
      {
        key: 'qtyRejected', label: 'Qty rejected', width: 130, align: 'right', mono: true,
        render: (r) => (r.qtyRejected ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyRejected)}</span> : '—'),
      },
      { key: 'price', label: 'Authorised selling price', width: 190, align: 'right', mono: true, render: (r) => money(r.price) },
    ],
    rows,
    totals: { waybill: 'Total', qtySupplied: fmt(totalSupplied), qtyReceived: fmt(totalReceived), qtyRejected: fmt(totalRejected) },
    stats: [
      { label: 'Waybills', value: String(rows.length) },
      { label: 'Qty supplied', value: fmt(totalSupplied) },
      { label: 'Qty received', value: fmt(totalReceived) },
      { label: 'Qty rejected', value: fmt(totalRejected), tone: 'negative', delta: totalRejected ? 'needs review' : undefined },
    ],
    tableTitle: 'Distribution to showrooms and distributors',
  }
}

/** Raw Materials tab — consumption, balance and daily replenishment. */
function buildRawView() {
  const rows = rawMaterialMovement.map((r) => ({
    ...r,
    costUsed: r.used * r.unitCost,
    costRemaining: r.remaining * r.unitCost,
  }))
  const costUsed = rows.reduce((n, r) => n + r.costUsed, 0)
  const costRemaining = rows.reduce((n, r) => n + r.costRemaining, 0)

  return {
    columns: [
      { key: 'material', label: 'Raw material', width: 250 },
      { key: 'openingDate', label: 'Opening date', width: 135 },
      { key: 'opening', label: 'Opening qty', width: 130, align: 'right', mono: true, render: (r) => fmt(r.opening) },
      { key: 'used', label: 'Qty used', width: 120, align: 'right', mono: true, render: (r) => fmt(r.used) },
      { key: 'costUsed', label: <RestrictedLabel>Cost of materials used</RestrictedLabel>, width: 200, align: 'right', mono: true, render: (r) => money(r.costUsed) },
      { key: 'remaining', label: 'Remaining qty', width: 140, align: 'right', mono: true, render: (r) => fmt(r.remaining) },
      { key: 'costRemaining', label: <RestrictedLabel>Cost of remaining</RestrictedLabel>, width: 180, align: 'right', mono: true, render: (r) => money(r.costRemaining) },
      {
        key: 'arrivals', label: 'Daily arrivals', width: 130, align: 'right', mono: true,
        render: (r) => (r.arrivals ? <span style={{ color: 'var(--success)' }}>{fmt(r.arrivals)}</span> : '—'),
      },
    ],
    rows,
    totals: { material: 'Total', costUsed: money(costUsed), costRemaining: money(costRemaining) },
    stats: [
      { label: 'Materials tracked', value: String(rows.length) },
      { label: 'Cost of materials used', value: moneyShort(costUsed) },
      { label: 'Value remaining', value: moneyShort(costRemaining) },
      { label: 'Replenished this period', value: String(rows.filter((r) => r.arrivals).length) },
    ],
    tableTitle: 'Raw material usage and movement',
  }
}

export default function StockMovementReport({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('finished')
  const [sub, setSub] = useState('production')

  const production = buildProductionView()
  const supplied = buildSuppliedView()
  const raw = buildRawView()

  const isFinished = tab === 'finished'
  const view = isFinished ? (sub === 'production' ? production : supplied) : raw

  const filters = [
    { key: 'factory', label: 'Factory', type: 'select', options: factories },
    isFinished
      ? { key: 'product', label: 'Product', type: 'select', options: finishedProducts }
      : { key: 'material', label: 'Raw material', type: 'select', options: rawMaterials },
    ...(isFinished && sub === 'supplied'
      ? [{ key: 'destination', label: 'Destination', type: 'select', options: [{ value: 'ikeja', label: 'Showroom Ikeja' }, { value: 'lekki', label: 'Showroom Lekki' }, { value: 'abuja', label: 'Showroom Abuja' }, { value: 'dealer', label: 'Dealers' }] }]
      : []),
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Movement Report'}
      icon={leaf?.icon}
      description="Production activity, stock distribution, raw material usage and inventory movement across the factory."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      filters={filters}
      stats={view.stats}
      columns={view.columns}
      rows={view.rows}
      totals={view.totals}
      tableTitle={view.tableTitle}
      tableActions={isFinished ? <Segmented options={SUB_TABS} value={sub} onChange={setSub} size="sm" /> : null}
      emptyTitle="No movement matches these filters"
      emptyDescription="Widen the date range or change the factory, then generate again."
      footnote="Landing cost figures are visible only to Administrators and Management. Every completed transfer generates a waybill with a unique reference number."
    />
  )
}
