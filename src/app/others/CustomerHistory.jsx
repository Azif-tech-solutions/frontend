import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { showrooms } from '../sampleShowroom.js'
import { customers, customerTransactions, customerTypes } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

const TYPE_TONE = { 'Authorised Dealer': 'brand', 'Special Customer': 'info', 'Ordinary Customer': 'neutral', 'No Credit / Walk-in': 'neutral' }
const TXN_TONE = { Purchase: 'brand', Return: 'warning', 'Wallet funding': 'success', Withdrawal: 'danger' }

export default function CustomerHistory({ leaf, moduleLabel, parentLabel }) {
  const [customerName, setCustomerName] = useState('Bendel Stores')

  const customer = customers.find((c) => c.name === customerName) || customers[0]
  const rows = customerTransactions.filter((t) => t.customer === customerName)

  const purchases = rows.filter((t) => t.type === 'Purchase')
  const returns = rows.filter((t) => t.type === 'Return')
  const purchaseValue = purchases.reduce((n, t) => n + t.amount, 0)
  const returnValue = Math.abs(returns.reduce((n, t) => n + t.amount, 0))

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 125, mono: true },
    {
      key: 'type', label: 'Activity', width: 150,
      render: (t) => <Badge tone={TXN_TONE[t.type] || 'neutral'}>{t.type}</Badge>,
    },
    { key: 'description', label: 'Description', width: 360 },
    { key: 'method', label: 'Method', width: 170 },
    {
      key: 'amount', label: 'Amount', width: 175, align: 'right', mono: true,
      render: (t) => (
        <span style={{ color: t.amount < 0 ? 'var(--danger)' : 'var(--text-strong)' }}>
          {t.amount < 0 ? '− ' : ''}{money(Math.abs(t.amount))}
        </span>
      ),
    },
    { key: 'balance', label: 'Wallet balance', width: 180, align: 'right', mono: true, render: (t) => money(t.balance) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Customer History'}
      icon={leaf?.icon}
      description="Complete transaction history for a selected customer — purchases, returns, payments and wallet activity — for verifying past dealings and supporting customer service."
      filters={[
        { key: 'customer', label: 'Customer', type: 'select', options: customers.map((c) => ({ value: c.name, label: c.name })) },
        { key: 'type', label: 'Customer type', type: 'select', options: customerTypes },
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      filterValues={{ customer: customerName }}
      onFilterChange={(k, v) => { if (k === 'customer') setCustomerName(v) }}
      stats={[
        { label: 'Lifetime value', value: moneyShort(customer.lifetime) },
        { label: 'Purchases in period', value: moneyShort(purchaseValue), delta: `${purchases.length} transactions` },
        { label: 'Returns in period', value: moneyShort(returnValue), tone: returnValue ? 'negative' : undefined, delta: `${returns.length} returns` },
        { label: 'Wallet balance', value: moneyShort(customer.wallet) },
      ]}
      columns={columns}
      rows={rows}
      tableTitle={`Activity for ${customer.name}`}
      emptyTitle="No activity recorded"
      emptyDescription="This customer has no transactions in the selected period."
      footnote="Wallet balance shows the running position after each entry. Returns credit the wallet, purchases settled from it debit the balance."
    >
      <Panel title="Customer" description="Details on file for the selected customer.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Code" value={customer.code} mono />
            <MetaRow label="Name" value={customer.name} />
            <MetaRow label="Phone" value={customer.phone} />
          </div>
          <div>
            <MetaRow label="Home showroom" value={customer.showroom} />
            <MetaRow label="Sales rep" value={customer.rep} />
            <MetaRow label="Customer since" value={customer.since} />
          </div>
          <div>
            <MetaRow label="Wallet balance" value={money(customer.wallet)} mono />
            {customer.deposit > 0 && <MetaRow label="Deposit held" value={money(customer.deposit)} mono tone="positive" />}
            <MetaRow label="Lifetime value" value={money(customer.lifetime)} mono />
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone={TYPE_TONE[customer.type] || 'neutral'}>{customer.type}</Badge>
          <Badge tone={customer.status === 'Active' ? 'success' : 'warning'}>{customer.status}</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{customer.address}</span>
        </div>
      </Panel>
    </ReportShell>
  )
}
