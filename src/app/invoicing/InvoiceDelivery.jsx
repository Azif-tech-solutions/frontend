import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Panel, Callout } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { DELIVERY_TONE, emailTemplates } from '../sampleInvoicing.js'
import { allInvoices } from './invoiceModel.js'
import { money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'all', label: 'All invoices', icon: 'files' },
  { value: 'Failed', label: 'Failed', icon: 'circle-x' },
  { value: 'No email on file', label: 'No email on file', icon: 'mail-x' },
]

export default function InvoiceDelivery({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('all')

  const issued = allInvoices.filter((i) => i.status !== 'Draft')
  const rows = tab === 'all' ? issued : issued.filter((i) => i.delivery === tab)

  const sent = issued.filter((i) => i.delivery === 'Sent')
  const failed = issued.filter((i) => i.delivery === 'Failed')
  const noEmail = issued.filter((i) => i.delivery === 'No email on file')

  const columns = [
    { key: 'number', label: 'Invoice', width: 140, mono: true },
    { key: 'issued', label: 'Issued', width: 135 },
    { key: 'customer', label: 'Customer', width: 250 },
    {
      key: 'email', label: 'Registered email', width: 260,
      render: (i) => (i.email || <span style={{ color: 'var(--text-subtle)' }}>None on file</span>),
    },
    { key: 'showroom', label: 'Issued at', width: 185 },
    { key: 'total', label: 'Invoice value', width: 175, align: 'right', mono: true, render: (i) => money(i.total) },
    {
      key: 'delivery', label: 'Delivery status', width: 180,
      render: (i) => <Badge tone={DELIVERY_TONE[i.delivery] || 'neutral'}>{i.delivery}</Badge>,
    },
    {
      key: 'deliveredAt', label: 'Last attempt', width: 190,
      render: (i) => (i.deliveredAt || <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'action', label: 'Action', width: 230, sortable: false,
      render: (i) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="secondary" iconLeft="download">PDF</Button>
          <Button size="sm" variant={i.delivery === 'Sent' ? 'secondary' : 'primary'} iconLeft="send">
            {i.delivery === 'Sent' ? 'Resend' : i.delivery === 'Failed' ? 'Retry' : 'Send to…'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Invoice PDF & Email Delivery'}
      icon={leaf?.icon}
      description="Render any issued invoice as a print-ready PDF and deliver it to the customer's registered email, with delivery status visible against every invoice."
      headerActions={<Button iconLeft="download">Bulk export PDFs</Button>}
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by invoice number, customer or email…"
      filters={<Select options={showrooms} placeholder="All showrooms" style={{ width: 190 }} />}
      stats={[
        { label: 'Invoices issued', value: String(issued.length) },
        { label: 'Delivered', value: String(sent.length), delta: `${Math.round((sent.length / issued.length) * 100)}% of issued` },
        { label: 'Failed delivery', value: String(failed.length), tone: failed.length ? 'negative' : undefined, hint: failed.length ? 'Retryable' : undefined },
        { label: 'No email on file', value: String(noEmail.length), tone: noEmail.length ? 'warning' : undefined, hint: noEmail.length ? moneyShort(noEmail.reduce((n, i) => n + i.total, 0)) : undefined },
      ]}
      columns={columns}
      rows={rows}
      emptyTitle={tab === 'all' ? 'No invoices issued' : `No invoices with status “${tab}”`}
      emptyDescription={tab !== 'all' ? 'Every invoice has been delivered successfully.' : undefined}
      footnote="Retrying a failed delivery reuses the same invoice — the number and its data never change. Bulk export respects the same access permissions as opening an invoice individually."
    >
      {failed.length > 0 && (
        <Callout tone="danger" icon="circle-alert" title={`${failed.length} invoice failed to deliver`}>
          {failed.map((i) => `${i.number} to ${i.customer}`).join(', ')}. Retry the send or redirect it to an
          alternate address — the invoice keeps its original number and data either way.
        </Callout>
      )}
      {noEmail.length > 0 && (
        <Callout tone="warning" icon="mail-x" title={`${noEmail.length} customers have no email on file`}>
          {[...new Set(noEmail.map((i) => i.customer))].join(', ')} cannot receive invoices automatically. Add an
          address in Customer Contacts, or send each invoice manually to an alternate address.
        </Callout>
      )}

      <Panel title="Send or redirect" description="Deliver an invoice PDF to an address other than the one on file.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, alignItems: 'end' }}>
          <Select
            label="Invoice"
            options={issued.map((i) => ({ value: i.number, label: `${i.number} — ${i.customer}` }))}
            placeholder="Select invoice…"
          />
          <Input label="Send to" placeholder="name@company.com" iconLeft="mail" />
          <Select label="Message template" options={emailTemplates} placeholder="Select template…" />
          <Button iconLeft="send">Send PDF</Button>
        </div>
      </Panel>

      <Panel title="Bulk export" description="Export invoice PDFs for a date range, for offline recordkeeping.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, alignItems: 'end' }}>
          <Input label="From" type="date" />
          <Input label="To" type="date" />
          <Select options={showrooms} label="Showroom" placeholder="All showrooms" />
          <Button variant="secondary" iconLeft="download">Export ZIP</Button>
        </div>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <Icon name="info" size={13} color="var(--text-subtle)" style={{ marginTop: 2 }} />
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
            Exported PDFs match the on-screen invoice exactly, including company branding, totals and line items.
          </span>
        </div>
      </Panel>
    </RegisterShell>
  )
}
