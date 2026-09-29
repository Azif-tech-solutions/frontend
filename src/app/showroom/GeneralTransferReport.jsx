import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms, showroomToShowroom, factoryToShowroom } from '../sampleShowroom.js'
import { factories, drivers } from '../sample.js'
import { fmt } from '../utils.js'

const TABS = [
  { value: 's2s', label: 'Showroom-to-Showroom', icon: 'store' },
  { value: 'f2s', label: 'Factory-to-Showroom', icon: 'factory' },
]

export default function GeneralTransferReport({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('s2s')
  const isS2S = tab === 's2s'
  const rows = isS2S ? showroomToShowroom : factoryToShowroom

  const inTransit = rows.filter((r) => r.status === 'In transit')
  const totalQty = rows.reduce((n, r) => n + r.qty, 0)

  const columns = [
    { key: 'date', label: 'Transfer date', width: 135 },
    { key: 'waybill', label: 'Waybill no.', width: 125, mono: true },
    { key: 'source', label: isS2S ? 'Source showroom' : 'Factory', width: 190 },
    { key: 'destination', label: isS2S ? 'Destination showroom' : 'Receiving showroom', width: 200 },
    { key: 'driver', label: 'Driver', width: 150 },
    { key: 'product', label: 'Product', width: 250 },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unit', label: 'Unit', width: 110 },
    {
      key: 'received', label: 'Received date', width: 140,
      render: (r) => (r.received === '—' ? <span style={{ color: 'var(--text-subtle)' }}>Not yet</span> : r.received),
    },
    {
      key: 'status', label: 'Status', width: 130,
      render: (r) => <Badge tone={r.status === 'Received' ? 'success' : 'warning'}>{r.status}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'General Transfer Report'}
      icon={leaf?.icon}
      description="Centralised record of stock movement across the organisation — transfers between showrooms, and supplies from factories into showrooms — for monitoring, auditing and traceability."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      filters={[
        isS2S
          ? { key: 'source', label: 'Source showroom', type: 'select', options: showrooms }
          : { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'destination', label: 'Receiving showroom', type: 'select', options: showrooms },
        { key: 'driver', label: 'Driver', type: 'select', options: drivers },
        { key: 'status', label: 'Status', type: 'select', options: [{ value: 'received', label: 'Received' }, { value: 'transit', label: 'In transit' }] },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Transfers', value: String(rows.length) },
        { label: 'Total quantity', value: fmt(totalQty) },
        { label: 'In transit', value: String(inTransit.length), tone: inTransit.length ? 'warning' : undefined, hint: inTransit.length ? 'Awaiting receipt' : undefined },
        { label: isS2S ? 'Showrooms involved' : 'Factories involved', value: String(new Set(rows.map((r) => r.source)).size) },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', qty: fmt(totalQty) }}
      tableTitle={isS2S ? 'Transfers between showrooms' : 'Supplies from factories'}
      emptyTitle="No transfers in this period"
      emptyDescription="Widen the date range or clear the status filter, then generate again."
      footnote="Every completed transfer carries a waybill with a unique reference. Stock is not deducted from the source until the transfer is confirmed, and not added to the destination until receipt is acknowledged."
    />
  )
}
