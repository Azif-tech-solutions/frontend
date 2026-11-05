// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Panel, MetaRow } from '../shells/Page.jsx'
// import { showrooms, storageAreas, showroomCardRows, showroomCardOpening } from '../sampleShowroom.js'
// import { stockGroups, finishedProducts, withRunningBalance, summariseByDate } from '../sample.js'
// import { fmt } from '../utils.js'

// const CARD_TYPES = [
//   { value: 'stock', label: 'Stock Card', icon: 'list' },
//   { value: 'bin', label: 'Bin Card', icon: 'layers' },
// ]

// const AREAS = [
//   { value: 'all', label: 'All areas' },
//   { value: 'shop', label: 'Shop floor' },
//   { value: 'warehouse', label: 'Warehouse' },
// ]

// /**
//  * Serves both §5.2.4 leaves. `grouped` decides whether the card tracks a stock
//  * group or a single ungrouped item; the Stock/Bin toggle and the shop/warehouse
//  * split give the four card variants the PRD describes.
//  */
// export default function ShowroomCards({ leaf, moduleLabel, parentLabel, grouped = true }) {
//   const [cardType, setCardType] = useState('stock')
//   const [area, setArea] = useState('all')
//   const isStock = cardType === 'stock'

//   const base = isStock ? showroomCardRows : summariseByDate(showroomCardRows)
//   const balanceKey = isStock ? 'qtyRemain' : 'balance'
//   const rows = withRunningBalance(base, showroomCardOpening, balanceKey)

//   const totalIn = showroomCardRows.reduce((n, r) => n + r.qtyIn, 0)
//   const totalOut = showroomCardRows.reduce((n, r) => n + r.qtyOut, 0)
//   const closing = showroomCardOpening + totalIn - totalOut

//   const columns = [
//     { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
//     { key: 'date', label: 'Date', width: isStock ? 130 : 170 },
//     ...(isStock ? [{ key: 'remark', label: 'Remark', width: 420 }] : []),
//     { key: 'qtyIn', label: 'Qty in', width: isStock ? 120 : 150, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{fmt(r.qtyIn)}</span> : '—') },
//     { key: 'qtyOut', label: 'Qty out', width: isStock ? 120 : 150, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{fmt(r.qtyOut)}</span> : '—') },
//     { key: balanceKey, label: isStock ? 'Qty remain' : 'Balance', width: isStock ? 140 : 170, align: 'right', mono: true, render: (r) => fmt(r[balanceKey]) },
//   ]

//   return (
//     <ReportShell
//       wide={isStock}
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || (grouped ? 'Stock/Bin Card (Group)' : 'Stock/Bin Card (Non-Group)')}
//       icon={leaf?.icon}
//       description={grouped
//         ? 'Stock activity for a grouped set of items at this showroom. Works like the factory stock cards, separated by operational area so shop-floor and warehouse movement are tracked distinctly.'
//         : 'Stock activity for an individual, ungrouped item at this showroom. Works like the factory stock cards, separated by operational area so shop-floor and warehouse movement are tracked distinctly.'}
//       filters={[
//         { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
//         grouped
//           ? { key: 'group', label: 'Stock group', type: 'select', options: stockGroups }
//           : { key: 'item', label: 'Product', type: 'select', options: finishedProducts },
//         { key: 'area', label: 'Operational area', type: 'select', options: storageAreas },
//         { key: 'from', label: 'Date from', type: 'date' },
//         { key: 'to', label: 'Date to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Opening balance', value: fmt(showroomCardOpening), hint: '01 Aug 2026' },
//         { label: 'Total received', value: fmt(totalIn) },
//         { label: 'Total issued', value: fmt(totalOut), tone: 'negative' },
//         { label: 'Closing balance', value: fmt(closing), hint: '22 Aug 2026' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ sn: 'Total', qtyIn: fmt(totalIn), qtyOut: fmt(totalOut), [balanceKey]: fmt(closing) }}
//       tableTitle={isStock ? 'Movement detail' : 'Daily movement summary'}
//       tableActions={
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <Segmented options={AREAS} value={area} onChange={setArea} size="sm" />
//           <Segmented options={CARD_TYPES} value={cardType} onChange={setCardType} size="sm" />
//         </div>
//       }
//       emptyTitle="No movement in the selected period"
//       emptyDescription="Widen the date range or change the operational area, then generate again."
//       footnote="Shop-floor and warehouse balances are tracked separately. Selecting all areas shows the combined position for this showroom."
//     >
//       <Panel title={grouped ? 'Group' : 'Item'} description={grouped
//         ? 'Every transaction involving any member of this group posts to the card below as a single entry.'
//         : 'This card covers one item only — grouped siblings are reported on the Group card.'}>
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
//           <div>
//             <MetaRow label={grouped ? 'Group (type)' : 'Product'} value={grouped ? 'Citrus Drink' : 'ZF-101 · Citrus Drink 50cl'} />
//             <MetaRow label="Brand" value="ZifCitrus" />
//             <MetaRow label="Showroom" value="Showroom Ikeja" />
//           </div>
//           <div>
//             <MetaRow label="Operational area" value={AREAS.find((a) => a.value === area)?.label} />
//             <MetaRow label="Unit" value="Cartons" />
//             <MetaRow label="Card type" value={isStock ? 'Stock Card' : 'Bin Card'} />
//           </div>
//         </div>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone="brand">{grouped ? 'Group' : 'Non-Group'}</Badge>
//           <Badge tone="neutral">{isStock ? 'Every transaction listed' : 'Summarised per date'}</Badge>
//           {grouped && <Badge tone="neutral">Members: 50cl, 1L, 75cl</Badge>}
//         </div>
//       </Panel>
//     </ReportShell>
//   )
// }

import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 20

const CARD_TYPES = [
  { value: 'stock', label: 'Stock Card', icon: 'list' },
  { value: 'bin', label: 'Bin Card', icon: 'layers' },
]

const num = (n) => (n ? Number(n).toLocaleString() : '—')
const emptyFilters = { showroom: '', group: '', item: '', area: '', from: '', to: '' }

/** Walks every page of a list call. */
async function walk(fetchPage, isCancelled) {
  let page = 0
  let all = []
  let hasMore = true
  while (hasMore && !isCancelled()) {
    const { data } = await fetchPage(page)
    const pageItems = data?.items ?? []
    all = [...all, ...pageItems]
    hasMore = data?.totalPages != null ? page + 1 < data.totalPages : pageItems.length === 50
    page += 1
  }
  return all
}

/**
 * Serves both §5.2.4 leaves. `grouped` decides whether the card tracks a stock
 * group (category) or a single item; the Stock/Bin toggle gives the four card
 * variants. Operational area narrows the card to one area of the showroom.
 */
export default function ShowroomCards({ leaf, moduleLabel, parentLabel, grouped = true }) {
  const { categories, showToast } = useStore()

  const [cardType, setCardType] = useState('stock')
  const [filters, setFilters] = useState(emptyFilters)
  const [report, setReport] = useState(null) // { kind, header?, paged, ctx }
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const isStock = cardType === 'stock'

  // showrooms (with their areas) and, for the single-item card, the products held there
  const [showrooms, setShowrooms] = useState([])
  const [itemChoices, setItemChoices] = useState([]) // [{ value: stockItemId, label }]
  const [itemsLoading, setItemsLoading] = useState(false)

  // ---------- showrooms ----------
  useEffect(() => {
    let cancelled = false
    showroomApi
      .lookupPickerWithAreas({})
      .then((res) => {
        if (cancelled) return
        setShowrooms((res.data || []).map((s) => ({ value: s.id, label: s.label || s.name || s.code, areas: s.areas || [] })))
      })
      .catch((e) => !cancelled && showToast('Could not load showrooms', e.message, true))
    return () => { cancelled = true }
  }, [showToast])

  // ---------- products at the chosen showroom (single-item card only) ----------
  useEffect(() => {
    if (grouped || !filters.showroom) {
      setItemChoices([])
      return
    }
    let cancelled = false
    const isCancelled = () => cancelled
    setItemsLoading(true)

    Promise.allSettled([
      walk((p) => inventoryApi.listStockItems(filters.showroom, 'OUTSOURCED', { page: p, size: 50 }), isCancelled),
      walk((p) => showroomApi.listDirectStockEntries({ locationId: filters.showroom, page: p, size: 50 }), isCancelled),
    ])
      .then(([out, direct]) => {
        if (cancelled) return
        const choices = new Map()
        if (out.status === 'fulfilled') {
          for (const p of out.value) choices.set(p.id, { value: p.id, label: `Outsourced · ${p.name} (${p.code})` })
        }
        if (direct.status === 'fulfilled') {
          for (const e of direct.value) {
            const id = e.stockItem?.id
            if (id && !choices.has(id)) choices.set(id, { value: id, label: `Direct entry · ${e.product || e.stockItem?.name}` })
          }
        }
        setItemChoices([...choices.values()])
        const failed = [out, direct].find((r) => r.status === 'rejected')
        if (failed) showToast('Could not load some products', failed.reason?.message, true)
      })
      .finally(() => !cancelled && setItemsLoading(false))

    return () => { cancelled = true }
  }, [grouped, filters.showroom, showToast])

  const showroom = showrooms.find((s) => s.value === filters.showroom)
  const areaOptions = (showroom?.areas || []).map((a) => ({ value: a.id, label: a.name }))

  const cardFilters = [
    { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms.map((s) => ({ value: s.value, label: s.label })), placeholder: 'Select showroom…' },
    grouped
      ? { key: 'group', label: 'Stock group', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })), placeholder: 'Select group…' }
      : { key: 'item', label: 'Product', type: 'select', options: itemChoices, placeholder: !filters.showroom ? 'Select showroom first' : itemsLoading ? 'Loading…' : 'Select product…' },
    { key: 'area', label: 'Operational area', type: 'select', options: areaOptions, placeholder: 'All areas' },
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  const generate = async (nextPage = 0, type = cardType) => {
    if (!filters.showroom) {
      showToast('Select a showroom', 'Choose the showroom whose card you want to generate.', true)
      return
    }
    if (grouped && !filters.group) {
      showToast('Select a stock group', 'Choose the group whose card you want to generate.', true)
      return
    }
    if (!grouped && !filters.item) {
      showToast('Select a product', 'Choose the product whose card you want to generate.', true)
      return
    }
    if (filters.from && filters.to && filters.from > filters.to) {
      showToast('Check the dates', '"Date from" must be before "Date to".', true)
      return
    }

    // An operational area narrows the card to that area's own location.
    const locationId = filters.area || filters.showroom
    const range = { from: filters.from || undefined, to: filters.to || undefined, page: nextPage, size: PAGE_SIZE }

    setLoading(true)
    try {
      let next
      if (grouped) {
        const call = type === 'stock' ? inventoryApi.listStockLedger : inventoryApi.listStockBinLedger
        const res = await call.call(inventoryApi, { groupBy: 'CATEGORY', groupId: filters.group, locationId, ...range })
        next = { kind: 'group', header: res.data.header, paged: res.data.rows }
      } else {
        const res = await inventoryApi.listStockAndGroupBinLedgerForSingleItem(
          type === 'stock' ? 'stock' : 'bin',
          filters.item,
          { locationId, includeAreas: !filters.area, ...range },
        )
        next = { kind: 'single', paged: res.data }
      }
      setReport({
        ...next,
        ctx: {
          type,
          from: filters.from,
          to: filters.to,
          showroom: showroom?.label,
          area: areaOptions.find((a) => a.value === filters.area)?.label || 'All areas',
          item: itemChoices.find((c) => c.value === filters.item)?.label,
        },
      })
      setPage(nextPage)
    } catch (error) {
      showToast('Could not generate card', error.message, true)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFilters(emptyFilters)
    setReport(null)
    setPage(0)
  }

  // ---------- normalise what came back ----------
  const kind = report?.kind
  const paged = report?.paged
  const ctx = report?.ctx
  const reportIsStock = (ctx?.type ?? cardType) === 'stock'
  const rawRows = paged?.items ?? []
  const rows = rawRows.map((r) => ({
    ...r,
    date: r.date ? fmtDate(r.date) : '—',
    remain: r.qtyRemain ?? r.runningBalance ?? r.balance,
  }))

  // Group cards come with a header of totals. Single-item cards don't, so their
  // figures are worked out from the rows on this page.
  let summary
  let pageOnly = false
  if (kind === 'group') {
    summary = report.header
  } else if (kind === 'single' && rawRows.length) {
    pageOnly = true
    const bySn = [...rawRows].sort((a, b) => (a.sn ?? 0) - (b.sn ?? 0))
    const first = bySn[0]
    const last = bySn[bySn.length - 1]
    const remainOf = (r) => Number(r.qtyRemain ?? r.runningBalance ?? r.balance) || 0
    summary = {
      openingBalance: remainOf(first) - (Number(first.qtyIn) || 0) + (Number(first.qtyOut) || 0),
      totalReceived: rawRows.reduce((n, r) => n + (Number(r.qtyIn) || 0), 0),
      totalIssued: rawRows.reduce((n, r) => n + (Number(r.qtyOut) || 0), 0),
      closingBalance: remainOf(last),
    }
  }

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: reportIsStock ? 130 : 170 },
    ...(reportIsStock && kind === 'group'
      ? [
          { key: 'itemName', label: 'Item', width: 220 },
          { key: 'locationName', label: 'Location', width: 180 },
        ]
      : []),
    ...(reportIsStock ? [{ key: 'remark', label: 'Remark', width: 320 }] : []),
    { key: 'qtyIn', label: 'Qty in', width: 120, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: 120, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: 'remain', label: reportIsStock ? 'Qty remain' : 'Balance', width: 140, align: 'right', mono: true, render: (r) => num(r.remain) },
  ]

  const stats = summary
    ? [
        { label: 'Opening balance', value: Number(summary.openingBalance).toLocaleString(), hint: pageOnly ? 'Start of this page' : ctx?.from ? fmtDate(ctx.from) : undefined },
        { label: 'Total qty in', value: Number(summary.totalReceived).toLocaleString(), hint: pageOnly ? 'This page' : undefined },
        { label: 'Total qty out', value: Number(summary.totalIssued).toLocaleString(), tone: 'negative', hint: pageOnly ? 'This page' : undefined },
        { label: 'Closing balance', value: Number(summary.closingBalance).toLocaleString(), hint: pageOnly ? 'End of this page' : ctx?.to ? fmtDate(ctx.to) : undefined },
      ]
    : undefined

  const totals = summary
    ? {
        sn: 'Total',
        qtyIn: Number(summary.totalReceived).toLocaleString(),
        qtyOut: Number(summary.totalIssued).toLocaleString(),
        remain: Number(summary.closingBalance).toLocaleString(),
      }
    : undefined

  const groupName = report?.header?.group?.name
  const members = report?.header?.members || []
  const memberCount = report?.header?.memberCount ?? members.length

  return (
    <>
      {loading && <Loader overlay label="Generating card…" />}
      <ReportShell
        wide={reportIsStock}
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || (grouped ? 'Stock/Bin Card (Group)' : 'Stock/Bin Card (Non-Group)')}
        icon={leaf?.icon}
        meta={report ? <Badge tone="brand">{grouped ? groupName : ctx?.item}</Badge> : undefined}
        description={grouped
          ? 'Stock activity for a grouped set of items at this showroom. Works like the factory stock cards, separated by operational area so movement in each area is tracked distinctly.'
          : 'Stock activity for an individual, ungrouped item at this showroom. Works like the factory stock cards, separated by operational area so movement in each area is tracked distinctly.'}
        filters={cardFilters}
        filterValues={filters}
        onFilterChange={(key, value) => {
          // A new showroom has its own areas and products, so those picks are cleared.
          setFilters((f) => ({ ...f, [key]: value, ...(key === 'showroom' ? { area: '', item: '' } : {}) }))
          if (key !== 'from' && key !== 'to') setPage(0)
        }}
        onGenerate={() => generate(0)}
        onReset={reset}
        stats={stats}
        columns={columns}
        rows={rows}
        totals={totals}
        pagination={paged ? {
          page: paged.page ?? page,
          pageCount: paged.totalPages ?? 1,
          pageSize: PAGE_SIZE,
          total: paged.totalItems ?? 0,
          onPage: (p) => generate(p, ctx?.type),
        } : undefined}
        tableTitle={reportIsStock ? 'Movement detail' : 'Daily movement summary'}
        tableActions={
          <Segmented
            options={CARD_TYPES}
            value={cardType}
            onChange={(v) => {
              setCardType(v)
              if (report) generate(0, v) // switch the card straight away once one is showing
            }}
            size="sm"
          />
        }
        emptyTitle={report ? 'No movement in the selected period' : `Choose a ${grouped ? 'stock group' : 'product'} to begin`}
        emptyDescription={report
          ? 'Widen the date range or change the operational area, then generate again.'
          : `Select a showroom and a ${grouped ? 'stock group' : 'product'} (and optionally an area and dates), then click Generate.`}
        footnote="Each area's balance is tracked separately. Leaving the area blank shows the combined position for the showroom. Report data reflects the underlying transactional records at the moment of generation."
      >
        {report && (
          <Panel
            title={grouped ? 'Group' : 'Item'}
            description={grouped
              ? `${memberCount} item${memberCount === 1 ? '' : 's'} in this group. Every transaction involving any member posts to the card as a single entry.`
              : 'This card covers one item only — grouped siblings are reported on the Group card.'}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
              <div>
                <MetaRow label={grouped ? 'Group (type)' : 'Product'} value={(grouped ? groupName : ctx?.item) || '—'} />
                <MetaRow label="Showroom" value={ctx?.showroom || '—'} />
              </div>
              <div>
                <MetaRow label="Operational area" value={ctx?.area || 'All areas'} />
                <MetaRow label="Card type" value={reportIsStock ? 'Stock Card' : 'Bin Card'} />
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Badge tone="brand">{grouped ? 'Group' : 'Non-Group'}</Badge>
              <Badge tone="neutral">{reportIsStock ? 'Every transaction listed' : 'Summarised per date'}</Badge>
              {grouped && members.map((m) => (
                <Badge key={m.stockItem?.id} tone="neutral">
                  {m.stockItem?.name} · {m.stockItem?.code}{m.unit ? ` · ${m.unit}` : ''}
                </Badge>
              ))}
            </div>
          </Panel>
        )}
      </ReportShell>
    </>
  )
}