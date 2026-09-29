import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { factories, suppliers, reOrderItems } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const VIEWS = [
  { value: 'due', label: 'Needs re-order' },
  { value: 'all', label: 'All items' },
]

/** Ratio of stock on hand to the configured threshold decides urgency. */
function classify(item) {
  const ratio = item.onHand / item.reorderLevel
  if (ratio <= 1) return { status: 'Re-order now', tone: 'danger' }
  if (ratio <= 1.25) return { status: 'Approaching', tone: 'warning' }
  return { status: 'Healthy', tone: 'success' }
}

export default function ReOrderReport({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('due')

  const all = reOrderItems.map((i) => {
    const { status, tone } = classify(i)
    // Bring stock back to the threshold plus one lead-time buffer.
    const shortfall = Math.max(0, i.reorderLevel - i.onHand)
    const suggested = shortfall ? Math.ceil((i.reorderLevel * 1.5 - i.onHand) / 10) * 10 : 0
    return { ...i, status, tone, shortfall, suggested, orderValue: suggested * i.unitCost }
  })

  const due = all.filter((i) => i.status !== 'Healthy')
  const rows = (view === 'due' ? due : all).sort((a, b) => a.onHand / a.reorderLevel - b.onHand / b.reorderLevel)
  const orderValue = due.reduce((n, i) => n + i.orderValue, 0)
  const longestLead = due.reduce((n, i) => Math.max(n, i.leadTime), 0)

  const columns = [
    { key: 'item', label: 'Material / recipe', width: 250 },
    { key: 'category', label: 'Category', width: 150 },
    { key: 'onHand', label: 'On hand', width: 120, align: 'right', mono: true, render: (r) => fmt(r.onHand) },
    { key: 'reorderLevel', label: 'Re-order level', width: 140, align: 'right', mono: true, render: (r) => fmt(r.reorderLevel) },
    {
      key: 'shortfall', label: 'Shortfall', width: 120, align: 'right', mono: true,
      render: (r) => (r.shortfall ? <span style={{ color: 'var(--danger)' }}>{fmt(r.shortfall)}</span> : '—'),
    },
    { key: 'unit', label: 'Unit', width: 110 },
    {
      key: 'status', label: 'Status', width: 145,
      render: (r) => <Badge tone={r.tone}>{r.status}</Badge>,
    },
    { key: 'supplier', label: 'Supplier', width: 210 },
    { key: 'leadTime', label: 'Lead time', width: 120, align: 'right', mono: true, render: (r) => `${r.leadTime} d` },
    { key: 'lastOrdered', label: 'Last ordered', width: 135 },
    {
      key: 'suggested', label: 'Suggested qty', width: 145, align: 'right', mono: true,
      render: (r) => (r.suggested ? fmt(r.suggested) : '—'),
    },
    {
      key: 'orderValue', label: 'Est. order value', width: 165, align: 'right', mono: true,
      render: (r) => (r.orderValue ? money(r.orderValue) : '—'),
    },
    {
      key: 'action', label: 'Action', width: 165, sortable: false,
      render: (r) => (r.status === 'Healthy'
        ? <span style={{ color: 'var(--text-subtle)' }}>—</span>
        : <Button size="sm" variant={r.tone === 'danger' ? 'primary' : 'secondary'} iconLeft="shopping-cart">Raise order</Button>),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Re-Order Report'}
      icon={leaf?.icon}
      description="Minimum stock levels and the items that have reached them. Stock at or below its re-order point prompts personnel to raise a purchase order with the relevant supplier."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'supplier', label: 'Supplier', type: 'select', options: suppliers },
        { key: 'category', label: 'Category', type: 'select', options: [{ value: 'additive', label: 'Additive' }, { value: 'packaging', label: 'Packaging' }, { value: 'recipe', label: 'In-house recipe' }] },
        { key: 'asOf', label: 'As at date', type: 'date' },
      ]}
      generateLabel="Refresh levels"
      stats={[
        { label: 'Items needing re-order', value: String(due.length), tone: due.length ? 'negative' : undefined, delta: due.length ? 'action required' : undefined },
        { label: 'Items tracked', value: String(all.length) },
        { label: 'Estimated order value', value: moneyShort(orderValue) },
        { label: 'Longest lead time', value: `${longestLead} days`, hint: 'Order by this margin' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ item: 'Total', orderValue: money(rows.reduce((n, r) => n + r.orderValue, 0)) }}
      tableTitle={view === 'due' ? 'Items at or below re-order level' : 'All tracked items'}
      tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
      emptyTitle="Nothing needs re-ordering"
      emptyDescription="Every tracked item is above its configured re-order level."
      footnote="Suggested quantity restores stock to the re-order level plus a buffer. Lead time is the supplier's stated turnaround — order earlier than the shortfall date to avoid a production stoppage."
    >
      {due.length > 0 && (
        <Callout tone="danger" icon="triangle-alert" title={`${due.length} item${due.length === 1 ? '' : 's'} at or below re-order level`}>
          {due.map((i) => i.item.split(' · ')[1]).join(', ')} require replenishment.
          The longest supplier lead time among them is {longestLead} days, so orders raised today arrive by the end of that window.
        </Callout>
      )}
    </ReportShell>
  )
}
