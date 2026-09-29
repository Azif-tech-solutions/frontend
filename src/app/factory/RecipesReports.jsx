import { useState } from 'react'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { factories, registeredRecipes, recipeProductionRuns, recipeStockCardRows, recipeStockOpening, withRunningBalance } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const VIEWS = [
  { value: 'production', label: 'Production report', icon: 'list' },
  { value: 'stockcard', label: 'Stock card', icon: 'layers' },
]

const recipeOptions = registeredRecipes.map((r) => ({ value: r.code, label: `${r.code} · ${r.name}` }))

/** Internally produced items with the raw materials each run consumed. */
function buildProductionView() {
  const rows = recipeProductionRuns.map((r) => ({ ...r, totalCost: r.qty * r.unitCost }))
  const totalQty = rows.reduce((n, r) => n + r.qty, 0)
  const totalCost = rows.reduce((n, r) => n + r.totalCost, 0)

  return {
    columns: [
      { key: 'date', label: 'Production date', width: 140 },
      { key: 'batch', label: 'Batch no.', width: 115, mono: true },
      { key: 'recipe', label: 'Recipe produced', width: 250 },
      { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
      { key: 'unit', label: 'Unit', width: 110 },
      { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
      { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => money(r.totalCost) },
      { key: 'materials', label: 'Raw materials used', width: 340 },
    ],
    rows,
    totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
    stats: [
      { label: 'Production cycles', value: String(rows.length) },
      { label: 'Total produced', value: fmt(totalQty) },
      { label: 'Total production cost', value: moneyShort(totalCost) },
      { label: 'Recipes covered', value: String(new Set(rows.map((r) => r.recipe)).size) },
    ],
    tableTitle: 'Internally produced items',
    emptyTitle: 'No in-house production in this period',
  }
}

/** How an in-house recipe is produced and drawn down over time. */
function buildStockCardView() {
  const rows = withRunningBalance(recipeStockCardRows, recipeStockOpening, 'balance')
  const totalIn = recipeStockCardRows.reduce((n, r) => n + r.qtyIn, 0)
  const totalOut = recipeStockCardRows.reduce((n, r) => n + r.qtyOut, 0)
  const closing = recipeStockOpening + totalIn - totalOut

  return {
    columns: [
      { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
      { key: 'date', label: 'Date', width: 130 },
      { key: 'remark', label: 'Remark', width: 420 },
      { key: 'qtyIn', label: 'Qty in', width: 120, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{fmt(r.qtyIn)}</span> : '—') },
      { key: 'qtyOut', label: 'Qty out', width: 120, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyOut)}</span> : '—') },
      { key: 'balance', label: 'Balance', width: 140, align: 'right', mono: true, render: (r) => fmt(r.balance) },
    ],
    rows,
    totals: { sn: 'Total', qtyIn: fmt(totalIn), qtyOut: fmt(totalOut), balance: fmt(closing) },
    stats: [
      { label: 'Opening balance', value: fmt(recipeStockOpening), hint: '01 Aug 2026' },
      { label: 'Produced in period', value: fmt(totalIn) },
      { label: 'Consumed in period', value: fmt(totalOut), tone: 'negative' },
      { label: 'Closing balance', value: fmt(closing), hint: '23 Aug 2026' },
    ],
    tableTitle: 'Recipe utilisation over time',
    emptyTitle: 'No movement for this recipe in the selected period',
  }
}

export default function RecipesReports({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('production')
  const isProduction = view === 'production'
  const data = isProduction ? buildProductionView() : buildStockCardView()

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'In-House Recipes — Reports'}
      icon={leaf?.icon}
      description="Internally produced items and the raw materials consumed in their production, with a stock card view tracking how each in-house recipe is utilised over time."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'recipe', label: 'Recipe', type: 'select', options: recipeOptions },
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
      emptyDescription="Widen the date range or choose a different recipe, then generate again."
      footnote="Cost columns are visible only to Administrators and Management. Quantities reflect the underlying records at the moment of generation."
    />
  )
}
