import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { expenseCategories, pettyCashPayments } from '../sampleAccount.js'
import { money, moneyShort } from '../utils.js'

export default function PettyCashPaymentHistory({ leaf, moduleLabel, parentLabel }) {
  const rows = pettyCashPayments.map((p, i) => ({ ...p, sn: i + 1 }))
  const total = rows.reduce((n, r) => n + r.amount, 0)
  const categories = new Set(rows.map((r) => r.category)).size
  const largest = rows.reduce((m, r) => (r.amount > m.amount ? r : m), rows[0])

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Payment date', width: 140 },
    { key: 'ref', label: 'Reference', width: 125, mono: true },
    { key: 'description', label: 'Description', width: 340 },
    { key: 'category', label: 'Expense category', width: 210 },
    { key: 'paidTo', label: 'Paid to', width: 200 },
    { key: 'approvedBy', label: 'Approved by', width: 160 },
    { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Petty Cash Payment History'}
      icon={leaf?.icon}
      description="Every payment made out of the petty cash account, with the expense category it was booked against and who approved it."
      headerActions={<Badge tone="warning" uppercase>Pending activation</Badge>}
      filters={[
        { key: 'category', label: 'Expense category', type: 'select', options: expenseCategories.map((c) => ({ value: c.code, label: c.name })) },
        { key: 'approvedBy', label: 'Approved by', type: 'select', options: [{ value: 'rd', label: 'R. Danladi' }, { value: 'mo', label: 'M. Okonkwo' }] },
        { key: 'from', label: 'Period from', type: 'date' },
        { key: 'to', label: 'Period to', type: 'date' },
      ]}
      stats={[
        { label: 'Payments made', value: String(rows.length) },
        { label: 'Total paid out', value: moneyShort(total) },
        { label: 'Categories used', value: String(categories) },
        { label: 'Largest payment', value: moneyShort(largest.amount), hint: largest.category },
      ]}
      columns={columns}
      rows={rows}
      totals={{ sn: 'Total', amount: money(total) }}
      tableTitle="Payment history"
      emptyTitle="No petty cash payments in this period"
      emptyDescription="Widen the period or clear the category filter, then generate again."
      footnote="This report is not yet active in the current build. The layout and columns below are final, but live data will only populate once petty cash payment logging is switched on."
    />
  )
}
