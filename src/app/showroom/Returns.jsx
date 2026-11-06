// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { showrooms, dealerWallets, returnReasons, recentReturns, showroomStock } from '../sampleShowroom.js'
// import { fmt, money } from '../utils.js'

// const productOptions = [...new Map(showroomStock.map((s) => [s.detail, { value: s.detail, label: s.detail, price: s.price }])).values()]
// const PRICES = Object.fromEntries(productOptions.map((p) => [p.value, p.price]))

// const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', reason: '', condition: '' })

// export default function Returns({ leaf, moduleLabel, parentLabel, dealer = false }) {
//   const [rows, setRows] = useState([blank()])
//   const [dealerId, setDealerId] = useState('dl-bendel')

//   const wallet = dealerWallets.find((d) => d.value === dealerId) || dealerWallets[0]

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const price = PRICES[r.product]
//     const qty = Number(r.qty) || 0
//     return {
//       ...r,
//       unitPrice: price ? money(price) : undefined,
//       lineValue: price && qty ? money(price * qty) : undefined,
//     }
//   })

//   const columns = [
//     { key: 'product', label: 'Product returned', type: 'select', options: productOptions, width: 280, placeholder: 'Select product…' },
//     { key: 'qty', label: 'Quantity', type: 'number', width: 120, placeholder: '0' },
//     { key: 'unitPrice', label: 'Unit price', type: 'static', align: 'right', width: 140 },
//     { key: 'lineValue', label: 'Return value', type: 'static', align: 'right', width: 150 },
//     { key: 'reason', label: 'Reason *', type: 'select', options: returnReasons, width: 210, placeholder: 'Select reason…' },
//     { key: 'condition', label: 'Condition', type: 'select', options: [{ value: 'resaleable', label: 'Resaleable' }, { value: 'damaged', label: 'Damaged — write off' }, { value: 'quarantine', label: 'Quarantine' }], width: 190, placeholder: 'Select…' },
//   ]

//   const active = rows.filter((r) => r.product)
//   const creditValue = rows.reduce((n, r) => n + (PRICES[r.product] || 0) * (Number(r.qty) || 0), 0)
//   const missingReason = rows.some((r) => r.product && !r.reason)
//   const newBalance = (dealer ? wallet.balance : 0) + creditValue

//   const historyColumns = [
//     { key: 'ref', label: 'Reference', width: 110, mono: true },
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'party', label: 'Returned by', width: 210 },
//     {
//       key: 'type', label: 'Type', width: 130,
//       render: (r) => <Badge tone={r.type === 'Dealer' ? 'brand' : 'neutral'}>{r.type}</Badge>,
//     },
//     { key: 'product', label: 'Product', width: 240 },
//     { key: 'qty', label: 'Qty', width: 90, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     { key: 'value', label: 'Credited', width: 150, align: 'right', mono: true, render: (r) => money(r.value) },
//     { key: 'reason', label: 'Reason', width: 210 },
//     {
//       key: 'wallet', label: 'Wallet', width: 150,
//       render: (r) => <Badge tone={r.wallet === 'Dealer wallet' ? 'success' : 'warning'}>{r.wallet}</Badge>,
//     },
//   ]

//   const history = recentReturns.filter((r) => (dealer ? r.type === 'Dealer' : r.type === 'Non-dealer'))

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || (dealer ? 'Returns — Dealer' : 'Returns — Non-Dealer')}
//       icon={leaf?.icon}
//       description={dealer
//         ? 'Process returned goods from a registered dealer. The value of the return is credited to the dealer’s wallet for use against future purchases.'
//         : 'Process returned goods from a walk-in customer or end user who is not a registered dealer. A temporary customer record and wallet are created automatically, and the return value is credited to it.'}
//       submitLabel="Process return"
//       onCancel={() => {}}
//       note={dealer
//         ? 'The dealer’s wallet balance updates immediately once the return is processed.'
//         : 'A temporary customer record and wallet are created on processing, and are removed automatically once the wallet balance reaches zero.'}
//       aside={
//         <>
//           <Panel title="Wallet impact">
//             {dealer ? (
//               <>
//                 <MetaRow label="Dealer" value={wallet.label} />
//                 <MetaRow label="Current balance" value={money(wallet.balance)} mono />
//                 <MetaRow label="Return credit" value={creditValue ? money(creditValue) : '—'} mono tone={creditValue ? 'positive' : undefined} />
//               </>
//             ) : (
//               <>
//                 <MetaRow label="Wallet type" value="Temporary" />
//                 <MetaRow label="Current balance" value={money(0)} mono />
//                 <MetaRow label="Return credit" value={creditValue ? money(creditValue) : '—'} mono tone={creditValue ? 'positive' : undefined} />
//               </>
//             )}
//             <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Balance after return</div>
//               <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
//                 {money(newBalance)}
//               </div>
//             </div>
//             {missingReason && (
//               <Callout tone="warning" icon="circle-alert" style={{ marginTop: 14 }}>
//                 A reason is required on every line before the return can be processed.
//               </Callout>
//             )}
//           </Panel>

//           {!dealer && (
//             <Callout tone="info" icon="user-round-plus" title="Temporary customer record">
//               If this customer has no existing record, one is created along with a wallet. Both are removed
//               automatically once the wallet balance is fully spent and reaches zero.
//             </Callout>
//           )}
//         </>
//       }
//     >
//       <Panel title={dealer ? 'Dealer' : 'Customer'} description={dealer ? 'The registered dealer returning the goods.' : 'Walk-in customer details. A temporary record is created if none exists.'}>
//         <FieldSet columns={3}>
//           <Select label="Showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
//           {dealer ? (
//             <>
//               <Select label="Dealer" options={dealerWallets} value={dealerId} onChange={(e) => setDealerId(e.target.value)} />
//               <Input label="Original invoice no." placeholder="e.g. INV-31240" />
//             </>
//           ) : (
//             <>
//               <Input label="Customer name" placeholder="e.g. Adaeze Nwankwo" />
//               <Input label="Phone number" placeholder="+234 …" hint="Used to match an existing temporary record." />
//             </>
//           )}
//           <Input label="Return date" type="date" />
//           {!dealer && <Input label="Original receipt no." placeholder="e.g. RCP-88214" />}
//           <Input label="Reference no." placeholder="Auto-generated" disabled value={dealer ? 'RT-0458' : 'RT-0457'} />
//         </FieldSet>
//         {dealer && (
//           <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//             <Badge tone="brand">Registered dealer</Badge>
//             <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//               Wallet balance {money(wallet.balance)} · credit applies to future purchases per company policy.
//             </span>
//           </div>
//         )}
//       </Panel>

//       <Panel title="Goods returned" description="Return value is calculated at the current selling price of each product.">
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//           addLabel="Add returned product"
//           emptyLabel="No products added yet."
//           summary={[
//             { label: 'Lines', value: active.length },
//             { label: 'Credit value', value: money(creditValue) },
//           ]}
//         />
//       </Panel>

//       <Panel title={dealer ? 'Recent dealer returns' : 'Recent non-dealer returns'} padding={0}>
//         <ReportTable
//           columns={historyColumns}
//           rows={history}
//           rowKey={(r) => r.ref}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//           emptyLabel="No returns recorded yet"
//         />
//       </Panel>
//     </FormShell>
//   )
// }

import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, fmtDate } from '../utils.js'
import CustomerApi from '../../api/CustomerApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const customerApi = new CustomerApi()
const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()

const HISTORY_PAGE_SIZE = 20

// values match the filter metadata / create credentials exactly
const RETURN_REASONS = [
  { value: 'DAMAGED_IN_TRANSIT', label: 'Damaged in transit' },
  { value: 'EXPIRED_OR_NEAR_EXPIRY', label: 'Expired or near expiry' },
  { value: 'WRONG_ITEM_SUPPLIED', label: 'Wrong item supplied' },
  { value: 'PRODUCT_DEFECT', label: 'Product defect' },
  { value: 'UNSOLD_AGREED_RETURN', label: 'Unsold agreed return' },
  { value: 'CUSTOMER_DISSATISFACTION', label: 'Customer dissatisfaction' },
]

const CONDITIONS = [
  { value: 'RESALEABLE', label: 'Resaleable' },
  { value: 'QUARANTINE', label: 'Quarantine' },
  { value: 'DAMAGED_WRITE_OFF', label: 'Damaged / write off' },
]

const RETURN_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'POSTED', label: 'Posted' },
  { value: 'REVERSED', label: 'Reversed' },
]

const REASON_LABEL = Object.fromEntries(
  RETURN_REASONS.map((r) => [r.value, r.label])
)
const CONDITION_LABEL = Object.fromEntries(
  CONDITIONS.map((c) => [c.value, c.label])
)

const newLine = () => ({
  id: Math.random().toString(36).slice(2),
  stockItemId: '',
  qty: '',
  reason: '',
  condition: 'RESALEABLE',
  note: '',
})

export default function Returns({ leaf, moduleLabel, parentLabel, dealer = false }) {
  const store = useStore()
  const showToast = store.showToast

  // showrooms
  const [showrooms, setShowrooms] = useState([])
  const [showroomId, setShowroomId] = useState('')
  const [loadingShowrooms, setLoadingShowrooms] = useState(false)

  // per-showroom data
  const [defaultReceivingId, setDefaultReceivingId] = useState('')
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [dealers, setDealers] = useState([])
  const [loadingDealers, setLoadingDealers] = useState(false)

  // form fields
  const [dealerId, setDealerId] = useState('')
  const [walkInName, setWalkInName] = useState('')
  const [walkInPhone, setWalkInPhone] = useState('')
  const [originalRef, setOriginalRef] = useState('')
  const [returnDate, setReturnDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  )
  const [note, setNote] = useState('')

  // lines
  const [rows, setRows] = useState([newLine()])

  // submit
  const [submitting, setSubmitting] = useState(false)

  // history (server-backed)
  const [historyRows, setHistoryRows] = useState([])
  const [historyPage, setHistoryPage] = useState(0)
  const [historyTotalPages, setHistoryTotalPages] = useState(0)
  const [historyTotalItems, setHistoryTotalItems] = useState(0)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [conditionFilter, setConditionFilter] = useState('')
  const [reasonFilter, setReasonFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // ── load showrooms ───────────────────────────────────────
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
        setShowroomId((prev) => prev || list[0]?.value || '')
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
  }, [showToast])

  // ── on showroom change: area + products + dealers ────────
 useEffect(() => {
  if (!showroomId) {
    setDefaultReceivingId('')
    setProducts([])
    setDealers([])
    return
  }
  let cancelled = false

  showroomApi
    .retrieveShowroom(showroomId)
    .then((res) => {
      if (cancelled) return
      const areas = res.data?.areas || []
      setDefaultReceivingId(
        res.data?.defaultReceivingLocation?.id || areas[0]?.id || ''
      )
    })
    .catch(() => {})

  setLoadingProducts(true)

  // Two sources only:
  //   1. OUTSOURCED stock items
  //   2. products appearing in direct stock entries
  Promise.all([
    inventoryApi.listStockItems(showroomId, 'OUTSOURCED', { page: 0, size: 100 }),
    showroomApi
      .listDirectStockEntries({ locationId: showroomId, page: 0, size: 100 })
      .catch(() => ({ data: { items: [] } })), // non-fatal: still show outsourced
  ])
    .then(([outsourcedRes, entriesRes]) => {
      if (cancelled) return

      // 1) outsourced
      const outsourcedIds = new Set()
      const merged = []

      for (const p of outsourcedRes.data?.items || []) {
        outsourcedIds.add(p.id)
        merged.push({
          value: p.id,
          label: `${p.name} (Outsourced)`,
          name: p.name,
          price: p.markupCost ?? p.landingCost ?? 0,
          unit: p.unitOfMeasure?.name || '',
          source: 'OUTSOURCED',
        })
      }

      // 2) direct-entry products, deduped by stockItem.id
      const directEntrySeen = new Map()
      for (const e of entriesRes.data?.items || []) {
        const sid = e.stockItem?.id
        if (!sid) continue
        if (!directEntrySeen.has(sid)) {
          directEntrySeen.set(sid, {
            name: e.stockItem?.name || e.product || sid,
            unitCost: e.unitCost || 0,
            unit: e.unit || '',
          })
        }
      }

      for (const [sid, entry] of directEntrySeen) {
        if (outsourcedIds.has(sid)) continue // already listed as outsourced

        merged.push({
          value: sid,
          label: `${entry.name} (Direct entry)`,
          name: entry.name,
          price: entry.unitCost,
          unit: entry.unit,
          source: 'DIRECT_ENTRY',
        })
      }

      merged.sort((a, b) => a.name.localeCompare(b.name))
      setProducts(merged)
    })
    .catch((e) => {
      if (!cancelled) showToast('Could not load products', e.message, true)
    })
    .finally(() => {
      if (!cancelled) setLoadingProducts(false)
    })

  if (dealer) {
    setLoadingDealers(true)
    customerApi
      .listCustomers({
        type: ['AUTHORISED_DEALER'],
        locationId: showroomId,
        page: 0,
        size: 100,
      })
      .then((res) => {
        if (cancelled) return
        setDealers(
          (res.data?.items || []).map((d) => ({
            value: d.id,
            label: d.name,
            walletBalance: d.walletBalance || 0,
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load dealers', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingDealers(false)
      })
  }

  return () => {
    cancelled = true
  }
}, [showroomId, dealer, showToast])
// useEffect(() => {
//   if (!showroomId) {
//     setDefaultReceivingId('')
//     setProducts([])
//     setDealers([])
//     return
//   }
//   let cancelled = false

//   showroomApi
//     .retrieveShowroom(showroomId)
//     .then((res) => {
//       if (cancelled) return
//       const areas = res.data?.areas || []
//       setDefaultReceivingId(
//         res.data?.defaultReceivingLocation?.id || areas[0]?.id || ''
//       )
//     })
//     .catch(() => {})

//   setLoadingProducts(true)

//   // Build the product dropdown from two sources:
//   //   1. OUTSOURCED stock items (explicit item type)
//   //   2. FINISHED_PRODUCT items that appear in direct stock entries
//   // A product that is both is listed once, as outsourced.
//   Promise.all([
//     inventoryApi.listStockItems(showroomId, 'OUTSOURCED', { page: 0, size: 100 }),
//     // inventoryApi.listStockItems(showroomId, 'FINISHED_PRODUCT', { page: 0, size: 500 }),
//     showroomApi
//       .listDirectStockEntries({ locationId: showroomId, page: 0, size: 100 })
//       .catch(() => ({ data: { items: [] } })), // non-fatal: still show outsourced
//   ])
//     .then(([outsourcedRes, finishedRes, entriesRes]) => {
//       if (cancelled) return

//       // index finished products so we can enrich direct-entry items with real prices
//       const finishedMap = new Map()
//       for (const p of finishedRes.data?.items || []) {
//         finishedMap.set(p.id, p)
//       }

//       // 1) outsourced
//       const outsourcedIds = new Set()
//       const merged = []

//       for (const p of outsourcedRes.data?.items || []) {
//         outsourcedIds.add(p.id)
//         merged.push({
//           value: p.id,
//           label: `${p.name} (Outsourced)`,
//           name: p.name,
//           price: p.markupCost ?? p.landingCost ?? 0,
//           unit: p.unitOfMeasure?.name || '',
//           source: 'OUTSOURCED',
//         })
//       }

//       // 2) direct-entry products, deduped by stockItem.id
//       const directEntrySeen = new Map() // stockItemId -> { name, unitCost, unit }
//       for (const e of entriesRes.data?.items || []) {
//         const sid = e.stockItem?.id
//         if (!sid) continue
//         if (!directEntrySeen.has(sid)) {
//           directEntrySeen.set(sid, {
//             name: e.stockItem?.name || e.product || sid,
//             unitCost: e.unitCost || 0,
//             unit: e.unit || '',
//           })
//         }
//       }

//       for (const [sid, entry] of directEntrySeen) {
//         if (outsourcedIds.has(sid)) continue // already listed as outsourced

//         const finished = finishedMap.get(sid)
//         if (finished) {
//           merged.push({
//             value: finished.id,
//             label: `${finished.name} (Direct entry)`,
//             name: finished.name,
//             price: finished.markupCost ?? finished.landingCost ?? 0,
//             unit: finished.unitOfMeasure?.name || entry.unit,
//             source: 'DIRECT_ENTRY',
//           })
//         } else {
//           // finished product info not available — fall back to entry data
//           merged.push({
//             value: sid,
//             label: `${entry.name} (Direct entry)`,
//             name: entry.name,
//             price: entry.unitCost,
//             unit: entry.unit,
//             source: 'DIRECT_ENTRY',
//           })
//         }
//       }

//       // sort by name so the dropdown reads naturally
//       merged.sort((a, b) => a.name.localeCompare(b.name))
//       setProducts(merged)
//     })
//     .catch((e) => {
//       if (!cancelled) showToast('Could not load products', e.message, true)
//     })
//     .finally(() => {
//       if (!cancelled) setLoadingProducts(false)
//     })

//   if (dealer) {
//     setLoadingDealers(true)
//     customerApi
//       .listCustomers({
//         type: ['AUTHORISED_DEALER'],
//         locationId: showroomId,
//         page: 0,
//         size: 100,
//       })
//       .then((res) => {
//         if (cancelled) return
//         setDealers(
//           (res.data?.items || []).map((d) => ({
//             value: d.id,
//             label: d.name,
//             walletBalance: d.walletBalance || 0,
//           }))
//         )
//       })
//       .catch((e) => {
//         if (!cancelled) showToast('Could not load dealers', e.message, true)
//       })
//       .finally(() => {
//         if (!cancelled) setLoadingDealers(false)
//       })
//   }

//   return () => {
//     cancelled = true
//   }
// }, [showroomId, dealer, showToast])
  // ── reset history page when filters change ───────────────
  useEffect(() => {
    setHistoryPage(0)
  }, [showroomId, dealer, conditionFilter, reasonFilter, statusFilter])

  // ── load history ─────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!showroomId) {
      setHistoryRows([])
      setHistoryTotalPages(0)
      setHistoryTotalItems(0)
      return
    }
    setHistoryLoading(true)
    try {
      const res = await showroomApi.listCustomerReturns({
        returnType: dealer ? 'DEALER' : 'NON_DEALER',
        locationId: showroomId,
        page: historyPage,
        size: HISTORY_PAGE_SIZE,
        condition: conditionFilter || undefined,
        reason: reasonFilter || undefined,
        status: statusFilter || undefined,
      })
      const paged = res.data
      setHistoryRows(paged.items || [])
      setHistoryTotalPages(paged.totalPages || 0)
      setHistoryTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load returns', e.message, true)
    } finally {
      setHistoryLoading(false)
    }
  }, [
    showroomId,
    dealer,
    historyPage,
    conditionFilter,
    reasonFilter,
    statusFilter,
    showToast,
  ])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // ── derived lookups ──────────────────────────────────────
  const productByValue = Object.fromEntries(
    products.map((p) => [p.value, p])
  )
  const dealerByValue = Object.fromEntries(
    dealers.map((d) => [d.value, d])
  )
  const wallet = dealerByValue[dealerId] || {
    walletBalance: 0,
    label: '—',
  }

  function update(i, key, value) {
    setRows((rs) =>
      rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r))
    )
  }

  const decorated = rows.map((r) => {
    const p = productByValue[r.stockItemId]
    const qty = Number(r.qty) || 0
    return {
      ...r,
      unitPrice: p?.price ? money(p.price) : undefined,
      lineValue: p?.price && qty ? money(p.price * qty) : undefined,
    }
  })

  const columns = [
    {
      key: 'stockItemId',
      label: 'Product returned',
      type: 'select',
      options: products,
      width: 280,
      placeholder: loadingProducts ? 'Loading…' : 'Select product…',
    },
    { key: 'qty', label: 'Quantity', type: 'number', width: 120, placeholder: '0' },
    { key: 'unitPrice', label: 'Unit price', type: 'static', align: 'right', width: 140 },
    { key: 'lineValue', label: 'Return value', type: 'static', align: 'right', width: 150 },
    {
      key: 'reason',
      label: 'Reason *',
      type: 'select',
      options: RETURN_REASONS,
      width: 220,
      placeholder: 'Select reason…',
    },
    {
      key: 'condition',
      label: 'Condition',
      type: 'select',
      options: CONDITIONS,
      width: 190,
      placeholder: 'Select…',
    },
    { key: 'note', label: 'Note', type: 'text', width: 200, placeholder: 'Optional' },
  ]

  const active = rows.filter(
    (r) => r.stockItemId && Number(r.qty) > 0
  )
  const creditValue = rows.reduce((n, r) => {
    const p = productByValue[r.stockItemId]
    return n + (p?.price || 0) * (Number(r.qty) || 0)
  }, 0)
  const missingReason = rows.some((r) => r.stockItemId && !r.reason)
  const missingQty = rows.some(
    (r) => r.stockItemId && !(Number(r.qty) > 0)
  )

  const balanceBefore = dealer ? wallet.walletBalance || 0 : 0
  const balanceAfter = balanceBefore + creditValue

  const canSubmit =
    !submitting &&
    !!showroomId &&
    !!defaultReceivingId &&
    originalRef.trim() &&
    returnDate &&
    active.length > 0 &&
    !missingReason &&
    !missingQty &&
    (dealer ? !!dealerId : walkInName.trim() && walkInPhone.trim())

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const body = {
        returnType: dealer ? 'DEALER' : 'NON_DEALER',
        locationId: showroomId,
        customerId: dealer ? dealerId : '',
        walkIn: dealer
          ? undefined
          : { name: walkInName.trim(), phone: walkInPhone.trim() },
        originalDocumentRef: originalRef.trim(),
        returnDate,
        note: note || '',
        lines: active.map((r) => ({
          stockItemId: r.stockItemId,
          quantity: Number(r.qty),
          reason: r.reason,
          condition: r.condition,
          intoLocationId: defaultReceivingId,
          note: r.note || '',
        })),
      }

      const res = await showroomApi.createShowroomReturn(body)
      const created = res.data

      showToast(
        'Return processed',
        `${created.ref} recorded · wallet credit ${money(created.walletCredit)}`
      )

      // refresh dealer balance and history
      if (dealer && dealerId) {
        setDealers((ds) =>
          ds.map((d) =>
            d.value === dealerId
              ? { ...d, walletBalance: created.walletBalanceAfter }
              : d
          )
        )
      }
      setHistoryPage(0)
      await loadHistory()

      // reset form (keep showroom)
      setDealerId('')
      setWalkInName('')
      setWalkInPhone('')
      setOriginalRef('')
      setNote('')
      setRows([newLine()])
    } catch (e) {
      showToast('Could not process return', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── history columns ──────────────────────────────────────
  const historyColumns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    {
      key: 'date',
      label: 'Date',
      width: 120,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'customerName',
      label: 'Returned by',
      width: 210,
      render: (r) => r.customerName || '—',
    },
    {
      key: 'returnType',
      label: 'Type',
      width: 110,
      render: (r) => (
        <Badge tone={r.returnType === 'DEALER' ? 'brand' : 'neutral'}>
          {r.returnType === 'DEALER' ? 'Dealer' : 'Non-dealer'}
        </Badge>
      ),
    },
    {
      key: 'productName',
      label: 'Product',
      width: 240,
      render: (r) => r.productName || '—',
    },
    {
      key: 'quantity',
      label: 'Qty',
      width: 80,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.quantity || 0),
    },
    {
      key: 'lineValue',
      label: 'Value',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) => money(r.lineValue || 0),
    },
    {
      key: 'reason',
      label: 'Reason',
      width: 190,
      render: (r) => REASON_LABEL[r.reason] || r.reason || '—',
    },
    {
      key: 'condition',
      label: 'Condition',
      width: 150,
      render: (r) => CONDITION_LABEL[r.condition] || r.condition || '—',
    },
    {
      key: 'creditedTo',
      label: 'Credited to',
      width: 160,
      render: (r) => (
        <Badge
          tone={
            /Dealer/i.test(r.creditedTo || '')
              ? 'success'
              : /Temporary/i.test(r.creditedTo || '')
                ? 'warning'
                : 'neutral'
          }
        >
          {r.creditedTo || '—'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 110,
      render: (r) => (
        <Badge tone={r.status === 'POSTED' ? 'success' : 'danger'}>
          {r.status || '—'}
        </Badge>
      ),
    },
  ]

  const showroomOptions = showrooms.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  return (
    <>
      {(loadingShowrooms ||
        submitting ||
        loadingProducts ||
        loadingDealers ||
        historyLoading) && (
        <Loader
          overlay
          label={
            submitting
              ? 'Processing return…'
              : loadingShowrooms
                ? 'Loading showrooms…'
                : loadingProducts
                  ? 'Loading products…'
                  : loadingDealers
                    ? 'Loading dealers…'
                    : 'Loading returns…'
          }
        />
      )}
      <FormShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || (dealer ? 'Returns — Dealer' : 'Returns — Non-Dealer')}
        icon={leaf?.icon}
        description={
          dealer
            ? 'Process returned goods from a registered dealer. The value of the return is credited to the dealer’s wallet for use against future purchases.'
            : 'Process returned goods from a walk-in customer or end user who is not a registered dealer. A temporary customer record and wallet are created automatically, and the return value is credited to it.'
        }
        submitLabel="Process return"
        onSubmit={submit}
        onCancel={() => {}}
        submitDisabled={!canSubmit}
        note={
          dealer
            ? 'The dealer’s wallet balance updates immediately once the return is processed.'
            : 'A temporary customer record and wallet are created on processing, and are removed automatically once the wallet balance reaches zero.'
        }
        aside={
          <>
            <Panel title="Wallet impact">
              {dealer ? (
                <>
                  <MetaRow label="Dealer" value={wallet.label || '—'} />
                  <MetaRow
                    label="Current balance"
                    value={money(wallet.walletBalance || 0)}
                    mono
                  />
                  <MetaRow
                    label="Return credit"
                    value={creditValue ? money(creditValue) : '—'}
                    mono
                    tone={creditValue ? 'positive' : undefined}
                  />
                </>
              ) : (
                <>
                  <MetaRow label="Wallet type" value="Temporary" />
                  <MetaRow label="Current balance" value={money(0)} mono />
                  <MetaRow
                    label="Return credit"
                    value={creditValue ? money(creditValue) : '—'}
                    mono
                    tone={creditValue ? 'positive' : undefined}
                  />
                </>
              )}
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
                  Balance after return
                </div>
                <div
                  style={{
                    marginTop: 8,
                    font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-strong)',
                  }}
                >
                  {money(balanceAfter)}
                </div>
              </div>
              {missingReason && (
                <Callout
                  tone="warning"
                  icon="circle-alert"
                  style={{ marginTop: 14 }}
                >
                  A reason is required on every line before the return can be
                  processed.
                </Callout>
              )}
            </Panel>

            {!dealer && (
              <Callout
                tone="info"
                icon="user-round-plus"
                title="Temporary customer record"
              >
                If this customer has no existing record, one is created along
                with a wallet. Both are removed automatically once the wallet
                balance is fully spent and reaches zero.
              </Callout>
            )}
          </>
        }
      >
        <Panel
          title={dealer ? 'Dealer' : 'Customer'}
          description={
            dealer
              ? 'The registered dealer returning the goods.'
              : 'Walk-in customer details. A temporary record is created if none exists.'
          }
        >
          <FieldSet columns={3}>
            <Select
              label="Showroom"
              options={showroomOptions}
              value={showroomId}
              onChange={(e) => setShowroomId(e.target.value)}
              disabled={loadingShowrooms}
            />
            {dealer ? (
              <>
                <Select
                  label="Dealer"
                  options={dealers}
                  value={dealerId}
                  onChange={(e) => setDealerId(e.target.value)}
                  placeholder={loadingDealers ? 'Loading…' : 'Select dealer…'}
                  disabled={loadingDealers}
                />
                <Input
                  label="Original invoice no."
                  placeholder="e.g. INV-31240"
                  value={originalRef}
                  onChange={(e) => setOriginalRef(e.target.value)}
                />
              </>
            ) : (
              <>
                <Input
                  label="Customer name"
                  placeholder="e.g. Adaeze Nwankwo"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                />
                <Input
                  label="Phone number"
                  placeholder="+234 …"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  hint="Used to match an existing temporary record."
                />
              </>
            )}
            <Input
              label="Return date"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
            {!dealer && (
              <Input
                label="Original receipt no."
                placeholder="e.g. RCP-88214"
                value={originalRef}
                onChange={(e) => setOriginalRef(e.target.value)}
              />
            )}
            <Input
              label="Receipt note"
              placeholder="Optional"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </FieldSet>
          {dealer && dealerId && (
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <Badge tone="brand">Registered dealer</Badge>
              <span
                style={{
                  font: 'var(--type-caption)',
                  color: 'var(--text-muted)',
                }}
              >
                Wallet balance {money(wallet.walletBalance || 0)} · credit
                applies to future purchases per company policy.
              </span>
            </div>
          )}
        </Panel>

        <Panel
          title="Goods returned"
          description="Return value is calculated at the current selling price of each product."
        >
          <LineItems
            columns={columns}
            rows={decorated}
            onChange={update}
            onAdd={() => setRows((rs) => [...rs, newLine()])}
            onRemove={(i) =>
              setRows((rs) =>
                rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)
              )
            }
            addLabel="Add returned product"
            emptyLabel="No products added yet."
            summary={[
              { label: 'Lines', value: active.length },
              { label: 'Credit value', value: money(creditValue) },
            ]}
          />
        </Panel>

        <Panel
          title={dealer ? 'Recent dealer returns' : 'Recent non-dealer returns'}
          description="Every recorded line for this showroom. Each line of a multi-product return appears as its own row."
          padding={0}
        >
          <div style={{ padding: '12px 16px' }}>
            <FieldSet columns={3}>
              <Select
                label="Condition"
                options={[
                  { value: '', label: 'All conditions' },
                  ...CONDITIONS,
                ]}
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              />
              <Select
                label="Reason"
                options={[
                  { value: '', label: 'All reasons' },
                  ...RETURN_REASONS,
                ]}
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value)}
              />
              <Select
                label="Status"
                options={RETURN_STATUSES}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </FieldSet>
          </div>
          <ReportTable
            columns={historyColumns}
            rows={historyRows}
            rowKey={(r) => `${r.returnId}-${r.lineId}`}
            stickyHeader={false}
            style={{ border: 'none', borderRadius: 0 }}
            emptyTitle="No returns recorded yet"
            emptyDescription="Processed returns for this showroom will appear here."
            pagination={{
              page: historyPage,
              pageCount: historyTotalPages,
              pageSize: HISTORY_PAGE_SIZE,
              total: historyTotalItems,
              onPage: setHistoryPage,
            }}
          />
        </Panel>
      </FormShell>
    </>
  )
}