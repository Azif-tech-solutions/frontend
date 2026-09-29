import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { DataTable } from '../../ds/components/data/DataTable.jsx'
import { Page, Panel, FieldSet, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import { BulkUploadDialog, EditRecordDialog } from './RegisterTools.jsx'

const FIELDS = [
  { key: 'name', label: 'Factory name', placeholder: 'Ridgeway Factory A' },
  { key: 'code', label: 'Factory code', placeholder: 'FA' },
  { key: 'address', label: 'Location', placeholder: 'Street, city, state' },
]

/**
 * Factory register. Every Factory-module screen — refills, stock cards,
 * production, transfers — operates on a named factory, so at least one has to
 * exist here before any of them can be used.
 */
export default function Factories({ leaf, moduleLabel, onNavigate }) {
  const { factories, products, stockEntries, addFactory, updateFactory, removeFactory, showToast } = useStore()

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [address, setAddress] = useState('')
  const [err, setErr] = useState('')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const submit = () => {
    const clean = name.trim()
    if (!clean) { setErr('Factory name is required'); return }
    if (factories.some((f) => f.name.toLowerCase() === clean.toLowerCase())) {
      setErr('A factory with that name already exists'); return
    }
    addFactory({ name: clean, code, address })
    showToast(`Factory created — ${clean}`, code.trim() || 'Ready for stock registration')
    setName(''); setCode(''); setAddress(''); setErr('')
  }

  const usage = (id) => ({
    products: products.filter((p) => p.factoryId === id).length,
    entries: stockEntries.filter((e) => e.factoryId === id).length,
  })

  const drop = (f) => {
    removeFactory(f.id)
    showToast(`Removed factory — ${f.name}`, 'Nothing was registered against it')
  }

  const importAll = (records) => {
    records.forEach((r) => addFactory(r))
    showToast(`${records.length} factor${records.length === 1 ? 'y' : 'ies'} imported`, 'Ready for stock registration')
  }

  const columns = [
    { key: 'name', label: 'Factory', width: 220 },
    { key: 'code', label: 'Code', width: 120 },
    { key: 'address', label: 'Location', width: 240 },
    { key: 'products', label: 'Products', width: 110 },
    { key: 'entries', label: 'Stock entries', width: 130 },
    { key: 'created', label: 'Created', width: 180 },
    { key: 'actions', label: '', width: 200 },
  ]

  const rows = factories.map((f) => {
    const u = usage(f.id)
    const used = u.products > 0 || u.entries > 0
    return {
      name: f.name,
      code: f.code || '—',
      address: f.address || '—',
      products: String(u.products),
      entries: String(u.entries),
      created: fmtDate(new Date(f.createdAt).toISOString()),
      actions: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(f)}>Edit</Button>
          {used
            ? <Badge tone="success">In use</Badge>
            : <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => drop(f)}>Remove</Button>}
        </div>
      ),
    }
  })

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel]}
        icon={leaf?.icon || 'factory'}
        title={leaf?.label || 'Factories'}
        description="Create and manage the production sites this company operates. A factory must exist here before it can be selected on any Factory screen — stock refills, bin cards, recipes, production runs, and transfers all record against a named factory."
        meta={<Badge tone={factories.length ? 'success' : 'warning'}>{factories.length ? `${factories.length} factor${factories.length === 1 ? 'y' : 'ies'} registered` : 'No factories yet'}</Badge>}
      />

      {factories.length === 0 && (
        <Callout tone="warning" title="Create a factory to unlock the Factory module">
          Nothing under Factory can be used until at least one production site exists. Add your first one below — the
          name is all that is required, and you can register stock against it straight away.
        </Callout>
      )}

      <Panel title="Add a factory" description="Name is required; the rest is for your own records.">
        <FieldSet columns={3}>
          <Input label="Factory name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ridgeway Factory A" error={err} />
          <Input label="Factory code" hint="Optional" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. FA" />
          <Input label="Location" hint="Optional" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" />
        </FieldSet>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button iconLeft="plus" onClick={submit}>Create factory</Button>
          <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
        </div>
      </Panel>

      <Panel title="Registered factories" padding={factories.length ? 0 : 20}>
        {factories.length === 0 ? (
          <EmptyState
            compact
            icon="factory"
            title="No factories registered"
            description="Once a factory exists it becomes selectable on Stock Registration and across the Factory module."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={rows} selectable={false} showRowNumbers /></div>
        )}
      </Panel>

      {factories.length > 0 && onNavigate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
          <Icon name="arrow-right" size={14} color="var(--brand)" />
          Next step —
          <a
            onClick={() => onNavigate({ view: 'stockregister', id: 'stockregister', label: 'Stock Registration' })}
            style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}
          >register stock against a factory</a>
        </div>
      )}

      <BulkUploadDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        entityLabel="factory"
        entityLabelPlural="factories"
        fields={FIELDS}
        existingNames={factories.map((f) => f.name)}
        onImport={importAll}
      />

      <EditRecordDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        entityLabel="factory"
        fields={FIELDS}
        record={editing}
        existingNames={factories.map((f) => f.name)}
        onSave={(patch) => { updateFactory(editing.id, patch); showToast(`Factory updated — ${patch.name}`) }}
      />
    </Page>
  )
}
