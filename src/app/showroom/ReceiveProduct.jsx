
// import { useEffect, useState, useCallback } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Icon } from '../../ds/components/core/Icon.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { useStore } from '../store.jsx'
// import { fmt, fmtDate } from '../utils.js'
// import InventoryApi from '../../api/InventoryApi.js'
// import ShowroomApi from '../../api/ShowroomApi.js'

// const inventoryApi = new InventoryApi()
// const showroomApi = new ShowroomApi()
// const PAGE_SIZE = 50

// const STATUS_OPTIONS = [
//   { value: 'ALL', label: 'All transfers' },
//   { value: 'IN_TRANSIT', label: 'Awaiting receipt' },
//   { value: 'RECEIVED', label: 'Received' },
// ]

// /**
//  * Light-weight native select styled to match the design system.
//  * Used for the two filters. Kept inline so we don't assume a
//  * Select component exists in the DS forms package.
//  */
// function FilterSelect({ label, value, onChange, options, disabled }) {
//   return (
//     <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//       {label && (
//         <span
//           style={{
//             font: 'var(--type-caption)',
//             color: 'var(--text-muted)',
//           }}
//         >
//           {label}
//         </span>
//       )}
//       <select
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         style={{
//           height: 38,
//           padding: '0 12px',
//           font: 'var(--type-body, 14px)',
//           color: 'var(--text-strong)',
//           background: 'var(--surface-card)',
//           border: '1px solid var(--border-default)',
//           borderRadius: 'var(--radius-md)',
//           outline: 'none',
//           cursor: disabled ? 'not-allowed' : 'pointer',
//           opacity: disabled ? 0.6 : 1,
//         }}
//       >
//         {options.map((o) => (
//           <option key={o.value} value={o.value}>
//             {o.label}
//           </option>
//         ))}
//       </select>
//     </label>
//   )
// }

// export default function ReceiveProduct({ leaf, moduleLabel, parentLabel }) {
//   const store = useStore()
//   const showToast = store.showToast

//   // Optional: still try to pre-select the showroom the user is working in.
//   // This is only used as a sensible default for the picker, not as a hard
//   // dependency anymore.
//   const storeLocationId =
//     store.currentLocation?.id ||
//     store.activeShowroom?.id ||
//     store.showroom?.id ||
//     store.session?.locationId ||
//     store.user?.locationId ||
//     null

//   const userName = store.user?.name || store.session?.user?.name || '—'

//   // ---------- filter state ----------
//   const [showrooms, setShowrooms] = useState([])
//   const [selectedShowroomId, setSelectedShowroomId] = useState('')
//   const [loadingShowrooms, setLoadingShowrooms] = useState(false)
//   const [statusFilter, setStatusFilter] = useState('ALL')

//   // ---------- data state ----------
//   const [incoming, setIncoming] = useState([])
//   const [historyRows, setHistoryRows] = useState([])
//   const [selectedId, setSelectedId] = useState(null)
//   const [detail, setDetail] = useState(null)
//   const [rows, setRows] = useState([])
//   const [receivedDate, setReceivedDate] = useState(() =>
//     new Date().toISOString().slice(0, 10)
//   )
//   const [note, setNote] = useState('')
//   const [areas, setAreas] = useState([])
//   const [defaultAreaId, setDefaultAreaId] = useState('')
//   const [loadingList, setLoadingList] = useState(false)
//   const [loadingDetail, setLoadingDetail] = useState(false)
//   const [submitting, setSubmitting] = useState(false)

//   // ---------- 1) load showrooms for the picker ----------
//   useEffect(() => {
//     let cancelled = false
//     setLoadingShowrooms(true)
//     showroomApi
//       .lookupPickerWithAreas({ status: ['ACTIVE'] })
//       .then((res) => {
//         if (cancelled) return
//         const list = (res.data || []).map((s) => ({
//           value: s.id,
//           label: s.label || s.name || s.code,
//         }))
//         setShowrooms(list)
//         setSelectedShowroomId((prev) => {
//           if (prev && list.some((s) => s.value === prev)) return prev
//           if (
//             storeLocationId &&
//             list.some((s) => s.value === storeLocationId)
//           ) {
//             return storeLocationId
//           }
//           return list[0]?.value || ''
//         })
//       })
//       .catch((e) => {
//         if (!cancelled) showToast('Could not load showrooms', e.message, true)
//       })
//       .finally(() => {
//         if (!cancelled) setLoadingShowrooms(false)
//       })
//     return () => {
//       cancelled = true
//     }
//   }, [showToast, storeLocationId])

//   // ---------- 2) load areas + default receiving area for the selected showroom ----------
//   useEffect(() => {
//     if (!selectedShowroomId) {
//       setAreas([])
//       setDefaultAreaId('')
//       return
//     }
//     let cancelled = false
//     showroomApi
//       .retrieveShowroom(selectedShowroomId)
//       .then((res) => {
//         if (cancelled) return
//         const data = res.data
//         const list = (data.areas || []).map((a) => ({
//           value: a.id,
//           label: a.name || a.code,
//         }))
//         setAreas(list)
//         setDefaultAreaId(
//           data.defaultReceivingLocation?.id || list[0]?.value || ''
//         )
//       })
//       .catch((e) => {
//         if (!cancelled)
//           showToast('Could not load showroom areas', e.message, true)
//       })
//     return () => {
//       cancelled = true
//     }
//   }, [selectedShowroomId, showToast])

//   // ---------- 3) reset selection when the receiving showroom changes ----------
//   useEffect(() => {
//     setSelectedId(null)
//     setIncoming([])
//     setHistoryRows([])
//     setDetail(null)
//     setRows([])
//   }, [selectedShowroomId])

//   // ---------- 4) load transfers for the selected showroom + status ----------
//   const loadLists = useCallback(async () => {
//     if (!selectedShowroomId) return
//     setLoadingList(true)
//     try {
//       const wantIn = statusFilter === 'ALL' || statusFilter === 'IN_TRANSIT'
//       const wantDone = statusFilter === 'ALL' || statusFilter === 'RECEIVED'

//       const tasks = []
//       if (wantIn) {
//         tasks.push(
//           showroomApi
//             .listShowroomTransfers({
//               destinationLocationId: selectedShowroomId,
//               status: 'IN_TRANSIT',
//               page: 0,
//               size: PAGE_SIZE,
//             })
//             .then((r) => ({ kind: 'in', res: r }))
//         )
//       }
//       if (wantDone) {
//         tasks.push(
//           showroomApi
//             .listShowroomTransfers({
//               destinationLocationId: selectedShowroomId,
//               status: 'RECEIVED',
//               page: 0,
//               size: PAGE_SIZE,
//             })
//             .then((r) => ({ kind: 'done', res: r }))
//         )
//       }

//       const results = await Promise.all(tasks)
//       const inRes = results.find((r) => r.kind === 'in')?.res
//       const doneRes = results.find((r) => r.kind === 'done')?.res

//       // --- awaiting (IN_TRANSIT), grouped by transfer ---
//       const inItems = inRes?.data?.items ?? []
//       const byTransfer = new Map()
//       for (const row of inItems) {
//         const tid = row.transfer?.id
//         if (!tid) continue
//         if (!byTransfer.has(tid)) {
//           byTransfer.set(tid, {
//             id: tid,
//             waybillRef: row.transfer?.code || row.transfer?.name || '—',
//             source: row.source || '—',
//             sourceType: row.sourceType || '',
//             driver: row.driver || '—',
//             vehicle: row.vehicle || '—',
//             date: row.date,
//             status: row.status || 'IN_TRANSIT',
//             lines: [],
//             totalSent: 0,
//           })
//         }
//         const g = byTransfer.get(tid)
//         g.lines.push(row)
//         g.totalSent += Number(row.qtySent) || 0
//       }
//       const awaiting = Array.from(byTransfer.values())
//       setIncoming(awaiting)

//       // --- history (RECEIVED) ---
//       const doneItems = doneRes?.data?.items ?? []
//       setHistoryRows(
//         doneItems.map((r, i) => ({
//           key: `${r.transfer?.id || r.lineId}-${r.lineId || i}`,
//           waybill: r.transfer?.code || r.transfer?.name || '—',
//           origin: r.source || '—',
//           originType: /FACTORY/i.test(r.sourceType || '')
//             ? 'Factory'
//             : 'Showroom',
//           product: r.product || r.productCode || '—',
//           dispatched: fmtDate(r.date),
//           received: r.receivedDate ? fmtDate(r.receivedDate) : '—',
//           sent: Number(r.qtySent) || 0,
//           accepted: Number(r.qtyReceived) || 0,
//           rejected: Number(r.qtyRejected) || 0,
//         }))
//       )

//       setSelectedId((prev) => {
//         if (prev && awaiting.some((t) => t.id === prev)) return prev
//         return awaiting[0]?.id ?? null
//       })
//     } catch (e) {
//       showToast('Could not load consignments', e.message, true)
//     } finally {
//       setLoadingList(false)
//     }
//   }, [selectedShowroomId, statusFilter, showToast])

//   useEffect(() => {
//     loadLists()
//   }, [loadLists])

//   // ---------- 5) load the selected waybill detail ----------
//   useEffect(() => {
//     if (!selectedId) {
//       setDetail(null)
//       setRows([])
//       return
//     }
//     let cancelled = false
//     setLoadingDetail(true)
//     inventoryApi
//       .getStockTransferWithLines(selectedId)
//       .then((res) => {
//         if (cancelled) return
//         const t = res.data
//         setDetail(t)
//         setRows(
//           (t.lines || []).map((l) => ({
//             id: l.id,
//             stockTransferLineId: l.id,
//             product: l.stockItem?.name || l.stockItem?.code || '—',
//             batch: l.batchNo || '—',
//             sent: Number(l.qtySent) || 0,
//             unit: l.unit || '—',
//             accepted: String(Number(l.qtySent) || 0),
//             rejected: '',
//             note: '',
//           }))
//         )
//         setNote('')
//         setReceivedDate(new Date().toISOString().slice(0, 10))
//       })
//       .catch((e) => {
//         if (!cancelled) showToast('Could not load waybill', e.message, true)
//       })
//       .finally(() => {
//         if (!cancelled) setLoadingDetail(false)
//       })
//     return () => {
//       cancelled = true
//     }
//   }, [selectedId, showToast])

//   // ---------- handlers ----------
//   function pick(id) {
//     setSelectedId(id)
//   }

//   function update(i, key, value) {
//     setRows((rs) =>
//       rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r))
//     )
//   }

//   const decorated = rows.map((r) => {
//     const acc = Number(r.accepted) || 0
//     const rej = Number(r.rejected) || 0
//     return {
//       ...r,
//       sentDisplay: fmt(r.sent),
//       variance: acc + rej - r.sent,
//     }
//   })

//   const errors = decorated.map((r) =>
//     r.variance !== 0
//       ? {
//           field: 'accepted',
//           message:
//             r.variance > 0
//               ? `Accepted plus rejected exceeds the ${fmt(r.sent)} dispatched by ${fmt(r.variance)}.`
//               : `${fmt(-r.variance)} of the ${fmt(r.sent)} dispatched is unaccounted for — record it as accepted or rejected.`,
//         }
//       : null
//   )

//   const columns = [
//     { key: 'product', label: 'Product', type: 'static', width: 260 },
//     { key: 'batch', label: 'Batch', type: 'static', width: 120 },
//     {
//       key: 'sentDisplay',
//       label: 'Qty dispatched',
//       type: 'static',
//       align: 'right',
//       width: 140,
//     },
//     {
//       key: 'accepted',
//       label: 'Qty accepted',
//       type: 'number',
//       width: 140,
//       placeholder: '0',
//     },
//     {
//       key: 'rejected',
//       label: 'Qty rejected',
//       type: 'number',
//       width: 140,
//       placeholder: '0',
//     },
//     { key: 'unit', label: 'Unit', type: 'static', width: 110 },
//     {
//       key: 'note',
//       label: 'Rejection note',
//       type: 'text',
//       width: 240,
//       placeholder: 'Reason if rejecting',
//     },
//   ]

//   const totalAccepted = decorated.reduce(
//     (n, r) => n + (Number(r.accepted) || 0),
//     0
//   )
//   const totalRejected = decorated.reduce(
//     (n, r) => n + (Number(r.rejected) || 0),
//     0
//   )

//   const noAreaForShowroom = !!detail && !defaultAreaId
//   const blocked = errors.some(Boolean) || noAreaForShowroom

//   const historyColumns = [
//     { key: 'waybill', label: 'Waybill', width: 120, mono: true },
//     { key: 'origin', label: 'Origin', width: 200 },
//     {
//       key: 'originType',
//       label: 'Type',
//       width: 120,
//       render: (r) => (
//         <Badge tone={r.originType === 'Factory' ? 'brand' : 'neutral'}>
//           {r.originType}
//         </Badge>
//       ),
//     },
//     { key: 'product', label: 'Product', width: 240 },
//     { key: 'dispatched', label: 'Dispatched', width: 130 },
//     { key: 'received', label: 'Received', width: 130 },
//     {
//       key: 'sent',
//       label: 'Sent',
//       width: 100,
//       align: 'right',
//       mono: true,
//       render: (r) => fmt(r.sent),
//     },
//     {
//       key: 'accepted',
//       label: 'Accepted',
//       width: 110,
//       align: 'right',
//       mono: true,
//       render: (r) => fmt(r.accepted),
//     },
//     {
//       key: 'rejected',
//       label: 'Rejected',
//       width: 110,
//       align: 'right',
//       mono: true,
//       render: (r) =>
//         r.rejected ? (
//           <span style={{ color: 'var(--danger)' }}>{fmt(r.rejected)}</span>
//         ) : (
//           '—'
//         ),
//     },
//   ]

//   async function handleSubmit() {
//     if (!detail || blocked || !defaultAreaId) return
//     setSubmitting(true)
//     try {
//       const body = {
//         receivedDate,
//         note: note || '',
//         lines: rows.map((r) => ({
//           stockTransferLineId: r.stockTransferLineId,
//           qtyReceived: Number(r.accepted) || 0,
//           qtyRejected: Number(r.rejected) || 0,
//           rejectionNote: r.note || '',
//           receivedIntoLocationId: defaultAreaId,
//         })),
//       }
//       await inventoryApi.receiveStockTransfer(detail.id, body)
//       showToast(
//         'Receipt confirmed',
//         `Waybill ${detail.waybillRef} has been received.`
//       )
//       setSelectedId(null)
//       setDetail(null)
//       setRows([])
//       await loadLists()
//     } catch (e) {
//       showToast('Could not confirm receipt', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const originType = detail
//     ? /FACTORY/i.test(detail.sourceLocation?.type || '')
//       ? 'Factory'
//       : 'Showroom'
//     : null

//   const showroomOptions = showrooms.map((s) => ({
//     value: s.value,
//     label: s.label,
//   }))

//   // ---------- nothing to show: no showrooms at all ----------
//   if (!loadingShowrooms && showrooms.length === 0) {
//     return (
//       <FormShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'Receive Product'}
//         icon={leaf?.icon}
//         description="Confirm and record products arriving at a showroom."
//         submitLabel="Confirm receipt"
//         submitDisabled
//         onCancel={() => {}}
//       >
//         <Panel title="No showrooms available">
//           <Callout tone="warning" icon="triangle-alert">
//             No active showrooms were found. Ask an administrator to set up
//             at least one showroom before receiving stock.
//           </Callout>
//         </Panel>
//       </FormShell>
//     )
//   }

//   return (
//     <>
//       {(loadingList ||
//         loadingDetail ||
//         submitting ||
//         loadingShowrooms) && (
//         <Loader
//           overlay
//           label={
//             submitting
//               ? 'Confirming receipt…'
//               : loadingDetail
//                 ? 'Loading waybill…'
//                 : loadingShowrooms
//                   ? 'Loading showrooms…'
//                   : 'Loading consignments…'
//           }
//         />
//       )}
//       <FormShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'Receive Product'}
//         icon={leaf?.icon}
//         description="Confirm and record products arriving at this showroom, whether supplied from a factory or transferred from another showroom. Check the goods against the waybill before confirming."
//         submitLabel="Confirm receipt"
//         onSubmit={handleSubmit}
//         onCancel={() => {}}
//         submitDisabled={blocked || !detail || submitting || !defaultAreaId}
//         note="Stock is added to this showroom only once receipt is confirmed. Rejected quantities are returned against the waybill and do not enter stock."
//         aside={
//           detail ? (
//             <>
//               <Panel title="Consignment">
//                 <MetaRow label="Waybill" value={detail.waybillRef} mono />
//                 <MetaRow
//                   label="Origin"
//                   value={detail.sourceLocation?.name || '—'}
//                 />
//                 <MetaRow label="Type" value={originType} />
//                 <MetaRow label="Driver" value={detail.driver?.name || '—'} />
//                 <MetaRow
//                   label="Vehicle"
//                   value={detail.driverVehicle || '—'}
//                   mono
//                 />
//                 <MetaRow
//                   label="Dispatched"
//                   value={fmtDate(detail.transferDate || detail.dispatchedAt)}
//                 />
//                 <MetaRow
//                   label="Accepting into"
//                   value={
//                     areas.find((a) => a.value === defaultAreaId)?.label ||
//                     '—'
//                   }
//                 />
//               </Panel>

//               <Panel title="Receipt summary">
//                 <MetaRow label="Lines" value={rows.length} mono />
//                 <MetaRow
//                   label="Total accepted"
//                   value={fmt(totalAccepted)}
//                   mono
//                   tone="positive"
//                 />
//                 <MetaRow
//                   label="Total rejected"
//                   value={totalRejected ? fmt(totalRejected) : '—'}
//                   mono
//                   tone={totalRejected ? 'negative' : undefined}
//                 />
//                 {noAreaForShowroom && (
//                   <Callout
//                     tone="danger"
//                     icon="circle-alert"
//                     title="No receiving area"
//                     style={{ marginTop: 14 }}
//                   >
//                     This showroom has no areas configured. Add a receiving
//                     area before confirming receipt.
//                   </Callout>
//                 )}
//                 {blocked && !noAreaForShowroom && (
//                   <Callout
//                     tone="danger"
//                     icon="circle-alert"
//                     title="Quantities do not reconcile"
//                     style={{ marginTop: 14 }}
//                   >
//                     Accepted plus rejected must equal the quantity dispatched
//                     on every line before receipt can be confirmed.
//                   </Callout>
//                 )}
//                 {!blocked && totalRejected > 0 && (
//                   <Callout
//                     tone="warning"
//                     icon="triangle-alert"
//                     style={{ marginTop: 14 }}
//                   >
//                     {fmt(totalRejected)} unit
//                     {totalRejected === 1 ? '' : 's'} will be recorded as
//                     rejected against waybill {detail.waybillRef} and raised
//                     with the dispatching location.
//                   </Callout>
//                 )}
//               </Panel>
//             </>
//           ) : (
//             <Panel title="Consignment">
//               <div
//                 style={{
//                   color: 'var(--text-muted)',
//                   font: 'var(--type-caption)',
//                 }}
//               >
//                 Select a consignment to review.
//               </div>
//             </Panel>
//           )
//         }
//       >
//         {/* ---------- filters ---------- */}
//         <Panel
//           title="Filters"
//           description="Pick the receiving showroom and the kind of transfer you're looking for."
//         >
//           <FieldSet columns={2}>
//             <FilterSelect
//               label="Receiving showroom"
//               value={selectedShowroomId}
//               onChange={(e) => setSelectedShowroomId(e.target.value)}
//               options={showroomOptions}
//               disabled={loadingShowrooms || showrooms.length === 0}
//             />
//             <FilterSelect
//               label="Show"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               options={STATUS_OPTIONS}
//             />
//           </FieldSet>
//         </Panel>

//         {/* ---------- awaiting receipt ---------- */}
//         {selectedShowroomId && statusFilter !== 'RECEIVED' && (
//           <Panel
//             title="Awaiting receipt"
//             description="Consignments dispatched to this showroom that have not yet been confirmed."
//           >
//             {incoming.length === 0 && !loadingList ? (
//               <div
//                 style={{
//                   color: 'var(--text-muted)',
//                   padding: '12px 0',
//                 }}
//               >
//                 No consignments awaiting receipt.
//               </div>
//             ) : (
//               <div
//                 style={{
//                   display: 'grid',
//                   gridTemplateColumns:
//                     'repeat(auto-fill, minmax(300px, 1fr))',
//                   gap: 10,
//                 }}
//               >
//                 {incoming.map((c) => {
//                   const on = c.id === selectedId
//                   const originIsFactory = /FACTORY/i.test(
//                     c.sourceType || ''
//                   )
//                   return (
//                     <div
//                       key={c.id}
//                       onClick={() => pick(c.id)}
//                       style={{
//                         display: 'flex',
//                         alignItems: 'flex-start',
//                         gap: 10,
//                         padding: '12px 14px',
//                         cursor: 'pointer',
//                         background: on
//                           ? 'var(--brand-subtle)'
//                           : 'var(--surface-card)',
//                         border: `1px solid ${
//                           on
//                             ? 'var(--brand-border)'
//                             : 'var(--border-default)'
//                         }`,
//                         borderRadius: 'var(--radius-md)',
//                         transition: 'var(--transition-control)',
//                       }}
//                     >
//                       <Icon
//                         name={originIsFactory ? 'factory' : 'store'}
//                         size={16}
//                         color={on ? 'var(--brand)' : 'var(--text-subtle)'}
//                       />
//                       <div style={{ minWidth: 0, flex: 1 }}>
//                         <div
//                           style={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 8,
//                           }}
//                         >
//                           <span
//                             style={{
//                               font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)',
//                               color: 'var(--text-strong)',
//                             }}
//                           >
//                             {c.waybillRef}
//                           </span>
//                           <Badge tone="warning">
//                             {(c.status || 'IN_TRANSIT').replace(/_/g, ' ')}
//                           </Badge>
//                         </div>
//                         <div
//                           style={{
//                             font: 'var(--type-caption)',
//                             color: 'var(--text-muted)',
//                             marginTop: 3,
//                           }}
//                         >
//                           {c.source} · {c.driver} · {fmtDate(c.date)}
//                         </div>
//                         <div
//                           style={{
//                             font: 'var(--type-caption)',
//                             color: 'var(--text-subtle)',
//                             marginTop: 2,
//                           }}
//                         >
//                           {c.lines.length} line
//                           {c.lines.length === 1 ? '' : 's'} ·{' '}
//                           {fmt(c.totalSent)} units
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </Panel>
//         )}

//         {/* ---------- waybill detail ---------- */}
//         {detail && (
//           <Panel
//             title={`Goods on waybill ${detail.waybillRef}`}
//             description="Count the goods against the waybill. Record anything damaged or short as rejected."
//             actions={
//               <Button variant="secondary" size="sm" iconLeft="qr-code">
//                 Scan
//               </Button>
//             }
//           >
//             <FieldSet columns={3}>
//               <Input
//                 label="Date received"
//                 type="date"
//                 value={receivedDate}
//                 onChange={(e) => setReceivedDate(e.target.value)}
//               />
//               <Input label="Received by" value={userName} disabled />
//               <Input
//                 label="Receipt note"
//                 placeholder="Optional note"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </FieldSet>
//             <div style={{ marginTop: 16 }}>
//               <LineItems
//                 columns={columns}
//                 rows={decorated}
//                 errors={errors}
//                 onChange={update}
//                 summary={[
//                   { label: 'Accepted', value: fmt(totalAccepted) },
//                   { label: 'Rejected', value: fmt(totalRejected) },
//                 ]}
//               />
//             </div>
//           </Panel>
//         )}

//         {/* ---------- history ---------- */}
//         {selectedShowroomId && statusFilter !== 'IN_TRANSIT' && (
//           <Panel
//             title="Recently received"
//             description="Consignments already confirmed into this showroom."
//             padding={0}
//           >
//             <ReportTable
//               columns={historyColumns}
//               rows={historyRows}
//               rowKey={(r) => r.key}
//               stickyHeader={false}
//               style={{ border: 'none', borderRadius: 0 }}
//               emptyTitle="No recent receipts"
//               emptyDescription="Confirmed receipts will appear here."
//             />
//           </Panel>
//         )}
//       </FormShell>
//     </>
//   )
// }

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { useStore } from '../store.jsx'
import { fmt, fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()
const PAGE_SIZE = 50

const todayIso = () => new Date().toISOString().slice(0, 10)

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All transfers' },
  { value: 'IN_TRANSIT', label: 'Awaiting receipt' },
  { value: 'RECEIVED', label: 'Received' },
]

/**
 * Light-weight native select styled to match the design system.
 * Used for the two filters. Kept inline so we don't assume a
 * Select component exists in the DS forms package.
 */
function FilterSelect({ label, value, onChange, options, disabled }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <span
          style={{
            font: 'var(--type-caption)',
            color: 'var(--text-muted)',
          }}
        >
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{
          height: 38,
          padding: '0 12px',
          font: 'var(--type-body, 14px)',
          color: 'var(--text-strong)',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/**
 * Shown when some of the stock items being received have no price list
 * history yet. The user must set a retail and dealer price for each before
 * the receipt can be confirmed.
 */
function MissingPricesModal({
  items,
  effectiveFrom,
  note,
  busy,
  onItemChange,
  onEffectiveFromChange,
  onNoteChange,
  onCancel,
  onConfirm,
}) {
  const valid =
    items.length > 0 &&
    items.every((it) => Number(it.retail) > 0 && Number(it.dealer) > 0) &&
    !!effectiveFrom

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 760,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            padding: '18px 22px 12px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              font: 'var(--fw-bold) var(--text-lg)/1.3 var(--font-ui)',
              color: 'var(--text-strong)',
            }}
          >
            Set prices before receiving
          </div>
          <div
            style={{
              marginTop: 4,
              font: 'var(--type-caption)',
              color: 'var(--text-muted)',
            }}
          >
            {items.length === 1
              ? 'This product has'
              : `These ${items.length} products have`}{' '}
            no price list yet. Create one now, then the transfer will be
            accepted.
          </div>
        </div>

        <div style={{ padding: '16px 22px', overflowY: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 2fr) 1fr 1fr',
              gap: 10,
              alignItems: 'center',
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
              Product
            </div>
            <div
              style={{
                font: 'var(--type-eyebrow)',
                letterSpacing: 'var(--ls-widest)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Retail price (₦) *
            </div>
            <div
              style={{
                font: 'var(--type-eyebrow)',
                letterSpacing: 'var(--ls-widest)',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              Dealer price (₦) *
            </div>
            {items.map((it, i) => (
              <div key={it.stockItemId} style={{ display: 'contents' }}>
                <div
                  style={{
                    font: 'var(--type-body)',
                    color: 'var(--text-strong)',
                  }}
                >
                  {it.name}
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  aria-label={`Retail price for ${it.name}`}
                  value={it.retail}
                  onChange={(e) =>
                    onItemChange(i, 'retail', e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="0.00"
                  aria-label={`Dealer price for ${it.name}`}
                  value={it.dealer}
                  onChange={(e) =>
                    onItemChange(i, 'dealer', e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            <FieldSet columns={2}>
              <Input
                label="Effective from *"
                type="date"
                value={effectiveFrom}
                onChange={(e) => onEffectiveFromChange(e.target.value)}
              />
              <Input
                label="Note"
                placeholder="Optional, e.g. Initial price on first receipt"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
              />
            </FieldSet>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '12px 22px 18px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!valid || busy}>
            Publish prices & confirm receipt
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function ReceiveProduct({ leaf, moduleLabel, parentLabel }) {
  const store = useStore()
  const showToast = store.showToast

  // Optional: still try to pre-select the showroom the user is working in.
  // This is only used as a sensible default for the picker, not as a hard
  // dependency anymore.
  const storeLocationId =
    store.currentLocation?.id ||
    store.activeShowroom?.id ||
    store.showroom?.id ||
    store.session?.locationId ||
    store.user?.locationId ||
    null

  const userName = store.user?.name || store.session?.user?.name || '—'

  // ---------- filter state ----------
  const [showrooms, setShowrooms] = useState([])
  const [selectedShowroomId, setSelectedShowroomId] = useState('')
  const [loadingShowrooms, setLoadingShowrooms] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')

  // ---------- data state ----------
  const [incoming, setIncoming] = useState([])
  const [historyRows, setHistoryRows] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [rows, setRows] = useState([])
  const [receivedDate, setReceivedDate] = useState(() => todayIso())
  const [note, setNote] = useState('')
  const [areas, setAreas] = useState([])
  const [defaultAreaId, setDefaultAreaId] = useState('')
  const [loadingList, setLoadingList] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // ---------- missing price list modal ----------
  const [priceModalOpen, setPriceModalOpen] = useState(false)
  const [priceItems, setPriceItems] = useState([]) // [{ stockItemId, name, retail, dealer }]
  const [priceEffectiveFrom, setPriceEffectiveFrom] = useState(() => todayIso())
  const [priceNote, setPriceNote] = useState('')
  const [publishing, setPublishing] = useState(false)

  // ---------- 1) load showrooms for the picker ----------
  useEffect(() => {
    let cancelled = false
    setLoadingShowrooms(true)
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        const list = (res.data || []).map((s) => ({
          value: s.id,
          label: s.label || s.name || s.code,
        }))
        setShowrooms(list)
        setSelectedShowroomId((prev) => {
          if (prev && list.some((s) => s.value === prev)) return prev
          if (
            storeLocationId &&
            list.some((s) => s.value === storeLocationId)
          ) {
            return storeLocationId
          }
          return list[0]?.value || ''
        })
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load showrooms', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingShowrooms(false)
      })
    return () => {
      cancelled = true
    }
  }, [showToast, storeLocationId])

  // ---------- 2) load areas + default receiving area for the selected showroom ----------
  useEffect(() => {
    if (!selectedShowroomId) {
      setAreas([])
      setDefaultAreaId('')
      return
    }
    let cancelled = false
    showroomApi
      .retrieveShowroom(selectedShowroomId)
      .then((res) => {
        if (cancelled) return
        const data = res.data
        const list = (data.areas || []).map((a) => ({
          value: a.id,
          label: a.name || a.code,
        }))
        setAreas(list)
        setDefaultAreaId(
          data.defaultReceivingLocation?.id || list[0]?.value || ''
        )
      })
      .catch((e) => {
        if (!cancelled)
          showToast('Could not load showroom areas', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [selectedShowroomId, showToast])

  // ---------- 3) reset selection when the receiving showroom changes ----------
  useEffect(() => {
    setSelectedId(null)
    setIncoming([])
    setHistoryRows([])
    setDetail(null)
    setRows([])
  }, [selectedShowroomId])

  // ---------- 4) load transfers for the selected showroom + status ----------
  const loadLists = useCallback(async () => {
    if (!selectedShowroomId) return
    setLoadingList(true)
    try {
      const wantIn = statusFilter === 'ALL' || statusFilter === 'IN_TRANSIT'
      const wantDone = statusFilter === 'ALL' || statusFilter === 'RECEIVED'

      const tasks = []
      if (wantIn) {
        tasks.push(
          showroomApi
            .listShowroomTransfers({
              destinationLocationId: selectedShowroomId,
              status: 'IN_TRANSIT',
              page: 0,
              size: PAGE_SIZE,
            })
            .then((r) => ({ kind: 'in', res: r }))
        )
      }
      if (wantDone) {
        tasks.push(
          showroomApi
            .listShowroomTransfers({
              destinationLocationId: selectedShowroomId,
              status: 'RECEIVED',
              page: 0,
              size: PAGE_SIZE,
            })
            .then((r) => ({ kind: 'done', res: r }))
        )
      }

      const results = await Promise.all(tasks)
      const inRes = results.find((r) => r.kind === 'in')?.res
      const doneRes = results.find((r) => r.kind === 'done')?.res

      // --- awaiting (IN_TRANSIT), grouped by transfer ---
      const inItems = inRes?.data?.items ?? []
      const byTransfer = new Map()
      for (const row of inItems) {
        const tid = row.transfer?.id
        if (!tid) continue
        if (!byTransfer.has(tid)) {
          byTransfer.set(tid, {
            id: tid,
            waybillRef: row.transfer?.code || row.transfer?.name || '—',
            source: row.source || '—',
            sourceType: row.sourceType || '',
            driver: row.driver || '—',
            vehicle: row.vehicle || '—',
            date: row.date,
            status: row.status || 'IN_TRANSIT',
            lines: [],
            totalSent: 0,
          })
        }
        const g = byTransfer.get(tid)
        g.lines.push(row)
        g.totalSent += Number(row.qtySent) || 0
      }
      const awaiting = Array.from(byTransfer.values())
      setIncoming(awaiting)

      // --- history (RECEIVED) ---
      const doneItems = doneRes?.data?.items ?? []
      setHistoryRows(
        doneItems.map((r, i) => ({
          key: `${r.transfer?.id || r.lineId}-${r.lineId || i}`,
          waybill: r.transfer?.code || r.transfer?.name || '—',
          origin: r.source || '—',
          originType: /FACTORY/i.test(r.sourceType || '')
            ? 'Factory'
            : 'Showroom',
          product: r.product || r.productCode || '—',
          dispatched: fmtDate(r.date),
          received: r.receivedDate ? fmtDate(r.receivedDate) : '—',
          sent: Number(r.qtySent) || 0,
          accepted: Number(r.qtyReceived) || 0,
          rejected: Number(r.qtyRejected) || 0,
        }))
      )

      setSelectedId((prev) => {
        if (prev && awaiting.some((t) => t.id === prev)) return prev
        return awaiting[0]?.id ?? null
      })
    } catch (e) {
      showToast('Could not load consignments', e.message, true)
    } finally {
      setLoadingList(false)
    }
  }, [selectedShowroomId, statusFilter, showToast])

  useEffect(() => {
    loadLists()
  }, [loadLists])

  // ---------- 5) load the selected waybill detail ----------
  useEffect(() => {
    if (!selectedId) {
      setDetail(null)
      setRows([])
      return
    }
    let cancelled = false
    setLoadingDetail(true)
    inventoryApi
      .getStockTransferWithLines(selectedId)
      .then((res) => {
        if (cancelled) return
        const t = res.data
        setDetail(t)
        setRows(
          (t.lines || []).map((l) => ({
            id: l.id,
            stockTransferLineId: l.id,
            stockItemId: l.stockItem?.id,
            product: l.stockItem?.name || l.stockItem?.code || '—',
            batch: l.batchNo || '—',
            sent: Number(l.qtySent) || 0,
            unit: l.unit || '—',
            accepted: String(Number(l.qtySent) || 0),
            rejected: '',
            note: '',
          }))
        )
        setNote('')
        setReceivedDate(todayIso())
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load waybill', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false)
      })
    return () => {
      cancelled = true
    }
  }, [selectedId, showToast])

  // ---------- handlers ----------
  function pick(id) {
    setSelectedId(id)
  }

  function update(i, key, value) {
    setRows((rs) =>
      rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r))
    )
  }

  const decorated = rows.map((r) => {
    const acc = Number(r.accepted) || 0
    const rej = Number(r.rejected) || 0
    return {
      ...r,
      sentDisplay: fmt(r.sent),
      variance: acc + rej - r.sent,
    }
  })

  const errors = decorated.map((r) =>
    r.variance !== 0
      ? {
          field: 'accepted',
          message:
            r.variance > 0
              ? `Accepted plus rejected exceeds the ${fmt(r.sent)} dispatched by ${fmt(r.variance)}.`
              : `${fmt(-r.variance)} of the ${fmt(r.sent)} dispatched is unaccounted for — record it as accepted or rejected.`,
        }
      : null
  )

  const columns = [
    { key: 'product', label: 'Product', type: 'static', width: 260 },
    { key: 'batch', label: 'Batch', type: 'static', width: 120 },
    {
      key: 'sentDisplay',
      label: 'Qty dispatched',
      type: 'static',
      align: 'right',
      width: 140,
    },
    {
      key: 'accepted',
      label: 'Qty accepted',
      type: 'number',
      width: 140,
      placeholder: '0',
    },
    {
      key: 'rejected',
      label: 'Qty rejected',
      type: 'number',
      width: 140,
      placeholder: '0',
    },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    {
      key: 'note',
      label: 'Rejection note',
      type: 'text',
      width: 240,
      placeholder: 'Reason if rejecting',
    },
  ]

  const totalAccepted = decorated.reduce(
    (n, r) => n + (Number(r.accepted) || 0),
    0
  )
  const totalRejected = decorated.reduce(
    (n, r) => n + (Number(r.rejected) || 0),
    0
  )

  const noAreaForShowroom = !!detail && !defaultAreaId
  const blocked = errors.some(Boolean) || noAreaForShowroom

  const historyColumns = [
    { key: 'waybill', label: 'Waybill', width: 120, mono: true },
    { key: 'origin', label: 'Origin', width: 200 },
    {
      key: 'originType',
      label: 'Type',
      width: 120,
      render: (r) => (
        <Badge tone={r.originType === 'Factory' ? 'brand' : 'neutral'}>
          {r.originType}
        </Badge>
      ),
    },
    { key: 'product', label: 'Product', width: 240 },
    { key: 'dispatched', label: 'Dispatched', width: 130 },
    { key: 'received', label: 'Received', width: 130 },
    {
      key: 'sent',
      label: 'Sent',
      width: 100,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.sent),
    },
    {
      key: 'accepted',
      label: 'Accepted',
      width: 110,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.accepted),
    },
    {
      key: 'rejected',
      label: 'Rejected',
      width: 110,
      align: 'right',
      mono: true,
      render: (r) =>
        r.rejected ? (
          <span style={{ color: 'var(--danger)' }}>{fmt(r.rejected)}</span>
        ) : (
          '—'
        ),
    },
  ]

  // Stock items on this waybill that will actually enter stock and have
  // no price list history yet.
  async function findItemsWithoutPriceList() {
    const unique = new Map()
    for (const r of rows) {
      if (!r.stockItemId) continue
      if ((Number(r.accepted) || 0) <= 0) continue // fully rejected: not entering stock
      if (!unique.has(r.stockItemId)) {
        unique.set(r.stockItemId, { stockItemId: r.stockItemId, name: r.product })
      }
    }

    const checks = await Promise.all(
      Array.from(unique.values()).map(async (item) => {
        try {
          const res = await inventoryApi.listPriceListProductHistory({
            stockItemId: item.stockItemId,
            page: 0,
            size: 1,
          })
          const count = res?.data?.items?.length ?? 0
          return { item, hasHistory: count > 0 }
        } catch (e) {
          throw new Error(
            `Could not check the price list for ${item.name}: ${e.message}`
          )
        }
      })
    )
    return checks.filter((c) => !c.hasHistory).map((c) => c.item)
  }

  // The actual receipt call, used once prices are in place.
  async function receiveNow() {
    const body = {
      receivedDate,
      note: note || '',
      lines: rows.map((r) => ({
        stockTransferLineId: r.stockTransferLineId,
        qtyReceived: Number(r.accepted) || 0,
        qtyRejected: Number(r.rejected) || 0,
        rejectionNote: r.note || '',
        receivedIntoLocationId: defaultAreaId,
      })),
    }
    await inventoryApi.receiveStockTransfer(detail.id, body)
    showToast(
      'Receipt confirmed',
      `Waybill ${detail.waybillRef} has been received.`
    )
    setSelectedId(null)
    setDetail(null)
    setRows([])
    await loadLists()
  }

  async function handleSubmit() {
    if (!detail || blocked || !defaultAreaId) return
    setSubmitting(true)
    try {
      const missing = await findItemsWithoutPriceList()
      if (missing.length > 0) {
        setPriceItems(
          missing.map((m) => ({ ...m, retail: '', dealer: '' }))
        )
        setPriceEffectiveFrom(todayIso())
        setPriceNote('')
        setPriceModalOpen(true)
        return
      }
      await receiveNow()
    } catch (e) {
      showToast('Could not confirm receipt', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  function updatePriceItem(i, key, value) {
    setPriceItems((items) =>
      items.map((it, ii) => (ii === i ? { ...it, [key]: value } : it))
    )
  }

  async function publishPricesAndReceive() {
    setPublishing(true)
    try {
      const res = await inventoryApi.publishPriceList({
        effectiveFrom: priceEffectiveFrom,
        note: priceNote.trim(),
        entries: priceItems.map((it) => ({
          stockItemId: it.stockItemId,
          retailPrice: Number(it.retail),
          dealerPrice: Number(it.dealer),
        })),
      })
      const below = res?.data?.belowCostCount || 0
      showToast(
        'Prices published',
        below > 0
          ? `${below} item${below === 1 ? ' is' : 's are'} priced below cost.`
          : `Price list created for ${priceItems.length} item${priceItems.length === 1 ? '' : 's'}.`
      )
    } catch (e) {
      // keep the modal open so the prices can be corrected
      showToast('Could not publish prices', e.message, true)
      setPublishing(false)
      return
    }

    setPriceModalOpen(false)
    setSubmitting(true)
    try {
      await receiveNow()
    } catch (e) {
      showToast('Could not confirm receipt', e.message, true)
    } finally {
      setSubmitting(false)
      setPublishing(false)
    }
  }

  const originType = detail
    ? /FACTORY/i.test(detail.sourceLocation?.type || '')
      ? 'Factory'
      : 'Showroom'
    : null

  const showroomOptions = showrooms.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  // ---------- nothing to show: no showrooms at all ----------
  if (!loadingShowrooms && showrooms.length === 0) {
    return (
      <FormShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Receive Product'}
        icon={leaf?.icon}
        description="Confirm and record products arriving at a showroom."
        submitLabel="Confirm receipt"
        submitDisabled
        onCancel={() => {}}
      >
        <Panel title="No showrooms available">
          <Callout tone="warning" icon="triangle-alert">
            No active showrooms were found. Ask an administrator to set up
            at least one showroom before receiving stock.
          </Callout>
        </Panel>
      </FormShell>
    )
  }

  return (
    <>
      {(loadingList ||
        loadingDetail ||
        submitting ||
        loadingShowrooms) && (
        <Loader
          overlay
          label={
            submitting
              ? 'Confirming receipt…'
              : loadingDetail
                ? 'Loading waybill…'
                : loadingShowrooms
                  ? 'Loading showrooms…'
                  : 'Loading consignments…'
          }
        />
      )}
      {priceModalOpen && (
        <MissingPricesModal
          items={priceItems}
          effectiveFrom={priceEffectiveFrom}
          note={priceNote}
          busy={publishing}
          onItemChange={updatePriceItem}
          onEffectiveFromChange={setPriceEffectiveFrom}
          onNoteChange={setPriceNote}
          onCancel={() => setPriceModalOpen(false)}
          onConfirm={publishPricesAndReceive}
        />
      )}
      <FormShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Receive Product'}
        icon={leaf?.icon}
        description="Confirm and record products arriving at this showroom, whether supplied from a factory or transferred from another showroom. Check the goods against the waybill before confirming."
        submitLabel="Confirm receipt"
        onSubmit={handleSubmit}
        onCancel={() => {}}
        submitDisabled={blocked || !detail || submitting || !defaultAreaId}
        note="Stock is added to this showroom only once receipt is confirmed. Rejected quantities are returned against the waybill and do not enter stock. Products without a price list will need one before receipt is confirmed."
        aside={
          detail ? (
            <>
              <Panel title="Consignment">
                <MetaRow label="Waybill" value={detail.waybillRef} mono />
                <MetaRow
                  label="Origin"
                  value={detail.sourceLocation?.name || '—'}
                />
                <MetaRow label="Type" value={originType} />
                <MetaRow label="Driver" value={detail.driver?.name || '—'} />
                <MetaRow
                  label="Vehicle"
                  value={detail.driverVehicle || '—'}
                  mono
                />
                <MetaRow
                  label="Dispatched"
                  value={fmtDate(detail.transferDate || detail.dispatchedAt)}
                />
                <MetaRow
                  label="Accepting into"
                  value={
                    areas.find((a) => a.value === defaultAreaId)?.label ||
                    '—'
                  }
                />
              </Panel>

              <Panel title="Receipt summary">
                <MetaRow label="Lines" value={rows.length} mono />
                <MetaRow
                  label="Total accepted"
                  value={fmt(totalAccepted)}
                  mono
                  tone="positive"
                />
                <MetaRow
                  label="Total rejected"
                  value={totalRejected ? fmt(totalRejected) : '—'}
                  mono
                  tone={totalRejected ? 'negative' : undefined}
                />
                {noAreaForShowroom && (
                  <Callout
                    tone="danger"
                    icon="circle-alert"
                    title="No receiving area"
                    style={{ marginTop: 14 }}
                  >
                    This showroom has no areas configured. Add a receiving
                    area before confirming receipt.
                  </Callout>
                )}
                {blocked && !noAreaForShowroom && (
                  <Callout
                    tone="danger"
                    icon="circle-alert"
                    title="Quantities do not reconcile"
                    style={{ marginTop: 14 }}
                  >
                    Accepted plus rejected must equal the quantity dispatched
                    on every line before receipt can be confirmed.
                  </Callout>
                )}
                {!blocked && totalRejected > 0 && (
                  <Callout
                    tone="warning"
                    icon="triangle-alert"
                    style={{ marginTop: 14 }}
                  >
                    {fmt(totalRejected)} unit
                    {totalRejected === 1 ? '' : 's'} will be recorded as
                    rejected against waybill {detail.waybillRef} and raised
                    with the dispatching location.
                  </Callout>
                )}
              </Panel>
            </>
          ) : (
            <Panel title="Consignment">
              <div
                style={{
                  color: 'var(--text-muted)',
                  font: 'var(--type-caption)',
                }}
              >
                Select a consignment to review.
              </div>
            </Panel>
          )
        }
      >
        {/* ---------- filters ---------- */}
        <Panel
          title="Filters"
          description="Pick the receiving showroom and the kind of transfer you're looking for."
        >
          <FieldSet columns={2}>
            <FilterSelect
              label="Receiving showroom"
              value={selectedShowroomId}
              onChange={(e) => setSelectedShowroomId(e.target.value)}
              options={showroomOptions}
              disabled={loadingShowrooms || showrooms.length === 0}
            />
            <FilterSelect
              label="Show"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_OPTIONS}
            />
          </FieldSet>
        </Panel>

        {/* ---------- awaiting receipt ---------- */}
        {selectedShowroomId && statusFilter !== 'RECEIVED' && (
          <Panel
            title="Awaiting receipt"
            description="Consignments dispatched to this showroom that have not yet been confirmed."
          >
            {incoming.length === 0 && !loadingList ? (
              <div
                style={{
                  color: 'var(--text-muted)',
                  padding: '12px 0',
                }}
              >
                No consignments awaiting receipt.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 10,
                }}
              >
                {incoming.map((c) => {
                  const on = c.id === selectedId
                  const originIsFactory = /FACTORY/i.test(
                    c.sourceType || ''
                  )
                  return (
                    <div
                      key={c.id}
                      onClick={() => pick(c.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '12px 14px',
                        cursor: 'pointer',
                        background: on
                          ? 'var(--brand-subtle)'
                          : 'var(--surface-card)',
                        border: `1px solid ${
                          on
                            ? 'var(--brand-border)'
                            : 'var(--border-default)'
                        }`,
                        borderRadius: 'var(--radius-md)',
                        transition: 'var(--transition-control)',
                      }}
                    >
                      <Icon
                        name={originIsFactory ? 'factory' : 'store'}
                        size={16}
                        color={on ? 'var(--brand)' : 'var(--text-subtle)'}
                      />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)',
                              color: 'var(--text-strong)',
                            }}
                          >
                            {c.waybillRef}
                          </span>
                          <Badge tone="warning">
                            {(c.status || 'IN_TRANSIT').replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div
                          style={{
                            font: 'var(--type-caption)',
                            color: 'var(--text-muted)',
                            marginTop: 3,
                          }}
                        >
                          {c.source} · {c.driver} · {fmtDate(c.date)}
                        </div>
                        <div
                          style={{
                            font: 'var(--type-caption)',
                            color: 'var(--text-subtle)',
                            marginTop: 2,
                          }}
                        >
                          {c.lines.length} line
                          {c.lines.length === 1 ? '' : 's'} ·{' '}
                          {fmt(c.totalSent)} units
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Panel>
        )}

        {/* ---------- waybill detail ---------- */}
        {detail && (
          <Panel
            title={`Goods on waybill ${detail.waybillRef}`}
            description="Count the goods against the waybill. Record anything damaged or short as rejected."
            actions={
              <Button variant="secondary" size="sm" iconLeft="qr-code">
                Scan
              </Button>
            }
          >
            <FieldSet columns={3}>
              <Input
                label="Date received"
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
              <Input label="Received by" value={userName} disabled />
              <Input
                label="Receipt note"
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </FieldSet>
            <div style={{ marginTop: 16 }}>
              <LineItems
                columns={columns}
                rows={decorated}
                errors={errors}
                onChange={update}
                summary={[
                  { label: 'Accepted', value: fmt(totalAccepted) },
                  { label: 'Rejected', value: fmt(totalRejected) },
                ]}
              />
            </div>
          </Panel>
        )}

        {/* ---------- history ---------- */}
        {selectedShowroomId && statusFilter !== 'IN_TRANSIT' && (
          <Panel
            title="Recently received"
            description="Consignments already confirmed into this showroom."
            padding={0}
          >
            <ReportTable
              columns={historyColumns}
              rows={historyRows}
              rowKey={(r) => r.key}
              stickyHeader={false}
              style={{ border: 'none', borderRadius: 0 }}
              emptyTitle="No recent receipts"
              emptyDescription="Confirmed receipts will appear here."
            />
          </Panel>
        )}
      </FormShell>
    </>
  )
}