import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { factories, finishedProducts, transferDestinations, drivers, liveQuantities, recentTransfers } from '../sample.js'
import { fmt } from '../utils.js'

const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '' })

/** Step 2 — the waybill produced on completion, handed to the driver. */
function Waybill({ crumbs, onBack, lines, destination, driver }) {
  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Transfer waybill"
        icon="truck"
        description="Print and hand this document to the driver. It serves as the official transit document and is used to cross-check goods during offloading at the destination."
        meta={<Badge tone="success">Transfer confirmed · stock deducted from source</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New transfer</Button>
            <Button variant="secondary" iconLeft="download">Download PDF</Button>
            <Button iconLeft="printer">Print waybill</Button>
          </>
        }
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Transfer Waybill"
          docNumber="WB-8942"
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: 'Factory A — 12 Oba Akran Avenue, Ikeja, Lagos',
            contact: 'dispatch@zifiq.com · +234 802 000 0000',
            vatId: 'NG-VAT-4471029',
          }}
          party={{ name: destination.label, address: destination.address, contact: destination.kind }}
          meta={[
            { label: 'Driver', value: driver.label },
            { label: 'Vehicle no.', value: driver.vehicle, mono: true },
            { label: 'Dispatch date', value: '24 Aug 2026' },
          ]}
          columns={[
            { key: 'product', label: 'Product description' },
            { key: 'batch', label: 'Batch no.', mono: true },
            { key: 'qty', label: 'Quantity', align: 'right', mono: true },
            { key: 'unit', label: 'Unit', align: 'right' },
          ]}
          lines={lines}
          totals={[
            { label: 'Total lines', value: String(lines.length) },
            { label: 'Total quantity', value: fmt(lines.reduce((n, l) => n + Number(l.qty || 0), 0)), emphasis: true },
          ]}
          stamp={<Badge tone="warning" uppercase>In transit</Badge>}
          footer="This waybill is an official transit document and must be presented on demand to any law enforcement agency. The receiving officer should cross-check all quantities against this document during offloading and record any rejection before signing."
        />
      </div>
    </Page>
  )
}

export default function StockTransfer({ leaf, moduleLabel, parentLabel }) {
  const [step, setStep] = useState('compose')
  const [destId, setDestId] = useState('sr-ikeja')
  const [driverId, setDriverId] = useState('drv-1')
  const [rows, setRows] = useState([blank()])

  const destination = transferDestinations.find((d) => d.value === destId) || transferDestinations[0]
  const driver = drivers.find((d) => d.value === driverId) || drivers[0]

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const available = liveQuantities[r.product]
    const qty = Number(r.qty) || 0
    return {
      ...r,
      available: available != null ? fmt(available) : undefined,
      remaining: available != null && qty ? fmt(available - qty) : undefined,
      unit: r.product ? 'Cartons' : undefined,
    }
  })

  // Test Case 2 — a line may never exceed available stock at the source.
  const errors = rows.map((r) => {
    const available = liveQuantities[r.product]
    const qty = Number(r.qty) || 0
    if (!r.product || !qty || available == null) return null
    if (qty > available) return { field: 'qty', message: `Transfer quantity exceeds available stock at source (${fmt(available)} on hand).` }
    return null
  })

  const columns = [
    { key: 'product', label: 'Finished product', type: 'select', options: finishedProducts, width: 250, placeholder: 'Select product…' },
    { key: 'available', label: 'Available', type: 'static', align: 'right', width: 120 },
    { key: 'qty', label: 'Qty to transfer', type: 'number', width: 150, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'batch', label: 'Batch / lot no.', type: 'text', width: 160, placeholder: 'e.g. B-3390' },
    { key: 'remaining', label: 'Remaining at source', type: 'static', align: 'right', width: 170 },
  ]

  const active = rows.filter((r) => r.product)
  const totalQty = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)
  const blocked = errors.some(Boolean)

  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (step === 'waybill') {
    return (
      <Waybill
        crumbs={crumbs}
        destination={destination}
        driver={driver}
        lines={decorated.filter((r) => r.product).map((r) => ({
          product: finishedProducts.find((p) => p.value === r.product)?.label || r.product,
          batch: r.batch || '—',
          qty: fmt(Number(r.qty) || 0),
          unit: 'Cartons',
        }))}
        onBack={() => { setStep('compose'); setRows([blank()]) }}
      />
    )
  }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Transfer'}
      icon={leaf?.icon}
      description="Transfer finished products to outlets, showrooms and authorised dealers. Completing a transfer generates a waybill with a unique reference number for the driver."
      submitLabel="Confirm transfer"
      onCancel={() => {}}
      onSubmit={() => { if (!blocked && active.length) setStep('waybill') }}
      note="Stock is deducted from the source only once the transfer is confirmed. A waybill is generated automatically at that point."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Transfer summary">
            <MetaRow label="Product lines" value={active.length || '—'} mono />
            <MetaRow label="Total quantity" value={totalQty ? fmt(totalQty) : '—'} mono />
            <MetaRow label="Destination" value={destination.label} />
            <MetaRow label="Destination type" value={destination.kind} />
            {blocked && (
              <Callout tone="danger" icon="circle-alert" title="Transfer blocked" style={{ marginTop: 14 }}>
                One or more lines exceed the stock available at the source. No stock movement will be recorded until
                every quantity is within the available balance.
              </Callout>
            )}
          </Panel>

          <Panel title="Recent transfers" padding={0}>
            <div style={{ padding: '4px 16px 12px' }}>
              {recentTransfers.map((t) => (
                <div key={t.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.destination}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{t.ref} · {t.when} · {t.by}</div>
                  </div>
                  <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-muted)', flexShrink: 0 }}>{t.qty}</span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Route" description="Where the goods are leaving from and where they are going.">
        <FieldSet columns={3}>
          <Select label="Source factory" options={factories} value="fa" onChange={() => {}} />
          <Select
            label="Destination"
            options={transferDestinations}
            value={destId}
            onChange={(e) => setDestId(e.target.value)}
          />
          <Input label="Transfer date" type="date" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={destination.kind === 'Dealer' ? 'warning' : 'brand'}>{destination.kind}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
            {destination.address}
          </span>
        </div>
      </Panel>

      <Panel title="Driver & vehicle" description="Printed on the waybill and presented during transit.">
        <FieldSet columns={3}>
          <Select label="Driver" options={drivers} value={driverId} onChange={(e) => setDriverId(e.target.value)} />
          <Input label="Vehicle number" value={driver.vehicle} onChange={() => {}} />
          <Input label="Driver phone" placeholder="+234 …" />
        </FieldSet>
      </Panel>

      <Panel
        title="Items to transfer"
        description="Each line is checked against live stock at the source factory."
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
          emptyLabel="No products added yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Total qty', value: fmt(totalQty) },
          ]}
        />
      </Panel>
    </FormShell>
  )
}
