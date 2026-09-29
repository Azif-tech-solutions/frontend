import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow, EmptyState } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { staffMembers, violations } from '../sampleHistory.js'
import { money, moneyShort } from '../utils.js'

// Outcome, not accusation — a dismissed record must read as clearly as a substantiated one.
const STATUS_TONE = {
  'Under investigation': 'warning',
  Substantiated: 'danger',
  Resolved: 'success',
  Dismissed: 'neutral',
}
const SEVERITY_TONE = { High: 'danger', Medium: 'warning', Low: 'neutral' }

export default function ViolationsHistory({ leaf, moduleLabel, parentLabel }) {
  const [staffId, setStaffId] = useState('st-2')

  const staff = staffMembers.find((s) => s.value === staffId) || staffMembers[0]
  const rows = violations.filter((v) => v.staff === staff.label)

  const open = rows.filter((v) => v.status === 'Under investigation')
  const substantiated = rows.filter((v) => v.status === 'Substantiated')
  const cleared = rows.filter((v) => v.status === 'Dismissed' || v.status === 'Resolved')
  const exposure = substantiated.concat(open).reduce((n, v) => n + v.amount, 0)

  const columns = [
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'date', label: 'Date raised', width: 135 },
    { key: 'category', label: 'Category', width: 220 },
    { key: 'description', label: 'Record', width: 460 },
    {
      key: 'amount', label: 'Amount involved', width: 175, align: 'right', mono: true,
      render: (v) => (v.amount ? money(v.amount) : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'severity', label: 'Severity', width: 120,
      render: (v) => <Badge tone={SEVERITY_TONE[v.severity] || 'neutral'}>{v.severity}</Badge>,
    },
    { key: 'raisedBy', label: 'Raised by', width: 190 },
    {
      key: 'status', label: 'Outcome', width: 175,
      render: (v) => <Badge tone={STATUS_TONE[v.status] || 'neutral'}>{v.status}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Violations/Fraud History'}
      icon={leaf?.icon}
      description="Internal audit record of suspected or confirmed policy violations by staff, with particular attention to dealer funds and unauthorised financial actions. Select a staff member to review their record."
      filters={[
        { key: 'staff', label: 'Staff member', type: 'select', options: staffMembers },
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'status', label: 'Outcome', type: 'select', options: Object.keys(STATUS_TONE).map((s) => ({ value: s, label: s })) },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      filterValues={{ staff: staffId }}
      onFilterChange={(k, v) => { if (k === 'staff') setStaffId(v) }}
      stats={[
        { label: 'Records on file', value: String(rows.length) },
        { label: 'Under investigation', value: String(open.length), tone: open.length ? 'warning' : undefined },
        { label: 'Substantiated', value: String(substantiated.length), tone: substantiated.length ? 'negative' : undefined },
        { label: 'Amount involved', value: exposure ? moneyShort(exposure) : '—', hint: 'Open and substantiated only' },
      ]}
      columns={columns}
      rows={rows}
      tableTitle={`Record for ${staff.label}`}
      emptyTitle="No records on file"
      emptyDescription="This staff member has no suspected or confirmed policy violations recorded."
      footnote="Records here are internal audit entries, not determinations of wrongdoing. An entry under investigation has not been established, and dismissed entries were reviewed and found to have no case to answer."
    >
      <Panel title="Staff member" description="The individual whose record is shown below.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Name" value={staff.label} />
            <MetaRow label="Role" value={staff.role} />
            <MetaRow label="Location" value={staff.showroom} />
          </div>
          <div>
            <MetaRow label="Joined" value={staff.joined} />
            <MetaRow label="Records on file" value={rows.length} mono />
            <MetaRow
              label="Cleared without case"
              value={cleared.length}
              mono
              tone={cleared.length ? 'positive' : undefined}
            />
          </div>
        </div>

        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {rows.length === 0 && <Badge tone="success">No records</Badge>}
          {open.length > 0 && <Badge tone="warning">{open.length} under investigation</Badge>}
          {substantiated.length > 0 && <Badge tone="danger">{substantiated.length} substantiated</Badge>}
          {cleared.length > 0 && <Badge tone="neutral">{cleared.length} closed with no case</Badge>}
        </div>
      </Panel>

      {rows.length === 0 && (
        <Panel padding={0}>
          <EmptyState
            icon="shield-check"
            title={`${staff.label} has a clean record`}
            description="No suspected or confirmed policy violations have been recorded against this staff member."
          />
        </Panel>
      )}

      {rows.length > 0 && (
        <Panel title="Record detail" description="Each entry in full, most recent first.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rows.map((v) => (
              <div
                key={v.ref}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
                  background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
                }}
              >
                <span style={{
                  display: 'grid', placeItems: 'center', width: 30, height: 30, flex: '0 0 auto',
                  borderRadius: 'var(--radius-md)',
                  background: v.status === 'Substantiated' ? 'var(--danger-bg)' : v.status === 'Under investigation' ? 'var(--warning-bg)' : 'var(--surface-sunken)',
                }}>
                  <Icon
                    name={v.status === 'Substantiated' ? 'octagon-alert' : v.status === 'Under investigation' ? 'search' : 'circle-check'}
                    size={15}
                    color={v.status === 'Substantiated' ? '#8A1C21' : v.status === 'Under investigation' ? 'var(--accent-amber-fg)' : 'var(--text-subtle)'}
                  />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{v.category}</span>
                    <Badge tone={STATUS_TONE[v.status]}>{v.status}</Badge>
                    <Badge tone={SEVERITY_TONE[v.severity]}>{v.severity}</Badge>
                  </div>
                  <div style={{ font: 'var(--fw-regular) var(--text-sm)/1.55 var(--font-ui)', color: 'var(--text-body)', marginTop: 6 }}>
                    {v.description}
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 6 }}>
                    {v.ref} · raised {v.date} by {v.raisedBy}
                    {v.amount ? ` · ${money(v.amount)} involved` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </ReportShell>
  )
}
