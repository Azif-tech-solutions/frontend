import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { otpRequests } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

const TABS = [
  { value: 'Awaiting generation', label: 'Awaiting generation', icon: 'hourglass' },
  { value: 'Sent', label: 'Sent', icon: 'send' },
  { value: 'history', label: 'Used & expired', icon: 'history' },
]

const STATUS_TONE = { 'Awaiting generation': 'warning', Sent: 'info', Used: 'success', Expired: 'neutral' }
const PURPOSE_TONE = { 'Wallet withdrawal': 'brand', 'Quantity adjustment': 'neutral' }

export default function WalletWithdrawalOTP({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('Awaiting generation')

  const rows = tab === 'history'
    ? otpRequests.filter((o) => o.status === 'Used' || o.status === 'Expired')
    : otpRequests.filter((o) => o.status === tab)

  const pending = otpRequests.filter((o) => o.status === 'Awaiting generation')
  const sent = otpRequests.filter((o) => o.status === 'Sent')
  const expired = otpRequests.filter((o) => o.status === 'Expired')
  const withdrawals = pending.filter((o) => o.purpose === 'Wallet withdrawal')

  const columns = [
    { key: 'ref', label: 'Request', width: 125, mono: true },
    { key: 'requested', label: 'Requested at', width: 190 },
    { key: 'requester', label: 'Requested by', width: 170 },
    { key: 'role', label: 'Role', width: 170 },
    {
      key: 'purpose', label: 'Purpose', width: 180,
      render: (o) => <Badge tone={PURPOSE_TONE[o.purpose] || 'neutral'}>{o.purpose}</Badge>,
    },
    { key: 'target', label: 'Applies to', width: 250 },
    {
      key: 'amount', label: 'Amount', width: 165, align: 'right', mono: true,
      render: (o) => (o.amount ? money(o.amount) : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'code', label: 'Code', width: 150, mono: true,
      render: (o) => (
        <span style={{ letterSpacing: '0.18em', color: o.status === 'Sent' ? 'var(--text-strong)' : 'var(--text-subtle)' }}>
          {o.code}
        </span>
      ),
    },
    { key: 'expires', label: 'Expires', width: 190 },
    {
      key: 'status', label: 'Status', width: 175,
      render: (o) => <Badge tone={STATUS_TONE[o.status] || 'neutral'}>{o.status}</Badge>,
    },
    ...(tab === 'Awaiting generation'
      ? [{
          key: 'action', label: 'Action', width: 210, sortable: false,
          render: () => (
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="sm" iconLeft="key-round">Generate & send</Button>
              <Button size="sm" variant="secondary">Decline</Button>
            </div>
          ),
        }]
      : tab === 'Sent'
        ? [{
            key: 'action', label: 'Action', width: 160, sortable: false,
            render: () => <Button size="sm" variant="secondary" iconLeft="x">Revoke</Button>,
          }]
        : []),
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Wallet Withdrawal OTP'}
      icon={leaf?.icon}
      description="Generate and manage the one-time codes that authorise dealer wallet withdrawals and stock quantity adjustments. Review each request before issuing a code to the requesting party."
      exportLabel="Export log"
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder="Search by request reference, requester or target…"
      stats={[
        { label: 'Awaiting generation', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
        { label: 'Value pending', value: moneyShort(withdrawals.reduce((n, o) => n + o.amount, 0)), hint: 'Withdrawal requests' },
        { label: 'Codes live', value: String(sent.length), hint: sent.length ? '15-minute validity' : undefined },
        { label: 'Expired unused', value: String(expired.length), tone: expired.length ? 'neutral' : undefined },
      ]}
      columns={columns}
      rows={rows}
      emptyTitle={tab === 'Awaiting generation' ? 'No requests awaiting a code' : tab === 'Sent' ? 'No codes currently live' : 'No used or expired codes'}
      emptyDescription={tab === 'Awaiting generation' ? 'Every request has been reviewed and issued or declined.' : undefined}
      footnote="Codes are valid for 15 minutes and can be used once. A code is issued only after the Administrator has reviewed the request directly with the person making it."
    >
      {tab === 'Awaiting generation' && pending.length > 0 && (
        <Callout tone="warning" icon="shield-alert" title={`${pending.length} request${pending.length === 1 ? '' : 's'} awaiting a code`}>
          Verify each request with the person who raised it before generating. A code authorises a withdrawal
          from a dealer's wallet or a change to recorded stock, and both are difficult to reverse.
        </Callout>
      )}

      <Panel title="What a code authorises">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name="wallet" size={15} color="var(--brand)" />
              <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--text-strong)' }}>Wallet withdrawal</span>
            </div>
            <MetaRow label="Requested by" value="Accounts / Cashier" />
            <MetaRow label="Sent to" value="Dealer's registered number" />
            <MetaRow label="Guard" value="Balance cannot go negative" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Icon name="sliders-horizontal" size={15} color="var(--text-muted)" />
              <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--text-strong)' }}>Quantity adjustment</span>
            </div>
            <MetaRow label="Requested by" value="Stock Keeper" />
            <MetaRow label="Sent to" value="Requesting officer" />
            <MetaRow label="Guard" value="Reason and identity logged" />
          </div>
        </div>
      </Panel>
    </RegisterShell>
  )
}
