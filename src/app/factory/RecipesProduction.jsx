// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet } from '../shells/Page.jsx'
// import { LineItems } from '../shells/LineItems.jsx'
// import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, OverheadsPanel, PriorRunsPanel } from './costParts.jsx'
// import { factories, rawMaterials, inputUnitCosts, overheadHeads, registeredRecipes, recipeProductionRuns } from '../sample.js'
// import { fmt, money } from '../utils.js'

// const recipeOptions = registeredRecipes
//   .filter((r) => r.sourcing === 'In-House Production' && r.status === 'Active')
//   .map((r) => ({ value: r.code, label: `${r.code} · ${r.name}` }))

// const blank = () => ({ id: Math.random().toString(36).slice(2), material: '', qty: '' })

// export default function RecipesProduction({ leaf, moduleLabel, parentLabel }) {
//   const [role, setRole] = useState('restricted')
//   const [rows, setRows] = useState([blank()])
//   const [produced, setProduced] = useState('')
//   const canSeeCost = role === 'mgmt'

//   function update(i, key, value) {
//     setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
//   }

//   const decorated = rows.map((r) => {
//     const unitCost = inputUnitCosts[r.material]
//     const qty = Number(r.qty) || 0
//     const lineCost = unitCost != null ? unitCost * qty : undefined
//     return {
//       ...r,
//       unitCost: unitCost == null ? undefined : canSeeCost ? money(unitCost) : '••••••',
//       lineCost: lineCost == null ? undefined : canSeeCost ? money(lineCost) : '••••••',
//     }
//   })

//   const materialCost = rows.reduce((n, r) => n + (inputUnitCosts[r.material] || 0) * (Number(r.qty) || 0), 0)
//   const overhead = overheadHeads.reduce((n, h) => n + h.value, 0)
//   const totalCost = materialCost + overhead
//   const qtyProduced = Number(produced) || 0
//   const unitCost = qtyProduced ? totalCost / qtyProduced : 0

//   const active = rows.filter((r) => r.material)
//   const columns = [
//     { key: 'material', label: 'Imported raw material', type: 'select', options: rawMaterials, width: 260, placeholder: 'Select material…' },
//     { key: 'qty', label: 'Quantity used', type: 'number', width: 150, placeholder: '0' },
//     { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
//     { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'In-House Recipes — Production'}
//       icon={leaf?.icon}
//       description="Run the production cycle for an internally manufactured recipe. Select the registered imported materials required, and the completed recipe is stored in inventory for use in the company's main production processes."
//       headerActions={<PreviewAsRole role={role} onChange={setRole} restrictedLabel="Factory personnel" />}
//       submitLabel="Complete production cycle"
//       onCancel={() => {}}
//       note="Completing the cycle adds the recipe to inventory and sends the calculated production cost to Management and Administration."
//       aside={
//         <>
//           <CostSummaryPanel
//             canSeeCost={canSeeCost}
//             title="Production cost"
//             materialLabel="Material cost"
//             unitLabel="Cost per unit"
//             materialCost={materialCost}
//             overhead={overhead}
//             totalCost={totalCost}
//             qtyProduced={qtyProduced}
//             unitCost={unitCost}
//           />

//           {!canSeeCost && (
//             <CostWithheldNotice title="Production cost withheld">
//               The cost calculated on completion is communicated exclusively to Management and Administration.
//               You can run the full cycle without seeing it.
//             </CostWithheldNotice>
//           )}

//           <PriorRunsPanel
//             title="Recent recipe production"
//             canSeeCost={canSeeCost}
//             runs={recipeProductionRuns.slice(0, 4).map((p) => ({
//               key: p.batch,
//               title: p.recipe,
//               meta: `${p.batch} · ${p.date} · ${fmt(p.qty)} ${p.unit.toLowerCase()}`,
//               cost: p.unitCost,
//             }))}
//           />
//         </>
//       }
//     >
//       <Panel title="Production cycle" description="The in-house recipe being produced.">
//         <FieldSet columns={3}>
//           <Select label="Recipe" options={recipeOptions} placeholder="Select registered recipe…" />
//           <Select label="Producing factory" options={factories} placeholder="Select factory…" />
//           <Input label="Production date" type="date" />
//           <Input label="Batch number" placeholder="e.g. RB-1228" />
//           <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="RP-0442" />
//         </FieldSet>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone="brand">In-House Production</Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             Only recipes registered as in-house and marked active can be produced here.
//           </span>
//         </div>
//       </Panel>

//       <Panel
//         title="Imported materials consumed"
//         description="Select the registered imported materials required for this recipe, according to production requirements."
//       >
//         <LineItems
//           columns={columns}
//           rows={decorated}
//           onChange={update}
//           onAdd={() => setRows((rs) => [...rs, blank()])}
//           onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
//           addLabel="Add material"
//           emptyLabel="No materials added yet."
//           summary={[
//             { label: 'Materials', value: active.length },
//             { label: 'Material cost', value: canSeeCost ? money(materialCost) : '••••••' },
//           ]}
//         />
//       </Panel>

//       <OverheadsPanel canSeeCost={canSeeCost} />
//     </FormShell>
//   )
// }
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { PreviewAsRole, CostSummaryPanel, CostWithheldNotice, PriorRunsPanel } from './costParts.jsx'
import { OverheadsEditor, defaultOverheads, newOverhead, sumOverheads, overheadsPayload } from '../../ds/components/core/OverHead.jsx'
import { fmt, money } from '../utils.js'
import Loader from '../../ds/components/core/Loader.jsx'
import FactoryApi from '../../api/FactoryApi.js'
import InventoryApi from '../../api/InventoryApi.js'
import { useStore } from '../store.jsx'

const factoryApi = new FactoryApi()
const inventoryApi = new InventoryApi()

const blank = () => ({ id: Math.random().toString(36).slice(2), material: '', qty: '' })

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

export default function RecipesProduction({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  const [role, setRole] = useState('restricted')
  const [factoryId, setFactoryId] = useState('')
  const [recipeId, setRecipeId] = useState('')
  const [targetId, setTargetId] = useState('')
  const [produced, setProduced] = useState('')
  const [rows, setRows] = useState([blank()])
  const [overheads, setOverheads] = useState(defaultOverheads)

  // Not accepted by the backend yet. The user can fill them, they are not sent.
  const [productionDate, setProductionDate] = useState('')
  const [batchNo, setBatchNo] = useState('')

  const [rawMaterials, setRawMaterials] = useState([])
  const [stockItems, setStockItems] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loadingInputs, setLoadingInputs] = useState(false)

  const [priorRuns, setPriorRuns] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const canSeeCost = role === 'mgmt'

  const factoryOptions = useMemo(
    () => factories.map((f) => ({ value: f.id, label: f.name })),
    [factories],
  )

  // When the factory changes, clear the selections that belonged to the old one.
  function changeFactory(id) {
    setFactoryId(id)
    setRecipeId('')
    setTargetId('')
    setRows([blank()])
  }

  // Load the chosen factory's raw materials, finished products and in-house recipes.
  useEffect(() => {
    if (!factoryId) {
      setRawMaterials([]); setStockItems([]); setRecipes([])
      return
    }
    let cancelled = false
    setLoadingInputs(true)
    Promise.all([
      inventoryApi.listStockItems(factoryId, 'RAW_MATERIAL', { size: 200 }),
      inventoryApi.listStockItems(factoryId, 'FINISHED_PRODUCT', { size: 200 }),
      factoryApi.listRecipes({ locationId: factoryId, status: 'ACTIVE', page: 0, size: 200 }),
    ])
      .then(([raw, finished, rec]) => {
        if (cancelled) return
        setRawMaterials(pageRows(raw))
        setStockItems([...pageRows(finished), ...pageRows(raw)])
        setRecipes(pageRows(rec).filter((r) => r.sourcing === 'IN_HOUSE_PRODUCTION'))
      })
      .catch((e) => !cancelled && showToast('Could not load inputs', e.message, true))
      .finally(() => !cancelled && setLoadingInputs(false))
    return () => { cancelled = true }
  }, [factoryId, showToast])

  // Recent production runs for the chosen factory.
  const loadPriorRuns = useCallback(async () => {
    if (!factoryId) { setPriorRuns([]); return }
    try {
      const res = await factoryApi.listProductionCostRuns({ locationId: factoryId, page: 0, size: 4 })
      setPriorRuns(
        pageRows(res).map((r) => ({
          key: r.batchRef,
          title: r.targetStockItem?.name ?? 'Unknown product',
          meta: `${r.batchRef} · ${fmtDate(r.runAt)} · ${fmt(r.quantityProduced)}`,
          cost: Number(r.unitLandingCost) || 0,
        })),
      )
    } catch (e) {
      showToast('Could not load recent production', e.message, true)
    }
  }, [factoryId, showToast])

  useEffect(() => { loadPriorRuns() }, [loadPriorRuns])

  const recipeOptions = useMemo(
    () => recipes.map((r) => ({ value: r.id, label: `${r.code} · ${r.name}` })),
    [recipes],
  )
  const materialOptions = useMemo(
    () => rawMaterials.map((m) => ({ value: m.id, label: `${m.name} (${m.code})` })),
    [rawMaterials],
  )
  const targetOptions = useMemo(
    () => stockItems.map((s) => ({ value: s.id, label: `${s.name} (${s.code})` })),
    [stockItems],
  )
  const recipe = recipes.find((r) => r.id === recipeId)

  const unitCostOf = (id) => {
    const m = rawMaterials.find((x) => x.id === id)
    return m ? Number(m.landingCost) || 0 : undefined
  }

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }
  function updateOverhead(i, key, value) {
    setOverheads((os) => os.map((o, oi) => (oi === i ? { ...o, [key]: value } : o)))
  }

  const decorated = rows.map((r) => {
    const unitCost = unitCostOf(r.material)
    const qty = Number(r.qty) || 0
    const lineCost = unitCost != null ? unitCost * qty : undefined
    return {
      ...r,
      unitCost: unitCost == null ? undefined : canSeeCost ? money(unitCost) : '••••••',
      lineCost: lineCost == null ? undefined : canSeeCost ? money(lineCost) : '••••••',
    }
  })

  const materialCost = rows.reduce((n, r) => n + (unitCostOf(r.material) || 0) * (Number(r.qty) || 0), 0)
  const overhead = canSeeCost ? sumOverheads(overheads) : 0
  const totalCost = materialCost + overhead
  const qtyProduced = Number(produced) || 0
  const unitCost = qtyProduced ? totalCost / qtyProduced : 0

  const active = rows.filter((r) => r.material)
  const columns = [
    { key: 'material', label: 'Imported raw material', type: 'select', options: materialOptions, width: 260, placeholder: loadingInputs ? 'Loading…' : 'Select material…' },
    { key: 'qty', label: 'Quantity used', type: 'number', width: 150, placeholder: '0' },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineCost', label: 'Line cost', type: 'static', align: 'right', width: 160 },
  ]

  function resetForm() {
    setRecipeId('')
    setTargetId('')
    setProduced('')
    setRows([blank()])
    setOverheads(defaultOverheads())
    setProductionDate('')
    setBatchNo('')
  }

  async function handleSubmit() {
    if (!factoryId) return showToast('Missing factory', 'Select the producing factory.', true)
    if (!recipeId) return showToast('Missing recipe', 'Select the recipe being produced.', true)
    if (!targetId) return showToast('Missing output item', 'Select the stock item this run produces.', true)
    if (!qtyProduced) return showToast('Missing quantity', 'Enter the quantity produced.', true)

    const materials = rows
      .filter((r) => r.material && Number(r.qty) > 0)
      .map((r) => ({ stockItemId: r.material, quantity: Number(r.qty) }))
    if (!materials.length) {
      return showToast('No materials', 'Add at least one raw material with a quantity.', true)
    }

    setSubmitting(true)
    try {
      await factoryApi.createProductionCostCalculator({
        locationId: factoryId,
        targetStockItemId: targetId,
        recipeId,
        batchSizeQty: qtyProduced,
        materials,
        // Only sent when the Management preview is on.
        overheads: overheadsPayload(overheads, canSeeCost),
      })
      showToast('Production cycle completed', 'The cost has been sent to Management and Administration.')
      resetForm()
      loadPriorRuns()
    } catch (e) {
      showToast('Could not complete production', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'In-House Recipes — Production'}
      icon={leaf?.icon}
      description="Run the production cycle for an internally manufactured recipe. Select the registered imported materials required, and the completed recipe is stored in inventory for use in the company's main production processes."
      headerActions={<PreviewAsRole role={role} onChange={setRole} restrictedLabel="Factory personnel" />}
      submitLabel="Complete production cycle"
      onSubmit={handleSubmit}
      onCancel={resetForm}
      note="Completing the cycle adds the recipe to inventory and sends the calculated production cost to Management and Administration."
      aside={
        <>
          <CostSummaryPanel
            canSeeCost={canSeeCost}
            title="Production cost"
            materialLabel="Material cost"
            unitLabel="Cost per unit"
            materialCost={materialCost}
            overhead={overhead}
            totalCost={totalCost}
            qtyProduced={qtyProduced}
            unitCost={unitCost}
          />

          {!canSeeCost && (
            <CostWithheldNotice title="Production cost withheld">
              The cost calculated on completion is communicated exclusively to Management and Administration.
              You can run the full cycle without seeing it.
            </CostWithheldNotice>
          )}

          <PriorRunsPanel title="Recent recipe production" canSeeCost={canSeeCost} runs={priorRuns} />
        </>
      }
    >
      {(loadingInputs || submitting) && (
        <Loader overlay label={submitting ? 'Completing production cycle…' : 'Loading inputs…'} />
      )}

      <Panel title="Production cycle" description="The in-house recipe being produced.">
        <FieldSet columns={3}>
          <Select
            label="Producing factory"
            options={factoryOptions}
            value={factoryId}
            placeholder="Select factory…"
            onChange={(e) => changeFactory(e.target.value)}
          />
          <Select
            label="Recipe"
            options={recipeOptions}
            value={recipeId}
            placeholder={!factoryId ? 'Select a factory first' : loadingInputs ? 'Loading…' : 'Select registered recipe…'}
            onChange={(e) => setRecipeId(e.target.value)}
          />
          <Select
            label="Output stock item"
            options={targetOptions}
            value={targetId}
            placeholder={!factoryId ? 'Select a factory first' : 'Select item…'}
            onChange={(e) => setTargetId(e.target.value)}
          />
          <Input label="Production date" type="date" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
          <Input label="Batch number" placeholder="e.g. RB-1228" value={batchNo} onChange={(e) => setBatchNo(e.target.value)} />
          <Input label="Quantity produced" type="number" placeholder="0" value={produced} onChange={(e) => setProduced(e.target.value)} />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="RP-0442" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">In-House Production</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {recipe
              ? `Yield per batch: ${fmt(recipe.yieldQty)} ${recipe.yieldUnit?.name ?? ''}`.trim()
              : 'Only recipes registered as in-house and marked active can be produced here.'}
          </span>
        </div>
      </Panel>

      <Panel
        title="Imported materials consumed"
        description="Select the registered imported materials required for this recipe, according to production requirements."
      >
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add material"
          emptyLabel="No materials added yet."
          summary={[
            { label: 'Materials', value: active.length },
            { label: 'Material cost', value: canSeeCost ? money(materialCost) : '••••••' },
          ]}
        />
      </Panel>

      {canSeeCost ? (
        <OverheadsEditor
          overheads={overheads}
          onChange={updateOverhead}
          onAdd={() => setOverheads((os) => [...os, newOverhead()])}
          onRemove={(i) => setOverheads((os) => os.filter((_, oi) => oi !== i))}
        />
      ) : (
        <Panel title="Overheads" description="Overheads are set by Management when the costing is approved." />
      )}
    </FormShell>
  )
}