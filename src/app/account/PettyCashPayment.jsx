import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { expenseCategories, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
import { dealerWallets } from '../sampleShowroom.js'
import { money } from '../utils.js'

const MODES = [
  { value: 'petty', label: 'Petty cash payment', icon: 'banknote-arrow-down' },
  { value: 'wallet', label: 'Wallet withdrawal', icon: 'wallet' },
]

const WITHDRAWAL_REASONS = [
  { value: 'request', label: 'Dealer withdrawal request' },
  { value: 'commission', label: 'Recovery of excess commission' },
  { value: 'correction', label: 'Correction of over-credit' },
  { value: 'settlement', label: 'Settlement against outstanding invoice' },
]

const pettyCategories = expenseCategories
  .filter((c) => c.pettyCashAllowed === 'Yes' && c.status === 'Active')
  .map((c) => ({ value: c.code, label: c.name }))

export default function PettyCashPayment({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('petty')
  const [amount, setAmount] = useState('')
  const [dealerId, setDealerId] = useState('dl-bendel')

  const isWallet = mode === 'wallet'
  const wallet = dealerWallets.find((d) => d.value === dealerId) || dealerWallets[0]

  const funded = pettyCashFunding.reduce((n, r) => n + r.amount, 0)
  const spent = pettyCashPayments.reduce((n, r) => n + r.amount, 0)
  const pettyBalance = pettyCashOpening + funded - spent

  const available = isWallet ? wallet.balance : pettyBalance
  const requested = Number(amount) || 0
  const remaining = available - requested

  // A wallet balance may never go negative, and petty cash cannot be overdrawn.
  const overdrawn = requested > available

  return (
    <FormShell
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Petty Cash Payment / Wallet Withdrawal'}
      icon={leaf?.icon}
      description="Process petty cash disbursements, and manage withdrawals from a dealer's wallet — whether the dealer has requested their balance or the company is recovering excess commission."
      submitLabel={isWallet ? 'Process withdrawal' : 'Process payment'}
      onCancel={() => {}}
      note={isWallet
        ? 'The dealer’s wallet balance updates immediately. A withdrawal can never take a wallet below zero.'
        : 'The petty cash balance updates immediately, and the payment appears on both the Petty Cash Statement and the Cash Inflow/Outflow Statement.'}
      aside={
        <>
          <Panel title={isWallet ? 'Wallet position' : 'Petty cash position'}>
            {isWallet ? (
              <>
                <MetaRow label="Dealer" value={wallet.label} />
                <MetaRow label="Current balance" value={money(wallet.balance)} mono />
              </>
            ) : (
              <>
                <MetaRow label="Funded to date" value={money(funded)} mono tone="positive" />
                <MetaRow label="Utilised to date" value={money(spent)} mono tone="negative" />
                <MetaRow label="Current balance" value={money(pettyBalance)} mono />
              </>
            )}
            <MetaRow label={isWallet ? 'Withdrawal' : 'Payment'} value={requested ? money(requested) : '—'} mono tone={requested ? 'negative' : undefined} />
            <div style={{
              marginTop: 14, padding: '14px 16px',
              background: overdrawn ? 'var(--danger-bg)' : 'var(--brand-subtle)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Balance after</div>
              <div style={{
                marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                color: overdrawn ? 'var(--danger)' : 'var(--text-strong)',
              }}>
                {money(remaining)}
              </div>
            </div>
            {overdrawn && (
              <Callout tone="danger" icon="circle-alert" title={isWallet ? 'Withdrawal exceeds wallet balance' : 'Insufficient petty cash'} style={{ marginTop: 14 }}>
                {isWallet
                  ? `Only ${money(available)} is available in this wallet. A wallet balance may never go negative, so the withdrawal cannot be processed at this amount.`
                  : `Only ${money(available)} remains in petty cash. Credit the account before processing a payment this size.`}
              </Callout>
            )}
          </Panel>

          {isWallet && (
            <Panel title="Withdrawal control">
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Dealer-requested withdrawals require a one-time code sent to the dealer's registered number, issued
                through Wallet Withdrawal OTP. Company-initiated recoveries are authorised by Management instead.
              </div>
            </Panel>
          )}
        </>
      }
    >
      <Panel
        title={isWallet ? 'Withdrawal' : 'Payment'}
        description={isWallet
          ? 'Withdraw funds from a registered dealer’s wallet.'
          : 'Record an actual disbursement from the petty cash account.'}
        actions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
      >
        {isWallet ? (
          <FieldSet columns={2}>
            <Select label="Dealer" options={dealerWallets} value={dealerId} onChange={(e) => setDealerId(e.target.value)} />
            <Input
              label="Withdrawal amount (₦)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={overdrawn ? `Exceeds available balance of ${money(available)}` : undefined}
            />
            <Select label="Reason" options={WITHDRAWAL_REASONS} placeholder="Select reason…" />
            <Input label="Withdrawal date" type="date" />
            <Input label="Paid via" placeholder="e.g. Bank transfer to dealer account" />
            <Input label="Authorised by" placeholder="e.g. M. Okonkwo" />
          </FieldSet>
        ) : (
          <FieldSet columns={2}>
            <Select label="Expense category" options={pettyCategories} placeholder="Select category…" />
            <Input
              label="Amount (₦)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={overdrawn ? `Exceeds available balance of ${money(available)}` : undefined}
            />
            <Input label="Paid to" placeholder="e.g. Autoworks Ikeja" />
            <Input label="Payment date" type="date" />
            <Input label="Approved by" placeholder="e.g. R. Danladi" />
            <Input label="Reference no." placeholder="Auto-generated" disabled value="PCP-1175" />
          </FieldSet>
        )}

        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>
              {isWallet ? 'Withdrawal note' : 'Description'}
            </div>
            <textarea
              rows={2}
              placeholder={isWallet ? 'Context for this withdrawal, visible on the dealer’s statement.' : 'What the payment covers.'}
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
          <Badge tone={isWallet ? 'brand' : 'neutral'}>{isWallet ? 'Dealer wallet' : 'Petty cash'}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {money(available)} available{requested ? ` · ${money(remaining)} would remain` : ''}.
          </span>
        </div>
      </Panel>
    </FormShell>
  )
}
