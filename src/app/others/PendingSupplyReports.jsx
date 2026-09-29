import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { waybillHistory } from '../sampleHistory.js'
import { fmt } from '../utils.js'

const VIEWS = [
  { value: 'summary', label: 'All invoices' },
  { value: 'detail', label: 'Line detail' },
]

/** Roll each invoice up so fulfilment status can be judged at a glance. */
function summarise() {
  const acc = {}
  for (const w of waybillHistory) {
    acc[w.invoice] ||= { invoice: w.invoice, customer: w.customer, invoiceDate: w.invoiceDate, ordered: 0, supplied: 0, lines: 0, waybills: new Set(), lastSupply: '—' }
    acc[w.invoice].ordered += w.ordered
    acc[w.invoice].supplied += w.qty
    acc[w.invoice].lines += 1
    if (w.waybill !== '—') acc[w.invoice].waybills.add(w.waybill)
    if (w.supplied !== '—') acc[w.invoice].lastSupply = w.supplied
  }
  return Object.values(acc).map((i) => {
    const outstanding = i.ordered - i.supplied
    return {
      ...i,
      waybills: i.waybills.size,
      outstanding,
      progress: (i.supplied / i.ordered) * 100,
      status: outstanding === 0 ? 'Fully supplied' : i.supplied === 0 ? 'Not supplied' : 'Partially supplied',
    }
  })
}

const STATUS_TONE = { 'Fully supplied': 'success', 'Partially supplied': 'warning', 'Not supplied': 'danger' }

export default function PendingSupplyReports({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('summary')
  const invoices = summarise()

  const pending = invoices.filter((i) => i.outstanding > 0)
  const outstanding = invoices.reduce((n, i) => n + i.outstanding, 0)
  const ordered = invoices.reduce((n, i) => n + i.ordered, 0)
  const supplied = invoices.reduce((n, i) => n + i.supplied, 0)

  const summaryColumns = [
    { key: 'invoice', label: 'Invoice', width: 140, mono: true },
    { key: 'customer', label: 'Customer', width: 250 },
    { key: 'invoiceDate', label: 'Invoice date', width: 145 },
    { key: 'lines', label: 'Lines', width: 100, align: 'right', mono: true, render: (i) => fmt(i.lines) },
    { key: 'ordered', label: 'Qty invoiced', width: 145, align: 'right', mono: true, render: (i) => fmt(i.ordered) },
    { key: 'supplied', label: 'Qty supplied', width: 145, align: 'right', mono: true, render: (i) => fmt(i.supplied) },
    {
      key: 'outstanding', label: 'Outstanding', width: 145, align: 'right', mono: true,
      render: (i) => (i.outstanding ? <span style={{ color: 'var(--danger)' }}>{fmt(i.outstanding)}</span> : fmt(0)),
    },
    {
      key: 'progress', label: 'Fulfilment', width: 170,
      render: (i) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, width: '100%' }}>
          <span style={{ flex: 1, height: 5, borderRadius: 'var(--radius-full)', background: 'var(--surface-sunken)', overflow: 'hidden', minWidth: 60 }}>
            <span style={{ display: 'block', width: `${i.progress}%`, height: '100%', background: i.outstanding ? 'var(--warning)' : 'var(--success)' }} />
          </span>
          <span style={{ font: 'var(--fw-medium) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-muted)' }}>{i.progress.toFixed(0)}%</span>
        </span>
      ),
    },
    { key: 'waybills', label: 'Deliveries', width: 130, align: 'right', mono: true, render: (i) => fmt(i.waybills) },
    { key: 'lastSupply', label: 'Last supply', width: 145 },
    {
      key: 'status', label: 'Status', width: 175,
      render: (i) => <Badge tone={STATUS_TONE[i.status] || 'neutral'}>{i.status}</Badge>,
    },
  ]

  const detailColumns = [
    { key: 'invoice', label: 'Invoice', width: 140, mono: true },
    { key: 'customer', label: 'Customer', width: 240 },
    { key: 'product', label: 'Product', width: 260 },
    { key: 'ordered', label: 'Qty invoiced', width: 145, align: 'right', mono: true, render: (w) => fmt(w.ordered) },
    { key: 'qty', label: 'Qty supplied', width: 145, align: 'right', mono: true, render: (w) => fmt(w.qty) },
    {
      key: 'balance', label: 'Outstanding', width: 145, align: 'right', mono: true,
      render: (w) => (w.ordered - w.qty ? <span style={{ color: 'var(--danger)' }}>{fmt(w.ordered - w.qty)}</span> : fmt(0)),
    },
    {
      key: 'waybill', label: 'Waybill', width: 140, mono: true,
      render: (w) => (w.waybill === '—' ? <span style={{ color: 'var(--text-subtle)' }}>Not raised</span> : w.waybill),
    },
    { key: 'supplied', label: 'Supply date', width: 145 },
    {
      key: 'status', label: 'Status', width: 150,
      render: (w) => <Badge tone={w.status === 'Delivered' ? 'success' : 'warning'}>{w.status}</Badge>,
    },
  ]

  const isSummary = view === 'summary'

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Pending Supply Reports'}
      icon={leaf?.icon}
      description="Transactions not yet fully supplied, alongside the history of what has already been delivered. Check any invoice to see whether it is complete or still pending, and how partial deliveries progressed."
      filters={[
        { key: 'invoice', label: 'Invoice number', type: 'select', options: invoices.map((i) => ({ value: i.invoice, label: i.invoice })) },
        { key: 'customer', label: 'Customer', type: 'select', options: [...new Set(invoices.map((i) => i.customer))].map((c) => ({ value: c, label: c })) },
        { key: 'status', label: 'Status', type: 'select', options: Object.keys(STATUS_TONE).map((s) => ({ value: s, label: s })) },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Invoices pending', value: String(pending.length), tone: pending.length ? 'warning' : undefined, hint: `of ${invoices.length} total` },
        { label: 'Units invoiced', value: fmt(ordered) },
        { label: 'Units supplied', value: fmt(supplied), delta: `${Math.round((supplied / ordered) * 100)}% fulfilled` },
        { label: 'Units outstanding', value: fmt(outstanding), tone: 'negative' },
      ]}
      columns={isSummary ? summaryColumns : detailColumns}
      rows={isSummary ? invoices : waybillHistory}
      totals={isSummary
        ? { invoice: 'Total', ordered: fmt(ordered), supplied: fmt(supplied), outstanding: fmt(outstanding) }
        : { invoice: 'Total', ordered: fmt(ordered), qty: fmt(supplied) }}
      tableTitle={isSummary ? 'Invoice fulfilment status' : 'Line-by-line supply detail'}
      tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
      emptyTitle="Nothing outstanding"
      emptyDescription="Every invoice in the selected period has been fully supplied."
      footnote="An invoice stays pending until every line has been released. Partial deliveries are traced through the waybills raised against the invoice, each with its own reference and supply date."
    >
      <Panel title="Outstanding at a glance" description="Invoices with goods still owed to the customer.">
        {pending.length === 0 ? (
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            No invoices are currently pending supply.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {pending.map((i) => (
              <div key={i.invoice} style={{ padding: '14px 16px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-mono)', color: 'var(--text-strong)' }}>{i.invoice}</span>
                  <Badge tone={STATUS_TONE[i.status]}>{i.status}</Badge>
                </div>
                <div style={{ marginTop: 8 }}>
                  <MetaRow label="Customer" value={i.customer} />
                  <MetaRow label="Outstanding" value={fmt(i.outstanding)} mono tone="negative" />
                  <MetaRow label="Deliveries so far" value={i.waybills} mono />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </ReportShell>
  )
}
