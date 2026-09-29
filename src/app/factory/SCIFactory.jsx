import { Page, Panel, StatRow } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { FilterBar } from '../shells/FilterBar.jsx'
import { Statement } from '../shells/Statement.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { factories, sciRevenue, sciCostOfSales, sciOperatingExpenses } from '../sample.js'
import { exportStatement } from '../exporting.js'
import { useStore } from '../store.jsx'
import { money, moneyShort } from '../utils.js'

const sum = (a, k) => a.reduce((n, x) => n + x[k], 0)
const pct = (cur, prior) => (prior ? `${cur >= prior ? '+' : ''}${(((cur - prior) / prior) * 100).toFixed(1)}%` : '—')

export default function SCIFactory({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const revenue = sum(sciRevenue, 'current')
  const cos = sum(sciCostOfSales, 'current')
  const opex = sum(sciOperatingExpenses, 'current')
  const gross = revenue - cos
  const net = gross - opex

  const pRevenue = sum(sciRevenue, 'prior')
  const pCos = sum(sciCostOfSales, 'prior')
  const pOpex = sum(sciOperatingExpenses, 'prior')
  const pGross = pRevenue - pCos
  const pNet = pGross - pOpex

  const line = (r, invert) => ({
    label: r.label,
    values: [money(r.current), money(r.prior)],
    change: pct(r.current, r.prior),
    changeTone: invert ? (r.current <= r.prior ? 'positive' : 'negative') : (r.current >= r.prior ? 'positive' : 'negative'),
  })

  const grossMargin = ((gross / revenue) * 100).toFixed(1)
  const netMargin = ((net / revenue) * 100).toFixed(1)
  const pNetMargin = ((pNet / pRevenue) * 100).toFixed(1)

  // One definition, read by both the on-screen statement and the export.
  const statementColumns = ['This period', 'Prior period']
  const statementSections = [
    {
      title: 'Revenue',
      tone: 'positive',
      rows: sciRevenue.map((r) => line(r)),
      subtotal: { label: 'Total revenue', values: [money(revenue), money(pRevenue)], change: pct(revenue, pRevenue), changeTone: 'positive' },
    },
    {
      title: 'Cost of sales',
      tone: 'negative',
      rows: sciCostOfSales.map((r) => line(r, true)),
      subtotal: { label: 'Total cost of sales', values: [money(cos), money(pCos)], change: pct(cos, pCos), changeTone: 'negative' },
    },
    {
      title: 'Gross profit',
      rows: [{
        label: 'Revenue less cost of sales',
        note: `${grossMargin}% margin`,
        values: [money(gross), money(pGross)],
        change: pct(gross, pGross),
        changeTone: 'positive',
      }],
    },
    {
      title: 'Operating expenses',
      tone: 'negative',
      rows: sciOperatingExpenses.map((r) => line(r, true)),
      subtotal: { label: 'Total operating expenses', values: [money(opex), money(pOpex)], change: pct(opex, pOpex), changeTone: 'negative' },
    },
  ]
  const statementResult = {
    label: 'Net profit for the period',
    note: `${netMargin}% net margin, against ${pNetMargin}% in the prior period`,
    values: [money(net), money(pNet)],
    tone: net >= 0 ? 'positive' : 'negative',
    change: pct(net, pNet),
    changeTone: net >= pNet ? 'positive' : 'negative',
  }

  const title = leaf?.label || 'SCI Factory'
  const doExport = (format) => {
    const count = exportStatement(format, { columns: statementColumns, sections: statementSections, result: statementResult, title })
    showToast(`Exported ${count} row${count === 1 ? '' : 's'}`, `${title} · ${format === 'xlsx' ? 'Excel workbook' : 'CSV file'}`)
  }

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={title}
        icon={leaf?.icon}
        description="Statement of Comprehensive Income at factory level — income generated from factory operations against the expenses incurred in production and administration over the period."
        actions={
          <>
            <Button variant="secondary" iconLeft="printer" onClick={() => window.print()}>Print</Button>
            <ExportButton onExport={doExport} />
          </>
        }
      />

      <FilterBar
        fields={[
          { key: 'factory', label: 'Factory', type: 'select', options: factories },
          { key: 'from', label: 'Period from', type: 'date' },
          { key: 'to', label: 'Period to', type: 'date' },
          { key: 'compare', label: 'Compare with', type: 'select', options: [{ value: 'prior', label: 'Prior period' }, { value: 'year', label: 'Same period last year' }, { value: 'none', label: 'No comparison' }] },
        ]}
        onGenerate={() => {}}
        onReset={() => {}}
      />

      <StatRow
        stats={[
          { label: 'Total revenue', value: moneyShort(revenue), delta: pct(revenue, pRevenue), tone: 'positive' },
          { label: 'Gross profit', value: moneyShort(gross), delta: pct(gross, pGross), tone: 'positive', hint: `${grossMargin}% margin` },
          { label: 'Operating expenses', value: moneyShort(opex), delta: pct(opex, pOpex), tone: 'negative' },
          { label: 'Net profit', value: moneyShort(net), delta: pct(net, pNet), tone: net >= 0 ? 'positive' : 'negative', hint: `${netMargin}% margin` },
        ]}
      />

      <Statement
        columns={statementColumns}
        sections={statementSections}
        result={statementResult}
      />

      <Panel title="Basis of preparation">
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Revenue is recognised on dispatch confirmation, so goods in transit are excluded until the receiving
          location acknowledges them. Cost of sales draws on landing costs approved through the Production Cost
          Calculator. Figures reconcile to the Cash Inflow/Outflow Statement for the same period, with timing
          differences arising where sales are invoiced but not yet remitted.
        </div>
      </Panel>
    </Page>
  )
}
