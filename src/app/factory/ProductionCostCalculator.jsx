import { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, PriorRunsPanel } from './costParts.jsx'
import { overheadHeads } from '../sample.js'
import { money } from '../utils.js'
import Loader from '../../ds/components/core/Loader.jsx'
import FactoryApi from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import { useStore } from '../store.jsx'

const factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()

const uid = () => Math.random().toString(36).slice(2)
const blank = () => ({ id: uid(), input: '', qty: '', proportion: '' })

// Default overheads come from sample.js; the user can edit, remove or add to them.
const defaultOverheads = () =>
  overheadHeads.map((h) => ({ id: uid(), label: h.label, amount: String(h.value) }))

// Paged<T> -> rows. Same shape the Stock Register reads.
const pageRows = (res) => {
  const p = res?.data
  return Array.isArray(p) ? p : p?.items ?? p?.content ?? []
}

const fmtDate = (iso) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ------------------------------------------------------------------ */
/*  Editable overheads                                                 */
/* ------------------------------------------------------------------ */
function OverheadsEditor({ overheads, onChange, onAdd, onRemove }) {
  const total = overheads.reduce((n, o) => n + (Number(o.amount) || 0), 0)

  return (
    <Panel
      title="Overheads"
      description="Defaults are pre-filled. Edit an amount, remove a line, or add your own. These are sent with the costing."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {overheads.length === 0 && (
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            No overheads. Landing cost will be based on materials only.
          </div>
        )}

        {overheads.map((o, i) => (
          <div key={o.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div style={{ flex: 2 }}>
              <Input
                label={i === 0 ? 'Overhead' : undefined}
                placeholder="e.g. Direct labour"
                value={o.label}
                onChange={(e) => onChange(i, 'label', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input
                label={i === 0 ? 'Amount' : undefined}
                type="number"
                placeholder="0"
                value={o.amount}
                onChange={(e) => onChange(i, 'amount', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${o.label || 'overhead'}`}
              style={{
                height: 'var(--field-h)',
                padding: '0 12px',
                background: 'transparent',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)',
                color: 'var(--text-muted)',
                font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
                cursor: 'pointer',
              }}
            >
              Remove
            </button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <button
            type="button"
            onClick={onAdd}
            style={{
              height: 'var(--field-h)',
              padding: '0 14px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)',
              color: 'var(--text-strong)',
              font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
              cursor: 'pointer',
            }}
          >
            Add overhead
          </button>
          <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)' }}>
            Total overheads: {money(total)}
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
// factoryId / factoryName arrive as props from the nav entry (see nav.js).
// factoryKey carries the same id and is kept as a fallback.
export default function ProductionCostCalculator({ leaf, moduleLabel, parentLabel, factoryId, factoryKey }) {
  const { factories, showToast } = useStore()
  const id = factoryId ?? factoryKey
  const factory = factories.find((f) => f.id === id)

  const [role, setRole] = useState('restricted')
  const [rows, setRows] = useState([blank()])
  const [overheads, setOverheads] = useState(defaultOverheads)

  // Not accepted by the backend yet. The user can fill them, they are not sent.
  const [batchNo, setBatchNo] = useState('')
  const [productionDate, setProductionDate] = useState('')

  const [produced, setProduced] = useState('')
  const [productId, setProductId] = useState('')

  const [rawMaterials, setRawMaterials] = useState([])
  const [recipes, setRecipes] = useState([])
  const [finishedItems, setFinishedItems] = useState([])
  const [loadingInputs, setLoadingInputs] = useState(false)

  const [priorRuns, setPriorRuns] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const canSeeCost = role === 'mgmt'

  // Load this factory's raw materials, finished products and recipes.
  useEffect(() => {
    if (!factory?.id) return
    let cancelled = false
    setLoadingInputs(true)
    Promise.all([
      inventoryApi.listStockItems(factory.id, 'RAW_MATERIAL', { size: 200 }),
      inventoryApi.listStockItems(factory.id, 'FINISHED_PRODUCT', { size: 200 }),
      factoryApi.listRecipes({ locationId: factory.id, page: 0, size: 200 }),
    ])
      .then(([raw, finished, rec]) => {
        if (cancelled) return
        setRawMaterials(pageRows(raw))
        setFinishedItems(pageRows(finished))
        setRecipes(pageRows(rec))
      })
      .catch((e) => !cancelled && showToast('Could not load inputs', e.message, true))
      .finally(() => !cancelled && setLoadingInputs(false))
    return () => { cancelled = true }
  }, [factory?.id, showToast])

  // Recent costings for this factory.
  const loadPriorRuns = useCallback(async () => {
    if (!factory?.id) return
    try {
      const res = await factoryApi.listProductionCostRuns({ locationId: factory.id, page: 0, size: 5 })
      setPriorRuns(
        pageRows(res).map((r) => ({
          key: r.batchRef,
          title: r.targetStockItem?.name ?? 'Unknown product',
          meta: `${r.batchRef} · ${fmtDate(r.runAt)}`,
          cost: Number(r.unitLandingCost) || 0,
        })),
      )
    } catch (e) {
      showToast('Could not load recent costings', e.message, true)
    }
  }, [factory?.id, showToast])

  useEffect(() => { loadPriorRuns() }, [loadPriorRuns])

  const inputOptions = useMemo(() => [
    ...recipes.map((r) => ({ value: `rec:${r.id}`, label: `Recipe · ${r.name}` })),
    ...rawMaterials.map((m) => ({ value: `raw:${m.id}`, label: `${m.name} (${m.code})` })),
  ], [recipes, rawMaterials])

  const productOptions = useMemo(
    () => finishedItems.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` })),
    [finishedItems],
  )
  const product = finishedItems.find((p) => p.id === productId)

  // Raw materials use their landing cost; recipes have no unit cost yet, so they default to 0.
  const unitCostOf = (key) => {
    if (!key) return undefined
    if (key.startsWith('rec:')) return 0
    const m = rawMaterials.find((x) => `raw:${x.id}` === key)
    return m ? Number(m.landingCost) || 0 : undefined
  }

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  function updateOverhead(i, key, value) {
    setOverheads((os) => os.map((o, oi) => (oi === i ? { ...o, [key]: value } : o)))
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
  const overhead = canSeeCost ? overheads.reduce((n, o) => n + (Number(o.amount) || 0), 0) : 0
  const totalCost = materialCost + overhead
  const qtyProduced = Number(produced) || 0
  const unitLanding = qtyProduced ? totalCost / qtyProduced : 0

  const active = rows.filter((r) => r.input)
  const columns = [
    { key: 'input', label: 'Recipe / raw material', type: 'select', options: inputOptions, width: 260, placeholder: 'Select input…' },
    { key: 'qty', label: 'Quantity used', type: 'number', width: 140, placeholder: '0' },
    { key: 'proportion', label: 'Proportion (%)', type: 'number', width: 140, placeholder: '0' },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
  ]

  function resetForm() {
    setRows([blank()])
    setOverheads(defaultOverheads())
    setProduced('')
    setProductId('')
    setBatchNo('')
    setProductionDate('')
  }

  async function handleSubmit() {
    if (!productId) return showToast('Missing product', 'Select the finished product.', true)
    if (!qtyProduced) return showToast('Missing quantity', 'Enter the quantity produced.', true)

    // Raw material lines go in `materials`. The API takes a single recipeId,
    // so the first recipe line selected is the one sent.
    const materials = rows
      .filter((r) => r.input.startsWith('raw:') && Number(r.qty) > 0)
      .map((r) => ({ stockItemId: r.input.slice(4), quantity: Number(r.qty) }))
    const recipeRow = rows.find((r) => r.input.startsWith('rec:'))

    if (!materials.length && !recipeRow) {
      return showToast('No inputs', 'Add at least one raw material or recipe with a quantity.', true)
    }

    // Overheads are only sent when the Management preview is on.
    const overheadsPayload = canSeeCost
      ? overheads
          .filter((o) => o.label.trim())
          .map((o) => ({ label: o.label.trim(), amount: Number(o.amount) || 0 }))
      : []

    setSubmitting(true)
    try {
      await factoryApi.createProductionCostCalculator({
        locationId: factory.id,
        targetStockItemId: productId,
        recipeId: recipeRow ? recipeRow.input.slice(4) : undefined,
        batchSizeQty: qtyProduced,
        materials,
        overheads: overheadsPayload,
      })
      showToast(
        canSeeCost ? 'Landing cost approved' : 'Costing submitted',
        canSeeCost ? 'The landing cost has been recorded.' : 'Sent to Management for review.',
      )
      resetForm()
      loadPriorRuns()
    } catch (e) {
      showToast('Could not save costing', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  // The store hasn't got this factory (not loaded yet, or a stale link).
  if (!factory) {
    return (
      <div style={{ padding: 32, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
        This factory could not be found. Pick one from Factory › Production Cost Calculator.
      </div>
    )
  }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={`Production Cost Calculator — ${factory.name}`}
      icon={leaf?.icon}
      description={`Run at the completion of every production cycle to determine the exact landing cost of a finished product made at ${factory.name}.`}
      headerActions={<PreviewAsRole role={role} onChange={setRole} />}
      submitLabel={canSeeCost ? 'Approve landing cost' : 'Submit to Management'}
      onSubmit={handleSubmit}
      onCancel={resetForm}
      note={canSeeCost
        ? 'Approving records this landing cost against the batch, where it becomes the basis for pricing and mark-up decisions.'
        : 'Submitting sends this costing to Management for review. You will not see the resulting landing cost value.'}
      aside={
        <>
          <CostSummaryPanel
            canSeeCost={canSeeCost}
            title="Landing cost"
            unitLabel="Unit landing cost"
            materialCost={materialCost}
            overhead={overhead}
            totalCost={totalCost}
            qtyProduced={qtyProduced}
            unitCost={unitLanding}
          />

          {!canSeeCost && (
            <CostWithheldNotice title="Cost values withheld">
              You can complete this costing in full without seeing the values. Landing cost is visible only to
              Management and Administration, who use it to set pricing and mark-up.
            </CostWithheldNotice>
          )}

          <PriorRunsPanel title="Recent costings" canSeeCost={canSeeCost} runs={priorRuns} />
        </>
      }
    >
      {(loadingInputs || submitting) && (
        <Loader overlay label={submitting ? 'Saving costing…' : 'Loading inputs…'} />
      )}

      <Panel title="Production run" description="The completed cycle being costed.">
        <FieldSet columns={3}>
          <div>
            <Select
              label="Finished product"
              options={productOptions}
              value={productId}
              placeholder={loadingInputs ? 'Loading…' : 'Select product…'}
              onChange={(e) => setProductId(e.target.value)}
            />
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>Limited to {factory.name}&rsquo;s products.</div>
          </div>
          <Input label="Batch number" placeholder="e.g. B-3401" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
          <Input label="Production date" type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
          <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
          <Input label="Unit" disabled value={product?.unitOfMeasure?.name || ''} />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="PC-1187" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">{factory.name}{factory.state ? ` — ${factory.state}` : ''}</Badge>
          {factory.address && (
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{factory.address}</span>
          )}
        </div>
      </Panel>

      <Panel
        title="Recipes & raw materials consumed"
        description="Select every input used in the run with its quantity or proportion. Landing cost is derived from these lines plus overheads."
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

      {canSeeCost ? (
        <OverheadsEditor
          overheads={overheads}
          onChange={updateOverhead}
          onAdd={() => setOverheads((os) => [...os, { id: uid(), label: '', amount: '' }])}
          onRemove={(i) => setOverheads((os) => os.filter((_, oi) => oi !== i))}
        />
      ) : (
        <Panel title="Overheads" description="Overheads are set by Management when the costing is approved." />
      )}
    </FormShell>
  )
}