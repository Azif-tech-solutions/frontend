import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { Page, Panel, MetaRow, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { finishedProducts, rawMaterials, manufacturers as sampleManufacturers } from '../sample.js'
import { unitOptions } from '../unitOptions.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'

const TABS = [
  { value: 'all', label: 'All drafts', icon: 'files' },
  { value: 'finished', label: 'Finished product', icon: 'package' },
  { value: 'raw', label: 'Raw material', icon: 'box' },
]

const KIND = {
  finished: { label: 'Finished product', tone: 'brand', view: 'f.refill.finished', id: 'f.refill.finished', screen: 'Stock Refill — Finished Product' },
  raw: { label: 'Raw material', tone: 'info', view: 'f.refill.raw', id: 'f.refill.raw', screen: 'Stock Refill — Raw Material' },
}

const labelOf = (options, value) => options.find((o) => o.value === value)?.label || value || '—'

/** Every field a draft line can carry, per kind — the full view holds nothing back. */
function lineColumns(kind, unitList, manufacturerList) {
  if (kind === 'finished') {
    return [
      { key: 'product', label: 'Finished product', width: 280, render: (r) => labelOf(finishedProducts, r.product) },
      { key: 'qty', label: 'Quantity', width: 130, align: 'right', mono: true, render: (r) => (r.qty ? Number(r.qty).toLocaleString() : '—') },
      { key: 'batch', label: 'Batch / lot no.', width: 170, render: (r) => r.batch || '—' },
    ]
  }
  return [
    { key: 'material', label: 'Raw material / recipe', width: 240, render: (r) => labelOf(rawMaterials, r.material) },
    { key: 'qty', label: 'Qty arrived', width: 120, align: 'right', mono: true, render: (r) => (r.qty ? Number(r.qty).toLocaleString() : '—') },
    { key: 'unit', label: 'Unit', width: 130, render: (r) => labelOf(unitList, r.unit) },
    { key: 'manufacturer', label: 'Manufacturer', width: 200, render: (r) => labelOf(manufacturerList, r.manufacturer) },
    { key: 'mfgDate', label: 'Manufactured', width: 140, render: (r) => r.mfgDate || '—' },
    { key: 'expiry', label: 'Expiry date', width: 140, render: (r) => r.expiry || '—' },
    { key: 'unitCost', label: 'Unit cost (₦)', width: 140, align: 'right', mono: true, render: (r) => (r.unitCost ? Number(r.unitCost).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—') },
  ]
}

/** Full view of one draft — every line and every field, with the actions that act on it. */
function DraftDetail({ draft, unitList, manufacturerList, onBack, onResume, onDiscard }) {
  const kind = KIND[draft.kind] || KIND.finished
  const columns = lineColumns(draft.kind, unitList, manufacturerList)
  const missingExpiry = draft.kind === 'raw' && draft.rows.some((r) => r.material && !r.expiry)
  const value = draft.kind === 'raw'
    ? draft.rows.reduce((n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0), 0)
    : 0

  return (
    <Page wide>
      <PageHeader
        crumbs={['Factory', 'Stock Refill', 'Saved Drafts']}
        icon="file-clock"
        title={draft.title}
        description={`Saved ${fmtDate(new Date(draft.savedAt).toISOString())} by ${draft.by}. Nothing here has been posted — no reference number is issued to a draft, and factory stock is untouched until you resume it and post.`}
        meta={<Badge tone={kind.tone}>{kind.label}</Badge>}
        actions={
          <>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to drafts</Button>
            <Button variant="secondary" iconLeft="trash-2" onClick={onDiscard}>Discard</Button>
            <Button iconLeft="arrow-right" onClick={onResume}>Resume in {kind.screen}</Button>
          </>
        }
      />

      <Callout tone="info" title="This draft is not posted">
        Resuming reopens these lines on {kind.screen} and removes the draft from this list. The reference number is
        issued only when you post there.
      </Callout>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20, alignItems: 'start' }}>
        <Panel title="Draft lines" description={`${draft.rows.length} line${draft.rows.length === 1 ? '' : 's'} saved, exactly as they were entered.`} padding={0}>
          <ReportTable
            columns={columns}
            rows={draft.rows}
            stickyHeader={false}
            emptyLabel="This draft has no lines."
            style={{ border: 'none', borderRadius: 0 }}
          />
        </Panel>

        <Panel title="Draft summary">
          <MetaRow label="Type" value={kind.label} />
          <MetaRow label="Lines" value={draft.rows.length} mono />
          <MetaRow label={draft.kind === 'raw' ? 'Total quantity' : 'Total units'} value={draft.units.toLocaleString()} mono />
          {draft.kind === 'raw' && <MetaRow label="Delivery value" value={value ? `₦${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'} mono />}
          <MetaRow label="Saved by" value={draft.by} />
          <MetaRow label="Saved on" value={fmtDate(new Date(draft.savedAt).toISOString())} />
          <MetaRow label="Reference no." value="Not yet issued" />
          {missingExpiry && (
            <div style={{ marginTop: 14 }}>
              <Badge tone="warning">Some lines have no expiry date</Badge>
            </div>
          )}
        </Panel>
      </div>
    </Page>
  )
}

/**
 * Saved Drafts — the full view behind the compact "Saved drafts" panels on the
 * refill screens. A draft holds no reference number and posts nothing; it lives
 * here until it is resumed or discarded.
 */
export default function RefillDrafts({ moduleLabel, parentLabel, onNavigate }) {
  const { refillDrafts, deleteDraft, units, manufacturers, showToast } = useStore()
  const [tab, setTab] = useState('all')
  const [openId, setOpenId] = useState(null)
  const [confirmDiscard, setConfirmDiscard] = useState(null)

  const unitList = unitOptions(units)
  const manufacturerList = manufacturers.length
    ? manufacturers.map((m) => ({ value: m.id, label: m.name }))
    : sampleManufacturers

  const open = refillDrafts.find((d) => d.id === openId) || null
  const shown = tab === 'all' ? refillDrafts : refillDrafts.filter((d) => d.kind === tab)

  const resume = (draft) => {
    const kind = KIND[draft.kind] || KIND.finished
    onNavigate?.({ id: kind.id, view: kind.view, label: kind.screen, params: { draftId: draft.id } })
  }

  const discard = (draft) => {
    deleteDraft(draft.id)
    setConfirmDiscard(null)
    setOpenId(null)
    showToast('Draft discarded', draft.title)
  }

  if (open) {
    return (
      <DraftDetail
        draft={open}
        unitList={unitList}
        manufacturerList={manufacturerList}
        onBack={() => setOpenId(null)}
        onResume={() => resume(open)}
        onDiscard={() => setConfirmDiscard(open)}
      />
    )
  }

  const columns = [
    { key: 'title', label: 'Draft', width: 260 },
    { key: 'kind', label: 'Type', width: 160, render: (d) => <Badge tone={(KIND[d.kind] || KIND.finished).tone}>{(KIND[d.kind] || KIND.finished).label}</Badge> },
    { key: 'lines', label: 'Lines', width: 90, align: 'right', mono: true },
    { key: 'units', label: 'Quantity', width: 120, align: 'right', mono: true, render: (d) => d.units.toLocaleString() },
    { key: 'by', label: 'Saved by', width: 170 },
    { key: 'savedAt', label: 'Saved', width: 180, render: (d) => fmtDate(new Date(d.savedAt).toISOString()) },
    {
      key: 'actions', label: '', width: 250, sortable: false,
      render: (d) => (
        <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" iconLeft="eye" onClick={() => setOpenId(d.id)}>Open</Button>
          <Button variant="ghost" size="sm" iconLeft="arrow-right" onClick={() => resume(d)}>Resume</Button>
          <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => setConfirmDiscard(d)}>Discard</Button>
        </div>
      ),
    },
  ]

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        icon="file-clock"
        title="Saved Drafts"
        description="Refills and deliveries saved before posting. A draft carries no reference number and changes no stock — open one to see every line in full, then resume it on its own screen to post, or discard it."
        meta={<Badge tone={refillDrafts.length ? 'warning' : 'neutral'}>{refillDrafts.length ? `${refillDrafts.length} unposted` : 'No drafts'}</Badge>}
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <Panel padding={shown.length ? 0 : 20}>
        {shown.length === 0 ? (
          <EmptyState
            icon="file-clock"
            title={refillDrafts.length ? 'No drafts of this type' : 'No saved drafts'}
            description={
              refillDrafts.length
                ? 'Switch tabs to see drafts saved on the other refill screen.'
                : 'Use "Save draft" on either Stock Refill screen to park an entry you are not ready to post. It will appear here in full.'
            }
          />
        ) : (
          <ReportTable
            columns={columns}
            rows={shown}
            rowKey={(d) => d.id}
            onRowClick={(d) => setOpenId(d.id)}
            stickyHeader={false}
            style={{ border: 'none', borderRadius: 0 }}
          />
        )}
      </Panel>

      <Dialog
        open={!!confirmDiscard}
        title="Discard this draft?"
        description={confirmDiscard ? `"${confirmDiscard.title}" and its ${confirmDiscard.lines} saved line${confirmDiscard.lines === 1 ? '' : 's'} will be deleted. This cannot be undone.` : ''}
        onClose={() => setConfirmDiscard(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDiscard(null)}>Keep draft</Button>
            <Button iconLeft="trash-2" onClick={() => discard(confirmDiscard)}>Discard draft</Button>
          </>
        }
      />
    </Page>
  )
}
