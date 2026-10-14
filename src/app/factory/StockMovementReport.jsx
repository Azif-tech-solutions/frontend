import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Page, Panel, StatRow, EmptyState, RestrictedLabel } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { FilterBar } from '../shells/FilterBar.jsx'
import { useTableExport } from '../useTableExport.js'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort, fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()

const TABS = [
  { value: 'finished', label: 'Finished products', icon: 'package' },
  { value: 'raw', label: 'Raw materials', icon: 'box' },
]

const SUB_TABS = [
  { value: 'production', label: 'Finished Product Report' },
  { value: 'supplied', label: 'Supplied Report' },
]

const ALL = { value: '', label: 'All' }
const EMPTY_FILTERS = { factory: '', item: '', destination: '', from: '', to: '' }

/* ------------------------------------------------------------------ */
/* Data loading: each view is built from different endpoints          */
/* ------------------------------------------------------------------ */

const showDate = (d) => {
  const t = Date.parse(d)
  return t ? fmtDate(new Date(t).toISOString()) : '—'
}

// Every endpoint here wants a location, so "all factories" means one request per factory.
// Stock items give each view its names, landing costs, selling prices and balances.
async function loadItems(targets, itemType) {
  const responses = await Promise.all(targets.map((f) => inventoryApi.listStockItems(f.id, itemType)))
  const byId = {}
  responses.forEach((res) => (res.data || []).forEach((item) => { byId[item.id] = item }))
  return byId
}

/**
 * Finished Product Report: finished-product refills from the movement report.
 * Landing cost comes from the stock item.
 */
async function loadProduction(targets, a) {
  const [items, reports] = await Promise.all([
    loadItems(targets, 'FINISHED_PRODUCT'),
    Promise.all(targets.map((f) => inventoryApi.listMovementReports({
      locationId: f.id,
      stockItemId: a.item || undefined,
      sourceType: 'REFILL',
      from: a.from || undefined,
      to: a.to || undefined,
    }))),
  ])

  return reports
    .flatMap((res) => res.data || [])
    .filter((m) => items[m.stockItemId] && Number(m.qtyIn) > 0) // finished products only, entries that added stock
    .map((m) => {
      const item = items[m.stockItemId]
      const qty = Number(m.qtyIn)
      const unitCost = Number(item.landingCost ?? 0)
      return {
        date: showDate(m.date),
        batch: m.sourceReference || '—',
        product: m.itemName || item.name,
        qty,
        unitCost,
        totalCost: qty * unitCost,
        materials: '—', // no endpoint reports the raw materials a run consumed yet
        when: Date.parse(m.date) || 0,
      }
    })
    .sort((x, y) => y.when - x.when)
}

/**
 * Supplied Report: stock transfers (one row per transfer line).
 * The selling price comes from the stock item.
 */
async function loadSupplied(targets, a) {
  const [items, responses] = await Promise.all([
    loadItems(targets, 'FINISHED_PRODUCT'),
    Promise.all(targets.map((f) => inventoryApi.listStockTransfers({
      locationId: f.id,
      from: a.from || undefined,
      to: a.to || undefined,
    }))),
  ])

  // A transfer can come back under both its source and destination factory, so keep one copy of each.
  const transfers = new Map()
  responses.forEach((res) => (res.data || []).forEach((t) => transfers.set(t.id, t)))

  return [...transfers.values()]
    .flatMap((t) =>
      (t.lines || [])
        .filter((l) => !a.item || l.stockItemId === a.item)
        .map((l) => ({
          waybill: t.waybillRef || '—',
          driver: t.driverName || '—',
          destination: t.destinationLocationName || '—',
          supplied: showDate(t.transferDate),
          received: t.receivedDate ? showDate(t.receivedDate) : '—',
          product: l.stockItemName,
          qtySupplied: Number(l.qtySent ?? 0),
          qtyReceived: Number(l.qtyReceived ?? 0),
          qtyRejected: Number(l.qtyRejected ?? 0),
          price: Number(items[l.stockItemId]?.markupCost ?? 0),
          when: Date.parse(t.transferDate) || 0,
        }))
    )
    .sort((x, y) => y.when - x.when)
}

/**
 * Raw Materials: one row per material. The balance is the item's current quantity;
 * used and arrivals come from the movement report for the chosen period, and the
 * opening quantity is worked back from those.
 */
async function loadRaw(targets, a) {
  const [items, reports] = await Promise.all([
    loadItems(targets, 'RAW_MATERIAL'),
    Promise.all(targets.map((f) => inventoryApi.listMovementReports({
      locationId: f.id,
      stockItemId: a.item || undefined,
      from: a.from || undefined,
      to: a.to || undefined,
    }))),
  ])

  const totals = {}
  reports.flatMap((res) => res.data || []).forEach((m) => {
    if (!items[m.stockItemId]) return // raw materials only
    const t = (totals[m.stockItemId] ??= { arrivals: 0, used: 0, totalIn: 0, first: 0 })
    const when = Date.parse(m.date) || 0
    t.totalIn += Number(m.qtyIn) || 0
    t.used += Number(m.qtyOut) || 0
    if (m.sourceType === 'REFILL') t.arrivals += Number(m.qtyIn) || 0
    if (when && (!t.first || when < t.first)) t.first = when
  })

  return Object.values(items)
    .filter((item) => !a.item || item.id === a.item)
    .map((item) => {
      const t = totals[item.id] || { arrivals: 0, used: 0, totalIn: 0, first: 0 }
      const remaining = Number(item.quantity ?? 0)
      return {
        material: item.name,
        openingDate: a.from ? showDate(a.from) : t.first ? showDate(new Date(t.first).toISOString()) : '—',
        opening: Math.max(0, remaining - t.totalIn + t.used), // balance at the start of the period
        used: t.used,
        unitCost: Number(item.markupCost ?? 0),
        remaining,
        arrivals: t.arrivals,
      }
    })
    .sort((x, y) => x.material.localeCompare(y.material))
}

const LOADERS = { production: loadProduction, supplied: loadSupplied, raw: loadRaw }

/* ------------------------------------------------------------------ */
/* Views: columns, totals and stats for each tab                       */
/* ------------------------------------------------------------------ */

function buildView(viewKey, source) {
  if (viewKey === 'production') {
    const totalQty = source.reduce((n, r) => n + r.qty, 0)
    const totalCost = source.reduce((n, r) => n + r.totalCost, 0)
    return {
      columns: [
        { key: 'date', label: 'Production date', width: 140 },
        { key: 'batch', label: 'Reference', width: 130, mono: true },
        { key: 'product', label: 'Product description', width: 240 },
        { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
        { key: 'unitCost', label: <RestrictedLabel>Unit landing cost</RestrictedLabel>, width: 165, align: 'right', mono: true, render: (r) => money(r.unitCost) },
        { key: 'totalCost', label: <RestrictedLabel>Total landing cost</RestrictedLabel>, width: 175, align: 'right', mono: true, render: (r) => money(r.totalCost) },
        { key: 'materials', label: 'Raw materials used', width: 380 },
      ],
      rows: source,
      totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
      stats: [
        { label: 'Production runs', value: String(source.length) },
        { label: 'Total produced', value: fmt(totalQty) },
        { label: 'Total landing cost', value: moneyShort(totalCost) },
        { label: 'Products covered', value: String(new Set(source.map((r) => r.product)).size) },
      ],
      tableTitle: 'Daily production activity',
    }
  }

  if (viewKey === 'supplied') {
    const totalSupplied = source.reduce((n, r) => n + r.qtySupplied, 0)
    const totalReceived = source.reduce((n, r) => n + r.qtyReceived, 0)
    const totalRejected = source.reduce((n, r) => n + r.qtyRejected, 0)
    return {
      columns: [
        { key: 'waybill', label: 'Waybill no.', width: 120, mono: true },
        { key: 'driver', label: 'Driver name', width: 150 },
        { key: 'destination', label: 'Destination', width: 190 },
        { key: 'supplied', label: 'Supplied date', width: 135 },
        {
          key: 'received', label: 'Received date', width: 140,
          render: (r) => (r.received === '—' ? <Badge tone="warning">In transit</Badge> : r.received),
        },
        { key: 'product', label: 'Product description', width: 240 },
        { key: 'qtySupplied', label: 'Qty supplied', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qtySupplied) },
        { key: 'qtyReceived', label: 'Qty received', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qtyReceived) },
        {
          key: 'qtyRejected', label: 'Qty rejected', width: 130, align: 'right', mono: true,
          render: (r) => (r.qtyRejected ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyRejected)}</span> : '—'),
        },
        { key: 'price', label: 'Authorised selling price', width: 190, align: 'right', mono: true, render: (r) => money(r.price) },
      ],
      rows: source,
      totals: { waybill: 'Total', qtySupplied: fmt(totalSupplied), qtyReceived: fmt(totalReceived), qtyRejected: fmt(totalRejected) },
      stats: [
        { label: 'Waybills', value: String(new Set(source.map((r) => r.waybill)).size) },
        { label: 'Qty supplied', value: fmt(totalSupplied) },
        { label: 'Qty received', value: fmt(totalReceived) },
        { label: 'Qty rejected', value: fmt(totalRejected), tone: 'negative', delta: totalRejected ? 'needs review' : undefined },
      ],
      tableTitle: 'Distribution to showrooms and distributors',
    }
  }

  const rows = source.map((r) => ({ ...r, costUsed: r.used * r.unitCost, costRemaining: r.remaining * r.unitCost }))
  const costUsed = rows.reduce((n, r) => n + r.costUsed, 0)
  const costRemaining = rows.reduce((n, r) => n + r.costRemaining, 0)
  return {
    columns: [
      { key: 'material', label: 'Raw material', width: 250 },
      { key: 'openingDate', label: 'Opening date', width: 135 },
      { key: 'opening', label: 'Opening qty', width: 130, align: 'right', mono: true, render: (r) => fmt(r.opening) },
      { key: 'used', label: 'Qty used', width: 120, align: 'right', mono: true, render: (r) => fmt(r.used) },
      { key: 'costUsed', label: <RestrictedLabel>Cost of materials used</RestrictedLabel>, width: 200, align: 'right', mono: true, render: (r) => money(r.costUsed) },
      { key: 'remaining', label: 'Remaining qty', width: 140, align: 'right', mono: true, render: (r) => fmt(r.remaining) },
      { key: 'costRemaining', label: <RestrictedLabel>Cost of remaining</RestrictedLabel>, width: 180, align: 'right', mono: true, render: (r) => money(r.costRemaining) },
      {
        key: 'arrivals', label: 'Arrivals', width: 130, align: 'right', mono: true,
        render: (r) => (r.arrivals ? <span style={{ color: 'var(--success)' }}>{fmt(r.arrivals)}</span> : '—'),
      },
    ],
    rows,
    totals: { material: 'Total', costUsed: money(costUsed), costRemaining: money(costRemaining) },
    stats: [
      { label: 'Materials tracked', value: String(rows.length) },
      { label: 'Cost of materials used', value: moneyShort(costUsed) },
      { label: 'Value remaining', value: moneyShort(costRemaining) },
      { label: 'Replenished this period', value: String(rows.filter((r) => r.arrivals).length) },
    ],
    tableTitle: 'Raw material usage and movement',
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function StockMovementReport({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()
  const [tab, setTab] = useState('finished')
  const [sub, setSub] = useState('production')
  const [values, setValues] = useState(EMPTY_FILTERS)   // what the filter bar shows
  const [applied, setApplied] = useState(EMPTY_FILTERS) // what the table was generated from
  const [itemOptions, setItemOptions] = useState([])
  const [data, setData] = useState({ view: null, rows: [], loading: true })

  const isFinished = tab === 'finished'
  const viewKey = isFinished ? sub : 'raw'

  // The product / raw-material dropdown follows the factory picked in the filter bar.
  useEffect(() => {
    const targets = values.factory ? factories.filter((f) => f.id === values.factory) : factories
    if (!targets.length) { setItemOptions([]); return }

    let cancelled = false
    loadItems(targets, isFinished ? 'FINISHED_PRODUCT' : 'RAW_MATERIAL')
      .then((byId) => {
        if (!cancelled) setItemOptions(Object.values(byId).map((i) => ({ value: i.id, label: i.name })))
      })
      .catch(() => { if (!cancelled) setItemOptions([]) }) // the report request reports real failures
    return () => { cancelled = true }
  }, [factories, values.factory, isFinished])

  // Build the report. Runs on first load, when the tab or sub-tab changes, and
  // whenever "Generate report" is pressed (which replaces `applied`).
  useEffect(() => {
    const targets = applied.factory ? factories.filter((f) => f.id === applied.factory) : factories
    if (!targets.length) {
      setData({ view: viewKey, rows: [], loading: false })
      return
    }

    let cancelled = false
    setData((d) => ({ ...d, loading: true }))

    LOADERS[viewKey](targets, applied)
      .then((rows) => { if (!cancelled) setData({ view: viewKey, rows, loading: false }) })
      .catch((error) => {
        if (cancelled) return
        setData({ view: viewKey, rows: [], loading: false })
        showToast('Could not generate report', error.message, true)
      })

    return () => { cancelled = true }
  }, [viewKey, applied, factories, showToast])

  // Rows loaded for a different view are never shown under this view's columns.
  const loading = data.loading || data.view !== viewKey
  const loaded = data.view === viewKey ? data.rows : []

  // The transfers endpoint has no destination filter, so that one is applied here.
  const destinationOptions = viewKey === 'supplied'
    ? [...new Set(loaded.map((r) => r.destination).filter((d) => d && d !== '—'))].map((d) => ({ value: d, label: d }))
    : []
  const source = viewKey === 'supplied' && applied.destination
    ? loaded.filter((r) => r.destination === applied.destination)
    : loaded

  const view = buildView(viewKey, source)
  const pageTitle = leaf?.label || 'Stock Movement Report'
  const doExport = useTableExport({
    columns: view.columns,
    rows: view.rows,
    totals: view.totals,
    title: `${pageTitle} — ${view.tableTitle}`,
    emptyHint: 'There is nothing to export. Generate the report first.',
  })

  const changeFilter = (key, next) =>
    // A different factory has different items, so the picked item is cleared.
    setValues((v) => ({ ...v, [key]: next, ...(key === 'factory' ? { item: '' } : {}) }))

  const generate = () => {
    if (values.from && values.to && values.from > values.to) {
      showToast('Check the dates', '"Date from" must be on or before "Date to".', true)
      return
    }
    setApplied({ ...values }) // a new object every time, so pressing it again refreshes the data
  }

  const reset = () => {
    setValues(EMPTY_FILTERS)
    setApplied({ ...EMPTY_FILTERS })
  }

  const changeTab = (next) => {
    setTab(next)
    // Products and raw materials are separate lists, so drop the picked item.
    setValues((v) => ({ ...v, item: '' }))
    setApplied((a) => ({ ...a, item: '' }))
  }

  const fields = [
    { key: 'factory', label: 'Factory', type: 'select', options: [ALL, ...factories.map((f) => ({ value: f.id, label: f.name }))], placeholder: 'All factories' },
    { key: 'item', label: isFinished ? 'Product' : 'Raw material', type: 'select', options: [ALL, ...itemOptions], placeholder: isFinished ? 'All products' : 'All materials' },
    ...(viewKey === 'supplied'
      ? [{ key: 'destination', label: 'Destination', type: 'select', options: [ALL, ...destinationOptions], placeholder: 'All destinations' }]
      : []),
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={pageTitle}
        description="Production activity, stock distribution, raw material usage and inventory movement across the factory."
        icon={leaf?.icon}
      />

      <Tabs tabs={TABS} value={tab} onChange={changeTab} />

      <FilterBar fields={fields} values={values} onChange={changeFilter} onGenerate={generate} onReset={reset} />

      <StatRow stats={view.stats} />

      <Panel
        title={view.tableTitle}
        padding={0}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isFinished && <Segmented options={SUB_TABS} value={sub} onChange={setSub} size="sm" />}
            <ExportButton label="Export" onExport={doExport} />
          </div>
        }
      >
        {loading ? (
          <Loader label="Generating report…" />
        ) : view.rows.length === 0 ? (
          <EmptyState
            icon="folder-open"
            title="No movement matches these filters"
            description="Widen the date range or change the factory, then generate again."
          />
        ) : (
          <ReportTable columns={view.columns} rows={view.rows} totals={view.totals} stickyHeader={false} style={{ border: 'none', borderRadius: 0 }} />
        )}
      </Panel>

      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>
        Landing cost figures are visible only to Administrators and Management. Every completed transfer generates a waybill with a unique reference number.
      </div>
    </Page>
  )
}