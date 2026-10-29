// import { useState, useEffect, useRef } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { PageHeader } from '../shells/PageHeader.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { DocumentSheet } from '../shells/DocumentView.jsx'
// import { unitOptions } from '../unitOptions.js'
// import { categoryOptions } from '../categoryOptions.js'
// import { useStore } from '../store.jsx'
// import { fmt, fmtDate } from '../utils.js'
// import InventoryApi from '../../api/InventoryApi.js'
// // import InventoryApi from '../../api/InventoryApi.js'
// import ShowroomApi from '../../api/ShowroomApi.js'   // ← new

// const inventoryApi = new InventoryApi()
// const showroomApi  = new ShowroomApi()               // ← new
// // const inventoryApi = new InventoryApi()
// const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '' })
// const today = () => new Date().toISOString().slice(0, 10)
// const blankDriver = { name: '', phone: '', vehicleNumber: '', licenceNumber: '' }

// /** Step 2 — the waybill produced on completion, handed to the driver. */
// // function Waybill({ crumbs, onBack, transfer, company }) {
// //   const lines = (transfer.lines || []).map((l) => ({
// //     product: l.stockItemName || l.stockItemCode,
// //     batch: l.batchNo || '—',
// //     qty: fmt(Number(l.qtySent) || 0),
// //     unit: l.unit || '',
// //   }))

// //   return (
// //     <Page>
// //       <PageHeader
// //         crumbs={crumbs}
// //         title="Transfer waybill"
// //         icon="truck"
// //         description="Print and hand this document to the driver. It serves as the official transit document and is used to cross-check goods during offloading at the destination."
// //         meta={<Badge tone="success">Transfer confirmed · stock deducted from source</Badge>}
// //         actions={
// //           <>
// //             <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>New transfer</Button>
// //             <Button variant="secondary" iconLeft="download">Download PDF</Button>
// //             <Button iconLeft="printer">Print waybill</Button>
// //           </>
// //         }
// //       />

// //       <div style={{ display: 'flex', justifyContent: 'center' }}>
// //         <DocumentSheet
// //           docType="Transfer Waybill"
// //           docNumber={transfer.waybillRef}
// //           issuer={{
// //             name: company.name || '—',
// //             address: [transfer.sourceLocationName, company.address].filter(Boolean).join(' — '),
// //             contact: [company.email, company.phone].filter(Boolean).join(' · '),
// //             vatId: company.taxRegistrationNumber || '—',
// //           }}
// //           party={{
// //             name: transfer.destinationLocationName,
// //             address: '',
// //             contact: transfer.destinationLocationType,
// //           }}
// //           meta={[
// //             { label: 'Driver', value: transfer.driverName },
// //             { label: 'Vehicle no.', value: transfer.driverVehicle, mono: true },
// //             { label: 'Dispatch date', value: fmtDate(transfer.dispatchedAt || transfer.transferDate) },
// //           ]}
// //           columns={[
// //             { key: 'product', label: 'Product description' },
// //             { key: 'batch', label: 'Batch no.', mono: true },
// //             { key: 'qty', label: 'Quantity', align: 'right', mono: true },
// //             { key: 'unit', label: 'Unit', align: 'right' },
// //           ]}
// //           lines={lines}
// //           totals={[
// //             { label: 'Total lines', value: String(lines.length) },
// //             { label: 'Total quantity', value: fmt(Number(transfer.totalSent) || 0), emphasis: true },
// //           ]}
// //           stamp={<Badge tone="warning" uppercase>In transit</Badge>}
// //           footer="This waybill is an official transit document and must be presented on demand to any law enforcement agency. The receiving officer should cross-check all quantities against this document during offloading and record any rejection before signing."
// //         />
// //       </div>
// //     </Page>
// //   )
// // }
// /** Step 2 — the waybill produced on completion, handed to the driver. */
// function Waybill({ crumbs, onBack, transfer, company }) {
//   const { showToast } = useStore()
//   const [busy, setBusy] = useState(null) // 'download' | 'print' | null
//   const blobRef = useRef(null) // fetched once, reused by both buttons

//   const lines = (transfer.lines || []).map((l) => ({
//     product: l.stockItemName || l.stockItemCode,
//     batch: l.batchNo || '—',
//     qty: fmt(Number(l.qtySent) || 0),
//     unit: l.unit || '',
//   }))

//   // Fetch the PDF from the waybillUrl the API returned.
//   const getPdf = async () => {
//     if (!blobRef.current) {
//       const blob = await inventoryApi.fetchWaybillPdf(transfer.waybillUrl)
//       blobRef.current = new Blob([blob], { type: 'application/pdf' })
//     }
//     return blobRef.current
//   }

//   const download = async () => {
//     setBusy('download')
//     try {
//       const url = URL.createObjectURL(await getPdf())
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `${transfer.waybillRef || 'waybill'}.pdf`
//       document.body.appendChild(a)
//       a.click()
//       a.remove()
//       setTimeout(() => URL.revokeObjectURL(url), 10000)
//     } catch (error) {
//       showToast('Could not download waybill', error.message, true)
//     } finally {
//       setBusy(null)
//     }
//   }

//   const print = async () => {
//     setBusy('print')
//     try {
//       const url = URL.createObjectURL(await getPdf())
//       // Load the PDF into a hidden frame and open the print dialog.
//       const frame = document.createElement('iframe')
//       frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
//       frame.src = url
//       frame.onload = () => {
//         try {
//           frame.contentWindow.focus()
//           frame.contentWindow.print()
//         } catch {
//           // Some browsers block printing from a frame — open the PDF so it can be printed from the viewer.
//           window.open(url, '_blank')
//         }
//       }
//       document.body.appendChild(frame)
//       setTimeout(() => { frame.remove(); URL.revokeObjectURL(url) }, 60000)
//     } catch (error) {
//       showToast('Could not print waybill', error.message, true)
//     } finally {
//       setBusy(null)
//     }
//   }

//   return (
//     <Page>
//       <PageHeader
//         crumbs={crumbs}
//         title="Transfer waybill"
//         icon="truck"
//         description="Print and hand this document to the driver. It serves as the official transit document and is used to cross-check goods during offloading at the destination."
//         meta={<Badge tone="success">Transfer confirmed · stock deducted from source</Badge>}
//         actions={
//           <>
//             <Button variant="ghost" iconLeft="arrow-left" onClick={onBack} disabled={!!busy}>New transfer</Button>
//             <Button variant="secondary" iconLeft="download" onClick={download} disabled={!!busy || !transfer.waybillUrl}>
//               {busy === 'download' ? 'Preparing…' : 'Download PDF'}
//             </Button>
//             <Button iconLeft="printer" onClick={print} disabled={!!busy || !transfer.waybillUrl}>
//               {busy === 'print' ? 'Preparing…' : 'Print waybill'}
//             </Button>
//           </>
//         }
//       />

//       {busy && <Loader overlay label={busy === 'print' ? 'Preparing waybill for print…' : 'Downloading waybill…'} />}

//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <DocumentSheet
//           docType="Transfer Waybill"
//           docNumber={transfer.waybillRef}
//           issuer={{
//             name: company.name || '—',
//             address: [transfer.sourceLocationName, company.address].filter(Boolean).join(' — '),
//             contact: [company.email, company.phone].filter(Boolean).join(' · '),
//             vatId: company.taxRegistrationNumber || '—',
//           }}
//           party={{
//             name: transfer.destinationLocationName,
//             address: '',
//             contact: transfer.destinationLocationType,
//           }}
//           meta={[
//             { label: 'Driver', value: transfer.driverName },
//             { label: 'Vehicle no.', value: transfer.driverVehicle, mono: true },
//             { label: 'Dispatch date', value: fmtDate(transfer.dispatchedAt || transfer.transferDate) },
//           ]}
//           columns={[
//             { key: 'product', label: 'Product description' },
//             { key: 'batch', label: 'Batch no.', mono: true },
//             { key: 'qty', label: 'Quantity', align: 'right', mono: true },
//             { key: 'unit', label: 'Unit', align: 'right' },
//           ]}
//           lines={lines}
//           totals={[
//             { label: 'Total lines', value: String(lines.length) },
//             { label: 'Total quantity', value: fmt(Number(transfer.totalSent) || 0), emphasis: true },
//           ]}
//           stamp={<Badge tone="warning" uppercase>In transit</Badge>}
//           footer="This waybill is an official transit document and must be presented on demand to any law enforcement agency. The receiving officer should cross-check all quantities against this document during offloading and record any rejection before signing."
//         />
//       </div>
//     </Page>
//   )
// }

// export default function StockTransfer({ leaf, moduleLabel, parentLabel }) {
//   const { showToast, user, company, factories, categories, units } = useStore()

//   const [step, setStep] = useState('compose')
//   const [sourceId, setSourceId] = useState('')
//   const [destId, setDestId] = useState('')
//   const [transferDate, setTransferDate] = useState(today)
//   const [rows, setRows] = useState([blank()])

//   const [items, setItems] = useState([]) // source factory's finished products
//   const [itemsLoading, setItemsLoading] = useState(false)
//   const [reloadKey, setReloadKey] = useState(0)

//   const [drivers, setDrivers] = useState([])
//   const [driversLoading, setDriversLoading] = useState(true)
//   const [driverId, setDriverId] = useState('')
//   const [showDriverForm, setShowDriverForm] = useState(false)
//   const [newDriver, setNewDriver] = useState(blankDriver)
//   const [savingDriver, setSavingDriver] = useState(false)
// // inside StockTransfer(...)
//   const [showrooms, setShowrooms] = useState([])
//   const [showroomsLoading, setShowroomsLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [transfer, setTransfer] = useState(null) // the confirmed transfer returned by the API
//   const [sent, setSent] = useState([]) // transfers confirmed in this session, newest first

//   // Name lookups for toStoreProduct, read through a ref so a change to the unit
//   // or category lists doesn't trigger a new request.
//   const lookupsRef = useRef(null)
//   lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

//   // Load drivers once.
//   // Load all drivers (paginated under the hood)
// useEffect(() => {
//   let cancelled = false
//   setDriversLoading(true)

//   const loadAllDrivers = async () => {
//     let page = 0
//     let all = []
//     let hasMore = true

//     while (hasMore && !cancelled) {
//       const { data } = await inventoryApi.listDrivers({ page, size: 50 })
//       all = [...all, ...(data.items || [])]
//       hasMore = (data.page + 1) < data.totalPages
//       page++
//     }

//     if (!cancelled) setDrivers(all)
//   }

//   loadAllDrivers()
//     .catch((error) => {
//       if (!cancelled) showToast('Could not load drivers', error.message, true)
//     })
//     .finally(() => {
//       if (!cancelled) setDriversLoading(false)
//     })

//   return () => { cancelled = true }
// }, [showToast])

// // Load all active showrooms once.
// useEffect(() => {
//   let cancelled = false
//   setShowroomsLoading(true)

//   showroomApi
//     .lookupPickerWithAreas({ status: ['ACTIVE'] })
//     .then((res) => {
//       if (cancelled) return
//       setShowrooms(
//         (res.data || []).map((s) => ({
//           value: s.id,
//           label: s.label || s.name || s.code,
//         }))
//       )
//     })
//     .catch((e) => {
//       if (!cancelled) showToast('Could not load showrooms', e.message, true)
//     })
//     .finally(() => {
//       if (!cancelled) setShowroomsLoading(false)
//     })

//   return () => {
//     cancelled = true
//   }
// }, [showToast])
//   // Load the finished products of the source factory.
//   // Load finished products for the selected source (paginated under the hood)
// useEffect(() => {
//   if (!sourceId) {
//     setItems([])
//     return
//   }

//   let cancelled = false
//   setItemsLoading(true)

//   const loadAllProducts = async () => {
//     let page = 0
//     let all = []
//     let hasMore = true

//     while (hasMore && !cancelled) {
//       const { data } = await inventoryApi.listStockItems(sourceId, 'FINISHED_PRODUCT', {
//         page,
//         size: 80,          // adjust if you prefer smaller/larger chunks
//       })

//       // Handle both possible response shapes safely
//       const pageItems = data?.items ?? data ?? []
//       const mapped = pageItems.map((i) =>
//         inventoryApi.toStoreProduct(i, lookupsRef.current)
//       )

//       all = [...all, ...mapped]
//       hasMore = data?.totalPages != null
//         ? (data.page + 1) < data.totalPages
//         : pageItems.length === 50   // fallback if totalPages is missing

//       page++
//     }

//     if (!cancelled) setItems(all)
//   }

//   loadAllProducts()
//     .catch((error) => {
//       if (!cancelled) showToast('Could not load products', error.message, true)
//     })
//     .finally(() => {
//       if (!cancelled) setItemsLoading(false)
//     })

//   return () => { cancelled = true }
// }, [sourceId, reloadKey, showToast])
//   // The product list belongs to one factory, so a new source clears the old list
//   // and any product already picked. The destination can't be the same factory.
//   const changeSource = (id) => {
//     setSourceId(id)
//     setItems([])
//     setRows((rs) => rs.map((r) => ({ ...r, product: '' })))
//     if (id === destId) setDestId('')
//   }

//   // Source is still factory-only.
// const factoryOptions = factories.map((f) => ({ value: f.id, label: f.name }))

// // Destination accepts both factories and showrooms — tagged so the type is obvious.
// const destinations = [
//   ...factories
//     .filter((f) => f.id !== sourceId)
//     .map((f) => ({ value: f.id, label: f.name, type: 'factory' })),
//   ...showrooms.map((s) => ({ value: s.value, label: s.label, type: 'showroom' })),
// ]

// const destinationOptions = destinations.map((d) => ({
//   value: d.value,
//   label: `${d.type === 'factory' ? 'Factory' : 'Showroom'} · ${d.label}`,
// }))

// const destination = destinations.find((d) => d.value === destId)
//   const driverOptions = drivers.map((d) => ({ value: d.id, label: d.name }))
//   const driver = drivers.find((d) => d.id === driverId)

//   const finishedProducts = items.map((p) => ({ value: p.id, label: p.name }))
//   const itemById = Object.fromEntries(items.map((p) => [p.id, p]))

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const item = itemById[r.product]
//     const available = item ? Number(item.quantity ?? 0) : undefined
//     const qty = Number(r.qty) || 0
//     return {
//       ...r,
//       available: available !== undefined ? fmt(available) : undefined,
//       remaining: available !== undefined && qty ? fmt(available - qty) : undefined,
//       unit: item ? (item.unit || '—') : undefined,
//     }
//   })

//   // A line may never exceed available stock at the source.
//   const errors = rows.map((r) => {
//     const item = itemById[r.product]
//     const qty = Number(r.qty) || 0
//     if (!item || !qty) return null
//     const available = Number(item.quantity ?? 0)
//     if (qty > available) return { field: 'qty', message: `Transfer quantity exceeds available stock at source (${fmt(available)} on hand).` }
//     return null
//   })

//   const columns = [
//     { key: 'product', label: 'Finished product', type: 'select', options: finishedProducts, width: 250, placeholder: sourceId ? 'Select product…' : 'Select source factory first' },
//     { key: 'available', label: 'Available', type: 'static', align: 'right', width: 120 },
//     { key: 'qty', label: 'Qty to transfer', type: 'number', width: 150, placeholder: '0' },
//     { key: 'unit', label: 'Unit', type: 'static', width: 110 },
//     { key: 'batch', label: 'Batch / lot no.', type: 'text', width: 160, placeholder: 'e.g. B-3390' },
//     { key: 'remaining', label: 'Remaining at source', type: 'static', align: 'right', width: 170 },
//   ]

//   const active = rows.filter((r) => r.product)
//   const totalQty = rows.reduce((n, r) => n + (Number(r.qty) || 0), 0)
//   const blocked = errors.some(Boolean)

//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
//   const recordedBy = user.name || user.email || 'Administrator'

//   const saveDriver = async () => {
//     const { name, phone, vehicleNumber, licenceNumber } = newDriver
//     if (!name.trim() || !phone.trim() || !vehicleNumber.trim() || !licenceNumber.trim()) {
//       showToast('Driver incomplete', 'Name, phone, vehicle number and licence number are all required.', true)
//       return
//     }
//     setSavingDriver(true)
//     try {
//       const res = await inventoryApi.createDriver({
//         name: name.trim(),
//         phone: phone.trim(),
//         vehicleNumber: vehicleNumber.trim(),
//         licenceNumber: licenceNumber.trim(),
//       })
//       const created = res.data
//       setDrivers((ds) => [...ds, created])
//       setDriverId(created.id)
//       setNewDriver(blankDriver)
//       setShowDriverForm(false)
//       showToast('Driver added', `${created.name} is selected for this transfer.`)
//     } catch (error) {
//       showToast('Could not add driver', error.message, true)
//     } finally {
//       setSavingDriver(false)
//     }
//   }

//   const submit = async () => {
//     if (!sourceId) { showToast('Select a source factory', 'Choose where the goods are leaving from.', true); return }
//     if (!destId) { showToast('Select a destination', 'Choose the factory the goods are going to.', true); return }
//     if (!driver) { showToast('Select a driver', 'Choose the driver, or add a new one.', true); return }
//     if (!transferDate) { showToast('Transfer date missing', 'Pick the date of this transfer.', true); return }

//     const valid = rows.filter((r) => r.product && Number(r.qty) > 0)
//     if (!valid.length) { showToast('Nothing to transfer', 'Add at least one product line with a quantity.', true); return }
//     if (blocked) { showToast('Transfer blocked', 'One or more lines exceed the stock available at the source.', true); return }

//     setSubmitting(true)
//     try {
//       const res = await inventoryApi.createStockTransfer({
//         sourceLocationId: sourceId,
//         destinationLocationId: destId,
//         driverId: driver.id,
//         driverName: driver.name,
//         driverVehicle: driver.vehicleNumber,
//         transferDate,
//         lines: valid.map((r) => ({
//           stockItemId: r.product,
//           quantity: Number(r.qty),
//           unitPrice: Number(itemById[r.product]?.landingCost) || 0,
//           fromLocationId: sourceId,
//           batchNo: r.batch.trim(),
//         })),
//       })
//       const done = res.data
//       setTransfer(done)
//       setSent((s) => [{
//         ref: done.waybillRef,
//         destination: done.destinationLocationName,
//         qty: fmt(Number(done.totalSent) || 0),
//         when: fmtDate(done.dispatchedAt || done.transferDate),
//         by: recordedBy,
//       }, ...s])
//       showToast(`Transfer confirmed — ${done.waybillRef}`, `${valid.length} line${valid.length === 1 ? '' : 's'} dispatched to ${done.destinationLocationName}`)
//       setStep('waybill')
//     } catch (error) {
//       showToast('Transfer failed', error.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   if (step === 'waybill' && transfer) {
//     return (
//       <Waybill
//         crumbs={crumbs}
//         transfer={transfer}
//         company={company}
//         onBack={() => {
//           setStep('compose')
//           setRows([blank()])
//           setTransfer(null)
//           setReloadKey((k) => k + 1) // refresh the "Available" figures
//         }}
//       />
//     )
//   }

//   return (
//     <>
//       {submitting && <Loader overlay label="Confirming transfer…" />}
//       <FormShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'Stock Transfer'}
//         icon={leaf?.icon}
//         description="Transfer finished products to another factory. Completing a transfer generates a waybill with a unique reference number for the driver."
//         submitLabel="Confirm transfer"
//         loading={submitting}
//         onCancel={() => setRows([blank()])}
//         onSubmit={submit}
//         note="Stock is deducted from the source only once the transfer is confirmed. A waybill is generated automatically at that point."
//         aside={
//           <>
//             <Panel title="Transfer summary">
//               <MetaRow label="Product lines" value={active.length || '—'} mono />
//               <MetaRow label="Total quantity" value={totalQty ? fmt(totalQty) : '—'} mono />
//               <MetaRow label="Destination" value={destination?.name || '—'} />
//               <MetaRow label="Driver" value={driver?.name || '—'} />
//               {blocked && (
//                 <Callout tone="danger" icon="circle-alert" title="Transfer blocked" style={{ marginTop: 14 }}>
//                   One or more lines exceed the stock available at the source. No stock movement will be recorded until
//                   every quantity is within the available balance.
//                 </Callout>
//               )}
//             </Panel>

//             <Panel title="Recent transfers" padding={0}>
//               <div style={{ padding: '4px 16px 12px' }}>
//                 {sent.length === 0 && (
//                   <div style={{ padding: '12px 0', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
//                     No transfers confirmed yet.
//                   </div>
//                 )}
//                 {sent.map((t) => (
//                   <div key={t.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
//                     <div style={{ flex: 1, minWidth: 0 }}>
//                       <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.destination}</div>
//                       <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{t.ref} · {t.when} · {t.by}</div>
//                     </div>
//                     <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-muted)', flexShrink: 0 }}>{t.qty}</span>
//                   </div>
//                 ))}
//               </div>
//             </Panel>
//           </>
//         }
//       >
//         <Panel title="Route" description="Where the goods are leaving from and where they are going — the destination may be another factory or a showroom.">
//   <FieldSet columns={3}>
//     <Select
//       label="Source factory"
//       options={factoryOptions}
//       value={sourceId}
//       onChange={(e) => changeSource(e.target.value)}
//       placeholder="Select source factory…"
//     />
//     <Select
//       label="Destination"
//       options={destinationOptions}
//       value={destId}
//       onChange={(e) => setDestId(e.target.value)}
//       placeholder={showroomsLoading ? 'Loading…' : 'Select factory or showroom…'}
//     />
//     <Input label="Transfer date" type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
//   </FieldSet>

//           {destination && (
//             <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//               <Badge tone="brand">Factory</Badge>
//               {destination.address && (
//                 <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//                   <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
//                   {destination.address}
//                 </span>
//               )}
//             </div>
//           )}
//         </Panel>

//         <Panel title="Driver & vehicle" description="Printed on the waybill and presented during transit.">
//           {driversLoading ? (
//             <Loader label="Loading drivers…" size={28} />
//           ) : (
//             <>
//               <FieldSet columns={3}>
//                 <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <Select
//                       label="Driver"
//                       options={driverOptions}
//                       value={driverId}
//                       onChange={(e) => setDriverId(e.target.value)}
//                       placeholder="Select driver…"
//                     />
//                   </div>
//                   <Button
//                     variant="secondary"
//                     iconLeft={showDriverForm ? 'x' : 'plus'}
//                     onClick={() => setShowDriverForm((v) => !v)}
//                   >
//                     {showDriverForm ? 'Cancel' : 'Add'}
//                   </Button>
//                 </div>
//                 <Input label="Vehicle number" value={driver?.vehicleNumber || ''} disabled placeholder="Filled from driver" />
//                 <Input label="Driver phone" value={driver?.phone || ''} disabled placeholder="Filled from driver" />
//               </FieldSet>

//               {showDriverForm && (
//                 <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
//                   <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', marginBottom: 12 }}>
//                     New driver
//                   </div>
//                   <FieldSet columns={2}>
//                     <Input label="Full name" value={newDriver.name} onChange={(e) => setNewDriver((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Musa Ibrahim" />
//                     <Input label="Phone" value={newDriver.phone} onChange={(e) => setNewDriver((d) => ({ ...d, phone: e.target.value }))} placeholder="+234 …" />
//                     <Input label="Vehicle number" value={newDriver.vehicleNumber} onChange={(e) => setNewDriver((d) => ({ ...d, vehicleNumber: e.target.value }))} placeholder="e.g. LSR-482-XA" />
//                     <Input label="Licence number" value={newDriver.licenceNumber} onChange={(e) => setNewDriver((d) => ({ ...d, licenceNumber: e.target.value }))} placeholder="Driver's licence no." />
//                   </FieldSet>
//                   <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
//                     <Button iconLeft="save" onClick={saveDriver} disabled={savingDriver}>
//                       {savingDriver ? 'Saving…' : 'Save driver'}
//                     </Button>
//                     <Button variant="ghost" onClick={() => { setShowDriverForm(false); setNewDriver(blankDriver) }} disabled={savingDriver}>
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </Panel>

//         <Panel
//           title="Items to transfer"
//           description="Each line is checked against live stock at the source factory."
//           actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
//         >
//           {itemsLoading && <Loader label="Loading products…" size={28} />}
//           <LineItems
//             columns={columns}
//             rows={decorated}
//             errors={errors}
//             onChange={update}
//             onAdd={() => setRows((rs) => [...rs, blank()])}
//             onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//             addLabel="Add product"
//             emptyLabel="No products added yet."
//             summary={[
//               { label: 'Lines', value: active.length },
//               { label: 'Total qty', value: fmt(totalQty) },
//             ]}
//           />
//         </Panel>
//       </FormShell>
//     </>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Page, Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { DocumentSheet } from '../shells/DocumentView.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import { fmt, fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 50
const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '' })
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
        description="Print and hand this document to the driver. It serves as the official transit document and is used to cross-check goods during offloading at the destination."
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
          docType="Transfer Waybill"
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
            contact: transfer.destinationLocationType,
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
          footer="This waybill is an official transit document and must be presented on demand to any law enforcement agency. The receiving officer should cross-check all quantities against this document during offloading and record any rejection before signing."
        />
      </div>
    </Page>
  )
}

export default function StockTransfer({ leaf, moduleLabel, parentLabel }) {
  const { showToast, user, company, factories, categories, units } = useStore()

  const [step, setStep] = useState('compose')
  const [sourceId, setSourceId] = useState('')
  const [destId, setDestId] = useState('')
  const [transferDate, setTransferDate] = useState(today)
  const [rows, setRows] = useState([blank()])

  const [items, setItems] = useState([]) // products held at the source (factory or showroom)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const [drivers, setDrivers] = useState([])
  const [driversLoading, setDriversLoading] = useState(true)
  const [driverId, setDriverId] = useState('')
  const [showDriverForm, setShowDriverForm] = useState(false)
  const [newDriver, setNewDriver] = useState(blankDriver)
  const [savingDriver, setSavingDriver] = useState(false)

  const [showrooms, setShowrooms] = useState([])
  const [showroomsLoading, setShowroomsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [transfer, setTransfer] = useState(null) // the confirmed transfer returned by the API
  const [sent, setSent] = useState([]) // transfers confirmed in this session, newest first

  // Name lookups for toStoreProduct, read through a ref so a change to the unit
  // or category lists doesn't trigger a new request.
  const lookupsRef = useRef(null)
  lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

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

  // Load all active showrooms once.
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

  // Is the chosen source a factory or a showroom?
  const sourceType = factories.some((f) => f.id === sourceId)
    ? 'factory'
    : showrooms.some((s) => s.value === sourceId)
    ? 'showroom'
    : ''

  // Load the products held at the source.
  //   factory  -> its finished products from the regular inventory
  //   showroom -> its direct-entry stock, grouped by product and area
  useEffect(() => {
    if (!sourceId || !sourceType) {
      setItems([])
      return
    }

    let cancelled = false
    setItemsLoading(true)

    const loadFactoryProducts = async () => {
      let page = 0
      let all = []
      let hasMore = true

      while (hasMore && !cancelled) {
        const { data } = await inventoryApi.listStockItems(sourceId, 'FINISHED_PRODUCT', { page, size: PAGE_SIZE })
        const pageItems = data?.items ?? data ?? []
        const mapped = pageItems.map((i) => {
          const p = inventoryApi.toStoreProduct(i, lookupsRef.current)
          return { ...p, stockItemId: p.id, fromLocationId: sourceId, locationName: '' }
        })
        all = [...all, ...mapped]
        hasMore = data?.totalPages != null ? page + 1 < data.totalPages : pageItems.length === PAGE_SIZE
        page += 1
      }
      return all
    }

    const loadShowroomProducts = async () => {
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

    ;(sourceType === 'factory' ? loadFactoryProducts() : loadShowroomProducts())
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
  }, [sourceId, sourceType, reloadKey, showToast])

  // The product list belongs to one source, so a new source clears the old list
  // and any product already picked. The destination can't be the same place.
  const changeSource = (id) => {
    setSourceId(id)
    setItems([])
    setRows((rs) => rs.map((r) => ({ ...r, product: '' })))
    if (id === destId) setDestId('')
  }

  // Source: factories and showrooms, tagged so the type is obvious.
  const sourceOptions = [
    ...factories.map((f) => ({ value: f.id, label: `Factory · ${f.name}` })),
    ...showrooms.map((s) => ({ value: s.value, label: `Showroom · ${s.label}` })),
  ]

  // Destination: factories and showrooms, minus whatever is the source.
  const destinations = [
    ...factories
      .filter((f) => f.id !== sourceId)
      .map((f) => ({ value: f.id, label: f.name, type: 'factory' })),
    ...showrooms
      .filter((s) => s.value !== sourceId)
      .map((s) => ({ value: s.value, label: s.label, type: 'showroom' })),
  ]

  const destinationOptions = destinations.map((d) => ({
    value: d.value,
    label: `${d.type === 'factory' ? 'Factory' : 'Showroom'} · ${d.label}`,
  }))

  const destination = destinations.find((d) => d.value === destId)
  const driverOptions = drivers.map((d) => ({ value: d.id, label: d.name }))
  const driver = drivers.find((d) => d.id === driverId)

  // A showroom can hold the same product in more than one area, so show the area too.
  const productOptions = items.map((p) => ({
    value: p.id,
    label: p.locationName ? `${p.name} · ${p.locationName}` : p.name,
  }))
  const itemById = Object.fromEntries(items.map((p) => [p.id, p]))

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const item = itemById[r.product]
    const available = item ? Number(item.quantity ?? 0) : undefined
    const qty = Number(r.qty) || 0
    return {
      ...r,
      available: available !== undefined ? fmt(available) : undefined,
      remaining: available !== undefined && qty ? fmt(available - qty) : undefined,
      unit: item ? (item.unit || '—') : undefined,
    }
  })

  // A line may never exceed available stock at the source.
  const errors = rows.map((r) => {
    const item = itemById[r.product]
    const qty = Number(r.qty) || 0
    if (!item || !qty) return null
    const available = Number(item.quantity ?? 0)
    if (qty > available) return { field: 'qty', message: `Transfer quantity exceeds available stock at source (${fmt(available)} on hand).` }
    return null
  })

  const columns = [
    { key: 'product', label: 'Product', type: 'select', options: productOptions, width: 280, placeholder: sourceId ? 'Select product…' : 'Select source first' },
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
  const recordedBy = user.name || user.email || 'Administrator'

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
    if (!sourceId) { showToast('Select a source', 'Choose the factory or showroom the goods are leaving from.', true); return }
    if (!destId) { showToast('Select a destination', 'Choose the factory or showroom the goods are going to.', true); return }
    if (!driver) { showToast('Select a driver', 'Choose the driver, or add a new one.', true); return }
    if (!transferDate) { showToast('Transfer date missing', 'Pick the date of this transfer.', true); return }

    const valid = rows.filter((r) => r.product && Number(r.qty) > 0)
    if (!valid.length) { showToast('Nothing to transfer', 'Add at least one product line with a quantity.', true); return }
    if (blocked) { showToast('Transfer blocked', 'One or more lines exceed the stock available at the source.', true); return }

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
          const it = itemById[r.product]
          return {
            stockItemId: it.stockItemId,
            quantity: Number(r.qty),
            unitPrice: Number(it.landingCost) || 0,
            // For a showroom this is the area the stock sits in.
            fromLocationId: it.fromLocationId,
            batchNo: r.batch.trim(),
          }
        }),
      })
      const done = res.data
      setTransfer(done)
      setSent((s) => [{
        ref: done.waybillRef,
        destination: done.destinationLocationName,
        qty: fmt(Number(done.totalSent) || 0),
        when: fmtDate(done.dispatchedAt || done.transferDate),
        by: recordedBy,
      }, ...s])
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
        title={leaf?.label || 'Stock Transfer'}
        icon={leaf?.icon}
        description="Transfer products from a factory or showroom to another factory or showroom. Completing a transfer generates a waybill with a unique reference number for the driver."
        submitLabel="Confirm transfer"
        loading={submitting}
        onCancel={() => setRows([blank()])}
        onSubmit={submit}
        note="Stock is deducted from the source only once the transfer is confirmed. A waybill is generated automatically at that point."
        aside={
          <>
            <Panel title="Transfer summary">
              <MetaRow label="Product lines" value={active.length || '—'} mono />
              <MetaRow label="Total quantity" value={totalQty ? fmt(totalQty) : '—'} mono />
              <MetaRow label="Destination" value={destination?.label || '—'} />
              <MetaRow label="Driver" value={driver?.name || '—'} />
              {blocked && (
                <Callout tone="danger" icon="circle-alert" title="Transfer blocked" style={{ marginTop: 14 }}>
                  One or more lines exceed the stock available at the source. No stock movement will be recorded until
                  every quantity is within the available balance.
                </Callout>
              )}
            </Panel>

            <Panel title="Recent transfers" padding={0}>
              <div style={{ padding: '4px 16px 12px' }}>
                {sent.length === 0 && (
                  <div style={{ padding: '12px 0', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                    No transfers confirmed yet.
                  </div>
                )}
                {sent.map((t) => (
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
        <Panel title="Route" description="Where the goods are leaving from and where they are going — each end may be a factory or a showroom.">
          <FieldSet columns={3}>
            <Select
              label="Source"
              options={sourceOptions}
              value={sourceId}
              onChange={(e) => changeSource(e.target.value)}
              placeholder={showroomsLoading ? 'Loading…' : 'Select factory or showroom…'}
            />
            <Select
              label="Destination"
              options={destinationOptions}
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              placeholder={showroomsLoading ? 'Loading…' : 'Select factory or showroom…'}
            />
            <Input label="Transfer date" type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
          </FieldSet>

          {(sourceType || destination) && (
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {sourceType && <Badge tone="neutral">From a {sourceType}</Badge>}
              {destination && <Badge tone="brand">{destination.type === 'factory' ? 'Factory' : 'Showroom'}</Badge>}
              {destination?.address && (
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                  <Icon name="map-pin" size={12} style={{ verticalAlign: -1, marginRight: 4 }} />
                  {destination.address}
                </span>
              )}
            </div>
          )}
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
          description={
            sourceType === 'showroom'
              ? "Products come from this showroom's direct stock entries, with the area each one is held in. Each line is checked against the quantity on record."
              : 'Each line is checked against live stock at the source.'
          }
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