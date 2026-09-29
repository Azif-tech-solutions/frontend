import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { customers, customerTypes } from '../sampleOthers.js'
import { money } from '../utils.js'

const TYPE_TONE = { 'Authorised Dealer': 'brand', 'Special Customer': 'info', 'Ordinary Customer': 'neutral', 'No Credit / Walk-in': 'neutral' }
// Higher index means greater standing, so a move can be labelled promotion or demotion.
const RANK = { 'No Credit / Walk-in': 0, 'Ordinary Customer': 1, 'Special Customer': 2, 'Authorised Dealer': 3 }

const REASONS = [
  { value: 'performance', label: 'Sustained sales performance' },
  { value: 'volume', label: 'Met required purchase volume' },
  { value: 'compliance', label: 'Compliance concern' },
  { value: 'arrears', label: 'Payment arrears' },
  { value: 'inactivity', label: 'Prolonged inactivity' },
  { value: 'management', label: 'Management decision' },
]

export default function DealersUpdate({ leaf, moduleLabel, parentLabel }) {
  const [code, setCode] = useState('CU-0031')
  const [newType, setNewType] = useState('')

  const customer = customers.find((c) => c.code === code) || customers[0]
  const target = customerTypes.find((t) => t.label === newType)
  const delta = target ? RANK[target.label] - RANK[customer.type] : 0
  const direction = delta > 0 ? 'Promotion' : delta < 0 ? 'Demotion' : null

  const columns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'name', label: 'Customer', width: 240 },
    {
      key: 'type', label: 'Current classification', width: 200,
      render: (c) => <Badge tone={TYPE_TONE[c.type] || 'neutral'}>{c.type}</Badge>,
    },
    { key: 'showroom', label: 'Home showroom', width: 190 },
    { key: 'rep', label: 'Sales rep', width: 180 },
    { key: 'since', label: 'Customer since', width: 160 },
    { key: 'lifetime', label: 'Lifetime value', width: 175, align: 'right', mono: true, render: (c) => money(c.lifetime) },
    { key: 'wallet', label: 'Wallet', width: 150, align: 'right', mono: true, render: (c) => money(c.wallet) },
    {
      key: 'status', label: 'Standing', width: 130,
      render: (c) => <Badge tone={c.status === 'Active' ? 'success' : 'warning'}>{c.status}</Badge>,
    },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Dealers Update'}
      icon={leaf?.icon}
      description="Manage how customers and dealers are classified. A dealer can be promoted or demoted on performance or compliance, downgraded to an ordinary customer, or an ordinary customer promoted once they meet the required conditions."
      submitLabel={direction ? `Confirm ${direction.toLowerCase()}` : 'Update classification'}
      onCancel={() => {}}
      note="Reclassification takes effect immediately and changes the pricing, credit terms and commission treatment applied to this customer."
      aside={
        <>
          <Panel title="Reclassification">
            <MetaRow label="Customer" value={customer.name} />
            <MetaRow label="Current" value={customer.type} />
            <MetaRow label="Proposed" value={newType || '—'} />
            <MetaRow label="Lifetime value" value={money(customer.lifetime)} mono />
            {direction && (
              <div style={{
                marginTop: 14, padding: '14px 16px',
                background: direction === 'Promotion' ? 'var(--success-bg)' : 'var(--warning-bg)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon
                    name={direction === 'Promotion' ? 'trending-up' : 'trending-down'}
                    size={15}
                    color={direction === 'Promotion' ? 'var(--accent-green-fg)' : 'var(--accent-amber-fg)'}
                  />
                  <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: direction === 'Promotion' ? 'var(--accent-green-fg)' : 'var(--accent-amber-fg)' }}>
                    {direction}
                  </span>
                </div>
                <div style={{ marginTop: 8, font: 'var(--type-caption)', color: direction === 'Promotion' ? 'var(--accent-green-fg)' : 'var(--accent-amber-fg)', lineHeight: 1.55 }}>
                  {customer.type} → {newType}
                </div>
              </div>
            )}
            {customer.wallet > 0 && delta < 0 && (
              <Callout tone="warning" icon="wallet" title="Wallet balance held" style={{ marginTop: 14 }}>
                This customer holds {money(customer.wallet)} in their wallet. The balance carries over on
                reclassification and remains available to spend.
              </Callout>
            )}
          </Panel>

          <Panel title="What changes">
            <MetaRow label="Pricing tier" value={delta ? 'Recalculated' : 'Unchanged'} />
            <MetaRow label="Credit terms" value={delta ? 'Reassessed' : 'Unchanged'} />
            <MetaRow label="Commission eligibility" value={target?.label === 'Authorised Dealer' ? 'Eligible' : 'Not eligible'} />
            <MetaRow label="Wallet balance" value="Carried over" />
          </Panel>
        </>
      }
    >
      <Panel title="Select customer" description="Choose the customer or dealer whose classification is changing.">
        <FieldSet columns={3}>
          <Select
            label="Customer"
            options={customers.map((c) => ({ value: c.code, label: `${c.code} · ${c.name}` }))}
            value={code}
            onChange={(e) => { setCode(e.target.value); setNewType('') }}
          />
          <Input label="Current classification" value={customer.type} onChange={() => {}} disabled />
          <Select
            label="New classification"
            options={customerTypes.filter((t) => t.label !== customer.type).map((t) => ({ value: t.label, label: t.label }))}
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Select classification…"
          />
          <Select label="Reason" options={REASONS} placeholder="Select reason…" />
          <Input label="Effective from" type="date" />
          <Input label="Authorised by" value="M. Okonkwo" onChange={() => {}} />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={TYPE_TONE[customer.type] || 'neutral'}>{customer.type}</Badge>
          {newType && <Icon name="arrow-right" size={13} color="var(--text-subtle)" />}
          {newType && <Badge tone={TYPE_TONE[newType] || 'neutral'}>{newType}</Badge>}
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            Customer since {customer.since} · {money(customer.lifetime)} lifetime value
          </span>
        </div>
      </Panel>

      <Panel title="All customers and dealers" description="Current classification across the customer base." padding={0}>
        <ReportTable
          columns={columns}
          rows={customers}
          rowKey={(c) => c.code}
          onRowClick={(c) => { setCode(c.code); setNewType('') }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
