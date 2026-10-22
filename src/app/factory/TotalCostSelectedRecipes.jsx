// import { useState } from 'react'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Checkbox } from '../../ds/components/forms/Checkbox.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Panel, Callout } from '../shells/Page.jsx'
// import { factories, recipeCostPool } from '../sample.js'
// import { fmt, money, moneyShort } from '../utils.js'

// export default function TotalCostSelectedRecipes({ leaf, moduleLabel, parentLabel }) {
//   const [selected, setSelected] = useState(['rm-01', 'rm-03', 'rc-01'])

//   const toggle = (key) =>
//     setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]))
//   const allOn = selected.length === recipeCostPool.length

//   const rows = recipeCostPool
//     .filter((m) => selected.includes(m.key))
//     .map((m) => ({ ...m, usageCost: m.qtyUsed * m.unitCost, landingValue: m.qtyOnHand * m.unitCost }))

//   const usageTotal = rows.reduce((n, r) => n + r.usageCost, 0)
//   const landingTotal = rows.reduce((n, r) => n + r.landingValue, 0)

//   const columns = [
//     { key: 'name', label: 'Raw material / recipe', width: 250 },
//     { key: 'unit', label: 'Unit', width: 110 },
//     { key: 'qtyUsed', label: 'Qty used', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qtyUsed) },
//     { key: 'unitCost', label: 'Unit landing cost', width: 165, align: 'right', mono: true, render: (r) => money(r.unitCost) },
//     { key: 'usageCost', label: 'Usage cost', width: 175, align: 'right', mono: true, render: (r) => money(r.usageCost) },
//     { key: 'qtyOnHand', label: 'Qty on hand', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qtyOnHand) },
//     { key: 'landingValue', label: 'Landing value on hand', width: 200, align: 'right', mono: true, render: (r) => money(r.landingValue) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Total Cost for Selected Recipes'}
//       icon={leaf?.icon}
//       description="Select multiple raw materials or recipes and compute their combined landing and usage cost over a date range, to evaluate production feasibility before final approval."
//       filters={[
//         { key: 'factory', label: 'Factory', type: 'select', options: factories },
//         { key: 'from', label: 'Date from', type: 'date' },
//         { key: 'to', label: 'Date to', type: 'date' },
//       ]}
//       generateLabel="Recalculate"
//       stats={[
//         { label: 'Materials selected', value: `${selected.length}/${recipeCostPool.length}` },
//         { label: 'Combined usage cost', value: moneyShort(usageTotal) },
//         { label: 'Landing value on hand', value: moneyShort(landingTotal) },
//         { label: 'Combined total', value: moneyShort(usageTotal + landingTotal) },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ name: 'Total', usageCost: money(usageTotal), landingValue: money(landingTotal) }}
//       tableTitle="Selected materials"
//       emptyTitle="No materials selected"
//       emptyDescription="Tick at least one material above to compute a combined cost."
//       footnote="Usage cost reflects quantity consumed within the selected date range. Landing value reflects the cost of stock currently on hand."
//     >
//       <Panel
//         title="Select materials"
//         description="Tick every raw material or recipe to include in the calculation."
//         actions={
//           <Button
//             variant="secondary"
//             size="sm"
//             iconLeft={allOn ? 'square' : 'check-check'}
//             onClick={() => setSelected(allOn ? [] : recipeCostPool.map((m) => m.key))}
//           >
//             {allOn ? 'Clear all' : 'Select all'}
//           </Button>
//         }
//       >
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
//           {recipeCostPool.map((m) => {
//             const on = selected.includes(m.key)
//             return (
//               <div
//                 key={m.key}
//                 onClick={() => toggle(m.key)}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer',
//                   background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
//                   border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
//                   borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
//                 }}
//               >
//                 <Checkbox checked={on} onChange={() => toggle(m.key)} />
//                 <div style={{ minWidth: 0, flex: 1 }}>
//                   <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
//                   <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>
//                     {fmt(m.qtyUsed)} {m.unit.toLowerCase()} used · {money(m.unitCost)}/unit
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </Panel>

//       {rows.some((r) => r.qtyOnHand < r.qtyUsed) && (
//         <Callout tone="warning" icon="triangle-alert" title="Consumption exceeds stock on hand">
//           One or more selected materials were consumed faster than the quantity currently held. Confirm
//           replenishment before approving a production run that depends on them.
//         </Callout>
//       )}
//     </ReportShell>
//   )
// }
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Checkbox } from '../../ds/components/forms/Checkbox.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, FieldSet } from '../shells/Page.jsx'
import { money, moneyShort, fmt } from '../utils.js'
import FactoryApi from '../../api/FactoryApi.js'
import { useStore } from '../store.jsx'

const factoryApi = new FactoryApi()

const PAGE_SIZE = 12

// Paged<T> -> rows. Same shape the Stock Register reads.
const pageRows = (res) => {
  const p = res?.data
  return Array.isArray(p) ? p : p?.items ?? p?.content ?? []
}

export default function TotalCostSelectedRecipes({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  // Filters
  const [factoryId, setFactoryId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // Recipe picker (server-paged). `selected` is keyed by recipe id and survives page changes.
  const [recipes, setRecipes] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(null)
  const [loadingRecipes, setLoadingRecipes] = useState(false)
  const [selected, setSelected] = useState({})

  // Result of the last calculation
  const [results, setResults] = useState(null) // null = nothing calculated yet
  const [calculating, setCalculating] = useState(false)

  const factoryOptions = useMemo(
    () => factories.map((f) => ({ value: f.id, label: f.name })),
    [factories],
  )

  const selectedList = Object.values(selected)

  function changeFactory(id) {
    setFactoryId(id)
    setPage(0)
    setTotalPages(null)
    setRecipes([])
    setSelected({})
    setResults(null)
  }

  // Load one page of the factory's recipes.
  useEffect(() => {
    if (!factoryId) return
    let cancelled = false
    setLoadingRecipes(true)
    factoryApi
      .listRecipes({ locationId: factoryId, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const list = pageRows(res)
        setRecipes(list)
        const tp = res?.data?.totalPages
        // No totalPages from the backend: a full page means there may be another one.
        setTotalPages(tp ?? (list.length === PAGE_SIZE ? page + 2 : page + 1))
      })
      .catch((e) => !cancelled && showToast('Could not load recipes', e.message, true))
      .finally(() => !cancelled && setLoadingRecipes(false))
    return () => { cancelled = true }
  }, [factoryId, page, showToast])

  const toggle = (r) =>
    setSelected((s) => {
      const next = { ...s }
      if (next[r.id]) delete next[r.id]
      else next[r.id] = { id: r.id, code: r.code, name: r.name }
      return next
    })

  const allOnPage = recipes.length > 0 && recipes.every((r) => selected[r.id])
  const togglePage = () =>
    setSelected((s) => {
      const next = { ...s }
      recipes.forEach((r) => {
        if (allOnPage) delete next[r.id]
        else next[r.id] = { id: r.id, code: r.code, name: r.name }
      })
      return next
    })

  const calculate = useCallback(async () => {
    if (!factoryId) return showToast('Select a factory', 'Choose the factory to calculate for.', true)
    if (!selectedList.length) return showToast('No recipes selected', 'Tick at least one recipe.', true)

    setCalculating(true)
    try {
    const res = await factoryApi.listProductionTotalCost({
  recipeIds: selectedList.map((r) => r.id),
})
      setResults(res?.data ?? [])
    } catch (e) {
      showToast('Could not calculate', e.message, true)
    } finally {
      setCalculating(false)
    }
  }, [factoryId, selectedList, showToast])

  const rows = (results ?? []).map((r) => ({
    key: r.recipe?.id,
    name: `${r.recipe?.code} · ${r.recipe?.name}`,
    qtyUsed: Number(r.qtyUsed) || 0,
    totalCost: Number(r.totalCost) || 0,
  }))
  const costTotal = rows.reduce((n, r) => n + r.totalCost, 0)

  const columns = [
    { key: 'name', label: 'Recipe', width: 320 },
    { key: 'qtyUsed', label: 'Qty used', width: 150, align: 'right', mono: true, render: (r) => fmt(r.qtyUsed) },
    { key: 'totalCost', label: 'Total cost', width: 200, align: 'right', mono: true, render: (r) => money(r.totalCost) },
  ]

  const hasNext = totalPages != null && page + 1 < totalPages

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Total Cost for Selected Recipes'}
      icon={leaf?.icon}
      description="Select multiple recipes and compute their combined cost over a date range, to evaluate production feasibility before final approval."
      stats={[
        { label: 'Recipes selected', value: selectedList.length },
        { label: 'Recipes costed', value: results ? rows.length : '—' },
        { label: 'Combined total cost', value: results ? moneyShort(costTotal) : '—' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ name: 'Total', totalCost: money(costTotal) }}
      tableTitle="Selected recipes"
      emptyTitle={results ? 'No usage found' : 'Nothing calculated yet'}
      emptyDescription={
        results
          ? 'None of the selected recipes were used in this period.'
          : 'Choose a factory, tick the recipes, then press Recalculate.'
      }
      footnote="Total cost reflects the cost of the quantity consumed within the selected date range."
    >
      {(calculating || loadingRecipes) && (
        <Loader overlay label={calculating ? 'Calculating…' : 'Loading recipes…'} />
      )}
<Panel title="Factory" description="Pick the factory whose recipes you want to cost.">
  <FieldSet columns={3}>
    <Select
      label="Factory"
      options={factoryOptions}
      value={factoryId}
      placeholder="Select factory…"
      onChange={(e) => changeFactory(e.target.value)}
    />
  </FieldSet>
  <div style={{ marginTop: 14 }}>
    <Button onClick={calculate}>Recalculate</Button>
  </div>
</Panel>
      {/* <Panel title="Filters" description="Pick the factory and the period to calculate over.">
        <FieldSet columns={3}>
          <Select
            label="Factory"
            options={factoryOptions}
            value={factoryId}
            placeholder="Select factory…"
            onChange={(e) => changeFactory(e.target.value)}
          />
          <Input label="Date from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="Date to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <Button onClick={calculate}>Recalculate</Button>
        </div>
      </Panel> */}

      <Panel
        title="Select recipes"
        description="Tick every recipe to include. Selections are kept as you move between pages."
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="secondary"
              size="sm"
              iconLeft={allOnPage ? 'square' : 'check-check'}
              onClick={togglePage}
              disabled={!recipes.length}
            >
              {allOnPage ? 'Clear page' : 'Select page'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelected({})}
              disabled={!selectedList.length}
            >
              Clear all ({selectedList.length})
            </Button>
          </div>
        }
      >
        {!factoryId ? (
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            Select a factory to see its recipes.
          </div>
        ) : !loadingRecipes && recipes.length === 0 ? (
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            This factory has no recipes.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
            {recipes.map((r) => {
              const on = !!selected[r.id]
              return (
                <div
                  key={r.id}
                  onClick={() => toggle(r)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer',
                    background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                    border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                    borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                  }}
                >
                  {/* the row's onClick does the toggling, so a click on the box itself isn't counted twice */}
                  <Checkbox checked={on} onChange={() => {}} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{r.code}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {factoryId && (page > 0 || hasNext) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            <Button variant="secondary" size="sm" iconLeft="chevron-left" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              Page {page + 1}{totalPages ? ` of ${totalPages}` : ''}
            </span>
            <Button variant="secondary" size="sm" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </Panel>
    </ReportShell>
  )
}