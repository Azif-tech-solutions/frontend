import { useState, useEffect } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { IconButton } from '../../ds/components/core/IconButton.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { factories, rawMaterials, suppliers as sampleSuppliers, manufacturers as sampleManufacturers, recentDeliveries } from '../sample.js'
import { unitOptions } from '../unitOptions.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'

const makeColumns = (unitList, manufacturerList) => [
  { key: 'material', label: 'Raw material / recipe', type: 'select', options: rawMaterials, width: 240, placeholder: 'Select material…' },
  { key: 'qty', label: 'Qty arrived', type: 'number', width: 130, placeholder: '0' },
  { key: 'unit', label: 'Unit', type: 'select', options: unitList, width: 130, placeholder: 'Unit…' },
  { key: 'manufacturer', label: 'Manufacturer', type: 'select', options: manufacturerList, width: 210, placeholder: 'Select…' },
  { key: 'mfgDate', label: 'Manufactured', type: 'date', width: 160 },
  { key: 'expiry', label: 'Expiry date', type: 'date', width: 160 },
  { key: 'unitCost', label: 'Unit cost (₦)', type: 'number', width: 150, placeholder: '0.00' },
  { key: 'lineTotal', label: 'Line total (₦)', type: 'static', align: 'right', width: 150 },
]

const blank = () => ({ id: Math.random().toString(36).slice(2), material: '', qty: '', unit: '', manufacturer: '', mfgDate: '', expiry: '', unitCost: '' })

export default function StockRefillRaw({ leaf, moduleLabel, parentLabel, onNavigate, draftId }) {
  const { peekRef, issueRef, showToast, user, suppliers: ownSuppliers, manufacturers: ownManufacturers, units, refills, postRefill, refillDrafts, saveDraft, deleteDraft } = useStore()
  // Registered manufacturers take precedence; the sample list is the fallback.
  const manufacturerOptions = ownManufacturers.length
    ? ownManufacturers.map((m) => ({ value: m.id, label: m.name }))
    : sampleManufacturers
  const columns = makeColumns(unitOptions(units), manufacturerOptions)
  // Registered suppliers take precedence; the sample list is the fallback.
  const supplierOptions = ownSuppliers.length
    ? ownSuppliers.map((s) => ({ value: s.id, label: s.name }))
    : sampleSuppliers
  // Arriving from Saved Drafts with a draft to resume — load its lines instead of a blank form.
  const [rows, setRows] = useState(() => {
    const opened = draftId && refillDrafts.find((d) => d.id === draftId)
    return opened ? opened.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })) : [blank()]
  })
  // Consume the draft once, on mount, so the resumed lines are not left duplicated in the list.
  useEffect(() => {
    if (draftId && refillDrafts.some((d) => d.id === draftId)) deleteDraft(draftId)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once for the draft this screen was opened with
  }, [])
  const drafts = refillDrafts.filter((d) => d.kind === 'raw')
  const goToDrafts = () => onNavigate?.({ id: 'f.refill.drafts', view: 'f.refill.drafts', label: 'Saved Drafts' })
  // Deliveries posted on this account, newest first — persisted in the store, each carries the reference it consumed.
  const posted = refills
    .filter((r) => r.kind === 'raw')
    .map((r) => ({ ref: r.ref, material: r.title, qty: r.qty, when: fmtDate(new Date(r.at).toISOString()), by: r.by }))

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const total = Number(r.qty) * Number(r.unitCost)
    return { ...r, lineTotal: total ? total.toLocaleString(undefined, { minimumFractionDigits: 2 }) : undefined }
  })

  const lines = rows.filter((r) => r.material).length
  const value = rows.reduce((n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0), 0)
  const missingExpiry = rows.some((r) => r.material && !r.expiry)

  // Reserved for display only. The number is consumed when the delivery is posted,
  // so an abandoned form never leaves a gap in the series.
  const nextRef = peekRef('DL')

  const stash = () => {
    const filled = rows.filter((r) => r.material || r.qty || r.unitCost || r.manufacturer || r.expiry)
    if (!filled.length) {
      showToast('Nothing to save', 'Add at least one line before saving a draft.', true)
      return
    }
    const qty = filled.reduce((n, r) => n + (Number(r.qty) || 0), 0)
    const label = rawMaterials.find((m) => m.value === filled[0].material)?.label || 'Unnamed material'
    saveDraft('raw', {
      rows: filled,
      title: filled.length === 1 ? label : `${label} +${filled.length - 1} more`,
      lines: filled.length,
      units: qty,
      by: user.name || user.email || 'Administrator',
    })
    showToast('Draft saved', 'Find it under "Saved drafts" on this screen, or in Stock Refill › Saved Drafts.')
    setRows([blank()])
  }

  const resume = (draft) => {
    setRows(draft.rows.map((r) => ({ ...r, id: Math.random().toString(36).slice(2) })))
    deleteDraft(draft.id)
    showToast('Draft reopened', `${draft.lines} line${draft.lines === 1 ? '' : 's'} restored — no reference is issued until you post.`)
  }

  const post = () => {
    const valid = rows.filter((r) => r.material && Number(r.qty) > 0)
    if (!valid.length) {
      showToast('Nothing to post', 'Add at least one material line with a quantity.', true)
      return
    }
    const ref = issueRef('DL')
    const qty = valid.reduce((n, r) => n + Number(r.qty), 0)
    const label = rawMaterials.find((m) => m.value === valid[0].material)?.label || 'Raw material'
    postRefill('raw', {
      ref,
      title: valid.length === 1 ? label : `${label} +${valid.length - 1} more`,
      qty: `+${qty.toLocaleString()}`,
      lines: valid.map(({ material, qty: q, unit, manufacturer, mfgDate, expiry, unitCost }) => ({ material, qty: q, unit, manufacturer, mfgDate, expiry, unitCost })),
      by: user.name || user.email || 'Administrator',
    })
    showToast(`Delivery posted — ${ref}`, `${valid.length} line${valid.length === 1 ? '' : 's'} received`)
    setRows([blank()])
  }

  return (
    <FormShell
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Refill — Raw Material'}
      icon={leaf?.icon}
      description="Receive raw materials and recipes on arrival. Capture the quantity delivered along with manufacturer, manufactured date and expiry date for each line."
      submitLabel="Receive delivery"
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
          <Select label="Receiving factory" options={factories} placeholder="Select factory…" />
          <Select label="Supplier" options={supplierOptions} placeholder="Select supplier…" />
          <Input label="Date received" type="date" />
          <Input label="Supplier waybill / invoice no." placeholder="e.g. ACL-99231" />
          <Input label="Vehicle / driver" placeholder="Optional" />
          <Input label="Reference no." hint="Issued automatically when the delivery is posted." disabled value={nextRef} />
        </FieldSet>
      </Panel>

      <Panel
        title="Materials received"
        description="One line per material. Manufacturer, manufactured date and expiry are captured per line."
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
          <span style={{ font: 'var(--type-ui)', color: 'var(--text-muted)' }}>K. Umeh · Quality Control · Factory A</span>
        </div>
      </Panel>
    </FormShell>
  )
}
