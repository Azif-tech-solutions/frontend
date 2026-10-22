import { useEffect, useRef, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { fmt, fmtDate, money, moneyShort } from '../utils.js'
import { useStore } from '../store.jsx'
import FactoryApi from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'

const factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()

const CARD_PAGE_SIZE = 20   // stock card: paged on screen
const LOAD_PAGE_SIZE = 100  // production records / print / export: walk every page in batches

const VIEWS = [
  { value: 'production', label: 'Production records', icon: 'list' },
  { value: 'stockcard', label: 'Stock card', icon: 'layers' },
]

const emptyFilters = { factory: '', client: '', product: '', from: '', to: '' }

const STATUS_TONE = { Delivered: 'success', Active: 'info', Pending: 'warning' }
const titleCase = (s = '') => (s ? s.charAt(0) + s.slice(1).toLowerCase() : '')
const hasNum = (v) => v !== '' && v != null
const num = (n) => (n ? Number(n).toLocaleString() : '—')

/* ------------------------------------------------------------------ */
/*  Print / export helpers                                             */
/* ------------------------------------------------------------------ */
const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const escapeHtml = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n')
  // BOM so Excel opens the file as UTF-8
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Prints a clean table in its own window, so the app chrome stays out of the page.
function printTable({ title, subtitle, headers, rows, numericCols = [] }) {
  const w = window.open('', '_blank')
  if (!w) return false
  const th = headers
    .map((h, i) => `<th${numericCols.includes(i) ? ' class="num"' : ''}>${escapeHtml(h)}</th>`)
    .join('')
  const body = rows
    .map((r) => `<tr>${r.map((c, i) => `<td${numericCols.includes(i) ? ' class="num"' : ''}>${escapeHtml(c)}</td>`).join('')}</tr>`)
    .join('')
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  @page{size:landscape}
  body{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#111;margin:24px}
  h1{font-size:18px;margin:0 0 4px}
  .sub{font-size:12px;color:#555;margin-bottom:16px}
  table{border-collapse:collapse;width:100%;font-size:11px}
  th,td{border:1px solid #ccc;padding:5px 7px;text-align:left}
  th{background:#f3f4f6}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  tr{page-break-inside:avoid}
  thead{display:table-header-group}
</style></head><body>
<h1>${escapeHtml(title)}</h1>
<div class="sub">${escapeHtml(subtitle)}</div>
<table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>
</body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 250)
  return true
}

/* ------------------------------------------------------------------ */
/*  Production records view                                            */
/* ------------------------------------------------------------------ */
// A run from the API in the shape the table uses. `price` is the unit cost, so the
// total cost is price × quantity. Anything the endpoint doesn't send is left blank.
const toRecord = (r) => {
  const qty = Number(r.quantity)
  const unitCost = r.price == null ? '' : Number(r.price)
  return {
    id: r.id,
    date: '',
    order: r.orderRef ?? '',
    batch: r.batchRef ?? '',
    client: r.client?.name ?? '',
    product: '',
    qty: r.quantity ?? '',
    unit: '',
    unitCost,
    totalCost: unitCost === '' || Number.isNaN(qty) ? '' : unitCost * qty,
    status: titleCase(r.status),
    materials: '',
  }
}

function buildProductionView(records) {
  const totalQty = records.reduce((n, r) => n + (Number(r.qty) || 0), 0)
  const totalCost = records.reduce((n, r) => n + (Number(r.totalCost) || 0), 0)

  return {
    columns: [
      { key: 'date', label: 'Production date', width: 140 },
      { key: 'order', label: 'Order ref.', width: 115, mono: true },
      { key: 'batch', label: 'Batch no.', width: 115, mono: true },
      { key: 'client', label: 'Special client', width: 220 },
      { key: 'product', label: 'Special product', width: 250 },
      { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => (hasNum(r.qty) ? fmt(r.qty) : '') },
      { key: 'unit', label: 'Unit', width: 100 },
      { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 145, align: 'right', mono: true, render: (r) => (hasNum(r.unitCost) ? money(r.unitCost) : '') },
      { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => (hasNum(r.totalCost) ? money(r.totalCost) : '') },
      {
        key: 'status', label: 'Status', width: 150,
        render: (r) => (r.status ? <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge> : ''),
      },
      { key: 'materials', label: 'Materials used', width: 340 },
    ],
    rows: records,
    totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
    stats: [
      { label: 'Special orders', value: String(records.length) },
      { label: 'Total produced', value: fmt(totalQty) },
      { label: 'Total production cost', value: moneyShort(totalCost) },
      { label: 'Clients served', value: String(new Set(records.map((r) => r.client).filter(Boolean)).size), hint: '' },
    ],
    tableTitle: 'Special production activity',
    emptyTitle: 'No special production in this period',
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function SpecialProductionReports({ leaf, moduleLabel, parentLabel }) {
  const { factories, categories, units, showToast } = useStore()

  const [view, setView] = useState('production')
  const isProduction = view === 'production'

  // One set of filters shared by both tabs.
  const [filters, setFilters] = useState(emptyFilters)

  // Special products = the finished products of the chosen factory.
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)

  // Production records tab
  const [applied, setApplied] = useState({ factory: '', client: '' }) // what was last generated; '' = all
  const [records, setRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  // Stock card tab
  const [paged, setPaged] = useState(null) // Paged response from the API
  const [shown, setShown] = useState(null) // { item, factory, from, to } the card was generated for
  const [page, setPage] = useState(0)
  const [cardLoading, setCardLoading] = useState(false)

  const [busy, setBusy] = useState(false) // print / export in progress

  const lookupsRef = useRef(null)
  lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

  /* ---- special products for the chosen factory (all pages) ---- */
  useEffect(() => {
    if (!filters.factory) {
      setItems([])
      return
    }
    let cancelled = false
    setItemsLoading(true)

    const loadAll = async () => {
      let p = 0
      let all = []
      let hasMore = true
      while (hasMore && !cancelled) {
        const { data } = await inventoryApi.listStockItems(filters.factory, 'FINISHED_PRODUCT', { page: p, size: 50 })
        const pageItems = data?.items ?? data ?? []
        all = [...all, ...pageItems.map((i) => inventoryApi.toStoreProduct(i, lookupsRef.current))]
        hasMore = data?.totalPages != null ? (data.page + 1) < data.totalPages : pageItems.length === 50
        p++
      }
      if (!cancelled) setItems(all)
    }

    loadAll()
      .catch((e) => !cancelled && showToast('Could not load products', e.message, true))
      .finally(() => !cancelled && setItemsLoading(false))

    return () => { cancelled = true }
  }, [filters.factory, showToast])

  /* ---- production records: every page matching the applied filters ---- */
  useEffect(() => {
    if (!isProduction) return
    let cancelled = false

    async function loadAll() {
      setRecordsLoading(true)
      try {
        const all = []
        let p = 0
        let totalPages = 1
        do {
          const res = await factoryApi.listSpecialProductionRuns({
            locationId: applied.factory || undefined,
            clientId: applied.client || undefined,
            page: p,
            size: LOAD_PAGE_SIZE,
          })
          all.push(...(res.data?.items ?? []))
          totalPages = res.data?.totalPages ?? 1
          p++
        } while (p < totalPages && !cancelled)
        if (!cancelled) setRecords(all.map(toRecord))
      } catch (e) {
        if (!cancelled) showToast('Could not load production records', e.message, true)
      } finally {
        if (!cancelled) setRecordsLoading(false)
      }
    }

    loadAll()
    return () => { cancelled = true }
  }, [isProduction, applied, showToast])

  /* ---- filters ---- */
  const onFilterChange = (key, value) => {
    setFilters((f) => ({
      ...f,
      [key]: value,
      ...(key === 'factory' ? { product: '' } : {}),
    }))
    if (key !== 'from' && key !== 'to') setPage(0)
  }

  const filterFields = [
    { key: 'factory', label: 'Factory', type: 'select', options: factories.map((f) => ({ value: f.id, label: f.name })), placeholder: 'All factories' },
    // Special client list endpoint isn't available yet, so this dropdown is empty for now.
    { key: 'client', label: 'Special client', type: 'select', options: [], placeholder: 'All clients' },
    {
      key: 'product', label: 'Special product', type: 'select',
      options: items.map((p) => ({ value: p.id, label: `${p.name} · ${p.code}` })),
      placeholder: itemsLoading ? 'Loading products…' : (filters.factory ? 'Select product…' : 'Pick a factory first'),
    },
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  /* ---- stock card (GET /inventory/stock/card/{itemId}) ---- */
  const runCard = async (p, nextPage = 0) => {
    setCardLoading(true)
    try {
      const res = await inventoryApi.listStockAndGroupBinLedgerForSingleItem('card', p.item.id, {
        locationId: p.factory,
        includeAreas: true,
        from: p.from || undefined,
        to: p.to || undefined,
        page: nextPage,
        size: CARD_PAGE_SIZE,
      })
      setPaged(res.data)
      setShown(p)
      setPage(nextPage)
    } catch (e) {
      showToast('Could not generate report', e.message, true)
    } finally {
      setCardLoading(false)
    }
  }

  const generate = () => {
    if (isProduction) {
      // factory / client are the only filters this endpoint takes
      setApplied({ factory: filters.factory, client: filters.client })
      return
    }
    if (!filters.factory) return showToast('Select a factory', 'Choose the factory first.', true)
    if (!filters.product) return showToast('Select a product', 'Choose the special product whose card you want.', true)
    if (filters.from && filters.to && filters.from > filters.to) {
      return showToast('Check the dates', '"Date from" must be before "Date to".', true)
    }
    runCard({
      item: items.find((i) => i.id === filters.product),
      factory: filters.factory,
      from: filters.from,
      to: filters.to,
    }, 0)
  }

  const reset = () => {
    setFilters(emptyFilters)
    setItems([])
    setApplied({ factory: '', client: '' })
    setPaged(null)
    setShown(null)
    setPage(0)
  }

  /* ---- view data ---- */
  let data
  if (isProduction) {
    data = buildProductionView(records)
  } else {
    const rowsOnPage = paged?.items ?? []
    const totalIn = rowsOnPage.reduce((n, r) => n + (Number(r.qtyIn) || 0), 0)
    const totalOut = rowsOnPage.reduce((n, r) => n + (Number(r.qtyOut) || 0), 0)
    const first = rowsOnPage[0]
    const last = rowsOnPage[rowsOnPage.length - 1]
    const closing = last ? Number(last.runningBalance) || 0 : 0
    const opening = first
      ? (Number(first.runningBalance) || 0) - (Number(first.qtyIn) || 0) + (Number(first.qtyOut) || 0)
      : 0

    data = {
      columns: [
        { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
        { key: 'date', label: 'Date', width: 130 },
        { key: 'remark', label: 'Remark', width: 440 },
        { key: 'qtyIn', label: 'Qty in', width: 120, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
        { key: 'qtyOut', label: 'Qty out', width: 120, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
        { key: 'balance', label: 'Balance', width: 140, align: 'right', mono: true, render: (r) => num(r.balance) },
      ],
      rows: rowsOnPage.map((r) => ({ ...r, date: r.date ? fmtDate(r.date) : '—', balance: r.runningBalance })),
      totals: paged
        ? { sn: 'Total', qtyIn: totalIn.toLocaleString(), qtyOut: totalOut.toLocaleString(), balance: closing.toLocaleString() }
        : undefined,
      stats: paged
        ? [
            { label: 'Opening balance', value: opening.toLocaleString(), hint: 'Made to order' },
            { label: 'Produced in period', value: totalIn.toLocaleString() },
            { label: 'Dispatched / withdrawn', value: totalOut.toLocaleString(), tone: 'negative' },
            { label: 'Closing balance', value: closing.toLocaleString(), hint: 'Awaiting dispatch' },
          ]
        : undefined,
      tableTitle: `Special product movement${shown?.item ? ` — ${shown.item.name}` : ''}`,
      emptyTitle: paged ? 'No movement for this special product' : 'Choose a special product to begin',
    }
  }

  /* ---- print / export: everything the current tab's filters match ---- */
  const today = () => new Date().toISOString().slice(0, 10)

  // Every page of the generated stock card, for print / export.
  async function fetchAllCardRows() {
    const all = []
    let p = 0
    let totalPages = 1
    do {
      const res = await inventoryApi.listStockAndGroupBinLedgerForSingleItem('card', shown.item.id, {
        locationId: shown.factory,
        includeAreas: true,
        from: shown.from || undefined,
        to: shown.to || undefined,
        page: p,
        size: LOAD_PAGE_SIZE,
      })
      all.push(...(res.data?.items ?? []))
      totalPages = res.data?.totalPages ?? 1
      p++
    } while (p < totalPages)
    return all
  }

  async function buildSpec() {
    if (isProduction) {
      return {
        title: 'Special Production — Production Records',
        file: 'special-production-records',
        subtitle: factories.find((f) => f.id === applied.factory)?.name || 'All factories',
        headers: ['Production date', 'Order ref.', 'Batch no.', 'Special client', 'Special product', 'Qty produced', 'Unit', 'Unit cost', 'Total cost', 'Status', 'Materials used'],
        raw: records.map((r) => [r.date, r.order, r.batch, r.client, r.product, r.qty, r.unit, r.unitCost, r.totalCost, r.status, r.materials]),
        pretty: records.map((r) => [
          r.date, r.order, r.batch, r.client, r.product,
          hasNum(r.qty) ? fmt(r.qty) : '', r.unit,
          hasNum(r.unitCost) ? money(r.unitCost) : '', hasNum(r.totalCost) ? money(r.totalCost) : '',
          r.status, r.materials,
        ]),
        numericCols: [5, 7, 8],
      }
    }
    if (!shown) return null
    const rows = await fetchAllCardRows()
    const range = shown.from || shown.to ? ` · ${shown.from || '…'} to ${shown.to || '…'}` : ''
    return {
      title: `Special Production — Stock Card — ${shown.item.name}`,
      file: 'special-production-stock-card',
      subtitle: `${shown.item.code} · ${shown.item.factoryName || ''}${range}`,
      headers: ['SN', 'Date', 'Remark', 'Qty in', 'Qty out', 'Balance'],
      raw: rows.map((r) => [r.sn, r.date, r.remark, r.qtyIn, r.qtyOut, r.runningBalance]),
      pretty: rows.map((r) => [r.sn, r.date ? fmtDate(r.date) : '—', r.remark, num(r.qtyIn), num(r.qtyOut), num(r.runningBalance)]),
      numericCols: [0, 3, 4, 5],
    }
  }

  async function withSpec(action) {
    setBusy(true)
    try {
      const spec = await buildSpec()
      if (!spec) return showToast('Generate first', 'Generate the stock card before printing or exporting.', true)
      if (!spec.raw.length) return showToast('Nothing to export', 'There are no rows to use.', true)
      action(spec)
    } catch (e) {
      showToast('Could not prepare report', e.message, true)
    } finally {
      setBusy(false)
    }
  }

  const handleExport = () =>
    withSpec((spec) => {
      downloadCsv(`${spec.file}-${today()}.csv`, spec.headers, spec.raw)
      showToast('Export ready', `${spec.raw.length} row${spec.raw.length === 1 ? '' : 's'} exported.`)
    })

  const handlePrint = () =>
    withSpec((spec) => {
      const ok = printTable({
        title: spec.title,
        subtitle: `${spec.subtitle} · ${spec.pretty.length} row${spec.pretty.length === 1 ? '' : 's'} · Printed ${today()}`,
        headers: spec.headers,
        rows: spec.pretty,
        numericCols: spec.numericCols,
      })
      if (!ok) showToast('Print blocked', 'Allow pop-ups for this site, then try again.', true)
    })

  const loading = isProduction ? recordsLoading : cardLoading
  const item = shown?.item

  return (
    <>
      {(loading || busy) && (
        <Loader overlay label={busy ? 'Preparing report…' : isProduction ? 'Loading production records…' : 'Generating stock card…'} />
      )}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Special Production — Reports'}
        icon={leaf?.icon}
        meta={!isProduction && item ? <Badge tone="brand" uppercase>{item.code} · {item.name}</Badge> : undefined}
        description="Production and movement history for special finished products, including production records and material usage for every customised order."
        filters={filterFields}
        filterValues={filters}
        onFilterChange={onFilterChange}
        onGenerate={generate}
        onReset={reset}
        onPrint={handlePrint}
        onExport={handleExport}
        stats={data.stats}
        columns={data.columns}
        rows={data.rows}
        totals={data.totals}
        pagination={!isProduction && paged ? {
          page: paged.page ?? page,
          pageCount: paged.totalPages ?? 1,
          pageSize: CARD_PAGE_SIZE,
          total: paged.totalItems ?? 0,
          onPage: (p) => shown && runCard(shown, p),
        } : undefined}
        tableTitle={data.tableTitle}
        tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
        emptyTitle={data.emptyTitle}
        emptyDescription="Widen the date range or change the client filter, then generate again."
        footnote="Cost columns are visible only to Administrators and Management. Special production is tracked separately from regular factory production."
      />
    </>
  )
}