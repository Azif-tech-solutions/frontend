import { ReportShell } from '../shells/ReportShell.jsx'
import { showrooms } from '../sampleShowroom.js'
import { showroomCashOpening, showroomCashLedger } from '../sampleAccount.js'
import { money, moneyShort, withBalance } from '../utils.js'

export default function AccountCashFlow({ leaf, moduleLabel, parentLabel }) {
  const rows = withBalance(
    showroomCashLedger.map((r, i) => ({ ...r, sn: i + 1 })),
    showroomCashOpening,
    (r) => r.inflow - r.outflow
  )

  const inflow = showroomCashLedger.reduce((n, r) => n + r.inflow, 0)
  const outflow = showroomCashLedger.reduce((n, r) => n + r.outflow, 0)
  const closing = showroomCashOpening + inflow - outflow

  // The five columns the PRD specifies, plus a serial for reference.
  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: 135 },
    { key: 'remark', label: 'Remark', width: 420 },
    {
      key: 'inflow', label: 'In-flow', width: 165, align: 'right', mono: true,
      render: (r) => (r.inflow ? <span style={{ color: 'var(--success)' }}>{money(r.inflow)}</span> : '—'),
    },
    {
      key: 'outflow', label: 'Out-flow', width: 165, align: 'right', mono: true,
      render: (r) => (r.outflow ? <span style={{ color: 'var(--danger)' }}>{money(r.outflow)}</span> : '—'),
    },
    { key: 'balance', label: 'Balance', width: 175, align: 'right', mono: true, render: (r) => money(r.balance) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Cash Inflow/Outflow Statement'}
      icon={leaf?.icon}
      description="How physical cash is generated and used at the selected showroom, with a running balance after every transaction. Generate for any period — monthly, weekly or custom."
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'in', label: 'In-flow only' }, { value: 'out', label: 'Out-flow only' }] },
        { key: 'from', label: 'Period from', type: 'date' },
        { key: 'to', label: 'Period to', type: 'date' },
      ]}
      stats={[
        { label: 'Opening cash', value: moneyShort(showroomCashOpening), hint: '01 Aug 2026' },
        { label: 'Total in-flow', value: moneyShort(inflow), delta: `${showroomCashLedger.filter((r) => r.inflow).length} receipts` },
        { label: 'Total out-flow', value: moneyShort(outflow), tone: 'negative', delta: `${showroomCashLedger.filter((r) => r.outflow).length} payments` },
        { label: 'Closing cash', value: moneyShort(closing), hint: '23 Aug 2026' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ sn: 'Total', inflow: money(inflow), outflow: money(outflow), balance: money(closing) }}
      tableTitle="Cash transactions"
      emptyTitle="No cash movement in this period"
      emptyDescription="Widen the period or change the showroom, then generate again."
      footnote="Cash lodgements appear as credits on the corresponding bank statement, and petty cash payments appear identically on the Petty Cash Statement — every entry is reflected consistently across all three."
    />
  )
}
