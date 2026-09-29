import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { factories, finishedProducts, rawMaterials } from '../sample.js'
import { showrooms } from '../sampleShowroom.js'
import { stockMovementHistory } from '../sampleHistory.js'
import { fmt } from '../utils.js'

const SOURCE_TONE = {
  'Stock Refill': 'success', 'Production run': 'success', 'Receive Product': 'success',
  'Dealer return': 'success', 'Outsource receipt': 'success',
  'Stock Transfer': 'neutral', 'Showroom transfer': 'neutral', 'Customer waybill': 'neutral',
  'Factory trade': 'info', 'POS sale': 'brand', 'Quantity Adjustment': 'warning',
}

export default function StockMovementHistory({ leaf, moduleLabel, parentLabel }) {
  const rows = stockMovementHistory.map((m) => ({ ...m, signed: m.direction === 'In' ? m.qty : -m.qty }))

  const inQty = rows.filter((r) => r.direction === 'In').reduce((n, r) => n + r.qty, 0)
  const outQty = rows.filter((r) => r.direction === 'Out').reduce((n, r) => n + r.qty, 0)
  const sources = new Set(rows.map((r) => r.source))
  const adjustments = rows.filter((r) => r.source === 'Quantity Adjustment')

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 130, mono: true },
    { key: 'product', label: 'Product', width: 260 },
    { key: 'location', label: 'Location', width: 175 },
    {
      key: 'source', label: 'Transaction type', width: 190,
      render: (r) => <Badge tone={SOURCE_TONE[r.source] || 'neutral'}>{r.source}</Badge>,
    },
    {
      key: 'direction', label: 'Direction', width: 120,
      render: (r) => (
        <span style={{ font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-ui)', color: r.direction === 'In' ? 'var(--success)' : 'var(--danger)' }}>
          {r.direction}
        </span>
      ),
    },
    {
      key: 'signed', label: 'Quantity', width: 145, align: 'right', mono: true,
      render: (r) => (
        <span style={{ color: r.direction === 'In' ? 'var(--success)' : 'var(--danger)' }}>
          {r.direction === 'In' ? '+' : '−'}{fmt(r.qty)}
        </span>
      ),
    },
    { key: 'by', label: 'Recorded by', width: 160 },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Movement History'}
      icon={leaf?.icon}
      description="Every transaction that has changed a product's stock level, positively or negatively, across factories and showrooms — a long-range audit trail of inventory change."
      filters={[
        { key: 'product', label: 'Product', type: 'select', options: [...finishedProducts, ...rawMaterials] },
        { key: 'location', label: 'Location', type: 'select', options: [...factories, ...showrooms] },
        { key: 'source', label: 'Transaction type', type: 'select', options: [...sources].map((s) => ({ value: s, label: s })) },
        { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'in', label: 'In' }, { value: 'out', label: 'Out' }] },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Movements recorded', value: String(rows.length) },
        { label: 'Quantity in', value: fmt(inQty) },
        { label: 'Quantity out', value: fmt(outQty), tone: 'negative' },
        { label: 'Adjustments', value: String(adjustments.length), tone: adjustments.length ? 'warning' : undefined, hint: adjustments.length ? 'Manual corrections' : undefined },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Net movement', signed: `${inQty - outQty >= 0 ? '+' : '−'}${fmt(Math.abs(inQty - outQty))}` }}
      tableTitle="Inventory change history"
      emptyTitle="No movements match these filters"
      emptyDescription="Widen the date range or clear the transaction type filter, then generate again."
      footnote="Every entry traces to its originating transaction — refills, production runs, transfers, sales, returns, trades and manual adjustments — so any change in a stock level can be accounted for."
    />
  )
}
