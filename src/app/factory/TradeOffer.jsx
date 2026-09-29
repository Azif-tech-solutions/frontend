import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { factoryTrades, materialPosition, tradeReasons, CURRENT_FACTORY } from '../sample.js'
import { fmt, money } from '../utils.js'

const STATUS_TONE = { Open: 'info', Accepted: 'success', Rejected: 'danger', Withdrawn: 'neutral' }

/** Only stock above its re-order level can honestly be offered as surplus. */
const surplusOptions = Object.entries(materialPosition)
  .filter(([, m]) => m.onHand > m.reorderLevel)
  .map(([code, m]) => ({ value: code, label: m.name }))

export default function TradeOffer({ leaf, moduleLabel, parentLabel }) {
  const [code, setCode] = useState('')
  const [qty, setQty] = useState('')

  const position = materialPosition[code]
  const surplus = position ? position.onHand - position.reorderLevel : 0
  const offering = Number(qty) || 0
  const overOffered = position && offering > surplus
  const value = position ? offering * position.unitCost : 0

  const myOffers = factoryTrades.filter((t) => t.direction === 'Outgoing')

  const columns = [
    { key: 'ref', label: 'Offer ref.', width: 110, mono: true },
    { key: 'material', label: 'Raw material', width: 240, render: (t) => materialPosition[t.code].name },
    { key: 'qty', label: 'Qty offered', width: 130, align: 'right', mono: true, render: (t) => fmt(t.qty) },
    { key: 'unit', label: 'Unit', width: 110, render: (t) => materialPosition[t.code].unit },
    { key: 'value', label: 'Value', width: 160, align: 'right', mono: true, render: (t) => money(t.qty * materialPosition[t.code].unitCost) },
    { key: 'to', label: 'Offered to', width: 140 },
    { key: 'offered', label: 'Offered on', width: 130 },
    { key: 'expires', label: 'Expires', width: 130 },
    { key: 'status', label: 'Status', width: 120, render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge> },
    {
      key: 'action', label: 'Action', width: 130, sortable: false,
      render: (t) => (t.status === 'Open'
        ? <Button size="sm" variant="secondary">Withdraw</Button>
        : <span style={{ color: 'var(--text-subtle)' }}>{t.respondedBy ? `by ${t.respondedBy}` : '—'}</span>),
    },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Offer Trade'}
      icon={leaf?.icon}
      description="Offer excess raw materials to other factories in the organisation, so surplus is redistributed internally rather than purchased externally. Other factories review and accept offers against their own production needs."
      submitLabel="List offer"
      onCancel={() => {}}
      note="Listing an offer does not move stock. The material stays in your factory until the receiving factory accepts and the transfer completes."
      aside={
        <>
          <Panel title="Offer summary">
            <MetaRow label="Material" value={position ? position.name.split(' · ')[1] : '—'} />
            <MetaRow label="On hand" value={position ? `${fmt(position.onHand)} ${position.unit.toLowerCase()}` : '—'} mono />
            <MetaRow label="Re-order level" value={position ? fmt(position.reorderLevel) : '—'} mono />
            <MetaRow
              label="Surplus available"
              value={position ? fmt(surplus) : '—'}
              mono
              tone={position ? 'positive' : undefined}
            />
            <MetaRow label="Offer value" value={value ? money(value) : '—'} mono />
            {overOffered && (
              <Callout tone="danger" icon="circle-alert" title="Exceeds surplus" style={{ marginTop: 14 }}>
                You are offering {fmt(offering)} but only {fmt(surplus)} sits above your re-order level.
                Offering more would push this material below its threshold.
              </Callout>
            )}
          </Panel>

          <Panel title="How trading works">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Offers are visible to the receiving factory under Pending Trade, where they are accepted or rejected
              against production needs. Accepted trades move stock between factories and appear in the Trade Report
              with both the offer and response dates.
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Material to offer" description="Only stock held above its re-order level can be offered as surplus.">
        <FieldSet columns={3}>
          <Select label="Raw material" options={surplusOptions} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Select surplus material…" />
          <Input label="Quantity to offer" type="number" placeholder="0" value={qty} onChange={(e) => setQty(e.target.value)} error={overOffered ? `Only ${fmt(surplus)} available above threshold` : undefined} />
          <Input label="Unit" value={position?.unit || ''} onChange={() => {}} disabled />
          <Select label="Reason for surplus" options={tradeReasons} placeholder="Select reason…" />
          <Select
            label="Offer to"
            options={[{ value: 'all', label: 'All factories' }, { value: 'fb', label: 'Factory B — Sango Otta' }]}
            placeholder="Select recipient…"
          />
          <Input label="Offer expires" type="date" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Notes</div>
            <textarea
              rows={3}
              placeholder="Batch, condition, expiry, or handling detail the receiving factory should know."
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">Offering from {CURRENT_FACTORY}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {surplusOptions.length} materials currently sit above their re-order level.
          </span>
        </div>
      </Panel>

      <Panel title="My active offers" description="Offers this factory has listed, and how other factories responded." padding={0}>
        <ReportTable
          columns={columns}
          rows={myOffers}
          rowKey={(t) => t.ref}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
          emptyLabel="No offers listed yet"
        />
      </Panel>
    </FormShell>
  )
}
