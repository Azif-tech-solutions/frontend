// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { PageHeader } from '../shells/PageHeader.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { DocumentSheet } from '../shells/DocumentView.jsx'
// import { showrooms, storageAreas, showroomStock, CURRENT_SHOWROOM } from '../sampleShowroom.js'
// import { drivers } from '../sample.js'
// import { fmt } from '../utils.js'

// const stockOptions = showroomStock.map((s, i) => ({ value: String(i), label: `${s.detail} — ${s.area}` }))
// const stockAt = (v) => (v === '' || v == null ? undefined : showroomStock[Number(v)])

// const blank = () => ({ id: Math.random().toString(36).slice(2), item: '', qty: '' })

// function Waybill({ crumbs, onBack, lines, destination, driver }) {
//   return (
//     <Page>
//       <PageHeader
//         crumbs={crumbs}
//         title="Transfer waybill"
//         icon="truck"
//         description="Hand this to the driver. It verifies the goods in transit and helps the receiving showroom confirm that quantities match what was dispatched."
//         meta={<Badge tone="success">Transfer confirmed · stock deducted from source</Badge>}
//         actions={
//           <>
//             <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New transfer</Button>
//             <Button variant="secondary" iconLeft="download">Download PDF</Button>
//             <Button iconLeft="printer">Print waybill</Button>
//           </>
//         }
//       />
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <DocumentSheet
//           docType="Showroom Transfer Waybill"
//           docNumber="TR-9014"
//           issuer={{
//             name: 'ZifIQ Manufacturing Ltd',
//             address: `${CURRENT_SHOWROOM} — 14 Awolowo Way, Ikeja, Lagos`,
//             contact: 'ikeja@zifiq.com · +234 802 000 0000',
//             vatId: 'NG-VAT-4471029',
//           }}
//           party={{ name: destination.label, address: destination.address, contact: 'Receiving showroom' }}
//           meta={[
//             { label: 'Driver', value: driver.label },
//             { label: 'Vehicle no.', value: driver.vehicle, mono: true },
//             { label: 'Dispatch date', value: '24 Aug 2026' },
//           ]}
//           columns={[
//             { key: 'product', label: 'Product description' },
//             { key: 'area', label: 'From area' },
//             { key: 'qty', label: 'Quantity', align: 'right', mono: true },
//             { key: 'unit', label: 'Unit', align: 'right' },
//           ]}
//           lines={lines}
//           totals={[
//             { label: 'Total lines', value: String(lines.length) },
//             { label: 'Total quantity', value: fmt(lines.reduce((n, l) => n + Number(String(l.qty).replace(/,/g, '')), 0)), emphasis: true },
//           ]}
//           stamp={<Badge tone="warning" uppercase>In transit</Badge>}
//           footer="The receiving showroom must cross-check every quantity against this document during offloading and record any shortfall or damage as a rejection before confirming receipt."
//         />
//       </div>
//     </Page>
//   )
// }

// export default function ShowroomTransfer({ leaf, moduleLabel, parentLabel }) {
//   const [step, setStep] = useState('compose')
//   const [destId, setDestId] = useState('sr-lekki')
//   const [driverId, setDriverId] = useState('drv-2')
//   const [rows, setRows] = useState([blank()])

//   const destination = showrooms.find((s) => s.value === destId) || showrooms[1]
//   const driver = drivers.find((d) => d.value === driverId) || drivers[0]

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const s = stockAt(r.item)
//     const qty = Number(r.qty) || 0
//     return {
//       ...r,
//       available: s ? fmt(s.qty) : undefined,
//       area: s?.area,
//       unit: s ? 'Cartons' : undefined,
//       remaining: s && qty ? fmt(s.qty - qty) : undefined,
//     }
//   })

//   const errors = rows.map((r) => {
//     const s = stockAt(r.item)
//     const qty = Number(r.qty) || 0
//     if (!s || !qty) return null
//     if (qty > s.qty) return { field: 'qty', message: `Exceeds stock available at this showroom (${fmt(s.qty)} on hand in ${s.area.toLowerCase()}).` }
//     return null
//   })

//   const columns = [
//     { key: 'item', label: 'Product & area', type: 'select', options: stockOptions, width: 300, placeholder: 'Select stock item…' },
//     { key: 'available', label: 'Available', type: 'static', align: 'right', width: 120 },
//     { key: 'qty', label: 'Qty to transfer', type: 'number', width: 150, placeholder: '0' },
//     { key: 'unit', label: 'Unit', type: 'static', width: 110 },
//     { key: 'remaining', label: 'Remaining here', type: 'static', align: 'right', width: 150 },
//   ]

//   const active = rows.filter((r) => r.item)
//   const totalQty = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)
//   const blocked = errors.some(Boolean)
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (step === 'waybill') {
//     return (
//       <Waybill
//         crumbs={crumbs}
//         destination={destination}
//         driver={driver}
//         lines={decorated.filter((r) => r.item).map((r) => ({
//           product: stockAt(r.item).detail,
//           area: stockAt(r.item).area,
//           qty: fmt(Number(r.qty) || 0),
//           unit: 'Cartons',
//         }))}
//         onBack={() => { setStep('compose'); setRows([blank()]) }}
//       />
//     )
//   }

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Showroom-To-Showroom Stock Transfer'}
//       icon={leaf?.icon}
//       description="Move stock from this showroom to another. Completing the transfer generates a waybill for the driver, used to verify goods in transit and on delivery."
//       submitLabel="Confirm transfer"
//       onCancel={() => {}}
//       onSubmit={() => { if (!blocked && active.length) setStep('waybill') }}
//       note="Stock is deducted from this showroom only once the transfer is confirmed, and is added to the destination only when they confirm receipt."
//       secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
//       aside={
//         <>
//           <Panel title="Transfer summary">
//             <MetaRow label="From" value={CURRENT_SHOWROOM} />
//             <MetaRow label="To" value={destination.label} />
//             <MetaRow label="Product lines" value={active.length || '—'} mono />
//             <MetaRow label="Total quantity" value={totalQty ? fmt(totalQty) : '—'} mono />
//             {blocked && (
//               <Callout tone="danger" icon="circle-alert" title="Transfer blocked" style={{ marginTop: 14 }}>
//                 One or more lines exceed the stock available here. No stock will move until every quantity is
//                 within the available balance.
//               </Callout>
//             )}
//           </Panel>

//           <Panel title="What happens next">
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
//               A waybill is generated with a unique reference and handed to the driver. The destination showroom
//               sees it under Receive Product, where they count the goods and record any rejection before confirming.
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Route" description="Where the goods are going and who is carrying them.">
//         <FieldSet columns={3}>
//           <Select label="Source showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
//           <Select label="Destination showroom" options={showrooms.filter((s) => s.value !== 'sr-ikeja')} value={destId} onChange={(e) => setDestId(e.target.value)} />
//           <Input label="Transfer date" type="date" />
//           <Select label="Driver" options={drivers} value={driverId} onChange={(e) => setDriverId(e.target.value)} />
//           <Input label="Vehicle number" value={driver.vehicle} onChange={() => {}} />
//           <Select label="Dispatch from area" options={storageAreas} placeholder="Select area…" />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone="brand">Showroom to showroom</Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
//             {destination.address}
//           </span>
//         </div>
//       </Panel>

//       <Panel
//         title="Items to transfer"
//         description="Each line is checked against live stock in the selected area."
//         actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
//       >
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           errors={errors}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//           addLabel="Add product"
//           emptyLabel="No products added yet."
//           summary={[
//             { label: 'Lines', value: active.length },
//             { label: 'Total qty', value: fmt(totalQty) },
//           ]}
//         />
//       </Panel>
//     </FormShell>
//   )
// }


import { useState, useEffect, useRef } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { useStore } from '../store.jsx'
import { fmt, fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 50
const blank = () => ({ id: Math.random().toString(36).slice(2), item: '', qty: '', batch: '', fromArea: '' })
const today = () => new Date().toISOString().slice(0, 10)
const blankDriver = { name: '', phone: '', vehicleNumber: '', licenceNumber: '' }

/**
 * Direct-entry stock comes back as one row per entry line, so the same product
 * can appear several times. Group by product + location (the area it sits in),
 * adding the quantities and averaging the unit cost.
 */
function groupDirectEntries(entries, fallbackLocationId) {
  const map = new Map()
  for (const e of entries) {
    const stockItemId = e.stockItem?.id
    if (!stockItemId) continue
    const locationId = e.location?.id || fallbackLocationId
    const key = `${stockItemId}|${locationId}`
    const qty = Number(e.quantity) || 0
    const cost = Number(e.lineCost) || qty * (Number(e.unitCost) || 0)
    const existing = map.get(key)
    if (existing) {
      existing.quantity += qty
      existing.totalCost += cost
    } else {
      map.set(key, {
        id: key, // dropdown value
        stockItemId, // what the API wants
        name: e.product || e.stockItem?.name || 'Item',
        quantity: qty,
        totalCost: cost,
        unit: e.unit || '—',
        fromLocationId: locationId, // the area / location the stock is in
        locationName: e.location?.name || '',
      })
    }
  }
  return [...map.values()].map((g) => ({
    ...g,
    landingCost: g.quantity ? g.totalCost / g.quantity : 0,
  }))
}

/** Step 2 — the waybill produced on completion, handed to the driver. */
function Waybill({ crumbs, onBack, transfer, company }) {
  const { showToast } = useStore()
  const [busy, setBusy] = useState(null) // 'download' | 'print' | null
  const blobRef = useRef(null) // fetched once, reused by both buttons

  const lines = (transfer.lines || []).map((l) => ({
    product: l.stockItemName || l.stockItemCode,
    batch: l.batchNo || '—',
    qty: fmt(Number(l.qtySent) || 0),
    unit: l.unit || '',
  }))

  // Fetch the PDF from the waybillUrl the API returned.
  const getPdf = async () => {
    if (!blobRef.current) {
      const blob = await inventoryApi.fetchWaybillPdf(transfer.waybillUrl)
      blobRef.current = new Blob([blob], { type: 'application/pdf' })
    }
    return blobRef.current
  }

  const download = async () => {
    setBusy('download')
    try {
      const url = URL.createObjectURL(await getPdf())
      const a = document.createElement('a')
      a.href = url
      a.download = `${transfer.waybillRef || 'waybill'}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    } catch (error) {
      showToast('Could not download waybill', error.message, true)
    } finally {
      setBusy(null)
    }
  }

  const print = async () => {
    setBusy('print')
    try {
      const url = URL.createObjectURL(await getPdf())
      // Load the PDF into a hidden frame and open the print dialog.
      const frame = document.createElement('iframe')
      frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
      frame.src = url
      frame.onload = () => {
        try {
          frame.contentWindow.focus()
          frame.contentWindow.print()
        } catch {
          // Some browsers block printing from a frame — open the PDF so it can be printed from the viewer.
          window.open(url, '_blank')
        }
      }
      document.body.appendChild(frame)
      setTimeout(() => { frame.remove(); URL.revokeObjectURL(url) }, 60000)
    } catch (error) {
      showToast('Could not print waybill', error.message, true)
    } finally {
      setBusy(null)
    }
  }

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
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack} disabled={!!busy}>New transfer</Button>
            <Button variant="secondary" iconLeft="download" onClick={download} disabled={!!busy || !transfer.waybillUrl}>
              {busy === 'download' ? 'Preparing…' : 'Download PDF'}
            </Button>
            <Button iconLeft="printer" onClick={print} disabled={!!busy || !transfer.waybillUrl}>
              {busy === 'print' ? 'Preparing…' : 'Print waybill'}
            </Button>
          </>
        }
      />

      {busy && <Loader overlay label={busy === 'print' ? 'Preparing waybill for print…' : 'Downloading waybill…'} />}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <DocumentSheet
          docType="Showroom Transfer Waybill"
          docNumber={transfer.waybillRef}
          issuer={{
            name: company.name || '—',
            address: [transfer.sourceLocationName, company.address].filter(Boolean).join(' — '),
            contact: [company.email, company.phone].filter(Boolean).join(' · '),
            vatId: company.taxRegistrationNumber || '—',
          }}
          party={{
            name: transfer.destinationLocationName,
            address: '',
            contact: 'Receiving showroom',
          }}
          meta={[
            { label: 'Driver', value: transfer.driverName },
            { label: 'Vehicle no.', value: transfer.driverVehicle, mono: true },
            { label: 'Dispatch date', value: fmtDate(transfer.dispatchedAt || transfer.transferDate) },
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
            { label: 'Total quantity', value: fmt(Number(transfer.totalSent) || 0), emphasis: true },
          ]}
          stamp={<Badge tone="warning" uppercase>In transit</Badge>}
          footer="The receiving showroom must cross-check every quantity against this document during offloading and record any shortfall or damage as a rejection before confirming receipt."
        />
      </div>
    </Page>
  )
}

export default function ShowroomTransfer({ leaf, moduleLabel, parentLabel }) {
  const { showToast, company } = useStore()

  const [step, setStep] = useState('compose')
  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')
  const [defaultAreaId, setDefaultAreaId] = useState('') // the source showroom's default receiving area
  const [transferDate, setTransferDate] = useState(today)
  const [rows, setRows] = useState([blank()])

  const [showrooms, setShowrooms] = useState([]) // [{ value, label, areas }]
  const [showroomsLoading, setShowroomsLoading] = useState(true)

  const [items, setItems] = useState([]) // grouped direct-entry stock at the source showroom
  const [itemsLoading, setItemsLoading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const [drivers, setDrivers] = useState([])
  const [driversLoading, setDriversLoading] = useState(true)
  const [driverId, setDriverId] = useState('')
  const [showDriverForm, setShowDriverForm] = useState(false)
  const [newDriver, setNewDriver] = useState(blankDriver)
  const [savingDriver, setSavingDriver] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [transfer, setTransfer] = useState(null) // the confirmed transfer returned by the API

  // Load all drivers (paginated under the hood).
  useEffect(() => {
    let cancelled = false
    setDriversLoading(true)

    const loadAllDrivers = async () => {
      let page = 0
      let all = []
      let hasMore = true

      while (hasMore && !cancelled) {
        const { data } = await inventoryApi.listDrivers({ page, size: PAGE_SIZE })
        all = [...all, ...(data.items || [])]
        hasMore = (data.page + 1) < data.totalPages
        page++
      }

      if (!cancelled) setDrivers(all)
    }

    loadAllDrivers()
      .catch((error) => {
        if (!cancelled) showToast('Could not load drivers', error.message, true)
      })
      .finally(() => {
        if (!cancelled) setDriversLoading(false)
      })

    return () => { cancelled = true }
  }, [showToast])

  // Load all active showrooms (with their areas) once.
  useEffect(() => {
    let cancelled = false
    setShowroomsLoading(true)

    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        setShowrooms(
          (res.data || []).map((s) => ({
            value: s.id,
            label: s.label || s.name || s.code,
            areas: s.areas || [],
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load showrooms', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setShowroomsLoading(false)
      })

    return () => { cancelled = true }
  }, [showToast])

  // Load the source showroom's stock from the direct-entry list, grouped by product and area.
  useEffect(() => {
    if (!sourceId) {
      setItems([])
      return
    }

    let cancelled = false
    setItemsLoading(true)

    const load = async () => {
      let page = 0
      let entries = []
      let hasMore = true

      while (hasMore && !cancelled) {
        const { data } = await showroomApi.listDirectStockEntries({ locationId: sourceId, page, size: PAGE_SIZE })
        const pageItems = data?.items ?? []
        entries = [...entries, ...pageItems]
        hasMore = data?.totalPages != null ? page + 1 < data.totalPages : pageItems.length === PAGE_SIZE
        page += 1
      }
      return groupDirectEntries(entries, sourceId)
    }

    load()
      .then((all) => {
        if (!cancelled) setItems(all)
      })
      .catch((error) => {
        if (!cancelled) showToast('Could not load products', error.message, true)
      })
      .finally(() => {
        if (!cancelled) setItemsLoading(false)
      })

    return () => { cancelled = true }
  }, [sourceId, reloadKey, showToast])

  // The source showroom's default receiving area, used when a product's own area can't be matched.
  useEffect(() => {
    setDefaultAreaId('')
    if (!sourceId) return
    let cancelled = false
    showroomApi
      .retrieveShowroom(sourceId)
      .then((res) => { if (!cancelled) setDefaultAreaId(res.data?.defaultReceivingLocation?.id || '') })
      .catch(() => {})
    return () => { cancelled = true }
  }, [sourceId])

  // The product list belongs to one showroom, so a new source clears the old list
  // and any product already picked. The destination can't be the same showroom.
  const changeSource = (id) => {
    setSourceId(id)
    setItems([])
    setRows((rs) => rs.map((r) => ({ ...r, item: '', fromArea: '' })))
    if (id === destId) setDestId('')
  }

  const source = showrooms.find((s) => s.value === sourceId)
  const destination = showrooms.find((s) => s.value === destId)
  const sourceOptions = showrooms.map((s) => ({ value: s.value, label: s.label }))
  const destinationOptions = showrooms.filter((s) => s.value !== sourceId).map((s) => ({ value: s.value, label: s.label }))
  // The areas / locations of the current (source) showroom — what a line can be dispatched from.
  const areaSelectOptions = (() => {
    const opts = (source?.areas || []).map((a) => ({ value: a.id, label: a.name }))
    if (defaultAreaId && !opts.some((o) => o.value === defaultAreaId)) {
      opts.push({ value: defaultAreaId, label: 'Default area' })
    }
    return opts
  })()
  const areaIds = new Set(areaSelectOptions.map((o) => o.value))
  // The area a product is held in. Use the entry's own location when it is one of this
  // showroom's areas; otherwise fall back to the showroom's default area.
  const resolveArea = (item) =>
    item && areaIds.has(item.fromLocationId)
      ? item.fromLocationId
      : defaultAreaId || areaSelectOptions[0]?.value || ''

  const driverOptions = drivers.map((d) => ({ value: d.id, label: d.name }))
  const driver = drivers.find((d) => d.id === driverId)

  const productOptions = items.map((p) => ({
    value: p.id,
    label: p.locationName ? `${p.name} — ${p.locationName}` : p.name,
  }))
  const itemById = Object.fromEntries(items.map((p) => [p.id, p]))

  // Picking a product also selects the area it is dispatched from.
  function update(i, key, value) {
    setRows((rs) =>
      rs.map((r, ri) => {
        if (ri !== i) return r
        const next = { ...r, [key]: value }
        if (key === 'item') next.fromArea = resolveArea(itemById[value])
        return next
      }),
    )
  }

  const decorated = rows.map((r) => {
    const item = itemById[r.item]
    const available = item ? Number(item.quantity ?? 0) : undefined
    const qty = Number(r.qty) || 0
    return {
      ...r,
      available: available !== undefined ? fmt(available) : undefined,
      unit: item ? (item.unit || '—') : undefined,
      remaining: available !== undefined && qty ? fmt(available - qty) : undefined,
    }
  })

  // A line may never exceed available stock in its area.
  const errors = rows.map((r) => {
    const item = itemById[r.item]
    const qty = Number(r.qty) || 0
    if (!item || !qty) return null
    const available = Number(item.quantity ?? 0)
    if (qty > available) {
      return { field: 'qty', message: `Exceeds stock available at this showroom (${fmt(available)} on hand${item.locationName ? ` in ${item.locationName}` : ''}).` }
    }
    return null
  })

  const columns = [
    { key: 'item', label: 'Product', type: 'select', options: productOptions, width: 300, placeholder: sourceId ? 'Select stock item…' : 'Select source first' },
    { key: 'fromArea', label: 'From area', type: 'select', options: areaSelectOptions, width: 200, placeholder: 'Select area…' },
    { key: 'available', label: 'Available', type: 'static', align: 'right', width: 120 },
    { key: 'qty', label: 'Qty to transfer', type: 'number', width: 150, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'batch', label: 'Batch / lot no.', type: 'text', width: 160, placeholder: 'Optional' },
    { key: 'remaining', label: 'Remaining here', type: 'static', align: 'right', width: 150 },
  ]

  const active = rows.filter((r) => r.item)
  const totalQty = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)
  const blocked = errors.some(Boolean)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const saveDriver = async () => {
    const { name, phone, vehicleNumber, licenceNumber } = newDriver
    if (!name.trim() || !phone.trim() || !vehicleNumber.trim() || !licenceNumber.trim()) {
      showToast('Driver incomplete', 'Name, phone, vehicle number and licence number are all required.', true)
      return
    }
    setSavingDriver(true)
    try {
      const res = await inventoryApi.createDriver({
        name: name.trim(),
        phone: phone.trim(),
        vehicleNumber: vehicleNumber.trim(),
        licenceNumber: licenceNumber.trim(),
      })
      const created = res.data
      setDrivers((ds) => [...ds, created])
      setDriverId(created.id)
      setNewDriver(blankDriver)
      setShowDriverForm(false)
      showToast('Driver added', `${created.name} is selected for this transfer.`)
    } catch (error) {
      showToast('Could not add driver', error.message, true)
    } finally {
      setSavingDriver(false)
    }
  }

  const submit = async () => {
    if (!sourceId) { showToast('Select a source showroom', 'Choose the showroom the goods are leaving from.', true); return }
    if (!destId) { showToast('Select a destination showroom', 'Choose the showroom the goods are going to.', true); return }
    if (!driver) { showToast('Select a driver', 'Choose the driver, or add a new one.', true); return }
    if (!transferDate) { showToast('Transfer date missing', 'Pick the date of this transfer.', true); return }

    const valid = rows.filter((r) => r.item && Number(r.qty) > 0)
    if (!valid.length) { showToast('Nothing to transfer', 'Add at least one product line with a quantity.', true); return }
    if (blocked) { showToast('Transfer blocked', 'One or more lines exceed the stock available here.', true); return }
    if (valid.some((r) => !r.fromArea)) { showToast('Select a dispatch area', 'Choose the area each product is dispatched from.', true); return }

    setSubmitting(true)
    try {
      const res = await inventoryApi.createStockTransfer({
        sourceLocationId: sourceId,
        destinationLocationId: destId,
        driverId: driver.id,
        driverName: driver.name,
        driverVehicle: driver.vehicleNumber,
        transferDate,
        lines: valid.map((r) => {
          const it = itemById[r.item]
          return {
            stockItemId: it.stockItemId,
            quantity: Number(r.qty),
            unitPrice: Number(it.landingCost) || 0,
            // The area / location of the current showroom this line is dispatched from.
            fromLocationId: r.fromArea,
            batchNo: r.batch.trim(),
          }
        }),
      })
      const done = res.data
      setTransfer(done)
      showToast(`Transfer confirmed — ${done.waybillRef}`, `${valid.length} line${valid.length === 1 ? '' : 's'} dispatched to ${done.destinationLocationName}`)
      setStep('waybill')
    } catch (error) {
      showToast('Transfer failed', error.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'waybill' && transfer) {
    return (
      <Waybill
        crumbs={crumbs}
        transfer={transfer}
        company={company}
        onBack={() => {
          setStep('compose')
          setRows([blank()])
          setTransfer(null)
          setReloadKey((k) => k + 1) // refresh the "Available" figures
        }}
      />
    )
  }

  return (
    <>
      {submitting && <Loader overlay label="Confirming transfer…" />}
      <FormShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Showroom-To-Showroom Stock Transfer'}
        icon={leaf?.icon}
        description="Move stock from one showroom to another. Completing the transfer generates a waybill for the driver, used to verify goods in transit and on delivery."
        submitLabel="Confirm transfer"
        loading={submitting}
        onCancel={() => setRows([blank()])}
        onSubmit={submit}
        note="Stock is deducted from the source showroom only once the transfer is confirmed, and is added to the destination only when they confirm receipt."
        secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
        aside={
          <>
            <Panel title="Transfer summary">
              <MetaRow label="From" value={source?.label || '—'} />
              <MetaRow label="To" value={destination?.label || '—'} />
              <MetaRow label="Driver" value={driver?.name || '—'} />
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
            <Select
              label="Source showroom"
              options={sourceOptions}
              value={sourceId}
              onChange={(e) => changeSource(e.target.value)}
              placeholder={showroomsLoading ? 'Loading…' : 'Select source showroom…'}
            />
            <Select
              label="Destination showroom"
              options={destinationOptions}
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              placeholder={showroomsLoading ? 'Loading…' : 'Select destination showroom…'}
            />
            <Input label="Transfer date" type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
          </FieldSet>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="brand">Showroom to showroom</Badge>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              Each line records the area of the source showroom it is dispatched from.
            </span>
          </div>
        </Panel>

        <Panel title="Driver & vehicle" description="Printed on the waybill and presented during transit.">
          {driversLoading ? (
            <Loader label="Loading drivers…" size={28} />
          ) : (
            <>
              <FieldSet columns={3}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Select
                      label="Driver"
                      options={driverOptions}
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      placeholder="Select driver…"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    iconLeft={showDriverForm ? 'x' : 'plus'}
                    onClick={() => setShowDriverForm((v) => !v)}
                  >
                    {showDriverForm ? 'Cancel' : 'Add'}
                  </Button>
                </div>
                <Input label="Vehicle number" value={driver?.vehicleNumber || ''} disabled placeholder="Filled from driver" />
                <Input label="Driver phone" value={driver?.phone || ''} disabled placeholder="Filled from driver" />
              </FieldSet>

              {showDriverForm && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', marginBottom: 12 }}>
                    New driver
                  </div>
                  <FieldSet columns={2}>
                    <Input label="Full name" value={newDriver.name} onChange={(e) => setNewDriver((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Musa Ibrahim" />
                    <Input label="Phone" value={newDriver.phone} onChange={(e) => setNewDriver((d) => ({ ...d, phone: e.target.value }))} placeholder="+234 …" />
                    <Input label="Vehicle number" value={newDriver.vehicleNumber} onChange={(e) => setNewDriver((d) => ({ ...d, vehicleNumber: e.target.value }))} placeholder="e.g. LSR-482-XA" />
                    <Input label="Licence number" value={newDriver.licenceNumber} onChange={(e) => setNewDriver((d) => ({ ...d, licenceNumber: e.target.value }))} placeholder="Driver's licence no." />
                  </FieldSet>
                  <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
                    <Button iconLeft="save" onClick={saveDriver} disabled={savingDriver}>
                      {savingDriver ? 'Saving…' : 'Save driver'}
                    </Button>
                    <Button variant="ghost" onClick={() => { setShowDriverForm(false); setNewDriver(blankDriver) }} disabled={savingDriver}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Panel>

        <Panel
          title="Items to transfer"
          description="Products come from this showroom's direct stock entries. Each line is dispatched from an area of this showroom, preselected from where the product is held; change it if the stock is elsewhere."
          actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
        >
          {itemsLoading && <Loader label="Loading products…" size={28} />}
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
    </>
  )
}