import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { VAT_RATE } from '../sample.js'
import { sellableProducts, quoteCustomers, proformaHistory } from '../sampleCashier.js'
import { fmt, money, moneyShort } from '../utils.js'

const PRICES = Object.fromEntries(sellableProducts.map((p) => [p.value, p.price]))
const STATUS_TONE = { Sent: 'info', Converted: 'success', Expired: 'neutral', Declined: 'danger' }

const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', discount: '' })

function ProformaDocument({ crumbs, onBack, customer, lines, subtotal, discount, vat, total }) {
  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Pro-forma invoice"
        icon="file-text"
        description="A preliminary quotation for the customer to review before payment or confirmation. It does not record a sale and no stock is committed."
        meta={<Badge tone="info">Quotation · not a tax invoice</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New quotation</Button>
            <Button variant="secondary" iconLeft="send">Email to customer</Button>
            <Button iconLeft="printer">Print</Button>
          </>
        }
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Pro-Forma Invoice"
          docNumber="PF-2215"
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: 'Showroom Ikeja — 14 Awolowo Way, Ikeja, Lagos',
            contact: 'sales@zifiq.com · +234 802 000 0000',
            vatId: 'NG-VAT-4471029',
          }}
          party={{ name: customer.label, address: customer.address, contact: customer.contact }}
          meta={[
            { label: 'Issue date', value: '24 Aug 2026' },
            { label: 'Valid until', value: '31 Aug 2026' },
            { label: 'Prepared by', value: 'F. Adeniyi' },
          ]}
          columns={[
            { key: 'product', label: 'Description' },
            { key: 'qty', label: 'Qty', align: 'right', mono: true },
            { key: 'unit', label: 'Unit' },
            { key: 'price', label: 'Unit price', align: 'right', mono: true },
            { key: 'amount', label: 'Amount', align: 'right', mono: true },
          ]}
          lines={lines}
          totals={[
            { label: 'Subtotal', value: money(subtotal) },
            ...(discount ? [{ label: 'Discount', value: `− ${money(discount)}` }] : []),
            { label: `VAT at ${(VAT_RATE * 100).toFixed(1)}%`, value: money(vat) },
            { label: 'Total payable', value: money(total), emphasis: true },
          ]}
          stamp={<Badge tone="warning" uppercase>Quotation</Badge>}
          footer="This pro-forma invoice is an estimate of the proposed transaction and is not a demand for payment. Prices hold until the validity date shown above, subject to stock availability at the time of confirmation."
        />
      </div>
    </Page>
  )
}

export default function ProFormaInvoice({ leaf, moduleLabel, parentLabel }) {
  const [step, setStep] = useState('compose')
  const [customerId, setCustomerId] = useState('cu-1')
  const [rows, setRows] = useState([blank()])

  const customer = quoteCustomers.find((c) => c.value === customerId) || quoteCustomers[0]

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const price = PRICES[r.product]
    const qty = Number(r.qty) || 0
    const disc = Number(r.discount) || 0
    const amount = price ? price * qty - disc : undefined
    return {
      ...r,
      unit: r.product ? 'Cartons' : undefined,
      price: price ? money(price) : undefined,
      amount: amount != null ? money(amount) : undefined,
    }
  })

  // A line discount may not exceed the line's own value.
  const errors = rows.map((r) => {
    const price = PRICES[r.product]
    const qty = Number(r.qty) || 0
    const disc = Number(r.discount) || 0
    if (!price || !qty || !disc) return null
    if (disc > price * qty) return { field: 'discount', message: `Discount exceeds the line value of ${money(price * qty)}.` }
    return null
  })

  const columns = [
    { key: 'product', label: 'Product', type: 'select', options: sellableProducts, width: 270, placeholder: 'Select product…' },
    { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'price', label: 'Unit price', type: 'static', align: 'right', width: 150 },
    { key: 'discount', label: 'Line discount (₦)', type: 'number', width: 170, placeholder: '0.00' },
    { key: 'amount', label: 'Amount', type: 'static', align: 'right', width: 160 },
  ]

  const active = rows.filter((r) => r.product)
  const subtotal = rows.reduce((n, r) => n + (PRICES[r.product] || 0) * (Number(r.qty) || 0), 0)
  const discount = rows.reduce((n, r) => n + (Number(r.discount) || 0), 0)
  const netAmount = subtotal - discount
  const vat = netAmount * VAT_RATE
  const total = netAmount + vat
  const blocked = errors.some(Boolean)

  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (step === 'document') {
    return (
      <ProformaDocument
        crumbs={crumbs}
        customer={customer}
        subtotal={subtotal}
        discount={discount}
        vat={vat}
        total={total}
        lines={decorated.filter((r) => r.product).map((r) => ({
          product: sellableProducts.find((p) => p.value === r.product)?.label || r.product,
          qty: fmt(Number(r.qty) || 0),
          unit: 'Cartons',
          price: money(PRICES[r.product]),
          amount: money(PRICES[r.product] * (Number(r.qty) || 0) - (Number(r.discount) || 0)),
        }))}
        onBack={() => { setStep('compose'); setRows([blank()]) }}
      />
    )
  }

  const historyColumns = [
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'date', label: 'Issued', width: 130 },
    { key: 'customer', label: 'Customer', width: 250 },
    { key: 'items', label: 'Items', width: 100, align: 'right', mono: true },
    { key: 'value', label: 'Value', width: 165, align: 'right', mono: true, render: (r) => money(r.value) },
    { key: 'validUntil', label: 'Valid until', width: 140 },
    {
      key: 'status', label: 'Status', width: 130,
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge>,
    },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Pro-Forma Invoice'}
      icon={leaf?.icon}
      description="Prepare a quotation for a customer before the sale — products, quantities, prices and terms — so they can review the proposed transaction before paying or confirming."
      submitLabel="Generate pro-forma"
      onCancel={() => {}}
      onSubmit={() => { if (!blocked && active.length) setStep('document') }}
      note="A pro-forma is an estimate only. No sale is recorded and no stock is committed until the customer confirms and payment is taken."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Quotation summary">
            <MetaRow label="Customer" value={customer.label} />
            <MetaRow label="Line items" value={active.length || '—'} mono />
            <MetaRow label="Subtotal" value={subtotal ? money(subtotal) : '—'} mono />
            <MetaRow label="Discount" value={discount ? `− ${money(discount)}` : '—'} mono tone={discount ? 'negative' : undefined} />
            <MetaRow label={`VAT at ${(VAT_RATE * 100).toFixed(1)}%`} value={vat ? money(vat) : '—'} mono />
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total payable</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(total)}
              </div>
            </div>
          </Panel>

          <Panel title="Quotations this period">
            <MetaRow label="Issued" value={proformaHistory.length} mono />
            <MetaRow label="Converted to sale" value={proformaHistory.filter((p) => p.status === 'Converted').length} mono tone="positive" />
            <MetaRow label="Value quoted" value={moneyShort(proformaHistory.reduce((n, p) => n + p.value, 0))} mono />
          </Panel>
        </>
      }
    >
      <Panel title="Customer" description="Who the quotation is addressed to.">
        <FieldSet columns={3}>
          <Select label="Customer" options={quoteCustomers} value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
          <Input label="Issue date" type="date" />
          <Input label="Valid until" type="date" hint="Prices hold until this date." />
          <Input label="Payment terms" placeholder="e.g. 50% deposit, balance on delivery" />
          <Input label="Delivery terms" placeholder="e.g. Delivered to customer warehouse" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="PF-2215" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={customer.type === 'Dealer' ? 'brand' : 'neutral'}>{customer.type}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{customer.address}</span>
        </div>
      </Panel>

      <Panel
        title="Quoted items"
        description="Prices default to the current selling price. Apply a line discount where terms have been agreed."
        actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
      >
        <LineItems
          columns={columns}
          rows={decorated}
          errors={errors}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add product"
          emptyLabel="No products quoted yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Total', value: money(total) },
          ]}
        />
      </Panel>

      <Panel title="Recent quotations" padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={proformaHistory}
          rowKey={(r) => r.ref}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
