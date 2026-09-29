import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { factories } from '../sample.js'
import { cashInflows, cashOutflows, cashOpeningBalance, cashLedger } from '../sample.js'
import { money, moneyShort } from '../utils.js'

const sum = (a, k = 'current') => a.reduce((n, x) => n + x[k], 0)
const pct = (cur, prior) => (prior ? `${cur >= prior ? '+' : ''}${(((cur - prior) / prior) * 100).toFixed(1)}%` : '—')

export default function CashFlowStatement({ leaf, moduleLabel, parentLabel }) {
  const inflow = sum(cashInflows)
  const outflow = sum(cashOutflows)
  const net = inflow - outflow
  const closing = cashOpeningBalance + net

  const line = (r) => ({
    label: r.label,
    note: r.note,
    values: [money(r.current), money(r.prior)],
    change: pct(r.current, r.prior),
    changeTone: r.current >= r.prior ? 'positive' : 'negative',
  })

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'description', label: 'Description', width: 330 },
    { key: 'head', label: 'Head', width: 240 },
    {
      key: 'direction', label: 'Direction', width: 110,
      render: (r) => <Badge tone={r.direction === 'In' ? 'success' : 'neutral'}>{r.direction}</Badge>,
    },
    {
      key: 'amount', label: 'Amount', width: 180, align: 'right', mono: true,
      render: (r) => (
        <span style={{ color: r.direction === 'In' ? 'var(--success)' : 'var(--danger)' }}>
          {r.direction === 'In' ? '+' : '−'}{money(r.amount).replace('₦', '₦')}
        </span>
      ),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Cash Inflow/Outflow Statement'}
      icon={leaf?.icon}
      description="Movement of funds through the factory — cash generated from factory and by-product sales, and funds disbursed by Management for internal operational use."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'head', label: 'Head', type: 'select', options: [...cashInflows, ...cashOutflows].map((h) => ({ value: h.label, label: h.label })) },
        { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'in', label: 'Inflow' }, { value: 'out', label: 'Outflow' }] },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Opening balance', value: moneyShort(cashOpeningBalance), hint: '01 Aug 2026' },
        { label: 'Total inflow', value: moneyShort(inflow), delta: pct(inflow, sum(cashInflows, 'prior')) },
        { label: 'Total outflow', value: moneyShort(outflow), tone: 'negative', delta: pct(outflow, sum(cashOutflows, 'prior')) },
        { label: 'Closing balance', value: moneyShort(closing), hint: '23 Aug 2026' },
      ]}
      columns={columns}
      rows={cashLedger}
      totals={{ date: 'Net movement', amount: money(net) }}
      tableTitle="Transaction ledger"
      emptyTitle="No cash movement in this period"
      emptyDescription="Widen the date range or clear the head filter, then generate again."
      footnote="Every entry above rolls into the statement heads shown, and is reflected consistently across the Petty Cash and Bank statements."
    >
      <Statement
        columns={['This period', 'Prior period']}
        sections={[
          {
            title: 'Inflows',
            tone: 'positive',
            rows: cashInflows.map(line),
            subtotal: { label: 'Total inflow', values: [money(inflow), money(sum(cashInflows, 'prior'))], change: pct(inflow, sum(cashInflows, 'prior')), changeTone: 'positive' },
          },
          {
            title: 'Outflows',
            tone: 'negative',
            rows: cashOutflows.map(line),
            subtotal: { label: 'Total outflow', values: [money(outflow), money(sum(cashOutflows, 'prior'))], change: pct(outflow, sum(cashOutflows, 'prior')), changeTone: 'negative' },
          },
        ]}
        result={{
          label: 'Net cash movement',
          note: `Opening ${money(cashOpeningBalance)} · Closing ${money(closing)}`,
          values: [money(net), money(sum(cashInflows, 'prior') - sum(cashOutflows, 'prior'))],
          tone: net >= 0 ? 'positive' : 'negative',
          change: pct(net, sum(cashInflows, 'prior') - sum(cashOutflows, 'prior')),
          changeTone: 'positive',
        }}
      />
    </ReportShell>
  )
}
