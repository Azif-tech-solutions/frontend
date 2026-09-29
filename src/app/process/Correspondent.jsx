import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { correspondents, regions } from '../sampleProcess.js'
import { fmt } from '../utils.js'

const TABS = [
  { value: 'Assigned', label: 'Assigned', icon: 'user-round-check' },
  { value: 'Unassigned', label: 'Unassigned', icon: 'user-round' },
  { value: 'De-assigned', label: 'De-assigned', icon: 'user-round-x' },
]

const TONE = { Assigned: 'success', Unassigned: 'warning', 'De-assigned': 'neutral' }

function AssignForm({ crumbs, onBack }) {
  return (
    <FormShell
      crumbs={crumbs}
      title="Assign correspondent"
      icon="user-round-cog"
      description="Link a sales representative to a region, showroom and set of dealers. Correspondents handle sales activity and customer relationships on the company's behalf."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to list</Button>}
      submitLabel="Assign correspondent"
      onCancel={onBack}
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
          <Input label="Full name" placeholder="e.g. Chidi Okeke" />
          <Input label="Phone number" placeholder="+234 …" />
          <Input label="Email address" placeholder="name@zifiq.com" />
          <Input label="Correspondent code" placeholder="Auto-generated" disabled value="CR-023" />
        </FieldSet>
      </Panel>

      <Panel title="Assignment" description="Where this correspondent operates and who they report through.">
        <FieldSet columns={2}>
          <Select label="Region" options={regions} placeholder="Select region…" />
          <Select label="Reporting showroom" options={showrooms} placeholder="Select showroom…" />
          <Input label="Effective from" type="date" />
          <Input label="Dealers to link" type="number" placeholder="0" hint="Dealers can also be linked later." />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Responsibilities</div>
            <textarea
              rows={3}
              placeholder="Territory boundaries, product focus, or targets for this correspondent."
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function Correspondent({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('Assigned')
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <AssignForm crumbs={crumbs} onBack={() => setMode('list')} />

  const rows = correspondents.filter((c) => c.status === tab)
  const assigned = correspondents.filter((c) => c.status === 'Assigned')

  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Correspondent', width: 210 },
    { key: 'phone', label: 'Phone', width: 180, mono: true },
    { key: 'region', label: 'Region', width: 180 },
    { key: 'showroom', label: 'Reporting showroom', width: 200 },
    { key: 'dealers', label: 'Dealers linked', width: 150, align: 'right', mono: true, render: (c) => fmt(c.dealers) },
    { key: 'assigned', label: 'Assigned on', width: 150 },
    {
      key: 'status', label: 'Status', width: 140,
      render: (c) => <Badge tone={TONE[c.status] || 'neutral'}>{c.status}</Badge>,
    },
    {
      key: 'action', label: 'Action', width: 200, sortable: false,
      render: (c) => (
        <div style={{ display: 'flex', gap: 6 }}>
          {c.status === 'Assigned'
            ? (
              <>
                <Button size="sm" variant="secondary">Reassign</Button>
                <Button size="sm" variant="secondary">De-assign</Button>
              </>
            )
            : <Button size="sm" iconLeft="user-round-check">Assign</Button>}
        </div>
      ),
    },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Correspondent'}
      icon={leaf?.icon}
      description="Assign and de-assign correspondents — the sales representatives who handle sales activity and customer relationships for the company — linking each to a region, showroom and set of dealers."
      createLabel="Assign correspondent"
      onCreate={() => setMode('create')}
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by name, code or region…"
      filters={
        <>
          <Select options={regions} placeholder="All regions" style={{ width: 190 }} />
          <Select options={showrooms} placeholder="All showrooms" style={{ width: 190 }} />
        </>
      }
      stats={[
        { label: 'Correspondents', value: String(correspondents.length) },
        { label: 'Currently assigned', value: String(assigned.length) },
        { label: 'Dealers covered', value: fmt(assigned.reduce((n, c) => n + c.dealers, 0)) },
        { label: 'Regions covered', value: String(new Set(assigned.map((c) => c.region)).size) },
      ]}
      columns={columns}
      rows={rows}
      emptyTitle={tab === 'Assigned' ? 'No correspondents assigned' : tab === 'Unassigned' ? 'No unassigned correspondents' : 'No de-assigned correspondents'}
      emptyDescription={tab === 'Unassigned' ? 'Everyone on the roster currently holds an assignment.' : undefined}
      footnote="De-assigning a correspondent retains their sales history and past commission records. Reassigning moves them to a different region or showroom without losing that history."
    >
      {tab === 'Unassigned' && rows.length > 0 && (
        <Callout tone="warning" icon="user-round" title={`${rows.length} correspondent${rows.length === 1 ? '' : 's'} without an assignment`}>
          Unassigned correspondents cannot be credited with sales or earn commission. Assign a region and
          reporting showroom to bring them into the next allocation run.
        </Callout>
      )}
    </RegisterShell>
  )
}
