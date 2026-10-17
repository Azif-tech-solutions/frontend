import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { unitOptions } from '../unitOptions.js'
import { useStore } from '../store.jsx'

import InventoryApi from '../../api/InventoryApi.ts'
import FactoryApi from '../../api/FactoryApi.ts'

const api = new FactoryApi()
const inventoryApi = new InventoryApi()

const PAGE_SIZE = 20

const SOURCING_LABELS = {
  IN_HOUSE_PRODUCTION: 'In-House Production',
  DIRECT_IMPORTATION: 'Direct Importation',
}
const SOURCING_TYPES = Object.entries(SOURCING_LABELS).map(([value, label]) => ({ value, label }))

const columns = [
  { key: 'code', label: 'Code', width: 100, mono: true },
  { key: 'name', label: 'Recipe name', width: 260 },
  { key: 'unit', label: 'Unit', width: 110 },
  {
    key: 'sourcing', label: 'Sourcing', width: 180,
    render: (r) => <Badge tone={r.sourcing === 'In-House Production' ? 'brand' : 'neutral'}>{r.sourcing}</Badge>,
  },
  { key: 'yield', label: 'Yield / batch', width: 130, align: 'right', mono: true },
  { key: 'ingredients', label: 'Ingredients', width: 110, align: 'right', mono: true },
  { key: 'factory', label: 'Factory', width: 150 },
  {
    key: 'status', label: 'Status', width: 110,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

// API recipe -> the row the register table shows.
const toRow = (r) => ({
  id: r.id,
  code: r.code,
  name: r.name,
  unit: r.yieldUnit?.name ?? '—',
  sourcing: SOURCING_LABELS[r.sourcing] ?? r.sourcing ?? '—',
  yield: r.yieldQty == null ? '—' : String(r.yieldQty),
  ingredients: r.ingredients?.length ?? 0,
  factory: r.location?.name ?? '—',
  // "ACTIVE" -> "Active". The badge checks for "Active".
  status: r.status ? r.status.charAt(0) + r.status.slice(1).toLowerCase() : 'Active',
})

// Works whether the ds components call onChange with an event or with the raw value.
const val = (e) => (e && e.target ? e.target.value : e)

const emptyIngredient = () => ({ rawMaterialStockItemId: '', quantity: '', unitId: '' })

const emptyForm = {
  code: '',
  name: '',
  description: '',
  sourcing: '',
  factoryId: '',
  unitId: '',
  yieldQty: '',
  shelfLife: '',
  reorder: '',
}

function RecipeForm({ crumbs, onBack, onCreated }) {
  const { units, factories: storeFactories, showToast } = useStore()
  const [form, setForm] = useState(emptyForm)
  const [ingredients, setIngredients] = useState([emptyIngredient()])
  const [rawMaterials, setRawMaterials] = useState([])
  const [loadingRM, setLoadingRM] = useState(false)
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const unitOpts = unitOptions(units)
  // The factory id has to be the real backend location id, so use the store's factories.
  const factoryOptions = useMemo(
    () => (storeFactories || []).map((f) => ({ value: f.id, label: f.name })),
    [storeFactories]
  )
  const rawMaterialOptions = useMemo(
    () => rawMaterials.map((i) => ({ value: i.id, label: `${i.code} — ${i.name}` })),
    [rawMaterials]
  )

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: val(e) }))

  // Changing the factory changes which raw materials are available, so clear picked ingredients.
  const setFactory = (e) => {
    setForm((f) => ({ ...f, factoryId: val(e) }))
    setIngredients([emptyIngredient()])
  }

  // Load the raw materials held at the selected factory.
  useEffect(() => {
    if (!form.factoryId) {
      setRawMaterials([])
      return
    }
    let cancelled = false
    setLoadingRM(true)
    inventoryApi
      .listStockItems(form.factoryId, 'RAW_MATERIAL', { size: 200 })
      .then((res) => {
        if (cancelled) return
        setRawMaterials(res?.data?.items ?? res?.items ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Could not load raw materials for this factory.')
      })
      .finally(() => {
        if (!cancelled) setLoadingRM(false)
      })
    return () => {
      cancelled = true
    }
  }, [form.factoryId])

  const updateIngredient = (index, patch) =>
    setIngredients((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))

  const pickRawMaterial = (index, e) => {
    const id = val(e)
    const item = rawMaterials.find((i) => i.id === id)
    setIngredients((rows) =>
      rows.map((r, i) =>
        i === index
          ? { ...r, rawMaterialStockItemId: id, unitId: r.unitId || item?.unitOfMeasure?.id || '' }
          : r
      )
    )
  }

  const addIngredient = () => setIngredients((rows) => [...rows, emptyIngredient()])
  const removeIngredient = (index) =>
    setIngredients((rows) => (rows.length === 1 ? rows : rows.filter((_, i) => i !== index)))

  function validate() {
    if (!form.code.trim()) return 'Recipe code is required.'
    if (!form.name.trim()) return 'Recipe name is required.'
    if (!form.sourcing) return 'Select a sourcing method.'
    if (!form.factoryId) return 'Select the producing factory.'
    if (!form.unitId) return 'Select a unit of measure.'
    if (!(Number(form.yieldQty) > 0)) return 'Standard yield per batch must be greater than 0.'
    if (ingredients.length === 0) return 'Add at least one ingredient.'
    for (const [i, ing] of ingredients.entries()) {
      if (!ing.rawMaterialStockItemId) return `Ingredient ${i + 1}: select a raw material.`
      if (!(Number(ing.quantity) > 0)) return `Ingredient ${i + 1}: quantity must be greater than 0.`
      if (!ing.unitId) return `Ingredient ${i + 1}: select a unit.`
    }
    return ''
  }

  async function handleSubmit(e) {
    e?.preventDefault?.()
    if (saving) return
    setError('')

    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }

    const payload = {
      locationId: form.factoryId,
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      description: form.description.trim(),
      sourcing: form.sourcing,
      yieldQty: Number(form.yieldQty),
      yieldUnitId: form.unitId,
      shelfLifeDays: Number(form.shelfLife) || 0,
      reorderLevel: Number(form.reorder) || 0,
      ingredients: ingredients.map((ing) => ({
        rawMaterialStockItemId: ing.rawMaterialStockItemId,
        quantity: Number(ing.quantity),
        unitId: ing.unitId,
      })),
    }

    setSaving(true)
    try {
      const { data: recipe } = await api.createRecipe(payload)
      showToast(`Recipe registered — ${recipe.code}`, `${recipe.name} · ${recipe.location?.name ?? ''}`)
      // The register refetches its own page, so nothing needs to be passed back.
      onCreated()
    } catch (err) {
      setError(err?.message || 'Could not register the recipe. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <FormShell
      crumbs={crumbs}
      title="Register in-house recipe"
      icon="book-open"
      description="Record the name and description of a recipe produced internally. Recipes must be registered here before they can be viewed, selected or used in the Production Cost Calculator."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
      submitLabel={saving ? 'Registering…' : 'Register recipe'}
      onSubmit={handleSubmit}
      onCancel={onBack}
      note="Codes must be unique. Once registered, the recipe is immediately selectable in In-House Production and the Production Cost Calculator."
      aside={
        <Panel title="Availability once registered">
          <MetaRow label="In-House Production" value="Immediate" />
          <MetaRow label="Production Cost Calculator" value="Immediate" />
          <MetaRow label="Total Cost for Selected Recipes" value="Immediate" />
          <MetaRow label="Stock Refill — Raw Material" value="Immediate" />
        </Panel>
      }
    >
      {error && (
        <div
          role="alert"
          style={{
            padding: '10px 12px', marginBottom: 16,
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-control)',
            background: 'var(--surface-card)', color: 'var(--text-strong)',
            font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
          }}
        >
          {error}
        </div>
      )}

      <Panel title="Identity" description="How this recipe is named and coded across the system.">
        <FieldSet columns={2}>
          <Input label="Recipe code" placeholder="e.g. RC-06" hint="Must be unique across the register." value={form.code} onChange={setField('code')} />
          <Input label="Recipe name" placeholder="e.g. Vanilla Extract Base" value={form.name} onChange={setField('name')} />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
            <textarea
              rows={3}
              placeholder="What this recipe is and which products it feeds into."
              value={form.description}
              onChange={setField('description')}
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </div>
      </Panel>

      <Panel title="Sourcing & output" description="Raw materials and recipes are sourced either by direct importation or in-house production.">
        <FieldSet columns={3}>
          <Select label="Sourcing method" options={SOURCING_TYPES} placeholder="Select method…" value={form.sourcing} onChange={setField('sourcing')} />
          <Select label="Producing factory" options={factoryOptions} placeholder="Select factory…" value={form.factoryId} onChange={setFactory} />
          <Select label="Unit of measure" options={unitOpts} placeholder="Select unit…" value={form.unitId} onChange={setField('unitId')} />
          <Input label="Standard yield per batch" type="number" placeholder="0" hint="Expected output from one production cycle." value={form.yieldQty} onChange={setField('yieldQty')} />
          <Input label="Shelf life (days)" type="number" placeholder="0" value={form.shelfLife} onChange={setField('shelfLife')} />
          <Input label="Re-order level" type="number" placeholder="0" value={form.reorder} onChange={setField('reorder')} />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={active} onChange={setActive} />
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>Inactive recipes stay in reports but cannot be selected in new production cycles.</div>
          </div>
        </div>
      </Panel>

      <Panel
        title="Ingredients"
        description={
          form.factoryId
            ? 'Raw materials consumed to produce one batch of this recipe.'
            : 'Select the producing factory first to load its raw materials.'
        }
      >
        <div style={{ display: 'grid', gap: 12 }}>
          {ingredients.map((ing, index) => (
            <div
              key={index}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}
            >
              <Select
                label={index === 0 ? 'Raw material' : undefined}
                options={rawMaterialOptions}
                placeholder={loadingRM ? 'Loading…' : 'Select raw material…'}
                value={ing.rawMaterialStockItemId}
                onChange={(e) => pickRawMaterial(index, e)}
              />
              <Input
                label={index === 0 ? 'Quantity' : undefined}
                type="number"
                placeholder="0"
                value={ing.quantity}
                onChange={(e) => updateIngredient(index, { quantity: val(e) })}
              />
              <Select
                label={index === 0 ? 'Unit' : undefined}
                options={unitOpts}
                placeholder="Unit…"
                value={ing.unitId}
                onChange={(e) => updateIngredient(index, { unitId: val(e) })}
              />
              <Button
                variant="ghost"
                iconLeft="trash-2"
                onClick={() => removeIngredient(index)}
                disabled={ingredients.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>
          <Button variant="ghost" iconLeft="plus" onClick={addIngredient} disabled={!form.factoryId}>
            Add ingredient
          </Button>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function RecipesRegister({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()
  const [mode, setMode] = useState('list')
  const [loading, setLoading] = useState(false)

  // pagination + filters
  const [page, setPage] = useState(0)
  const [factoryFilter, setFactoryFilter] = useState('') // '' = all factories
  const [sourcingFilter, setSourcingFilter] = useState('') // '' = all sourcing
  const [search, setSearch] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [items, setItems] = useState([]) // raw API recipes for the current page
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })

  // Read showToast through a ref so a new function identity never re-triggers the fetch.
  const toastRef = useRef(showToast)
  toastRef.current = showToast

  // Ask the server for ONE page. Runs again when the factory, page or refreshKey changes.
  // (This sits above the early return below so the hook order never changes.)
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    api
      .listRecipes({ locationId: factoryFilter || undefined, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((err) => {
        // Keep whatever is already showing if the request failed.
        if (!cancelled) toastRef.current('Could not load recipes', err.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [factoryFilter, page, refreshKey])

  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') {
    return (
      <RecipeForm
        crumbs={crumbs}
        onBack={() => setMode('list')}
        onCreated={() => {
          setPage(0)
          setRefreshKey((k) => k + 1) // refetch so the new recipe shows
          setMode('list')
        }}
      />
    )
  }

  // The endpoint only filters by factory and status, so sourcing and search
  // narrow the page that is currently loaded.
  const q = search.trim().toLowerCase()
  const rows = items
    .map(toRow)
    .filter((r) => !sourcingFilter || r.sourcing === SOURCING_LABELS[sourcingFilter])
    .filter((r) => !q || [r.code, r.name, r.factory].some((v) => String(v).toLowerCase().includes(q)))

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'In-House Recipes — Register'}
      icon={leaf?.icon}
      description="Register recipes produced internally by the company. These must exist here before they can be selected and used in the Production Cost Calculator."
      createLabel="Register recipe"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search this page by code, name or factory…"
      search={search}
      onSearch={setSearch}
      filters={
        <>
          <Select
            options={[{ label: 'All factories', value: '' }, ...factories.map((f) => ({ label: f.name, value: f.id }))]}
            value={factoryFilter}
            onChange={(e) => { setFactoryFilter(val(e)); setPage(0) }}
            placeholder="All factories"
            style={{ width: 190 }}
          />
          <Select
            options={[{ label: 'All sourcing', value: '' }, ...SOURCING_TYPES]}
            value={sourcingFilter}
            onChange={(e) => setSourcingFilter(val(e))}
            placeholder="All sourcing"
            style={{ width: 190 }}
          />
        </>
      }
      stats={[
        { label: 'Recipes registered', value: String(pageInfo.totalItems) },
        { label: 'In-house (this page)', value: String(rows.filter((r) => r.sourcing === 'In-House Production').length) },
        { label: 'Imported (this page)', value: String(rows.filter((r) => r.sourcing === 'Direct Importation').length) },
        { label: 'Active (this page)', value: String(rows.filter((r) => r.status === 'Active').length) },
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
      emptyTitle="No recipes registered"
      emptyDescription="Register a recipe to make it selectable in production and costing."
      footnote="A record cannot be created with missing required fields or a code that duplicates an existing entry."
    >
      {loading && <Loader label="Loading recipes…" />}
    </RegisterShell>
  )
}