import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { expenseCategories, pettyCashPayments, runningCosts } from '../sampleAccount.js'
import { showrooms } from '../sampleShowroom.js'
import { money, moneyShort } from '../utils.js'

const STATUS_TONE = { Approved: 'success', 'Pending approval': 'warning', Rejected: 'danger' }

/** Combines petty cash disbursements with payments recorded as running costs. */
const entries = [
  ...pettyCashPayments.map((p) => ({
    date: p.date, ref: p.ref, purpose: p.description, category: p.category,
    amount: p.amount, method: 'Petty cash', payee: p.paidTo, approvedBy: p.approvedBy, status: 'Approved',
  })),
  ...runningCosts.map((r) => ({
    date: r.date, ref: r.ref, purpose: r.description, category: r.category,
    amount: r.amount, method: r.method, payee: r.payee, approvedBy: r.approvedBy, status: r.status,
  })),
]

export default function ExpensesReport({ leaf, moduleLabel, parentLabel }) {
  const approved = entries.filter((e) => e.status === 'Approved')
  const total = approved.reduce((n, e) => n + e.amount, 0)
  const pending = entries.filter((e) => e.status === 'Pending approval')

  const byCategory = Object.values(
    approved.reduce((acc, e) => {
      acc[e.category] ||= { label: e.category, total: 0, count: 0 }
      acc[e.category].total += e.amount
      acc[e.category].count += 1
      return acc
    }, {})
  ).sort((a, b) => b.total - a.total)

  const byMethod = Object.values(
    approved.reduce((acc, e) => {
      acc[e.method] ||= { label: e.method, total: 0, count: 0 }
      acc[e.method].total += e.amount
      acc[e.method].count += 1
      return acc
    }, {})
  ).sort((a, b) => b.total - a.total)

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    { key: 'purpose', label: 'Purpose', width: 330 },
    { key: 'category', label: 'Expense category', width: 210 },
    { key: 'payee', label: 'Paid to', width: 190 },
    { key: 'method', label: 'Method', width: 150 },
    { key: 'approvedBy', label: 'Approved by', width: 160 },
    {
      key: 'status', label: 'Status', width: 160,
      render: (e) => <Badge tone={STATUS_TONE[e.status] || 'neutral'}>{e.status}</Badge>,
    },
    { key: 'amount', label: 'Amount', width: 165, align: 'right', mono: true, render: (e) => money(e.amount) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Expenses/Payment Reports'}
      icon={leaf?.icon}
      description="Every payment and expense recorded in the system, with its date, category, amount and purpose — for monitoring operational costs, verifying entries and supporting reconciliation."
      filters={[
        { key: 'category', label: 'Expense category', type: 'select', options: expenseCategories.map((c) => ({ value: c.code, label: c.name })) },
        { key: 'method', label: 'Payment method', type: 'select', options: byMethod.map((m) => ({ value: m.label, label: m.label })) },
        { key: 'showroom', label: 'Location', type: 'select', options: showrooms },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Total expenditure', value: moneyShort(total), delta: `${approved.length} approved entries` },
        { label: 'Categories used', value: String(byCategory.length) },
        { label: 'Largest category', value: byCategory[0].label.split(' ')[0], hint: moneyShort(byCategory[0].total) },
        { label: 'Pending approval', value: String(pending.length), tone: pending.length ? 'warning' : undefined, hint: pending.length ? moneyShort(pending.reduce((n, e) => n + e.amount, 0)) : undefined },
      ]}
      columns={columns}
      rows={entries}
      totals={{ date: 'Total approved', amount: money(total) }}
      tableTitle="Payment and expense records"
      emptyTitle="No expenses in this period"
      emptyDescription="Widen the date range or clear the category filter, then generate again."
      footnote="Only approved entries count toward total expenditure. Pending and rejected entries are listed for completeness but are excluded from the totals and from the Cash Inflow/Outflow Statement."
    >
      <Statement
        columns={['Amount']}
        sections={[
          {
            title: 'Spending by category',
            tone: 'negative',
            rows: byCategory.map((c) => ({
              label: c.label,
              note: `${c.count} payment${c.count === 1 ? '' : 's'} · ${((c.total / total) * 100).toFixed(1)}%`,
              values: [money(c.total)],
            })),
            subtotal: { label: 'Total by category', values: [money(total)] },
          },
          {
            title: 'Spending by method',
            rows: byMethod.map((m) => ({
              label: m.label,
              note: `${m.count} payment${m.count === 1 ? '' : 's'}`,
              values: [money(m.total)],
            })),
            subtotal: { label: 'Total by method', values: [money(total)] },
          },
        ]}
        result={{
          label: 'Total approved expenditure',
          note: `Across ${approved.length} entries in ${byCategory.length} categories.`,
          values: [money(total)],
          tone: 'negative',
        }}
      />
    </ReportShell>
  )
}
