import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { expenseCategories, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
import { money, moneyShort, withBalance } from '../utils.js'

export default function PettyCashStatement({ leaf, moduleLabel, parentLabel }) {
  const funded = pettyCashFunding.reduce((n, r) => n + r.amount, 0)
  const spent = pettyCashPayments.reduce((n, r) => n + r.amount, 0)
  const closing = pettyCashOpening + funded - spent

  // Combined ledger so funding and spending read in date order.
  const entries = [
    ...pettyCashFunding.map((f) => ({ ...f, direction: 'Funding', category: '—', amount: f.amount })),
    ...pettyCashPayments.map((p) => ({ ...p, direction: 'Payment' })),
  ].sort((a, b) => new Date(a.date.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3')) - new Date(b.date.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3')))

  const rows = withBalance(entries, pettyCashOpening, (e) => (e.direction === 'Funding' ? e.amount : -e.amount))

  // Utilisation grouped by expense category, for the statement body.
  const byCategory = Object.values(
    pettyCashPayments.reduce((acc, p) => {
      acc[p.category] ||= { label: p.category, total: 0, count: 0 }
      acc[p.category].total += p.amount
      acc[p.category].count += 1
      return acc
    }, {})
  ).sort((a, b) => b.total - a.total)

  const columns = [
    { key: 'date', label: 'Date', width: 135 },
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    { key: 'description', label: 'Description', width: 340 },
    { key: 'category', label: 'Category', width: 200 },
    {
      key: 'direction', label: 'Type', width: 120,
      render: (r) => <Badge tone={r.direction === 'Funding' ? 'success' : 'neutral'}>{r.direction}</Badge>,
    },
    {
      key: 'in', label: 'Funded', width: 160, align: 'right', mono: true,
      render: (r) => (r.direction === 'Funding' ? <span style={{ color: 'var(--success)' }}>{money(r.amount)}</span> : '—'),
    },
    {
      key: 'out', label: 'Utilised', width: 160, align: 'right', mono: true,
      render: (r) => (r.direction === 'Payment' ? <span style={{ color: 'var(--danger)' }}>{money(r.amount)}</span> : '—'),
    },
    { key: 'balance', label: 'Balance', width: 165, align: 'right', mono: true, render: (r) => money(r.balance) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Petty Cash Statement'}
      icon={leaf?.icon}
      description="How the petty cash account was funded and how it has been utilised over the period, with a running balance after every entry."
      filters={[
        { key: 'category', label: 'Expense category', type: 'select', options: expenseCategories.map((c) => ({ value: c.code, label: c.name })) },
        { key: 'direction', label: 'Entry type', type: 'select', options: [{ value: 'funding', label: 'Funding only' }, { value: 'payment', label: 'Payments only' }] },
        { key: 'from', label: 'Period from', type: 'date' },
        { key: 'to', label: 'Period to', type: 'date' },
      ]}
      stats={[
        { label: 'Opening balance', value: moneyShort(pettyCashOpening), hint: '01 Aug 2026' },
        { label: 'Total funded', value: moneyShort(funded), delta: `${pettyCashFunding.length} top-ups` },
        { label: 'Total utilised', value: moneyShort(spent), tone: 'negative', delta: `${pettyCashPayments.length} payments` },
        { label: 'Balance available', value: moneyShort(closing), hint: '23 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', in: money(funded), out: money(spent), balance: money(closing) }}
      tableTitle="Petty cash ledger"
      emptyTitle="No petty cash activity in this period"
      emptyDescription="Widen the period or clear the category filter, then generate again."
      footnote="Every payment here also appears as an out-flow on the Cash Inflow/Outflow Statement, and each funding entry matches a debit on the funding bank account."
    >
      <Statement
        columns={['Amount']}
        sections={[
          {
            title: 'Funding',
            tone: 'positive',
            rows: [
              { label: 'Opening balance', note: '01 Aug 2026', values: [money(pettyCashOpening)] },
              ...pettyCashFunding.map((f) => ({ label: f.description, note: f.date, values: [money(f.amount)] })),
            ],
            subtotal: { label: 'Total available', values: [money(pettyCashOpening + funded)] },
          },
          {
            title: 'Utilisation by category',
            tone: 'negative',
            rows: byCategory.map((c) => ({
              label: c.label,
              note: `${c.count} payment${c.count === 1 ? '' : 's'}`,
              values: [money(c.total)],
            })),
            subtotal: { label: 'Total utilised', values: [money(spent)] },
          },
        ]}
        result={{
          label: 'Petty cash balance',
          note: `${((spent / (pettyCashOpening + funded)) * 100).toFixed(1)}% of available funds utilised this period.`,
          values: [money(closing)],
          tone: closing > 0 ? 'positive' : 'negative',
        }}
      />
    </ReportShell>
  )
}
