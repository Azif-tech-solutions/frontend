import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { DataTable } from '../../ds/components/data/DataTable.jsx'
import { Page, Panel, FieldSet, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { suppliers as sampleSuppliers } from '../sample.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import { BulkUploadDialog, EditRecordDialog } from './RegisterTools.jsx'

const FIELDS = [
  { key: 'name', label: 'Supplier name', placeholder: 'Ardova Commodities Ltd' },
  { key: 'contact', label: 'Contact person', placeholder: 'A. Bello' },
  { key: 'phone', label: 'Phone', placeholder: '+234 …' },
  { key: 'email', label: 'Email', placeholder: 'sales@supplier.com' },
  { key: 'address', label: 'Address', placeholder: 'Street, city, state' },
  { key: 'supplies', label: 'What they supply', placeholder: 'Refined sugar, preforms' },
]

/**
 * Supplier register. Raw-material deliveries are recorded against a supplier,
 * so one has to exist before a delivery can name who it came from.
 */
export default function Suppliers({ leaf, moduleLabel }) {
  const { suppliers, addSupplier, updateSupplier, removeSupplier, showToast } = useStore()
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [supplies, setSupplies] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    const clean = name.trim()
    if (!clean) { setErr('Supplier name is required'); return }
    if (suppliers.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
      setErr('That supplier is already registered'); return
    }
    addSupplier({ name: clean, contact, phone, email, address, supplies })
    showToast(`Supplier registered — ${clean}`, supplies.trim() || 'Selectable on raw material deliveries')
    setName(''); setContact(''); setPhone(''); setEmail(''); setAddress(''); setSupplies(''); setErr('')
  }

  const drop = (s) => {
    removeSupplier(s.id)
    showToast(`Removed supplier — ${s.name}`)
  }

  const importAll = (records) => {
    records.forEach((r) => addSupplier(r))
    showToast(`${records.length} supplier${records.length === 1 ? '' : 's'} imported`, 'Selectable on raw material deliveries')
  }

  const columns = [
    { key: 'name', label: 'Supplier', width: 220 },
    { key: 'contact', label: 'Contact person', width: 170 },
    { key: 'phone', label: 'Phone', width: 160 },
    { key: 'email', label: 'Email', width: 200 },
    { key: 'supplies', label: 'Supplies', width: 200 },
    { key: 'created', label: 'Registered', width: 170 },
    { key: 'actions', label: '', width: 190 },
  ]

  const rows = suppliers.map((s) => ({
    name: s.name,
    contact: s.contact || '—',
    phone: s.phone || '—',
    email: s.email || '—',
    supplies: s.supplies || '—',
    created: fmtDate(new Date(s.createdAt).toISOString()),
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(s)}>Edit</Button>
        <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => drop(s)}>Remove</Button>
      </div>
    ),
  })).reverse()

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel]}
        icon={leaf?.icon || 'truck'}
        title={leaf?.label || 'Suppliers'}
        description="The companies raw materials are bought from. A supplier registered here becomes selectable on Stock Refill — Raw Material, and on the Material Receive and Re-Order reports."
        meta={<Badge tone={suppliers.length ? 'success' : 'warning'}>{suppliers.length ? `${suppliers.length} registered` : 'None registered yet'}</Badge>}
      />

      {suppliers.length === 0 && (
        <Callout tone="info" title="No suppliers of your own yet">
          Deliveries currently fall back to the sample supplier list. Register your real suppliers below and they
          take its place at the top of every supplier picker.
        </Callout>
      )}

      <Panel title="Add a supplier" description="Name is required; everything else is for your own records.">
        <FieldSet columns={3}>
          <Input label="Supplier name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ardova Commodities Ltd" error={err} />
          <Input label="Contact person" hint="Optional" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. A. Bello" />
          <Input label="Phone" hint="Optional" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 …" />
          <Input label="Email" hint="Optional" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@supplier.com" />
          <Input label="Address" hint="Optional" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" />
          <Input label="What they supply" hint="Optional" value={supplies} onChange={(e) => setSupplies(e.target.value)} placeholder="e.g. Refined sugar, preforms" />
        </FieldSet>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button iconLeft="plus" onClick={submit}>Register supplier</Button>
          <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
        </div>
      </Panel>

      <Panel title="Registered suppliers" padding={suppliers.length ? 0 : 20}>
        {suppliers.length === 0 ? (
          <EmptyState
            compact
            icon="truck"
            title="No suppliers registered"
            description={`The prototype falls back to ${sampleSuppliers.length} sample suppliers until you add your own.`}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={rows} selectable={false} showRowNumbers /></div>
        )}
      </Panel>

      <BulkUploadDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        entityLabel="supplier"
        entityLabelPlural="suppliers"
        fields={FIELDS}
        existingNames={suppliers.map((s) => s.name)}
        onImport={importAll}
      />

      <EditRecordDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        entityLabel="supplier"
        fields={FIELDS}
        record={editing}
        existingNames={suppliers.map((s) => s.name)}
        onSave={(patch) => { updateSupplier(editing.id, patch); showToast(`Supplier updated — ${patch.name}`) }}
      />
    </Page>
  )
}
