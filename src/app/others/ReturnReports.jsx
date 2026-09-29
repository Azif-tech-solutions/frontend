import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { showrooms } from '../sampleShowroom.js'
import { returnReasons } from '../sampleShowroom.js'
import { returnRecords } from '../sampleOthers.js'
import { fmt, money, moneyShort } from '../utils.js'

const CONDITION_TONE = { Resaleable: 'success', 'Damaged — write off': 'danger', Quarantine: 'warning' }

export default function ReturnReports({ leaf, moduleLabel, parentLabel }) {
  const rows = returnRecords
  const value = rows.reduce((n, r) => n + r.value, 0)
  const qty = rows.reduce((n, r) => n + r.qty, 0)
  const resaleable = rows.filter((r) => r.condition === 'Resaleable')
  const writeOff = rows.filter((r) => r.condition === 'Damaged — write off')

  const byReason = Object.values(
    rows.reduce((acc, r) => {
      acc[r.reason] ||= { label: r.reason, value: 0, qty: 0, count: 0 }
      acc[r.reason].value += r.value
      acc[r.reason].qty += r.qty
      acc[r.reason].count += 1
      return acc
    }, {})
  ).sort((a, b) => b.value - a.value)

  const columns = [
    { key: 'date', label: 'Return date', width: 135 },
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    { key: 'originalInvoice', label: 'Original sale', width: 145, mono: true },
    { key: 'customer', label: 'Returned by', width: 230 },
    {
      key: 'customerType', label: 'Customer type', width: 190,
      render: (r) => <Badge tone={r.customerType === 'Authorised Dealer' ? 'brand' : 'neutral'}>{r.customerType}</Badge>,
    },
    { key: 'product', label: 'Product returned', width: 250 },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'value', label: 'Value credited', width: 175, align: 'right', mono: true, render: (r) => money(r.value) },
    { key: 'reason', label: 'Reason', width: 240 },
    {
      key: 'condition', label: 'Condition', width: 190,
      render: (r) => <Badge tone={CONDITION_TONE[r.condition] || 'neutral'}>{r.condition}</Badge>,
    },
    { key: 'showroom', label: 'Showroom', width: 180 },
    { key: 'creditedTo', label: 'Credited to', width: 170 },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Return Reports'}
      icon={leaf?.icon}
      description="Goods sold and later returned by customers or dealers, with the quantity, reason, condition on return and the original sale each return traces back to."
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'reason', label: 'Reason', type: 'select', options: returnReasons },
        { key: 'condition', label: 'Condition', type: 'select', options: Object.keys(CONDITION_TONE).map((c) => ({ value: c, label: c })) },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Returns processed', value: String(rows.length) },
        { label: 'Units returned', value: fmt(qty) },
        { label: 'Value credited', value: moneyShort(value), tone: 'negative' },
        { label: 'Written off', value: moneyShort(writeOff.reduce((n, r) => n + r.value, 0)), tone: writeOff.length ? 'negative' : undefined, hint: `${resaleable.length} resaleable` },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', qty: fmt(qty), value: money(value) }}
      tableTitle="Returned goods"
      emptyTitle="No returns in this period"
      emptyDescription="Widen the date range or clear the reason filter, then generate again."
      footnote="Return value is credited to the customer's wallet at the current selling price. Resaleable goods re-enter stock; goods marked for write-off do not and are recorded as a loss."
    >
      <Statement
        columns={['Value credited']}
        sections={[
          {
            title: 'Returns by reason',
            tone: 'negative',
            rows: byReason.map((r) => ({
              label: r.label,
              note: `${r.count} return${r.count === 1 ? '' : 's'} · ${fmt(r.qty)} units`,
              values: [money(r.value)],
            })),
            subtotal: { label: 'Total credited', values: [money(value)] },
          },
        ]}
        result={{
          label: 'Net cost of returns',
          note: `${resaleable.length} of ${rows.length} returns were resaleable and re-entered stock; the remainder were written off.`,
          values: [money(writeOff.reduce((n, r) => n + r.value, 0))],
          tone: 'negative',
        }}
      />
    </ReportShell>
  )
}
