import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms } from '../sampleShowroom.js'
import { banks } from '../sampleAccount.js'
import { cashTransfers } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

export default function CashTransferHistory({ leaf, moduleLabel, parentLabel }) {
  const rows = cashTransfers
  const takings = rows.reduce((n, r) => n + r.takings, 0)
  const banked = rows.reduce((n, r) => n + r.banked, 0)
  const retained = rows.reduce((n, r) => n + r.retained, 0)
  const pending = rows.filter((r) => r.status !== 'Confirmed')

  const columns = [
    { key: 'date', label: 'Deposit date', width: 140 },
    { key: 'ref', label: 'Reference', width: 125, mono: true },
    { key: 'showroom', label: 'Showroom', width: 190 },
    { key: 'takings', label: 'Cash takings', width: 165, align: 'right', mono: true, render: (r) => money(r.takings) },
    { key: 'banked', label: 'Amount banked', width: 175, align: 'right', mono: true, render: (r) => money(r.banked) },
    {
      key: 'retained', label: 'Retained as float', width: 175, align: 'right', mono: true,
      render: (r) => (r.retained ? money(r.retained) : '—'),
    },
    { key: 'bank', label: 'Bank', width: 200 },
    { key: 'account', label: 'Account', width: 160, mono: true },
    { key: 'depositedBy', label: 'Deposited by', width: 160 },
    {
      key: 'teller', label: 'Teller ref.', width: 140, mono: true,
      render: (r) => (r.teller === '—' ? <span style={{ color: 'var(--text-subtle)' }}>—</span> : r.teller),
    },
    {
      key: 'status', label: 'Status', width: 190,
      render: (r) => <Badge tone={r.status === 'Confirmed' ? 'success' : 'warning'}>{r.status}</Badge>,
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Cash Transfer History'}
      icon={leaf?.icon}
      description="Physical cash realised from daily sales and deposited into the bank — when each deposit was made, how much was banked, and how much was retained as a working float."
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'bank', label: 'Bank', type: 'select', options: banks },
        { key: 'status', label: 'Status', type: 'select', options: [{ value: 'confirmed', label: 'Confirmed' }, { value: 'awaiting', label: 'Awaiting confirmation' }] },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Cash takings', value: moneyShort(takings), delta: `${rows.length} deposits` },
        { label: 'Amount banked', value: moneyShort(banked) },
        { label: 'Retained as float', value: moneyShort(retained), hint: 'Held at showrooms' },
        { label: 'Awaiting confirmation', value: String(pending.length), tone: pending.length ? 'warning' : undefined },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', takings: money(takings), banked: money(banked), retained: money(retained) }}
      tableTitle="Cash deposits to bank"
      emptyTitle="No deposits in this period"
      emptyDescription="Widen the date range or change the showroom filter, then generate again."
      footnote="Every confirmed deposit appears as a credit on the corresponding bank statement and as an out-flow on the showroom's Cash Inflow/Outflow Statement, so the three reconcile."
    />
  )
}
