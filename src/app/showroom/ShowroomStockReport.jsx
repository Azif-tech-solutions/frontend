// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { showrooms, storageAreas, showroomStock } from '../sampleShowroom.js'
// import { fmt, money, moneyShort } from '../utils.js'

// const SOURCE_TONE = { 'Finished Product': 'brand', Outsource: 'info', 'Direct entry': 'neutral' }

// // Design scaffold — real builds derive this from the signed-in role.
// const ROLES = [
//   { value: 'staff', label: 'Showroom staff', icon: 'user-round' },
//   { value: 'admin', label: 'Administrator', icon: 'shield-check' },
// ]

// export default function ShowroomStockReport({ leaf, moduleLabel, parentLabel }) {
//   const [role, setRole] = useState('staff')
//   const canSeeCost = role === 'admin'

//   const rows = showroomStock.map((s, i) => ({ ...s, ln: i + 1, totalCost: s.qty * s.unitCost, totalValue: s.qty * s.price }))
//   const totalQty = rows.reduce((n, r) => n + r.qty, 0)
//   const totalCost = rows.reduce((n, r) => n + r.totalCost, 0)
//   const totalRetail = rows.reduce((n, r) => n + r.totalValue, 0)

//   // The PRD requires cost columns to be hidden outright, not zeroed.
//   const columns = [
//     { key: 'ln', label: 'LN', width: 60, align: 'right', mono: true },
//     { key: 'detail', label: 'Product description', width: 280 },
//     { key: 'group', label: 'Group', width: 150 },
//     {
//       key: 'source', label: 'Source', width: 160,
//       render: (r) => <Badge tone={SOURCE_TONE[r.source] || 'neutral'}>{r.source}</Badge>,
//     },
//     { key: 'area', label: 'Area', width: 130 },
//     { key: 'qty', label: 'Quantity available', width: 160, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//     ...(canSeeCost
//       ? [
//           { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
//           { key: 'totalCost', label: 'Total stock value', width: 180, align: 'right', mono: true, render: (r) => money(r.totalCost) },
//         ]
//       : []),
//     { key: 'price', label: 'Selling price', width: 150, align: 'right', mono: true, render: (r) => money(r.price) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Comprehensive Stock Report'}
//       icon={leaf?.icon}
//       description="Up-to-date view of every stock item held at the selected showroom, with quantities available and — for authorised personnel — unit costs and total stock value."
//       headerActions={
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Preview as</span>
//           <Segmented options={ROLES} value={role} onChange={setRole} size="sm" />
//         </div>
//       }
//       filters={[
//         { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
//         { key: 'area', label: 'Operational area', type: 'select', options: storageAreas },
//         { key: 'source', label: 'Source', type: 'select', options: [{ value: 'fp', label: 'Finished Product' }, { value: 'os', label: 'Outsource' }, { value: 'de', label: 'Direct entry' }] },
//         { key: 'asOf', label: 'As at date', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Line items', value: String(rows.length) },
//         { label: 'Total quantity', value: fmt(totalQty) },
//         ...(canSeeCost
//           ? [{ label: 'Total stock value', value: moneyShort(totalCost) }]
//           : [{ label: 'Storage areas', value: String(new Set(rows.map((r) => r.area)).size) }]),
//         { label: 'Retail value', value: moneyShort(totalRetail), hint: 'At current selling price' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={canSeeCost
//         ? { ln: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) }
//         : { ln: 'Total', qty: fmt(totalQty) }}
//       tableTitle="Live showroom stock"
//       emptyTitle="No stock matches these filters"
//       emptyDescription="Change the showroom or area filter and generate again."
//       footnote={canSeeCost
//         ? 'Quantities reflect live stock at the moment of generation, combining factory supplies, outsourced products and directly entered goods. Unit cost and stock value are restricted to administrative personnel.'
//         : 'Quantities reflect live stock at the moment of generation, combining factory supplies, outsourced products and directly entered goods.'}
//     />
//   )
// }
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort } from '../utils.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const showroomApi = new ShowroomApi()
const PAGE_SIZE = 50

const SOURCE_LABEL = {
  FINISHED_PRODUCT: 'Finished Product',
  OUTSOURCED: 'Outsource',
  DIRECT_ENTRY: 'Direct entry',
}
const SOURCE_TONE = {
  'Finished Product': 'brand',
  Outsource: 'info',
  'Direct entry': 'neutral',
}

// Design scaffold — real builds derive this from the signed-in role.
const ROLES = [
  { value: 'staff', label: 'Showroom staff', icon: 'user-round' },
  { value: 'admin', label: 'Administrator', icon: 'shield-check' },
]

export default function ShowroomStockReport({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  // preview toggle (until RBAC lands)
  const [role, setRole] = useState('staff')
  const previewsCost = role === 'admin'

  // showrooms lookup
  const [showrooms, setShowrooms] = useState([])
  const [loadingShowrooms, setLoadingShowrooms] = useState(false)

  // applied filter + pagination
  const [applied, setApplied] = useState({ locationId: '' })
  const [page, setPage] = useState(0)

  // report data
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // ── load showrooms once; auto-select the first so the page
  //    populates without the user having to click Generate
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
        setApplied((prev) =>
          prev.locationId ? prev : { locationId: list[0]?.value || '' }
        )
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

  // reset page when the applied showroom changes
  useEffect(() => {
    setPage(0)
  }, [applied])

  // ── load the report for the applied showroom + current page
  const load = useCallback(async () => {
    if (!applied.locationId) {
      setRows([])
      setSummary(null)
      setTotalPages(0)
      setTotalItems(0)
      return
    }
    setLoading(true)
    try {
      const res = await showroomApi.getShowroomComprehensiveReport({
        locationId: applied.locationId,
        page,
        size: String(PAGE_SIZE),
      })
      const paged = res.data
      setRows(paged.items || [])
      setSummary(paged.summary || null)
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load showroom stock', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  // "Generate report" → new applied filter set
  const handleGenerate = useCallback((values) => {
    setApplied({ locationId: values?.locationId || '' })
  }, [])

  // ── derived totals (server summary when present)
  const lineCount = summary?.lineItems ?? totalItems
  const totalQty =
    summary?.totalQuantity ?? rows.reduce((n, r) => n + (r.qty || 0), 0)
  const totalCost =
    summary?.totalStockValue ?? rows.reduce((n, r) => n + (r.totalCost || 0), 0)
  const totalRetail =
    summary?.retailValue ?? rows.reduce((n, r) => n + (r.retailValue || 0), 0)
  const areaCount =
    summary?.storageAreas ?? new Set(rows.map((r) => r.area).filter(Boolean)).size

  // cost columns: admin preview AND server allows it
  const costAllowed = previewsCost && summary?.costVisible !== false

  const columns = [
    { key: 'ln', label: 'LN', width: 60, align: 'right', mono: true },
    {
      key: 'stockItem',
      label: 'Product description',
      width: 280,
      render: (r) => r.stockItem?.name || '—',
    },
    {
      key: 'group',
      label: 'Group',
      width: 150,
      render: (r) => r.group || '—',
    },
    {
      key: 'source',
      label: 'Source',
      width: 160,
      render: (r) => {
        const label =
          SOURCE_LABEL[r.stockItem?.itemType] || r.source || '—'
        return <Badge tone={SOURCE_TONE[label] || 'neutral'}>{label}</Badge>
      },
    },
    {
      key: 'area',
      label: 'Area',
      width: 140,
      render: (r) => r.area || '—',
    },
    {
      key: 'qty',
      label: 'Quantity available',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.qty || 0),
    },
    {
      key: 'unit',
      label: 'Unit',
      width: 110,
      render: (r) => r.unit || '—',
    },
    ...(costAllowed
      ? [
          {
            key: 'unitCost',
            label: 'Unit cost',
            width: 150,
            align: 'right',
            mono: true,
            render: (r) => money(r.unitCost || 0),
          },
          {
            key: 'totalCost',
            label: 'Total stock value',
            width: 180,
            align: 'right',
            mono: true,
            render: (r) => money(r.totalCost || 0),
          },
        ]
      : []),
    {
      key: 'sellingPrice',
      label: 'Selling price',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => (r.sellingPrice == null ? '—' : money(r.sellingPrice)),
    },
    {
      key: 'retailValue',
      label: 'Retail value',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => (r.retailValue ? money(r.retailValue) : '—'),
    },
  ]

  const showroomOptions = showrooms.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  return (
    <>
      {(loading || loadingShowrooms) && (
        <Loader
          overlay
          label={
            loadingShowrooms ? 'Loading showrooms…' : 'Loading stock report…'
          }
        />
      )}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Showroom Stock Report'}
        icon={leaf?.icon}
        description="Up-to-date view of every stock item held at the selected showroom, with quantities available and — for authorised personnel — unit costs and total stock value."
        headerActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                font: 'var(--type-eyebrow)',
                letterSpacing: 'var(--ls-wide)',
                textTransform: 'uppercase',
                color: 'var(--text-subtle)',
              }}
            >
              Preview as
            </span>
            <Segmented
              options={ROLES}
              value={role}
              onChange={setRole}
              size="sm"
            />
          </div>
        }
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'locationId',
            label: 'Showroom',
            type: 'select',
            options: showroomOptions,
            defaultValue: applied.locationId,
          },
        ]}
        stats={[
          { label: 'Line items', value: String(lineCount) },
          { label: 'Total quantity', value: fmt(totalQty) },
          costAllowed
            ? { label: 'Total stock value', value: moneyShort(totalCost) }
            : { label: 'Storage areas', value: String(areaCount) },
          {
            label: 'Retail value',
            value: moneyShort(totalRetail),
            hint: 'At current selling price',
          },
        ]}
        columns={columns}
        rows={rows}
        totals={
          costAllowed
            ? {
                ln: 'Total',
                qty: fmt(totalQty),
                totalCost: money(totalCost),
              }
            : { ln: 'Total', qty: fmt(totalQty) }
        }
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        tableTitle="Live showroom stock"
        emptyTitle="No stock matches these filters"
        emptyDescription="Choose a showroom and generate again."
        footnote={
          costAllowed
            ? 'Quantities reflect live stock at the moment of generation, combining factory supplies, outsourced products and directly entered goods. Unit cost and stock value are restricted to administrative personnel.'
            : 'Quantities reflect live stock at the moment of generation, combining factory supplies, outsourced products and directly entered goods.'
        }
      />
    </>
  )
}