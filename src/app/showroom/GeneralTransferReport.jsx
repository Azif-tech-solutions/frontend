// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { showrooms, showroomToShowroom, factoryToShowroom } from '../sampleShowroom.js'
// import { factories, drivers } from '../sample.js'
// import { fmt } from '../utils.js'

// const TABS = [
//   { value: 's2s', label: 'Showroom-to-Showroom', icon: 'store' },
//   { value: 'f2s', label: 'Factory-to-Showroom', icon: 'factory' },
// ]

// export default function GeneralTransferReport({ leaf, moduleLabel, parentLabel }) {
//   const [tab, setTab] = useState('s2s')
//   const isS2S = tab === 's2s'
//   const rows = isS2S ? showroomToShowroom : factoryToShowroom

//   const inTransit = rows.filter((r) => r.status === 'In transit')
//   const totalQty = rows.reduce((n, r) => n + r.qty, 0)

//   const columns = [
//     { key: 'date', label: 'Transfer date', width: 135 },
//     { key: 'waybill', label: 'Waybill no.', width: 125, mono: true },
//     { key: 'source', label: isS2S ? 'Source showroom' : 'Factory', width: 190 },
//     { key: 'destination', label: isS2S ? 'Destination showroom' : 'Receiving showroom', width: 200 },
//     { key: 'driver', label: 'Driver', width: 150 },
//     { key: 'product', label: 'Product', width: 250 },
//     { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     { key: 'unit', label: 'Unit', width: 110 },
//     {
//       key: 'received', label: 'Received date', width: 140,
//       render: (r) => (r.received === '—' ? <span style={{ color: 'var(--text-subtle)' }}>Not yet</span> : r.received),
//     },
//     {
//       key: 'status', label: 'Status', width: 130,
//       render: (r) => <Badge tone={r.status === 'Received' ? 'success' : 'warning'}>{r.status}</Badge>,
//     },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'General Transfer Report'}
//       icon={leaf?.icon}
//       description="Centralised record of stock movement across the organisation — transfers between showrooms, and supplies from factories into showrooms — for monitoring, auditing and traceability."
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       filters={[
//         isS2S
//           ? { key: 'source', label: 'Source showroom', type: 'select', options: showrooms }
//           : { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         { key: 'destination', label: 'Receiving showroom', type: 'select', options: showrooms },
//         { key: 'driver', label: 'Driver', type: 'select', options: drivers },
//         { key: 'status', label: 'Status', type: 'select', options: [{ value: 'received', label: 'Received' }, { value: 'transit', label: 'In transit' }] },
//         { key: 'from', label: 'Date from', type: 'date' },
//         { key: 'to', label: 'Date to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Transfers', value: String(rows.length) },
//         { label: 'Total quantity', value: fmt(totalQty) },
//         { label: 'In transit', value: String(inTransit.length), tone: inTransit.length ? 'warning' : undefined, hint: inTransit.length ? 'Awaiting receipt' : undefined },
//         { label: isS2S ? 'Showrooms involved' : 'Factories involved', value: String(new Set(rows.map((r) => r.source)).size) },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ date: 'Total', qty: fmt(totalQty) }}
//       tableTitle={isS2S ? 'Transfers between showrooms' : 'Supplies from factories'}
//       emptyTitle="No transfers in this period"
//       emptyDescription="Widen the date range or clear the status filter, then generate again."
//       footnote="Every completed transfer carries a waybill with a unique reference. Stock is not deducted from the source until the transfer is confirmed, and not added to the destination until receipt is acknowledged."
//     />
//   )
// }

// import { useEffect, useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { useStore } from '../store.jsx'
// import { fmt, fmtDate } from '../utils.js'
// import InventoryApi from '../../api/InventoryApi.js'
// import ShowroomApi from '../../api/ShowroomApi.js'

// const inventoryApi = new InventoryApi()
// const showroomApi = new ShowroomApi()

// const PAGE_SIZE = 20 // rows shown per page
// const FETCH_SIZE = 100 // rows requested per call while loading
// const MAX_FETCH_PAGES = 20 // safety cap: up to 2,000 transfers per report

// const TABS = [
//   { value: 's2s', label: 'Showroom-to-Showroom', icon: 'store' },
//   { value: 'f2s', label: 'Factory-to-Showroom', icon: 'factory' },
// ]

// const STATUS_OPTIONS = [
//   { value: 'received', label: 'Received' },
//   { value: 'transit', label: 'In transit' },
// ]

// const emptyFilters = { source: '', destination: '', driver: '', status: '', from: '', to: '' }

// const sentence = (s = '') => {
//   const t = s.toLowerCase().replace(/_/g, ' ')
//   return t.charAt(0).toUpperCase() + t.slice(1)
// }

// // A transfer counts as received once it has a received timestamp or a RECEIVED status.
// const isReceived = (t) => !!t.receivedAt || /RECEIVED/i.test(t.status || '')

// export default function GeneralTransferReport({ leaf, moduleLabel, parentLabel }) {
//   const { factories, showToast } = useStore()

//   const [tab, setTab] = useState('s2s')
//   const [filters, setFilters] = useState(emptyFilters) // what the controls show
//   const [applied, setApplied] = useState(emptyFilters) // what the table is currently using
//   const [transfers, setTransfers] = useState([]) // everything the endpoint returned for the server-side filters
//   const [loading, setLoading] = useState(false)
//   const [page, setPage] = useState(0)

//   const [showrooms, setShowrooms] = useState([])
//   const [drivers, setDrivers] = useState([])

//   const isS2S = tab === 's2s'

//   // ---------- lookups for the filter dropdowns ----------
//   useEffect(() => {
//     let cancelled = false

//     showroomApi
//       .lookupPickerWithAreas({})
//       .then((res) => {
//         if (!cancelled) setShowrooms((res.data || []).map((s) => ({ value: s.id, label: s.label || s.name || s.code })))
//       })
//       .catch((e) => !cancelled && showToast('Could not load showrooms', e.message, true))

//     const loadDrivers = async () => {
//       let p = 0
//       let all = []
//       let hasMore = true
//       while (hasMore && !cancelled) {
//         const { data } = await inventoryApi.listDrivers({ page: p, size: 50 })
//         all = [...all, ...(data?.items || [])]
//         hasMore = data?.totalPages != null ? p + 1 < data.totalPages : false
//         p += 1
//       }
//       if (!cancelled) setDrivers(all.map((d) => ({ value: d.id, label: d.name })))
//     }
//     loadDrivers().catch((e) => !cancelled && showToast('Could not load drivers', e.message, true))

//     return () => { cancelled = true }
//   }, [showToast])

//   // ---------- load transfers ----------
//   // The endpoint filters by location and date only. It is read in full (up to the cap)
//   // so the driver, receiving showroom and status filters can run locally on every row.
//   const generate = async (nextFilters = filters) => {
//     if (nextFilters.from && nextFilters.to && nextFilters.from > nextFilters.to) {
//       showToast('Check the dates', '"Date from" must be before "Date to".', true)
//       return
//     }

//     setLoading(true)
//     try {
//       let p = 0
//       let all = []
//       let hasMore = true
//       while (hasMore && p < MAX_FETCH_PAGES) {
//         const { data } = await inventoryApi.listStockTransfers({
//           locationId: nextFilters.source || undefined,
//           from: nextFilters.from || undefined,
//           to: nextFilters.to || undefined,
//           page: p,
//           size: FETCH_SIZE,
//         })
//         const items = data?.items ?? []
//         all = [...all, ...items]
//         hasMore = data?.totalPages != null ? p + 1 < data.totalPages : items.length === FETCH_SIZE
//         p += 1
//       }
//       if (hasMore) showToast('Showing the first 2,000 transfers', 'Narrow the date range to see the rest.', true)
//       setTransfers(all)
//       setApplied(nextFilters)
//       setPage(0)
//     } catch (error) {
//       showToast('Could not load transfers', error.message, true)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Load once on open.
//   useEffect(() => {
//     generate(emptyFilters)
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const reset = () => {
//     setFilters(emptyFilters)
//     generate(emptyFilters)
//   }

//   const changeTab = (next) => {
//     const cleared = { ...filters, source: '' } // the source list differs per tab
//     setTab(next)
//     setFilters(cleared)
//     generate(cleared)
//   }

//   // ---------- classify and filter locally ----------
//   const showroomIds = new Set(showrooms.map((s) => s.value))
//   const factoryIds = new Set(factories.map((f) => f.id))
//   const kindOf = (loc) => {
//     const type = String(loc?.type || '').toUpperCase()
//     if (type.includes('SHOWROOM')) return 'showroom'
//     if (type.includes('FACTORY')) return 'factory'
//     if (showroomIds.has(loc?.id)) return 'showroom'
//     if (factoryIds.has(loc?.id)) return 'factory'
//     return ''
//   }

//   const matching = transfers.filter((t) => {
//     const from = kindOf(t.sourceLocation)
//     const to = kindOf(t.destinationLocation)
//     if (isS2S ? !(from === 'showroom' && to === 'showroom') : !(from === 'factory' && to === 'showroom')) return false
//     if (applied.destination && t.destinationLocation?.id !== applied.destination) return false
//     if (applied.driver && t.driver?.id !== applied.driver) return false
//     if (applied.status === 'received' && !isReceived(t)) return false
//     if (applied.status === 'transit' && isReceived(t)) return false
//     return true
//   })

//   // One row per transfer line, so every product on a waybill is listed.
//   const allRows = matching.flatMap((t) => {
//     const base = {
//       date: fmtDate(t.transferDate || t.dispatchedAt),
//       waybill: t.waybillRef,
//       source: t.sourceLocation?.name || '—',
//       destination: t.destinationLocation?.name || '—',
//       driver: t.driver?.name || '—',
//       received: t.receivedDate || t.receivedAt ? fmtDate(t.receivedDate || t.receivedAt) : '—',
//       status: isReceived(t) ? 'Received' : sentence(t.status) || 'In transit',
//       received_: isReceived(t),
//     }
//     const lines = t.lines?.length ? t.lines : [null]
//     return lines.map((l, i) => ({
//       ...base,
//       key: `${t.id}-${l?.id ?? i}`,
//       transferId: t.id,
//       product: l ? l.stockItem?.name || l.stockItem?.code || '—' : '—',
//       qty: l ? Number(l.qtySent) || 0 : Number(t.totalSent) || 0,
//       unit: l?.unit || '—',
//     }))
//   })

//   const pageCount = Math.max(1, Math.ceil(allRows.length / PAGE_SIZE))
//   const rows = allRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

//   const totalQty = allRows.reduce((n, r) => n + r.qty, 0)
//   const inTransit = matching.filter((t) => !isReceived(t))
//   const involved = new Set(matching.map((t) => t.sourceLocation?.id)).size

//   const columns = [
//     { key: 'date', label: 'Transfer date', width: 135 },
//     { key: 'waybill', label: 'Waybill no.', width: 125, mono: true },
//     { key: 'source', label: isS2S ? 'Source showroom' : 'Factory', width: 190 },
//     { key: 'destination', label: isS2S ? 'Destination showroom' : 'Receiving showroom', width: 200 },
//     { key: 'driver', label: 'Driver', width: 150 },
//     { key: 'product', label: 'Product', width: 250 },
//     { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     { key: 'unit', label: 'Unit', width: 110 },
//     {
//       key: 'received', label: 'Received date', width: 140,
//       render: (r) => (r.received === '—' ? <span style={{ color: 'var(--text-subtle)' }}>Not yet</span> : r.received),
//     },
//     {
//       key: 'status', label: 'Status', width: 130,
//       render: (r) => <Badge tone={r.received_ ? 'success' : 'warning'}>{r.status}</Badge>,
//     },
//   ]

//   const sourceFilter = isS2S
//     ? { key: 'source', label: 'Source showroom', type: 'select', options: showrooms, placeholder: 'All showrooms' }
//     : { key: 'source', label: 'Factory', type: 'select', options: factories.map((f) => ({ value: f.id, label: f.name })), placeholder: 'All factories' }

//   return (
//     <>
//       {loading && <Loader overlay label="Loading transfers…" />}
//       <ReportShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'General Transfer Report'}
//         icon={leaf?.icon}
//         description="Centralised record of stock movement across the organisation — transfers between showrooms, and supplies from factories into showrooms — for monitoring, auditing and traceability."
//         tabs={TABS}
//         tab={tab}
//         onTabChange={changeTab}
//         filters={[
//           sourceFilter,
//           { key: 'destination', label: 'Receiving showroom', type: 'select', options: showrooms, placeholder: 'All showrooms' },
//           { key: 'driver', label: 'Driver', type: 'select', options: drivers, placeholder: 'All drivers' },
//           { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, placeholder: 'Any status' },
//           { key: 'from', label: 'Date from', type: 'date' },
//           { key: 'to', label: 'Date to', type: 'date' },
//         ]}
//         filterValues={filters}
//         onFilterChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
//         onGenerate={() => generate(filters)}
//         onReset={reset}
//         stats={[
//           { label: 'Transfers', value: String(matching.length) },
//           { label: 'Total quantity', value: fmt(totalQty) },
//           { label: 'In transit', value: String(inTransit.length), tone: inTransit.length ? 'warning' : undefined, hint: inTransit.length ? 'Awaiting receipt' : undefined },
//           { label: isS2S ? 'Showrooms involved' : 'Factories involved', value: String(involved) },
//         ]}
//         columns={columns}
//         rows={rows}
//         totals={{ date: 'Total', qty: fmt(totalQty) }}
//         pagination={{
//           page,
//           pageCount,
//           pageSize: PAGE_SIZE,
//           total: allRows.length,
//           onPage: setPage,
//         }}
//         tableTitle={isS2S ? 'Transfers between showrooms' : 'Supplies from factories'}
//         emptyTitle="No transfers in this period"
//         emptyDescription="Widen the date range or clear the status filter, then generate again."
//         footnote="Every completed transfer carries a waybill with a unique reference. Stock is not deducted from the source until the transfer is confirmed, and not added to the destination until receipt is acknowledged."
//       />
//     </>
//   )
// }


import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { useStore } from '../store.jsx'
import { fmt, fmtDate } from '../utils.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import InventoryApi from '../../api/InventoryApi.js'

const showroomApi = new ShowroomApi()
const inventoryApi = new InventoryApi() // drivers lookup only
const PAGE_SIZE = 20

const TABS = [
  { value: 's2s', label: 'Showroom-to-Showroom', icon: 'store' },
  { value: 'f2s', label: 'Factory-to-Showroom', icon: 'factory' },
]

const emptyFilters = {
  sourceLocationId: '',
  destinationLocationId: '',
  driverId: '',
  status: '',
  from: '',
  to: '',
}

const sentence = (s = '') => {
  const t = String(s).toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const isReceived = (row) =>
  !!row.receivedDate || /RECEIVED/i.test(row.status || '')

export default function GeneralTransferReport({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  const [tab, setTab] = useState('s2s')
  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)

  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  // Filter metadata from /reports/transfers/filters
  const [filterMeta, setFilterMeta] = useState(null)

  const [showrooms, setShowrooms] = useState([])
  const [drivers, setDrivers] = useState([])

  const isS2S = tab === 's2s'

  // ---------- load filter metadata + lookups ----------
  useEffect(() => {
    let cancelled = false

    showroomApi
      .getShowroomTranserFilters()
      .then((res) => {
        if (!cancelled) setFilterMeta(res.data)
      })
      .catch((e) => !cancelled && showToast('Could not load filters', e.message, true))

    showroomApi
      .lookupPickerWithAreas({})
      .then((res) => {
        if (!cancelled) {
          setShowrooms(
            (res.data || []).map((s) => ({
              value: s.id,
              label: s.label || s.name || s.code,
            }))
          )
        }
      })
      .catch((e) => !cancelled && showToast('Could not load showrooms', e.message, true))

    const loadDrivers = async () => {
      let p = 0
      let all = []
      let hasMore = true
      while (hasMore && !cancelled) {
        const { data } = await inventoryApi.listDrivers({ page: p, size: 50 })
        all = [...all, ...(data?.items || [])]
        hasMore = data?.totalPages != null ? p + 1 < data.totalPages : false
        p += 1
      }
      if (!cancelled) setDrivers(all.map((d) => ({ value: d.id, label: d.name })))
    }
    loadDrivers().catch((e) => !cancelled && showToast('Could not load drivers', e.message, true))

    return () => {
      cancelled = true
    }
  }, [showToast])

  // Options taken from the filter metadata
  const statusOptions = useMemo(() => {
    const field = filterMeta?.fields?.find((f) => f.key === 'status')
    return (field?.options || []).map((o) => ({ value: o.value, label: o.label }))
  }, [filterMeta])

  // ---------- query ----------
  const buildQuery = useCallback(
    (f, pageIdx) => {
      const q = {
        page: pageIdx,
        size: PAGE_SIZE,
        route: isS2S ? 'SHOWROOM_TO_SHOWROOM' : 'FACTORY_TO_SHOWROOM',
      }

      if (f.sourceLocationId) q.sourceLocationId = f.sourceLocationId
      if (f.destinationLocationId) q.destinationLocationId = f.destinationLocationId
      if (f.driverId) q.driverId = f.driverId
      if (f.status) q.status = f.status

      // primaryDate = transferDate
      if (f.from) q.from = f.from
      if (f.to) q.to = f.to

      return q
    },
    [isS2S]
  )

  const generate = async (nextFilters = filters, pageIdx = 0) => {
    if (nextFilters.from && nextFilters.to && nextFilters.from > nextFilters.to) {
      showToast('Check the dates', '"Date from" must be before "Date to".', true)
      return
    }

    setLoading(true)
    try {
      const query = buildQuery(nextFilters, pageIdx)
      const { data } = await showroomApi.listShowroomTransfers(query)

      const items = data?.items ?? []
      setRows(items)
      setTotalItems(data?.totalItems ?? items.length)
      setTotalPages(Math.max(1, data?.totalPages ?? 1))
      setApplied(nextFilters)
      setPage(pageIdx)
    } catch (error) {
      showToast('Could not load transfers', error.message, true)
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    generate(emptyFilters, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reset = () => {
    setFilters(emptyFilters)
    generate(emptyFilters, 0)
  }

  const changeTab = (next) => {
    const cleared = { ...filters, sourceLocationId: '' }
    setTab(next)
    setFilters(cleared)
    generate(cleared, 0)
  }

  const onPageChange = (nextPage) => {
    generate(applied, nextPage)
  }

  // ---------- map rows ----------
  const tableRows = rows.map((r) => ({
    key: `${r.transfer?.id || r.lineId}-${r.lineId}`,
    date: fmtDate(r.date),
    waybill: r.transfer?.code || r.transfer?.name || '—',
    source: r.source || '—',
    destination: r.destination || '—',
    driver: r.driver || '—',
    product: r.product || r.productCode || '—',
    qty: Number(r.qtySent) || 0,
    qtyReceived: Number(r.qtyReceived) || 0,
    qtyRejected: Number(r.qtyRejected) || 0,
    unit: r.unit || '—',
    received: r.receivedDate ? fmtDate(r.receivedDate) : '—',
    status: isReceived(r) ? 'Received' : sentence(r.status) || 'In transit',
    received_: isReceived(r),
  }))

  const totalQty = tableRows.reduce((n, r) => n + r.qty, 0)
  const inTransitCount = tableRows.filter((r) => !r.received_).length

  const columns = [
    { key: 'date', label: 'Transfer date', width: 135 },
    { key: 'waybill', label: 'Waybill no.', width: 125, mono: true },
    {
      key: 'source',
      label: isS2S ? 'Source showroom' : 'Factory',
      width: 190,
    },
    {
      key: 'destination',
      label: isS2S ? 'Destination showroom' : 'Receiving showroom',
      width: 200,
    },
    { key: 'driver', label: 'Driver', width: 150 },
    { key: 'product', label: 'Product', width: 250 },
    {
      key: 'qty',
      label: 'Qty sent',
      width: 110,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.qty),
    },
    {
      key: 'qtyReceived',
      label: 'Qty received',
      width: 120,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.qtyReceived),
    },
    {
      key: 'qtyRejected',
      label: 'Rejected',
      width: 100,
      align: 'right',
      mono: true,
      render: (r) => (r.qtyRejected ? fmt(r.qtyRejected) : '—'),
    },
    { key: 'unit', label: 'Unit', width: 90 },
    {
      key: 'received',
      label: 'Received date',
      width: 140,
      render: (r) =>
        r.received === '—' ? (
          <span style={{ color: 'var(--text-subtle)' }}>Not yet</span>
        ) : (
          r.received
        ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 130,
      render: (r) => (
        <Badge tone={r.received_ ? 'success' : 'warning'}>{r.status}</Badge>
      ),
    },
  ]

  const sourceFilter = isS2S
    ? {
        key: 'sourceLocationId',
        label: 'Source showroom',
        type: 'select',
        options: showrooms,
        placeholder: 'All showrooms',
      }
    : {
        key: 'sourceLocationId',
        label: 'Factory',
        type: 'select',
        options: factories.map((f) => ({ value: f.id, label: f.name })),
        placeholder: 'All factories',
      }

  return (
    <>
      {loading && <Loader overlay label="Loading transfers…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'General Transfer Report'}
        icon={leaf?.icon}
        description="Centralised record of stock movement across the organisation — transfers between showrooms, and supplies from factories into showrooms — for monitoring, auditing and traceability."
        tabs={TABS}
        tab={tab}
        onTabChange={changeTab}
        filters={[
          sourceFilter,
          {
            key: 'destinationLocationId',
            label: 'Receiving showroom',
            type: 'select',
            options: showrooms,
            placeholder: 'All showrooms',
          },
          {
            key: 'driverId',
            label: 'Driver',
            type: 'select',
            options: drivers,
            placeholder: 'All drivers',
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: statusOptions,          // ← from filter metadata
            placeholder: 'Any status',
          },
          { key: 'from', label: 'Date from', type: 'date' },
          { key: 'to', label: 'Date to', type: 'date' },
        ]}
        filterValues={filters}
        onFilterChange={(key, value) =>
          setFilters((f) => ({ ...f, [key]: value }))
        }
        onGenerate={() => generate(filters, 0)}
        onReset={reset}
        stats={[
          { label: 'Rows (this page)', value: String(tableRows.length) },
          { label: 'Total quantity (page)', value: fmt(totalQty) },
          {
            label: 'In transit (page)',
            value: String(inTransitCount),
            tone: inTransitCount ? 'warning' : undefined,
            hint: inTransitCount ? 'Awaiting receipt' : undefined,
          },
          { label: 'Total rows', value: String(totalItems) },
        ]}
        columns={columns}
        rows={tableRows}
        totals={{ date: 'Total', qty: fmt(totalQty) }}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: onPageChange,
        }}
        tableTitle={
          isS2S ? 'Transfers between showrooms' : 'Supplies from factories'
        }
        emptyTitle="No transfers in this period"
        emptyDescription="Widen the date range or clear the status filter, then generate again."
        footnote="Every completed transfer carries a waybill with a unique reference. Stock is not deducted from the source until the transfer is confirmed, and not added to the destination until receipt is acknowledged."
      />
    </>
  )
}