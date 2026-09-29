import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { liveTransactions, discountHistory } from '../sampleOthers.js'
import { money } from '../utils.js'

const MODES = [
  { value: 'pct', label: 'Percentage', icon: 'percent' },
  { value: 'amount', label: 'Fixed amount', icon: 'banknote' },
]

const REASONS = [
  { value: 'volume', label: 'Contract volume pricing' },
  { value: 'bulk', label: 'Bulk order concession' },
  { value: 'loyalty', label: 'Long-standing dealer' },
  { value: 'goodwill', label: 'Goodwill / service recovery' },
  { value: 'clearance', label: 'Clearance of slow-moving stock' },
]

// Discounts above this share of the transaction need a second authorisation.
const CEILING_PCT = 10

export default function InstantDiscount({ leaf, moduleLabel, parentLabel }) {
  const [txnRef, setTxnRef] = useState(liveTransactions[0].ref)
  const [mode, setMode] = useState('pct')
  const [value, setValue] = useState('')

  const txn = liveTransactions.find((t) => t.ref === txnRef) || liveTransactions[0]
  const isPct = mode === 'pct'
  const entered = Number(value) || 0

  const discount = isPct ? (txn.subtotal * entered) / 100 : entered
  const pctOfTotal = txn.subtotal ? (discount / txn.subtotal) * 100 : 0
  const payable = txn.subtotal - discount

  const exceedsTotal = discount > txn.subtotal
  const aboveCeiling = !exceedsTotal && pctOfTotal > CEILING_PCT

  const historyColumns = [
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'date', label: 'Date', width: 130 },
    { key: 'cashier', label: 'Cashier', width: 160 },
    { key: 'customer', label: 'Customer', width: 240 },
    { key: 'original', label: 'Original total', width: 165, align: 'right', mono: true, render: (d) => money(d.original) },
    { key: 'discount', label: 'Discount', width: 155, align: 'right', mono: true, render: (d) => <span style={{ color: 'var(--danger)' }}>− {money(d.discount)}</span> },
    { key: 'pct', label: '%', width: 90, align: 'right', mono: true, render: (d) => `${d.pct.toFixed(1)}%` },
    { key: 'reason', label: 'Reason', width: 250 },
    { key: 'approvedBy', label: 'Approved by', width: 170 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Instant Discount'}
      icon={leaf?.icon}
      description="Apply a discount in real time to a transaction a cashier is currently processing. Intended for special customers granted unique pricing during a sale."
      submitLabel="Apply discount"
      onCancel={() => {}}
      note="The discount is pushed to the cashier's till immediately and the customer sees the revised total before payment is taken."
      aside={
        <>
          <Panel title="Discount effect">
            <MetaRow label="Transaction" value={txn.ref} mono />
            <MetaRow label="Cashier" value={txn.cashier} />
            <MetaRow label="Original total" value={money(txn.subtotal)} mono />
            <MetaRow label="Discount" value={discount ? `− ${money(discount)}` : '—'} mono tone={discount ? 'negative' : undefined} />
            <MetaRow label="Share of total" value={entered ? `${pctOfTotal.toFixed(1)}%` : '—'} mono />
            <div style={{
              marginTop: 14, padding: '14px 16px',
              background: exceedsTotal ? 'var(--danger-bg)' : 'var(--brand-subtle)',
              border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Amount payable</div>
              <div style={{
                marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums',
                color: exceedsTotal ? 'var(--danger)' : 'var(--text-strong)',
              }}>
                {money(payable)}
              </div>
            </div>
            {exceedsTotal && (
              <Callout tone="danger" icon="circle-alert" title="Discount exceeds the transaction" style={{ marginTop: 14 }}>
                A discount cannot be larger than the transaction total of {money(txn.subtotal)}.
              </Callout>
            )}
            {aboveCeiling && (
              <Callout tone="warning" icon="shield-alert" title={`Above the ${CEILING_PCT}% ceiling`} style={{ marginTop: 14 }}>
                Discounts over {CEILING_PCT}% require a second authorisation from Management before they reach
                the till. This will be routed for approval rather than applied instantly.
              </Callout>
            )}
          </Panel>

          <Callout tone="info" icon="shield-check" title="Administrator only">
            This module is restricted to Administrators. Every discount is logged against the cashier, the
            customer and the approving officer, and appears on the Sales Report as a deduction from gross.
          </Callout>
        </>
      }
    >
      <Panel title="Live transactions" description="Sales currently open at a till, awaiting payment. Select the one to discount.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {liveTransactions.map((t) => {
            const on = t.ref === txnRef
            return (
              <div
                key={t.ref}
                onClick={() => { setTxnRef(t.ref); setValue('') }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
                  background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                  border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                }}
              >
                <span style={{ position: 'relative', display: 'flex', marginTop: 2 }}>
                  <Icon name="scan-line" size={16} color={on ? 'var(--brand)' : 'var(--text-subtle)'} />
                  <span style={{ position: 'absolute', top: -2, right: -3, width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)', color: 'var(--text-strong)' }}>{money(t.subtotal)}</span>
                    <Badge tone="success">Live</Badge>
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{t.customer}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                    {t.ref} · {t.cashier} · {t.items} items · started {t.started}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel
        title="Discount"
        description="Enter the concession to apply. It reaches the till the moment it is applied."
        actions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
      >
        <FieldSet columns={3}>
          <Input label="Customer" value={txn.customer} onChange={() => {}} disabled />
          <Input label="Customer type" value={txn.customerType} onChange={() => {}} disabled />
          <Input label="Transaction total (₦)" value={money(txn.subtotal)} onChange={() => {}} disabled />
          <Input
            label={isPct ? 'Discount (%)' : 'Discount amount (₦)'}
            type="number"
            placeholder={isPct ? '5.0' : '0.00'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={exceedsTotal ? 'Cannot exceed the transaction total' : undefined}
            hint={!exceedsTotal && entered ? `${money(discount)} off · ${pctOfTotal.toFixed(1)}% of total` : undefined}
          />
          <Select label="Reason" options={REASONS} placeholder="Select reason…" />
          <Input label="Authorised by" value="M. Okonkwo" onChange={() => {}} />
        </FieldSet>
      </Panel>

      <Panel title="Recent discounts" description="Concessions applied through this module." padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={discountHistory}
          rowKey={(d) => d.ref}
          totals={{ ref: 'Total', discount: money(discountHistory.reduce((n, d) => n + d.discount, 0)) }}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
