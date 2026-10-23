// import { useState } from 'react'
// import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { RestrictedLabel } from '../shells/Page.jsx'
// import { factories, registeredRecipes, recipeProductionRuns, recipeStockCardRows, recipeStockOpening, withRunningBalance } from '../sample.js'
// import { fmt, money, moneyShort } from '../utils.js'

// const VIEWS = [
//   { value: 'production', label: 'Production report', icon: 'list' },
//   { value: 'stockcard', label: 'Stock card', icon: 'layers' },
// ]

// const recipeOptions = registeredRecipes.map((r) => ({ value: r.code, label: `${r.code} · ${r.name}` }))

// /** Internally produced items with the raw materials each run consumed. */
// function buildProductionView() {
//   const rows = recipeProductionRuns.map((r) => ({ ...r, totalCost: r.qty * r.unitCost }))
//   const totalQty = rows.reduce((n, r) => n + r.qty, 0)
//   const totalCost = rows.reduce((n, r) => n + r.totalCost, 0)

//   return {
//     columns: [
//       { key: 'date', label: 'Production date', width: 140 },
//       { key: 'batch', label: 'Batch no.', width: 115, mono: true },
//       { key: 'recipe', label: 'Recipe produced', width: 250 },
//       { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qty) },
//       { key: 'unit', label: 'Unit', width: 110 },
//       { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
//       { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => money(r.totalCost) },
//       { key: 'materials', label: 'Raw materials used', width: 340 },
//     ],
//     rows,
//     totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
//     stats: [
//       { label: 'Production cycles', value: String(rows.length) },
//       { label: 'Total produced', value: fmt(totalQty) },
//       { label: 'Total production cost', value: moneyShort(totalCost) },
//       { label: 'Recipes covered', value: String(new Set(rows.map((r) => r.recipe)).size) },
//     ],
//     tableTitle: 'Internally produced items',
//     emptyTitle: 'No in-house production in this period',
//   }
// }

// /** How an in-house recipe is produced and drawn down over time. */
// function buildStockCardView() {
//   const rows = withRunningBalance(recipeStockCardRows, recipeStockOpening, 'balance')
//   const totalIn = recipeStockCardRows.reduce((n, r) => n + r.qtyIn, 0)
//   const totalOut = recipeStockCardRows.reduce((n, r) => n + r.qtyOut, 0)
//   const closing = recipeStockOpening + totalIn - totalOut

//   return {
//     columns: [
//       { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
//       { key: 'date', label: 'Date', width: 130 },
//       { key: 'remark', label: 'Remark', width: 420 },
//       { key: 'qtyIn', label: 'Qty in', width: 120, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{fmt(r.qtyIn)}</span> : '—') },
//       { key: 'qtyOut', label: 'Qty out', width: 120, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyOut)}</span> : '—') },
//       { key: 'balance', label: 'Balance', width: 140, align: 'right', mono: true, render: (r) => fmt(r.balance) },
//     ],
//     rows,
//     totals: { sn: 'Total', qtyIn: fmt(totalIn), qtyOut: fmt(totalOut), balance: fmt(closing) },
//     stats: [
//       { label: 'Opening balance', value: fmt(recipeStockOpening), hint: '01 Aug 2026' },
//       { label: 'Produced in period', value: fmt(totalIn) },
//       { label: 'Consumed in period', value: fmt(totalOut), tone: 'negative' },
//       { label: 'Closing balance', value: fmt(closing), hint: '23 Aug 2026' },
//     ],
//     tableTitle: 'Recipe utilisation over time',
//     emptyTitle: 'No movement for this recipe in the selected period',
//   }
// }

// export default function RecipesReports({ leaf, moduleLabel, parentLabel }) {
//   const [view, setView] = useState('production')
//   const isProduction = view === 'production'
//   const data = isProduction ? buildProductionView() : buildStockCardView()

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'In-House Recipes — Reports'}
//       icon={leaf?.icon}
//       description="Internally produced items and the raw materials consumed in their production, with a stock card view tracking how each in-house recipe is utilised over time."
//       filters={[
//         { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         { key: 'recipe', label: 'Recipe', type: 'select', options: recipeOptions },
//         { key: 'from', label: 'Date from', type: 'date' },
//         { key: 'to', label: 'Date to', type: 'date' },
//       ]}
//       stats={data.stats}
//       columns={data.columns}
//       rows={data.rows}
//       totals={data.totals}
//       tableTitle={data.tableTitle}
//       tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
//       emptyTitle={data.emptyTitle}
//       emptyDescription="Widen the date range or choose a different recipe, then generate again."
//       footnote="Cost columns are visible only to Administrators and Management. Quantities reflect the underlying records at the moment of generation."
//     />
//   )
// }

import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { RestrictedLabel } from '../shells/Page.jsx'
import { fmt, fmtDate, money, moneyShort } from '../utils.js'
import { useStore } from '../store.jsx'
import { downloadCsv, printTable } from '../reportExport.js'
import FactoryApi from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'

const factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()

const CARD_PAGE_SIZE = 20   // stock card: paged on screen
const LOAD_PAGE_SIZE = 100  // production report / print / export: walk every page in batches

const VIEWS = [
  { value: 'production', label: 'Production report', icon: 'list' },
  { value: 'stockcard', label: 'Stock card', icon: 'layers' },
]

const emptyFilters = { factory: '', recipe: '', from: '', to: '' }

const hasNum = (v) => v !== '' && v != null
const num = (n) => (n ? Number(n).toLocaleString() : '—')

/* ------------------------------------------------------------------ */
/*  Production report view                                             */
/* ------------------------------------------------------------------ */
// A production run from the API in the shape the table uses. The unit and the
// raw materials used aren't sent by the endpoint, so they are left blank.
const toRecord = (r, i) => ({
  id: r.batchRef ?? i,
  date: r.runAt ? fmtDate(r.runAt) : '',
  batch: r.batchRef ?? '',
  recipe: r.targetStockItem?.name ?? '',
  qty: r.quantityProduced ?? '',
  unit: '',
  unitCost: r.unitLandingCost ?? '',
  totalCost: r.totalLandingCost ?? '',
  materials: '',
})

function buildProductionView(records) {
  const totalQty = records.reduce((n, r) => n + (Number(r.qty) || 0), 0)
  const totalCost = records.reduce((n, r) => n + (Number(r.totalCost) || 0), 0)

  return {
    columns: [
      { key: 'date', label: 'Production date', width: 140 },
      { key: 'batch', label: 'Batch no.', width: 115, mono: true },
      { key: 'recipe', label: 'Recipe produced', width: 250 },
      { key: 'qty', label: 'Qty produced', width: 130, align: 'right', mono: true, render: (r) => (hasNum(r.qty) ? fmt(r.qty) : '') },
      { key: 'unit', label: 'Unit', width: 110 },
      { key: 'unitCost', label: <RestrictedLabel>Unit cost</RestrictedLabel>, width: 150, align: 'right', mono: true, render: (r) => (hasNum(r.unitCost) ? money(r.unitCost) : '') },
      { key: 'totalCost', label: <RestrictedLabel>Total cost</RestrictedLabel>, width: 170, align: 'right', mono: true, render: (r) => (hasNum(r.totalCost) ? money(r.totalCost) : '') },
      { key: 'materials', label: 'Raw materials used', width: 340 },
    ],
    rows: records,
    totals: { date: 'Total', qty: fmt(totalQty), totalCost: money(totalCost) },
    stats: [
      { label: 'Production cycles', value: String(records.length) },
      { label: 'Total produced', value: fmt(totalQty) },
      { label: 'Total production cost', value: moneyShort(totalCost) },
      { label: 'Recipes covered', value: String(new Set(records.map((r) => r.recipe).filter(Boolean)).size) },
    ],
    tableTitle: 'Internally produced items',
    emptyTitle: 'No in-house production in this period',
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function RecipesReports({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  const [view, setView] = useState('production')
  const isProduction = view === 'production'

  // One set of filters shared by both tabs.
  const [filters, setFilters] = useState(emptyFilters)

  // The in-house recipes of the chosen factory.
  const [recipes, setRecipes] = useState([])
  const [recipesLoading, setRecipesLoading] = useState(false)

  // Production report tab
  const [applied, setApplied] = useState({ factory: '', from: '', to: '' }) // last generated; '' = all
  const [records, setRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)

  // Stock card tab
  const [paged, setPaged] = useState(null) // Paged response from the API
  const [shown, setShown] = useState(null) // { recipe, factory, from, to } the card was generated for
  const [page, setPage] = useState(0)
  const [cardLoading, setCardLoading] = useState(false)

  const [busy, setBusy] = useState(false) // print / export in progress

  /* ---- in-house recipes for the chosen factory (all pages) ---- */
  useEffect(() => {
    if (!filters.factory) {
      setRecipes([])
      return
    }
    let cancelled = false
    setRecipesLoading(true)

    const loadAll = async () => {
      let p = 0
      let all = []
      let hasMore = true
      while (hasMore && !cancelled) {
        const { data } = await factoryApi.listRecipes({ locationId: filters.factory, page: p, size: 50 })
        const pageItems = data?.items ?? data ?? []
        all = [...all, ...pageItems]
        hasMore = data?.totalPages != null ? (data.page + 1) < data.totalPages : pageItems.length === 50
        p++
      }
      if (!cancelled) setRecipes(all.filter((r) => r.sourcing === 'IN_HOUSE_PRODUCTION'))
    }

    loadAll()
      .catch((e) => !cancelled && showToast('Could not load recipes', e.message, true))
      .finally(() => !cancelled && setRecipesLoading(false))

    return () => { cancelled = true }
  }, [filters.factory, showToast])

  /* ---- production report: every page matching the applied filters ---- */
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
          const res = await factoryApi.listProductionCostRuns({
            locationId: applied.factory || undefined,
            from: applied.from || undefined,
            to: applied.to || undefined,
            page: p,
            size: LOAD_PAGE_SIZE,
          })
          all.push(...(res.data?.items ?? []))
          totalPages = res.data?.totalPages ?? 1
          p++
        } while (p < totalPages && !cancelled)
        if (!cancelled) setRecords(all.map(toRecord))
      } catch (e) {
        if (!cancelled) showToast('Could not load production report', e.message, true)
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
      ...(key === 'factory' ? { recipe: '' } : {}),
    }))
    if (key !== 'from' && key !== 'to') setPage(0)
  }

  const filterFields = [
    { key: 'factory', label: 'Factory', type: 'select', options: factories.map((f) => ({ value: f.id, label: f.name })), placeholder: 'All factories' },
    {
      key: 'recipe', label: 'Recipe', type: 'select',
      options: recipes.map((r) => ({ value: r.id, label: `${r.code} · ${r.name}` })),
      placeholder: recipesLoading ? 'Loading recipes…' : (filters.factory ? 'Select recipe…' : 'Pick a factory first'),
    },
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  /* ---- stock card (GET /inventory/stock/card/{id}, sending the recipe id) ---- */
  const runCard = async (p, nextPage = 0) => {
    setCardLoading(true)
    try {
      const res = await inventoryApi.listStockAndGroupBinLedgerForSingleItem('card', p.recipe.id, {
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
    if (filters.from && filters.to && filters.from > filters.to) {
      return showToast('Check the dates', '"Date from" must be before "Date to".', true)
    }
    if (isProduction) {
      // factory and dates are what the runs endpoint takes; the recipe filter isn't sent
      setApplied({ factory: filters.factory, from: filters.from, to: filters.to })
      return
    }
    if (!filters.factory) return showToast('Select a factory', 'Choose the factory first.', true)
    if (!filters.recipe) return showToast('Select a recipe', 'Choose the recipe whose card you want.', true)
    runCard({
      recipe: recipes.find((r) => r.id === filters.recipe),
      factory: filters.factory,
      from: filters.from,
      to: filters.to,
    }, 0)
  }

  const reset = () => {
    setFilters(emptyFilters)
    setRecipes([])
    setApplied({ factory: '', from: '', to: '' })
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
        { key: 'remark', label: 'Remark', width: 420 },
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
            { label: 'Opening balance', value: opening.toLocaleString(), hint: shown?.from ? fmtDate(shown.from) : undefined },
            { label: 'Produced in period', value: totalIn.toLocaleString() },
            { label: 'Consumed in period', value: totalOut.toLocaleString(), tone: 'negative' },
            { label: 'Closing balance', value: closing.toLocaleString(), hint: shown?.to ? fmtDate(shown.to) : undefined },
          ]
        : undefined,
      tableTitle: `Recipe utilisation over time${shown?.recipe ? ` — ${shown.recipe.name}` : ''}`,
      emptyTitle: paged ? 'No movement for this recipe in the selected period' : 'Choose a recipe to begin',
    }
  }

  /* ---- print / export: everything the current tab's filters match ---- */
  const today = () => new Date().toISOString().slice(0, 10)
  const factoryName = (id) => factories.find((f) => f.id === id)?.name || 'All factories'

  // Every page of the generated stock card, for print / export.
  async function fetchAllCardRows() {
    const all = []
    let p = 0
    let totalPages = 1
    do {
      const res = await inventoryApi.listStockAndGroupBinLedgerForSingleItem('card', shown.recipe.id, {
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
      const range = applied.from || applied.to ? ` · ${applied.from || '…'} to ${applied.to || '…'}` : ''
      return {
        title: 'In-House Recipes — Production Report',
        file: 'recipes-production-report',
        subtitle: `${factoryName(applied.factory)}${range}`,
        headers: ['Production date', 'Batch no.', 'Recipe produced', 'Qty produced', 'Unit', 'Unit cost', 'Total cost', 'Raw materials used'],
        raw: records.map((r) => [r.date, r.batch, r.recipe, r.qty, r.unit, r.unitCost, r.totalCost, r.materials]),
        pretty: records.map((r) => [
          r.date, r.batch, r.recipe,
          hasNum(r.qty) ? fmt(r.qty) : '', r.unit,
          hasNum(r.unitCost) ? money(r.unitCost) : '', hasNum(r.totalCost) ? money(r.totalCost) : '',
          r.materials,
        ]),
        numericCols: [3, 5, 6],
      }
    }
    if (!shown) return null
    const rows = await fetchAllCardRows()
    const range = shown.from || shown.to ? ` · ${shown.from || '…'} to ${shown.to || '…'}` : ''
    return {
      title: `In-House Recipes — Stock Card — ${shown.recipe.name}`,
      file: 'recipes-stock-card',
      subtitle: `${shown.recipe.code} · ${factoryName(shown.factory)}${range}`,
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
  const recipe = shown?.recipe

  return (
    <>
      {(loading || busy) && (
        <Loader overlay label={busy ? 'Preparing report…' : isProduction ? 'Loading production report…' : 'Generating stock card…'} />
      )}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'In-House Recipes — Reports'}
        icon={leaf?.icon}
        meta={!isProduction && recipe ? <Badge tone="brand" uppercase>{recipe.code} · {recipe.name}</Badge> : undefined}
        description="Internally produced items and the raw materials consumed in their production, with a stock card view tracking how each in-house recipe is utilised over time."
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
        emptyDescription="Widen the date range or choose a different recipe, then generate again."
        footnote="Cost columns are visible only to Administrators and Management. Quantities reflect the underlying records at the moment of generation."
      />
    </>
  )
}