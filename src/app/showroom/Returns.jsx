import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { showrooms, dealerWallets, returnReasons, recentReturns, showroomStock } from '../sampleShowroom.js'
import { fmt, money } from '../utils.js'

const productOptions = [...new Map(showroomStock.map((s) => [s.detail, { value: s.detail, label: s.detail, price: s.price }])).values()]
const PRICES = Object.fromEntries(productOptions.map((p) => [p.value, p.price]))

const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', reason: '', condition: '' })

export default function Returns({ leaf, moduleLabel, parentLabel, dealer = false }) {
  const [rows, setRows] = useState([blank()])
  const [dealerId, setDealerId] = useState('dl-bendel')

  const wallet = dealerWallets.find((d) => d.value === dealerId) || dealerWallets[0]

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const price = PRICES[r.product]
    const qty = Number(r.qty) || 0
    return {
      ...r,
      unitPrice: price ? money(price) : undefined,
      lineValue: price && qty ? money(price * qty) : undefined,
    }
  })

  const columns = [
    { key: 'product', label: 'Product returned', type: 'select', options: productOptions, width: 280, placeholder: 'Select product…' },
    { key: 'qty', label: 'Quantity', type: 'number', width: 120, placeholder: '0' },
    { key: 'unitPrice', label: 'Unit price', type: 'static', align: 'right', width: 140 },
    { key: 'lineValue', label: 'Return value', type: 'static', align: 'right', width: 150 },
    { key: 'reason', label: 'Reason *', type: 'select', options: returnReasons, width: 210, placeholder: 'Select reason…' },
    { key: 'condition', label: 'Condition', type: 'select', options: [{ value: 'resaleable', label: 'Resaleable' }, { value: 'damaged', label: 'Damaged — write off' }, { value: 'quarantine', label: 'Quarantine' }], width: 190, placeholder: 'Select…' },
  ]

  const active = rows.filter((r) => r.product)
  const creditValue = rows.reduce((n, r) => n + (PRICES[r.product] || 0) * (Number(r.qty) || 0), 0)
  const missingReason = rows.some((r) => r.product && !r.reason)
  const newBalance = (dealer ? wallet.balance : 0) + creditValue

  const historyColumns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'date', label: 'Date', width: 130 },
    { key: 'party', label: 'Returned by', width: 210 },
    {
      key: 'type', label: 'Type', width: 130,
      render: (r) => <Badge tone={r.type === 'Dealer' ? 'brand' : 'neutral'}>{r.type}</Badge>,
    },
    { key: 'product', label: 'Product', width: 240 },
    { key: 'qty', label: 'Qty', width: 90, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'value', label: 'Credited', width: 150, align: 'right', mono: true, render: (r) => money(r.value) },
    { key: 'reason', label: 'Reason', width: 210 },
    {
      key: 'wallet', label: 'Wallet', width: 150,
      render: (r) => <Badge tone={r.wallet === 'Dealer wallet' ? 'success' : 'warning'}>{r.wallet}</Badge>,
    },
  ]

  const history = recentReturns.filter((r) => (dealer ? r.type === 'Dealer' : r.type === 'Non-dealer'))

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || (dealer ? 'Returns — Dealer' : 'Returns — Non-Dealer')}
      icon={leaf?.icon}
      description={dealer
        ? 'Process returned goods from a registered dealer. The value of the return is credited to the dealer’s wallet for use against future purchases.'
        : 'Process returned goods from a walk-in customer or end user who is not a registered dealer. A temporary customer record and wallet are created automatically, and the return value is credited to it.'}
      submitLabel="Process return"
      onCancel={() => {}}
      note={dealer
        ? 'The dealer’s wallet balance updates immediately once the return is processed.'
        : 'A temporary customer record and wallet are created on processing, and are removed automatically once the wallet balance reaches zero.'}
      aside={
        <>
          <Panel title="Wallet impact">
            {dealer ? (
              <>
                <MetaRow label="Dealer" value={wallet.label} />
                <MetaRow label="Current balance" value={money(wallet.balance)} mono />
                <MetaRow label="Return credit" value={creditValue ? money(creditValue) : '—'} mono tone={creditValue ? 'positive' : undefined} />
              </>
            ) : (
              <>
                <MetaRow label="Wallet type" value="Temporary" />
                <MetaRow label="Current balance" value={money(0)} mono />
                <MetaRow label="Return credit" value={creditValue ? money(creditValue) : '—'} mono tone={creditValue ? 'positive' : undefined} />
              </>
            )}
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Balance after return</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(newBalance)}
              </div>
            </div>
            {missingReason && (
              <Callout tone="warning" icon="circle-alert" style={{ marginTop: 14 }}>
                A reason is required on every line before the return can be processed.
              </Callout>
            )}
          </Panel>

          {!dealer && (
            <Callout tone="info" icon="user-round-plus" title="Temporary customer record">
              If this customer has no existing record, one is created along with a wallet. Both are removed
              automatically once the wallet balance is fully spent and reaches zero.
            </Callout>
          )}
        </>
      }
    >
      <Panel title={dealer ? 'Dealer' : 'Customer'} description={dealer ? 'The registered dealer returning the goods.' : 'Walk-in customer details. A temporary record is created if none exists.'}>
        <FieldSet columns={3}>
          <Select label="Showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
          {dealer ? (
            <>
              <Select label="Dealer" options={dealerWallets} value={dealerId} onChange={(e) => setDealerId(e.target.value)} />
              <Input label="Original invoice no." placeholder="e.g. INV-31240" />
            </>
          ) : (
            <>
              <Input label="Customer name" placeholder="e.g. Adaeze Nwankwo" />
              <Input label="Phone number" placeholder="+234 …" hint="Used to match an existing temporary record." />
            </>
          )}
          <Input label="Return date" type="date" />
          {!dealer && <Input label="Original receipt no." placeholder="e.g. RCP-88214" />}
          <Input label="Reference no." placeholder="Auto-generated" disabled value={dealer ? 'RT-0458' : 'RT-0457'} />
        </FieldSet>
        {dealer && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge tone="brand">Registered dealer</Badge>
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              Wallet balance {money(wallet.balance)} · credit applies to future purchases per company policy.
            </span>
          </div>
        )}
      </Panel>

      <Panel title="Goods returned" description="Return value is calculated at the current selling price of each product.">
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add returned product"
          emptyLabel="No products added yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Credit value', value: money(creditValue) },
          ]}
        />
      </Panel>

      <Panel title={dealer ? 'Recent dealer returns' : 'Recent non-dealer returns'} padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={history}
          rowKey={(r) => r.ref}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
          emptyLabel="No returns recorded yet"
        />
      </Panel>
    </FormShell>
  )
}
