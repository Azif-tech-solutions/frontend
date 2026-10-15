import { useState, useEffect, useRef } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { IconButton } from '../../ds/components/core/IconButton.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { unitOptions } from '../unitOptions.js'
import { categoryOptions } from '../categoryOptions.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()

const blank = () => ({ id: Math.random().toString(36).slice(2), material: '', qty: '', manufacturer: '', mfgDate: '', expiry: '', unitCost: '' })

export default function StockRefillRaw({ leaf, moduleLabel, parentLabel, onNavigate, draftId }) {
  const {
    showToast, user, company, units, categories, factories,
    suppliers, manufacturers,
    refills, postRefill, refillDrafts, saveDraft, deleteDraft,
  } = useStore()
  const recentDeliveries = []

  // Opened from Saved Drafts: start on the factory / supplier / manufacturer the draft was saved against.
  const openedDraft = draftId && refillDrafts.find((d) => d.id === draftId)
  const [factoryId, setFactoryId] = useState(() => openedDraft?.factoryId || '')
  const [supplierId, setSupplierId] = useState(() => openedDraft?.supplierId || '')
  const [manufacturerId, setManufacturerId] = useState(() => openedDraft?.manufacturerId || '')
  const [items, setItems] = useState([]) // this factory's raw materials, in the store's product shape
  const [reloadKey, setReloadKey] = useState(0)
  const [notes, setNotes] = useState('')
  const [posting, setPosting] = useState(false)

  const materialOptions = items.map((p) => ({ value: p.id, label: p.name }))
  const supplierOptions = suppliers.map((s) => ({ value: s.id, label: s.name }))
  const manufacturerOptions = manufacturers.map((m) => ({ value: m.id, label: m.name }))

  const columns = [
    { key: 'material', label: 'Raw material / recipe', type: 'select', options: materialOptions, width: 240, placeholder: 'Select material…' },
    { key: 'onHand', label: 'On hand', type: 'static', align: 'right', width: 110 },
    { key: 'qty', label: 'Qty arrived', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 100 },
    { key: 'manufacturer', label: 'Manufacturer', type: 'select', options: manufacturerOptions, width: 210, placeholder: 'Use default' },
    { key: 'mfgDate', label: 'Manufactured', type: 'date', width: 160 },
    { key: 'expiry', label: 'Expiry date', type: 'date', width: 160 },
    { key: 'unitCost', label: 'Unit cost (₦)', type: 'number', width: 150, placeholder: '0.00' },
    { key: 'lineTotal', label: 'Line total (₦)', type: 'static', align: 'right', width: 150 },
  ]

  // Arriving from Saved Drafts with a draft to resume — load its lines instead of a blank form.
  const [rows, setRows] = useState(() =>
    openedDraft ? openedDraft.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })) : [blank()]
  )
  // Consume the draft once, on mount, so the resumed lines are not left duplicated in the list.
  useEffect(() => {
    if (draftId && refillDrafts.some((d) => d.id === draftId)) deleteDraft(draftId)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once for the draft this screen was opened with
  }, [])

  // Name lookups for toStoreProduct, read through a ref so a change to the unit
  // or category lists doesn't trigger a new request.
  const lookupsRef = useRef(null)
  lookupsRef.current = { factories, categories: categoryOptions(categories), units: unitOptions(units) }

  // Load the raw materials of the chosen factory.
// Load the raw materials of the chosen factory (paginated under the hood).
useEffect(() => {
  if (!factoryId) {
    setItems([])
    return
  }

  let cancelled = false

  const loadAllMaterials = async () => {
    let page = 0
    let all = []
    let hasMore = true

    while (hasMore && !cancelled) {
      const { data } = await inventoryApi.listStockItems(factoryId, 'RAW_MATERIAL', {
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

  loadAllMaterials().catch((error) => {
    if (!cancelled) showToast('Could not load materials', error.message, true)
  })

  return () => { cancelled = true }
}, [factoryId, reloadKey, showToast])
  // The material list belongs to one factory, so a new factory clears the old
  // list and any material already picked on the lines.
  const changeFactory = (id) => {
    setFactoryId(id)
    setItems([])
    setRows((rs) => rs.map((r) => ({ ...r, material: '' })))
  }

  const drafts = refillDrafts.filter((d) => d.kind === 'raw')
  const goToDrafts = () => onNavigate?.({ id: 'f.refill.drafts', view: 'f.refill.drafts', label: 'Saved Drafts' })

  // Deliveries posted on this account, newest first — persisted in the store, each carries the reference it consumed.
  const posted = refills
    .filter((r) => r.kind === 'raw')
    .map((r) => ({ ref: r.ref, material: r.title, qty: r.qty, when: fmtDate(new Date(r.at).toISOString()), by: r.by }))

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const itemById = Object.fromEntries(items.map((p) => [p.id, p]))
  const decorated = rows.map((r) => {
    const item = itemById[r.material]
    const onHand = item ? Number(item.quantity ?? 0) : undefined
    const total = Number(r.qty) * Number(r.unitCost)
    return {
      ...r,
      onHand: onHand === undefined ? undefined : onHand.toLocaleString(),
      unit: item ? (item.unit || '—') : undefined,
      lineTotal: total ? total.toLocaleString(undefined, { minimumFractionDigits: 2 }) : undefined,
    }
  })

  const lines = rows.filter((r) => r.material).length
  const value = rows.reduce((n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0), 0)
  const missingExpiry = rows.some((r) => r.material && !r.expiry)

  const recordedBy = user.name || user.email || 'Administrator'
  const recordedRole = user.role || 'Administrator'

  const stash = () => {
    const filled = rows.filter((r) => r.material || r.qty || r.unitCost || r.manufacturer || r.expiry)
    if (!filled.length) {
      showToast('Nothing to save', 'Add at least one line before saving a draft.', true)
      return
    }
    const qty = filled.reduce((n, r) => n + (Number(r.qty) || 0), 0)
    const label = materialOptions.find((m) => m.value === filled[0].material)?.label || 'Unnamed material'
    saveDraft('raw', {
      rows: filled,
      factoryId,   // so resuming brings back this factory's material list
      supplierId,
      manufacturerId,
      title: filled.length === 1 ? label : `${label} +${filled.length - 1} more`,
      lines: filled.length,
      units: qty,
      by: recordedBy,
    })
    showToast('Draft saved', 'Find it under "Saved drafts" on this screen, or in Stock Refill › Saved Drafts.')
    setRows([blank()])
  }

  const resume = (draft) => {
    setRows(draft.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })))
    if (draft.factoryId) setFactoryId(draft.factoryId)
    if (draft.supplierId) setSupplierId(draft.supplierId)
    if (draft.manufacturerId) setManufacturerId(draft.manufacturerId)
    deleteDraft(draft.id)
    showToast('Draft reopened', `${draft.lines} line${draft.lines === 1 ? '' : 's'} restored — no reference is issued until you post.`)
  }

  const post = async () => {
    if (!factoryId) {
      showToast('Select a factory', 'Choose the factory receiving this delivery.', true)
      return
    }
    if (!supplierId) {
      showToast('Select a supplier', 'Choose who supplied these materials.', true)
      return
    }
    const valid = rows.filter((r) => r.material && Number(r.qty) > 0)
    if (!valid.length) {
      showToast('Nothing to post', 'Add at least one material line with a quantity.', true)
      return
    }
    // A line's own manufacturer wins; otherwise the default from Delivery details is used.
    const noManufacturer = valid.find((r) => !(r.manufacturer || manufacturerId))
    if (noManufacturer) {
      const name = itemById[noManufacturer.material]?.name || 'A line'
      showToast('Manufacturer missing', `Select a manufacturer for ${name}, or set a default above.`, true)
      return
    }

    setPosting(true)
    const refs = []
    const failed = []
    let qtyTotal = 0

    // The endpoint takes one material per request, so every line is its own
    // delivery with its own reference. Unit, waybill, vehicle, QC and received
    // date stay on the form only.
    for (const line of valid) {
      const item = itemById[line.material]
      const lineManufacturer = line.manufacturer || manufacturerId
      try {
        const res = await inventoryApi.refillRawMaterials({
          locationId: factoryId,
          stockItemId: line.material,
          supplierId,
          manufacturerId: lineManufacturer,
          quantity: Number(line.qty),
          unitCost: Number(line.unitCost) || 0,
          manufacturedDate: line.mfgDate || undefined,
          expiryDate: line.expiry || undefined,
          note: notes.trim(),
        })
        const done = res.data
        const qty = Number(done?.quantity ?? line.qty)

        postRefill('raw', {
          ref: done.ref,
          title: item?.name || 'Raw material',
          qty: `+${qty.toLocaleString()}${item?.unit ? ` ${item.unit}` : ''}`,
          lines: [{
            material: line.material, qty, supplierId, manufacturer: lineManufacturer,
            mfgDate: line.mfgDate, expiry: line.expiry, unitCost: line.unitCost,
          }],
          by: recordedBy,
        })
        refs.push(done.ref)
        qtyTotal += qty
      } catch (error) {
        failed.push({ line, name: item?.name || 'A line', reason: error.message })
      }
    }
    setPosting(false)

    if (refs.length) setReloadKey((k) => k + 1) // refresh the "On hand" figures

    if (!failed.length) {
      showToast(
        refs.length === 1 ? `Delivery posted — ${refs[0]}` : `${refs.length} deliveries posted`,
        refs.length === 1
          ? `${qtyTotal.toLocaleString()} received`
          : `${refs[0]} … ${refs[refs.length - 1]} · ${qtyTotal.toLocaleString()} received`
      )
      setRows([blank()])
      setNotes('')
      return
    }

    // Lines that posted are already saved, so only the failed ones stay on the form for a retry.
    showToast(
      refs.length ? `${refs.length} posted, ${failed.length} failed` : 'Delivery failed',
      `${failed[0].name}: ${failed[0].reason}${failed.length > 1 ? ` (+${failed.length - 1} more)` : ''}`,
      true
    )
    setRows(failed.map((f) => f.line))
  }

  return (
    <FormShell
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Refill — Raw Material'}
      icon={leaf?.icon}
      description="Receive raw materials and recipes on arrival. Capture the quantity delivered along with manufacturer, manufactured date and expiry date for each line."
      submitLabel="Receive delivery"
      loading={posting}
      onSubmit={post}
      onCancel={() => setRows([blank()])}
      note="Expiry dates drive shelf-life alerts and the Re-Order Report — record them on every line."
      secondaryAction={<Button variant="secondary" iconLeft="save" onClick={stash}>Save draft</Button>}
      aside={
        <>
          <Panel title="Delivery summary">
            <MetaRow label="Material lines" value={lines || '—'} mono />
            <MetaRow label="Delivery value" value={value ? `₦${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'} mono />
            <MetaRow label="Posts to" value="Factory raw store" />
            {missingExpiry && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 14, padding: 12, background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)' }}>
                <Icon name="calendar-off" size={14} color="var(--accent-amber-fg)" style={{ marginTop: 1 }} />
                <span style={{ font: 'var(--type-caption)', color: 'var(--accent-amber-fg)', lineHeight: 1.55 }}>
                  One or more lines are missing an expiry date. Shelf-life alerts will not fire for those materials.
                </span>
              </div>
            )}
          </Panel>

          {drafts.length > 0 && (
            <Panel
              title="Saved drafts"
              description="Held here until you post or discard them. No reference is issued to a draft."
              padding={0}
              actions={<Button variant="ghost" size="sm" iconLeft="external-link" onClick={goToDrafts}>View all</Button>}
            >
              <div style={{ padding: '4px 16px 12px' }}>
                {drafts.map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.title}</div>
                      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                        {d.lines} line{d.lines === 1 ? '' : 's'} · {d.units.toLocaleString()} · {fmtDate(new Date(d.savedAt).toISOString())}
                      </div>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => resume(d)}>Resume</Button>
                    <IconButton icon="trash-2" label="Discard draft" size="sm" onClick={() => deleteDraft(d.id)} />
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Recent deliveries" padding={0}>
            <div style={{ padding: '4px 16px 12px' }}>
              {[...posted, ...recentDeliveries].map((d) => (
                <div key={d.ref} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.material}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>{d.ref} · {d.when} · {d.by}</div>
                  </div>
                  <span style={{ font: 'var(--fw-bold) var(--text-xs)/1 var(--font-mono)', color: 'var(--success)', flexShrink: 0 }}>{d.qty}</span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Delivery details" description="Who supplied the materials, against which document, and when they arrived.">
        <FieldSet columns={3}>
          <Select
            label="Receiving factory"
            value={factoryId}
            onChange={(e) => changeFactory(e.target.value)}
            options={factories.map((f) => ({ value: f.id, label: f.name }))}
            placeholder="Select factory…"
          />
          <Select
            label="Supplier"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            options={supplierOptions}
            placeholder="Select supplier…"
          />
          <Select
            label="Manufacturer"
            value={manufacturerId}
            onChange={(e) => setManufacturerId(e.target.value)}
            options={manufacturerOptions}
            placeholder="Select manufacturer…"
          />
          <Input label="Date received" type="date" />
          <Input label="Supplier waybill / invoice no." placeholder="e.g. ACL-99231" />
          <Input label="Vehicle / driver" placeholder="Optional" />
          <Input label="Reference no." hint="Issued automatically when the delivery is posted." disabled value="" placeholder="Assigned when posted" />
        </FieldSet>
      </Panel>

      <Panel
        title="Materials received"
        description="One line per material. Manufacturer, manufactured date and expiry are captured per line; a blank manufacturer uses the default above."
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
            { label: 'Lines', value: lines },
            { label: 'Value', value: `₦${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
          ]}
        />
      </Panel>

      <Panel title="Quality check & notes" description="Record the condition of the delivery on arrival.">
        <FieldSet columns={2}>
          <Select label="QC outcome" options={[{ value: 'passed', label: 'Passed' }, { value: 'partial', label: 'Passed with exceptions' }, { value: 'rejected', label: 'Rejected' }]} placeholder="Select outcome…" />
          <Input label="Checked by" placeholder="Quality Control officer" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Two bags showed minor tearing; weight verified and accepted."
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge tone="neutral" uppercase>Received by</Badge>
          <span style={{ font: 'var(--type-ui)', color: 'var(--text-muted)' }}>
            {recordedBy} · {recordedRole}{company.name ? ` · ${company.name}` : ''}
          </span>
        </div>
      </Panel>
    </FormShell>
  )
}