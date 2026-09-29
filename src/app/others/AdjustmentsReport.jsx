import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { showrooms } from '../sampleShowroom.js'
import { adjustmentReasons } from '../sample.js'
import { adjustmentRecords } from '../sampleOthers.js'
import { fmt } from '../utils.js'

/**
 * Serves §5.7.5 (a single showroom) and §5.7.6 (consolidated across all of them).
 * The PRD states the general report is the same data without showroom scoping.
 */
export default function AdjustmentsReport({ leaf, moduleLabel, parentLabel, scoped = true }) {
  const rows = scoped
    ? adjustmentRecords.filter((a) => a.showroom === 'Showroom Ikeja')
    : adjustmentRecords

  const positive = rows.filter((a) => a.direction === 'Positive')
  const negative = rows.filter((a) => a.direction === 'Negative')
  const upQty = positive.reduce((n, a) => n + a.qty, 0)
  const downQty = negative.reduce((n, a) => n + a.qty, 0)

  const byReason = Object.values(
    rows.reduce((acc, a) => {
      acc[a.reason] ||= { label: a.reason, qty: 0, count: 0 }
      acc[a.reason].qty += a.qty
      acc[a.reason].count += 1
      return acc
    }, {})
  ).sort((a, b) => b.qty - a.qty)

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    ...(scoped ? [] : [{ key: 'showroom', label: 'Showroom', width: 180 }]),
    { key: 'product', label: 'Product', width: 260 },
    {
      key: 'direction', label: 'Direction', width: 130,
      render: (a) => <Badge tone={a.direction === 'Positive' ? 'success' : 'danger'}>{a.direction}</Badge>,
    },
    {
      key: 'qty', label: 'Quantity', width: 130, align: 'right', mono: true,
      render: (a) => (
        <span style={{ color: a.direction === 'Positive' ? 'var(--success)' : 'var(--danger)' }}>
          {a.direction === 'Positive' ? '+' : '−'}{fmt(a.qty)}
        </span>
      ),
    },
    { key: 'unit', label: 'Unit', width: 110 },
    { key: 'reason', label: 'Reason', width: 230 },
    { key: 'note', label: 'Note', width: 280 },
    { key: 'by', label: 'Adjusted by', width: 160 },
  ]

  const suspicious = rows.filter((a) => a.reason === 'Suspected theft / loss')

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || (scoped ? 'Adjustments — Showroom Report' : 'Adjustments — General Report')}
      icon={leaf?.icon}
      description={scoped
        ? 'Every stock adjustment made within the selected showroom, positive and negative, with the quantity, product, date and the reason given for each.'
        : 'Every stock adjustment made across all showrooms, consolidated into a single view without scoping to any one branch.'}
      filters={[
        ...(scoped ? [{ key: 'showroom', label: 'Showroom', type: 'select', options: showrooms }] : []),
        { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'positive', label: 'Positive' }, { value: 'negative', label: 'Negative' }] },
        { key: 'reason', label: 'Reason', type: 'select', options: adjustmentReasons },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      stats={[
        { label: 'Adjustments made', value: String(rows.length) },
        { label: 'Quantity added', value: fmt(upQty), delta: `${positive.length} entries` },
        { label: 'Quantity removed', value: fmt(downQty), tone: 'negative', delta: `${negative.length} entries` },
        { label: 'Net effect', value: `${upQty - downQty >= 0 ? '+' : '−'}${fmt(Math.abs(upQty - downQty))}` },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Net', qty: `${upQty - downQty >= 0 ? '+' : '−'}${fmt(Math.abs(upQty - downQty))}` }}
      tableTitle={scoped ? 'Adjustments at Showroom Ikeja' : 'Adjustments across all showrooms'}
      emptyTitle="No adjustments in this period"
      emptyDescription="Widen the date range or clear the reason filter, then generate again."
      footnote="Every adjustment is logged with its reason, a timestamp and the identity of the person who made it. Only Stock Keepers, or an equivalently authorised role, may adjust stock."
    >
      <Statement
        columns={['Quantity']}
        sections={[
          {
            title: 'Adjustments by reason',
            rows: byReason.map((r) => ({
              label: r.label,
              note: `${r.count} adjustment${r.count === 1 ? '' : 's'}`,
              values: [fmt(r.qty)],
            })),
            subtotal: { label: 'Total units adjusted', values: [fmt(upQty + downQty)] },
          },
        ]}
        result={{
          label: 'Net stock effect',
          note: suspicious.length
            ? `${suspicious.length} adjustment${suspicious.length === 1 ? '' : 's'} cited suspected theft or loss and should be reviewed against the Violations History.`
            : 'No adjustments in this period cited suspected theft or loss.',
          values: [`${upQty - downQty >= 0 ? '+' : '−'}${fmt(Math.abs(upQty - downQty))}`],
          tone: upQty - downQty >= 0 ? 'positive' : 'negative',
        }}
      />
    </ReportShell>
  )
}
