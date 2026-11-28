import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import { fmtDate, money } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const inventoryApi = new InventoryApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 20
const PRICE_CHECK_CONCURRENCY = 6 // how many price-history lookups run at once

const todayIso = () => new Date().toISOString().slice(0, 10)

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

// Lookups toStoreProduct uses to turn ids into names (same as the Stock Register).
const stockLookups = (factories, categories, units) => ({
  factories,
  categories: categoryOptions(categories),
  units: unitOptions(units),
})

// Turn a product's price history (newest first) into a small status object.
//  none      -> no price list at all
//  priced    -> has a CURRENT price
//  scheduled -> has entries but none is current yet (e.g. only a future price)
function stateFromHistory(items = []) {
  const current = items.find((h) => h.state === 'CURRENT')
  if (current) return { status: 'priced', current }
  if (items.length > 0) return { status: 'scheduled', current: items[0] }
  return { status: 'none', current: null }
}

const textareaStyle = {
  width: '100%',
  padding: '10px 12px',
  resize: 'vertical',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
  color: 'var(--text-strong)',
  outline: 'none',
}

const smallButtonStyle = {
  height: 'var(--field-h)',
  padding: '0 12px',
  background: 'transparent',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  color: 'var(--text-muted)',
  font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
  cursor: 'pointer',
}

// Simple CSS-grid table for panels
function GridTable({ template, headers, rows, empty = 'Nothing to show.' }) {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: template,
    gap: 10,
    padding: '10px 0',
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 'fit-content' }}>
        <div
          style={{
            ...rowStyle,
            borderBottom: '1px solid var(--border-default)',
            font: 'var(--type-eyebrow)',
            letterSpacing: 'var(--ls-widest)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {headers.map((h, i) => (
            <div key={i} style={{ textAlign: h.align }}>
              {h.label}
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <div style={{ padding: '14px 0', color: 'var(--text-muted)' }}>{empty}</div>
        )}
        {rows.map((cells, ri) => (
          <div
            key={ri}
            style={{
              ...rowStyle,
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              font: 'var(--type-body)',
              color: 'var(--text-strong)',
            }}
          >
            {cells.map((c, ci) => (
              <div
                key={ci}
                style={{
                  textAlign: headers[ci].align,
                  fontFamily: headers[ci].mono ? 'var(--font-mono)' : undefined,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  One product: history, set / schedule a price, change current price */
/* ------------------------------------------------------------------ */
function PriceDetail({ item, crumbs, onBack, onPriceState }) {
  const { showToast } = useStore()

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  // set / schedule a price
  const [sDate, setSDate] = useState(todayIso())
  const [sRetail, setSRetail] = useState('')
  const [sDealer, setSDealer] = useState('')
  const [sNote, setSNote] = useState('')

  // change the current price
  const [eRetail, setERetail] = useState('')
  const [eDealer, setEDealer] = useState('')
  const [eNote, setENote] = useState('')

  const current = history.find((h) => h.state === 'CURRENT') || null

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await inventoryApi.listPriceListProductHistory({
        stockItemId: item.id,
        page: 0,
        size: 20,
      })
      const list = res?.data?.items || []
      setHistory(list)
      onPriceState(item.id, stateFromHistory(list))
      return list
    } catch (e) {
      showToast('Could not load price history', e.message, true)
      return []
    } finally {
      setLoading(false)
    }
  }, [item.id, onPriceState, showToast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // prefill the "change current price" form when the current price is known
  useEffect(() => {
    if (current) {
      setERetail(String(current.retailPrice ?? ''))
      setEDealer(String(current.dealerPrice ?? ''))
    }
  }, [current?.priceId]) // eslint-disable-line react-hooks/exhaustive-deps

  const scheduled = sDate > todayIso()
  const canSet = Number(sRetail) > 0 && Number(sDealer) > 0 && !!sDate && !busy
  const editChanged =
    current &&
    (Number(eRetail) !== current.retailPrice || Number(eDealer) !== current.dealerPrice)
  const canEdit =
    !!current && Number(eRetail) > 0 && Number(eDealer) > 0 && editChanged && !busy

  async function setPrice() {
    if (!canSet) return
    setBusy(true)
    try {
      const res = await inventoryApi.publishPriceList({
        effectiveFrom: sDate,
        note: sNote.trim(),
        entries: [
          { stockItemId: item.id, retailPrice: Number(sRetail), dealerPrice: Number(sDealer) },
        ],
      })
      const below = res?.data?.belowCostCount || 0
      showToast(
        scheduled ? 'Price change scheduled' : 'Price published',
        below > 0 ? 'This price is below landing cost.' : `${item.name} updated.`
      )
      setSRetail('')
      setSDealer('')
      setSNote('')
      await loadHistory()
    } catch (e) {
      showToast('Could not publish price', e.message, true)
    } finally {
      setBusy(false)
    }
  }

  async function changeCurrent() {
    if (!canEdit) return
    setBusy(true)
    try {
      await inventoryApi.editPriceList(current.priceId, {
        retailPrice: Number(eRetail),
        dealerPrice: Number(eDealer),
        note: eNote.trim(),
      })
      showToast('Price updated', `${item.name} now has the new prices.`)
      setENote('')
      await loadHistory()
    } catch (e) {
      showToast('Could not update price', e.message, true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {(busy || loading) && <Loader overlay label={busy ? 'Saving…' : 'Loading price history…'} />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Pricing — ${item.name}`}
        icon="tags"
        description="Set the first price, change the current one, or schedule a future change. Everything here is recorded in the price history."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to price list
          </Button>
        }
        submitLabel={null}
        onCancel={onBack}
        aside={
          <Panel title="Product">
            <MetaRow label="Code" value={item.code || '—'} mono />
            <MetaRow label="Category" value={item.category || '—'} />
            <MetaRow label="Unit" value={item.unit || '—'} />
            <MetaRow label="Location" value={item.locationName || '—'} />
            <MetaRow
              label="Price list"
              value={
                loading ? (
                  <Badge tone="neutral">Checking…</Badge>
                ) : current ? (
                  <Badge tone="success">Priced</Badge>
                ) : history.length ? (
                  <Badge tone="info">Scheduled</Badge>
                ) : (
                  <Badge tone="warning">No price list</Badge>
                )
              }
            />
            {current && (
              <>
                <MetaRow label="Retail" value={money(current.retailPrice || 0)} mono />
                <MetaRow label="Dealer" value={money(current.dealerPrice || 0)} mono />
                <MetaRow
                  label="Effective from"
                  value={current.effectiveFrom ? fmtDate(current.effectiveFrom) : '—'}
                />
              </>
            )}
          </Panel>
        }
      >
        {!loading && !current && history.length === 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="This product has no price list yet"
            style={{ marginBottom: 14 }}
          >
            Set its first price below so it can be sold.
          </Callout>
        )}

        <Panel
          title={current ? 'Schedule or publish a new price' : 'Set the first price'}
          description={
            current
              ? 'Add a new price from a chosen date. Pick today to apply it straight away.'
              : 'Choose when the price starts and enter the retail and dealer prices.'
          }
        >
          <FieldSet columns={2}>
            <Input
              label="Effective from *"
              type="date"
              value={sDate}
              onChange={(e) => setSDate(val(e))}
            />
            <Input
              label="Note"
              placeholder="e.g. Initial price"
              value={sNote}
              onChange={(e) => setSNote(val(e))}
            />
            <Input
              label="Retail price (₦) *"
              type="number"
              placeholder="0.00"
              value={sRetail}
              onChange={(e) => setSRetail(val(e))}
            />
            <Input
              label="Dealer price (₦) *"
              type="number"
              placeholder="0.00"
              value={sDealer}
              onChange={(e) => setSDealer(val(e))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <Button iconLeft="tags" onClick={setPrice} disabled={!canSet}>
              {scheduled ? 'Schedule price' : 'Publish price'}
            </Button>
          </div>
        </Panel>

        {current && (
          <Panel
            title="Change the current price"
            description="Corrects the price that is live right now. To change it from a later date, schedule a new price above instead."
          >
            <FieldSet columns={2}>
              <Input
                label="Retail price (₦) *"
                type="number"
                value={eRetail}
                onChange={(e) => setERetail(val(e))}
              />
              <Input
                label="Dealer price (₦) *"
                type="number"
                value={eDealer}
                onChange={(e) => setEDealer(val(e))}
              />
            </FieldSet>
            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Note
              </div>
              <textarea
                rows={2}
                placeholder="Why is this price changing?"
                value={eNote}
                onChange={(e) => setENote(e.target.value)}
                style={textareaStyle}
              />
            </div>
            <div style={{ marginTop: 14 }}>
              <Button variant="secondary" iconLeft="save" onClick={changeCurrent} disabled={!canEdit}>
                Save current price
              </Button>
            </div>
          </Panel>
        )}

        <Panel title="Price history">
          <GridTable
            template="130px 140px 140px 130px minmax(160px, 1.5fr) 110px"
            headers={[
              { label: 'Effective' },
              { label: 'Retail', align: 'right', mono: true },
              { label: 'Dealer', align: 'right', mono: true },
              { label: 'Batch', mono: true },
              { label: 'Set by / note' },
              { label: 'State' },
            ]}
            empty={loading ? 'Loading…' : 'No price history yet.'}
            rows={history.map((h) => [
              h.effectiveFrom ? fmtDate(h.effectiveFrom) : '—',
              money(h.retailPrice || 0),
              money(h.dealerPrice || 0),
              h.batchRef || '—',
              <span key="n">
                {h.setBy?.name || '—'}
                {h.note ? ` — ${h.note}` : ''}
              </span>,
              <Badge key="s" tone={h.state === 'CURRENT' ? 'success' : 'neutral'}>
                {h.state === 'CURRENT' ? 'Current' : String(h.state || '—').toLowerCase()}
              </Badge>,
            ])}
          />
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Bulk: set prices for several products at once                      */
/* ------------------------------------------------------------------ */
function BulkPublishForm({ initialItems, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [items, setItems] = useState(initialItems) // [{ id, code, name, retail, dealer }]
  const [effectiveFrom, setEffectiveFrom] = useState(todayIso())
  const [note, setNote] = useState('')
  const [bulkRetail, setBulkRetail] = useState('')
  const [bulkDealer, setBulkDealer] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateItem(i, key, value) {
    setItems((cur) => cur.map((it, ii) => (ii === i ? { ...it, [key]: value } : it)))
  }

  function applyToAll() {
    setItems((cur) =>
      cur.map((it) => ({
        ...it,
        retail: bulkRetail !== '' ? bulkRetail : it.retail,
        dealer: bulkDealer !== '' ? bulkDealer : it.dealer,
      }))
    )
  }

  const missing = []
  if (items.length === 0) missing.push('At least one product')
  if (items.some((it) => !(Number(it.retail) > 0) || !(Number(it.dealer) > 0))) {
    missing.push('Retail and dealer price on every product')
  }
  if (!effectiveFrom) missing.push('Effective from date')
  const canSubmit = missing.length === 0 && !submitting
  const scheduled = effectiveFrom > todayIso()

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await inventoryApi.publishPriceList({
        effectiveFrom,
        note: note.trim(),
        entries: items.map((it) => ({
          stockItemId: it.id,
          retailPrice: Number(it.retail),
          dealerPrice: Number(it.dealer),
        })),
      })
      const below = res?.data?.belowCostCount || 0
      showToast(
        scheduled ? 'Price change scheduled' : 'Prices published',
        below > 0
          ? `${below} item${below === 1 ? ' is' : 's are'} priced below cost.`
          : `${items.length} product${items.length === 1 ? '' : 's'} updated${
              res?.data?.batchRef ? ` · batch ${res.data.batchRef}` : ''
            }.`
      )
      onDone(items.map((it) => it.id))
    } catch (e) {
      showToast('Could not publish prices', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Publishing prices…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title="Set prices"
        icon="tags"
        description="Set retail and dealer prices for the selected products in one batch. Choose today to apply them straight away, or a future date to schedule the change."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel={scheduled ? 'Schedule prices' : 'Publish prices'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Summary">
            <MetaRow label="Products" value={String(items.length)} mono />
            <MetaRow label="Effective from" value={effectiveFrom ? fmtDate(effectiveFrom) : '—'} />
            <MetaRow label="Applies" value={scheduled ? 'On the chosen date' : 'Immediately'} />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these to enable publish"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}

        <Panel title="Batch details">
          <FieldSet columns={2}>
            <Input
              label="Effective from *"
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(val(e))}
            />
            <Input
              label="Note"
              placeholder="e.g. Initial prices"
              value={note}
              onChange={(e) => setNote(val(e))}
            />
          </FieldSet>
        </Panel>

        <Panel title="Products">
          {items.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              <div style={{ width: 170 }}>
                <Input
                  label="Same retail price (₦)"
                  type="number"
                  placeholder="0.00"
                  value={bulkRetail}
                  onChange={(e) => setBulkRetail(val(e))}
                />
              </div>
              <div style={{ width: 170 }}>
                <Input
                  label="Same dealer price (₦)"
                  type="number"
                  placeholder="0.00"
                  value={bulkDealer}
                  onChange={(e) => setBulkDealer(val(e))}
                />
              </div>
              <Button
                variant="secondary"
                onClick={applyToAll}
                disabled={bulkRetail === '' && bulkDealer === ''}
              >
                Apply to all
              </Button>
            </div>
          )}
          <GridTable
            template="110px minmax(200px, 2fr) 170px 170px 100px"
            headers={[
              { label: 'Code', mono: true },
              { label: 'Product' },
              { label: 'Retail (₦)', align: 'right' },
              { label: 'Dealer (₦)', align: 'right' },
              { label: '' },
            ]}
            empty="No products selected."
            rows={items.map((it, i) => [
              it.code || '—',
              it.name,
              <Input
                key="r"
                type="number"
                placeholder="0.00"
                aria-label={`Retail price for ${it.name}`}
                value={it.retail}
                onChange={(e) => updateItem(i, 'retail', val(e))}
              />,
              <Input
                key="d"
                type="number"
                placeholder="0.00"
                aria-label={`Dealer price for ${it.name}`}
                value={it.dealer}
                onChange={(e) => updateItem(i, 'dealer', val(e))}
              />,
              <button
                key="x"
                type="button"
                style={smallButtonStyle}
                onClick={() => setItems((cur) => cur.filter((_, ii) => ii !== i))}
              >
                Remove
              </button>,
            ])}
          />
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function PriceList({ leaf, moduleLabel, parentLabel }) {
  const { categories, factories, units, showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list') // list | detail | bulk
  const [refreshKey, setRefreshKey] = useState(0)

  // locations: factories (from the store) + showrooms (loaded once)
  const [showrooms, setShowrooms] = useState([])
  const [locationKey, setLocationKey] = useState('') // 'factory:<id>' | 'showroom:<id>'

  // filters
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('') // '' | 'none' | 'priced'
  const [page, setPage] = useState(0)

  // stock items for the current page
  const [items, setItems] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loadingList, setLoadingList] = useState(false)

  // price status per stock item, filled in the background: { [id]: { status, current } }
  const [priceMap, setPriceMap] = useState({})
  const priceRef = useRef(priceMap)
  priceRef.current = priceMap

  // selection for bulk pricing: Map(id -> { id, code, name })
  const [selected, setSelected] = useState(() => new Map())

  const [activeItem, setActiveItem] = useState(null)
  const [bulkItems, setBulkItems] = useState([])

  const lookupsRef = useRef(null)
  lookupsRef.current = stockLookups(factories, categories, units)

  // ── locations ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    showroomApi
      .listShowrooms({ status: ['ACTIVE'] })
      .then((res) => !cancelled && setShowrooms(res?.data?.items || []))
      .catch((e) => {
        if (!cancelled) showToast('Could not load showrooms', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  const locationOptions = [
    ...factories.map((f) => ({ value: `factory:${f.id}`, label: `Factory · ${f.name}` })),
    ...showrooms.map((s) => ({ value: `showroom:${s.id}`, label: `Showroom · ${s.name}` })),
  ]

  // pick a default once the lists are in
  useEffect(() => {
    if (locationKey && locationOptions.some((o) => o.value === locationKey)) return
    setLocationKey(locationOptions[0]?.value || '')
  }, [factories, showrooms]) // eslint-disable-line react-hooks/exhaustive-deps

  const [locKind, locId] = locationKey ? locationKey.split(':') : ['', '']
  const locationName =
    locationOptions.find((o) => o.value === locationKey)?.label.replace(/^[^·]+· /, '') || ''

  // debounce search; a new search always starts at page 0
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(0)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  // ── 1) one request: the current page of stock items ─────
  // Factory  -> finished products. Showroom -> no item type, which returns
  // both direct-entry and outsourced items.
  useEffect(() => {
    if (!locId) {
      setItems([])
      return
    }
    let cancelled = false
    setLoadingList(true)
    inventoryApi
      .listStockItems(locId, locKind === 'factory' ? 'FINISHED_PRODUCT' : null, {
        page,
        size: PAGE_SIZE,
        q: debouncedSearch,
      })
      .then((res) => {
        if (cancelled) return
        const d = res?.data || {}
        setItems(d.items || [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load stock items', e.message, true)
      })
      .finally(() => !cancelled && setLoadingList(false))
    return () => {
      cancelled = true
    }
  }, [locId, locKind, page, debouncedSearch, refreshKey, showToast])

  const pageRows = items
    .map((it) => {
      const p = inventoryApi.toStoreProduct(it, lookupsRef.current)
      return {
        id: it.id,
        code: p.code || it.code || '—',
        name: p.name || it.name || '—',
        category: p.category || '',
        categoryId: p.categoryId || '',
        unit: p.unit || '',
        status: p.status || 'Active',
        locationName,
      }
    })
    .filter((r) => r.id)

  // ── 2) in the background: price status for this page's items ──
  // Only items we haven't checked yet are looked up (results are cached),
  // a few at a time, and abandoned if the page changes.
  const pageIdsKey = pageRows.map((r) => r.id).join(',')
  useEffect(() => {
    const ids = pageRows
      .map((r) => r.id)
      .filter((id) => {
        const s = priceRef.current[id]
        return !s || s.status === 'error'
      })
    if (ids.length === 0) return

    let cancelled = false
    let next = 0

    async function worker() {
      while (!cancelled && next < ids.length) {
        const id = ids[next++]
        let state
        try {
          const res = await inventoryApi.listPriceListProductHistory({
            stockItemId: id,
            page: 0,
            size: 5,
          })
          state = stateFromHistory(res?.data?.items || [])
        } catch {
          state = { status: 'error', current: null }
        }
        if (!cancelled) setPriceMap((m) => ({ ...m, [id]: state }))
      }
    }

    Promise.all(
      Array.from({ length: Math.min(PRICE_CHECK_CONCURRENCY, ids.length) }, worker)
    )

    return () => {
      cancelled = true
    }
  }, [pageIdsKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const setPriceState = useCallback((id, state) => {
    setPriceMap((m) => ({ ...m, [id]: state }))
  }, [])

  // ── page-local filters ──────────────────────────────────
  const visibleRows = pageRows.filter((r) => {
    if (categoryFilter && r.categoryId !== categoryFilter) return false
    const s = priceMap[r.id]?.status
    if (priceFilter === 'none') return s === 'none'
    if (priceFilter === 'priced') return s === 'priced' || s === 'scheduled'
    return true
  })

  const unpricedOnPage = pageRows.filter((r) => priceMap[r.id]?.status === 'none')
  const checkingCount = pageRows.filter((r) => !priceMap[r.id]).length
  const pricedCount = pageRows.filter(
    (r) => priceMap[r.id]?.status === 'priced' || priceMap[r.id]?.status === 'scheduled'
  ).length

  function toggleSelected(r) {
    setSelected((cur) => {
      const next = new Map(cur)
      if (next.has(r.id)) next.delete(r.id)
      else next.set(r.id, { id: r.id, code: r.code, name: r.name })
      return next
    })
  }

  function selectUnpricedOnPage() {
    setSelected((cur) => {
      const next = new Map(cur)
      unpricedOnPage.forEach((r) => next.set(r.id, { id: r.id, code: r.code, name: r.name }))
      return next
    })
  }

  function startBulk() {
    const list =
      selected.size > 0
        ? Array.from(selected.values())
        : unpricedOnPage.map((r) => ({ id: r.id, code: r.code, name: r.name }))
    if (list.length === 0) {
      showToast(
        'Nothing to price',
        checkingCount > 0
          ? 'Still checking which items have prices — try again in a moment.'
          : 'Tick some products first, or open one to price it.',
        true
      )
      return
    }
    setBulkItems(list.map((i) => ({ ...i, retail: '', dealer: '' })))
    setMode('bulk')
  }

  function changeLocation(key) {
    setLocationKey(key)
    setPage(0)
    setSelected(new Map())
  }

  // ── sub-views ───────────────────────────────────────────
  if (mode === 'detail' && activeItem) {
    return (
      <PriceDetail
        item={activeItem}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onPriceState={setPriceState}
      />
    )
  }

  if (mode === 'bulk') {
    return (
      <BulkPublishForm
        initialItems={bulkItems}
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onDone={(ids) => {
          // forget these items' status so the background check refreshes them
          setPriceMap((m) => {
            const next = { ...m }
            ids.forEach((id) => delete next[id])
            return next
          })
          setSelected(new Map())
          setMode('list')
          setRefreshKey((k) => k + 1)
        }}
      />
    )
  }

  // ── columns ─────────────────────────────────────────────
  const columns = [
    {
      key: 'pick',
      label: '',
      width: 50,
      render: (r) => (
        <input
          type="checkbox"
          checked={selected.has(r.id)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => toggleSelected(r)}
          aria-label={`Select ${r.name}`}
          style={{ width: 16, height: 16, cursor: 'pointer' }}
        />
      ),
    },
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Name', width: 240 },
    { key: 'category', label: 'Category', width: 150, render: (r) => r.category || '—' },
    { key: 'unit', label: 'Unit', width: 90, render: (r) => r.unit || '—' },
    {
      key: 'price',
      label: 'Price list',
      width: 140,
      render: (r) => {
        const s = priceMap[r.id]?.status
        if (!s) return <Badge tone="neutral">Checking…</Badge>
        if (s === 'priced') return <Badge tone="success">Priced</Badge>
        if (s === 'scheduled') return <Badge tone="info">Scheduled</Badge>
        if (s === 'none') return <Badge tone="warning">No price list</Badge>
        return <Badge tone="danger">Check failed</Badge>
      },
    },
    {
      key: 'retail',
      label: 'Retail',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => {
        const c = priceMap[r.id]?.current
        return c ? money(c.retailPrice || 0) : '—'
      },
    },
    {
      key: 'dealer',
      label: 'Dealer',
      width: 140,
      align: 'right',
      mono: true,
      render: (r) => {
        const c = priceMap[r.id]?.current
        return c ? money(c.dealerPrice || 0) : '—'
      },
    },
    {
      key: 'effective',
      label: 'Effective from',
      width: 130,
      render: (r) => {
        const c = priceMap[r.id]?.current
        return c?.effectiveFrom ? fmtDate(c.effectiveFrom) : '—'
      },
    },
  ]

  const noLocations = locationOptions.length === 0

  return (
    <>
      {loadingList && <Loader overlay label="Loading stock items…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Price List'}
        icon={leaf?.icon}
        description="Manage prices for the stock items at a factory or showroom. Items are checked against the price list in the background so you can see at a glance which ones still need a price."
        createLabel={
          selected.size > 0
            ? `Set prices for ${selected.size} selected`
            : 'Set prices for unpriced on page'
        }
        onCreate={startBulk}
        searchPlaceholder="Search products by name or code…"
        search={search}
        onSearch={setSearch}
        filters={
          <>
            <Select
              options={locationOptions}
              value={locationKey}
              onChange={(e) => changeLocation(val(e))}
              placeholder={noLocations ? 'No factories or showrooms' : 'Select location…'}
              disabled={noLocations}
              style={{ width: 260 }}
            />
            <Select
              options={[
                { label: 'All categories', value: '' },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(val(e))}
              style={{ width: 180 }}
            />
            <Select
              options={[
                { label: 'All items on page', value: '' },
                { label: 'Without a price list', value: 'none' },
                { label: 'With a price list', value: 'priced' },
              ]}
              value={priceFilter}
              onChange={(e) => setPriceFilter(val(e))}
              style={{ width: 200 }}
            />
            <Button
              variant="secondary"
              iconLeft="check-check"
              onClick={selectUnpricedOnPage}
              disabled={unpricedOnPage.length === 0}
            >
              Select unpriced
            </Button>
          </>
        }
        stats={[
          { label: 'Items at this location', value: String(pageInfo.totalItems) },
          { label: 'Priced (this page)', value: String(pricedCount) },
          {
            label: 'No price list (this page)',
            value: String(unpricedOnPage.length),
            tone: unpricedOnPage.length ? 'negative' : undefined,
          },
          { label: 'Still checking', value: String(checkingCount) },
        ]}
        columns={columns}
        rows={visibleRows}
        pagination={{
          page,
          pageCount: pageInfo.totalPages,
          pageSize: PAGE_SIZE,
          total: pageInfo.totalItems,
          onPage: setPage,
        }}
        onRowClick={(row) => {
          setActiveItem(row)
          setMode('detail')
        }}
        emptyTitle={noLocations ? 'No locations yet' : 'No stock items found'}
        emptyDescription={
          noLocations
            ? 'Create a factory or showroom first.'
            : 'Try another location, or adjust the search and filters.'
        }
        footnote="Factories list finished products; showrooms list every item they carry. Price status is checked page by page. The price filter only narrows the page you are on. Click a row to see its history, set a price or schedule a change."
      />
    </>
  )
}