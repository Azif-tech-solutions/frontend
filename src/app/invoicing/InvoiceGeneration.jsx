import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { showrooms } from '../sampleShowroom.js'
import { vatSettings } from '../sampleProcess.js'
import { invoiceLines } from '../sampleInvoicing.js'
import { allInvoices } from './invoiceModel.js'
import { fmt, money } from '../utils.js'

const SOURCES = [
  { value: 'pos', label: 'From POS sale', icon: 'scan-line' },
  { value: 'proforma', label: 'From pro-forma', icon: 'file-text' },
]

/** The next number in an unbroken sequence — never reused, never edited. */
const NEXT_NUMBER = 'INV-31402'

function IssuedInvoice({ onBack, crumbs, draft }) {
  const lines = invoiceLines['INV-31401'] || []
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0)
  const vat = subtotal * 0.075
  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Invoice issued"
        icon="file-text"
        description="The invoice has been assigned a sequential number and its financial fields are now locked. Corrections must go through a credit note or void-and-reissue."
        meta={<Badge tone="success">{NEXT_NUMBER} issued and locked</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New invoice</Button>
            <Button variant="secondary" iconLeft="download">Download PDF</Button>
            <Button iconLeft="send">Email to customer</Button>
          </>
        }
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Tax Invoice"
          docNumber={NEXT_NUMBER}
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: 'Showroom Lekki — 3B Admiralty Way, Lekki Phase 1, Lagos',
            contact: 'sales@zifiq.com · +234 802 000 0000',
            vatId: 'NG-VAT-4471029',
          }}
          party={{ name: draft.customer, address: draft.showroom, contact: draft.email }}
          meta={[
            { label: 'Issue date', value: '24 Aug 2026' },
            { label: 'Payment due', value: '23 Sep 2026' },
            { label: 'From pro-forma', value: draft.proforma || '—', mono: true },
          ]}
          columns={[
            { key: 'product', label: 'Description' },
            { key: 'qty', label: 'Qty', align: 'right', mono: true },
            { key: 'unit', label: 'Unit' },
            { key: 'price', label: 'Unit price', align: 'right', mono: true },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          lines={lines.map((l) => ({ ...l, qty: fmt(l.qty), price: money(l.price), amount: money(l.qty * l.price) }))}
          totals={[
            { label: 'Subtotal', value: money(subtotal) },
            { label: 'VAT at 7.5%', value: money(vat) },
            { label: 'Total payable', value: money(subtotal + vat), emphasis: true },
          ]}
          stamp={<Badge tone="info" uppercase>Issued</Badge>}
          footer="Issued under ZifIQ internal digital invoicing. This document is not transmitted to the NRS/FIRS Merchant-Buyer Solution and carries no Invoice Reference Number or cryptographic stamp in this phase."
        />
      </div>
    </Page>
  )
}

export default function InvoiceGeneration({ leaf, moduleLabel, parentLabel }) {
  const [source, setSource] = useState('proforma')
  const [issued, setIssued] = useState(null)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const drafts = allInvoices.filter((i) => i.status === 'Draft')
  const draft = drafts[0]
  const vatConfig = vatSettings.find((v) => v.showroom === draft.showroom)

  if (issued) return <IssuedInvoice draft={draft} crumbs={crumbs} onBack={() => setIssued(null)} />

  const lines = invoiceLines[draft.number] || []
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0)
  const vat = vatConfig?.enabled ? subtotal * (vatConfig.rate / 100) : 0

  const lineColumns = [
    { key: 'product', label: 'Product description', width: 280 },
    { key: 'qty', label: 'Quantity', width: 130, align: 'right', mono: true, render: (l) => fmt(l.qty) },
    { key: 'unit', label: 'Unit', width: 120 },
    { key: 'price', label: 'Unit price', width: 165, align: 'right', mono: true, render: (l) => money(l.price) },
    { key: 'amount', label: 'Amount', width: 175, align: 'right', mono: true, render: (l) => money(l.qty * l.price) },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Invoice Generation'}
      icon={leaf?.icon}
      description="Invoices generate automatically when a POS sale completes, and can be raised manually from a confirmed pro-forma. Each carries a unique sequential number and the VAT configured for the issuing showroom."
      submitLabel="Issue invoice"
      onSubmit={() => setIssued(true)}
      onCancel={() => {}}
      note="Once issued, the amount, line items and VAT are locked. Corrections are made through a linked credit note or by voiding and reissuing."
      aside={
        <>
          <Panel title="Invoice">
            <MetaRow label="Number" value={NEXT_NUMBER} mono />
            <MetaRow label="Customer" value={draft.customer} />
            <MetaRow label="Issuing showroom" value={draft.showroom} />
            <MetaRow label="Subtotal" value={money(subtotal)} mono />
            <MetaRow label={`VAT at ${vatConfig?.rate.toFixed(1)}%`} value={money(vat)} mono />
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total payable</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(subtotal + vat)}
              </div>
            </div>
          </Panel>

          <Callout tone="warning" icon="lock" title="Locked once issued">
            The invoice number is sequential and never reused. After issue, amount, items and VAT cannot be
            edited — only a credit note or a void-and-reissue can change what the customer owes.
          </Callout>

          <Panel title="Regulatory identifiers">
            <MetaRow label="Invoice Reference Number" value="Reserved" />
            <MetaRow label="Cryptographic Stamp ID" value="Reserved" />
            <MetaRow label="QR code" value="Reserved" />
            <MetaRow label="Access Point submission" value="Not in this phase" />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Icon name="info" size={13} color="var(--text-subtle)" style={{ marginTop: 2 }} />
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
                These fields exist in the invoice record so the module can extend to full NRS/FIRS compliance
                later without a schema redesign. Nothing is transmitted in this phase.
              </span>
            </div>
          </Panel>
        </>
      }
    >
      <Panel
        title="Source"
        description="Where this invoice originates. Every invoice stays traceable back to its POS sale or pro-forma."
        actions={<Segmented options={SOURCES} value={source} onChange={setSource} size="sm" />}
      >
        <FieldSet columns={3}>
          <Select
            label={source === 'pos' ? 'Completed POS sale' : 'Confirmed pro-forma'}
            options={source === 'pos'
              ? [{ value: 'TXN-4481', label: 'TXN-4481 — Bendel Stores' }]
              : [{ value: draft.proforma, label: `${draft.proforma} — ${draft.customer}` }]}
            value={source === 'pos' ? 'TXN-4481' : draft.proforma}
            onChange={() => {}}
          />
          <Input label="Invoice number" value={NEXT_NUMBER} onChange={() => {}} disabled hint="Sequential and non-reusable." />
          <Select label="Issuing showroom" options={showrooms} value="sr-lekki" onChange={() => {}} />
          <Input label="Issue date" type="date" />
          <Input label="Payment terms (days)" type="number" placeholder="30" />
          <Input label="Due date" type="date" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="info">{source === 'pos' ? 'Automatic on sale completion' : 'Manual from pro-forma'}</Badge>
          <Badge tone={vatConfig?.enabled ? 'success' : 'warning'}>
            VAT {vatConfig?.enabled ? `enabled at ${vatConfig.rate.toFixed(1)}%` : 'disabled for this showroom'}
          </Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Rate taken from VAT Control.</span>
        </div>
      </Panel>

      <Panel title="Buyer" description="Pulled from Customer Contacts and the Dealer Register where the buyer is registered.">
        <FieldSet columns={3}>
          <Input label="Customer" value={draft.customer} onChange={() => {}} disabled />
          <Input label="Customer type" value={draft.customerType} onChange={() => {}} disabled />
          <Input label="Email address" value={draft.email || ''} onChange={() => {}} disabled />
        </FieldSet>
      </Panel>

      <Panel title="Itemised lines" description="Descriptions, quantities and unit prices carried from the source document." padding={0}>
        <ReportTable
          columns={lineColumns}
          rows={lines}
          rowKey={(l) => l.product}
          totals={{ product: 'Subtotal', amount: money(subtotal) }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
