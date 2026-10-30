// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Switch } from '../../ds/components/forms/Switch.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { showroomRegister, nigerianStates } from '../sampleProcess.js'

// const columns = [
//   { key: 'code', label: 'Branch code', width: 130, mono: true },
//   { key: 'name', label: 'Showroom', width: 220 },
//   { key: 'address', label: 'Address', width: 320 },
//   { key: 'state', label: 'State', width: 120 },
//   { key: 'manager', label: 'Manager', width: 160 },
//   { key: 'phone', label: 'Phone', width: 170, mono: true },
//   { key: 'opened', label: 'Opened', width: 140 },
//   { key: 'vatRate', label: 'VAT rate', width: 110, align: 'right', mono: true },
//   {
//     key: 'status', label: 'Status', width: 160,
//     render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge>,
//   },
// ]

// function ShowroomForm({ crumbs, onBack }) {
//   const [active, setActive] = useState(true)
//   const nextCode = `BR-${String(showroomRegister.length + 1).padStart(3, '0')}`

//   return (
//     <FormShell
//       crumbs={crumbs}
//       title="Register showroom"
//       icon="store"
//       description="Create a new showroom, also referred to as a branch. A unique branch code is generated automatically on registration for identification and tracking."
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to register</Button>}
//       submitLabel="Register showroom"
//       onCancel={onBack}
//       note="Once registered, the showroom is immediately selectable for transfers, stock, sales and financial reporting."
//       aside={
//         <>
//           <Panel title="Branch code">
//             <div style={{ padding: '18px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Will be assigned</div>
//               <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{nextCode}</div>
//             </div>
//             <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
//               Generated on save and used to identify this branch across stock, transfers and financial records.
//             </div>
//           </Panel>

//           <Panel title="Set up after registration">
//             <MetaRow label="VAT rate" value="Via VAT Control" />
//             <MetaRow label="Opening stock" value="Via Stock Entry" />
//             <MetaRow label="Assigned staff" value="Via User Register" />
//             <MetaRow label="Correspondent" value="Via Correspondent" />
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Showroom details">
//         <FieldSet columns={2}>
//           <Input label="Showroom name" placeholder="e.g. Showroom Kano" />
//           <Select label="State" options={nigerianStates} placeholder="Select state…" />
//           <Input label="Street address" placeholder="e.g. 48 Murtala Mohammed Way" />
//           <Input label="City / town" placeholder="e.g. Kano" />
//           <Input label="Phone number" placeholder="+234 …" />
//           <Input label="Email address" placeholder="branch@zifiq.com" />
//         </FieldSet>
//       </Panel>

//       <Panel title="Management & operations">
//         <FieldSet columns={2}>
//           <Input label="Branch manager" placeholder="e.g. A. Yusuf" />
//           <Input label="Date opened" type="date" />
//           <Input label="Storage capacity" placeholder="Optional" />
//           <Input label="Operating hours" placeholder="e.g. Mon–Sat, 08:00–18:00" />
//         </FieldSet>
//         <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
//           <Switch checked={active} onChange={setActive} />
//           <div>
//             <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active on registration</div>
//             <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
//               Leave off to register a branch that has not yet opened for trading.
//             </div>
//           </div>
//         </div>
//         {!active && (
//           <Callout tone="info" icon="info" style={{ marginTop: 14 }}>
//             The showroom will be registered as <strong>Pending opening</strong>. It can receive stock but cannot
//             transact until activated.
//           </Callout>
//         )}
//       </Panel>
//     </FormShell>
//   )
// }

// export default function ShowroomRegister({ leaf, moduleLabel, parentLabel }) {
//   const [mode, setMode] = useState('list')
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (mode === 'create') return <ShowroomForm crumbs={crumbs} onBack={() => setMode('list')} />

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Showroom Register'}
//       icon={leaf?.icon}
//       description="Create and manage showrooms, also referred to as branches. Each registered showroom carries a unique branch code used to track its transactions, stock and financial activity."
//       createLabel="Register showroom"
//       onCreate={() => setMode('create')}
//       searchPlaceholder="Search by name, branch code or address…"
//       filters={<Select options={nigerianStates} placeholder="All states" style={{ width: 180 }} />}
//       stats={[
//         { label: 'Showrooms registered', value: String(showroomRegister.length) },
//         { label: 'Active', value: String(showroomRegister.filter((s) => s.status === 'Active').length) },
//         { label: 'Pending opening', value: String(showroomRegister.filter((s) => s.status !== 'Active').length) },
//         { label: 'States covered', value: String(new Set(showroomRegister.map((s) => s.state)).size) },
//       ]}
//       columns={columns}
//       rows={showroomRegister}
//       onRowClick={() => {}}
//       emptyTitle="No showrooms registered"
//       emptyDescription="Register a branch to begin tracking its stock and transactions."
//       footnote="A showroom cannot be created with missing required fields or a name that duplicates an existing branch. Branch codes are generated by the system and cannot be edited."
//     />
//   )
// }
import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import ShowroomApi from '../../api/ShowroomApi.js'
import TenantApi from '../../api/TenantApi.js'
import InvoiceApi from '../../api/InvoiceApi.js' // contains getStateList / getLGAList

const showroomApi = new ShowroomApi()
const tenantApi = new TenantApi()
const invoiceApi = new InvoiceApi()

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending opening' },
  { value: 'SUSPENDED', label: 'Suspended' },
]

const AREA_KIND_OPTIONS = [
  { value: 'QUARANTINE', label: 'Quarantine' },
  { value: 'STORAGE', label: 'Storage' },
  { value: 'SELLING', label: 'Selling' },
  { value: 'RECEIVING', label: 'Receiving' },
]

const titleCase = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const labelStyle = { font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5 }

/* ------------------------------------------------------------------ */
/* Register / Edit form                                                */
/* ------------------------------------------------------------------ */

function ShowroomForm({ crumbs, onBack, onDone, showroomId = null }) {
  const isEdit = !!showroomId
  const { factories, showToast } = useStore()

  // showroom fields
  const [name, setName] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [dateOpened, setDateOpened] = useState('')
  const [capacity, setCapacity] = useState('')
  const [hours, setHours] = useState('')
  const [active, setActive] = useState(true)
  const [managerId, setManagerId] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  // full showroom (edit mode) – needed for areas & defaults
  const [existing, setExisting] = useState(null)

  // states from API
  const [states, setStates] = useState([])
  const [loadingStates, setLoadingStates] = useState(false)

  // members (branch manager picker)
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  // inline "new member" dialog
  const [memberDialog, setMemberDialog] = useState(false)
  const [roles, setRoles] = useState([])
  const [locations, setLocations] = useState([])
  const [loadingDialog, setLoadingDialog] = useState(false)
  const [creatingMember, setCreatingMember] = useState(false)
  const [newMember, setNewMember] = useState({
    displayName: '',
    email: '',
    phone: '',
    roleId: '',
    locationId: '',
  })

  // areas
  const [addAreaOpen, setAddAreaOpen] = useState(false)
  const [newArea, setNewArea] = useState({ kind: 'QUARANTINE', name: '' })
  const [addingArea, setAddingArea] = useState(false)

  // defaults
  const [defaultReceivingId, setDefaultReceivingId] = useState('')
  const [defaultSellingId, setDefaultSellingId] = useState('')
  const [savingDefaults, setSavingDefaults] = useState(false)

  // ---------- load states ----------
  useEffect(() => {
    let cancelled = false
    setLoadingStates(true)
    invoiceApi
      .getStateList()
      .then((res) => {
        if (cancelled) return
        const opts = (res.data || []).map((s) => ({
          value: s.code || s.stateCode,
          label: s.name,
        }))
        setStates(opts)
      })
      .catch((e) => !cancelled && showToast('Could not load states', e.message, true))
      .finally(() => !cancelled && setLoadingStates(false))
    return () => {
      cancelled = true
    }
  }, [showToast])

  // ---------- load members ----------
  useEffect(() => {
    let cancelled = false
    setLoadingMembers(true)
    tenantApi
      .getTenantMemberList({ page: 0, size: 200 })
      .then((res) => {
        if (!cancelled) setMembers(res.data?.items ?? [])
      })
      .catch((e) => !cancelled && showToast('Could not load members', e.message, true))
      .finally(() => !cancelled && setLoadingMembers(false))
    return () => {
      cancelled = true
    }
  }, [showToast])

  // ---------- load existing showroom when editing ----------
  useEffect(() => {
    if (!showroomId) return
    let cancelled = false
    setSaving(true)
    showroomApi
      .retrieveShowroom(showroomId)
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setExisting(d)
        setName(d.name || '')
        setStateCode(d.stateCode || '')
        setStreet(d.streetAddress || '')
        setCity(d.city || '')
        setPhone(d.phone || '')
        setEmail(d.email || '')
        setDateOpened(d.dateOpened ? d.dateOpened.slice(0, 10) : '')
        setCapacity(d.storageCapacity || '')
        setHours(d.operatingHours || '')
        setActive(d.status === 'ACTIVE')
        setManagerId(d.manager?.id || '')
        setDefaultReceivingId(d.defaultReceivingLocation?.id || '')
        setDefaultSellingId(d.defaultSellingLocation?.id || '')
      })
      .catch((e) => !cancelled && showToast('Could not load showroom', e.message, true))
      .finally(() => !cancelled && setSaving(false))
    return () => {
      cancelled = true
    }
  }, [showroomId, showToast])

  const memberOptions = members.map((m) => ({ value: m.userId, label: m.displayName }))
  const manager = members.find((m) => m.userId === managerId)

  // ---------- member dialog ----------
  async function openMemberDialog() {
    setMemberDialog(true)
    if (roles.length && locations.length) return
    setLoadingDialog(true)
    try {
      const [roleRes, showroomRes] = await Promise.all([
        tenantApi.getRoleList(),
        showroomApi.lookupPickerWithAreas({}),
      ])
      setRoles((roleRes.data || []).map((r) => ({ value: r.id, label: r.name })))
      setLocations([
        ...(factories || []).map((f) => ({ value: f.id, label: `${f.name} (Factory)` })),
        ...(showroomRes.data || []).map((s) => ({ value: s.id, label: `${s.label} (Showroom)` })),
      ])
    } catch (e) {
      showToast('Could not load roles and locations', e.message, true)
    } finally {
      setLoadingDialog(false)
    }
  }

  function closeMemberDialog() {
    if (creatingMember) return
    setMemberDialog(false)
    setNewMember({ displayName: '', email: '', phone: '', roleId: '', locationId: '' })
  }

  async function createMember() {
    const m = newMember
    if (!m.displayName.trim() || !m.email.trim() || !m.roleId || !m.locationId) {
      return showToast('Name, email, role and location are required', '', true)
    }
    setCreatingMember(true)
    try {
      const res = await tenantApi.createTenantMember({
        displayName: m.displayName.trim(),
        email: m.email.trim(),
        phone: m.phone.trim(),
        roleId: m.roleId,
        locationId: m.locationId,
      })
      const created = res.data
      setMembers((ms) => [...ms, created])
      setManagerId(created.userId)
      showToast('Member created', created.displayName)
      setMemberDialog(false)
      setNewMember({ displayName: '', email: '', phone: '', roleId: '', locationId: '' })
    } catch (e) {
      showToast('Could not create member', e.message, true)
    } finally {
      setCreatingMember(false)
    }
  }

  // ---------- add area ----------
  async function addArea() {
    if (!newArea.name.trim()) {
      return showToast('Area name is required', '', true)
    }
    setAddingArea(true)
    try {
      const res = await showroomApi.addAreaToShowRoom(showroomId, {
        kind: newArea.kind,
        name: newArea.name.trim(),
      })
      setExisting(res.data)
      showToast('Area added', newArea.name.trim())
      setAddAreaOpen(false)
      setNewArea({ kind: 'QUARANTINE', name: '' })
    } catch (e) {
      showToast('Could not add area', e.message, true)
    } finally {
      setAddingArea(false)
    }
  }

  // ---------- update defaults ----------
  async function saveDefaults() {
    if (!defaultReceivingId || !defaultSellingId) {
      return showToast('Both default areas are required', '', true)
    }
    setSavingDefaults(true)
    try {
      const res = await showroomApi.updateDefaultReceivingAndSellingAreas(showroomId, {
        defaultReceivingLocationId: defaultReceivingId,
        defaultSellingLocationId: defaultSellingId,
      })
      setExisting(res.data)
      showToast('Default areas updated')
    } catch (e) {
      showToast('Could not update defaults', e.message, true)
    } finally {
      setSavingDefaults(false)
    }
  }

  // ---------- submit (create or edit) ----------
  const submit = async () => {
    const e = {}
    if (!name.trim()) e.name = 'Showroom name is required'
    if (!stateCode) e.state = 'Select a state'
    if (!street.trim()) e.street = 'Street address is required'
    if (!city.trim()) e.city = 'City or town is required'
    setErrors(e)
    if (Object.keys(e).length) return

    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        stateCode,
        streetAddress: street.trim(),
        city: city.trim(),
        phone: phone.trim(),
        email: email.trim(),
        managerName: manager ? manager.displayName : null,
        managerUserId: manager ? manager.userId : null,
        dateOpened: dateOpened || null,
        storageCapacity: capacity.trim(),
        operatingHours: hours.trim(),
        active,
        createDefaultAreas: !isEdit,
      }

      const res = isEdit
        ? await showroomApi.editShowroom(showroomId, payload)
        : await showroomApi.createShowroom(payload)

      const created = res.data
      const warnings = created.warnings?.length ? created.warnings.join(' · ') : ''
      showToast(
        isEdit ? `Showroom updated — ${created.code}` : `Showroom registered — ${created.code}`,
        warnings || created.name
      )
      onDone?.()
    } catch (err) {
      showToast(
        isEdit ? 'Showroom update failed' : 'Showroom registration failed',
        err.message,
        true
      )
    } finally {
      setSaving(false)
    }
  }

  const areaOptions =
    existing?.areas?.map((a) => ({ value: a.id, label: `${a.name} (${a.kind})` })) || []

  return (
    <FormShell
      crumbs={crumbs}
      title={isEdit ? 'Edit showroom' : 'Register showroom'}
      icon="store"
      description={
        isEdit
          ? 'Update showroom details, areas and default locations.'
          : 'Create a new showroom, also referred to as a branch. A unique branch code is generated automatically on registration for identification and tracking.'
      }
      headerActions={
        <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
          Back to register
        </Button>
      }
      submitLabel={isEdit ? 'Save changes' : 'Register showroom'}
      loading={saving}
      onSubmit={submit}
      onCancel={onBack}
      note={
        isEdit
          ? 'Changes take effect immediately for stock, transfers and reporting.'
          : 'Once registered, the showroom is immediately selectable for transfers, stock, sales and financial reporting.'
      }
      aside={
        <>
          <Panel title="Branch code">
            <div
              style={{
                padding: '18px 16px',
                background: 'var(--brand-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  font: 'var(--type-eyebrow)',
                  letterSpacing: 'var(--ls-widest)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}
              >
                {isEdit ? 'Branch code' : 'Will be assigned'}
              </div>
              <div
                style={{
                  marginTop: 8,
                  font: 'var(--fw-bold) var(--text-lg)/1 var(--font-ui)',
                  letterSpacing: 'var(--ls-tight)',
                  color: 'var(--text-strong)',
                }}
              >
                {isEdit && existing ? existing.code : 'On save'}
              </div>
            </div>
            <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {isEdit
                ? 'System-generated code used across stock, transfers and financial records.'
                : 'Generated on save and used to identify this branch across stock, transfers and financial records.'}
            </div>
          </Panel>

          <Panel title="Set up after registration">
            <MetaRow label="VAT rate" value="Via VAT Control" />
            <MetaRow label="Opening stock" value="Via Stock Entry" />
            <MetaRow label="Assigned staff" value="Via User Register" />
            <MetaRow label="Correspondent" value="Via Correspondent" />
          </Panel>
        </>
      }
    >
      {(saving || loadingMembers || loadingStates) && (
        <Loader
          overlay
          label={
            saving
              ? isEdit
                ? 'Updating showroom…'
                : 'Registering showroom…'
              : loadingStates
                ? 'Loading states…'
                : 'Loading members…'
          }
        />
      )}

      <Panel title="Showroom details">
        <FieldSet columns={2}>
          <Input
            label="Showroom name"
            placeholder="e.g. Showroom Kano"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <div>
            <Select
              label="State"
              options={states}
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              placeholder={loadingStates ? 'Loading…' : 'Select state…'}
            />
            {errors.state && (
              <div style={{ ...labelStyle, color: 'var(--text-danger)' }}>{errors.state}</div>
            )}
          </div>
          <Input
            label="Street address"
            placeholder="e.g. 48 Murtala Mohammed Way"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            error={errors.street}
          />
          <Input
            label="City / town"
            placeholder="e.g. Kano"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={errors.city}
          />
          <Input
            label="Phone number"
            placeholder="+234 …"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            label="Email address"
            placeholder="branch@zifiq.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FieldSet>
      </Panel>

      <Panel title="Management & operations">
        <FieldSet columns={2}>
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 8,
                alignItems: 'end',
              }}
            >
              <Select
                label="Branch manager"
                options={memberOptions}
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                placeholder={loadingMembers ? 'Loading…' : 'Select a member…'}
              />
              <Button variant="secondary" iconLeft="plus" onClick={openMemberDialog}>
                Member
              </Button>
            </div>
            <div style={labelStyle}>
              Optional. Pick an existing member or{' '}
              <span
                onClick={openMemberDialog}
                style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}
              >
                create one now
              </span>
              .
            </div>
          </div>
          <Input
            label="Date opened"
            type="date"
            value={dateOpened}
            onChange={(e) => setDateOpened(e.target.value)}
          />
          <Input
            label="Storage capacity"
            placeholder="Optional"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <Input
            label="Operating hours"
            placeholder="e.g. Mon–Sat, 08:00–18:00"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </FieldSet>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={active} onChange={setActive} />
          <div>
            <div
              style={{
                font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)',
                color: 'var(--text-strong)',
              }}
            >
              Active on registration
            </div>
            <div
              style={{
                font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)',
                color: 'var(--text-muted)',
                marginTop: 2,
              }}
            >
              Leave off to register a branch that has not yet opened for trading.
            </div>
          </div>
        </div>

        {!active && (
          <Callout tone="info" icon="info" style={{ marginTop: 14 }}>
            The showroom will be registered as <strong>Pending opening</strong>. It can receive
            stock but cannot transact until activated.
          </Callout>
        )}
      </Panel>

      {/* ---------- Areas & defaults (edit only) ---------- */}
      {isEdit && existing && (
        <Panel title="Areas & defaults">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {existing.areas?.length ? (
              existing.areas.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <strong>{a.name}</strong>
                    <span style={{ marginLeft: 10, color: 'var(--text-muted)', fontSize: 13 }}>
                      {a.kind} · {a.status} · {a.unitsOnHand ?? 0} units
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', font: 'var(--type-caption)' }}>
                No areas yet. Add one below.
              </div>
            )}

            <div style={{ marginTop: 4 }}>
              <Button variant="secondary" iconLeft="plus" onClick={() => setAddAreaOpen(true)}>
                Add area
              </Button>
            </div>

            <FieldSet columns={2} style={{ marginTop: 16 }}>
              <Select
                label="Default receiving area"
                options={areaOptions}
                value={defaultReceivingId}
                onChange={(e) => setDefaultReceivingId(e.target.value)}
                placeholder="Select area…"
              />
              <Select
                label="Default selling area"
                options={areaOptions}
                value={defaultSellingId}
                onChange={(e) => setDefaultSellingId(e.target.value)}
                placeholder="Select area…"
              />
            </FieldSet>

            <div style={{ marginTop: 8 }}>
              <Button
                variant="secondary"
                onClick={saveDefaults}
                disabled={
                  savingDefaults ||
                  !defaultReceivingId ||
                  !defaultSellingId
                }
              >
                {savingDefaults ? 'Updating…' : 'Update defaults'}
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {/* ---------- Create member dialog ---------- */}
      <Dialog
        open={memberDialog}
        title="Create a member"
        onClose={closeMemberDialog}
        footer={
          <>
            <Button variant="secondary" onClick={closeMemberDialog} disabled={creatingMember}>
              Cancel
            </Button>
            <Button
              iconLeft="check"
              onClick={createMember}
              disabled={creatingMember || loadingDialog}
            >
              {creatingMember ? 'Creating…' : 'Create member'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="Full name"
            autoFocus
            value={newMember.displayName}
            onChange={(e) => setNewMember((m) => ({ ...m, displayName: e.target.value }))}
            placeholder="e.g. A. Yusuf"
          />
          <Input
            label="Email address"
            value={newMember.email}
            onChange={(e) => setNewMember((m) => ({ ...m, email: e.target.value }))}
            placeholder="name@company.com"
          />
          <Input
            label="Phone number"
            value={newMember.phone}
            onChange={(e) => setNewMember((m) => ({ ...m, phone: e.target.value }))}
            placeholder="+234 …"
          />
          <Select
            label="Role"
            options={roles}
            value={newMember.roleId}
            onChange={(e) => setNewMember((m) => ({ ...m, roleId: e.target.value }))}
            placeholder={loadingDialog ? 'Loading…' : 'Select role…'}
          />
          <Select
            label="Location"
            options={locations}
            value={newMember.locationId}
            onChange={(e) => setNewMember((m) => ({ ...m, locationId: e.target.value }))}
            placeholder={loadingDialog ? 'Loading…' : 'Select location…'}
          />
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            The member is created straight away and selected as this showroom&rsquo;s manager. This
            showroom doesn&rsquo;t exist yet, so pick the factory or showroom they work from now;
            you can move them later.
          </div>
        </div>
      </Dialog>

      {/* ---------- Add area dialog ---------- */}
      <Dialog
        open={addAreaOpen}
        title="Add area"
        onClose={() => {
          if (addingArea) return
          setAddAreaOpen(false)
          setNewArea({ kind: 'QUARANTINE', name: '' })
        }}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                if (addingArea) return
                setAddAreaOpen(false)
                setNewArea({ kind: 'QUARANTINE', name: '' })
              }}
              disabled={addingArea}
            >
              Cancel
            </Button>
            <Button iconLeft="check" onClick={addArea} disabled={addingArea}>
              {addingArea ? 'Adding…' : 'Add area'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select
            label="Kind"
            options={AREA_KIND_OPTIONS}
            value={newArea.kind}
            onChange={(e) => setNewArea((a) => ({ ...a, kind: e.target.value }))}
          />
          <Input
            label="Area name"
            autoFocus
            value={newArea.name}
            onChange={(e) => setNewArea((a) => ({ ...a, name: e.target.value }))}
            placeholder="e.g. Quarantine Bay A"
          />
        </div>
      </Dialog>
    </FormShell>
  )
}

/* ------------------------------------------------------------------ */
/* Register list                                                       */
/* ------------------------------------------------------------------ */

export default function ShowroomRegister({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const [mode, setMode] = useState('list') // 'list' | 'create'
  const [editingId, setEditingId] = useState(null)
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  // list state
  const [items, setItems] = useState([])
  const [stats, setStats] = useState({ active: 0, pendingOpening: 0, suspended: 0 })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  // states for filter
  const [states, setStates] = useState([])

  // status dialog
  const [editing, setEditing] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [reason, setReason] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  // load states for the filter dropdown
  useEffect(() => {
    let cancelled = false
    invoiceApi
      .getStateList()
      .then((res) => {
        if (cancelled) return
        const opts = (res.data || []).map((s) => ({
          value: s.code || s.stateCode,
          label: s.name,
        }))
        setStates(opts)
      })
      .catch(() => {
        /* silent – filter just stays empty */
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (mode !== 'list' || editingId) return
    let cancelled = false
    setLoading(true)
    showroomApi
      .listShowrooms({
        q: debouncedSearch || undefined,
        stateCode: stateFilter ? [stateFilter] : undefined,
      })
      .then((res) => {
        if (cancelled) return
        setItems(res.data?.items ?? [])
        setStats(res.data?.stats ?? { active: 0, pendingOpening: 0, suspended: 0 })
      })
      .catch((e) => !cancelled && showToast('Could not load showrooms', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [mode, editingId, debouncedSearch, stateFilter, refreshKey, showToast])

  function openStatusDialog(row) {
    setEditing(row)
    setNewStatus(row.status)
    setReason('')
  }

  function closeStatusDialog() {
    if (savingStatus) return
    setEditing(null)
    setNewStatus('')
    setReason('')
  }

  async function saveStatus() {
    if (!editing || !newStatus || newStatus === editing.status) return
    if (newStatus === 'SUSPENDED' && !reason.trim()) {
      return showToast('Give a reason for suspending this showroom', '', true)
    }
    setSavingStatus(true)
    try {
      await showroomApi.changeStatus(editing.id, {
        status: newStatus,
        reason: reason.trim(),
      })
      showToast('Status updated', `${editing.name} · ${titleCase(newStatus)}`)
      setEditing(null)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      showToast('Could not update status', e.message, true)
    } finally {
      setSavingStatus(false)
    }
  }

  // ---------- create or edit form ----------
  if (mode === 'create' || editingId) {
    return (
      <ShowroomForm
        crumbs={crumbs}
        showroomId={editingId}
        onBack={() => {
          setMode('list')
          setEditingId(null)
        }}
        onDone={() => {
          setMode('list')
          setEditingId(null)
          setRefreshKey((k) => k + 1)
        }}
      />
    )
  }

  // ---------- list view ----------
  const rows = items.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    address: [s.streetAddress, s.city].filter(Boolean).join(', ') || '—',
    state: s.stateName || '—',
    manager: s.managerName || '—',
    phone: s.phone || '—',
    opened: fmtDate(s.dateOpened),
    vatRate: s.vatEnabled ? `${s.vatRate}%` : '—',
    status: s.status,
  }))

  const columns = [
    { key: 'code', label: 'Branch code', width: 130, mono: true },
    { key: 'name', label: 'Showroom', width: 220 },
    { key: 'address', label: 'Address', width: 320 },
    { key: 'state', label: 'State', width: 120 },
    { key: 'manager', label: 'Manager', width: 160 },
    { key: 'phone', label: 'Phone', width: 170, mono: true },
    { key: 'opened', label: 'Opened', width: 140 },
    { key: 'vatRate', label: 'VAT rate', width: 110, align: 'right', mono: true },
    {
      key: 'status',
      label: 'Status',
      width: 160,
      render: (r) => (
        <Badge tone={r.status === 'ACTIVE' ? 'success' : 'warning'}>
          {titleCase(r.status)}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      width: 220,
      render: (r) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="sm" onClick={() => setEditingId(r.id)}>
            Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={() => openStatusDialog(r)}>
            Status
          </Button>
        </div>
      ),
    },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Showroom Register'}
      icon={leaf?.icon}
      description="Create and manage showrooms, also referred to as branches. Each registered showroom carries a unique branch code used to track its transactions, stock and financial activity."
      createLabel="Register showroom"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by name, branch code or address…"
      search={search}
      onSearch={setSearch}
      filters={
        <Select
          options={[{ label: 'All states', value: '' }, ...states]}
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          placeholder="All states"
          style={{ width: 180 }}
        />
      }
      stats={[
        { label: 'Showrooms registered', value: String(items.length) },
        { label: 'Active', value: String(stats.active ?? 0) },
        { label: 'Pending opening', value: String(stats.pendingOpening ?? 0) },
        { label: 'Suspended', value: String(stats.suspended ?? 0) },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle="No showrooms registered"
      emptyDescription="Register a branch to begin tracking its stock and transactions."
      footnote="A showroom cannot be created with missing required fields or a name that duplicates an existing branch. Branch codes are generated by the system and cannot be edited."
    >
      {loading && <Loader label="Loading showrooms…" />}

      <Dialog
        open={!!editing}
        title="Update showroom status"
        onClose={closeStatusDialog}
        footer={
          <>
            <Button variant="secondary" onClick={closeStatusDialog} disabled={savingStatus}>
              Cancel
            </Button>
            <Button
              iconLeft="check"
              onClick={saveStatus}
              disabled={savingStatus || !newStatus || newStatus === editing?.status}
            >
              {savingStatus ? 'Saving…' : 'Save status'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {editing?.code} · {editing?.name}
          </div>
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <Input
            label="Reason"
            hint={newStatus === 'SUSPENDED' ? 'Required when suspending.' : 'Optional.'}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is the status changing?"
          />
        </div>
      </Dialog>
    </RegisterShell>
  )
}