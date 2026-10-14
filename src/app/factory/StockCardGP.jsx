import { useState } from 'react'
import { ReportShell } from '../shells/ReportShell.jsx'
import { CardIdentity, GroupMembers } from './cardParts.jsx'
import { stockKinds } from '../sample.js'
// import { cardFilters } from './cardConfig.js'
// import userSort from '../utils/userSort.js'
import { useStore } from '../store.jsx'
import { stockGroups, stockCardRows, cardOpeningBalance, withRunningBalance } from '../sample.js'
// import Inventory from '../Inventory.jsx'
import InventoryApi from '../../api/InventoryApi.js'
import Loader from '../../ds/components/core/Loader.jsx'
const num = (n) => (n ? n.toLocaleString() : '—')

export default function StockCardGP({ leaf, moduleLabel, parentLabel }) {
  const { factories, products, units, categories, addUnit, upsertProduct, showToast } = useStore()
  const [factoryId, setFactoryId] = useState('')
  const [group] = useState(stockGroups[0])
  const rows = withRunningBalance(stockCardRows, cardOpeningBalance, 'qtyRemain')

  const totalIn = stockCardRows.reduce((n, r) => n + r.qtyIn, 0)
  const totalOut = stockCardRows.reduce((n, r) => n + r.qtyOut, 0)
  const closing = cardOpeningBalance + totalIn - totalOut
  const cardFilters = [
  { key: 'factory', label: 'Factory', type: 'select', options: factories.map((v)=> ({value:v.id,label:v.name})) },
  { key: 'kind', label: 'Stock type', type: 'select', options: stockKinds.map(({ value, label }) => ({ value, label })) },
  // { key: 'brand', label: 'Brand', type: 'select', options: brands },
  { key: 'group', label: 'Stock name (group)', type: 'select', options: categories.map((v)=> ({value:v.id,label:v.name})) },
  { key: 'from', label: 'Date from', type: 'date' },
  { key: 'to', label: 'Date to', type: 'date' },
]
  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: 130 },
    { key: 'remark', label: 'Remark', width: 380 },
    { key: 'qtyIn', label: 'Qty in', width: 110, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: 110, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: 'qtyRemain', label: 'Qty remain', width: 130, align: 'right', mono: true, render: (r) => num(r.qtyRemain) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Card (GP)'}
      icon={leaf?.icon}
      meta={<CardIdentity group={group} />}
      description="Detailed movement history for a selected stock group. Every transaction involving any member of the group is recorded as its own entry, with a remark describing it."
      filters={cardFilters}
      stats={[
        { label: 'Opening balance', value: cardOpeningBalance.toLocaleString(), hint: '01 Aug 2026' },
        { label: 'Total qty in', value: totalIn.toLocaleString(), delta: `${stockCardRows.filter((r) => r.qtyIn).length} entries` },
        { label: 'Total qty out', value: totalOut.toLocaleString(), tone: 'negative', delta: `${stockCardRows.filter((r) => r.qtyOut).length} entries` },
        { label: 'Closing balance', value: closing.toLocaleString(), hint: '22 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ sn: 'Total', qtyIn: totalIn.toLocaleString(), qtyOut: totalOut.toLocaleString(), qtyRemain: closing.toLocaleString() }}
      tableTitle={`Group activity — ${group.label}`}
      tableActions={<CardIdentity group={group} />}
      emptyTitle="No activity for this group in the selected period"
      emptyDescription="Widen the date range or choose a different stock group, then generate again."
      footnote="Report data reflects the underlying transactional records at the moment of generation."
    >
      <GroupMembers group={group} />
    </ReportShell>
  )
}
