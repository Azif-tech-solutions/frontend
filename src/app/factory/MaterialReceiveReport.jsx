import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { factories, suppliers, manufacturers, materialReceipts } from '../sample.js'
import { fmt } from '../utils.js'

const CONDITION_TONE = {
  Accepted: 'success',
  'Accepted with exceptions': 'warning',
  'Pending verification': 'neutral',
  Rejected: 'danger',
}

export default function MaterialReceiveReport({ leaf, moduleLabel, parentLabel }) {
  const verified = materialReceipts.filter((r) => r.verifiedBy !== '—')
  const pending = materialReceipts.filter((r) => r.verifiedBy === '—')

  const columns = [
    { key: 'date', label: 'Arrival date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'item', label: 'Material / recipe', width: 240 },
    {
      key: 'type', label: 'Type', width: 150,
      render: (r) => <Badge tone={r.type === 'In-house recipe' ? 'brand' : 'neutral'}>{r.type}</Badge>,
    },
    { key: 'supplier', label: 'Supplier', width: 210 },
    { key: 'manufacturer', label: 'Manufacturer', width: 200 },
    { key: 'qty', label: 'Qty received', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unit', label: 'Unit', width: 110 },
    { key: 'mfgDate', label: 'Manufactured', width: 135 },
    { key: 'expiry', label: 'Expiry', width: 130 },
    {
      key: 'verifiedBy', label: 'Verified by', width: 140,
      render: (r) => (r.verifiedBy === '—'
        ? <span style={{ color: 'var(--text-subtle)' }}>Not verified</span>
        : r.verifiedBy),
    },
    {
      key: 'offloaded', label: 'Offloaded', width: 130,
      render: (r) => (r.offloaded === '—' ? <span style={{ color: 'var(--text-subtle)' }}>—</span> : r.offloaded),
    },
    {
      key: 'condition', label: 'Condition', width: 200,
      render: (r) => <Badge tone={CONDITION_TONE[r.condition] || 'neutral'}>{r.condition}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Material/Recipe Receive Report'}
      icon={leaf?.icon}
      description="All materials and recipes received into the factory with their arrival dates, supplier and manufacturer details, and the Stock Keeper's inspection and offloading verification."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'supplier', label: 'Supplier', type: 'select', options: suppliers },
        { key: 'manufacturer', label: 'Manufacturer', type: 'select', options: manufacturers },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Deliveries received', value: String(materialReceipts.length) },
        { label: 'Verified & offloaded', value: String(verified.length), delta: `${Math.round((verified.length / materialReceipts.length) * 100)}% of arrivals` },
        { label: 'Pending verification', value: String(pending.length), tone: pending.length ? 'warning' : undefined, hint: pending.length ? 'Awaiting Stock Keeper' : undefined },
        { label: 'Suppliers', value: String(new Set(materialReceipts.map((r) => r.supplier)).size) },
      ]}
      columns={columns}
      rows={materialReceipts}
      tableTitle="Arrivals and verification"
      emptyTitle="No materials received in this period"
      emptyDescription="Widen the date range or clear the supplier filter, then generate again."
      footnote="The Stock Keeper is responsible for inspecting, confirming and recording the offloading of every incoming delivery. Unverified arrivals are not counted as available stock."
    />
  )
}
