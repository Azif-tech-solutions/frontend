import { useState,useEffect } from 'react'
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
import { Dropdown } from '../Dropdown.jsx'
import { importFactories } from '../factoryBulk.js'
// import Loader from '../Loader.jsx'
import FactoryApi from '../../api/FactoryApi.ts'
import Loader from '../../ds/components/core/Loader.jsx'

const factoryApi = new FactoryApi()

const FIELDS = [
  { key: 'name', label: 'Factory name', placeholder: 'Ridgeway Factory A' },
  { key: 'code', label: 'Factory code', placeholder: 'FA' },
  { key: 'address', label: 'Location', placeholder: 'Street, city, state' },
]

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'SUSPENDED', label: 'Suspended' },
]

// Fields shown in the Edit dialog. Kept separate from FIELDS, which the bulk
// upload uses for its simple name/code/location columns.
const EDIT_FIELDS = [
  { key: 'name', label: 'Factory name', placeholder: 'Ridgeway Factory A' },
  { key: 'code', label: 'Factory code', placeholder: 'FA', required: true },
  { key: 'address', label: 'Location', placeholder: 'Street, city', required: true },
  { key: 'state', label: 'State', placeholder: 'e.g. Lagos', required: true },
  { key: 'phone', label: 'Phone number', placeholder: 'e.g. +234 800 000 0000', required: true },
  { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
  { key: 'vatEnabled', label: 'This factory charges VAT', type: 'checkbox' },
  {
    key: 'vatRate', label: 'VAT rate (%)', type: 'number', placeholder: 'e.g. 7.5',
    required: true, showIf: (v) => !!v.vatEnabled,
    validate: (value) => {
      const rate = Number(value)
      return Number.isNaN(rate) || rate < 0 || rate > 100 ? 'Enter a rate between 0 and 100' : undefined
    },
  },
  {
    key: 'vatRegistrationNumber', label: 'VAT registration number', placeholder: 'VAT registration number',
    required: true, showIf: (v) => !!v.vatEnabled,
  },
]

/**
 * Factory register. Every Factory-module screen — refills, stock cards,
 * production, transfers — operates on a named factory, so at least one has to
 * exist here before any of them can be used.
 */
export default function Factories({ leaf, moduleLabel, onNavigate }) {
  const { factories, products, stockEntries, addFactory, updateFactory, removeFactory, showToast,overrideFactories } = useStore()

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [address, setAddress] = useState('')
  const [factoryState, setFactoryState] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  const [vatEnabled, setVatEnabled] = useState(false)
  const [vatRate, setVatRate] = useState('')
  const [vatRegistration, setVatRegistration] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const resetForm = () => {
    setName(''); setCode(''); setAddress(''); setFactoryState(''); setPhone('')
    setStatus('ACTIVE'); setVatEnabled(false); setVatRate(''); setVatRegistration('')
    setErrors({})
  }

  useEffect(() => {
    
  
    let cancelled = false
    factoryApi.listFactories()
      .then(({ data }) => {
        if (cancelled) return
        overrideFactories((data || []).map(factoryApi.toStoreFactory))
      })
      .catch(() => {})
  
    return () => { cancelled = true }
  }, [ overrideFactories])

  const validate = () => {
    const e = {}
    const clean = name.trim()

    if (!clean) e.name = 'Factory name is required'
    else if (factories.some((f) => f.name.toLowerCase() === clean.toLowerCase())) {
      e.name = 'A factory with that name already exists'
    }
    if (!code.trim()) e.code = 'Factory code is required'
    if (!address.trim()) e.address = 'Location is required'
    if (!factoryState.trim()) e.state = 'State is required'
    if (!phone.trim()) e.phone = 'Phone number is required'

    // VAT details only matter (and are only checked) when VAT is switched on.
    if (vatEnabled) {
      const rate = Number(vatRate)
      if (!String(vatRate).trim()) e.vatRate = 'VAT rate is required'
      else if (Number.isNaN(rate) || rate < 0 || rate > 100) e.vatRate = 'Enter a rate between 0 and 100'
      if (!vatRegistration.trim()) e.vatRegistration = 'VAT registration number is required'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      // 1. Create it on the server
      const res = await factoryApi.createFactory({
        name: name.trim(),
        code: code.trim(),
        address: address.trim(),
        state: factoryState.trim(),
        phone: phone.trim(),
        vatEnabled,
        vatRate: vatEnabled ? Number(vatRate) : 0,
        vatRegistrationNumber: vatEnabled ? vatRegistration.trim() : '',
        status,
      })

      // 2. Save what the server returned into the store.
      // The API has no id field, so the code doubles as the id (same rule App.jsx uses).
      const created = res.data
      addFactory({ ...created, id: created.id ?? created.code })

      showToast(`Factory created — ${created.name}`, created.code || 'Ready for stock registration')
      resetForm()
    } catch (error) {
      showToast('Factory creation failed', error.message, true)
    } finally {
      setLoading(false) // runs on success AND on failure
    }
  }

  const usage = (id) => ({
    products: products.filter((p) => p.factoryId === id).length,
    entries: stockEntries.filter((e) => e.factoryId === id).length,
  })

  const drop = (f) => {
    removeFactory(f.id)
    showToast(`Removed factory — ${f.name}`, 'Nothing was registered against it')
  }

 const importAll = (records) => importFactories(records, { factoryApi, addFactory, showToast })

  // Called by the Edit dialog. Returning false keeps the dialog open so the
  // user's changes aren't lost when the server rejects the update.
  const saveFactory = async (patch) => {
    const body = {
      ...patch,
      // Same rule as creating: VAT details only apply when VAT is switched on.
      vatRate: patch.vatEnabled ? Number(patch.vatRate) : 0,
      vatRegistrationNumber: patch.vatEnabled ? patch.vatRegistrationNumber : '',
    }
    try {
      await factoryApi.updateFactory(editing.id, body)
      updateFactory(editing.id, body)
      showToast(`Factory updated — ${body.name}`)
    } catch (error) {
      showToast('Factory update failed', error.message, true)
      return false
    }
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
          Nothing under Factory can be used until at least one production site exists. Add your first one below and
          you can register stock against it straight away.
        </Callout>
      )}

      <Panel title="Add a factory" description="Name, code, location, state and phone are required. VAT details are only needed if this factory charges VAT.">
        <FieldSet columns={3}>
          <Input label="Factory name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ridgeway Factory A" error={errors.name} />
          <Input label="Factory code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. FA" error={errors.code} />
          <Input label="Location" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city" error={errors.address} />
          <Input label="State" value={factoryState} onChange={(e) => setFactoryState(e.target.value)} placeholder="e.g. Lagos" error={errors.state} />
          <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +234 800 000 0000" error={errors.phone} />
          <Dropdown label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </FieldSet>

        <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, font: 'var(--type-ui)', color: 'var(--text-strong)', cursor: 'pointer' }}>
          <input type="checkbox" checked={vatEnabled} onChange={(e) => setVatEnabled(e.target.checked)} />
          This factory charges VAT
        </label>

        {vatEnabled && (
          <div style={{ marginTop: 16 }}>
            <FieldSet columns={2}>
              <Input label="VAT rate (%)" type="number" value={vatRate} onChange={(e) => setVatRate(e.target.value)} placeholder="e.g. 7.5" error={errors.vatRate} />
              <Input label="VAT registration number" value={vatRegistration} onChange={(e) => setVatRegistration(e.target.value)} placeholder="VAT registration number" error={errors.vatRegistration} />
            </FieldSet>
          </div>
        )}

        {loading ? (
          <Loader label="Creating factory…" />
        ) : (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Button iconLeft="plus" onClick={submit}>Create factory</Button>
            <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
          </div>
        )}
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
        fields={EDIT_FIELDS}
        record={editing}
        existingNames={factories.map((f) => f.name)}
        onSave={saveFactory}
      />
    </Page>
  )
}