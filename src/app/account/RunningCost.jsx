import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { expenseCategories, paymentMethods, runningCosts, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
import { banks } from '../sampleAccount.js'
import { money, moneyShort } from '../utils.js'

const STATUS_TONE = { Approved: 'success', 'Pending approval': 'warning', Rejected: 'danger' }

const activeCategories = expenseCategories.filter((c) => c.status === 'Active')

export default function RunningCost({ leaf, moduleLabel, parentLabel }) {
  const [categoryCode, setCategoryCode] = useState('')
  const [method, setMethod] = useState('petty')
  const [amount, setAmount] = useState('')

  const category = expenseCategories.find((c) => c.code === categoryCode)
  const pettyBalance = pettyCashOpening
    + pettyCashFunding.reduce((n, r) => n + r.amount, 0)
    - pettyCashPayments.reduce((n, r) => n + r.amount, 0)

  const requested = Number(amount) || 0
  const fromPetty = method === 'petty'
  const overdrawn = fromPetty && requested > pettyBalance
  // The guide governs which categories may be settled from petty cash.
  const categoryBlocked = fromPetty && category && category.pettyCashAllowed === 'No'

  const pending = runningCosts.filter((r) => r.status === 'Pending approval')
  const approved = runningCosts.filter((r) => r.status === 'Approved')

  const historyColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'description', label: 'Description', width: 320 },
    { key: 'category', label: 'Category', width: 210 },
    { key: 'payee', label: 'Payee', width: 180 },
    { key: 'method', label: 'Method', width: 150 },
    { key: 'amount', label: 'Amount', width: 160, align: 'right', mono: true, render: (r) => money(r.amount) },
    {
      key: 'status', label: 'Status', width: 160,
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge>,
    },
    { key: 'approvedBy', label: 'Approved by', width: 150 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Payment/Running Cost'}
      icon={leaf?.icon}
      description="Record the company's daily payments and operational expenses. Every entry is classified against the Expenses/Payment Guide and verified by accounting personnel before it is processed."
      submitLabel="Submit for approval"
      onCancel={() => {}}
      note="Approved payments automatically update both the Petty Cash records and the Cash Inflow/Outflow Statement."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Payment summary">
            <MetaRow label="Category" value={category ? category.name : '—'} />
            <MetaRow label="Method" value={paymentMethods.find((m) => m.value === method)?.label} />
            <MetaRow label="Amount" value={requested ? money(requested) : '—'} mono />
            {fromPetty && <MetaRow label="Petty cash balance" value={money(pettyBalance)} mono />}
            {fromPetty && requested > 0 && !overdrawn && (
              <MetaRow label="Balance after" value={money(pettyBalance - requested)} mono />
            )}
            {categoryBlocked && (
              <Callout tone="danger" icon="circle-alert" title="Not payable from petty cash" style={{ marginTop: 14 }}>
                The guide marks <strong>{category.name}</strong> as ineligible for petty cash. Settle it by bank
                transfer or cheque instead.
              </Callout>
            )}
            {overdrawn && !categoryBlocked && (
              <Callout tone="danger" icon="circle-alert" title="Insufficient petty cash" style={{ marginTop: 14 }}>
                Only {money(pettyBalance)} remains. Credit the petty cash account or pay by another method.
              </Callout>
            )}
          </Panel>

          <Panel title="Awaiting approval">
            <MetaRow label="Entries pending" value={pending.length} mono tone={pending.length ? 'negative' : undefined} />
            <MetaRow label="Value pending" value={money(pending.reduce((n, r) => n + r.amount, 0))} mono />
            <MetaRow label="Approved this period" value={money(approved.reduce((n, r) => n + r.amount, 0))} mono tone="positive" />
          </Panel>
        </>
      }
    >
      <Panel title="Payment details" description="Classify the payment against a registered expense category before submitting.">
        <FieldSet columns={3}>
          <Select
            label="Expense category"
            options={activeCategories.map((c) => ({ value: c.code, label: c.name }))}
            value={categoryCode}
            onChange={(e) => setCategoryCode(e.target.value)}
            placeholder="Select category…"
          />
          <Input label="Payee" placeholder="e.g. Buildwell Ltd" />
          <Input
            label="Amount (₦)"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={overdrawn ? `Exceeds petty cash balance of ${money(pettyBalance)}` : undefined}
          />
          <Select label="Payment method" options={paymentMethods} value={method} onChange={(e) => setMethod(e.target.value)} />
          {!fromPetty && <Select label="Paying account" options={banks} placeholder="Select bank account…" />}
          <Input label="Payment date" type="date" />
          <Input label="Invoice / receipt no." placeholder="Supplier document reference" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="RC-2292" />
        </FieldSet>
        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block' }}>
            <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
            <textarea
              rows={2}
              placeholder="What the payment covers and why it was incurred."
              style={{
                width: '100%', padding: '10px 12px', resize: 'vertical',
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
                font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
              }}
            />
          </label>
        </div>
        {category && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="neutral" uppercase>{category.code}</Badge>
            <Badge tone={category.pettyCashAllowed === 'Yes' ? 'success' : 'neutral'}>
              {category.pettyCashAllowed === 'Yes' ? 'Petty cash allowed' : 'Bank settlement only'}
            </Badge>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{category.description}</span>
          </div>
        )}
      </Panel>

      <Panel
        title="Recent payments"
        description="Entries recorded through this module, with their verification status."
        padding={0}
      >
        <ReportTable
          columns={historyColumns}
          rows={runningCosts}
          rowKey={(r) => r.ref}
          totals={{ date: 'Total', amount: money(runningCosts.reduce((n, r) => n + r.amount, 0)) }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>

      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>
        Total recorded this period: {moneyShort(runningCosts.reduce((n, r) => n + r.amount, 0))} across{' '}
        {runningCosts.length} entries, of which {pending.length} await verification by accounting personnel.
      </div>
    </FormShell>
  )
}
