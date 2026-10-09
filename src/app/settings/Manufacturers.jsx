import { useState,useEffect } from 'react'
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
import FactoryApi from '../../api/FactoryApi.ts'
import { Dropdown } from '../Dropdown.jsx'
import { MANUFACTURER_BULK_FIELDS, MANUFACTURER_BULK_HINT, validateManufacturerRow, importManufacturers } from '../manufacturerBulk.js'
import Loader from '../../ds/components/core/Loader.jsx'

const FIELDS = [
  { key: 'name', label: 'Manufacturer name', placeholder: 'Dangote Sugar Refinery' },
  { key: 'country', label: 'Country', placeholder: 'Nigeria' },
  { key: 'code', label: 'Code', placeholder: 'Man100' },
  { key: 'produces', label: 'What they produce', placeholder: 'Refined sugar' },
  { key: 'contact', label: 'Contact person', placeholder: 'A. Bello' },
  { key: 'phone', label: 'Phone', placeholder: '+234 …' },
  { key: 'email', label: 'Email', placeholder: 'sales@manufacturer.com' },
  { key: 'status', label: 'Status' },
]

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
]

const factoryApi = new FactoryApi()

/**
 * Manufacturer register. A delivery records who supplied the material and who
 * made it — the two are often different, and traceability needs both.
 */
export default function Manufacturers({ leaf, moduleLabel, parentLabel }) {
  const { manufacturers, addManufacturer, updateManufacturer, removeManufacturer, showToast,overrideManufacturers } = useStore()
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [country, setCountry] = useState('')
  const [contact, setContact] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [produces, setProduces] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [loading, setLoading] = useState(false)
  // const [err, setErr] = useState('')
const [errors, setErrors] = useState({})
  

const submit = async () => {
  const cleanName = name.trim()
  const cleanCountry = country.trim()
  const cleanProduces = produces.trim()
  const cleanPhone = phone.trim()
  const cleanEmail = email.trim()

  const newErrors = {}

  if (!cleanName) newErrors.name = 'Manufacturer name is required'
  if (!cleanCountry) newErrors.country = 'Country is required'
  if (!cleanProduces) newErrors.produces = 'What they produce is required'
  if (!cleanPhone) newErrors.phone = 'Phone is required'
  if (!cleanEmail) newErrors.email = 'Email is required'
  if (!status) newErrors.status = 'Status is required'

  // Stop submission if there are validation errors
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  // Check duplicate manufacturer name
  if (manufacturers.some(
    (m) => m.name.toLowerCase() === cleanName.toLowerCase()
  )) {
    setErrors({ name: 'That manufacturer is already registered' })
    return
  }

  setLoading(true)

  try {
    await factoryApi.createManufacturer({
      name: cleanName,
      manufacturerCode: code,
      country: cleanCountry,
      contactEmail: cleanEmail,
      phone: cleanPhone,
      produces: cleanProduces,
      status,
    })

    addManufacturer({
      name: cleanName,
      code,
      country: cleanCountry,
      contact,
      phone: cleanPhone,
      email: cleanEmail,
      produces: cleanProduces,
      status,
    })

    showToast(
      `Manufacturer registered — ${cleanName}`,
      cleanProduces || 'Selectable on raw material deliveries'
    )

    // Clear form
    setName('')
    setCode('')
    setCountry('')
    setContact('')
    setPhone('')
    setEmail('')
    setProduces('')
    setStatus('ACTIVE')
    setErrors({})
  } catch (e) {
    showToast(
      'Manufacturer registration failed',
      e.message,
      true
    )
  } finally {
    setLoading(false)
  }

}

    useEffect(() => {
      
    
      let cancelled = false
      factoryApi.listManufacturers()
        .then(({ data }) => {
          if (cancelled) return
          overrideManufacturers((data || []).map(factoryApi.toStoreManufacturer))
        })
        .catch(() => {})
    
      return () => { cancelled = true }
    }, [ overrideManufacturers])

  const drop = (m) => {
    removeManufacturer(m.id)
    showToast(`Removed manufacturer — ${m.name}`)
  }

 const importAll = (records) => importManufacturers(records, { factoryApi, addManufacturer, showToast })



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
          <Input label="Manufacturer name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dangote Sugar Refinery" error={errors.name} />
          <Input label="Country"  value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" error={errors.country} />
          <Input label="What they produce"  value={produces} onChange={(e) => setProduces(e.target.value)} placeholder="e.g. Refined sugar" error={errors.produces} />
          <Input label="Contact person" hint="Optional" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="e.g. A. Bello" error={errors.contact} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 …" error={errors.phone} />
          <Input label="Email"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sales@manufacturer.com" error={errors.email} /> 
          <Dropdown label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </FieldSet>
        {loading ? (
          <Loader label="Registering manufacturer..." />
        ) : 
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button iconLeft="plus" onClick={submit} disabled={loading}>Register manufacturer</Button>
          <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
        </div>}
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
        fields={MANUFACTURER_BULK_FIELDS}
        hint={MANUFACTURER_BULK_HINT}
        validateRow={(r) => validateManufacturerRow(r, manufacturers)}
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
