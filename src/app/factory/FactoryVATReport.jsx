import { Badge } from '../../ds/components/core/Badge.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { factories, VAT_RATE, vatOutputs, vatInputs, vatTransactions } from '../sample.js'
import { money, moneyShort } from '../utils.js'

const rate = `${(VAT_RATE * 100).toFixed(1)}%`

export default function FactoryVATReport({ leaf, moduleLabel, parentLabel }) {
  const outputVat = vatOutputs.reduce((n, r) => n + r.base * VAT_RATE, 0)
  const inputVat = vatInputs.reduce((n, r) => n + r.base * VAT_RATE, 0)
  const netVat = outputVat - inputVat
  const payable = netVat >= 0

  const outputBase = vatOutputs.reduce((n, r) => n + r.base, 0)
  const inputBase = vatInputs.reduce((n, r) => n + r.base, 0)

  const line = (r) => ({
    label: r.label,
    note: `on ${money(r.base)}`,
    values: [money(r.base * VAT_RATE)],
  })

  const rows = vatTransactions.map((t) => ({ ...t, vat: t.base * VAT_RATE }))

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Document', width: 130, mono: true },
    { key: 'counterparty', label: 'Counterparty', width: 220 },
    { key: 'description', label: 'Description', width: 300 },
    {
      key: 'type', label: 'VAT type', width: 120,
      render: (t) => <Badge tone={t.type === 'Output' ? 'brand' : 'neutral'}>{t.type}</Badge>,
    },
    { key: 'base', label: 'Taxable amount', width: 170, align: 'right', mono: true, render: (t) => money(t.base) },
    { key: 'rate', label: 'Rate', width: 90, align: 'right', mono: true, render: () => rate },
    {
      key: 'vat', label: 'VAT', width: 165, align: 'right', mono: true,
      render: (t) => (
        <span style={{ color: t.type === 'Output' ? 'var(--success)' : 'var(--danger)' }}>
          {t.type === 'Output' ? '+' : '−'}{money(t.vat)}
        </span>
      ),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Factory VAT Report'}
      icon={leaf?.icon}
      description="Value Added Tax on the factory's transactions — VAT charged on sales set against VAT paid on purchases, for tax calculation, reporting and reconciliation."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'type', label: 'VAT type', type: 'select', options: [{ value: 'output', label: 'Output (on sales)' }, { value: 'input', label: 'Input (on purchases)' }] },
        { key: 'from', label: 'Period from', type: 'date' },
        { key: 'to', label: 'Period to', type: 'date' },
      ]}
      stats={[
        { label: 'Output VAT', value: moneyShort(outputVat), hint: `on ${moneyShort(outputBase)} of sales` },
        { label: 'Input VAT', value: moneyShort(inputVat), hint: `on ${moneyShort(inputBase)} of purchases` },
        { label: payable ? 'Net VAT payable' : 'Net VAT reclaimable', value: moneyShort(Math.abs(netVat)), tone: payable ? 'negative' : 'positive' },
        { label: 'Applied rate', value: rate, hint: 'Per VAT Control' },
      ]}
      columns={columns}
      rows={rows}
      totals={{ date: 'Total', base: money(outputBase + inputBase), vat: money(netVat) }}
      tableTitle="VAT transaction detail"
      emptyTitle="No VAT transactions in this period"
      emptyDescription="Widen the period or clear the VAT type filter, then generate again."
      footnote={`VAT is calculated at the rate configured for the relevant location in VAT Control, currently ${rate}. Output VAT is collected on behalf of the tax authority; input VAT is recoverable against it.`}
    >
      <Statement
        columns={[`VAT at ${rate}`]}
        sections={[
          {
            title: 'Output VAT — charged on sales',
            tone: 'positive',
            rows: vatOutputs.map(line),
            subtotal: { label: 'Total output VAT', values: [money(outputVat)] },
          },
          {
            title: 'Input VAT — paid on purchases',
            tone: 'negative',
            rows: vatInputs.map(line),
            subtotal: { label: 'Total input VAT', values: [money(inputVat)] },
          },
        ]}
        result={{
          label: payable ? 'Net VAT payable to authority' : 'Net VAT reclaimable',
          note: payable
            ? 'Output VAT collected exceeds input VAT recoverable for this period.'
            : 'Input VAT recoverable exceeds output VAT collected for this period.',
          values: [money(Math.abs(netVat))],
          tone: payable ? 'negative' : 'positive',
        }}
      />
    </ReportShell>
  )
}
