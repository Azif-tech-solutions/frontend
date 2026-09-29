import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { factories, finishedProducts, rawMaterials, stockKinds, stockKindOf, productCardRows, productCardOpening, withRunningBalance, summariseByDate } from '../sample.js'

const num = (n) => (n ? n.toLocaleString() : '—')

const MODES = [
  { value: 'stock', label: 'Stock Card', icon: 'list' },
  { value: 'bin', label: 'Bin Card', icon: 'layers' },
]

const filters = [
  { key: 'factory', label: 'Factory', type: 'select', options: factories },
  { key: 'itemType', label: 'Stock type', type: 'select', options: stockKinds.map(({ value, label }) => ({ value, label })) },
  { key: 'item', label: 'Product / material', type: 'select', options: [...finishedProducts, ...rawMaterials] },
  { key: 'from', label: 'Date from', type: 'date' },
  { key: 'to', label: 'Date to', type: 'date' },
]

// The item this card covers. One definition, read by the header badge, the
// table heading and the identity panel, so all three always agree.
const ITEM = {
  name: 'Citrus Drink 50cl',
  code: 'ZF-101',
  kind: 'finished',
  group: 'Citrus Drink',
  brand: 'ZifCitrus',
  factory: 'Factory A — Ikeja',
  unit: 'Cartons',
  reorder: '120',
  barcode: '6151100101012',
}

export default function StockBinCard({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('stock')
  const isStock = mode === 'stock'
  const kind = stockKindOf(ITEM.kind)

  const base = isStock ? productCardRows : summariseByDate(productCardRows)
  const rows = withRunningBalance(base, productCardOpening, isStock ? 'qtyRemain' : 'balance')

  const totalIn = productCardRows.reduce((n, r) => n + r.qtyIn, 0)
  const totalOut = productCardRows.reduce((n, r) => n + r.qtyOut, 0)
  const closing = productCardOpening + totalIn - totalOut

  const balanceKey = isStock ? 'qtyRemain' : 'balance'
  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: isStock ? 130 : 170 },
    ...(isStock ? [{ key: 'remark', label: 'Remark', width: 380 }] : []),
    { key: 'qtyIn', label: 'Qty in', width: isStock ? 110 : 150, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: isStock ? 110 : 150, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: balanceKey, label: isStock ? 'Qty remain' : 'Balance', width: isStock ? 130 : 170, align: 'right', mono: true, render: (r) => num(r[balanceKey]) },
  ]

  return (
    <ReportShell
      wide={isStock}
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock/Bin Card'}
      icon={leaf?.icon}
      meta={
        <>
          <Badge tone="brand" uppercase>{ITEM.code} · {ITEM.name}</Badge>
          <Badge tone={kind.tone}>{kind.label}</Badge>
        </>
      }
      description="Movement history for a single product or material. Works exactly like the group cards, except every product is treated as an entity on its own."
      filters={filters}
      stats={[
        { label: 'Opening balance', value: productCardOpening.toLocaleString(), hint: '01 Aug 2026' },
        { label: 'Total qty in', value: totalIn.toLocaleString() },
        { label: 'Total qty out', value: totalOut.toLocaleString(), tone: 'negative' },
        { label: 'Closing balance', value: closing.toLocaleString(), hint: '22 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ sn: 'Total', qtyIn: totalIn.toLocaleString(), qtyOut: totalOut.toLocaleString(), [balanceKey]: closing.toLocaleString() }}
      tableTitle={`${isStock ? 'Product activity' : 'Daily movement summary'} — ${ITEM.name}`}
      tableActions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
      emptyTitle="No activity for this item in the selected period"
      emptyDescription="Widen the date range or choose a different product, then generate again."
      footnote="Report data reflects the underlying transactional records at the moment of generation."
    >
      <Panel
        title={`Stock — ${ITEM.name}`}
        description="The card below covers this item only — its group siblings are reported separately on the GP cards."
        actions={<Badge tone={kind.tone}>{kind.label}</Badge>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Stock name" value={`${ITEM.code} · ${ITEM.name}`} />
            <MetaRow label="Stock type" value={kind.label} />
            <MetaRow label="Group" value={ITEM.group} />
          </div>
          <div>
            <MetaRow label="Brand" value={ITEM.brand} />
            <MetaRow label="Factory" value={ITEM.factory} />
            <MetaRow label="Unit" value={ITEM.unit} />
            <MetaRow label="Re-order level" value={ITEM.reorder} mono />
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge tone="success">Active</Badge>
          <Badge tone="neutral" uppercase>Barcode {ITEM.barcode}</Badge>
        </div>
      </Panel>

    </ReportShell>
  )
}
