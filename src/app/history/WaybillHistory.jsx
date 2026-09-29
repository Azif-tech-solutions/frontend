import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { drivers } from '../sample.js'
import { waybillHistory } from '../sampleHistory.js'
import { fmt } from '../utils.js'

const invoices = [...new Set(waybillHistory.map((w) => w.invoice))]

export default function WaybillHistory({ leaf, moduleLabel, parentLabel }) {
  const [invoice, setInvoice] = useState('INV-31240')

  const rows = waybillHistory
    .filter((w) => w.invoice === invoice)
    .map((w) => ({ ...w, outstanding: w.ordered - w.qty }))

  const header = rows[0]
  const ordered = rows.reduce((n, r) => n + r.ordered, 0)
  const supplied = rows.reduce((n, r) => n + r.qty, 0)
  const outstanding = ordered - supplied
  const waybills = new Set(rows.filter((r) => r.waybill !== '—').map((r) => r.waybill))

  const columns = [
    {
      key: 'waybill', label: 'Waybill no.', width: 130, mono: true,
      render: (r) => (r.waybill === '—' ? <span style={{ color: 'var(--text-subtle)' }}>Not raised</span> : r.waybill),
    },
    { key: 'supplied', label: 'Supply date', width: 140 },
    { key: 'product', label: 'Product', width: 260 },
    { key: 'ordered', label: 'Qty on invoice', width: 150, align: 'right', mono: true, render: (r) => fmt(r.ordered) },
    {
      key: 'qty', label: 'Qty supplied', width: 145, align: 'right', mono: true,
      render: (r) => (r.qty ? <span style={{ color: 'var(--success)' }}>{fmt(r.qty)}</span> : '—'),
    },
    {
      key: 'outstanding', label: 'Outstanding', width: 145, align: 'right', mono: true,
      render: (r) => (r.outstanding ? <span style={{ color: 'var(--danger)' }}>{fmt(r.outstanding)}</span> : fmt(0)),
    },
    { key: 'driver', label: 'Driver', width: 170 },
    { key: 'receivedBy', label: 'Received by', width: 160 },
    {
      key: 'status', label: 'Status', width: 140,
      render: (r) => <Badge tone={r.status === 'Delivered' ? 'success' : 'warning'}>{r.status}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Waybill History'}
      icon={leaf?.icon}
      description="Trace how the products on a sales invoice were supplied over time. Particularly useful where an invoice is fulfilled across several deliveries rather than a single shipment."
      filters={[
        { key: 'invoice', label: 'Invoice number', type: 'select', options: invoices.map((i) => ({ value: i, label: i })) },
        { key: 'driver', label: 'Driver', type: 'select', options: drivers },
        { key: 'status', label: 'Status', type: 'select', options: [{ value: 'delivered', label: 'Delivered' }, { value: 'outstanding', label: 'Outstanding' }] },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      filterValues={{ invoice }}
      onFilterChange={(k, v) => { if (k === 'invoice') setInvoice(v) }}
      stats={[
        { label: 'Quantity invoiced', value: fmt(ordered) },
        { label: 'Quantity supplied', value: fmt(supplied), delta: `${Math.round((supplied / ordered) * 100)}% fulfilled` },
        { label: 'Still outstanding', value: fmt(outstanding), tone: outstanding ? 'negative' : undefined },
        { label: 'Waybills raised', value: String(waybills.size), hint: waybills.size > 1 ? 'Multi-delivery' : 'Single delivery' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ waybill: 'Total', ordered: fmt(ordered), qty: fmt(supplied), outstanding: fmt(outstanding) }}
      tableTitle={`Supply history for ${invoice}`}
      emptyTitle="No supply records for this invoice"
      emptyDescription="Nothing has been released against this invoice yet."
      footnote="Every completed release carries a waybill with a unique reference. Lines showing no waybill have not been supplied and remain outstanding against the invoice."
    >
      <Panel title="Invoice" description="The sales transaction whose supply history is shown below.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Invoice number" value={header.invoice} mono />
            <MetaRow label="Customer" value={header.customer} />
            <MetaRow label="Invoice date" value={header.invoiceDate} />
          </div>
          <div>
            <MetaRow label="Product lines" value={rows.length} mono />
            <MetaRow label="Deliveries made" value={waybills.size} mono />
            <MetaRow label="Fulfilment" value={`${Math.round((supplied / ordered) * 100)}%`} mono tone={outstanding ? undefined : 'positive'} />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
            <div style={{ width: `${(supplied / ordered) * 100}%`, height: '100%', background: outstanding ? 'var(--brand)' : 'var(--success)' }} />
          </div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone={outstanding ? 'warning' : 'success'}>
              {outstanding ? `${fmt(outstanding)} outstanding` : 'Fully supplied'}
            </Badge>
            {waybills.size > 1 && <Badge tone="neutral">Fulfilled across {waybills.size} deliveries</Badge>}
          </div>
        </div>
      </Panel>
    </ReportShell>
  )
}
