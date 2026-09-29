import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { showrooms, storageAreas, showroomCardRows, showroomCardOpening } from '../sampleShowroom.js'
import { stockGroups, finishedProducts, withRunningBalance, summariseByDate } from '../sample.js'
import { fmt } from '../utils.js'

const CARD_TYPES = [
  { value: 'stock', label: 'Stock Card', icon: 'list' },
  { value: 'bin', label: 'Bin Card', icon: 'layers' },
]

const AREAS = [
  { value: 'all', label: 'All areas' },
  { value: 'shop', label: 'Shop floor' },
  { value: 'warehouse', label: 'Warehouse' },
]

/**
 * Serves both §5.2.4 leaves. `grouped` decides whether the card tracks a stock
 * group or a single ungrouped item; the Stock/Bin toggle and the shop/warehouse
 * split give the four card variants the PRD describes.
 */
export default function ShowroomCards({ leaf, moduleLabel, parentLabel, grouped = true }) {
  const [cardType, setCardType] = useState('stock')
  const [area, setArea] = useState('all')
  const isStock = cardType === 'stock'

  const base = isStock ? showroomCardRows : summariseByDate(showroomCardRows)
  const balanceKey = isStock ? 'qtyRemain' : 'balance'
  const rows = withRunningBalance(base, showroomCardOpening, balanceKey)

  const totalIn = showroomCardRows.reduce((n, r) => n + r.qtyIn, 0)
  const totalOut = showroomCardRows.reduce((n, r) => n + r.qtyOut, 0)
  const closing = showroomCardOpening + totalIn - totalOut

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: isStock ? 130 : 170 },
    ...(isStock ? [{ key: 'remark', label: 'Remark', width: 420 }] : []),
    { key: 'qtyIn', label: 'Qty in', width: isStock ? 120 : 150, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{fmt(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: isStock ? 120 : 150, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyOut)}</span> : '—') },
    { key: balanceKey, label: isStock ? 'Qty remain' : 'Balance', width: isStock ? 140 : 170, align: 'right', mono: true, render: (r) => fmt(r[balanceKey]) },
  ]

  return (
    <ReportShell
      wide={isStock}
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || (grouped ? 'Stock/Bin Card (Group)' : 'Stock/Bin Card (Non-Group)')}
      icon={leaf?.icon}
      description={grouped
        ? 'Stock activity for a grouped set of items at this showroom. Works like the factory stock cards, separated by operational area so shop-floor and warehouse movement are tracked distinctly.'
        : 'Stock activity for an individual, ungrouped item at this showroom. Works like the factory stock cards, separated by operational area so shop-floor and warehouse movement are tracked distinctly.'}
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        grouped
          ? { key: 'group', label: 'Stock group', type: 'select', options: stockGroups }
          : { key: 'item', label: 'Product', type: 'select', options: finishedProducts },
        { key: 'area', label: 'Operational area', type: 'select', options: storageAreas },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Opening balance', value: fmt(showroomCardOpening), hint: '01 Aug 2026' },
        { label: 'Total received', value: fmt(totalIn) },
        { label: 'Total issued', value: fmt(totalOut), tone: 'negative' },
        { label: 'Closing balance', value: fmt(closing), hint: '22 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ sn: 'Total', qtyIn: fmt(totalIn), qtyOut: fmt(totalOut), [balanceKey]: fmt(closing) }}
      tableTitle={isStock ? 'Movement detail' : 'Daily movement summary'}
      tableActions={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Segmented options={AREAS} value={area} onChange={setArea} size="sm" />
          <Segmented options={CARD_TYPES} value={cardType} onChange={setCardType} size="sm" />
        </div>
      }
      emptyTitle="No movement in the selected period"
      emptyDescription="Widen the date range or change the operational area, then generate again."
      footnote="Shop-floor and warehouse balances are tracked separately. Selecting all areas shows the combined position for this showroom."
    >
      <Panel title={grouped ? 'Group' : 'Item'} description={grouped
        ? 'Every transaction involving any member of this group posts to the card below as a single entry.'
        : 'This card covers one item only — grouped siblings are reported on the Group card.'}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label={grouped ? 'Group (type)' : 'Product'} value={grouped ? 'Citrus Drink' : 'ZF-101 · Citrus Drink 50cl'} />
            <MetaRow label="Brand" value="ZifCitrus" />
            <MetaRow label="Showroom" value="Showroom Ikeja" />
          </div>
          <div>
            <MetaRow label="Operational area" value={AREAS.find((a) => a.value === area)?.label} />
            <MetaRow label="Unit" value="Cartons" />
            <MetaRow label="Card type" value={isStock ? 'Stock Card' : 'Bin Card'} />
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">{grouped ? 'Group' : 'Non-Group'}</Badge>
          <Badge tone="neutral">{isStock ? 'Every transaction listed' : 'Summarised per date'}</Badge>
          {grouped && <Badge tone="neutral">Members: 50cl, 1L, 75cl</Badge>}
        </div>
      </Panel>
    </ReportShell>
  )
}
