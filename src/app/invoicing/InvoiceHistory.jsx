import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Page, Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { showrooms } from '../sampleShowroom.js'
import { INVOICE_STATUSES, STATUS_TONE, DELIVERY_TONE } from '../sampleInvoicing.js'
import { allInvoices } from './invoiceModel.js'
import { money, moneyShort } from '../utils.js'

/** Linked-record view the PRD asks for: pro-forma, payments and waybills. */
function InvoiceDetail({ invoice, onBack, crumbs }) {
  const paymentColumns = [
    { key: 'date', label: 'Date', width: 140 },
    { key: 'method', label: 'Method', width: 200 },
    { key: 'amount', label: 'Amount', width: 180, align: 'right', mono: true, render: (p) => money(p.amount) },
  ]

  return (
    <Page wide>
      <PageHeader
        crumbs={crumbs}
        title={invoice.number}
        icon="file-text"
        description={`Issued to ${invoice.customer} from ${invoice.showroom}. Everything linked to this invoice is shown below.`}
        meta={
          <>
            <Badge tone={STATUS_TONE[invoice.status]}>{invoice.status}</Badge>
            <Badge tone={DELIVERY_TONE[invoice.delivery] || 'neutral'}>{invoice.delivery}</Badge>
            {invoice.daysOverdue > 0 && <Badge tone="danger">{invoice.daysOverdue} days overdue</Badge>}
          </>
        }
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to history</Button>
            <Button variant="secondary" iconLeft="download">Download PDF</Button>
            <Button iconLeft="printer">Reprint</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        <Panel title="Invoice">
          <MetaRow label="Number" value={invoice.number} mono />
          <MetaRow label="Issued" value={invoice.issued || '—'} />
          <MetaRow label="Due" value={invoice.due || '—'} />
          <MetaRow label="Issued by" value={invoice.issuedBy} />
          <MetaRow label="Subtotal" value={money(invoice.subtotal)} mono />
          <MetaRow label={`VAT at ${invoice.vatRate.toFixed(1)}%`} value={money(invoice.vat)} mono />
          <MetaRow label="Total" value={money(invoice.total)} mono />
          <MetaRow label="Paid" value={money(invoice.paid)} mono tone={invoice.paid ? 'positive' : undefined} />
          <MetaRow label="Balance" value={money(invoice.balance)} mono tone={invoice.balance ? 'negative' : undefined} />
        </Panel>

        <Panel title="Linked records" description="Everything this invoice traces to, forward and back.">
          <MetaRow label="Originating sale" value={invoice.sourceRef} mono />
          <MetaRow label="Source" value={invoice.source} />
          <MetaRow label="Pro-forma" value={invoice.proforma || 'None'} mono={!!invoice.proforma} />
          <MetaRow label="Waybills" value={invoice.waybills.length ? invoice.waybills.join(', ') : 'None raised'} />
          <MetaRow label="Payments linked" value={invoice.payments.length} mono />
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Icon name="link" size={13} color="var(--text-subtle)" style={{ marginTop: 2 }} />
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
              This invoice is also retrievable from Transaction Receipts, where it stays consistent with the copy shown here.
            </span>
          </div>
        </Panel>
      </div>

      {invoice.voidReason && (
        <Callout tone="warning" icon="circle-x" title="This invoice was voided">
          {invoice.voidReason} The original record is retained in full and its number was never reused.
        </Callout>
      )}

      <Panel title="Linked payments" description="Payments recorded against this invoice through POS, bank or wallet." padding={0}>
        {invoice.payments.length === 0 ? (
          <div style={{ padding: '28px 20px', textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
            No payments recorded against this invoice yet.
          </div>
        ) : (
          <ReportTable
            columns={paymentColumns}
            rows={invoice.payments}
            rowKey={(p, i) => `${p.date}-${i}`}
            totals={{ date: 'Total paid', amount: money(invoice.paid) }}
            stickyHeader={false}
            style={{ border: 'none', borderRadius: 0 }}
          />
        )}
      </Panel>
    </Page>
  )
}

export default function InvoiceHistory({ leaf, moduleLabel, parentLabel }) {
  const [selected, setSelected] = useState(null)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (selected) return <InvoiceDetail invoice={selected} crumbs={crumbs} onBack={() => setSelected(null)} />

  const rows = allInvoices
  const value = rows.reduce((n, i) => n + i.total, 0)
  const withProforma = rows.filter((i) => i.proforma)
  const withWaybill = rows.filter((i) => i.waybills.length)

  const columns = [
    { key: 'number', label: 'Invoice', width: 140, mono: true },
    { key: 'issued', label: 'Issued', width: 130, render: (i) => i.issued || <span style={{ color: 'var(--text-subtle)' }}>Draft</span> },
    { key: 'customer', label: 'Customer', width: 250 },
    { key: 'showroom', label: 'Showroom', width: 185 },
    { key: 'source', label: 'Source', width: 140 },
    { key: 'sourceRef', label: 'Origin', width: 130, mono: true },
    {
      key: 'proforma', label: 'Pro-forma', width: 130, mono: true,
      render: (i) => (i.proforma || <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'waybills', label: 'Waybills', width: 150, mono: true,
      render: (i) => (i.waybills.length ? i.waybills.join(', ') : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    { key: 'total', label: 'Value', width: 170, align: 'right', mono: true, render: (i) => money(i.total) },
    {
      key: 'status', label: 'Status', width: 155,
      render: (i) => <Badge tone={STATUS_TONE[i.status]}>{i.status}</Badge>,
    },
    {
      key: 'action', label: '', width: 120, sortable: false,
      render: (i) => <Button size="sm" variant="secondary" iconLeft="eye" onClick={() => setSelected(i)}>Open</Button>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Invoice History & Search'}
      icon={leaf?.icon}
      description="Searchable archive of every invoice ever issued. Open any invoice to view or reprint it, along with its linked pro-forma, payments and waybills."
      filters={[
        { key: 'number', label: 'Invoice number', type: 'text', placeholder: 'e.g. INV-31240', icon: 'search' },
        { key: 'customer', label: 'Customer', type: 'select', options: [...new Set(rows.map((i) => i.customer))].map((c) => ({ value: c, label: c })) },
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'status', label: 'Status', type: 'select', options: INVOICE_STATUSES.map((s) => ({ value: s, label: s })) },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      generateLabel="Search"
      stats={[
        { label: 'Invoices on file', value: String(rows.length) },
        { label: 'Combined value', value: moneyShort(value) },
        { label: 'Raised from pro-forma', value: String(withProforma.length), hint: `${rows.length - withProforma.length} from POS` },
        { label: 'With waybills raised', value: String(withWaybill.length) },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={(i) => setSelected(i)}
      totals={{ number: 'Total', total: money(value) }}
      tableTitle="Invoice archive"
      emptyTitle="No invoices match this search"
      emptyDescription="Adjust the search term or clear the filters, then search again."
      footnote="Results respect your showroom and role scope — invoices outside it are never returned. Reprinting never alters the original invoice number or its data."
    />
  )
}
