// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Page, Panel, FieldSet, MetaRow, Callout, EmptyState } from '../shells/Page.jsx'
// import { PageHeader } from '../shells/PageHeader.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { DocumentSheet } from '../shells/DocumentView.jsx'
// import { drivers } from '../sample.js'
// import { openInvoices } from '../sampleCashier.js'
// import { fmt, money } from '../utils.js'

// function Waybill({ crumbs, onBack, invoice, lines, driver }) {
//   return (
//     <Page>
//       <PageHeader
//         crumbs={crumbs}
//         title="Customer waybill"
//         icon="truck"
//         description="Official document authorising release and transport of the goods. Hand it to the driver or the collecting customer."
//         meta={<Badge tone="success">Released against {invoice.invoice}</Badge>}
//         actions={
//           <>
//             <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New waybill</Button>
//             <Button variant="secondary" iconLeft="download">Download PDF</Button>
//             <Button iconLeft="printer">Print waybill</Button>
//           </>
//         }
//       />
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <DocumentSheet
//           docType="Customer Waybill"
//           docNumber="WB-9168"
//           issuer={{
//             name: 'ZifIQ Manufacturing Ltd',
//             address: 'Showroom Ikeja — 14 Awolowo Way, Ikeja, Lagos',
//             contact: 'dispatch@zifiq.com · +234 802 000 0000',
//             vatId: 'NG-VAT-4471029',
//           }}
//           party={{ name: invoice.customer, address: invoice.address, contact: invoice.contact }}
//           meta={[
//             { label: 'Against invoice', value: invoice.invoice, mono: true },
//             { label: 'Driver', value: driver.label },
//             { label: 'Release date', value: '24 Aug 2026' },
//           ]}
//           columns={[
//             { key: 'product', label: 'Product description' },
//             { key: 'qty', label: 'Qty released', align: 'right', mono: true },
//             { key: 'unit', label: 'Unit' },
//             { key: 'outstanding', label: 'Still outstanding', align: 'right', mono: true },
//           ]}
//           lines={lines}
//           totals={[
//             { label: 'Lines released', value: String(lines.length) },
//             { label: 'Total quantity', value: fmt(lines.reduce((n, l) => n + Number(String(l.qty).replace(/,/g, '')), 0)), emphasis: true },
//           ]}
//           stamp={<Badge tone="warning" uppercase>For release</Badge>}
//           footer="This waybill authorises release of the goods listed against the invoice shown. The receiving party must verify quantities on collection or delivery and sign before the goods leave the premises."
//         />
//       </div>
//     </Page>
//   )
// }

// export default function GenerateWaybill({ leaf, moduleLabel, parentLabel }) {
//   const [step, setStep] = useState('compose')
//   const [invoiceNo, setInvoiceNo] = useState('INV-31240')
//   const [driverId, setDriverId] = useState('drv-1')
//   const [release, setRelease] = useState({})

//   const invoice = openInvoices.find((i) => i.invoice === invoiceNo) || openInvoices[0]
//   const driver = drivers.find((d) => d.value === driverId) || drivers[0]

//   function update(i, key, value) {
//     setRelease((s) => ({ ...s, [`${invoice.invoice}-${i}`]: value }))
//   }
//   const releasedFor = (i) => release[`${invoice.invoice}-${i}`] ?? ''

//   const rows = invoice.lines.map((l, i) => {
//     const outstanding = l.purchased - l.supplied
//     const now = Number(releasedFor(i)) || 0
//     return {
//       id: `${invoice.invoice}-${i}`,
//       product: l.product,
//       unit: l.unit,
//       purchased: fmt(l.purchased),
//       suppliedQty: fmt(l.supplied),
//       outstandingQty: fmt(outstanding),
//       releaseNow: releasedFor(i),
//       remaining: fmt(outstanding - now),
//       _outstanding: outstanding,
//     }
//   })

//   // A release may never exceed what is still outstanding on the invoice.
//   const errors = rows.map((r) => {
//     const now = Number(r.releaseNow) || 0
//     if (!now) return null
//     if (now > r._outstanding) {
//       return { field: 'releaseNow', message: `Only ${fmt(r._outstanding)} ${r.unit.toLowerCase()} remain outstanding on this line.` }
//     }
//     return null
//   })

//   const columns = [
//     { key: 'product', label: 'Product', type: 'static', width: 260 },
//     { key: 'purchased', label: 'Purchased', type: 'static', align: 'right', width: 125 },
//     { key: 'suppliedQty', label: 'Already supplied', type: 'static', align: 'right', width: 160 },
//     { key: 'outstandingQty', label: 'Outstanding', type: 'static', align: 'right', width: 140 },
//     { key: 'releaseNow', label: 'Release now', type: 'number', width: 145, placeholder: '0' },
//     { key: 'remaining', label: 'Will remain', type: 'static', align: 'right', width: 140 },
//     { key: 'unit', label: 'Unit', type: 'static', width: 110 },
//   ]

//   const totalPurchased = invoice.lines.reduce((n, l) => n + l.purchased, 0)
//   const totalSupplied = invoice.lines.reduce((n, l) => n + l.supplied, 0)
//   const totalOutstanding = totalPurchased - totalSupplied
//   const releasing = rows.reduce((n, r) => n + (Number(r.releaseNow) || 0), 0)
//   const invoiceValue = invoice.lines.reduce((n, l) => n + l.purchased * l.price, 0)
//   const blocked = errors.some(Boolean)
//   const fullySupplied = totalOutstanding === 0

//   const historyColumns = [
//     { key: 'waybill', label: 'Waybill no.', width: 130, mono: true },
//     { key: 'date', label: 'Release date', width: 140 },
//     { key: 'product', label: 'Product', width: 260 },
//     { key: 'qty', label: 'Qty released', width: 140, align: 'right', mono: true, render: (h) => fmt(h.qty) },
//     { key: 'driver', label: 'Driver', width: 170 },
//     { key: 'receivedBy', label: 'Received by', width: 160 },
//   ]

//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (step === 'waybill') {
//     return (
//       <Waybill
//         crumbs={crumbs}
//         invoice={invoice}
//         driver={driver}
//         lines={rows.filter((r) => Number(r.releaseNow) > 0).map((r) => ({
//           product: r.product,
//           qty: fmt(Number(r.releaseNow)),
//           unit: r.unit,
//           outstanding: fmt(r._outstanding - Number(r.releaseNow)),
//         }))}
//         onBack={() => { setStep('compose'); setRelease({}) }}
//       />
//     )
//   }

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Generate Waybill'}
//       icon={leaf?.icon}
//       description="Create a waybill on demand for goods bought but not yet collected. Look up the invoice to see what remains outstanding, release part or all of it, and review everything previously supplied against that invoice."
//       submitLabel="Generate waybill"
//       onCancel={() => {}}
//       onSubmit={() => { if (!blocked && releasing > 0) setStep('waybill') }}
//       note="Stock is released against the invoice only once the waybill is generated. Anything left unreleased stays outstanding for a later collection."
//       aside={
//         <>
//           <Panel title="Invoice position">
//             <MetaRow label="Invoice" value={invoice.invoice} mono />
//             <MetaRow label="Customer" value={invoice.customer} />
//             <MetaRow label="Invoice value" value={money(invoiceValue)} mono />
//             <MetaRow label="Total purchased" value={fmt(totalPurchased)} mono />
//             <MetaRow label="Already supplied" value={fmt(totalSupplied)} mono tone="positive" />
//             <MetaRow label="Outstanding" value={fmt(totalOutstanding)} mono tone={totalOutstanding ? 'negative' : undefined} />
//             <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Releasing now</div>
//               <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
//                 {fmt(releasing)}
//               </div>
//             </div>
//             {blocked && (
//               <Callout tone="danger" icon="circle-alert" title="Release exceeds outstanding" style={{ marginTop: 14 }}>
//                 One or more lines release more than remains on the invoice. Correct the quantity before generating.
//               </Callout>
//             )}
//             {fullySupplied && (
//               <Callout tone="success" icon="circle-check" title="Fully supplied" style={{ marginTop: 14 }}>
//                 Every line on this invoice has been released. No further waybill is required.
//               </Callout>
//             )}
//           </Panel>

//           <Panel title="Supply progress">
//             <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
//               <div style={{ width: `${(totalSupplied / totalPurchased) * 100}%`, height: '100%', background: 'var(--brand)' }} />
//             </div>
//             <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//               {Math.round((totalSupplied / totalPurchased) * 100)}% of this invoice has been supplied across{' '}
//               {new Set(invoice.history.map((h) => h.waybill)).size} waybill
//               {new Set(invoice.history.map((h) => h.waybill)).size === 1 ? '' : 's'}.
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Find the invoice" description="Look up an invoice to see what has been supplied and what is still owed to the customer.">
//         <FieldSet columns={3}>
//           <Select
//             label="Invoice number"
//             options={openInvoices.map((i) => ({ value: i.invoice, label: `${i.invoice} — ${i.customer}` }))}
//             value={invoiceNo}
//             onChange={(e) => { setInvoiceNo(e.target.value); setRelease({}) }}
//           />
//           <Input label="Invoice date" value={invoice.date} onChange={() => {}} disabled />
//           <Input label="Customer" value={invoice.customer} onChange={() => {}} disabled />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone={invoice.customerType === 'Dealer' ? 'brand' : 'neutral'}>{invoice.customerType}</Badge>
//           <Badge tone={totalOutstanding ? 'warning' : 'success'}>
//             {totalOutstanding ? `${fmt(totalOutstanding)} outstanding` : 'Fully supplied'}
//           </Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
//             {invoice.address}
//           </span>
//         </div>
//       </Panel>

//       <Panel title="Release against this invoice" description="Enter how much of each outstanding line to release on this waybill.">
//         <LineItems
//           columns={columns}
//           rows={rows}
//           errors={errors}
//           onChange={update}
//           summary={[
//             { label: 'Outstanding', value: fmt(totalOutstanding) },
//             { label: 'Releasing', value: fmt(releasing) },
//           ]}
//         />
//       </Panel>

//       <Panel title="Driver & collection" description="Printed on the waybill and presented on delivery or collection.">
//         <FieldSet columns={3}>
//           <Select label="Driver" options={drivers} value={driverId} onChange={(e) => setDriverId(e.target.value)} />
//           <Input label="Vehicle number" value={driver.vehicle} onChange={() => {}} />
//           <Select
//             label="Release method"
//             options={[{ value: 'delivery', label: 'Delivery to customer' }, { value: 'collection', label: 'Customer collection' }]}
//             placeholder="Select method…"
//           />
//           <Input label="Release date" type="date" />
//           <Input label="Collected by" placeholder="Name of person collecting" />
//           <Input label="Waybill no." placeholder="Auto-generated" disabled value="WB-9168" />
//         </FieldSet>
//       </Panel>

//       <Panel
//         title="Supply history"
//         description={`Everything previously released against ${invoice.invoice}.`}
//         padding={0}
//       >
//         {invoice.history.length === 0 ? (
//           <EmptyState
//             compact
//             icon="truck"
//             title="Nothing supplied yet"
//             description="No goods have been released against this invoice. This will be the first waybill."
//           />
//         ) : (
//           <ReportTable
//             columns={historyColumns}
//             rows={invoice.history}
//             rowKey={(h, i) => `${h.waybill}-${i}`}
//             totals={{ waybill: 'Total', qty: fmt(invoice.history.reduce((n, h) => n + h.qty, 0)) }}
//             stickyHeader={false}
//             style={{ border: 'none', borderRadius: 0 }}
//           />
//         )}
//       </Panel>
//     </FormShell>
//   )
// }
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, fmtDate } from '../utils.js'
// Assumption: the waybill methods (createWaybill, listWaybills, ...) live in CashierApi.
// If they are in another API class, change this import and the `waybillApi` line below.
import CashierApi from '../../api/CashierApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const cashierApi = new CashierApi()
const waybillApi = cashierApi
const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 20

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const pretty = (s) =>
  String(s || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const today = () => new Date().toISOString().slice(0, 10)

// Backend release-method values. Change here if the API expects different strings.
const RELEASE_METHODS = [
  { value: 'DELIVERY', label: 'Delivery to customer' },
  { value: 'COLLECTION', label: 'Customer collection' },
]

const WAYBILL_STATUS_TONE = {
  ISSUED: 'warning',
  ACKNOWLEDGED: 'success',
  RECEIVED: 'success',
  CANCELLED: 'neutral',
}

const waybillTone = (s) => WAYBILL_STATUS_TONE[String(s || '').toUpperCase()] || 'neutral'

// Backend status values. Adjust if the API uses different strings.
const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'ISSUED', label: 'Issued' },
  { value: 'ACKNOWLEDGED', label: 'Acknowledged' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

/* ------------------------------------------------------------------ */
/*  Printable waybill (shown after one is created)                     */
/* ------------------------------------------------------------------ */
function WaybillView({ crumbs, waybill, onNew, onList }) {
  const against = waybill.invoiceNumber || waybill.saleRef
  const isDelivery = String(waybill.releaseMethod || '').toUpperCase() === 'DELIVERY'
  const lines = (waybill.lines || []).map((l) => ({
    product: l.product || l.stockItem?.name || '—',
    qty: fmt(l.quantity || 0),
    unit: l.unit || '—',
    outstanding: fmt(l.stillOutstanding || 0),
  }))

  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title="Customer waybill"
        icon="truck"
        description="Official document authorising release and transport of the goods. Hand it to the driver or the collecting customer."
        meta={<Badge tone="success">Released against {against}</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onList}>
              Back to list
            </Button>
            {onNew && (
              <Button variant="secondary" iconLeft="plus" onClick={onNew}>
                New waybill
              </Button>
            )}
            <Button iconLeft="printer" onClick={() => window.print()}>
              Print waybill
            </Button>
          </>
        }
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Customer Waybill"
          docNumber={waybill.ref}
          issuer={{
            name: 'ZifIQ Manufacturing Ltd',
            address: waybill.location?.name || '',
            contact: waybill.issuedBy?.email || '',
            vatId: '',
          }}
          party={{
            name: waybill.customerName,
            address: isDelivery ? waybill.deliveryAddress : '',
            contact: '',
          }}
          meta={[
            { label: 'Against', value: against, mono: true },
            isDelivery
              ? { label: 'Driver', value: `${waybill.driverName || '—'}${waybill.vehicleNumber ? ` · ${waybill.vehicleNumber}` : ''}` }
              : { label: 'Collected by', value: waybill.collectedBy || '—' },
            { label: 'Release date', value: waybill.releaseDate ? fmtDate(waybill.releaseDate) : '—' },
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
            {
              label: 'Total quantity',
              value: fmt((waybill.lines || []).reduce((n, l) => n + (Number(l.quantity) || 0), 0)),
              emphasis: true,
            },
          ]}
          stamp={<Badge tone={waybillTone(waybill.status)} uppercase>{pretty(waybill.status) || 'Issued'}</Badge>}
          footer="This waybill authorises release of the goods listed against the sale or invoice shown. The receiving party must verify quantities on collection or delivery and sign before the goods leave the premises."
        />
      </div>
    </Page>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
function NewWaybillForm({ crumbs, onBack }) {
  const { showToast } = useStore()

  const [created, setCreated] = useState(null)

  /* ---- sale lookup ---- */
  const [saleSearchInput, setSaleSearchInput] = useState('')
  const [saleSearch, setSaleSearch] = useState('')
  const [saleOptions, setSaleOptions] = useState([])
  const [loadingSales, setLoadingSales] = useState(false)
  const [saleId, setSaleId] = useState('')
  const [sale, setSale] = useState(null)
  const [loadingSale, setLoadingSale] = useState(false)

  /* ---- supply history (waybills already raised on this sale) ---- */
  const [history, setHistory] = useState([])

  /* ---- drivers ---- */
  const [drivers, setDrivers] = useState([])

  /* ---- form ---- */
  const [release, setRelease] = useState({}) // lineNo -> string
  const [releaseMethod, setReleaseMethod] = useState('DELIVERY')
  const [releaseDate, setReleaseDate] = useState(today())
  const [driverId, setDriverId] = useState('')
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [collectedBy, setCollectedBy] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isDelivery = releaseMethod === 'DELIVERY'

  // Debounce the sale search box
  useEffect(() => {
    const t = setTimeout(() => setSaleSearch(saleSearchInput.trim()), 300)
    return () => clearTimeout(t)
  }, [saleSearchInput])

  // Search completed sales (matches transaction or invoice number)
  useEffect(() => {
    let cancelled = false
    setLoadingSales(true)
    const q = { status: 'COMPLETED', page: 0, size: 20 }
    if (saleSearch) q.ref = saleSearch
    cashierApi
      .listSales(q)
      .then((res) => {
        if (cancelled) return
        setSaleOptions(res?.data?.items || [])
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load sales', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingSales(false)
      })
    return () => {
      cancelled = true
    }
  }, [saleSearch, showToast])

  // Load drivers once
  useEffect(() => {
    let cancelled = false
    inventoryApi
      .listDrivers({ page: 0, size: 100 })
      .then((res) => {
        if (cancelled) return
        setDrivers(
          (res?.data?.items || []).filter((d) => !d.status || String(d.status).toUpperCase() === 'ACTIVE')
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load drivers', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  const loadHistory = useCallback(
    async (id) => {
      try {
        const res = await waybillApi.listWaybills({ saleId: id, page: 0, size: 100 })
        setHistory(res?.data?.items || [])
      } catch (e) {
        setHistory([])
        showToast('Could not load supply history', e.message, true)
      }
    },
    [showToast]
  )

  const selectSale = useCallback(
    async (id) => {
      setSaleId(id)
      setRelease({})
      setSale(null)
      setHistory([])
      if (!id) return
      setLoadingSale(true)
      try {
        const res = await cashierApi.getSale(id)
        setSale(res.data)
        setDeliveryAddress('')
        loadHistory(id)
      } catch (e) {
        showToast('Could not load sale', e.message, true)
      } finally {
        setLoadingSale(false)
      }
    },
    [showToast, loadHistory]
  )

  function onDriverChange(id) {
    setDriverId(id)
    const d = drivers.find((x) => x.id === id)
    setVehicleNumber(d?.vehicleNumber || '')
  }

  /* ---- derived ---- */
  const saleLines = sale?.lines || []
  const releasedFor = (l) => release[l.lineNo] ?? ''

  const rows = saleLines.map((l) => {
    const outstanding = Number(l.outstanding) || 0
    const now = Number(releasedFor(l)) || 0
    return {
      id: String(l.lineNo),
      product: l.name || l.stockItem?.name || '—',
      unit: l.unit || '—',
      purchased: fmt(l.quantity || 0),
      suppliedQty: fmt(l.supplied || 0),
      outstandingQty: fmt(outstanding),
      releaseNow: releasedFor(l),
      remaining: fmt(outstanding - now),
      _outstanding: outstanding,
      _line: l,
    }
  })

  // A release may never exceed what is still outstanding on the line.
  const errors = rows.map((r) => {
    const now = Number(r.releaseNow) || 0
    if (!now) return null
    if (now < 0) return { field: 'releaseNow', message: 'Quantity cannot be negative.' }
    if (now > r._outstanding) {
      return {
        field: 'releaseNow',
        message: `Only ${fmt(r._outstanding)} ${String(r.unit).toLowerCase()} remain outstanding on this line.`,
      }
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

  function update(i, key, value) {
    const l = rows[i]?._line
    if (!l) return
    setRelease((s) => ({ ...s, [l.lineNo]: value }))
  }

  const totalPurchased = saleLines.reduce((n, l) => n + (Number(l.quantity) || 0), 0)
  const totalSupplied = saleLines.reduce((n, l) => n + (Number(l.supplied) || 0), 0)
  const totalOutstanding = saleLines.reduce((n, l) => n + (Number(l.outstanding) || 0), 0)
  const releasing = rows.reduce((n, r) => n + (Number(r.releaseNow) || 0), 0)
  const blocked = errors.some(Boolean)
  const fullySupplied = !!sale && totalOutstanding === 0
  const activeHistory = history.filter((h) => String(h.status).toUpperCase() !== 'CANCELLED')

  const missing = []
  if (!sale) missing.push('Select a sale')
  if (sale && releasing <= 0) missing.push('Quantity to release on at least one line')
  if (blocked) missing.push('Fix quantities above the outstanding amount')
  if (!releaseDate) missing.push('Release date')
  if (isDelivery && !driverId) missing.push('Driver')
  if (isDelivery && !vehicleNumber.trim()) missing.push('Vehicle number')
  if (isDelivery && !deliveryAddress.trim()) missing.push('Delivery address')
  if (!isDelivery && !collectedBy.trim()) missing.push('Name of person collecting')
  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const body = {
        saleId: sale.id,
        releaseMethod,
        releaseDate,
        driverId: isDelivery ? driverId : '',
        vehicleNumber: isDelivery ? vehicleNumber.trim() : '',
        collectedBy: isDelivery ? '' : collectedBy.trim(),
        deliveryAddress: isDelivery ? deliveryAddress.trim() : '',
        lines: rows
          .filter((r) => Number(r.releaseNow) > 0)
          .map((r) => ({
            // The API wants a saleLineId but sale lines don't return one yet,
            // so the line number is used for now. Swap to r._line.id once it exists.
            saleLineId: String(r._line.lineNo),
            quantity: Number(r.releaseNow),
            fromLocationId: sale.location?.id,
          })),
      }
      const res = await waybillApi.createWaybill(body)
      showToast('Waybill generated', `${res?.data?.ref || 'The waybill'} has been issued.`)
      setCreated(res.data)
    } catch (e) {
      showToast('Could not generate waybill', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  function startAnother() {
    const id = saleId
    setCreated(null)
    setRelease({})
    setCollectedBy('')
    setDeliveryAddress('')
    // Reload so outstanding quantities and history reflect the waybill just raised
    if (id) selectSale(id)
  }

  const historyColumns = [
    { key: 'ref', label: 'Waybill no.', width: 130, mono: true },
    {
      key: 'releaseDate',
      label: 'Release date',
      width: 140,
      render: (h) => (h.releaseDate ? fmtDate(h.releaseDate) : '—'),
    },
    {
      key: 'method',
      label: 'Method',
      width: 160,
      render: (h) => pretty(h.releaseMethod) || '—',
    },
    {
      key: 'who',
      label: 'Driver / collected by',
      width: 200,
      render: (h) => h.driverName || h.collectedBy || '—',
    },
    { key: 'units', label: 'Units', width: 110, align: 'right', mono: true, render: (h) => fmt(h.units || 0) },
    {
      key: 'status',
      label: 'Status',
      width: 140,
      render: (h) => <Badge tone={waybillTone(h.status)}>{pretty(h.status) || '—'}</Badge>,
    },
  ]

  if (created) {
    return <WaybillView crumbs={crumbs} waybill={created} onNew={startAnother} onList={onBack} />
  }

  const saleSelectOptions = [
    { value: '', label: loadingSales ? 'Loading…' : 'Select a sale…' },
    ...saleOptions.map((s) => ({
      value: s.id,
      label: `${s.ref}${s.invoiceNumber ? ` · ${s.invoiceNumber}` : ''} — ${s.customerName || s.customer?.name || '—'}`,
    })),
  ]

  const driverOptions = [
    { value: '', label: 'Select driver…' },
    ...drivers.map((d) => ({ value: d.id, label: `${d.name}${d.vehicleNumber ? ` · ${d.vehicleNumber}` : ''}` })),
  ]

  return (
    <>
      {(submitting || loadingSale) && (
        <Loader overlay label={submitting ? 'Generating waybill…' : 'Loading sale…'} />
      )}
      <FormShell
        wide
        crumbs={crumbs}
        title="New waybill"
        icon="truck"
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        }
        description="Create a waybill on demand for goods bought but not yet collected. Look up the sale to see what remains outstanding, release part or all of it, and review everything previously supplied against it."
        submitLabel="Generate waybill"
        onCancel={onBack}
        onSubmit={submit}
        submitDisabled={!canSubmit}
        note="Stock is released against the sale only once the waybill is generated. Anything left unreleased stays outstanding for a later collection."
        aside={
          <>
            <Panel title="Sale position">
              {sale ? (
                <>
                  <MetaRow label="Sale" value={sale.ref} mono />
                  {sale.invoiceNumber && <MetaRow label="Invoice" value={sale.invoiceNumber} mono />}
                  <MetaRow label="Customer" value={sale.customerName || sale.customer?.customer?.name || '—'} />
                  <MetaRow label="Sale value" value={money(sale.totals?.total || 0)} mono />
                  <MetaRow label="Total purchased" value={fmt(totalPurchased)} mono />
                  <MetaRow label="Already supplied" value={fmt(totalSupplied)} mono tone="positive" />
                  <MetaRow
                    label="Outstanding"
                    value={fmt(totalOutstanding)}
                    mono
                    tone={totalOutstanding ? 'negative' : undefined}
                  />
                  <div
                    style={{
                      marginTop: 14,
                      padding: '14px 16px',
                      background: 'var(--brand-subtle)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div
                      style={{
                        font: 'var(--type-eyebrow)',
                        letterSpacing: 'var(--ls-widest)',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Releasing now
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)',
                        fontVariantNumeric: 'tabular-nums',
                        color: 'var(--text-strong)',
                      }}
                    >
                      {fmt(releasing)}
                    </div>
                  </div>
                  {blocked && (
                    <Callout tone="danger" icon="circle-alert" title="Release exceeds outstanding" style={{ marginTop: 14 }}>
                      One or more lines release more than remains on the sale. Correct the quantity before generating.
                    </Callout>
                  )}
                  {fullySupplied && (
                    <Callout tone="success" icon="circle-check" title="Fully supplied" style={{ marginTop: 14 }}>
                      Every line on this sale has been released. No further waybill is required.
                    </Callout>
                  )}
                </>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Select a sale to see what is outstanding.</div>
              )}
            </Panel>

            {sale && totalPurchased > 0 && (
              <Panel title="Supply progress">
                <div
                  style={{
                    height: 8,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-sunken)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, (totalSupplied / totalPurchased) * 100)}%`,
                      height: '100%',
                      background: 'var(--brand)',
                    }}
                  />
                </div>
                <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                  {Math.round((totalSupplied / totalPurchased) * 100)}% of this sale has been supplied across{' '}
                  {activeHistory.length} waybill{activeHistory.length === 1 ? '' : 's'}.
                </div>
              </Panel>
            )}
          </>
        }
      >
        {missing.length > 0 && sale && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these to enable “Generate waybill”"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}

        <Panel
          title="Find the sale"
          description="Search by transaction or invoice number, then pick the sale to see what has been supplied and what is still owed to the customer."
        >
          <FieldSet columns={3}>
            <Input
              label="Search"
              placeholder="Transaction or invoice number…"
              value={saleSearchInput}
              onChange={(e) => setSaleSearchInput(val(e))}
            />
            <Select
              label="Sale"
              options={saleSelectOptions}
              value={saleId}
              onChange={(v) => selectSale(val(v))}
            />
            <Input
              label="Sale date"
              value={sale?.saleDate ? fmtDate(sale.saleDate) : ''}
              onChange={() => {}}
              disabled
            />
          </FieldSet>
          {sale && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {sale.customer?.type && (
                <Badge tone={String(sale.customer.type).toUpperCase() === 'DEALER' ? 'brand' : 'neutral'}>
                  {pretty(sale.customer.type)}
                </Badge>
              )}
              <Badge tone={totalOutstanding ? 'warning' : 'success'}>
                {totalOutstanding ? `${fmt(totalOutstanding)} outstanding` : 'Fully supplied'}
              </Badge>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                {sale.location?.name || '—'}
              </span>
            </div>
          )}
        </Panel>

        {sale && (
          <>
            <Panel
              title="Release against this sale"
              description="Enter how much of each outstanding line to release on this waybill."
            >
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

            <Panel
              title="Release details"
              description="Printed on the waybill and presented on delivery or collection."
            >
              <FieldSet columns={3}>
                <Select
                  label="Release method *"
                  options={RELEASE_METHODS}
                  value={releaseMethod}
                  onChange={(v) => setReleaseMethod(val(v))}
                />
                <Input
                  label="Release date *"
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(val(e))}
                />
                <Input label="Waybill no." value="Auto-generated" onChange={() => {}} disabled />
                {isDelivery ? (
                  <>
                    <Select
                      label="Driver *"
                      options={driverOptions}
                      value={driverId}
                      onChange={(v) => onDriverChange(val(v))}
                    />
                    <Input
                      label="Vehicle number *"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(val(e))}
                    />
                    <Input
                      label="Delivery address *"
                      placeholder="Where the goods are going"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(val(e))}
                    />
                  </>
                ) : (
                  <Input
                    label="Collected by *"
                    placeholder="Name of person collecting"
                    value={collectedBy}
                    onChange={(e) => setCollectedBy(val(e))}
                  />
                )}
              </FieldSet>
            </Panel>

            <Panel
              title="Supply history"
              description={`Waybills already raised against ${sale.ref}.`}
              padding={0}
            >
              {history.length === 0 ? (
                <EmptyState
                  compact
                  icon="truck"
                  title="Nothing supplied yet"
                  description="No waybills exist for this sale. This will be the first one."
                />
              ) : (
                <ReportTable
                  columns={historyColumns}
                  rows={history}
                  rowKey={(h, i) => `${h.id || h.ref}-${i}`}
                  totals={{ ref: 'Total', units: fmt(activeHistory.reduce((n, h) => n + (Number(h.units) || 0), 0)) }}
                  stickyHeader={false}
                  style={{ border: 'none', borderRadius: 0 }}
                />
              )}
            </Panel>
          </>
        )}
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page — waybill register                                       */
/* ------------------------------------------------------------------ */
export default function Waybills({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list') // list | new | detail
  const [active, setActive] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // List state
  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [driverFilter, setDriverFilter] = useState('')

  // Lookups
  const [showrooms, setShowrooms] = useState([])
  const [drivers, setDrivers] = useState([])

  useEffect(() => {
    let cancelled = false
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        setShowrooms(
          (res.data || []).map((x) => ({ value: x.id, label: x.label || x.name || x.code }))
        )
      })
      .catch(() => {})
    inventoryApi
      .listDrivers({ page: 0, size: 100 })
      .then((res) => {
        if (cancelled) return
        setDrivers((res?.data?.items || []).map((d) => ({ value: d.id, label: d.name })))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setPage(0)
  }, [statusFilter, locationFilter, driverFilter])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (statusFilter) q.status = statusFilter
      if (locationFilter) q.locationId = locationFilter
      if (driverFilter) q.driverId = driverFilter
      const res = await waybillApi.listWaybills(q)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load waybills', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, locationFilter, driverFilter, showToast])

  useEffect(() => {
    load()
  }, [load])

  async function openWaybill(row) {
    setLoadingDetail(true)
    try {
      const res = await waybillApi.getWaybill(row.id)
      setActive(res.data)
      setMode('detail')
    } catch (e) {
      showToast('Could not load waybill', e.message, true)
    } finally {
      setLoadingDetail(false)
    }
  }

  function backToList() {
    setMode('list')
    setActive(null)
    load()
  }

  if (mode === 'new') {
    return <NewWaybillForm crumbs={crumbs} onBack={backToList} />
  }

  if (mode === 'detail' && active) {
    return (
      <WaybillView
        crumbs={crumbs}
        waybill={active}
        onList={backToList}
        onNew={() => setMode('new')}
      />
    )
  }

  const columns = [
    { key: 'ref', label: 'Waybill no.', width: 130, mono: true },
    {
      key: 'releaseDate',
      label: 'Release date',
      width: 130,
      render: (r) => (r.releaseDate ? fmtDate(r.releaseDate) : '—'),
    },
    { key: 'saleRef', label: 'Sale', width: 130, mono: true, render: (r) => r.saleRef || '—' },
    {
      key: 'invoiceNumber',
      label: 'Invoice',
      width: 130,
      mono: true,
      render: (r) => r.invoiceNumber || '—',
    },
    { key: 'customerName', label: 'Customer', width: 220, render: (r) => r.customerName || '—' },
    { key: 'location', label: 'Showroom', width: 170, render: (r) => r.location?.name || '—' },
    {
      key: 'releaseMethod',
      label: 'Method',
      width: 120,
      render: (r) => pretty(r.releaseMethod) || '—',
    },
    {
      key: 'who',
      label: 'Driver / collected by',
      width: 190,
      render: (r) => r.driverName || r.collectedBy || '—',
    },
    {
      key: 'units',
      label: 'Units',
      width: 90,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.units || 0),
    },
    {
      key: 'status',
      label: 'Status',
      width: 140,
      render: (r) => <Badge tone={waybillTone(r.status)}>{pretty(r.status) || '—'}</Badge>,
    },
  ]

  const unitsOnPage = rows.reduce((n, r) => n + (Number(r.units) || 0), 0)

  return (
    <>
      {(loading || loadingDetail) && (
        <Loader overlay label={loadingDetail ? 'Loading waybill…' : 'Loading waybills…'} />
      )}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Waybills'}
        icon={leaf?.icon || 'truck'}
        description="Every waybill released against a sale. Create a new one for goods bought but not yet collected, or open an existing waybill to view and print it."
        createLabel="New waybill"
        onCreate={() => setMode('new')}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        filters={
          <>
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 180 }}
            />
            <Select
              options={[{ value: '', label: 'All showrooms' }, ...showrooms]}
              value={locationFilter}
              onChange={(v) => setLocationFilter(val(v))}
              style={{ width: 200 }}
            />
            <Select
              options={[{ value: '', label: 'All drivers' }, ...drivers]}
              value={driverFilter}
              onChange={(v) => setDriverFilter(val(v))}
              style={{ width: 190 }}
            />
          </>
        }
        stats={[
          { label: 'Waybills', value: String(totalItems) },
          { label: 'Units (this page)', value: fmt(unitsOnPage) },
          { label: 'Latest', value: rows[0]?.releaseDate ? fmtDate(rows[0].releaseDate) : '—' },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={openWaybill}
        emptyTitle="No waybills found"
        emptyDescription="Create a new waybill, or adjust the filters above."
        footnote="Click a waybill to view and print it."
      />
    </>
  )
}