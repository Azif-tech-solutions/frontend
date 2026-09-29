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
import { showrooms, storageAreas, showroomStock, CURRENT_SHOWROOM } from '../sampleShowroom.js'
import { drivers } from '../sample.js'
import { fmt } from '../utils.js'

const stockOptions = showroomStock.map((s, i) => ({ value: String(i), label: `${s.detail} — ${s.area}` }))
const stockAt = (v) => (v === '' || v == null ? undefined : showroomStock[Number(v)])

const blank = () => ({ id: Math.random().toString(36).slice(2), item: '', qty: '' })

function Waybill({ crumbs, onBack, lines, destination, driver }) {
  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Transfer waybill"
        icon="truck"
        description="Hand this to the driver. It verifies the goods in transit and helps the receiving showroom confirm that quantities match what was dispatched."
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
          docType="Showroom Transfer Waybill"
          docNumber="TR-9014"
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: `${CURRENT_SHOWROOM} — 14 Awolowo Way, Ikeja, Lagos`,
            contact: 'ikeja@zifiq.com · +234 802 000 0000',
            vatId: 'NG-VAT-4471029',
          }}
          party={{ name: destination.label, address: destination.address, contact: 'Receiving showroom' }}
          meta={[
            { label: 'Driver', value: driver.label },
            { label: 'Vehicle no.', value: driver.vehicle, mono: true },
            { label: 'Dispatch date', value: '24 Aug 2026' },
          ]}
          columns={[
            { key: 'product', label: 'Product description' },
            { key: 'area', label: 'From area' },
            { key: 'qty', label: 'Quantity', align: 'right', mono: true },
            { key: 'unit', label: 'Unit', align: 'right' },
          ]}
          lines={lines}
          totals={[
            { label: 'Total lines', value: String(lines.length) },
            { label: 'Total quantity', value: fmt(lines.reduce((n, l) => n + Number(String(l.qty).replace(/,/g, '')), 0)), emphasis: true },
          ]}
          stamp={<Badge tone="warning" uppercase>In transit</Badge>}
          footer="The receiving showroom must cross-check every quantity against this document during offloading and record any shortfall or damage as a rejection before confirming receipt."
        />
      </div>
    </Page>
  )
}

export default function ShowroomTransfer({ leaf, moduleLabel, parentLabel }) {
  const [step, setStep] = useState('compose')
  const [destId, setDestId] = useState('sr-lekki')
  const [driverId, setDriverId] = useState('drv-2')
  const [rows, setRows] = useState([blank()])

  const destination = showrooms.find((s) => s.value === destId) || showrooms[1]
  const driver = drivers.find((d) => d.value === driverId) || drivers[0]

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const s = stockAt(r.item)
    const qty = Number(r.qty) || 0
    return {
      ...r,
      available: s ? fmt(s.qty) : undefined,
      area: s?.area,
      unit: s ? 'Cartons' : undefined,
      remaining: s && qty ? fmt(s.qty - qty) : undefined,
    }
  })

  const errors = rows.map((r) => {
    const s = stockAt(r.item)
    const qty = Number(r.qty) || 0
    if (!s || !qty) return null
    if (qty > s.qty) return { field: 'qty', message: `Exceeds stock available at this showroom (${fmt(s.qty)} on hand in ${s.area.toLowerCase()}).` }
    return null
  })

  const columns = [
    { key: 'item', label: 'Product & area', type: 'select', options: stockOptions, width: 300, placeholder: 'Select stock item…' },
    { key: 'available', label: 'Available', type: 'static', align: 'right', width: 120 },
    { key: 'qty', label: 'Qty to transfer', type: 'number', width: 150, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'remaining', label: 'Remaining here', type: 'static', align: 'right', width: 150 },
  ]

  const active = rows.filter((r) => r.item)
  const totalQty = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)
  const blocked = errors.some(Boolean)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (step === 'waybill') {
    return (
      <Waybill
        crumbs={crumbs}
        destination={destination}
        driver={driver}
        lines={decorated.filter((r) => r.item).map((r) => ({
          product: stockAt(r.item).detail,
          area: stockAt(r.item).area,
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
      title={leaf?.label || 'Showroom-To-Showroom Stock Transfer'}
      icon={leaf?.icon}
      description="Move stock from this showroom to another. Completing the transfer generates a waybill for the driver, used to verify goods in transit and on delivery."
      submitLabel="Confirm transfer"
      onCancel={() => {}}
      onSubmit={() => { if (!blocked && active.length) setStep('waybill') }}
      note="Stock is deducted from this showroom only once the transfer is confirmed, and is added to the destination only when they confirm receipt."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Transfer summary">
            <MetaRow label="From" value={CURRENT_SHOWROOM} />
            <MetaRow label="To" value={destination.label} />
            <MetaRow label="Product lines" value={active.length || '—'} mono />
            <MetaRow label="Total quantity" value={totalQty ? fmt(totalQty) : '—'} mono />
            {blocked && (
              <Callout tone="danger" icon="circle-alert" title="Transfer blocked" style={{ marginTop: 14 }}>
                One or more lines exceed the stock available here. No stock will move until every quantity is
                within the available balance.
              </Callout>
            )}
          </Panel>

          <Panel title="What happens next">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              A waybill is generated with a unique reference and handed to the driver. The destination showroom
              sees it under Receive Product, where they count the goods and record any rejection before confirming.
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Route" description="Where the goods are going and who is carrying them.">
        <FieldSet columns={3}>
          <Select label="Source showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
          <Select label="Destination showroom" options={showrooms.filter((s) => s.value !== 'sr-ikeja')} value={destId} onChange={(e) => setDestId(e.target.value)} />
          <Input label="Transfer date" type="date" />
          <Select label="Driver" options={drivers} value={driverId} onChange={(e) => setDriverId(e.target.value)} />
          <Input label="Vehicle number" value={driver.vehicle} onChange={() => {}} />
          <Select label="Dispatch from area" options={storageAreas} placeholder="Select area…" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">Showroom to showroom</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
            {destination.address}
          </span>
        </div>
      </Panel>

      <Panel
        title="Items to transfer"
        description="Each line is checked against live stock in the selected area."
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
