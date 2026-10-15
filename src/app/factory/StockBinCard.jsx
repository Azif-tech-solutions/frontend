import { useState, useEffect, useRef } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()
const PAGE_SIZE = 20

const num = (n) => (n ? Number(n).toLocaleString() : '—')
const emptyFilters = { factory: '', itemType: '', item: '', from: '', to: '' }

const MODES = [
  { value: 'stock', label: 'Stock Card', icon: 'list' },
  { value: 'bin', label: 'Bin Card', icon: 'layers' },
]

const KINDS = [
  { value: 'finished', label: 'Finished product', itemType: 'FINISHED_PRODUCT', tone: 'success' },
  { value: 'raw', label: 'Raw material', itemType: 'RAW_MATERIAL', tone: 'warning' },
]
const kindOf = (v) => KINDS.find((k) => k.value === v) || KINDS[0]

export default function StockBinCard({ leaf, moduleLabel, parentLabel }) {
  const { factories, categories, units, showToast } = useStore()

  const [mode, setMode] = useState('stock')
  const [filters, setFilters] = useState(emptyFilters)
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [paged, setPaged] = useState(null)   // Paged response from the API
  const [shown, setShown] = useState(null)   // { item, factory, from, to }
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const isStock = mode === 'stock'

  const lookupsRef = useRef(null)
  lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

  // Load products (paginated under the hood) — already done earlier
  useEffect(() => {
    const itemType = KINDS.find((k) => k.value === filters.itemType)?.itemType
    if (!filters.factory || !itemType) {
      setItems([])
      return
    }

    let cancelled = false
    setItemsLoading(true)

    const loadAllProducts = async () => {
      let page = 0
      let all = []
      let hasMore = true

      while (hasMore && !cancelled) {
        const { data } = await inventoryApi.listStockItems(filters.factory, itemType, {
          page,
          size: 50,
        })
        const pageItems = data?.items ?? data ?? []
        const mapped = pageItems.map((i) =>
          inventoryApi.toStoreProduct(i, lookupsRef.current)
        )
        all = [...all, ...mapped]
        hasMore = data?.totalPages != null
          ? (data.page + 1) < data.totalPages
          : pageItems.length === 50
        page++
      }
      if (!cancelled) setItems(all)
    }

    loadAllProducts()
      .catch((error) => {
        if (!cancelled) showToast('Could not load products', error.message, true)
      })
      .finally(() => {
        if (!cancelled) setItemsLoading(false)
      })

    return () => { cancelled = true }
  }, [filters.factory, filters.itemType, showToast])

  const onFilterChange = (key, value) => {
    setFilters((f) => ({
      ...f,
      [key]: value,
      ...(key === 'factory' || key === 'itemType' ? { item: '' } : {}),
    }))
    if (key !== 'from' && key !== 'to') setPage(0)
  }

  const filterFields = [
    { key: 'factory', label: 'Factory', type: 'select', options: factories.map((f) => ({ value: f.id, label: f.name })), placeholder: 'Select factory…' },
    { key: 'itemType', label: 'Stock type', type: 'select', options: KINDS.map(({ value, label }) => ({ value, label })), placeholder: 'Select type…' },
    {
      key: 'item', label: 'Product / material', type: 'select',
      options: items.map((p) => ({ value: p.id, label: `${p.name} · ${p.code}` })),
      placeholder: itemsLoading ? 'Loading products…' : (filters.factory && filters.itemType ? 'Select product…' : 'Pick factory and type first'),
    },
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  const run = async (m, p, nextPage = 0) => {
    setLoading(true)
    try {
      const res = await inventoryApi.listStockAndGroupBinLedgerForSingleItem(
        m === 'bin' ? 'bin' : 'card',
        p.item.id,
        {
          locationId: p.factory,
          includeAreas: true,
          from: p.from || undefined,
          to: p.to || undefined,
          page: nextPage,
          size: PAGE_SIZE,
        }
      )
      // res.data is now the Paged object
      setPaged(res.data)
      setShown(p)
      setPage(nextPage)
    } catch (error) {
      showToast('Could not generate report', error.message, true)
    } finally {
      setLoading(false)
    }
  }

  const generate = () => {
    if (!filters.factory) { showToast('Select a factory', 'Choose the factory first.', true); return }
    if (!filters.itemType) { showToast('Select a stock type', 'Choose finished product or raw material.', true); return }
    if (!filters.item) { showToast('Select a product', 'Choose the product whose card you want.', true); return }
    if (filters.from && filters.to && filters.from > filters.to) {
      showToast('Check the dates', '"Date from" must be before "Date to".', true)
      return
    }
    run(mode, {
      item: items.find((p) => p.id === filters.item),
      factory: filters.factory,
      from: filters.from,
      to: filters.to,
    }, 0)
  }

  const changeMode = (m) => {
    setMode(m)
    if (shown) run(m, shown, 0)   // re-run from page 0 when switching mode
  }

  const reset = () => {
    setFilters(emptyFilters)
    setItems([])
    setPaged(null)
    setShown(null)
    setPage(0)
  }

  const balanceKey = isStock ? 'runningBalance' : 'balance'
  const data = paged?.items ?? []
  const totalIn = data.reduce((n, r) => n + (Number(r.qtyIn) || 0), 0)
  const totalOut = data.reduce((n, r) => n + (Number(r.qtyOut) || 0), 0)
  const first = data[0]
  const last = data[data.length - 1]
  const closing = last ? Number(last[balanceKey]) || 0 : 0
  const opening = first
    ? (Number(first[balanceKey]) || 0) - (Number(first.qtyIn) || 0) + (Number(first.qtyOut) || 0)
    : 0

  const tableRows = data.map((r) => ({ ...r, date: r.date ? fmtDate(r.date) : '—' }))

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: isStock ? 130 : 170 },
    ...(isStock ? [{ key: 'remark', label: 'Remark', width: 380 }] : []),
    { key: 'qtyIn', label: 'Qty in', width: isStock ? 110 : 150, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: isStock ? 110 : 150, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: balanceKey, label: isStock ? 'Qty remain' : 'Balance', width: isStock ? 130 : 170, align: 'right', mono: true, render: (r) => num(r[balanceKey]) },
  ]

  const stats = paged ? [
    { label: 'Opening balance', value: opening.toLocaleString(), hint: shown?.from ? fmtDate(shown.from) : undefined },
    { label: 'Total qty in', value: totalIn.toLocaleString() },
    { label: 'Total qty out', value: totalOut.toLocaleString(), tone: 'negative' },
    { label: 'Closing balance', value: closing.toLocaleString(), hint: shown?.to ? fmtDate(shown.to) : undefined },
  ] : undefined

  const totals = paged
    ? { sn: 'Total', qtyIn: totalIn.toLocaleString(), qtyOut: totalOut.toLocaleString(), [balanceKey]: closing.toLocaleString() }
    : undefined

  const item = shown?.item
  const kind = kindOf(item?.kind)

  return (
    <>
      {loading && <Loader overlay label={`Generating ${isStock ? 'stock' : 'bin'} card…`} />}
      <ReportShell
        wide={isStock}
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Stock/Bin Card'}
        icon={leaf?.icon}
        meta={item ? (
          <>
            <Badge tone="brand" uppercase>{item.code} · {item.name}</Badge>
            <Badge tone={kind.tone}>{kind.label}</Badge>
          </>
        ) : undefined}
        description="Movement history for a single product or material. Works exactly like the group cards, except every product is treated as an entity on its own."
        filters={filterFields}
        filterValues={filters}
        onFilterChange={onFilterChange}
        onGenerate={generate}
        onReset={reset}
        stats={stats}
        columns={columns}
        rows={tableRows}
        totals={totals}
        pagination={paged ? {
          page: paged.page ?? page,
          pageCount: paged.totalPages ?? 1,
          pageSize: PAGE_SIZE,
          total: paged.totalItems ?? 0,
          onPage: (p) => shown && run(mode, shown, p),
        } : undefined}
        tableTitle={`${isStock ? 'Product activity' : 'Daily movement summary'}${item ? ` — ${item.name}` : ''}`}
        tableActions={<Segmented options={MODES} value={mode} onChange={changeMode} size="sm" />}
        emptyTitle={paged ? 'No activity for this item in the selected period' : 'Choose a product to begin'}
        emptyDescription={paged
          ? 'Widen the date range or choose a different product, then generate again.'
          : 'Select a factory, stock type and product (and optionally dates), then click Generate.'}
        footnote="Report data reflects the underlying transactional records at the moment of generation."
      >
        {item && (
          <Panel
            title={`Stock — ${item.name}`}
            description="The card below covers this item only — its group siblings are reported separately on the GP cards."
            actions={<Badge tone={kind.tone}>{kind.label}</Badge>}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
              <div>
                <MetaRow label="Stock name" value={`${item.code} · ${item.name}`} />
                <MetaRow label="Stock type" value={kind.label} />
                <MetaRow label="Group" value={item.category || '—'} />
              </div>
              <div>
                <MetaRow label="Brand" value={item.brand || '—'} />
                <MetaRow label="Factory" value={item.factoryName || '—'} />
                <MetaRow label="Unit" value={item.unit || '—'} />
                <MetaRow label="Re-order level" value={item.reorder || '—'} mono />
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge tone={item.status === 'Active' ? 'success' : 'neutral'}>{item.status}</Badge>
              {item.barcode && <Badge tone="neutral" uppercase>Barcode {item.barcode}</Badge>}
            </div>
          </Panel>
        )}
      </ReportShell>
    </>
  )
}