import { useEffect, useRef, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import AccountApi from '../../api/AccountApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import Loader from '../../ds/components/core/Loader.jsx'
import FactoryApi from '../../api/FactoryApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const accountApi = new AccountApi()
const inventoryApi = new InventoryApi()
const factoryApi = new FactoryApi()
const showroomApi = new ShowroomApi()

// This register only deals with outsourced products, held at showrooms.
const ITEM_TYPE = 'OUTSOURCED'

// The lists toStoreProduct uses to turn ids into names. The location is a showroom here.
const stockLookups = (showrooms, categories, units) => ({
  factories: showrooms.map((s) => ({ id: s.value, name: s.label })),
  categories: categoryOptions(categories),
  units: unitOptions(units),
})

const columns = [
  { key: 'code', label: 'Code', width: 100, mono: true },
  { key: 'name', label: 'Name', width: 220 },
  { key: 'category', label: 'Category', width: 140 },
  { key: 'showroom', label: 'Showroom', width: 170 },
  { key: 'unit', label: 'Unit', width: 110 },
  { key: 'reorder', label: 'Re-order level', width: 130, align: 'right', mono: true },
  { key: 'barcode', label: 'Barcode', width: 150, mono: true },
  { key: 'quantityOnHand', label: 'Quantity on Hand', width: 130, align: 'right', mono: true },
  {
    key: 'status', label: 'Status', width: 110,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

function RegisterForm({ onBack, crumbs, onDone, showrooms, showroomsLoading, onGoToShowrooms, onGoToCategories }) {
  const { units, categories, addUnit, showToast } = useStore()
  const unitList = unitOptions(units)
  const categoryList = categoryOptions(categories)
  // No unit of their own yet — the picker is showing the fallback set.
  const usingDefaultUnits = units.length === 0
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [showroomId, setShowroomId] = useState('')
  const [unit, setUnit] = useState('')
  const [reorder, setReorder] = useState('')
  const [leadTime, setLeadTime] = useState('')
  const [packSize, setPackSize] = useState('')
  const [sellingPrice, setSellingPrice] = useState('') // sent as markupCost
  const [landingCost, setLandingCost] = useState('')
  const [barcode, setBarcode] = useState('')
  const [vat, setVat] = useState('')
  const [isic, setIsic] = useState('')
  const [hsn, setHsn] = useState('')

  const [notes, setNotes] = useState('')
  const [active, setActive] = useState(true)
  const [trackCost, setTrackCost] = useState(false)
  const [errors, setErrors] = useState({})
  const [vatCategories, setVatCategories] = useState([])
  const [isicSections, setIsicSections] = useState([])
  const [hsnSections, setHsnSections] = useState([])
  const [unitDialog, setUnitDialog] = useState(false)
  const [newUnitName, setNewUnitName] = useState('')
  const [newUnitSymbol, setNewUnitSymbol] = useState('')

  const closeUnitDialog = () => { setUnitDialog(false); setNewUnitName(''); setNewUnitSymbol('') }

  const confirmNewUnit = async () => {
    const clean = newUnitName.trim()
    if (!clean) return
    if (units.some((u) => u.name.toLowerCase() === clean.toLowerCase())) {
      showToast('That unit is already defined', clean, true)
      return
    }
    setLoading(true)
    try {
      const createdUnit = await factoryApi.createUnit({ unitCode: newUnitSymbol, unitName: clean, symbol: newUnitSymbol })
      addUnit({ name: clean, symbol: newUnitSymbol, id: createdUnit.data.id })
      showToast(`Unit added — ${clean}${newUnitSymbol.trim() ? ` (${newUnitSymbol.trim()})` : ''}`, 'Selectable wherever a quantity is entered')
      setUnit(createdUnit.data.id)
    } catch (e) {
      showToast(`Unit ${clean}${newUnitSymbol.trim() ? ` (${newUnitSymbol.trim()})` : ''} failed to add`, e.message, true)
    } finally {
      setLoading(false)
    }
    closeUnitDialog()
  }

  useEffect(() => {
    accountApi.getVatCategories().then(setVatCategories)
    accountApi.getIsicSections().then(setIsicSections)
    accountApi.getHsnSections().then(setHsnSections)
  }, [])

  const submit = async () => {
    const e = {}
    if (!code.trim()) e.code = 'Product code is required'
    if (!name.trim()) e.name = 'Product name is required'
    if (!showroomId) e.showroom = 'Select the showroom this product belongs to'
    if (!unit) e.unit = 'Unit of measure is required'
    setErrors(e)
    if (Object.keys(e).length) return

    const showroom = showrooms.find((s) => s.value === showroomId)
    const resultedBarcode = barcode.trim() || `615110${String(Math.floor(Math.random() * 10_000_000)).padStart(7, '0')}`

    setLoading(true)
    try {
      const result = await inventoryApi.createInventory({
        locationId: showroomId, // the showroom
        itemType: ITEM_TYPE,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        categoryId: category,
        brand: 'brand',
        unitOfMeasureId: unit,
        reorderLevel: Number(reorder) || 0,
        barcode: resultedBarcode,
        landingCost: Number(landingCost) || 0,
        markupCost: Number(sellingPrice) || 0,
        vatCategoryId: vat,
        hsnSectionId: hsn,
        isicSectionId: isic,
        status: active ? 'ACTIVE' : 'INACTIVE',
      })

      const created = result.data
      showToast(`Outsourced product registered — ${created.code}`, `${created.name} · ${showroom?.label || ''}`)
      onDone?.() // the list refetches, so the new product shows up there
    } catch (err) {
      showToast('Product creation failed', err.message, true)
    } finally {
      setLoading(false) // runs on success AND on failure
    }
  }

  return (
    <FormShell
      crumbs={crumbs}
      title="Register outsourced product"
      icon="package-plus"
      description="Outsourced products are bought-in goods the company has formally registered and sells through a showroom. Each product is assigned to the showroom that holds it."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel="Register product"
      loading={loading}
      onSubmit={submit}
      onCancel={onBack}
      note="Codes must be unique. Once registered, the product is immediately selectable across every dependent module."
      aside={
        <>
          <Panel title="Availability">
            <MetaRow label="Outsource Stock" value="Immediate" />
            <MetaRow label="Stock Transfer" value="Immediate" />
            <MetaRow label="Quantity Adjustment" value="Immediate" />
            <MetaRow label="POS" value="After price is set" />
          </Panel>
          <Panel title="Label preview">
            <div style={{ display: 'grid', placeItems: 'center', gap: 10, padding: '18px 12px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}>
              <Icon name="qr-code" size={44} color="var(--text-subtle)" />
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', textAlign: 'center', lineHeight: 1.5 }}>
                A barcode is generated on registration and can be printed as a product label.
              </div>
              <Button variant="secondary" size="sm" iconLeft="printer" disabled>Print label</Button>
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Identity" description="How this product is named and coded across the system.">
        <FieldSet columns={2}>
          <Input
            label="Product code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. OS-520"
            hint="Must be unique across the register."
            error={errors.code}
          />
          <Input
            label="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chivita 100% Orange 1L"
            error={errors.name}
          />
          <div>
            <Select label="Category" options={categoryList} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Select category…" />
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>
              {categories.length ? 'The type/group this product is filed under.' : 'Showing the default set.'}{' '}
              <span onClick={onGoToCategories} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>
                {categories.length ? 'Manage categories' : 'Define your own'}
              </span>
            </div>
          </div>
          <div>
            <Select
              label="Assigned showroom"
              options={showrooms}
              value={showroomId}
              onChange={(e) => setShowroomId(e.target.value)}
              placeholder={showroomsLoading ? 'Loading…' : showrooms.length ? 'Select showroom…' : 'No showrooms registered'}
              disabled={!showrooms.length}
            />
            <div style={{ font: 'var(--type-caption)', color: errors.showroom ? 'var(--text-danger)' : 'var(--text-muted)', marginTop: 5 }}>
              {showrooms.length || showroomsLoading
                ? (errors.showroom || 'The showroom that holds this product.')
                : (
                  <>
                    Register a showroom first —{' '}
                    <span onClick={onGoToShowrooms} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Showroom Register</span>.
                  </>
                )}
            </div>
          </div>
        </FieldSet>
      </Panel>

      <Panel title="Measurement & stock control" description="Units and thresholds that drive stock reports and re-order alerts.">
        <FieldSet columns={3}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'end' }}>
              <Select label="Unit of measure" options={unitList} value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Select unit…" />
              <Button variant="secondary" iconLeft="plus" onClick={() => setUnitDialog(true)}>Unit</Button>
            </div>
            <div style={{ font: 'var(--type-caption)', color: errors.unit ? 'var(--text-danger)' : 'var(--text-muted)', marginTop: 5 }}>
              {errors.unit || (usingDefaultUnits
                ? <>Showing the default set — <span onClick={() => setUnitDialog(true)} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>define your own unit</span> if none of these fit.</>
                : <>Measured in. <span onClick={() => setUnitDialog(true)} style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}>Add a unit</span> if the one you need is missing.</>)}
            </div>
          </div>
          <Input label="Re-order level" type="number" value={reorder} onChange={(e) => setReorder(e.target.value)} placeholder="0" hint="Triggers the Re-Order Report." />
          <Input label="Lead time (days)" type="number" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} placeholder="0" />
          <Input label="Pack size" value={packSize} onChange={(e) => setPackSize(e.target.value)} placeholder="e.g. 12 × 50cl" />
          <Input label="Standard selling price/Mark up price (₦)" type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="0.00" />
          <Input label="Landing cost (₦)" type="number" value={landingCost} onChange={(e) => setLandingCost(e.target.value)} placeholder="0.00" />
        </FieldSet>
      </Panel>

      <Panel title="Identification & tax" description="Scanning and VAT treatment for this product.">
        <FieldSet columns={2}>
          <Input label="Barcode / QR value" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Auto-generate on save" iconLeft="qr-code" />
          <Select label="VAT treatment" value={vat} onChange={(e) => setVat(e.target.value)} options={vatCategories} placeholder="Select treatment…" />
        </FieldSet>

        <FieldSet columns={2} style={{ marginTop: 30 }}>
          <Select label="HSN code" value={hsn} onChange={(e) => setHsn(e.target.value)} options={hsnSections} placeholder="Select code…" />
          <Select label="ISIC section" value={isic} onChange={(e) => setIsic(e.target.value)} options={isicSections} placeholder="Select section…" />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={active} onChange={setActive} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive products stay in reports but cannot be selected in new transactions.</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Switch checked={trackCost} onChange={setTrackCost} />
            <div>
              <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Track landing cost</div>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Landing cost remains visible only to Management and Administration.</div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Description">
        <label style={{ display: 'block' }}>
          <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Specification, supplier details, or handling instructions."
            style={{
              width: '100%', padding: '10px 12px', resize: 'vertical',
              background: 'var(--surface-card)', border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
              font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
            }}
          />
        </label>
      </Panel>

      <Dialog
        open={unitDialog}
        title="Add a unit of measure"
        onClose={closeUnitDialog}
        footer={
          <>
            <Button variant="secondary" onClick={closeUnitDialog}>Cancel</Button>
            <Button iconLeft="check" onClick={confirmNewUnit}>Add unit</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Unit name"
            autoFocus
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
            placeholder="e.g. Kilograms"
            onKeyDown={(e) => e.key === 'Enter' && confirmNewUnit()}
          />
          <Input
            label="Symbol"
            hint="Optional — what prints on documents."
            value={newUnitSymbol}
            onChange={(e) => setNewUnitSymbol(e.target.value)}
            placeholder="e.g. kg"
            onKeyDown={(e) => e.key === 'Enter' && confirmNewUnit()}
          />
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            It is added to the company's unit register and selected here straight away. Manage the full list under
            Factory › Setup › Units of Measure.
          </div>
        </div>
      </Dialog>
    </FormShell>
  )
}

const PAGE_SIZE = 20

export default function OutsourceStockRegister({ leaf, moduleLabel, parentLabel, onNavigate }) {
  const { categories, units, showToast } = useStore()
  const [mode, setMode] = useState('list')
  const [loadingItems, setLoadingItems] = useState(false)
  const [showroomFilter, setShowroomFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('') // '' = all categories

  // showrooms are the locations for this register
  const [showrooms, setShowrooms] = useState([])
  const [showroomsLoading, setShowroomsLoading] = useState(true)

  // pagination + server search
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [items, setItems] = useState([]) // raw API items for the current page
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })

  // One request is one location, so "All showrooms" can't be paginated.
  // Fall back to the first showroom.
  const locationId = showroomFilter || showrooms[0]?.value || ''

  // Lookups are read through a ref, so a change to the unit or category lists
  // doesn't trigger a new request.
  const lookupsRef = useRef(null)
  lookupsRef.current = stockLookups(showrooms, categories, units)

  // Load the showrooms once.
  useEffect(() => {
    let cancelled = false
    setShowroomsLoading(true)
    showroomApi
      .lookupPickerWithAreas({})
      .then((res) => {
        if (cancelled) return
        setShowrooms((res.data || []).map((s) => ({ value: s.id, label: s.label || s.name || s.code })))
      })
      .catch((e) => { if (!cancelled) showToast('Could not load showrooms', e.message, true) })
      .finally(() => { if (!cancelled) setShowroomsLoading(false) })
    return () => { cancelled = true }
  }, [showToast])

  // Wait for the user to stop typing; a new search always starts at page 0.
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search.trim()); setPage(0) }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Ask the server for ONE page of outsourced products. Runs again when the
  // showroom, page, search text or refreshKey changes.
  // (This sits above the early return below so the hook order never changes.)
  useEffect(() => {
    if (!locationId) {
      setItems([])
      setLoadingItems(false)
      return
    }

    let cancelled = false
    setLoadingItems(true)

    inventoryApi
      .listStockItems(locationId, ITEM_TYPE, { page, size: PAGE_SIZE, q: debouncedSearch })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((error) => {
        // Keep whatever is already showing if the request failed.
        if (!cancelled) showToast('Could not load outsourced products', error.message, true)
      })
      .finally(() => { if (!cancelled) setLoadingItems(false) })

    return () => { cancelled = true }
  }, [locationId, page, debouncedSearch, refreshKey, showToast])

  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
  const goToShowrooms = () => onNavigate?.({ id: 'p.showroomreg', view: 'p.showroomreg', label: 'Showroom Register' })
  const goToCategories = () => onNavigate?.({ id: 'f.categories', view: 'categories', label: 'Categories' })
  if (mode === 'create') {
    return (
      <RegisterForm
        crumbs={crumbs}
        showrooms={showrooms}
        showroomsLoading={showroomsLoading}
        onBack={() => setMode('list')}
        onDone={() => { setMode('list'); setRefreshKey((k) => k + 1) }} // refetch so the new product shows
        onGoToShowrooms={goToShowrooms}
        onGoToCategories={goToCategories}
      />
    )
  }

  // The endpoint can't filter by category, so that one stays local
  // (it only narrows the page that is currently loaded).
  const rows = items
    .map((item) => inventoryApi.toStoreProduct(item, lookupsRef.current))
    .filter((p) => !categoryFilter || p.categoryId === categoryFilter)
    .map((p) => ({
      code: p.code || '—',
      name: p.name,
      category: p.category || '—',
      showroom: p.factoryName || '—', // toStoreProduct puts the location name here
      unit: p.unit || '—',
      reorder: p.reorder || '—',
      barcode: p.barcode || '—',
      status: p.status || 'Active',
      quantityOnHand: p.quantity || '—',
    }))

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Outsourced Products'}
      icon={leaf?.icon}
      description="Outsourced products must be registered before they can be received, sold or transferred. Every showroom carries its own range of outsourced products."
      createLabel="Register outsourced product"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search outsourced products by name…"
      search={search}
      onSearch={setSearch}
      filters={
        <>
          <Select
            options={showrooms}
            value={locationId}
            onChange={(e) => { setShowroomFilter(e.target.value); setPage(0) }}
            placeholder={showroomsLoading ? 'Loading…' : 'Select showroom…'}
            style={{ width: 200 }}
          />
          <Select
            options={[{ label: 'All categories', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.id }))]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="All categories"
            style={{ width: 170 }}
          />
        </>
      }
      stats={[
        { label: 'Outsourced products registered', value: String(pageInfo.totalItems) },
        { label: 'Active', value: String(rows.filter((r) => r.status === 'Active').length) },
        { label: 'Showrooms covered', value: String(new Set(rows.map((r) => r.showroom)).size) },
        { label: 'Barcoded', value: `${rows.filter((r) => r.barcode !== '—').length}/${rows.length}` },
      ]}
      columns={columns}
      rows={rows}
      pagination={{
        page,
        pageCount: pageInfo.totalPages,
        pageSize: PAGE_SIZE,
        total: pageInfo.totalItems,
        onPage: setPage,
      }}
      onRowClick={() => {}}
      emptyTitle="No outsourced products registered"
      emptyDescription="Register an outsourced product to make it selectable in Outsource Stock, Transfers and sales."
      footnote="A record cannot be created with missing required fields or a code that duplicates an existing entry."
    >
      {loadingItems && <Loader label="Loading outsourced products…" />}
    </RegisterShell>
  )
}