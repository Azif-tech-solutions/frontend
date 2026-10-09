import { useState, useEffect } from 'react'
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
import FactoryApi from '../../api/FactoryApi.ts'
import { SUPPLIER_BULK_FIELDS, SUPPLIER_BULK_HINT, validateSupplierRow, importSuppliers } from '../supplierBulk.js'
import Loader from '../../ds/components/core/Loader.jsx'
const factoryApi = new FactoryApi()

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
  const { suppliers, addSupplier, updateSupplier, removeSupplier, showToast, overrideSuppliers } = useStore()
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [supplies, setSupplies] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Name, code, email and phone are what the backend accepts today, so they are
  // the only required fields. Contact, address and supplies stay optional.
  const validate = () => {
    const e = {}
    const clean = name.trim()
    const cleanCode = code.trim()

    if (!clean) e.name = 'Supplier name is required'
    else if (suppliers.some((s) => s.name.toLowerCase() === clean.toLowerCase())) {
      e.name = 'That supplier is already registered'
    }

    if (!cleanCode) e.code = 'Supplier code is required'
    else if (suppliers.some((s) => (s.code || '').toLowerCase() === cleanCode.toLowerCase())) {
      e.code = 'That supplier code is already in use'
    }

    if (!email.trim()) e.email = 'Email is required'
    if (!phone.trim()) e.phone = 'Phone number is required'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      // 1. Create it on the server
      const res = await factoryApi.createSupplier({
        supplierCode: code.trim(),
        companyName: name.trim(),
        contactEmail: email.trim(),
        phone: phone.trim(),
      })

      // 2. Save it in the store: server fields converted to the store's shape,
      // plus the optional details the backend doesn't hold yet.
      addSupplier({
        ...factoryApi.toStoreSupplier(res.data),
        contact: contact.trim(),
        address: address.trim(),
        supplies: supplies.trim(),
      })

      showToast(`Supplier registered — ${name.trim()}`, supplies.trim() || 'Selectable on raw material deliveries')
      setName(''); setCode(''); setContact(''); setPhone(''); setEmail(''); setAddress(''); setSupplies('')
      setErrors({})
    } catch (error) {
      showToast('Supplier registration failed', error.message, true)
    } finally {
      setLoading(false) // runs on success AND on failure
    }
  }

  const drop = (s) => {
    removeSupplier(s.id)
    showToast(`Removed supplier — ${s.name}`)
  }

  // const importAll = (records) => {
  //   records.forEach((r) => addSupplier(r))
  //   showToast(`${records.length} supplier${records.length === 1 ? '' : 's'} imported`, 'Selectable on raw material deliveries')
  // }
 const importAll = (records) => importSuppliers(records, { factoryApi, addSupplier, showToast })

  // Load the supplier list from the server and replace what's in the store.
  useEffect(() => {
    let cancelled = false
    factoryApi.listSuppliers()
      .then(({ data }) => {
        if (cancelled) return
        // Arrow function so toStoreSupplier keeps its `this`.
        overrideSuppliers((data || []).map((s) => factoryApi.toStoreSupplier(s)))
      })
      .catch(() => { /* request failed: keep whatever is already in the store */ })

    return () => { cancelled = true }
  }, [overrideSuppliers])

  const columns = [
    { key: 'name', label: 'Supplier', width: 220 },
    { key: 'code', label: 'Code', width: 120 },
    { key: 'contact', label: 'Contact person', width: 170 },
    { key: 'phone', label: 'Phone', width: 160 },
    { key: 'email', label: 'Email', width: 200 },
    { key: 'supplies', label: 'Supplies', width: 200 },
    { key: 'created', label: 'Registered', width: 170 },
    { key: 'actions', label: '', width: 190 },
  ]

  const rows = suppliers.map((s) => ({
    name: s.name,
    code: s.code || '—',
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

      <Panel title="Add a supplier" description="Name, code, email and phone are required; the rest is for your own records.">
        <FieldSet columns={3}>
          <Input label="Supplier name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ardova Commodities Ltd" error={errors.name} />
          <Input label="Supplier code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SUP001" error={errors.code} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@supplier.com" error={errors.email} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 …" error={errors.phone} />
          <Input label="Contact person" hint="Optional" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. A. Bello" />
          <Input label="Address" hint="Optional" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" />
          <Input label="What they supply" hint="Optional" value={supplies} onChange={(e) => setSupplies(e.target.value)} placeholder="e.g. Refined sugar, preforms" />
        </FieldSet>
        {loading ? 
          <Loader label="Registering supplier..." />
         : 
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}> 
          <Button iconLeft="plus" onClick={submit} disabled={loading}>{loading ? 'Registering…' : 'Register supplier'}</Button>
          <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)} disabled={loading}>Bulk upload</Button>
        </div>}
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

      {/* <BulkUploadDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        entityLabel="supplier"
        entityLabelPlural="suppliers"
        fields={FIELDS}
        existingNames={suppliers.map((s) => s.name)}
        onImport={importAll}
      /> */}
<BulkUploadDialog
  open={bulkOpen}
  onClose={() => setBulkOpen(false)}
  entityLabel="supplier"
  entityLabelPlural="suppliers"
  fields={SUPPLIER_BULK_FIELDS}
  hint={SUPPLIER_BULK_HINT}
  validateRow={(r) => validateSupplierRow(r, suppliers)}
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