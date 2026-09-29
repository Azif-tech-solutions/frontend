import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { branchFunds } from '../sampleAccount.js'
import { money, moneyShort } from '../utils.js'

const TONE = { Awaiting: 'warning', Confirmed: 'success', 'Partially confirmed': 'warning', Rejected: 'danger' }

export default function FundsAwaitingBranch({ leaf, moduleLabel, parentLabel }) {
  const awaiting = branchFunds.filter((f) => f.status === 'Awaiting')
  const [selectedRef, setSelectedRef] = useState(awaiting[0]?.ref)
  const [received, setReceived] = useState('')

  const selected = branchFunds.find((f) => f.ref === selectedRef) || awaiting[0]
  const receivedAmount = received === '' ? null : Number(received) || 0
  const rejected = receivedAmount == null ? null : selected.sent - receivedAmount
  const overReceived = rejected != null && rejected < 0
  const partial = rejected != null && rejected > 0

  const awaitingTotal = awaiting.reduce((n, f) => n + f.sent, 0)
  const settled = branchFunds.filter((f) => f.status !== 'Awaiting')
  const shortfall = settled.reduce((n, f) => n + (f.rejected || 0), 0)

  const columns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'date', label: 'Sent on', width: 130 },
    { key: 'branch', label: 'Branch', width: 180 },
    { key: 'purpose', label: 'Purpose', width: 280 },
    { key: 'channel', label: 'Channel', width: 140 },
    { key: 'sentBy', label: 'Sent by', width: 170 },
    { key: 'sent', label: 'Amount sent', width: 165, align: 'right', mono: true, render: (f) => money(f.sent) },
    {
      key: 'received', label: 'Received', width: 165, align: 'right', mono: true,
      render: (f) => (f.received == null ? <span style={{ color: 'var(--text-subtle)' }}>—</span> : money(f.received)),
    },
    {
      key: 'rejected', label: 'Rejected', width: 155, align: 'right', mono: true,
      render: (f) => (f.rejected ? <span style={{ color: 'var(--danger)' }}>{money(f.rejected)}</span> : f.rejected === 0 ? money(0) : '—'),
    },
    {
      key: 'status', label: 'Status', width: 170,
      render: (f) => <Badge tone={TONE[f.status] || 'neutral'}>{f.status}</Badge>,
    },
    { key: 'confirmedBy', label: 'Confirmed by', width: 160, render: (f) => f.confirmedBy || '—' },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Funds Awaiting'}
      icon={leaf?.icon}
      description="Confirm and acknowledge funds sent from the central account to a showroom or outlet. The receiving account officer records the exact amount received and any portion not acknowledged."
      submitLabel="Confirm receipt"
      onCancel={() => {}}
      note="Funds are not credited to the branch account until confirmed here. Any shortfall is raised automatically with the disbursing officer."
      secondaryAction={<Button variant="secondary" iconLeft="flag">Reject in full</Button>}
      aside={
        <>
          <Panel title="Confirmation">
            <MetaRow label="Reference" value={selected.ref} mono />
            <MetaRow label="Branch" value={selected.branch} />
            <MetaRow label="Amount sent" value={money(selected.sent)} mono />
            <MetaRow label="Amount received" value={receivedAmount == null ? '—' : money(receivedAmount)} mono tone={receivedAmount ? 'positive' : undefined} />
            <MetaRow
              label="Rejected / not acknowledged"
              value={rejected == null ? '—' : money(Math.max(0, rejected))}
              mono
              tone={partial ? 'negative' : undefined}
            />
            {overReceived && (
              <Callout tone="danger" icon="circle-alert" title="Received exceeds amount sent" style={{ marginTop: 14 }}>
                You have recorded {money(receivedAmount)} against {money(selected.sent)} disbursed. The received
                amount cannot exceed what was sent.
              </Callout>
            )}
            {partial && (
              <Callout tone="warning" icon="triangle-alert" title="Shortfall will be flagged" style={{ marginTop: 14 }}>
                {money(rejected)} of this disbursement will be recorded as not acknowledged and raised with
                {' '}{selected.sentBy} for correction.
              </Callout>
            )}
          </Panel>

          <Panel title="Position">
            <MetaRow label="Awaiting confirmation" value={money(awaitingTotal)} mono tone="negative" />
            <MetaRow label="Disbursements pending" value={awaiting.length} mono />
            <MetaRow label="Shortfalls recorded" value={money(shortfall)} mono tone={shortfall ? 'negative' : undefined} />
          </Panel>
        </>
      }
    >
      <Panel title="Select a disbursement" description="Funds sent to your branch that have not yet been acknowledged.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {awaiting.map((f) => {
            const on = f.ref === selectedRef
            return (
              <div
                key={f.ref}
                onClick={() => { setSelectedRef(f.ref); setReceived('') }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
                  background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                  border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                }}
              >
                <Icon name="banknote-arrow-down" size={16} color={on ? 'var(--brand)' : 'var(--text-subtle)'} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)', color: 'var(--text-strong)' }}>{money(f.sent)}</span>
                    <Badge tone="warning">{f.status}</Badge>
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{f.purpose}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                    {f.ref} · {f.branch} · {f.date} · {f.channel}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Record what was received" description="Enter the exact amount received. Anything short of the amount sent is recorded as rejected.">
        <FieldSet columns={3}>
          <Input label="Amount sent (₦)" value={money(selected.sent)} onChange={() => {}} disabled />
          <Input
            label="Amount received (₦)"
            type="number"
            placeholder="0.00"
            value={received}
            onChange={(e) => setReceived(e.target.value)}
            error={overReceived ? 'Cannot exceed the amount sent' : undefined}
            hint={partial ? `${money(rejected)} will be recorded as rejected` : undefined}
          />
          <Input
            label="Rejected / not acknowledged (₦)"
            value={rejected == null ? '' : money(Math.max(0, rejected))}
            onChange={() => {}}
            disabled
          />
          <Input label="Date received" type="date" />
          <Input label="Confirmed by" value="R. Danladi" onChange={() => {}} />
          <Input label="Bank credit reference" placeholder="Optional" />
        </FieldSet>
        {partial && (
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Reason for shortfall *</div>
              <textarea
                rows={2}
                placeholder="Explain why part of the disbursement was not acknowledged."
                style={{
                  width: '100%', padding: '10px 12px', resize: 'vertical',
                  background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
                }}
              />
            </label>
          </div>
        )}
      </Panel>

      <Panel title="Disbursement history" description="Funds sent to branches and how each was acknowledged." padding={0}>
        <ReportTable
          columns={columns}
          rows={branchFunds}
          rowKey={(f) => f.ref}
          totals={{ ref: 'Total', sent: money(branchFunds.reduce((n, f) => n + f.sent, 0)), rejected: money(shortfall) }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>

      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>
        {moneyShort(awaitingTotal)} across {awaiting.length} disbursements is currently awaiting acknowledgement.
      </div>
    </FormShell>
  )
}
