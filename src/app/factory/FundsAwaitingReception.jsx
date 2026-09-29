import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { factories, fundsAwaiting } from '../sample.js'
import { money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'Awaiting', label: 'Awaiting confirmation', icon: 'hourglass' },
  { value: 'Queried', label: 'Queried', icon: 'circle-help' },
  { value: 'Confirmed', label: 'Confirmed', icon: 'circle-check-big' },
]

const TONE = { Awaiting: 'warning', Queried: 'danger', Confirmed: 'success' }

export default function FundsAwaitingReception({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('Awaiting')
  const rows = fundsAwaiting.filter((f) => f.status === tab)

  const awaitingTotal = fundsAwaiting.filter((f) => f.status === 'Awaiting').reduce((n, f) => n + f.amount, 0)
  const queriedTotal = fundsAwaiting.filter((f) => f.status === 'Queried').reduce((n, f) => n + f.amount, 0)
  const confirmedTotal = fundsAwaiting.filter((f) => f.status === 'Confirmed').reduce((n, f) => n + f.amount, 0)

  const isOpen = tab !== 'Confirmed'

  const columns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'disbursedDate', label: 'Disbursed', width: 130 },
    { key: 'purpose', label: 'Purpose', width: 320 },
    { key: 'disbursedBy', label: 'Disbursed by', width: 210 },
    { key: 'channel', label: 'Channel', width: 130 },
    { key: 'factory', label: 'Factory', width: 130 },
    { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
    {
      key: 'status', label: 'Status', width: 130,
      render: (r) => <Badge tone={TONE[r.status]}>{r.status}</Badge>,
    },
    ...(tab === 'Confirmed'
      ? [{ key: 'confirmedBy', label: 'Confirmed by', width: 200, render: (r) => `${r.confirmedBy} · ${r.confirmedDate}` }]
      : [{
          key: 'actions', label: 'Action', width: 210, sortable: false,
          render: () => (
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" iconLeft="check">Confirm receipt</Button>
              <Button size="sm" variant="secondary">Query</Button>
            </div>
          ),
        }]),
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Funds Awaiting Reception'}
      icon={leaf?.icon}
      description="Funds disbursed for factory internal operations are held here until the factory accountant acknowledges and confirms they were received."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by reference, purpose or disbursing officer…"
      filters={<Select options={factories} placeholder="All factories" style={{ width: 190 }} />}
      stats={[
        { label: 'Awaiting confirmation', value: moneyShort(awaitingTotal), hint: `${fundsAwaiting.filter((f) => f.status === 'Awaiting').length} disbursements` },
        { label: 'Queried', value: moneyShort(queriedTotal), tone: 'negative', hint: 'Needs resolution' },
        { label: 'Confirmed this period', value: moneyShort(confirmedTotal) },
        { label: 'Oldest awaiting', value: '2 days', hint: 'FD-0899 · 22 Aug' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ ref: 'Total', amount: money(rows.reduce((n, r) => n + r.amount, 0)) }}
      emptyTitle={tab === 'Awaiting' ? 'Nothing awaiting confirmation' : tab === 'Queried' ? 'No queried disbursements' : 'No confirmed disbursements in this period'}
      emptyDescription={tab === 'Awaiting' ? 'All disbursed funds have been acknowledged by the factory accountant.' : undefined}
      footnote="Funds are not recorded against the factory's operating balance, and cannot be utilised, until confirmed here."
    >
      {isOpen && rows.length > 0 && (
        <Callout
          tone={tab === 'Queried' ? 'danger' : 'warning'}
          icon={tab === 'Queried' ? 'circle-alert' : 'hourglass'}
          title={tab === 'Queried' ? 'Queried disbursements need resolution' : `${money(awaitingTotal)} held pending acknowledgement`}
        >
          {tab === 'Queried'
            ? 'These disbursements were disputed by the receiving factory. Resolve each with the disbursing officer before they can be confirmed and utilised.'
            : 'These funds have left Management but have not yet been acknowledged as received. They remain unavailable for factory use until confirmed.'}
        </Callout>
      )}
    </RegisterShell>
  )
}
