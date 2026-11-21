// import { useCallback, useEffect, useMemo, useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, PriorRunsPanel } from './costParts.jsx'
// import { overheadHeads } from '../sample.js'
// import { money } from '../utils.js'
// import Loader from '../../ds/components/core/Loader.jsx'
// import FactoryApi from '../../api/FactoryApi.js'
// import InventoryApi from '../../api/InventoryApi.js'
// import { useStore } from '../store.jsx'

// const factoryApi = new FactoryApi()
// const inventoryApi = new InventoryApi()

// const uid = () => Math.random().toString(36).slice(2)
// const blank = () => ({ id: uid(), input: '', qty: '', proportion: '' })

// // Default overheads come from sample.js; the user can edit, remove or add to them.
// const defaultOverheads = () =>
//   overheadHeads.map((h) => ({ id: uid(), label: h.label, amount: String(h.value) }))

// // Paged<T> -> rows. Same shape the Stock Register reads.
// const pageRows = (res) => {
//   const p = res?.data
//   return Array.isArray(p) ? p : p?.items ?? p?.content ?? []
// }

// const fmtDate = (iso) => {
//   const d = new Date(iso)
//   return Number.isNaN(d.getTime())
//     ? ''
//     : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
// }

// /* ------------------------------------------------------------------ */
// /*  Editable overheads                                                 */
// /* ------------------------------------------------------------------ */
// function OverheadsEditor({ overheads, onChange, onAdd, onRemove }) {
//   const total = overheads.reduce((n, o) => n + (Number(o.amount) || 0), 0)

//   return (
//     <Panel
//       title="Overheads"
//       description="Defaults are pre-filled. Edit an amount, remove a line, or add your own. These are sent with the costing."
//     >
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//         {overheads.length === 0 && (
//           <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             No overheads. Landing cost will be based on materials only.
//           </div>
//         )}

//         {overheads.map((o, i) => (
//           <div key={o.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
//             <div style={{ flex: 2 }}>
//               <Input
//                 label={i === 0 ? 'Overhead' : undefined}
//                 placeholder="e.g. Direct labour"
//                 value={o.label}
//                 onChange={(e) => onChange(i, 'label', e.target.value)}
//               />
//             </div>
//             <div style={{ flex: 1 }}>
//               <Input
//                 label={i === 0 ? 'Amount' : undefined}
//                 type="number"
//                 placeholder="0"
//                 value={o.amount}
//                 onChange={(e) => onChange(i, 'amount', e.target.value)}
//               />
//             </div>
//             <button
//               type="button"
//               onClick={() => onRemove(i)}
//               aria-label={`Remove ${o.label || 'overhead'}`}
//               style={{
//                 height: 'var(--field-h)',
//                 padding: '0 12px',
//                 background: 'transparent',
//                 border: '1px solid var(--border-default)',
//                 borderRadius: 'var(--radius-control)',
//                 color: 'var(--text-muted)',
//                 font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
//                 cursor: 'pointer',
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         ))}

//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
//           <button
//             type="button"
//             onClick={onAdd}
//             style={{
//               height: 'var(--field-h)',
//               padding: '0 14px',
//               background: 'var(--surface-card)',
//               border: '1px solid var(--border-default)',
//               borderRadius: 'var(--radius-control)',
//               color: 'var(--text-strong)',
//               font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
//               cursor: 'pointer',
//             }}
//           >
//             Add overhead
//           </button>
//           <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)' }}>
//             Total overheads: {money(total)}
//           </div>
//         </div>
//       </div>
//     </Panel>
//   )
// }

// /* ------------------------------------------------------------------ */
// /*  Page                                                               */
// /* ------------------------------------------------------------------ */
// // factoryId / factoryName arrive as props from the nav entry (see nav.js).
// // factoryKey carries the same id and is kept as a fallback.
// export default function ProductionCostCalculator({ leaf, moduleLabel, parentLabel, factoryId, factoryKey }) {
//   const { factories, showToast } = useStore()
//   const id = factoryId ?? factoryKey
//   const factory = factories.find((f) => f.id === id)

//   const [role, setRole] = useState('restricted')
//   const [rows, setRows] = useState([blank()])
//   const [overheads, setOverheads] = useState(defaultOverheads)

//   // Not accepted by the backend yet. The user can fill them, they are not sent.
//   const [batchNo, setBatchNo] = useState('')
//   const [productionDate, setProductionDate] = useState('')

//   const [produced, setProduced] = useState('')
//   const [productId, setProductId] = useState('')

//   const [rawMaterials, setRawMaterials] = useState([])
//   const [recipes, setRecipes] = useState([])
//   const [finishedItems, setFinishedItems] = useState([])
//   const [loadingInputs, setLoadingInputs] = useState(false)

//   const [priorRuns, setPriorRuns] = useState([])
//   const [submitting, setSubmitting] = useState(false)

//   const canSeeCost = role === 'mgmt'

//   // Load this factory's raw materials, finished products and recipes.
//   useEffect(() => {
//     if (!factory?.id) return
//     let cancelled = false
//     setLoadingInputs(true)
//     Promise.all([
//       inventoryApi.listStockItems(factory.id, 'RAW_MATERIAL', { size: 200 }),
//       inventoryApi.listStockItems(factory.id, 'FINISHED_PRODUCT', { size: 200 }),
//       factoryApi.listRecipes({ locationId: factory.id, page: 0, size: 200 }),
//     ])
//       .then(([raw, finished, rec]) => {
//         if (cancelled) return
//         setRawMaterials(pageRows(raw))
//         setFinishedItems(pageRows(finished))
//         setRecipes(pageRows(rec))
//       })
//       .catch((e) => !cancelled && showToast('Could not load inputs', e.message, true))
//       .finally(() => !cancelled && setLoadingInputs(false))
//     return () => { cancelled = true }
//   }, [factory?.id, showToast])

//   // Recent costings for this factory.
//   const loadPriorRuns = useCallback(async () => {
//     if (!factory?.id) return
//     try {
//       const res = await factoryApi.listProductionCostRuns({ locationId: factory.id, page: 0, size: 5 })
//       setPriorRuns(
//         pageRows(res).map((r) => ({
//           key: r.batchRef,
//           title: r.targetStockItem?.name ?? 'Unknown product',
//           meta: `${r.batchRef} · ${fmtDate(r.runAt)}`,
//           cost: Number(r.unitLandingCost) || 0,
//         })),
//       )
//     } catch (e) {
//       showToast('Could not load recent costings', e.message, true)
//     }
//   }, [factory?.id, showToast])

//   useEffect(() => { loadPriorRuns() }, [loadPriorRuns])

//   const inputOptions = useMemo(() => [
//     ...recipes.map((r) => ({ value: `rec:${r.id}`, label: `Recipe · ${r.name}` })),
//     ...rawMaterials.map((m) => ({ value: `raw:${m.id}`, label: `${m.name} (${m.code})` })),
//   ], [recipes, rawMaterials])

//   const productOptions = useMemo(
//     () => finishedItems.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` })),
//     [finishedItems],
//   )
//   const product = finishedItems.find((p) => p.id === productId)

//   // Raw materials use their landing cost; recipes have no unit cost yet, so they default to 0.
//   const unitCostOf = (key) => {
//     if (!key) return undefined
//     if (key.startsWith('rec:')) return 0
//     const m = rawMaterials.find((x) => `raw:${x.id}` === key)
//     return m ? Number(m.landingCost) || 0 : undefined
//   }

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   function updateOverhead(i, key, value) {
//     setOverheads((os) => os.map((o, oi) => (oi === i ? { ...o, [key]: value } : o)))
//   }

//   const decorated = rows.map((r) => {
//     const unitCost = unitCostOf(r.input)
//     const qty = Number(r.qty) || 0
//     const lineCost = unitCost != null ? unitCost * qty : undefined
//     return {
//       ...r,
//       unitCost: unitCost == null ? undefined : canSeeCost ? money(unitCost) : '••••••',
//       lineCost: lineCost == null ? undefined : canSeeCost ? money(lineCost) : '••••••',
//     }
//   })

//   const materialCost = rows.reduce((n, r) => n + (unitCostOf(r.input) || 0) * (Number(r.qty) || 0), 0)
//   const overhead = canSeeCost ? overheads.reduce((n, o) => n + (Number(o.amount) || 0), 0) : 0
//   const totalCost = materialCost + overhead
//   const qtyProduced = Number(produced) || 0
//   const unitLanding = qtyProduced ? totalCost / qtyProduced : 0

//   const active = rows.filter((r) => r.input)
//   const columns = [
//     { key: 'input', label: 'Recipe / raw material', type: 'select', options: inputOptions, width: 260, placeholder: 'Select input…' },
//     { key: 'qty', label: 'Quantity used', type: 'number', width: 140, placeholder: '0' },
//     { key: 'proportion', label: 'Proportion (%)', type: 'number', width: 140, placeholder: '0' },
//     { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
//     { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
//   ]

//   function resetForm() {
//     setRows([blank()])
//     setOverheads(defaultOverheads())
//     setProduced('')
//     setProductId('')
//     setBatchNo('')
//     setProductionDate('')
//   }

//   async function handleSubmit() {
//     if (!productId) return showToast('Missing product', 'Select the finished product.', true)
//     if (!qtyProduced) return showToast('Missing quantity', 'Enter the quantity produced.', true)

//     // Raw material lines go in `materials`. The API takes a single recipeId,
//     // so the first recipe line selected is the one sent.
//     const materials = rows
//       .filter((r) => r.input.startsWith('raw:') && Number(r.qty) > 0)
//       .map((r) => ({ stockItemId: r.input.slice(4), quantity: Number(r.qty) }))
//     const recipeRow = rows.find((r) => r.input.startsWith('rec:'))

//     if (!materials.length && !recipeRow) {
//       return showToast('No inputs', 'Add at least one raw material or recipe with a quantity.', true)
//     }

//     // Overheads are only sent when the Management preview is on.
//     const overheadsPayload = canSeeCost
//       ? overheads
//           .filter((o) => o.label.trim())
//           .map((o) => ({ label: o.label.trim(), amount: Number(o.amount) || 0 }))
//       : []

//     setSubmitting(true)
//     try {
//       await factoryApi.createProductionCostCalculator({
//         locationId: factory.id,
//         targetStockItemId: productId,
//         recipeId: recipeRow ? recipeRow.input.slice(4) : undefined,
//         batchSizeQty: qtyProduced,
//         materials,
//         overheads: overheadsPayload,
//       })
//       showToast(
//         canSeeCost ? 'Landing cost approved' : 'Costing submitted',
//         canSeeCost ? 'The landing cost has been recorded.' : 'Sent to Management for review.',
//       )
//       resetForm()
//       loadPriorRuns()
//     } catch (e) {
//       showToast('Could not save costing', e.message, true)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // The store hasn't got this factory (not loaded yet, or a stale link).
//   if (!factory) {
//     return (
//       <div style={{ padding: 32, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//         This factory could not be found. Pick one from Factory › Production Cost Calculator.
//       </div>
//     )
//   }

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={`Production Cost Calculator — ${factory.name}`}
//       icon={leaf?.icon}
//       description={`Run at the completion of every production cycle to determine the exact landing cost of a finished product made at ${factory.name}.`}
//       headerActions={<PreviewAsRole role={role} onChange={setRole} />}
//       submitLabel={canSeeCost ? 'Approve landing cost' : 'Submit to Management'}
//       onSubmit={handleSubmit}
//       onCancel={resetForm}
//       note={canSeeCost
//         ? 'Approving records this landing cost against the batch, where it becomes the basis for pricing and mark-up decisions.'
//         : 'Submitting sends this costing to Management for review. You will not see the resulting landing cost value.'}
//       aside={
//         <>
//           <CostSummaryPanel
//             canSeeCost={canSeeCost}
//             title="Landing cost"
//             unitLabel="Unit landing cost"
//             materialCost={materialCost}
//             overhead={overhead}
//             totalCost={totalCost}
//             qtyProduced={qtyProduced}
//             unitCost={unitLanding}
//           />

//           {!canSeeCost && (
//             <CostWithheldNotice title="Cost values withheld">
//               You can complete this costing in full without seeing the values. Landing cost is visible only to
//               Management and Administration, who use it to set pricing and mark-up.
//             </CostWithheldNotice>
//           )}

//           <PriorRunsPanel title="Recent costings" canSeeCost={canSeeCost} runs={priorRuns} />
//         </>
//       }
//     >
//       {(loadingInputs || submitting) && (
//         <Loader overlay label={submitting ? 'Saving costing…' : 'Loading inputs…'} />
//       )}

//       <Panel title="Production run" description="The completed cycle being costed.">
//         <FieldSet columns={3}>
//           <div>
//             <Select
//               label="Finished product"
//               options={productOptions}
//               value={productId}
//               placeholder={loadingInputs ? 'Loading…' : 'Select product…'}
//               onChange={(e) => setProductId(e.target.value)}
//             />
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }}>Limited to {factory.name}&rsquo;s products.</div>
//           </div>
//           <Input label="Batch number" placeholder="e.g. B-3401" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
//           <Input label="Production date" type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
//           <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
//           <Input label="Unit" disabled value={product?.unitOfMeasure?.name || ''} />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="PC-1187" />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone="brand">{factory.name}{factory.state ? ` — ${factory.state}` : ''}</Badge>
//           {factory.address && (
//             <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{factory.address}</span>
//           )}
//         </div>
//       </Panel>

//       <Panel
//         title="Recipes & raw materials consumed"
//         description="Select every input used in the run with its quantity or proportion. Landing cost is derived from these lines plus overheads."
//       >
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//           addLabel="Add input"
//           emptyLabel="No inputs added yet."
//           summary={[
//             { label: 'Inputs', value: active.length },
//             { label: 'Material cost', value: canSeeCost ? money(materialCost) : '••••••' },
//           ]}
//         />
//       </Panel>

//       {canSeeCost ? (
//         <OverheadsEditor
//           overheads={overheads}
//           onChange={updateOverhead}
//           onAdd={() => setOverheads((os) => [...os, { id: uid(), label: '', amount: '' }])}
//           onRemove={(i) => setOverheads((os) => os.filter((_, oi) => oi !== i))}
//         />
//       ) : (
//         <Panel title="Overheads" description="Overheads are set by Management when the costing is approved." />
//       )}
//     </FormShell>
//   )
// }


import { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, PriorRunsPanel } from './costParts.jsx'
import { overheadHeads } from '../sample.js'
import { money } from '../utils.js'
import FactoryApi from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import { useStore } from '../store.jsx'

const factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()

const uid = () => Math.random().toString(36).slice(2)
const blank = () => ({ id: uid(), input: '', qty: '', proportion: '' })

const defaultOverheads = () =>
  overheadHeads.map((h) => ({ id: uid(), label: h.label, amount: String(h.value) }))

const pageRows = (res) => {
  const p = res?.data
  return Array.isArray(p) ? p : p?.items ?? p?.content ?? []
}

// Normalises a recipe's ingredient list to { stockItemId, quantity }[].
// Adjust the field names here if your recipe payload differs.
const recipeIngredients = (recipe) => {
  const list =
    recipe?.ingredients ?? recipe?.materials ?? recipe?.items ?? recipe?.lines ?? []
  return list
    .map((i) => ({
      stockItemId:
        i.rawMaterialStockItem?.id ??   // <-- the field your API actually returns
        i.stockItemId ??
        i.stockItem?.id ??
        i.rawMaterialId ??
        i.materialId,
      quantity: Number(i.quantity ?? i.qty ?? i.quantityRequired) || 0,
    }))
    .filter((i) => i.stockItemId && i.quantity > 0)
}
const fmtDate = (iso) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// A run from /production/runs carries NO id and NO status. So we use every
// plausible id field, then fall back to batchRef as the lookup key — the
// detail endpoint accepts whatever is resolvable.
const extractCalcId = (r) =>
  r?.id ||
  r?.calculationId ||
  r?.productionCostingId ||
  r?.costingId ||
  r?.costCalculatorId ||
  r?.productionCosting?.id ||
  r?.batchRef ||
  null

// Runs are always committed by definition (the endpoint only lists committed
// production runs). So there's no status inference — show them all as such.
const RUN_BADGE = 'brand'

const STATUS_BADGE = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  COMMITTED: 'brand',
}

// A calc detail payload has these fields; a run doesn't. This is the cleanest
// signal for which shape we're rendering.
const hasCalcShape = (c) =>
  !!c &&
  ('materialsSnapshot' in c ||
    'batchSizeQty' in c ||
    'computedUnitCost' in c ||
    'computedTotalCost' in c ||
    'status' in c)

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
/*  List of runs                                                       */
/* ------------------------------------------------------------------ */
function RunsListView({
  crumbs,
  runs,
  loading,
  canSeeCost,
  onBack,
  onOpen,
  onRefresh,
}) {
  const totalQty = runs.reduce(
    (n, r) => n + (Number(r.quantityProduced) || 0),
    0
  )
  const totalCost = runs.reduce(
    (n, r) => n + (Number(r.totalLandingCost) || 0),
    0
  )

  const columns = [
    {
      key: 'batchRef',
      label: 'Batch ref.',
      width: 140,
      mono: true,
      render: (r) => r.batchRef || '—',
    },
    {
      key: 'product',
      label: 'Product',
      width: 220,
      render: (r) => r.targetStockItem?.name || '—',
    },
    {
      key: 'quantityProduced',
      label: 'Qty produced',
      width: 130,
      align: 'right',
      mono: true,
      render: (r) =>
        r.quantityProduced != null
          ? Number(r.quantityProduced).toLocaleString()
          : '—',
    },
    {
      key: 'unitLandingCost',
      label: 'Unit cost',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => {
        if (!canSeeCost) return '••••••'
        return r.unitLandingCost != null ? money(r.unitLandingCost) : '—'
      },
    },
    {
      key: 'totalLandingCost',
      label: 'Total cost',
      width: 160,
      align: 'right',
      mono: true,
      render: (r) => {
        if (!canSeeCost) return '••••••'
        return r.totalLandingCost != null ? money(r.totalLandingCost) : '—'
      },
    },
    {
      key: 'runAt',
      label: 'Run at',
      width: 150,
      render: (r) => (r.runAt ? fmtDate(r.runAt) : '—'),
    },
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading runs…" />}
      <RegisterShell
        wide
        crumbs={crumbs}
        title="Production runs"
        icon="list"
        description="Every committed production run for this factory. Click a run to load its calculation details — the run itself carries no status, so the detail endpoint resolves the underlying calculation."
        headerActions={
          <>
            <Button variant="secondary" iconLeft="rotate-cw" onClick={onRefresh}>
              Refresh
            </Button>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to calculator
            </Button>
          </>
        }
        searchPlaceholder="Search by batch ref…"
        stats={[
          { label: 'Runs', value: String(runs.length) },
          { label: 'Total quantity', value: totalQty.toLocaleString() },
          {
            label: 'Total cost',
            value: canSeeCost ? money(totalCost) : '••••••',
          },
          {
            label: 'Latest',
            value: runs[0]?.runAt ? fmtDate(runs[0].runAt) : '—',
          },
        ]}
        columns={columns}
        rows={runs}
        onRowClick={onOpen}
        emptyTitle="No runs yet"
        emptyDescription="Create a calculation from the calculator and approve + commit it to see runs listed here."
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Detail view — calc payload OR run payload                          */
/* ------------------------------------------------------------------ */
function CalculationDetailView({
  crumbs,
  calc,
  loading,
  canSeeCost,
  acting,
  onBack,
  onApprove,
  onReject,
  onCommit,
  onRefresh,
}) {
  if (loading || !calc) {
    return (
      <>
        {loading && <Loader overlay label="Loading…" />}
        <FormShell
          crumbs={crumbs}
          title="Loading…"
          icon="calculator"
          submitLabel={null}
          onCancel={onBack}
          headerActions={
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to list
            </Button>
          }
        >
          <Panel title="Details">
            <div style={{ color: 'var(--text-muted)', padding: 12 }}>
              Loading…
            </div>
          </Panel>
        </FormShell>
      </>
    )
  }

  const isCalc = hasCalcShape(calc)
  const status = isCalc
    ? String(calc.status || 'PENDING').toUpperCase()
    : 'COMMITTED'

  const qty = isCalc ? calc.batchSizeQty ?? 0 : calc.quantityProduced ?? 0
  const unitCost = isCalc ? calc.computedUnitCost : calc.unitLandingCost
  const totalCost = isCalc ? calc.computedTotalCost : calc.totalLandingCost

  const materialTotal = (calc.materialsSnapshot || []).reduce(
    (n, m) => n + (Number(m.quantity) || 0) * (Number(m.unitCost) || 0),
    0
  )
  const overheadTotal = (calc.overheadSnapshot || []).reduce(
    (n, o) => n + (Number(o.amount) || 0),
    0
  )

  const show = (v) => (canSeeCost ? v : '••••••')

  // Action buttons only appear for real calc payloads with an id to act on
  const hasId = !!calc.id
  const canApprove = isCalc && hasId && status === 'PENDING'
  const canReject = isCalc && hasId && status === 'PENDING'
  const canCommit = isCalc && hasId && status === 'APPROVED'

  const title = isCalc
    ? `Calculation — ${calc.targetStockItem?.name || '—'}`
    : `Production run — ${calc.batchRef || '—'}`

  const statusActions = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {isCalc && hasId && (
        <Button
          variant="secondary"
          iconLeft="rotate-cw"
          onClick={onRefresh}
          disabled={acting}
        >
          Refresh
        </Button>
      )}
      {canReject && (
        <Button
          variant="secondary"
          iconLeft="x"
          onClick={onReject}
          disabled={acting}
        >
          Reject
        </Button>
      )}
      {canApprove && (
        <Button iconLeft="check" onClick={onApprove} disabled={acting}>
          Approve
        </Button>
      )}
      {canCommit && (
        <Button
          iconLeft="check-check"
          onClick={onCommit}
          disabled={acting}
        >
          Commit production run
        </Button>
      )}
      <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
        Back to list
      </Button>
    </div>
  )

  return (
    <>
      {acting && <Loader overlay label="Processing…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={title}
        icon={isCalc ? 'calculator' : 'package'}
        description={
          isCalc
            ? `Batch size ${qty} · Computed by ${calc.computedBy?.name || '—'}`
            : `Batch ${calc.batchRef || '—'} · Run ${calc.runAt ? fmtDate(calc.runAt) : '—'}`
        }
        submitLabel={null}
        onCancel={onBack}
        headerActions={statusActions}
        aside={
          <Panel title="Status & cost">
            <MetaRow
              label="Status"
              value={
                <Badge tone={STATUS_BADGE[status] || 'neutral'}>
                  {status}
                </Badge>
              }
            />
            <MetaRow
              label={isCalc ? 'Batch size' : 'Qty produced'}
              value={String(qty)}
              mono
            />
            <MetaRow
              label="Unit landing cost"
              value={show(unitCost != null ? money(unitCost) : '—')}
              mono
            />
            <MetaRow
              label="Total landing cost"
              value={show(totalCost != null ? money(totalCost) : '—')}
              mono
            />
            {isCalc && calc.approvedBy && (
              <MetaRow
                label="Approved by"
                value={calc.approvedBy?.name || '—'}
              />
            )}
            {isCalc && calc.approvedAt && (
              <MetaRow
                label="Approved at"
                value={fmtDate(calc.approvedAt)}
              />
            )}
            {!isCalc && calc.runAt && (
              <MetaRow label="Run at" value={fmtDate(calc.runAt)} />
            )}
          </Panel>
        }
      >
        <Panel title="Target product">
          <FieldSet columns={2}>
            <MetaRow
              label="Product"
              value={calc.targetStockItem?.name || '—'}
            />
            <MetaRow
              label="Code"
              value={calc.targetStockItem?.code || '—'}
              mono
            />
            <MetaRow
              label="Type"
              value={calc.targetStockItem?.itemType || '—'}
            />
            {isCalc ? (
              <MetaRow
                label="Computed by"
                value={calc.computedBy?.name || '—'}
              />
            ) : (
              <MetaRow
                label="Batch ref."
                value={calc.batchRef || '—'}
                mono
              />
            )}
          </FieldSet>
        </Panel>

        {isCalc && (
          <>
            <Panel title="Materials snapshot">
              {calc.materialsSnapshot?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {calc.materialsSnapshot.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'baseline',
                        padding: '8px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ flex: 2 }}>{m.name || '—'}</div>
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {Number(m.quantity || 0).toLocaleString()}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {show(m.unitCost != null ? money(m.unitCost) : '—')}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          textAlign: 'right',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {show(
                          money(
                            (Number(m.quantity) || 0) *
                              (Number(m.unitCost) || 0)
                          )
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 12,
                      paddingTop: 8,
                      font: 'var(--fw-semibold) var(--text-sm)/1.4 var(--font-ui)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>
                      Materials total:
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {show(money(materialTotal))}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  No materials recorded on this calculation.
                </div>
              )}
            </Panel>

            <Panel title="Overheads snapshot">
              {calc.overheadSnapshot?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {calc.overheadSnapshot.map((o, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span>{o.label || '—'}</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>
                        {show(money(o.amount || 0))}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 12,
                      paddingTop: 8,
                      font: 'var(--fw-semibold) var(--text-sm)/1.4 var(--font-ui)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>
                      Overheads total:
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {show(money(overheadTotal))}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  No overheads recorded on this calculation.
                </div>
              )}
            </Panel>
          </>
        )}

        {!isCalc && (
          <Callout tone="info" icon="package" title="Committed production run">
            This is a production run — the underlying calculation has already
            been approved and committed. The full materials and overheads
            breakdown lives on the calculation record, which isn't linked from
            the run itself.
          </Callout>
        )}

        {isCalc && status === 'REJECTED' && calc.rejectionReason && (
          <Callout tone="danger" icon="circle-alert" title="Rejected">
            {calc.rejectionReason}
          </Callout>
        )}
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Reject reason form                                                 */
/* ------------------------------------------------------------------ */
function RejectReasonForm({
  crumbs,
  rejectionReason,
  setRejectionReason,
  acting,
  onBack,
  onSubmit,
}) {
  const canSubmit = rejectionReason.trim().length > 0 && !acting

  return (
    <>
      {acting && <Loader overlay label="Rejecting…" />}
      <FormShell
        crumbs={crumbs}
        title="Reject calculation"
        icon="x"
        description="Explain why this calculation is being rejected. The submitter will see the reason and can correct and resend."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Reject calculation"
        onSubmit={onSubmit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
      >
        <Panel title="Reason">
          <textarea
            rows={4}
            placeholder="Why are you rejecting this calculation?"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              resize: 'vertical',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)',
              font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
              color: 'var(--text-strong)',
              outline: 'none',
            }}
          />
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function ProductionCostCalculator({
  leaf,
  moduleLabel,
  parentLabel,
  factoryId,
  factoryKey,
}) {
  const { factories, showToast } = useStore()
  const id = factoryId ?? factoryKey
  const factory = factories.find((f) => f.id === id)

  const [mode, setMode] = useState('form')

  const [role, setRole] = useState('restricted')
  const [rows, setRows] = useState([blank()])
  const [overheads, setOverheads] = useState(defaultOverheads)

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

  const [runs, setRuns] = useState([])
  const [runsLoading, setRunsLoading] = useState(false)
  const [selectedCalcId, setSelectedCalcId] = useState(null)
  const [calcDetail, setCalcDetail] = useState(null)
  const [calcLoading, setCalcLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [acting, setActing] = useState(false)

  const canSeeCost = role === 'mgmt'

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

  const loadPriorRuns = useCallback(async () => {
    if (!factory?.id) return
    try {
      const res = await factoryApi.listProductionCostRuns({ locationId: factory.id, page: 0, size: 5 })
      setPriorRuns(
        pageRows(res).map((r) => ({
          key: r.batchRef || r.id,
          title: r.targetStockItem?.name ?? 'Unknown product',
          meta: `${r.batchRef ?? ''} · ${fmtDate(r.runAt)}`,
          cost: Number(r.unitLandingCost) || 0,
        }))
      )
    } catch (e) {
      showToast('Could not load recent costings', e.message, true)
    }
  }, [factory?.id, showToast])

  useEffect(() => { loadPriorRuns() }, [loadPriorRuns])

  const loadRuns = useCallback(async () => {
    if (!factory?.id) return
    setRunsLoading(true)
    try {
      const res = await factoryApi.listProductionCostRuns({
        locationId: factory.id,
        page: 0,
        size: 200,
      })
      setRuns(pageRows(res))
    } catch (e) {
      showToast('Could not load runs', e.message, true)
    } finally {
      setRunsLoading(false)
    }
  }, [factory?.id, showToast])

  // Try to load calc detail for a given id. If the call fails AND we have a
  // fallback run, show the run data instead of a toast — this is the case
  // where batchRef isn't a valid calc id on the backend.
  const loadCalcDetail = useCallback(
    async (lookupId, fallbackRun = null) => {
      if (!lookupId) return
      setCalcLoading(true)
      try {
        const res = await factoryApi.getProductionCostCalculationRunDetail(lookupId)
        setCalcDetail(res?.data || null)
      } catch (e) {
        if (fallbackRun) {
          // silent fallback: show the run itself
          setCalcDetail(fallbackRun)
        } else {
          showToast('Could not load calculation', e.message, true)
        }
      } finally {
        setCalcLoading(false)
      }
    },
    [showToast]
  )

  const openRunsList = useCallback(() => {
    setMode('list')
    loadRuns()
  }, [loadRuns])

  // Click handler: use calc id if present, otherwise try batchRef as the
  // lookup key. On failure the detail view falls back to the run data.
  const openRunDetail = useCallback(
    (row) => {
      const lookupId = extractCalcId(row)
      setSelectedCalcId(lookupId)
      setCalcDetail(null)
      setMode('detail')
      loadCalcDetail(lookupId, row)
    },
    [loadCalcDetail]
  )

  const refreshDetail = useCallback(() => {
    if (!selectedCalcId) return
    loadCalcDetail(selectedCalcId, calcDetail)
  }, [loadCalcDetail, selectedCalcId, calcDetail])

  async function handleApprove() {
    if (!calcDetail?.id) return
    setActing(true)
    try {
      await factoryApi.approveProductionCostCalculation(calcDetail.id)
      showToast('Approved', 'The calculation has been approved.')
      await loadCalcDetail(calcDetail.id)
      loadRuns()
    } catch (e) {
      showToast('Could not approve', e.message, true)
    } finally {
      setActing(false)
    }
  }

  async function handleReject() {
    if (!calcDetail?.id || !rejectionReason.trim()) return
    setActing(true)
    try {
      await factoryApi.rejectProductionCostCalculation(
        calcDetail.id,
        rejectionReason.trim()
      )
      showToast('Rejected', 'The calculation has been rejected.')
      setRejectionReason('')
      setCalcDetail(null)
      setSelectedCalcId(null)
      setMode('list')
      loadRuns()
    } catch (e) {
      showToast('Could not reject', e.message, true)
    } finally {
      setActing(false)
    }
  }

  async function handleCommit() {
    if (!calcDetail?.id) return
    setActing(true)
    try {
      await factoryApi.commitProductionCostCalculation(calcDetail.id)
      showToast(
        'Production run created',
        'The approved calculation has been committed into a production run.'
      )
      setCalcDetail(null)
      setSelectedCalcId(null)
      setMode('list')
      loadRuns()
      loadPriorRuns()
    } catch (e) {
      showToast('Could not commit', e.message, true)
    } finally {
      setActing(false)
    }
  }

  const inputOptions = useMemo(() => [
    ...recipes.map((r) => ({ value: `rec:${r.id}`, label: `Recipe · ${r.name}` })),
    ...rawMaterials.map((m) => ({ value: `raw:${m.id}`, label: `${m.name} (${m.code})` })),
  ], [recipes, rawMaterials])

  const productOptions = useMemo(
    () => finishedItems.map((p) => ({ value: p.id, label: `${p.name} (${p.code})` })),
    [finishedItems],
  )
  const product = finishedItems.find((p) => p.id === productId)

  const unitCostOf = (key) => {
    if (!key) return undefined
    if (key.startsWith('rec:')) {
      // Cost of one unit of the recipe = sum of its ingredients' costs
      const recipe = recipes.find((r) => String(r.id) === key.slice(4))
      return recipeIngredients(recipe).reduce((n, ing) => {
        const m = rawMaterials.find((x) => String(x.id) === String(ing.stockItemId))
        return n + ing.quantity * (Number(m?.landingCost) || 0)
      }, 0)
    }
    const m = rawMaterials.find((x) => `raw:${x.id}` === key)
    return m ? Number(m.landingCost) || 0 : undefined
  }

  // Flattens raw-material rows and recipe rows (scaled by the quantity entered)
  // into one materials list, merging duplicates by stockItemId.
  function buildMaterials() {
    const totals = new Map()
    const add = (stockItemId, quantity) =>
      totals.set(stockItemId, (totals.get(stockItemId) || 0) + quantity)

    for (const r of rows) {
      const qty = Number(r.qty) || 0
      if (!r.input || qty <= 0) continue

      if (r.input.startsWith('raw:')) {
        add(r.input.slice(4), qty)
      } else if (r.input.startsWith('rec:')) {
        const recipe = recipes.find((x) => String(x.id) === r.input.slice(4))
        recipeIngredients(recipe).forEach((ing) => add(ing.stockItemId, ing.quantity * qty))
      }
    }

    return [...totals].map(([stockItemId, quantity]) => ({ stockItemId, quantity }))
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

    const materials = buildMaterials()
console.log('Selected recipe:', recipes.find((x) => rows.some((r) => r.input === `rec:${x.id}`)))
    if (!materials.length) {
      const hasRecipe = rows.some((r) => r.input.startsWith('rec:'))
      return showToast(
        'No inputs',
        hasRecipe
          ? 'Enter a quantity for each selected recipe, and make sure the recipe has ingredients.'
          : 'Add at least one raw material or recipe with a quantity.',
        true
      )
    }

    const overheadsPayload = canSeeCost
      ? overheads
          .filter((o) => o.label.trim())
          .map((o) => ({ label: o.label.trim(), amount: Number(o.amount) || 0 }))
      : []

    setSubmitting(true)

    // Track progress so a partial failure gives an accurate message
    let createdId = null
    let approved = false

    try {
      // 1. Create the calculation
      const created = await factoryApi.createProductionCostCalculator({
        locationId: factory.id,
        targetStockItemId: productId,
        batchSizeQty: qtyProduced,
        materials,
        overheads: overheadsPayload,
      })

      // Restricted users only submit for review
      if (!canSeeCost) {
        showToast('Costing submitted', 'Sent to Management for review.')
        resetForm()
        loadPriorRuns()
        return
      }

      // 2. Management: approve + commit immediately
      createdId = created?.data?.id
      if (!createdId) {
        throw new Error('Calculation was created but no id was returned, so it could not be approved')
      }

      await factoryApi.approveProductionCostCalculation(createdId)
      approved = true

      await factoryApi.commitProductionCostCalculation(createdId)

      showToast(
        'Production run created',
        'The landing cost has been approved and committed to a production run.'
      )
      resetForm()
      loadPriorRuns()
    } catch (e) {
      if (createdId && approved) {
        // Approved but commit failed: it can still be committed from "View runs"
        showToast(
          'Approved, but not committed',
          `${e.message}. The calculation is approved and can be committed from View runs.`,
          true
        )
        resetForm()
        loadPriorRuns()
      } else if (createdId) {
        // Created but approve failed: it's sitting as PENDING
        showToast(
          'Saved, but not approved',
          `${e.message}. The calculation is pending and can be approved from View runs.`,
          true
        )
        resetForm()
        loadPriorRuns()
      } else {
        showToast('Could not save costing', e.message, true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!factory) {
    return (
      <div style={{ padding: 32, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
        This factory could not be found. Pick one from Factory › Production Cost Calculator.
      </div>
    )
  }

  if (mode === 'list') {
    return (
      <RunsListView
        crumbs={[moduleLabel, parentLabel]}
        runs={runs}
        loading={runsLoading}
        canSeeCost={canSeeCost}
        onBack={() => setMode('form')}
        onOpen={openRunDetail}
        onRefresh={loadRuns}
      />
    )
  }

  if (mode === 'detail') {
    return (
      <CalculationDetailView
        crumbs={[moduleLabel, parentLabel]}
        calc={calcDetail}
        loading={calcLoading}
        canSeeCost={canSeeCost}
        acting={acting}
        onBack={() => setMode('list')}
        onRefresh={refreshDetail}
        onApprove={handleApprove}
        onReject={() => setMode('reject')}
        onCommit={handleCommit}
      />
    )
  }

  if (mode === 'reject') {
    return (
      <RejectReasonForm
        crumbs={[moduleLabel, parentLabel]}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        acting={acting}
        onBack={() => setMode('detail')}
        onSubmit={handleReject}
      />
    )
  }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={`Production Cost Calculator — ${factory.name}`}
      icon={leaf?.icon}
      description={`Run at the completion of every production cycle to determine the exact landing cost of a finished product made at ${factory.name}.`}
      headerActions={
        <div style={{ display: 'flex', gap: 8 }}>
          <PreviewAsRole role={role} onChange={setRole} />
          <Button
            variant="secondary"
            iconLeft="list"
            onClick={openRunsList}
          >
            View runs
          </Button>
        </div>
      }
      submitLabel={canSeeCost ? 'Approve & commit' : 'Submit to Management'}
      onSubmit={handleSubmit}
      onCancel={resetForm}
      note={canSeeCost
        ? 'This creates the costing, approves it and commits it as a production run in one step. The landing cost then becomes the basis for pricing and mark-up decisions.'
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
        <Loader
          overlay
          label={
            submitting
              ? canSeeCost ? 'Approving and committing…' : 'Saving costing…'
              : 'Loading inputs…'
          }
        />
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