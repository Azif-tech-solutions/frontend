import { Button } from '../../ds/components/core/Button.jsx'
import { Page, Panel, StatRow } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { FilterBar } from '../shells/FilterBar.jsx'
import { Statement } from '../shells/Statement.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { exportStatement } from '../exporting.js'
import { useStore } from '../store.jsx'
import { factories } from '../sample.js'
import { showrooms } from '../sampleShowroom.js'
import { companyRevenue, companyCostOfSales, companyExpenses, companyStockValues } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

const sum = (a, k) => a.reduce((n, x) => n + x[k], 0)
const pct = (cur, prior) => (prior ? `${cur >= prior ? '+' : ''}${(((cur - prior) / prior) * 100).toFixed(1)}%` : '—')

export default function SCIReport({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()
  const revenue = sum(companyRevenue, 'current')
  const cos = sum(companyCostOfSales, 'current')
  const expenses = sum(companyExpenses, 'current')
  const gross = revenue - cos
  const net = gross - expenses

  const pRevenue = sum(companyRevenue, 'prior')
  const pCos = sum(companyCostOfSales, 'prior')
  const pExpenses = sum(companyExpenses, 'prior')
  const pGross = pRevenue - pCos
  const pNet = pGross - pExpenses

  const stock = sum(companyStockValues, 'current')
  const pStock = sum(companyStockValues, 'prior')

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
      rows: companyRevenue.map((r) => line(r)),
      subtotal: { label: 'Total revenue', values: [money(revenue), money(pRevenue)], change: pct(revenue, pRevenue), changeTone: 'positive' },
    },
    {
      title: 'Cost of sales',
      tone: 'negative',
      rows: companyCostOfSales.map((r) => line(r, true)),
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
      rows: companyExpenses.map((r) => line(r, true)),
      subtotal: { label: 'Total operating expenses', values: [money(expenses), money(pExpenses)], change: pct(expenses, pExpenses), changeTone: 'negative' },
    },
    {
      title: 'Stock values at period end',
      rows: companyStockValues.map((r) => line(r)),
      subtotal: { label: 'Total stock held', values: [money(stock), money(pStock)], change: pct(stock, pStock), changeTone: 'positive' },
    },
  ]
  const statementResult = {
    label: 'Net profit for the period',
    note: `${netMargin}% net margin, against ${pNetMargin}% in the prior period.`,
    values: [money(net), money(pNet)],
    tone: net >= 0 ? 'positive' : 'negative',
    change: pct(net, pNet),
    changeTone: net >= pNet ? 'positive' : 'negative',
  }

  const title = leaf?.label || 'SCI Report'
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
        description="Statement of Comprehensive Income for the company as a whole — consolidating revenue, cost of sales, operating expenses, commissions paid and closing stock values into one view of profitability."
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
          { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
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
          { label: 'Net profit', value: moneyShort(net), delta: pct(net, pNet), tone: net >= 0 ? 'positive' : 'negative', hint: `${netMargin}% margin` },
          { label: 'Closing stock value', value: moneyShort(stock), delta: pct(stock, pStock), hint: 'Factory and showroom' },
        ]}
      />

      <Statement
        columns={statementColumns}
        sections={statementSections}
        result={statementResult}
      />

      <Panel title="Basis of preparation">
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          Revenue consolidates showroom counter sales, dealer and distributor sales, special production and
          by-product income. Cost of sales draws on landing costs approved through the Production Cost Calculator
          plus outsourced stock purchases. Dealer commissions are shown within operating expenses at the amount
          allocated for the period, whether or not it has been paid. Stock values are stated at landing cost and
          reconcile to the Comprehensive Stock Reports for the same date.
        </div>
      </Panel>
    </Page>
  )
}
