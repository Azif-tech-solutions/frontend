// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Callout } from '../shells/Page.jsx'
// import { factories, suppliers, reOrderItems } from '../sample.js'
// import { fmt, money, moneyShort } from '../utils.js'
// import {InventoryApi} from '../../api/InventoryApi.js'
// const VIEWS = [
//   { value: 'due', label: 'Needs re-order' },
//   { value: 'all', label: 'All items' },
// ]

// const inventoryApi = new InventoryApi()
// /** Ratio of stock on hand to the configured threshold decides urgency. */
// function classify(item) {
//   const ratio = item.onHand / item.reorderLevel
//   if (ratio <= 1) return { status: 'Re-order now', tone: 'danger' }
//   if (ratio <= 1.25) return { status: 'Approaching', tone: 'warning' }
//   return { status: 'Healthy', tone: 'success' }
// }

// export default function ReOrderReport({ leaf, moduleLabel, parentLabel }) {
//   const [view, setView] = useState('due')

//   const all = reOrderItems.map((i) => {
//     const { status, tone } = classify(i)
//     // Bring stock back to the threshold plus one lead-time buffer.
//     const shortfall = Math.max(0, i.reorderLevel - i.onHand)
//     const suggested = shortfall ? Math.ceil((i.reorderLevel * 1.5 - i.onHand) / 10) * 10 : 0
//     return { ...i, status, tone, shortfall, suggested, orderValue: suggested * i.unitCost }
//   })

//   const due = all.filter((i) => i.status !== 'Healthy')
//   const rows = (view === 'due' ? due : all).sort((a, b) => a.onHand / a.reorderLevel - b.onHand / b.reorderLevel)
//   const orderValue = due.reduce((n, i) => n + i.orderValue, 0)
//   const longestLead = due.reduce((n, i) => Math.max(n, i.leadTime), 0)

//   const columns = [
//     { key: 'item', label: 'Material / recipe', width: 250 },
//     { key: 'category', label: 'Category', width: 150 },
//     { key: 'onHand', label: 'On hand', width: 120, align: 'right', mono: true, render: (r) => fmt(r.onHand) },
//     { key: 'reorderLevel', label: 'Re-order level', width: 140, align: 'right', mono: true, render: (r) => fmt(r.reorderLevel) },
//     {
//       key: 'shortfall', label: 'Shortfall', width: 120, align: 'right', mono: true,
//       render: (r) => (r.shortfall ? <span style={{ color: 'var(--danger)' }}>{fmt(r.shortfall)}</span> : '—'),
//     },
//     { key: 'unit', label: 'Unit', width: 110 },
//     {
//       key: 'status', label: 'Status', width: 145,
//       render: (r) => <Badge tone={r.tone}>{r.status}</Badge>,
//     },
//     { key: 'supplier', label: 'Supplier', width: 210 },
//     { key: 'leadTime', label: 'Lead time', width: 120, align: 'right', mono: true, render: (r) => `${r.leadTime} d` },
//     { key: 'lastOrdered', label: 'Last ordered', width: 135 },
//     {
//       key: 'suggested', label: 'Suggested qty', width: 145, align: 'right', mono: true,
//       render: (r) => (r.suggested ? fmt(r.suggested) : '—'),
//     },
//     {
//       key: 'orderValue', label: 'Est. order value', width: 165, align: 'right', mono: true,
//       render: (r) => (r.orderValue ? money(r.orderValue) : '—'),
//     },
//     {
//       key: 'action', label: 'Action', width: 165, sortable: false,
//       render: (r) => (r.status === 'Healthy'
//         ? <span style={{ color: 'var(--text-subtle)' }}>—</span>
//         : <Button size="sm" variant={r.tone === 'danger' ? 'primary' : 'secondary'} iconLeft="shopping-cart">Raise order</Button>),
//     },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Re-Order Report'}
//       icon={leaf?.icon}
//       description="Minimum stock levels and the items that have reached them. Stock at or below its re-order point prompts personnel to raise a purchase order with the relevant supplier."
//       filters={[
//         { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         { key: 'supplier', label: 'Supplier', type: 'select', options: suppliers },
//         { key: 'category', label: 'Category', type: 'select', options: [{ value: 'additive', label: 'Additive' }, { value: 'packaging', label: 'Packaging' }, { value: 'recipe', label: 'In-house recipe' }] },
//         { key: 'asOf', label: 'As at date', type: 'date' },
//       ]}
//       generateLabel="Refresh levels"
//       stats={[
//         { label: 'Items needing re-order', value: String(due.length), tone: due.length ? 'negative' : undefined, delta: due.length ? 'action required' : undefined },
//         { label: 'Items tracked', value: String(all.length) },
//         { label: 'Estimated order value', value: moneyShort(orderValue) },
//         { label: 'Longest lead time', value: `${longestLead} days`, hint: 'Order by this margin' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ item: 'Total', orderValue: money(rows.reduce((n, r) => n + r.orderValue, 0)) }}
//       tableTitle={view === 'due' ? 'Items at or below re-order level' : 'All tracked items'}
//       tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
//       emptyTitle="Nothing needs re-ordering"
//       emptyDescription="Every tracked item is above its configured re-order level."
//       footnote="Suggested quantity restores stock to the re-order level plus a buffer. Lead time is the supplier's stated turnaround — order earlier than the shortfall date to avoid a production stoppage."
//     >
//       {due.length > 0 && (
//         <Callout tone="danger" icon="triangle-alert" title={`${due.length} item${due.length === 1 ? '' : 's'} at or below re-order level`}>
//           {due.map((i) => i.item.split(' · ')[1]).join(', ')} require replenishment.
//           The longest supplier lead time among them is {longestLead} days, so orders raised today arrive by the end of that window.
//         </Callout>
//       )}
//     </ReportShell>
//   )
// }

import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { fmt, moneyShort } from '../utils.js'
import { useStore } from '../store.jsx'
import InventoryApi  from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()

const PAGE_SIZE = 2

const VIEWS = [
  { value: 'due', label: 'Needs re-order' },
  { value: 'all', label: 'All items' },
]

const sentence = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/** Ratio of stock on hand to the configured threshold decides urgency. */
function classify(onHand, reorderLevel) {
  if (onHand <= reorderLevel) return { status: 'Re-order now', tone: 'danger' }
  if (reorderLevel > 0 && onHand / reorderLevel <= 1.25) return { status: 'Approaching', tone: 'warning' }
  return { status: 'Healthy', tone: 'success' }
}

// Drop empty filter values so they are not sent as blank query params.
const cleanFilters = (values = {}) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v !== '' && v != null))

export default function ReOrderReport({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  const [view, setView] = useState('due')

  // data
  const [applied, setApplied] = useState({}) // filter values the list is currently using
  const [page, setPage] = useState(0)
  const [items, setItems] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)

  // The endpoint filters by location only.
  const filters = useMemo(
    () => [{
      key: 'locationId',
      label: 'Factory',
      type: 'select',
      options: (factories || []).map((f) => ({ value: f.id, label: f.name })),
    }],
    [factories],
  )

  // One page of the report. Runs again when the applied filters or the page change.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    inventoryApi
      .getReorderReport({ ...applied, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load re-order report', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [applied, page, showToast])

  // Called by ReportShell with the current filter values.
  const applyFilters = (values) => {
    setApplied(cleanFilters(values))
    setPage(0)
  }

  const resetFilters = () => {
    setApplied({})
    setPage(0)
  }

  // Normalise each API row and work out its urgency.
  const all = useMemo(
    () =>
      items.map((r) => {
        const onHand = Number(r.quantityOnhand) || 0
        const reorderLevel = Number(r.reorderLevel) || 0
        const { status, tone } = classify(onHand, reorderLevel)
        const shortfall = Math.max(0, reorderLevel - onHand)
        // Bring stock back to the threshold plus one lead-time buffer.
        const suggested = shortfall ? Math.ceil((reorderLevel * 1.5 - onHand) / 10) * 10 : 0
        return {
          id: r.stockItem?.id,
          item: `${r.stockItem?.code || '—'} · ${r.stockItem?.name || '—'}`,
          name: r.stockItem?.name || '—',
          category: sentence(r.stockItem?.itemType) || '—',
          onHand,
          reorderLevel,
          shortfall,
          suggested,
          status,
          tone,
        }
      }),
    [items],
  )

  const due = all.filter((i) => i.status !== 'Healthy')
  const rows = useMemo(
    () =>
      [...(view === 'due' ? due : all)].sort(
        (a, b) => (a.reorderLevel ? a.onHand / a.reorderLevel : Infinity) - (b.reorderLevel ? b.onHand / b.reorderLevel : Infinity),
      ),
    [view, due, all],
  )
  const shortfallTotal = due.reduce((n, i) => n + i.shortfall, 0)

  const columns = [
    { key: 'item', label: 'Item', width: 280 },
    { key: 'category', label: 'Type', width: 150 },
    { key: 'onHand', label: 'On hand', width: 120, align: 'right', mono: true, render: (r) => fmt(r.onHand) },
    { key: 'reorderLevel', label: 'Re-order level', width: 140, align: 'right', mono: true, render: (r) => fmt(r.reorderLevel) },
    {
      key: 'shortfall', label: 'Shortfall', width: 120, align: 'right', mono: true,
      render: (r) => (r.shortfall ? <span style={{ color: 'var(--danger)' }}>{fmt(r.shortfall)}</span> : '—'),
    },
    {
      key: 'status', label: 'Status', width: 145,
      render: (r) => <Badge tone={r.tone}>{r.status}</Badge>,
    },
    {
      key: 'suggested', label: 'Suggested qty', width: 145, align: 'right', mono: true,
      render: (r) => (r.suggested ? fmt(r.suggested) : '—'),
    },
    {
      key: 'action', label: 'Action', width: 165, sortable: false,
      render: (r) => (r.status === 'Healthy'
        ? <span style={{ color: 'var(--text-subtle)' }}>—</span>
        : <Button size="sm" variant={r.tone === 'danger' ? 'primary' : 'secondary'} iconLeft="shopping-cart">Raise order</Button>),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Re-Order Report'}
      icon={leaf?.icon}
      description="Minimum stock levels and the items that have reached them. Stock at or below its re-order point prompts personnel to raise a purchase order with the relevant supplier."
      filters={filters}
      onGenerate={applyFilters}
      onReset={resetFilters}
      stats={[
        { label: 'Items needing re-order', value: String(due.length), tone: due.length ? 'negative' : undefined, delta: due.length ? 'action required' : undefined, hint: 'This page' },
        { label: 'Items on this page', value: String(all.length) },
        { label: 'Total shortfall', value: moneyShort(shortfallTotal).replace('₦', ''), hint: 'Units, this page' },
        { label: 'Items tracked', value: String(pageInfo.totalItems), hint: 'Matching the filters' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ item: 'Total (this page)', shortfall: fmt(rows.reduce((n, r) => n + r.shortfall, 0)) }}
      pagination={{
        page,
        pageCount: pageInfo.totalPages,
        pageSize: PAGE_SIZE,
        total: pageInfo.totalItems,
        onPage: setPage,
      }}
      tableTitle={view === 'due' ? 'Items at or below re-order level' : 'All tracked items'}
      tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
      emptyTitle="Nothing needs re-ordering"
      emptyDescription="Every tracked item on this page is above its configured re-order level."
      footnote="Suggested quantity restores stock to the re-order level plus a buffer. Order earlier than the shortfall date to avoid a production stoppage."
    >
      {loading && <Loader overlay label="Loading re-order report…" />}

      {due.length > 0 && (
        <Callout tone="danger" icon="triangle-alert" title={`${due.length} item${due.length === 1 ? '' : 's'} at or below re-order level`}>
          {due.map((i) => i.name).join(', ')} require{due.length === 1 ? 's' : ''} replenishment.
        </Callout>
      )}
    </ReportShell>
  )
}