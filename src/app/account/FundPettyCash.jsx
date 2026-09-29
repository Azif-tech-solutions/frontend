import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
import { banks, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
import { money, moneyShort } from '../utils.js'

/**
 * Serves both §5.3.9 Credit Petty Cash and §5.3.12 Fund Petty Cash — the PRD
 * states outright that the second "performs the same function" as the first.
 */
export default function FundPettyCash({ leaf, moduleLabel, parentLabel }) {
  const [amount, setAmount] = useState('')

  const funded = pettyCashFunding.reduce((n, r) => n + r.amount, 0)
  const spent = pettyCashPayments.reduce((n, r) => n + r.amount, 0)
  const balance = pettyCashOpening + funded - spent
  const credit = Number(amount) || 0

  const historyColumns = [
    { key: 'date', label: 'Date', width: 135 },
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    { key: 'description', label: 'Description', width: 340 },
    { key: 'source', label: 'Funding source', width: 200 },
    { key: 'fundedBy', label: 'Funded by', width: 170 },
    { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
  ]

  return (
    <FormShell
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Credit Petty Cash'}
      icon={leaf?.icon}
      description="Fund or replenish the petty cash account, which covers minor operational payments that do not warrant a formal bank transaction — transport, loading and offloading charges, office supplies and similar day-to-day costs."
      submitLabel="Credit petty cash"
      onCancel={() => {}}
      note="The petty cash balance updates immediately, and the funding appears as a debit on the source bank account."
      aside={
        <>
          <Panel title="Petty cash position">
            <MetaRow label="Opening balance" value={money(pettyCashOpening)} mono />
            <MetaRow label="Funded to date" value={money(funded)} mono tone="positive" />
            <MetaRow label="Utilised to date" value={money(spent)} mono tone="negative" />
            <MetaRow label="Current balance" value={money(balance)} mono />
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Balance after crediting</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(balance + credit)}
              </div>
            </div>
          </Panel>

          <Panel title="What petty cash covers">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Transport, loading and offloading charges, fuel, office supplies and other small routine expenses.
              Larger obligations are settled by bank transfer through Payment/Running Cost.
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Funding details" description="Where the funds are coming from and how much.">
        <FieldSet columns={2}>
          <Select label="Funding source account" options={banks} placeholder="Select bank account…" />
          <Input label="Amount to credit (₦)" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Funding date" type="date" />
          <Input label="Transfer / cheque reference" placeholder="e.g. PCF-0082" />
          <Input label="Authorised by" placeholder="e.g. M. Okonkwo" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="PCF-0082" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
            <textarea
              rows={2}
              placeholder="e.g. Replenishment — end of month float"
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
          <Badge tone="brand">Balance {moneyShort(balance)}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {credit ? `Crediting ${money(credit)} brings the account to ${money(balance + credit)}.` : 'Enter an amount to see the resulting balance.'}
          </span>
        </div>
      </Panel>

      <Panel title="Funding history" description="Previous credits into the petty cash account." padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={pettyCashFunding}
          rowKey={(r) => r.ref}
          totals={{ date: 'Total', amount: money(funded) }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
