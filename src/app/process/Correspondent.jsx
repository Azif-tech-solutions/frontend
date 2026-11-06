// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { RegisterShell } from '../shells/RegisterShell.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { showrooms } from '../sampleShowroom.js'
// import { correspondents, regions } from '../sampleProcess.js'
// import { fmt } from '../utils.js'

// const TABS = [
//   { value: 'Assigned', label: 'Assigned', icon: 'user-round-check' },
//   { value: 'Unassigned', label: 'Unassigned', icon: 'user-round' },
//   { value: 'De-assigned', label: 'De-assigned', icon: 'user-round-x' },
// ]

// const TONE = { Assigned: 'success', Unassigned: 'warning', 'De-assigned': 'neutral' }

// function AssignForm({ crumbs, onBack }) {
//   return (
//     <FormShell
//       crumbs={crumbs}
//       title="Assign correspondent"
//       icon="user-round-cog"
//       description="Link a sales representative to a region, showroom and set of dealers. Correspondents handle sales activity and customer relationships on the company's behalf."
//       headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to list</Button>}
//       submitLabel="Assign correspondent"
//       onCancel={onBack}
//       note="An assigned correspondent immediately appears in sales attribution, commission allocation and the Correspondents Report."
//       aside={
//         <Panel title="What assignment enables">
//           <MetaRow label="Sales attribution" value="Immediate" />
//           <MetaRow label="Commission allocation" value="Next run" />
//           <MetaRow label="Dealer relationships" value="On linking" />
//           <MetaRow label="Correspondents Report" value="Immediate" />
//         </Panel>
//       }
//     >
//       <Panel title="Representative">
//         <FieldSet columns={2}>
//           <Input label="Full name" placeholder="e.g. Chidi Okeke" />
//           <Input label="Phone number" placeholder="+234 …" />
//           <Input label="Email address" placeholder="name@zifiq.com" />
//           <Input label="Correspondent code" placeholder="Auto-generated" disabled value="CR-023" />
//         </FieldSet>
//       </Panel>

//       <Panel title="Assignment" description="Where this correspondent operates and who they report through.">
//         <FieldSet columns={2}>
//           <Select label="Region" options={regions} placeholder="Select region…" />
//           <Select label="Reporting showroom" options={showrooms} placeholder="Select showroom…" />
//           <Input label="Effective from" type="date" />
//           <Input label="Dealers to link" type="number" placeholder="0" hint="Dealers can also be linked later." />
//         </FieldSet>
//         <div style={{ marginTop: 14 }}>
//           <label style={{ display: 'block' }}>
//             <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Responsibilities</div>
//             <textarea
//               rows={3}
//               placeholder="Territory boundaries, product focus, or targets for this correspondent."
//               style={{
//                 width: '100%', padding: '10px 12px', resize: 'vertical',
//                 background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//                 borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//                 font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//               }}
//             />
//           </label>
//         </div>
//       </Panel>
//     </FormShell>
//   )
// }

// export default function Correspondent({ leaf, moduleLabel, parentLabel }) {
//   const [tab, setTab] = useState('Assigned')
//   const [mode, setMode] = useState('list')
//   const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

//   if (mode === 'create') return <AssignForm crumbs={crumbs} onBack={() => setMode('list')} />

//   const rows = correspondents.filter((c) => c.status === tab)
//   const assigned = correspondents.filter((c) => c.status === 'Assigned')

//   const columns = [
//     { key: 'code', label: 'Code', width: 110, mono: true },
//     { key: 'name', label: 'Correspondent', width: 210 },
//     { key: 'phone', label: 'Phone', width: 180, mono: true },
//     { key: 'region', label: 'Region', width: 180 },
//     { key: 'showroom', label: 'Reporting showroom', width: 200 },
//     { key: 'dealers', label: 'Dealers linked', width: 150, align: 'right', mono: true, render: (c) => fmt(c.dealers) },
//     { key: 'assigned', label: 'Assigned on', width: 150 },
//     {
//       key: 'status', label: 'Status', width: 140,
//       render: (c) => <Badge tone={TONE[c.status] || 'neutral'}>{c.status}</Badge>,
//     },
//     {
//       key: 'action', label: 'Action', width: 200, sortable: false,
//       render: (c) => (
//         <div style={{ display: 'flex', gap: 6 }}>
//           {c.status === 'Assigned'
//             ? (
//               <>
//                 <Button size="sm" variant="secondary">Reassign</Button>
//                 <Button size="sm" variant="secondary">De-assign</Button>
//               </>
//             )
//             : <Button size="sm" iconLeft="user-round-check">Assign</Button>}
//         </div>
//       ),
//     },
//   ]

//   return (
//     <RegisterShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Correspondent'}
//       icon={leaf?.icon}
//       description="Assign and de-assign correspondents — the sales representatives who handle sales activity and customer relationships for the company — linking each to a region, showroom and set of dealers."
//       createLabel="Assign correspondent"
//       onCreate={() => setMode('create')}
//       tabs={TABS}
//       tab={tab}
//       onTabChange={setTab}
//       searchPlaceholder="Search by name, code or region…"
//       filters={
//         <>
//           <Select options={regions} placeholder="All regions" style={{ width: 190 }} />
//           <Select options={showrooms} placeholder="All showrooms" style={{ width: 190 }} />
//         </>
//       }
//       stats={[
//         { label: 'Correspondents', value: String(correspondents.length) },
//         { label: 'Currently assigned', value: String(assigned.length) },
//         { label: 'Dealers covered', value: fmt(assigned.reduce((n, c) => n + c.dealers, 0)) },
//         { label: 'Regions covered', value: String(new Set(assigned.map((c) => c.region)).size) },
//       ]}
//       columns={columns}
//       rows={rows}
//       emptyTitle={tab === 'Assigned' ? 'No correspondents assigned' : tab === 'Unassigned' ? 'No unassigned correspondents' : 'No de-assigned correspondents'}
//       emptyDescription={tab === 'Unassigned' ? 'Everyone on the roster currently holds an assignment.' : undefined}
//       footnote="De-assigning a correspondent retains their sales history and past commission records. Reassigning moves them to a different region or showroom without losing that history."
//     >
//       {tab === 'Unassigned' && rows.length > 0 && (
//         <Callout tone="warning" icon="user-round" title={`${rows.length} correspondent${rows.length === 1 ? '' : 's'} without an assignment`}>
//           Unassigned correspondents cannot be credited with sales or earn commission. Assign a region and
//           reporting showroom to bring them into the next allocation run.
//         </Callout>
//       )}
//     </RegisterShell>
//   )
// }
import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmt, fmtDate } from '../utils.js'
import { regions } from '../sampleProcess.js'
import CustomerApi from '../../api/CustomerApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const customerApi = new CustomerApi()
const showroomApi = new ShowroomApi()

const PAGE_SIZE = 20

// Backend status enums — flip here if the backend uses e.g. "DEASSIGNED"
// instead of "DE_ASSIGNED".
const STATUS = {
  ASSIGNED: 'ASSIGNED',
  UNASSIGNED: 'UNASSIGNED',
  DE_ASSIGNED: 'DE_ASSIGNED',
}
const STATUS_LABEL = {
  ASSIGNED: 'Assigned',
  UNASSIGNED: 'Unassigned',
  DE_ASSIGNED: 'De-assigned',
}
const TONE = { ASSIGNED: 'success', UNASSIGNED: 'warning', DE_ASSIGNED: 'neutral' }

const TABS = [
  { value: STATUS.ASSIGNED, label: 'Assigned', icon: 'user-round-check' },
  { value: STATUS.UNASSIGNED, label: 'Unassigned', icon: 'user-round' },
  { value: STATUS.DE_ASSIGNED, label: 'De-assigned', icon: 'user-round-x' },
]

const TEXTAREA_STYLE = {
  width: '100%',
  padding: '10px 12px',
  resize: 'vertical',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  boxShadow: 'var(--shadow-xs)',
  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
  color: 'var(--text-strong)',
  outline: 'none',
}

// region options derived once from sampleProcess.js
const REGION_OPTIONS = regions
const REGION_OPTIONS_WITH_ALL = [{ value: '', label: 'All regions' }, ...regions]

/** Resolve whatever the API returns (value or label) to a display label. */
function regionLabel(code) {
  if (!code) return '—'
  const byValue = regions.find((r) => r.value === code)
  if (byValue) return byValue.label
  const byLabel = regions.find((r) => r.label === code)
  return byLabel ? byLabel.label : code
}

// ── Create ─────────────────────────────────────────────────
function CreateForm({ crumbs, showrooms, onBack, onDone }) {
  const store = useStore()
  const showToast = store.showToast

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [region, setRegion] = useState('')
  const [locationId, setLocationId] = useState('')
  const [responsibilities, setResponsibilities] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = name && phone && email && region && locationId && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await customerApi.createCorrespondent({
        name,
        phone,
        email,
        region,
        locationId,
        responsibilities,
      })
      showToast('Correspondent created', `${name} has been assigned.`)
      onDone()
    } catch (e) {
      showToast('Could not create correspondent', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Creating correspondent…" />}
      <FormShell
        crumbs={crumbs}
        title="Assign correspondent"
        icon="user-round-cog"
        description="Link a sales representative to a region and reporting showroom. Correspondents handle sales activity and customer relationships on the company's behalf."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        }
        submitLabel="Assign correspondent"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        note="An assigned correspondent immediately appears in sales attribution, commission allocation and the Correspondents Report."
        aside={
          <Panel title="What assignment enables">
            <MetaRow label="Sales attribution" value="Immediate" />
            <MetaRow label="Commission allocation" value="Next run" />
            <MetaRow label="Dealer relationships" value="On linking" />
            <MetaRow label="Correspondents Report" value="Immediate" />
          </Panel>
        }
      >
        <Panel title="Representative">
          <FieldSet columns={2}>
            <Input
              label="Full name"
              placeholder="e.g. Chidi Okeke"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone number"
              placeholder="+234 …"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Email address"
              placeholder="name@zifiq.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input label="Correspondent code" value="Auto-generated" disabled />
          </FieldSet>
        </Panel>

        <Panel title="Assignment" description="Where this correspondent operates.">
          <FieldSet columns={2}>
            <Select
              label="Region"
              options={REGION_OPTIONS}
              placeholder="Select region…"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <Select
              label="Reporting showroom"
              options={showrooms}
              placeholder="Select showroom…"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Responsibilities
              </div>
              <textarea
                rows={3}
                placeholder="Territory boundaries, product focus, or targets for this correspondent."
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                style={TEXTAREA_STYLE}
              />
            </label>
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Assign / Reassign (same shape) ─────────────────────────
function AssignForm({ correspondent, mode, crumbs, showrooms, onBack, onDone }) {
  const store = useStore()
  const showToast = store.showToast
  const isReassign = mode === 'reassign'

  const [region, setRegion] = useState(correspondent.region || '')
  const [locationId, setLocationId] = useState(correspondent.location?.id || '')
  const [effectiveFrom, setEffectiveFrom] = useState(
    () => new Date().toISOString().slice(0, 10)
  )
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = region && locationId && effectiveFrom && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const body = { region, locationId, effectiveFrom, note }
      if (isReassign) {
        await customerApi.reassignCorrespondent(correspondent.id, body)
      } else {
        await customerApi.assignCorrespondent(correspondent.id, body)
      }
      showToast(
        isReassign ? 'Correspondent reassigned' : 'Correspondent assigned',
        `${correspondent.name} now reports to the selected showroom.`
      )
      onDone()
    } catch (e) {
      showToast('Could not save assignment', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && (
        <Loader overlay label={isReassign ? 'Reassigning…' : 'Assigning…'} />
      )}
      <FormShell
        crumbs={crumbs}
        title={isReassign ? 'Reassign correspondent' : 'Assign correspondent'}
        icon="user-round-cog"
        description={
          isReassign
            ? 'Move this correspondent to a different region or reporting showroom. Their sales and commission history is preserved.'
            : 'Link this correspondent to a region and reporting showroom so they can be credited with sales and commissions.'
        }
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        }
        submitLabel={isReassign ? 'Reassign' : 'Assign'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Correspondent">
            <MetaRow label="Code" value={correspondent.code} mono />
            <MetaRow label="Name" value={correspondent.name} />
            <MetaRow label="Phone" value={correspondent.phone} mono />
            <MetaRow
              label="Status"
              value={
                STATUS_LABEL[correspondent.status] || correspondent.status
              }
            />
          </Panel>
        }
      >
        <Panel title="Assignment">
          <FieldSet columns={2}>
            <Select
              label="Region"
              options={REGION_OPTIONS}
              placeholder="Select region…"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            <Select
              label="Reporting showroom"
              options={showrooms}
              placeholder="Select showroom…"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            />
            <Input
              label="Effective from"
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Note
              </div>
              <textarea
                rows={3}
                placeholder="Reason for the change, handover notes, etc."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={TEXTAREA_STYLE}
              />
            </label>
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── De-assign ──────────────────────────────────────────────
function DeassignForm({ correspondent, crumbs, onBack, onDone }) {
  const store = useStore()
  const showToast = store.showToast

  const [effectiveFrom, setEffectiveFrom] = useState(
    () => new Date().toISOString().slice(0, 10)
  )
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = effectiveFrom && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await customerApi.deassignCorrespondent(correspondent.id, {
        effectiveFrom,
        note,
      })
      showToast(
        'Correspondent de-assigned',
        `${correspondent.name}'s assignment has been removed.`
      )
      onDone()
    } catch (e) {
      showToast('Could not de-assign', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="De-assigning…" />}
      <FormShell
        crumbs={crumbs}
        title="De-assign correspondent"
        icon="user-round-x"
        description="Remove this correspondent's current assignment. Their sales and commission history is retained."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        }
        submitLabel="De-assign"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Correspondent">
            <MetaRow label="Code" value={correspondent.code} mono />
            <MetaRow label="Name" value={correspondent.name} />
            <MetaRow label="Region" value={regionLabel(correspondent.region)} />
            <MetaRow
              label="Showroom"
              value={correspondent.location?.name || '—'}
            />
          </Panel>
        }
      >
        <Panel title="De-assignment">
          <FieldSet columns={2}>
            <Input
              label="Effective from"
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Note
              </div>
              <textarea
                rows={3}
                placeholder="Reason for de-assigning."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={TEXTAREA_STYLE}
              />
            </label>
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

// ── Main list ──────────────────────────────────────────────
export default function Correspondent({ leaf, moduleLabel, parentLabel }) {
  const store = useStore()
  const showToast = store.showToast
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  // view state
  const [tab, setTab] = useState(STATUS.ASSIGNED)
  const [mode, setMode] = useState('list') // 'list' | 'create' | 'assign' | 'reassign' | 'deassign'
  const [active, setActive] = useState(null)

  // filters
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [showroomFilter, setShowroomFilter] = useState('')

  // pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // data
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // lookups — only showrooms now; regions come from sampleProcess.js
  const [showrooms, setShowrooms] = useState([])

  // debounce the search input so we don't hit the API on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  // showrooms
  useEffect(() => {
    let cancelled = false
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        setShowrooms(
          (res.data || []).map((s) => ({
            value: s.id,
            label: s.label || s.name || s.code,
          }))
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load showrooms', e.message, true)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  // reset to page 0 whenever the effective query changes
  useEffect(() => {
    setPage(0)
  }, [tab, search, regionFilter, showroomFilter])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await customerApi.listCorrespondents({
        status: [tab],
        page,
        size: PAGE_SIZE,
        q: search || undefined,
        region: regionFilter ? [regionFilter] : undefined,
        locationId: showroomFilter || undefined,
      })
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
      setSummary(paged.summary || null)
    } catch (e) {
      showToast('Could not load correspondents', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [tab, page, search, regionFilter, showroomFilter, showToast])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setActive(null)
    setMode('create')
  }
  function openAssign(c) {
    setActive(c)
    setMode('assign')
  }
  function openReassign(c) {
    setActive(c)
    setMode('reassign')
  }
  function openDeassign(c) {
    setActive(c)
    setMode('deassign')
  }
  function backToList() {
    setActive(null)
    setMode('list')
  }
  function afterMutation() {
    setActive(null)
    setMode('list')
    load()
  }

  // ── non-list modes ──
  if (mode === 'create') {
    return (
      <CreateForm
        crumbs={crumbs}
        showrooms={showrooms}
        onBack={backToList}
        onDone={afterMutation}
      />
    )
  }
  if (mode === 'assign' || mode === 'reassign') {
    return (
      <AssignForm
        correspondent={active}
        mode={mode}
        crumbs={crumbs}
        showrooms={showrooms}
        onBack={backToList}
        onDone={afterMutation}
      />
    )
  }
  if (mode === 'deassign') {
    return (
      <DeassignForm
        correspondent={active}
        crumbs={crumbs}
        onBack={backToList}
        onDone={afterMutation}
      />
    )
  }

  // ── columns ──
  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Correspondent', width: 210 },
    { key: 'phone', label: 'Phone', width: 180, mono: true },
    {
      key: 'region',
      label: 'Region',
      width: 180,
      render: (c) => regionLabel(c.region),
    },
    {
      key: 'showroom',
      label: 'Reporting showroom',
      width: 200,
      render: (c) => c.location?.name || '—',
    },
    {
      key: 'dealers',
      label: 'Dealers linked',
      width: 150,
      align: 'right',
      mono: true,
      render: (c) => fmt(c.dealerCount || 0),
    },
    {
      key: 'assigned',
      label: 'Assigned on',
      width: 150,
      render: (c) => (c.assignedAt ? fmtDate(c.assignedAt) : '—'),
    },
    {
      key: 'status',
      label: 'Status',
      width: 140,
      render: (c) => (
        <Badge tone={TONE[c.status] || 'neutral'}>
          {STATUS_LABEL[c.status] || c.status}
        </Badge>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      width: 200,
      sortable: false,
      render: (c) =>
        c.status === STATUS.ASSIGNED ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openReassign(c)}
            >
              Reassign
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openDeassign(c)}
            >
              De-assign
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            iconLeft="user-round-check"
            onClick={() => openAssign(c)}
          >
            Assign
          </Button>
        ),
    },
  ]

  // ── stats ──
  const pageDealerTotal = rows.reduce((n, c) => n + (c.dealerCount || 0), 0)
  const pageRegionTotal = new Set(rows.map((c) => c.region).filter(Boolean)).size

  const stats = summary
    ? [
        { label: 'Correspondents', value: fmt(summary.total ?? totalItems) },
        {
          label: 'Dealers covered',
          value: fmt(summary.dealerCount ?? pageDealerTotal),
        },
        {
          label: 'Regions covered',
          value: String(summary.regionCount ?? pageRegionTotal),
        },
      ]
    : [
        { label: 'Correspondents', value: fmt(totalItems) },
        { label: 'Dealers (page)', value: fmt(pageDealerTotal) },
        { label: 'Regions (page)', value: String(pageRegionTotal) },
      ]

  const showroomOptions = [
    { value: '', label: 'All showrooms' },
    ...showrooms,
  ]

  // RegisterShell / ReportTable server-side pagination contract
    const pagination = {
    page,
    pageCount: totalPages,
    pageSize: PAGE_SIZE,
    total: totalItems,
    onPage: setPage,
  }
  console.log(pagination)

  return (
    <>
      {loading && <Loader overlay label="Loading correspondents…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Correspondent'}
        icon={leaf?.icon}
        description="Assign and de-assign correspondents — the sales representatives who handle sales activity and customer relationships for the company — linking each to a region, showroom and set of dealers."
        createLabel="Assign correspondent"
        onCreate={openCreate}
        tabs={TABS}
        tab={tab}
        onTabChange={setTab}
        search={searchInput}
        onSearch={setSearchInput}
        searchPlaceholder="Search by name, code or region…"
        pagination={pagination}
        filters={
          <>
            <Select
              options={REGION_OPTIONS_WITH_ALL}
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              options={showroomOptions}
              value={showroomFilter}
              onChange={(e) => setShowroomFilter(e.target.value)}
              style={{ width: 200 }}
            />
          </>
        }
        stats={stats}
        columns={columns}
        rows={rows}
        emptyTitle={
          tab === STATUS.ASSIGNED
            ? 'No correspondents assigned'
            : tab === STATUS.UNASSIGNED
              ? 'No unassigned correspondents'
              : 'No de-assigned correspondents'
        }
        emptyDescription={
          tab === STATUS.UNASSIGNED
            ? 'Everyone on the roster currently holds an assignment.'
            : undefined
        }
        footnote="De-assigning a correspondent retains their sales history and past commission records. Reassigning moves them to a different region or showroom without losing that history."
      >
        {tab === STATUS.UNASSIGNED && rows.length > 0 && (
          <Callout
            tone="warning"
            icon="user-round"
            title={`${rows.length} correspondent${rows.length === 1 ? '' : 's'} without an assignment`}
          >
            Unassigned correspondents cannot be credited with sales or earn
            commission. Assign a region and reporting showroom to bring them
            into the next allocation run.
          </Callout>
        )}
      </RegisterShell>
    </>
  )
}