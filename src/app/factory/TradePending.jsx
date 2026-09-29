import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { factoryTrades, materialPosition } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'pending', label: 'Awaiting response', icon: 'hourglass' },
  { value: 'responded', label: 'Responded', icon: 'circle-check-big' },
]

const STATUS_TONE = { Pending: 'warning', Accepted: 'success', Rejected: 'danger' }

/**
 * Whether accepting an offer helps this factory — the basis on which the PRD
 * says trades are evaluated ("based on their production needs").
 */
function assess(trade) {
  const p = materialPosition[trade.code]
  const shortfall = Math.max(0, p.reorderLevel - p.onHand)
  if (!shortfall) return { label: 'Not needed', tone: 'neutral', note: 'Stock is above re-order level' }
  if (trade.qty >= shortfall) return { label: 'Covers shortfall', tone: 'success', note: `Clears a ${fmt(shortfall)} ${p.unit.toLowerCase()} shortfall` }
  return { label: 'Partly covers', tone: 'warning', note: `${fmt(shortfall - trade.qty)} ${p.unit.toLowerCase()} still short` }
}

export default function TradePending({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('pending')

  const incoming = factoryTrades.filter((t) => t.direction === 'Incoming')
  const pending = incoming.filter((t) => t.status === 'Pending')
  const rows = (tab === 'pending' ? pending : incoming.filter((t) => t.status !== 'Pending'))
    .map((t) => ({ ...t, assessment: assess(t), position: materialPosition[t.code] }))

  const pendingValue = pending.reduce((n, t) => n + t.qty * materialPosition[t.code].unitCost, 0)
  const needed = pending.filter((t) => assess(t).tone !== 'neutral')

  const columns = [
    { key: 'ref', label: 'Offer ref.', width: 110, mono: true },
    { key: 'from', label: 'From factory', width: 140 },
    { key: 'material', label: 'Raw material', width: 235, render: (t) => t.position.name },
    { key: 'qty', label: 'Qty offered', width: 130, align: 'right', mono: true, render: (t) => fmt(t.qty) },
    { key: 'unit', label: 'Unit', width: 105, render: (t) => t.position.unit },
    { key: 'value', label: 'Value', width: 155, align: 'right', mono: true, render: (t) => money(t.qty * t.position.unitCost) },
    { key: 'onHand', label: 'Your stock', width: 120, align: 'right', mono: true, render: (t) => fmt(t.position.onHand) },
    { key: 'reorderLevel', label: 'Your level', width: 115, align: 'right', mono: true, render: (t) => fmt(t.position.reorderLevel) },
    {
      key: 'assessment', label: 'Assessment', width: 165,
      render: (t) => <Badge tone={t.assessment.tone}>{t.assessment.label}</Badge>,
    },
    { key: 'reason', label: 'Offered because', width: 220 },
    { key: 'offered', label: 'Offered on', width: 130 },
    ...(tab === 'pending'
      ? [
          { key: 'expires', label: 'Expires', width: 125 },
          {
            key: 'action', label: 'Action', width: 175, sortable: false,
            render: () => (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="sm" iconLeft="check">Accept</Button>
                <Button size="sm" variant="secondary">Reject</Button>
              </div>
            ),
          },
        ]
      : [
          { key: 'responded', label: 'Responded on', width: 140 },
          { key: 'status', label: 'Outcome', width: 120, render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge> },
          { key: 'respondedBy', label: 'Responded by', width: 160 },
        ]),
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Pending Trade'}
      icon={leaf?.icon}
      description="Trade offers submitted by other factories. Review each against your own production needs and accept or reject it before the exchange is finalised."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by reference, material or offering factory…"
      stats={[
        { label: 'Awaiting your response', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
        { label: 'Value on offer', value: moneyShort(pendingValue) },
        { label: 'Materials you are short of', value: String(needed.length), hint: needed.length ? 'Worth accepting' : 'None' },
        { label: 'Soonest expiry', value: pending.length ? '28 Aug' : '—', hint: pending.length ? 'FT-0212' : undefined },
      ]}
      columns={columns}
      rows={rows}
      emptyTitle={tab === 'pending' ? 'No offers awaiting your response' : 'No trades responded to yet'}
      emptyDescription={tab === 'pending' ? 'Other factories have not listed any surplus for you at the moment.' : undefined}
      footnote="Accepting a trade moves the material from the offering factory to yours and records the exchange in the Trade Report. Stock does not move until you accept."
    >
      {tab === 'pending' && needed.length > 0 && (
        <Callout tone="success" icon="lightbulb" title={`${needed.length} of these offers cover a shortfall you have`}>
          {needed.map((t) => {
            const a = assess(t)
            return `${materialPosition[t.code].name.split(' · ')[1]} — ${a.note.toLowerCase()}`
          }).join('; ')}. Accepting internally avoids an external purchase order.
        </Callout>
      )}
    </RegisterShell>
  )
}
