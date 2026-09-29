import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { banks, cashiers, posTransferQueue } from '../sampleAccount.js'
import { money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'Pending', label: 'Awaiting verification', icon: 'hourglass' },
  { value: 'Approved', label: 'Approved', icon: 'circle-check-big' },
  { value: 'Declined', label: 'Declined', icon: 'circle-x' },
]

const TONE = { Pending: 'warning', Approved: 'success', Declined: 'danger' }

export default function POSConfirmation({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('Pending')
  const rows = posTransferQueue.filter((t) => t.status === tab)

  const pending = posTransferQueue.filter((t) => t.status === 'Pending')
  const pendingValue = pending.reduce((n, t) => n + t.amount, 0)
  const approvedValue = posTransferQueue.filter((t) => t.status === 'Approved').reduce((n, t) => n + t.amount, 0)
  const declined = posTransferQueue.filter((t) => t.status === 'Declined')

  const columns = [
    { key: 'ref', label: 'Transaction', width: 120, mono: true },
    { key: 'date', label: 'Date', width: 130 },
    {
      key: 'channel', label: 'Channel', width: 150,
      render: (t) => <Badge tone={t.channel === 'POS' ? 'brand' : 'neutral'}>{t.channel}</Badge>,
    },
    { key: 'customer', label: 'Customer', width: 230 },
    { key: 'cashier', label: 'Cashier', width: 150 },
    { key: 'terminal', label: 'Terminal', width: 140, mono: true },
    { key: 'bank', label: 'Receiving bank', width: 190 },
    { key: 'amount', label: 'Amount', width: 165, align: 'right', mono: true, render: (t) => money(t.amount) },
    ...(tab === 'Pending'
      ? [{
          key: 'action', label: 'Action', width: 190, sortable: false,
          render: () => (
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" iconLeft="check">Approve</Button>
              <Button size="sm" variant="secondary">Decline</Button>
            </div>
          ),
        }]
      : [
          { key: 'reviewedBy', label: 'Reviewed by', width: 150 },
          { key: 'reviewedOn', label: 'Reviewed on', width: 140 },
          {
            key: 'status', label: 'Outcome', width: 120,
            render: (t) => <Badge tone={TONE[t.status]}>{t.status}</Badge>,
          },
          { key: 'note', label: 'Note', width: 280, render: (t) => t.note || '—' },
        ]),
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'POS/Fund Transfer Confirmation'}
      icon={leaf?.icon}
      description="Verify POS and fund transfer payments before they are finalised. Confirm the funds reached the company account, then approve — or decline and flag the transaction for investigation."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by transaction reference, customer or cashier…"
      filters={
        <>
          <Select options={banks} placeholder="All banks" style={{ width: 190 }} />
          <Select options={cashiers} placeholder="All cashiers" style={{ width: 170 }} />
        </>
      }
      stats={[
        { label: 'Awaiting verification', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
        { label: 'Value unverified', value: moneyShort(pendingValue) },
        { label: 'Approved this period', value: moneyShort(approvedValue) },
        { label: 'Declined', value: String(declined.length), tone: declined.length ? 'negative' : undefined, hint: declined.length ? 'Flagged for review' : undefined },
      ]}
      columns={columns}
      rows={rows}
      totals={{ ref: 'Total', amount: money(rows.reduce((n, t) => n + t.amount, 0)) }}
      emptyTitle={tab === 'Pending' ? 'Nothing awaiting verification' : `No ${tab.toLowerCase()} transactions`}
      emptyDescription={tab === 'Pending' ? 'Every POS and transfer payment has been reviewed.' : undefined}
      footnote="A transaction is not treated as settled until it is approved here. Declined transactions remain on record and are flagged for investigation rather than deleted."
    >
      {tab === 'Pending' && pending.length > 0 && (
        <Callout tone="warning" icon="hourglass" title={`${money(pendingValue)} awaiting verification`}>
          Check each payment against the receiving bank account before approving. Anything without a matching
          settlement should be declined and flagged rather than left pending.
        </Callout>
      )}
    </RegisterShell>
  )
}
