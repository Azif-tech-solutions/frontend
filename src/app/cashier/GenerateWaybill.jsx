import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { drivers } from '../sample.js'
import { openInvoices } from '../sampleCashier.js'
import { fmt, money } from '../utils.js'

function Waybill({ crumbs, onBack, invoice, lines, driver }) {
  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Customer waybill"
        icon="truck"
        description="Official document authorising release and transport of the goods. Hand it to the driver or the collecting customer."
        meta={<Badge tone="success">Released against {invoice.invoice}</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New waybill</Button>
            <Button variant="secondary" iconLeft="download">Download PDF</Button>
            <Button iconLeft="printer">Print waybill</Button>
          </>
        }
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Customer Waybill"
          docNumber="WB-9168"
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: 'Showroom Ikeja — 14 Awolowo Way, Ikeja, Lagos',
            contact: 'dispatch@zifiq.com · +234 802 000 0000',
            vatId: 'NG-VAT-4471029',
          }}
          party={{ name: invoice.customer, address: invoice.address, contact: invoice.contact }}
          meta={[
            { label: 'Against invoice', value: invoice.invoice, mono: true },
            { label: 'Driver', value: driver.label },
            { label: 'Release date', value: '24 Aug 2026' },
          ]}
          columns={[
            { key: 'product', label: 'Product description' },
            { key: 'qty', label: 'Qty released', align: 'right', mono: true },
            { key: 'unit', label: 'Unit' },
            { key: 'outstanding', label: 'Still outstanding', align: 'right', mono: true },
          ]}
          lines={lines}
          totals={[
            { label: 'Lines released', value: String(lines.length) },
            { label: 'Total quantity', value: fmt(lines.reduce((n, l) => n + Number(String(l.qty).replace(/,/g, '')), 0)), emphasis: true },
          ]}
          stamp={<Badge tone="warning" uppercase>For release</Badge>}
          footer="This waybill authorises release of the goods listed against the invoice shown. The receiving party must verify quantities on collection or delivery and sign before the goods leave the premises."
        />
      </div>
    </Page>
  )
}

export default function GenerateWaybill({ leaf, moduleLabel, parentLabel }) {
  const [step, setStep] = useState('compose')
  const [invoiceNo, setInvoiceNo] = useState('INV-31240')
  const [driverId, setDriverId] = useState('drv-1')
  const [release, setRelease] = useState({})

  const invoice = openInvoices.find((i) => i.invoice === invoiceNo) || openInvoices[0]
  const driver = drivers.find((d) => d.value === driverId) || drivers[0]

  function update(i, key, value) {
    setRelease((s) => ({ ...s, [`${invoice.invoice}-${i}`]: value }))
  }
  const releasedFor = (i) => release[`${invoice.invoice}-${i}`] ?? ''

  const rows = invoice.lines.map((l, i) => {
    const outstanding = l.purchased - l.supplied
    const now = Number(releasedFor(i)) || 0
    return {
      id: `${invoice.invoice}-${i}`,
      product: l.product,
      unit: l.unit,
      purchased: fmt(l.purchased),
      suppliedQty: fmt(l.supplied),
      outstandingQty: fmt(outstanding),
      releaseNow: releasedFor(i),
      remaining: fmt(outstanding - now),
      _outstanding: outstanding,
    }
  })

  // A release may never exceed what is still outstanding on the invoice.
  const errors = rows.map((r) => {
    const now = Number(r.releaseNow) || 0
    if (!now) return null
    if (now > r._outstanding) {
      return { field: 'releaseNow', message: `Only ${fmt(r._outstanding)} ${r.unit.toLowerCase()} remain outstanding on this line.` }
    }
    return null
  })

  const columns = [
    { key: 'product', label: 'Product', type: 'static', width: 260 },
    { key: 'purchased', label: 'Purchased', type: 'static', align: 'right', width: 125 },
    { key: 'suppliedQty', label: 'Already supplied', type: 'static', align: 'right', width: 160 },
    { key: 'outstandingQty', label: 'Outstanding', type: 'static', align: 'right', width: 140 },
    { key: 'releaseNow', label: 'Release now', type: 'number', width: 145, placeholder: '0' },
    { key: 'remaining', label: 'Will remain', type: 'static', align: 'right', width: 140 },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
  ]

  const totalPurchased = invoice.lines.reduce((n, l) => n + l.purchased, 0)
  const totalSupplied = invoice.lines.reduce((n, l) => n + l.supplied, 0)
  const totalOutstanding = totalPurchased - totalSupplied
  const releasing = rows.reduce((n, r) => n + (Number(r.releaseNow) || 0), 0)
  const invoiceValue = invoice.lines.reduce((n, l) => n + l.purchased * l.price, 0)
  const blocked = errors.some(Boolean)
  const fullySupplied = totalOutstanding === 0

  const historyColumns = [
    { key: 'waybill', label: 'Waybill no.', width: 130, mono: true },
    { key: 'date', label: 'Release date', width: 140 },
    { key: 'product', label: 'Product', width: 260 },
    { key: 'qty', label: 'Qty released', width: 140, align: 'right', mono: true, render: (h) => fmt(h.qty) },
    { key: 'driver', label: 'Driver', width: 170 },
    { key: 'receivedBy', label: 'Received by', width: 160 },
  ]

  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (step === 'waybill') {
    return (
      <Waybill
        crumbs={crumbs}
        invoice={invoice}
        driver={driver}
        lines={rows.filter((r) => Number(r.releaseNow) > 0).map((r) => ({
          product: r.product,
          qty: fmt(Number(r.releaseNow)),
          unit: r.unit,
          outstanding: fmt(r._outstanding - Number(r.releaseNow)),
        }))}
        onBack={() => { setStep('compose'); setRelease({}) }}
      />
    )
  }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Generate Waybill'}
      icon={leaf?.icon}
      description="Create a waybill on demand for goods bought but not yet collected. Look up the invoice to see what remains outstanding, release part or all of it, and review everything previously supplied against that invoice."
      submitLabel="Generate waybill"
      onCancel={() => {}}
      onSubmit={() => { if (!blocked && releasing > 0) setStep('waybill') }}
      note="Stock is released against the invoice only once the waybill is generated. Anything left unreleased stays outstanding for a later collection."
      aside={
        <>
          <Panel title="Invoice position">
            <MetaRow label="Invoice" value={invoice.invoice} mono />
            <MetaRow label="Customer" value={invoice.customer} />
            <MetaRow label="Invoice value" value={money(invoiceValue)} mono />
            <MetaRow label="Total purchased" value={fmt(totalPurchased)} mono />
            <MetaRow label="Already supplied" value={fmt(totalSupplied)} mono tone="positive" />
            <MetaRow label="Outstanding" value={fmt(totalOutstanding)} mono tone={totalOutstanding ? 'negative' : undefined} />
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Releasing now</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {fmt(releasing)}
              </div>
            </div>
            {blocked && (
              <Callout tone="danger" icon="circle-alert" title="Release exceeds outstanding" style={{ marginTop: 14 }}>
                One or more lines release more than remains on the invoice. Correct the quantity before generating.
              </Callout>
            )}
            {fullySupplied && (
              <Callout tone="success" icon="circle-check" title="Fully supplied" style={{ marginTop: 14 }}>
                Every line on this invoice has been released. No further waybill is required.
              </Callout>
            )}
          </Panel>

          <Panel title="Supply progress">
            <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
              <div style={{ width: `${(totalSupplied / totalPurchased) * 100}%`, height: '100%', background: 'var(--brand)' }} />
            </div>
            <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              {Math.round((totalSupplied / totalPurchased) * 100)}% of this invoice has been supplied across{' '}
              {new Set(invoice.history.map((h) => h.waybill)).size} waybill
              {new Set(invoice.history.map((h) => h.waybill)).size === 1 ? '' : 's'}.
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Find the invoice" description="Look up an invoice to see what has been supplied and what is still owed to the customer.">
        <FieldSet columns={3}>
          <Select
            label="Invoice number"
            options={openInvoices.map((i) => ({ value: i.invoice, label: `${i.invoice} — ${i.customer}` }))}
            value={invoiceNo}
            onChange={(e) => { setInvoiceNo(e.target.value); setRelease({}) }}
          />
          <Input label="Invoice date" value={invoice.date} onChange={() => {}} disabled />
          <Input label="Customer" value={invoice.customer} onChange={() => {}} disabled />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={invoice.customerType === 'Dealer' ? 'brand' : 'neutral'}>{invoice.customerType}</Badge>
          <Badge tone={totalOutstanding ? 'warning' : 'success'}>
            {totalOutstanding ? `${fmt(totalOutstanding)} outstanding` : 'Fully supplied'}
          </Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
            {invoice.address}
          </span>
        </div>
      </Panel>

      <Panel title="Release against this invoice" description="Enter how much of each outstanding line to release on this waybill.">
        <LineItems
          columns={columns}
          rows={rows}
          errors={errors}
          onChange={update}
          summary={[
            { label: 'Outstanding', value: fmt(totalOutstanding) },
            { label: 'Releasing', value: fmt(releasing) },
          ]}
        />
      </Panel>

      <Panel title="Driver & collection" description="Printed on the waybill and presented on delivery or collection.">
        <FieldSet columns={3}>
          <Select label="Driver" options={drivers} value={driverId} onChange={(e) => setDriverId(e.target.value)} />
          <Input label="Vehicle number" value={driver.vehicle} onChange={() => {}} />
          <Select
            label="Release method"
            options={[{ value: 'delivery', label: 'Delivery to customer' }, { value: 'collection', label: 'Customer collection' }]}
            placeholder="Select method…"
          />
          <Input label="Release date" type="date" />
          <Input label="Collected by" placeholder="Name of person collecting" />
          <Input label="Waybill no." placeholder="Auto-generated" disabled value="WB-9168" />
        </FieldSet>
      </Panel>

      <Panel
        title="Supply history"
        description={`Everything previously released against ${invoice.invoice}.`}
        padding={0}
      >
        {invoice.history.length === 0 ? (
          <EmptyState
            compact
            icon="truck"
            title="Nothing supplied yet"
            description="No goods have been released against this invoice. This will be the first waybill."
          />
        ) : (
          <ReportTable
            columns={historyColumns}
            rows={invoice.history}
            rowKey={(h, i) => `${h.waybill}-${i}`}
            totals={{ waybill: 'Total', qty: fmt(invoice.history.reduce((n, h) => n + h.qty, 0)) }}
            stickyHeader={false}
            style={{ border: 'none', borderRadius: 0 }}
          />
        )}
      </Panel>
    </FormShell>
  )
}
