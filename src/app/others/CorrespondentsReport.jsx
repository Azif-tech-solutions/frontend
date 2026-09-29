import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms } from '../sampleShowroom.js'
import { correspondents } from '../sampleProcess.js'
import { repActivity } from '../sampleOthers.js'
import { fmt, money, moneyShort } from '../utils.js'

const VIEWS = [
  { value: 'rep', label: 'By representative' },
  { value: 'customer', label: 'By customer' },
]

export default function CorrespondentsReport({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('rep')

  const byRep = Object.values(
    repActivity.reduce((acc, r) => {
      acc[r.rep] ||= { rep: r.rep, showroom: r.showroom, customers: 0, newCustomers: 0, transactions: 0, units: 0, revenue: 0 }
      acc[r.rep].customers += 1
      acc[r.rep].newCustomers += r.newCustomer ? 1 : 0
      acc[r.rep].transactions += r.transactions
      acc[r.rep].units += r.units
      acc[r.rep].revenue += r.revenue
      return acc
    }, {})
  ).sort((a, b) => b.revenue - a.revenue)

  const revenue = repActivity.reduce((n, r) => n + r.revenue, 0)
  const units = repActivity.reduce((n, r) => n + r.units, 0)
  const transactions = repActivity.reduce((n, r) => n + r.transactions, 0)
  const newCustomers = repActivity.filter((r) => r.newCustomer).length

  const repColumns = [
    { key: 'rep', label: 'Sales representative', width: 220 },
    { key: 'showroom', label: 'Showroom', width: 190 },
    { key: 'customers', label: 'Customers served', width: 175, align: 'right', mono: true, render: (r) => fmt(r.customers) },
    {
      key: 'newCustomers', label: 'New customers', width: 165, align: 'right', mono: true,
      render: (r) => (r.newCustomers ? <span style={{ color: 'var(--success)' }}>{fmt(r.newCustomers)}</span> : '—'),
    },
    { key: 'transactions', label: 'Transactions', width: 150, align: 'right', mono: true, render: (r) => fmt(r.transactions) },
    { key: 'units', label: 'Units sold', width: 140, align: 'right', mono: true, render: (r) => fmt(r.units) },
    { key: 'revenue', label: 'Revenue generated', width: 195, align: 'right', mono: true, render: (r) => money(r.revenue) },
    {
      key: 'share', label: 'Contribution', width: 145, align: 'right', mono: true,
      render: (r) => `${((r.revenue / revenue) * 100).toFixed(1)}%`,
    },
  ]

  const customerColumns = [
    { key: 'rep', label: 'Sales representative', width: 210 },
    { key: 'customer', label: 'Customer', width: 250 },
    {
      key: 'newCustomer', label: 'Relationship', width: 160,
      render: (r) => <Badge tone={r.newCustomer ? 'success' : 'neutral'}>{r.newCustomer ? 'Brought in' : 'Existing'}</Badge>,
    },
    { key: 'showroom', label: 'Showroom', width: 190 },
    { key: 'transactions', label: 'Transactions', width: 150, align: 'right', mono: true, render: (r) => fmt(r.transactions) },
    { key: 'units', label: 'Units sold', width: 140, align: 'right', mono: true, render: (r) => fmt(r.units) },
    { key: 'revenue', label: 'Transaction value', width: 190, align: 'right', mono: true, render: (r) => money(r.revenue) },
  ]

  const isRep = view === 'rep'

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Correspondents Report'}
      icon={leaf?.icon}
      description="Sales representative activity within a showroom and period — the customers each attended to or brought in, the products sold, and the revenue their activity generated for the company."
      filters={[
        { key: 'rep', label: 'Sales representative', type: 'select', options: correspondents.filter((c) => c.status === 'Assigned').map((c) => ({ value: c.name, label: c.name })) },
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Revenue generated', value: moneyShort(revenue), delta: `${transactions} transactions` },
        { label: 'Units sold', value: fmt(units) },
        { label: 'Customers brought in', value: String(newCustomers), tone: 'positive', hint: 'New relationships' },
        { label: 'Top performer', value: byRep[0].rep.split(' ')[0], hint: moneyShort(byRep[0].revenue) },
      ]}
      columns={isRep ? repColumns : customerColumns}
      rows={isRep ? byRep : repActivity}
      totals={{ rep: 'Total', transactions: fmt(transactions), units: fmt(units), revenue: money(revenue) }}
      tableTitle={isRep ? 'Performance by representative' : 'Customers attended to'}
      tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
      emptyTitle="No representative activity in this period"
      emptyDescription="Widen the date range or change the showroom filter, then generate again."
      footnote="Contribution shows each representative's share of revenue generated in the period. Customers marked as brought in were first introduced to the company by that representative."
    />
  )
}
