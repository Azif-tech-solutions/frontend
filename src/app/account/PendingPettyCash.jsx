import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { pendingPettyCash } from '../sampleAccount.js'
import { money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'Pending', label: 'Awaiting response', icon: 'hourglass' },
  { value: 'Accepted', label: 'Accepted', icon: 'circle-check-big' },
  { value: 'Rejected', label: 'Rejected', icon: 'circle-x' },
]

const TONE = { Pending: 'warning', Accepted: 'success', Rejected: 'danger' }

export default function PendingPettyCash({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('Pending')
  const rows = pendingPettyCash.filter((p) => p.status === tab)

  const pending = pendingPettyCash.filter((p) => p.status === 'Pending')
  const pendingValue = pending.reduce((n, p) => n + p.amount, 0)
  const accepted = pendingPettyCash.filter((p) => p.status === 'Accepted')
  const rejected = pendingPettyCash.filter((p) => p.status === 'Rejected')

  const columns = [
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    { key: 'date', label: 'Sent on', width: 130 },
    { key: 'branch', label: 'Branch', width: 190 },
    { key: 'purpose', label: 'Purpose', width: 320 },
    { key: 'sentBy', label: 'Sent by', width: 180 },
    { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (p) => money(p.amount) },
    ...(tab === 'Pending'
      ? [{
          key: 'action', label: 'Action', width: 175, sortable: false,
          render: () => (
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" iconLeft="check">Accept</Button>
              <Button size="sm" variant="secondary">Reject</Button>
            </div>
          ),
        }]
      : [
          {
            key: 'status', label: 'Outcome', width: 120,
            render: (p) => <Badge tone={TONE[p.status]}>{p.status}</Badge>,
          },
          { key: 'respondedBy', label: 'Responded by', width: 160 },
          { key: 'respondedOn', label: 'Responded on', width: 140 },
          { key: 'note', label: 'Note', width: 300, render: (p) => p.note || '—' },
        ]),
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Accept or Reject Pending Petty Cash'}
      icon={leaf?.icon}
      description="Petty cash allocations sent to a branch. The branch account officer verifies receipt and either accepts the allocation — crediting it to the branch account — or rejects it for correction."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by reference, branch or purpose…"
      filters={<Select options={showrooms} placeholder="All branches" style={{ width: 190 }} />}
      stats={[
        { label: 'Awaiting response', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
        { label: 'Value pending', value: moneyShort(pendingValue) },
        { label: 'Accepted this period', value: moneyShort(accepted.reduce((n, p) => n + p.amount, 0)) },
        { label: 'Rejected', value: String(rejected.length), tone: rejected.length ? 'negative' : undefined, hint: rejected.length ? 'Needs correction' : undefined },
      ]}
      columns={columns}
      rows={rows}
      totals={{ ref: 'Total', amount: money(rows.reduce((n, p) => n + p.amount, 0)) }}
      emptyTitle={tab === 'Pending' ? 'Nothing awaiting response' : `No ${tab.toLowerCase()} allocations`}
      emptyDescription={tab === 'Pending' ? 'Every petty cash allocation sent to your branch has been reviewed.' : undefined}
      footnote="An allocation is credited to the branch petty cash account only once accepted. Rejected allocations are flagged for correction and stay on record for review."
    >
      {tab === 'Pending' && pending.length > 0 && (
        <Callout tone="warning" icon="hourglass" title={`${money(pendingValue)} awaiting acceptance`}>
          Verify each amount reached the branch account before accepting. Reject anything unverified so it can be
          corrected rather than sitting unacknowledged.
        </Callout>
      )}
    </RegisterShell>
  )
}
