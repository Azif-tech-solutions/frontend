import { useState, useEffect, useRef } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()

const MODES = [
  { value: 'delta', label: 'Adjust by quantity', icon: 'diff' },
  { value: 'count', label: 'Enter counted quantity', icon: 'clipboard-check' },
]

// Values match the `reason` union in quantityAdjustmentCredentials.
const REASONS = [
  { value: 'DAMAGED_BROKEN', label: 'Damaged / broken' },
  { value: 'EXPIRED_WRITEOFF', label: 'Expired write-off' },
  { value: 'MISCOUNT_CORRECTION', label: 'Miscount correction' },
  { value: 'STOCKTAKE_VARIANCE', label: 'Stocktake variance' },
  { value: 'UNRECORDED_RETURN', label: 'Unrecorded return' },
  { value: 'SUSPECTED_THEFT', label: 'Suspected theft' },
  { value: 'OTHER', label: 'Other' },
]
const reasonLabel = (v) => REASONS.find((r) => r.value === v)?.label || v

const blank = () => ({ id: Math.random().toString(36).slice(2), item: '', delta: '', counted: '', reason: '', note: '' })
const signed = (n) => `${n > 0 ? '+' : ''}${n.toLocaleString()}`

export default function QuantityAdjustment({ leaf, moduleLabel, parentLabel }) {
  const { showToast, user, factories, categories, units, refills, postRefill } = useStore()

  const [mode, setMode] = useState('delta')
  const [factoryId, setFactoryId] = useState('')
  const [rows, setRows] = useState([blank()])
  const [items, setItems] = useState([]) // this factory's finished products + raw materials
  const [itemsLoading, setItemsLoading] = useState(false)
  const [reloadKey, setReloadKey] = useState(0) // bump to re-request the items (refreshes "Recorded qty")
  const [posting, setPosting] = useState(false)
  const isCount = mode === 'count'

  // Name lookups for toStoreProduct, read through a ref so a change to the unit
  // or category lists doesn't trigger a new request.
  const lookupsRef = useRef(null)
  lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

  // Load both item types for the chosen factory.
// Load both item types for the chosen factory (paginated under the hood).
useEffect(() => {
  if (!factoryId) {
    setItems([])
    return
  }

  let cancelled = false
  setItemsLoading(true)

  const loadAllOfType = async (itemType) => {
    let page = 0
    let all = []
    let hasMore = true

    while (hasMore && !cancelled) {
      const { data } = await inventoryApi.listStockItems(factoryId, itemType, {
        page,
        size: 50,
      })

      const pageItems = data?.items ?? data ?? []
      all = [...all, ...pageItems]
      hasMore = data?.totalPages != null
        ? (data.page + 1) < data.totalPages
        : pageItems.length === 50

      page++
    }

    return all
  }

  Promise.all([
    loadAllOfType('FINISHED_PRODUCT'),
    loadAllOfType('RAW_MATERIAL'),
  ])
    .then(([fin, raw]) => {
      if (cancelled) return
      const all = [...fin, ...raw]
      setItems(all.map((i) => inventoryApi.toStoreProduct(i, lookupsRef.current)))
    })
    .catch((error) => {
      if (!cancelled) showToast('Could not load items', error.message, true)
    })
    .finally(() => {
      if (!cancelled) setItemsLoading(false)
    })

  return () => { cancelled = true }
}, [factoryId, reloadKey, showToast])
  // The item list belongs to one factory, so a new factory clears the old list
  // and any item already picked on the lines.
  const changeFactory = (id) => {
    setFactoryId(id)
    setItems([])
    setRows((rs) => rs.map((r) => ({ ...r, item: '' })))
  }

  const itemOptions = items.map((p) => ({
    value: p.id,
    label: `${p.name} · ${p.kind === 'raw' ? 'Raw material' : 'Finished'}`,
  }))
  const itemById = Object.fromEntries(items.map((p) => [p.id, p]))

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  // Numbers per line: recorded stock, the change, and the resulting quantity.
  const calc = rows.map((r) => {
    const it = itemById[r.item]
    const recorded = it ? Number(it.quantity ?? 0) : undefined
    const delta = isCount
      ? (r.counted !== '' && recorded !== undefined ? Number(r.counted) - recorded : undefined)
      : (r.delta !== '' ? Number(r.delta) : undefined)
    const newQty = recorded !== undefined && delta !== undefined ? recorded + delta : undefined
    return { recorded, delta, newQty }
  })

  const decorated = rows.map((r, i) => {
    const { recorded, delta, newQty } = calc[i]
    return {
      ...r,
      recorded: recorded?.toLocaleString(),
      variance: delta === undefined ? undefined : signed(delta),
      newQty: newQty?.toLocaleString(),
    }
  })

  // Stock can't go below zero.
  const errors = rows.map((r, i) => {
    const { recorded, newQty } = calc[i]
    if (newQty === undefined || newQty >= 0) return null
    return {
      field: isCount ? 'counted' : 'delta',
      message: `This would take stock below zero (${recorded.toLocaleString()} recorded).`,
    }
  })

  const columns = [
    { key: 'item', label: 'Product / material', type: 'select', options: itemOptions, width: 270, placeholder: factoryId ? 'Select item…' : 'Select factory first' },
    { key: 'recorded', label: 'Recorded qty', type: 'static', align: 'right', width: 130 },
    isCount
      ? { key: 'counted', label: 'Counted qty', type: 'number', width: 140, placeholder: '0' }
      : { key: 'delta', label: 'Adjustment (± )', type: 'number', width: 140, placeholder: '0' },
    { key: isCount ? 'variance' : 'newQty', label: isCount ? 'Variance' : 'New quantity', type: 'static', align: 'right', width: 130 },
    { key: 'reason', label: 'Reason *', type: 'select', options: REASONS, width: 220, placeholder: 'Select reason…' },
    { key: 'note', label: 'Note', type: 'text', width: 240, placeholder: 'Optional detail' },
  ]

  const active = rows.filter((r) => r.item)
  const deltas = calc.filter((c, i) => rows[i].item && c.delta !== undefined).map((c) => c.delta)
  const increases = deltas.filter((d) => d > 0).length
  const decreases = deltas.filter((d) => d < 0).length
  const net = deltas.reduce((n, d) => n + d, 0)
  const missingReason = rows.some((r) => r.item && !r.reason)
  const blocked = errors.some(Boolean)

  const recordedBy = user.name || user.email || 'Administrator'

  // Adjustments posted on this account, newest first — persisted in the store.
  const posted = refills
    .filter((r) => r.kind === 'adjustment')
    .map((r) => ({
      ref: r.ref,
      item: r.title,
      reason: reasonLabel(r.reason),
      when: fmtDate(new Date(r.at).toISOString()),
      by: r.by,
      change: r.change,
    }))

  const post = async () => {
    if (!factoryId) {
      showToast('Select a factory', 'Choose the factory whose stock is being adjusted.', true)
      return
    }
    if (missingReason) {
      showToast('Reason required', 'Every line needs a reason before it can be posted.', true)
      return
    }
    if (blocked) {
      showToast('Adjustment blocked', 'One or more lines would take stock below zero.', true)
      return
    }
    // Lines with no change (or an unfinished quantity) have nothing to post.
    const valid = rows
      .map((line, i) => ({ line, ...calc[i] }))
      .filter((x) => x.line.item && x.delta !== undefined && x.delta !== 0)
    if (!valid.length) {
      showToast('Nothing to post', 'Add at least one line with a quantity change.', true)
      return
    }

    setPosting(true)
    const refs = []
    const failed = []

    // The endpoint takes one item per request, so every line is its own
    // adjustment with its own reference.
    for (const { line, delta } of valid) {
      const it = itemById[line.item]
      try {
        const res = await inventoryApi.createQuantityAdjustment({
          locationId: factoryId,
          stockItemId: line.item,
          mode: isCount ? 'COUNTED' : 'DELTA',
          direction: delta > 0 ? 'POSITIVE' : 'NEGATIVE',
          quantity: Math.abs(delta),
          countedQuantity: isCount ? Number(line.counted) : undefined,
          reason: line.reason,
          note: line.note.trim(),
          otpChallengeId: null,
        })
        const done = res.data
        const change = done.direction === 'NEGATIVE' ? -Number(done.quantity) : Number(done.quantity)

        // Save the server's result into the store, keyed by the reference it issued.
        postRefill('adjustment', {
          ref: done.ref,
          title: done.productName || it?.name || 'Item',
          change,
          reason: done.reason || line.reason,
          by: done.performedByName || recordedBy,
        })
        refs.push(done.ref)
      } catch (error) {
        failed.push({ line, name: it?.name || 'A line', reason: error.message })
      }
    }
    setPosting(false)

    if (refs.length) setReloadKey((k) => k + 1) // refresh the "Recorded qty" figures

    if (!failed.length) {
      showToast(
        refs.length === 1 ? `Adjustment posted — ${refs[0]}` : `${refs.length} adjustments posted`,
        refs.length === 1 ? 'Stock updated' : `${refs[0]} … ${refs[refs.length - 1]}`
      )
      setRows([blank()])
      return
    }

    // The lines that posted are already saved, so only the failed ones stay on the form.
    showToast(
      refs.length ? `${refs.length} posted, ${failed.length} failed` : 'Adjustment failed',
      `${failed[0].name}: ${failed[0].reason}${failed.length > 1 ? ` (+${failed.length - 1} more)` : ''}`,
      true
    )
    setRows(failed.map((f) => f.line))
  }

  return (
    <>
      {posting && <Loader overlay label="Posting adjustment…" />}
      <FormShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Quantity Adjustment'}
        icon={leaf?.icon}
        description="Correct the live quantity of finished products or raw materials, positively or negatively. Useful during stock taking, where recorded stock differs from actual stock on hand."
        submitLabel="Post adjustment"
        loading={posting}
        onCancel={() => setRows([blank()])}
        onSubmit={post}
        note="Every line is logged with its reason, a timestamp, and your identity, and is reflected immediately in the Bin Card and stock reports."
        aside={
          <>
            <Panel title="Adjustment summary">
              <MetaRow label="Lines" value={active.length || '—'} mono />
              <MetaRow label="Increases" value={increases || '—'} mono tone={increases ? 'positive' : undefined} />
              <MetaRow label="Decreases" value={decreases || '—'} mono tone={decreases ? 'negative' : undefined} />
              <MetaRow
                label="Net change"
                value={net ? signed(net) : '—'}
                mono
                tone={net > 0 ? 'positive' : net < 0 ? 'negative' : undefined}
              />
              {missingReason && (
                <Callout tone="warning" icon="circle-alert" style={{ marginTop: 14 }}>
                  A reason is required on every line. Lines without one will block submission.
                </Callout>
              )}
              {blocked && (
                <Callout tone="danger" icon="circle-alert" title="Adjustment blocked" style={{ marginTop: 14 }}>
                  One or more lines would take stock below zero.
                </Callout>
              )}
            </Panel>

            <Panel title="Recent adjustments" padding={0}>
              <div style={{ padding: '4px 16px 12px' }}>
                {posted.length === 0 && (
                  <div style={{ padding: '12px 0', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                    No adjustments posted yet.
                  </div>
                )}
                {posted.map((a) => (
                  <div key={a.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.item}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{a.ref} · {a.reason} · {a.when} · {a.by}</div>
                    </div>
                    <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: a.change > 0 ? 'var(--success)' : 'var(--danger)', flexShrink: 0 }}>
                      {signed(a.change)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </>
        }
      >
        <Panel title="Adjustment details">
          <FieldSet columns={3}>
            <Select
              label="Factory"
              value={factoryId}
              onChange={(e) => changeFactory(e.target.value)}
              options={factories.map((f) => ({ value: f.id, label: f.name }))}
              placeholder="Select factory…"
            />
            <Input label="Adjustment date" type="date" />
            <Input label="Reference no." hint="Issued automatically when the adjustment is posted." disabled value="" placeholder="Assigned when posted" />
          </FieldSet>
        </Panel>

        <Panel
          title="Items"
          description={isCount
            ? 'Enter the quantity physically counted. The system derives the variance against recorded stock.'
            : 'Enter the quantity to add or remove. Use a negative number to reduce stock.'}
          actions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
        >
          {itemsLoading && <Loader label="Loading items…" size={28} />}
          <LineItems
            columns={columns}
            rows={decorated}
            errors={errors}
            onChange={update}
            onAdd={() => setRows((rs) => [...rs, blank()])}
            onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
            addLabel="Add item"
            emptyLabel="No items added yet."
            summary={[
              { label: 'Lines', value: active.length },
              { label: 'Net change', value: net ? signed(net) : '0' },
            ]}
          />
        </Panel>
      </FormShell>
    </>
  )
}