import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { DataTable } from '../../ds/components/data/DataTable.jsx'
import { Page, Panel, FieldSet, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { manufacturers as sampleManufacturers } from '../sample.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import { BulkUploadDialog, EditRecordDialog } from './RegisterTools.jsx'

const FIELDS = [
  { key: 'name', label: 'Manufacturer name', placeholder: 'Dangote Sugar Refinery' },
  { key: 'country', label: 'Country', placeholder: 'Nigeria' },
  { key: 'produces', label: 'What they produce', placeholder: 'Refined sugar' },
  { key: 'contact', label: 'Contact person', placeholder: 'A. Bello' },
  { key: 'phone', label: 'Phone', placeholder: '+234 …' },
  { key: 'email', label: 'Email', placeholder: 'sales@manufacturer.com' },
]

/**
 * Manufacturer register. A delivery records who supplied the material and who
 * made it — the two are often different, and traceability needs both.
 */
export default function Manufacturers({ leaf, moduleLabel, parentLabel }) {
  const { manufacturers, addManufacturer, updateManufacturer, removeManufacturer, showToast } = useStore()
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [produces, setProduces] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    const clean = name.trim()
    if (!clean) { setErr('Manufacturer name is required'); return }
    if (manufacturers.some((m) => m.name.toLowerCase() === clean.toLowerCase())) {
      setErr('That manufacturer is already registered'); return
    }
    addManufacturer({ name: clean, country, contact, phone, email, produces })
    showToast(`Manufacturer registered — ${clean}`, produces.trim() || 'Selectable on raw material deliveries')
    setName(''); setCountry(''); setContact(''); setPhone(''); setEmail(''); setProduces(''); setErr('')
  }

  const drop = (m) => {
    removeManufacturer(m.id)
    showToast(`Removed manufacturer — ${m.name}`)
  }

  const importAll = (records) => {
    records.forEach((r) => addManufacturer(r))
    showToast(`${records.length} manufacturer${records.length === 1 ? '' : 's'} imported`, 'Selectable per line on raw material deliveries')
  }

  const columns = [
    { key: 'name', label: 'Manufacturer', width: 220 },
    { key: 'country', label: 'Country', width: 150 },
    { key: 'produces', label: 'Produces', width: 220 },
    { key: 'contact', label: 'Contact person', width: 170 },
    { key: 'phone', label: 'Phone', width: 160 },
    { key: 'created', label: 'Registered', width: 170 },
    { key: 'actions', label: '', width: 190 },
  ]

  const rows = manufacturers.map((m) => ({
    name: m.name,
    country: m.country || '—',
    produces: m.produces || '—',
    contact: m.contact || '—',
    phone: m.phone || '—',
    created: fmtDate(new Date(m.createdAt).toISOString()),
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(m)}>Edit</Button>
        <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => drop(m)}>Remove</Button>
      </div>
    ),
  })).reverse()

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        icon={leaf?.icon || 'building'}
        title={leaf?.label || 'Manufacturers'}
        description="The companies that actually produce the materials you receive — often not the same company that sells them to you. A manufacturer registered here becomes selectable per line on raw material deliveries and on the Material Receive report."
        meta={<Badge tone={manufacturers.length ? 'success' : 'warning'}>{manufacturers.length ? `${manufacturers.length} registered` : 'None registered yet'}</Badge>}
      />

      {manufacturers.length === 0 && (
        <Callout tone="info" title="No manufacturers of your own yet">
          Delivery lines currently fall back to the sample manufacturer list. Register your real ones below and they
          take its place in every manufacturer picker.
        </Callout>
      )}

      <Panel title="Add a manufacturer" description="Name is required; everything else is for traceability and recall.">
        <FieldSet columns={3}>
          <Input label="Manufacturer name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dangote Sugar Refinery" error={err} />
          <Input label="Country" hint="Optional" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" />
          <Input label="What they produce" hint="Optional" value={produces} onChange={(e) => setProduces(e.target.value)} placeholder="e.g. Refined sugar" />
          <Input label="Contact person" hint="Optional" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. A. Bello" />
          <Input label="Phone" hint="Optional" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 …" />
          <Input label="Email" hint="Optional" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@manufacturer.com" />
        </FieldSet>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button iconLeft="plus" onClick={submit}>Register manufacturer</Button>
          <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
        </div>
      </Panel>

      <Panel title="Registered manufacturers" padding={manufacturers.length ? 0 : 20}>
        {manufacturers.length === 0 ? (
          <EmptyState
            compact
            icon="building"
            title="No manufacturers registered"
            description={`The prototype falls back to ${sampleManufacturers.length} sample manufacturers until you add your own.`}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={rows} selectable={false} showRowNumbers /></div>
        )}
      </Panel>

      <BulkUploadDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        entityLabel="manufacturer"
        entityLabelPlural="manufacturers"
        fields={FIELDS}
        existingNames={manufacturers.map((m) => m.name)}
        onImport={importAll}
      />

      <EditRecordDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        entityLabel="manufacturer"
        fields={FIELDS}
        record={editing}
        existingNames={manufacturers.map((m) => m.name)}
        onSave={(patch) => { updateManufacturer(editing.id, patch); showToast(`Manufacturer updated — ${patch.name}`) }}
      />
    </Page>
  )
}
