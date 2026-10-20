import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, OverheadsPanel, PriorRunsPanel } from './costParts.jsx'
import { overheadHeads } from '../sample.js'
import { fmt, money } from '../utils.js'
import FactoryApi from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import { useStore } from '../store'
import Loader from '../../ds/components/core/Loader.jsx'

const factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()

const blank = () => ({ id: Math.random().toString(36).slice(2), input: '', qty: '', proportion: '' })

// Paged<T> comes back as a page object; pull the rows out of it.
// Adjust if your Paged type uses a different key.
const pageRows = (res) => {
  const p = res?.data
  return Array.isArray(p) ? p : p?.content ?? p?.items ?? []
}

const errMsg = (e) => e?.message || 'Something went wrong'

export default function SpecialProduction({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast, specialProductionRuns, overrideRecentSpecialProductionRuns } = useStore()

  const [role, setRole] = useState('restricted')
  const canSeeCost = role === 'mgmt'

  // ── special client (list endpoint not ready: local list + inline create) ──
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [showNewClient, setShowNewClient] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', terms: '' })
  const [savingClient, setSavingClient] = useState(false)

  // ── run details ──
  const [factoryId, setFactoryId] = useState('')
  const [targetId, setTargetId] = useState('')
  const [description, setDescription] = useState('')
  const [produced, setProduced] = useState('')
  const [price, setPrice] = useState('')
  const [rows, setRows] = useState([blank()])
  // Captured on the form but not sent to the API (it has no fields for them yet).
  const [orderRef, setOrderRef] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [productionDate, setProductionDate] = useState('')
  const [batchNo, setBatchNo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── per-factory lookups ──
  const [rawMaterials, setRawMaterials] = useState([])
  const [recipes, setRecipes] = useState([])
  const [finishedItems, setFinishedItems] = useState([])
  const [loadingInputs, setLoadingInputs] = useState(false)

  const factoryOptions = useMemo(
    () => (factories || []).map((f) => ({ value: f.id, label: f.name })),
    [factories],
  )
  const clientOptions = useMemo(
    () => clients.map((c) => ({ value: c.id, label: c.name })),
    [clients],
  )
  const client = clients.find((c) => c.id === clientId)

  // Load raw materials, recipes and finished products whenever the factory changes.
  useEffect(() => {
    setRows([blank()])
    setTargetId('')
    if (!factoryId) {
      setRawMaterials([]); setRecipes([]); setFinishedItems([])
      return
    }
    let cancelled = false
    setLoadingInputs(true)
    Promise.all([
      inventoryApi.listStockItems(factoryId, 'RAW_MATERIAL', { size: 200 }),
      inventoryApi.listStockItems(factoryId, 'FINISHED_PRODUCT', { size: 200 }),
      factoryApi.listRecipes({ locationId: factoryId, page: 0, size: 200 }),
    ])
      .then(([raw, finished, rec]) => {
        if (cancelled) return
        setRawMaterials(pageRows(raw))
        setFinishedItems(pageRows(finished))
        setRecipes(pageRows(rec))
      })
      .catch((e) => !cancelled && showToast('Could not load inputs', errMsg(e), true))
      .finally(() => !cancelled && setLoadingInputs(false))
    return () => { cancelled = true }
  }, [factoryId, showToast])

  // One option list for the line items: recipes and raw materials, prefixed so ids can't collide.
  const inputOptions = useMemo(() => [
    ...recipes.map((r) => ({ value: `rec:${r.id}`, label: `Recipe · ${r.name}` })),
    ...rawMaterials.map((m) => ({ value: `raw:${m.id}`, label: `${m.name} (${m.code})` })),
  ], [recipes, rawMaterials])

  // Unit cost per input. Raw materials use their landing cost; recipes default to 0 until the backend supplies one.
  const unitCostOf = (key) => {
    if (!key) return undefined
    if (key.startsWith('rec:')) return 0
    const m = rawMaterials.find((x) => `raw:${x.id}` === key)
    return m ? Number(m.landingCost) || 0 : undefined
  }

  const targetOptions = useMemo(
    () => finishedItems.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` })),
    [finishedItems],
  )
  const target = finishedItems.find((p) => p.id === targetId)

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const unitCost = unitCostOf(r.input)
    const qty = Number(r.qty) || 0
    const lineCost = unitCost != null ? unitCost * qty : undefined
    return {
      ...r,
      unitCost: unitCost == null ? undefined : canSeeCost ? money(unitCost) : '••••••',
      lineCost: lineCost == null ? undefined : canSeeCost ? money(lineCost) : '••••••',
    }
  })

  const materialCost = rows.reduce((n, r) => n + (unitCostOf(r.input) || 0) * (Number(r.qty) || 0), 0)
  const overhead = overheadHeads.reduce((n, h) => n + h.value, 0)
  const totalCost = materialCost + overhead
  const qtyProduced = Number(produced) || 0
  const unitCost = qtyProduced ? totalCost / qtyProduced : 0

  const active = rows.filter((r) => r.input)
  const columns = [
    { key: 'input', label: 'Recipe / raw material', type: 'select', options: inputOptions, width: 260, placeholder: factoryId ? 'Select input…' : 'Pick a factory first' },
    { key: 'qty', label: 'Quantity used', type: 'number', width: 140, placeholder: '0' },
    { key: 'proportion', label: 'Proportion (%)', type: 'number', width: 140, placeholder: '0' },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
  ]

  // ── create a special client from the form ──
  async function saveClient() {
    if (!newClient.name.trim()) return showToast('Client name is required', '', true)
    setSavingClient(true)
    try {
      const res = await factoryApi.createSpecialClient({
        name: newClient.name.trim(),
        terms: newClient.terms.trim(),
      })
      const created = res.data
      setClients((cs) => [...cs, created])
      setClientId(created.id)
      setNewClient({ name: '', terms: '' })
      setShowNewClient(false)
      showToast('Special client created', created.name)
    } catch (e) {
      showToast('Could not create client', errMsg(e), true)
    } finally {
      setSavingClient(false)
    }
  }

  // The API takes raw stock items only, so a recipe line is expanded into its
  // ingredients, scaled by (quantity used / recipe yield), and duplicates are merged.
  function buildMaterials() {
    const totals = new Map()
    const add = (id, q) => totals.set(id, (totals.get(id) || 0) + q)
    for (const r of rows) {
      const qty = Number(r.qty) || 0
      if (!r.input || qty <= 0) continue
      if (r.input.startsWith('rec:')) {
        const recipe = recipes.find((x) => `rec:${x.id}` === r.input)
        if (!recipe || !recipe.yieldQty) continue
        const factor = qty / recipe.yieldQty
        recipe.ingredients.forEach((ing) => add(ing.rawMaterialStockItem.id, ing.quantity * factor))
      } else {
        add(r.input.slice(4), qty)
      }
    }
    return [...totals].map(([stockItemId, quantity]) => ({ stockItemId, quantity }))
  }

  function reset() {
    setClientId(''); setTargetId(''); setDescription(''); setProduced(''); setPrice('')
    setOrderRef(''); setDeliveryDate(''); setProductionDate(''); setBatchNo('')
    setRows([blank()])
  }

  async function submit() {
    const materials = buildMaterials()
    if (!clientId) return showToast('Select or create a special client', '', true)
    if (!factoryId) return showToast('Select the producing factory', '', true)
    if (!target) return showToast('Select the special product', '', true)
    if (qtyProduced <= 0) return showToast('Enter the quantity produced', '', true)
    if (!materials.length) return showToast('Add at least one input with a quantity', '', true)

    setSubmitting(true)
    try {
      const res = await factoryApi.createSpecialProductionRun({
        locationId: factoryId,
        clientId,
        targetStockItemId: target.id,
        productDescription: description.trim(),
        quantity: qtyProduced,
        unitId: target.unitOfMeasure.id,
        unitCost,
        price: Number(price) || 0,
        materials,
      })
      const run = res.data
      // Shape matches what the "Recent special orders" panel reads.
      overrideRecentSpecialProductionRuns([
        {
          batch: run.batchRef,
          order: run.orderRef,
          product: target.name,
          client: run.client?.name || client?.name || '',
          qty: run.quantity,
          unit: target.unitOfMeasure.name,
          unitCost,
        },
        ...(specialProductionRuns || []),
      ])
      showToast('Special production submitted', `${run.orderRef} · ${run.batchRef}`)
      reset()
    } catch (e) {
      showToast('Submission failed', errMsg(e), true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Special Production'}
      icon={leaf?.icon}
      description="Cost a customised production order for a special client. Operates like the Factory A and B calculators, but is dedicated exclusively to special products and kept separate from regular factory production."
      headerActions={<PreviewAsRole role={role} onChange={setRole} />}
      submitLabel={submitting ? 'Submitting…' : canSeeCost ? 'Approve special costing' : 'Submit to Management'}
      onSubmit={submit}
      submitting={submitting}
      onCancel={reset}
      note={canSeeCost
        ? 'Approving records this costing against the special order, where it becomes the basis for the quoted price.'
        : 'Submitting sends this costing to Management for review. You will not see the resulting cost value.'}
      aside={
        <>
          <CostSummaryPanel
            canSeeCost={canSeeCost}
            title="Special order cost"
            materialLabel="Material & recipe cost"
            unitLabel="Cost per unit"
            materialCost={materialCost}
            overhead={overhead}
            totalCost={totalCost}
            qtyProduced={qtyProduced}
            unitCost={unitCost}
          />

          {!canSeeCost && (
            <CostWithheldNotice title="Cost values withheld">
              You can complete this special costing in full without seeing the values. Cost is visible only to
              Management and Administration, who use it to quote the client.
            </CostWithheldNotice>
          )}

          <PriorRunsPanel
            title="Recent special orders"
            canSeeCost={canSeeCost}
            runs={(specialProductionRuns || []).slice(0, 4).map((r) => ({
              key: r.batch,
              title: r.product,
              meta: `${r.order} · ${r.client} · ${fmt(r.qty)} ${String(r.unit || '').toLowerCase()}`,
              cost: r.unitCost,
            }))}
          />
        </>
      }
    >
      {(loadingInputs || submitting) && (
        <Loader overlay label={submitting ? 'Submitting special production…' : 'Loading inputs…'} />
      )}

      <Panel title="Special order" description="Who requested this production and against which order.">
        <FieldSet columns={3}>
          <Select
            label="Special client"
            options={clientOptions}
            value={clientId}
            placeholder={clients.length ? 'Select special client…' : 'No clients yet — create one'}
            onChange={(e) => setClientId(e.target.value)}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowNewClient((v) => !v)}
              style={{
                height: 40, padding: '0 14px', cursor: 'pointer',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', color: 'var(--text-strong)',
                font: 'var(--type-label)',
              }}
            >
              {showNewClient ? 'Cancel new client' : '+ New special client'}
            </button>
          </div>
          <Input label="Order reference" placeholder="e.g. SO-0434" value={orderRef} onChange={(e) => setOrderRef(e.target.value)} />
          <Input label="Requested delivery date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
        </FieldSet>

        {showNewClient && (
          <div style={{ marginTop: 14 }}>
            <FieldSet columns={3}>
              <Input label="Client name" value={newClient.name} onChange={(e) => setNewClient((c) => ({ ...c, name: e.target.value }))} />
              <Input label="Terms" placeholder="e.g. 50% deposit, net 30" value={newClient.terms} onChange={(e) => setNewClient((c) => ({ ...c, terms: e.target.value }))} />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={saveClient}
                  disabled={savingClient}
                  style={{
                    height: 40, padding: '0 14px', cursor: savingClient ? 'default' : 'pointer',
                    background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-control)', color: 'var(--text-strong)',
                    font: 'var(--type-label)', opacity: savingClient ? 0.6 : 1,
                  }}
                >
                  {savingClient ? 'Saving…' : 'Save client'}
                </button>
              </div>
            </FieldSet>
          </div>
        )}

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="warning">Special order</Badge>
          {client?.terms && (
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{client.terms}</span>
          )}
        </div>
      </Panel>

      <Panel title="Production run" description="The customised finished product being made.">
        <FieldSet columns={3}>
          <Select label="Producing factory" options={factoryOptions} value={factoryId} placeholder="Select factory…" onChange={(e) => setFactoryId(e.target.value)} />
          <Select
            label="Special product"
            options={targetOptions}
            value={targetId}
            placeholder={loadingInputs ? 'Loading…' : factoryId ? 'Select special product…' : 'Pick a factory first'}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
          <Input label="Quoted price" type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Input label="Unit" disabled value={target?.unitOfMeasure?.name || ''} />
          <Input label="Production date" type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
          <Input label="Batch number" placeholder="e.g. SB-0798" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Customisation notes</div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Label artwork, pack format, or specification differences from the standard product."
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

      <Panel
        title="Recipes & raw materials consumed"
        description="Configure the recipe for this special product. Inputs may differ from the standard product's composition."
      >
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add input"
          emptyLabel="No inputs added yet."
          summary={[
            { label: 'Inputs', value: active.length },
            { label: 'Material cost', value: canSeeCost ? money(materialCost) : '••••••' },
          ]}
        />
      </Panel>

      <OverheadsPanel canSeeCost={canSeeCost} />
    </FormShell>
  )
}