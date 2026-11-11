// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { RestrictedLabel } from '../shells/Page.jsx'
// import { factories, categories, stockGroups, comprehensivePart1, comprehensivePart2 } from '../sample.js'
// import { fmt, money, moneyShort } from '../utils.js'

// const TABS = [
//   { value: 'part1', label: 'Part 1 — All stock', icon: 'layers' },
//   { value: 'part2', label: 'Part 2 — Finished products by group', icon: 'package' },
// ]

// export default function ComprehensiveStockReport({ leaf, moduleLabel, parentLabel }) {
//   const [tab, setTab] = useState('part1')
//   const isPart1 = tab === 'part1'
//   const source = isPart1 ? comprehensivePart1 : comprehensivePart2

//   const rows = source.map((r, i) => ({ ...r, ln: i + 1, totalCost: r.unitCost * r.qtyLeft }))
//   const totalQty = rows.reduce((n, r) => n + r.qtyLeft, 0)
//   const totalValue = rows.reduce((n, r) => n + r.totalCost, 0)

//   const columns = [
//     { key: 'ln', label: 'LN', width: 60, align: 'right', mono: true },
//     isPart1
//       ? {
//           key: 'category', label: 'Category', width: 160,
//           render: (r) => <Badge tone={r.category === 'Finished Product' ? 'brand' : 'neutral'}>{r.category}</Badge>,
//         }
//       : { key: 'group', label: 'Group', width: 160 },
//     { key: 'detail', label: 'Stock detail', width: 280 },
//     { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
//     { key: 'qtyLeft', label: 'Quantity left', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qtyLeft) },
//     { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => money(r.totalCost) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Comprehensive Stock Report'}
//       icon={leaf?.icon}
//       description="Live stock position across factories, showing availability, quantity remaining and stock value for finished products and raw materials."
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       filters={[
//         { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         ...(isPart1
//           ? [{ key: 'category', label: 'Category', type: 'select', options: [{ value: 'fp', label: 'Finished Product' }, { value: 'rm', label: 'Raw Material' }] }]
//           : [{ key: 'group', label: 'Group', type: 'select', options: stockGroups }]),
//         { key: 'productCategory', label: 'Product category', type: 'select', options: categories },
//         { key: 'asOf', label: 'As at date', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Line items', value: String(rows.length) },
//         { label: 'Total quantity', value: fmt(totalQty) },
//         { label: 'Total stock value', value: moneyShort(totalValue) },
//         {
//           label: isPart1 ? 'Categories' : 'Groups',
//           value: String(new Set(rows.map((r) => (isPart1 ? r.category : r.group))).size),
//         },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ ln: 'Total', qtyLeft: fmt(totalQty), totalCost: money(totalValue) }}
//       tableTitle={isPart1 ? 'Finished products and raw materials' : 'Finished products by group'}
//       emptyTitle="No stock matches these filters"
//       emptyDescription="Adjust the factory or category filters and generate again."
//       footnote="Unit cost and total cost are landing-cost figures, visible only to Administrators and Management. Quantities reflect live stock at the moment of generation."
//     />
//   )
// }
// import { useEffect, useState, useCallback, useMemo } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import Loader from '../../ds/components/core/Loader.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { RestrictedLabel } from '../shells/Page.jsx'
// import { useStore } from '../store.jsx'
// import { fmt, money, moneyShort } from '../utils.js'
// import InventoryApi from '../../api/InventoryApi.js'

// const inventoryApi = new InventoryApi()
// const PAGE_SIZE = 50

// const TABS = [
//   { value: 'part1', label: 'Part 1 — All stock', icon: 'layers' },
//   { value: 'part2', label: 'Part 2 — Finished products by group', icon: 'package' },
// ]

// const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// export default function ComprehensiveStockReport({ leaf, moduleLabel, parentLabel }) {
//   const { factories, categories, showToast } = useStore()

//   const [tab, setTab] = useState('part1')
//   const [applied, setApplied] = useState({ locationId: '' })
//   const [page, setPage] = useState(0)

//   const [rows, setRows] = useState([])
//   const [summary, setSummary] = useState(null)
//   const [totalPages, setTotalPages] = useState(0)
//   const [totalItems, setTotalItems] = useState(0)
//   const [loading, setLoading] = useState(false)

//   const view = tab === 'part1' ? 'CATEGORY' : 'GROUP'

//   // category lookup for the grouping label when view === 'CATEGORY'
//   const categoryById = useMemo(() => {
//     const m = {}
//     for (const c of categories || []) m[c.id] = c.name
//     return m
//   }, [categories])

//   // reset to page 0 whenever the "query" changes
//   useEffect(() => {
//     setPage(0)
//   }, [tab, applied])

//   const load = useCallback(async () => {
//     setLoading(true)
//     try {
//       const query = { view, page, size: PAGE_SIZE }
//       if (applied.locationId) query.locationId = applied.locationId

//       const res = await inventoryApi.listStockComprehensiveReport(query)
//       const paged = res.data
//       setRows(paged.items || [])
//       setTotalPages(paged.totalPages || 0)
//       setTotalItems(paged.totalItems || 0)
//       setSummary(paged.summary || null)
//     } catch (e) {
//       showToast('Could not load stock report', e.message, true)
//     } finally {
//       setLoading(false)
//     }
//   }, [view, applied, page, showToast])

//   useEffect(() => {
//     load()
//   }, [load])

//   // "Generate report" → new filter set (only factory is a real filter)
//   const handleGenerate = useCallback((values) => {
//     setApplied({ locationId: values?.locationId || '' })
//   }, [])

//   // resolve a groupingLabel: category id in part 1, group id in part 2
//   function groupLabel(label) {
//     if (!label) return '—'
//     if (label === 'Uncategorized') return 'Uncategorized'
//     if (view === 'CATEGORY') return categoryById[label] || label
//     // GROUP view — no group lookup exposed to this page, so:
//     // human-readable strings pass through, raw UUIDs show as 'Uncategorized'
//     return UUID_RE.test(label) ? 'Uncategorized' : label
//   }

//   const totalQty = summary?.totalQuantity ?? rows.reduce((n, r) => n + (r.quantityLeft || 0), 0)
//   const totalValue = summary?.totalCost ?? rows.reduce((n, r) => n + (r.totalCost || 0), 0)
//   const groupCount = new Set(rows.map((r) => r.groupingLabel).filter(Boolean)).size

//   const columns = [
//     { key: 'lineNumber', label: 'LN', width: 60, align: 'right', mono: true },
//     {
//       key: 'groupingLabel',
//       label: view === 'CATEGORY' ? 'Category' : 'Group',
//       width: 200,
//       render: (r) => {
//         const text = groupLabel(r.groupingLabel)
//         // brand-tone anything that resolves to a real category/group,
//         // neutral for Uncategorized so it's visually obvious
//         const isReal = text && text !== 'Uncategorized' && !UUID_RE.test(text)
//         return <Badge tone={isReal ? 'brand' : 'neutral'}>{text}</Badge>
//       },
//     },
//     { key: 'stockDetail', label: 'Stock detail', width: 280 },
//     {
//       key: 'unitCost',
//       label: <RestrictedLabel>Unit cost</RestrictedLabel>,
//       width: 150,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.unitCost || 0),
//     },
//     {
//       key: 'quantityLeft',
//       label: 'Quantity left',
//       width: 140,
//       align: 'right',
//       mono: true,
//       render: (r) => fmt(r.quantityLeft || 0),
//     },
//     {
//       key: 'totalCost',
//       label: <RestrictedLabel>Total cost</RestrictedLabel>,
//       width: 170,
//       align: 'right',
//       mono: true,
//       render: (r) => money(r.totalCost || 0),
//     },
//   ]

//   const factoryOptions = [
//     { value: '', label: 'All factories' },
//     ...(factories || []).map((f) => ({ value: f.id, label: f.name })),
//   ]

//   return (
//     <>
//       {loading && <Loader overlay label="Loading stock report…" />}
//       <ReportShell
//         wide
//         crumbs={[moduleLabel, parentLabel]}
//         title={leaf?.label || 'Comprehensive Stock Report'}
//         icon={leaf?.icon}
//         description="Live stock position across factories, showing availability, quantity remaining and stock value for finished products and raw materials."
//         tabs={TABS}
//         tab={tab}
//         onTabChange={setTab}
//         onGenerate={handleGenerate}
//         filters={[
//           {
//             key: 'locationId',
//             label: 'Factory',
//             type: 'select',
//             options: factoryOptions,
//             defaultValue: applied.locationId,
//           },
//         ]}
//         stats={[
//           { label: 'Line items', value: String(totalItems) },
//           { label: 'Total quantity', value: fmt(totalQty) },
//           { label: 'Total stock value', value: moneyShort(totalValue) },
//           {
//             label: view === 'CATEGORY' ? 'Categories' : 'Groups',
//             value: String(groupCount),
//           },
//         ]}
//         columns={columns}
//         rows={rows}
//         totals={{
//           lineNumber: 'Total',
//           quantityLeft: fmt(totalQty),
//           totalCost: money(totalValue),
//         }}
//         tableTitle={
//           view === 'CATEGORY'
//             ? 'Finished products and raw materials'
//             : 'Finished products by group'
//         }
//         pagination={{
//           page,
//           pageCount: totalPages,
//           pageSize: PAGE_SIZE,
//           total: totalItems,
//           onPage: setPage,
//         }}
//         emptyTitle="No stock matches these filters"
//         emptyDescription="Adjust the factory filter and generate again."
//         footnote="Unit cost and total cost are landing-cost figures, visible only to Administrators and Management. Quantities reflect live stock at the moment of generation."
//       />
//     </>
//   )
// }


import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()
const PAGE_SIZE = 50

const TABS = [
  { value: 'part1', label: 'Part 1 — All stock', icon: 'layers' },
  { value: 'part2', label: 'Part 2 — Finished products by group', icon: 'package' },
]

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function ComprehensiveStockReport({ leaf, moduleLabel, parentLabel }) {
  const { factories, categories, showToast } = useStore()

  const [tab, setTab] = useState('part1')
  const [applied, setApplied] = useState({ locationId: '' })
  const [page, setPage] = useState(0)

  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  const view = tab === 'part1' ? 'CATEGORY' : 'GROUP'

  // category lookup — used by BOTH views, since the "group" id in Part 2
  // is a category id (same entity the backend groups finished products by)
  const categoryById = useMemo(() => {
    const m = {}
    for (const c of categories || []) m[c.id] = c.name
    return m
  }, [categories])

  // reset to page 0 whenever the "query" changes
  useEffect(() => {
    setPage(0)
  }, [tab, applied])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const query = { view, page, size: PAGE_SIZE }
      if (applied.locationId) query.locationId = applied.locationId

      const res = await inventoryApi.listStockComprehensiveReport(query)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
      setSummary(paged.summary || null)
    } catch (e) {
      showToast('Could not load stock report', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [view, applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  // "Generate report" → new filter set (only factory is a real filter)
  const handleGenerate = useCallback((values) => {
    setApplied({ locationId: values?.locationId || '' })
  }, [])

  // resolve a groupingLabel against the categories list.
  // Handles three cases the backend can send:
  //   1. the literal "Uncategorized" for ungrouped items
  //   2. a plain human name (pass through)
  //   3. a category id (resolve via categoryById, fall back to the raw id)
  function groupLabel(label) {
    if (!label) return null
    if (label === 'Uncategorized') return 'Uncategorized'
    if (!UUID_RE.test(label)) return label
    return categoryById[label] || label
  }

  const totalQty =
    summary?.totalQuantity ?? rows.reduce((n, r) => n + (r.quantityLeft || 0), 0)
  const totalValue =
    summary?.totalCost ?? rows.reduce((n, r) => n + (r.totalCost || 0), 0)
  const groupCount = new Set(rows.map((r) => r.groupingLabel).filter(Boolean)).size

  const columns = [
    { key: 'lineNumber', label: 'LN', width: 60, align: 'right', mono: true },
    {
      key: 'groupingLabel',
      label: view === 'CATEGORY' ? 'Category' : 'Group',
      width: 200,
      render: (r) => {
        const text = groupLabel(r.groupingLabel)
        if (!text) return '—'
        const isUncategorized = text === 'Uncategorized'
        // a raw id means the lookup missed it — don't tint it as brand
        const isUnresolved = UUID_RE.test(text)
        return (
          <Badge tone={isUncategorized || isUnresolved ? 'neutral' : 'brand'}>
            {text}
          </Badge>
        )
      },
    },
    { key: 'stockDetail', label: 'Stock detail', width: 280 },
    {
      key: 'unitCost',
      label: <RestrictedLabel>Unit cost</RestrictedLabel>,
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => money(r.unitCost || 0),
    },
    {
      key: 'quantityLeft',
      label: 'Quantity left',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.quantityLeft || 0),
    },
    {
      key: 'totalCost',
      label: <RestrictedLabel>Total cost</RestrictedLabel>,
      width: 170,
      align: 'right',
      mono: true,
      render: (r) => money(r.totalCost || 0),
    },
  ]

  const factoryOptions = [
    { value: '', label: 'All factories' },
    ...(factories || []).map((f) => ({ value: f.id, label: f.name })),
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading stock report…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Comprehensive Stock Report'}
        icon={leaf?.icon}
        description="Live stock position across factories, showing availability, quantity remaining and stock value for finished products and raw materials."
        tabs={TABS}
        tab={tab}
        onTabChange={setTab}
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'locationId',
            label: 'Factory',
            type: 'select',
            options: factoryOptions,
            defaultValue: applied.locationId,
          },
        ]}
        stats={[
          { label: 'Line items', value: String(totalItems) },
          { label: 'Total quantity', value: fmt(totalQty) },
          { label: 'Total stock value', value: moneyShort(totalValue) },
          {
            label: view === 'CATEGORY' ? 'Categories' : 'Groups',
            value: String(groupCount),
          },
        ]}
        columns={columns}
        rows={rows}
        totals={{
          lineNumber: 'Total',
          quantityLeft: fmt(totalQty),
          totalCost: money(totalValue),
        }}
        tableTitle={
          view === 'CATEGORY'
            ? 'Finished products and raw materials'
            : 'Finished products by group'
        }
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        emptyTitle="No stock matches these filters"
        emptyDescription="Adjust the factory filter and generate again."
        footnote="Unit cost and total cost are landing-cost figures, visible only to Administrators and Management. Quantities reflect live stock at the moment of generation."
      />
    </>
  )
}