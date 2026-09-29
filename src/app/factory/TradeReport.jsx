import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { factories, factoryTrades, materialPosition, tradeReasons } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

const STATUS_TONE = { Pending: 'warning', Open: 'info', Accepted: 'success', Rejected: 'danger', Withdrawn: 'neutral' }

/** Days between the offer and the response, for measuring how quickly trades clear. */
function turnaround(t) {
  if (!t.responded) return null
  const parse = (d) => new Date(d.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3'))
  return Math.round((parse(t.responded) - parse(t.offered)) / 86400000)
}

export default function TradeReport({ leaf, moduleLabel, parentLabel }) {
  const rows = factoryTrades.map((t) => {
    const p = materialPosition[t.code]
    return {
      ...t,
      material: p.name,
      unit: p.unit,
      unitCost: p.unitCost,
      value: t.qty * p.unitCost,
      turnaround: turnaround(t),
    }
  })

  const accepted = rows.filter((t) => t.status === 'Accepted')
  const rejected = rows.filter((t) => t.status === 'Rejected')
  const acceptedValue = accepted.reduce((n, t) => n + t.value, 0)
  const responded = rows.filter((t) => t.turnaround != null)
  const avgTurnaround = responded.length
    ? (responded.reduce((n, t) => n + t.turnaround, 0) / responded.length).toFixed(1)
    : '—'

  const columns = [
    { key: 'ref', label: 'Trade ref.', width: 110, mono: true },
    { key: 'offered', label: 'Offer date', width: 125 },
    {
      key: 'responded', label: 'Response date', width: 135,
      render: (t) => (t.responded || <span style={{ color: 'var(--text-subtle)' }}>Awaiting</span>),
    },
    {
      key: 'turnaround', label: 'Turnaround', width: 120, align: 'right', mono: true,
      render: (t) => (t.turnaround == null ? '—' : `${t.turnaround} d`),
    },
    { key: 'from', label: 'Offering factory', width: 150 },
    { key: 'to', label: 'Receiving factory', width: 155 },
    {
      key: 'direction', label: 'Direction', width: 120,
      render: (t) => <Badge tone={t.direction === 'Outgoing' ? 'neutral' : 'brand'}>{t.direction}</Badge>,
    },
    { key: 'material', label: 'Raw material', width: 235 },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (t) => fmt(t.qty) },
    { key: 'unit', label: 'Unit', width: 105 },
    { key: 'unitCost', label: 'Unit value', width: 145, align: 'right', mono: true, render: (t) => money(t.unitCost) },
    { key: 'value', label: 'Total value', width: 165, align: 'right', mono: true, render: (t) => money(t.value) },
    { key: 'reason', label: 'Reason offered', width: 225 },
    { key: 'status', label: 'Outcome', width: 120, render: (t) => <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge> },
    {
      key: 'respondedBy', label: 'Responded by', width: 180,
      render: (t) => (t.respondedBy || <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Trade Report'}
      icon={leaf?.icon}
      description="Complete history of inter-factory trade activity, with offer and response dates and full raw material detail for every exchange — an audit trail of material movement between factories."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'in', label: 'Incoming' }, { value: 'out', label: 'Outgoing' }] },
        { key: 'status', label: 'Outcome', type: 'select', options: [{ value: 'accepted', label: 'Accepted' }, { value: 'rejected', label: 'Rejected' }, { value: 'pending', label: 'Awaiting response' }] },
        { key: 'reason', label: 'Reason', type: 'select', options: tradeReasons },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Trades recorded', value: String(rows.length) },
        { label: 'Accepted', value: String(accepted.length), delta: `${Math.round((accepted.length / rows.length) * 100)}% of trades` },
        { label: 'Value redistributed', value: moneyShort(acceptedValue), hint: 'Avoided external purchase' },
        { label: 'Average turnaround', value: `${avgTurnaround} days`, hint: `${rejected.length} rejected` },
      ]}
      columns={columns}
      rows={rows}
      totals={{ ref: 'Total', value: money(rows.reduce((n, t) => n + t.value, 0)) }}
      tableTitle="Inter-factory trade history"
      emptyTitle="No trade activity in this period"
      emptyDescription="Widen the date range or clear the outcome filter, then generate again."
      footnote="Value redistributed counts accepted trades only — material moved internally rather than bought from a supplier. Rejected and withdrawn offers are retained for audit."
    />
  )
}
