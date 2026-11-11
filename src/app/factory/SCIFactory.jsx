// import { Page, Panel, StatRow } from '../shells/Page.jsx'
// import { PageHeader } from '../shells/PageHeader.jsx'
// import { FilterBar } from '../shells/FilterBar.jsx'
// import { Statement } from '../shells/Statement.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
// import { factories, sciRevenue, sciCostOfSales, sciOperatingExpenses } from '../sample.js'
// import { exportStatement } from '../exporting.js'
// import { useStore } from '../store.jsx'
// import { money, moneyShort } from '../utils.js'

// const sum = (a, k) => a.reduce((n, x) => n + x[k], 0)
// const pct = (cur, prior) => (prior ? `${cur >= prior ? '+' : ''}${(((cur - prior) / prior) * 100).toFixed(1)}%` : '—')

// export default function SCIFactory({ leaf, moduleLabel, parentLabel }) {
//   const { showToast } = useStore()
//   const revenue = sum(sciRevenue, 'current')
//   const cos = sum(sciCostOfSales, 'current')
//   const opex = sum(sciOperatingExpenses, 'current')
//   const gross = revenue - cos
//   const net = gross - opex

//   const pRevenue = sum(sciRevenue, 'prior')
//   const pCos = sum(sciCostOfSales, 'prior')
//   const pOpex = sum(sciOperatingExpenses, 'prior')
//   const pGross = pRevenue - pCos
//   const pNet = pGross - pOpex

//   const line = (r, invert) => ({
//     label: r.label,
//     values: [money(r.current), money(r.prior)],
//     change: pct(r.current, r.prior),
//     changeTone: invert ? (r.current <= r.prior ? 'positive' : 'negative') : (r.current >= r.prior ? 'positive' : 'negative'),
//   })

//   const grossMargin = ((gross / revenue) * 100).toFixed(1)
//   const netMargin = ((net / revenue) * 100).toFixed(1)
//   const pNetMargin = ((pNet / pRevenue) * 100).toFixed(1)

//   // One definition, read by both the on-screen statement and the export.
//   const statementColumns = ['This period', 'Prior period']
//   const statementSections = [
//     {
//       title: 'Revenue',
//       tone: 'positive',
//       rows: sciRevenue.map((r) => line(r)),
//       subtotal: { label: 'Total revenue', values: [money(revenue), money(pRevenue)], change: pct(revenue, pRevenue), changeTone: 'positive' },
//     },
//     {
//       title: 'Cost of sales',
//       tone: 'negative',
//       rows: sciCostOfSales.map((r) => line(r, true)),
//       subtotal: { label: 'Total cost of sales', values: [money(cos), money(pCos)], change: pct(cos, pCos), changeTone: 'negative' },
//     },
//     {
//       title: 'Gross profit',
//       rows: [{
//         label: 'Revenue less cost of sales',
//         note: `${grossMargin}% margin`,
//         values: [money(gross), money(pGross)],
//         change: pct(gross, pGross),
//         changeTone: 'positive',
//       }],
//     },
//     {
//       title: 'Operating expenses',
//       tone: 'negative',
//       rows: sciOperatingExpenses.map((r) => line(r, true)),
//       subtotal: { label: 'Total operating expenses', values: [money(opex), money(pOpex)], change: pct(opex, pOpex), changeTone: 'negative' },
//     },
//   ]
//   const statementResult = {
//     label: 'Net profit for the period',
//     note: `${netMargin}% net margin, against ${pNetMargin}% in the prior period`,
//     values: [money(net), money(pNet)],
//     tone: net >= 0 ? 'positive' : 'negative',
//     change: pct(net, pNet),
//     changeTone: net >= pNet ? 'positive' : 'negative',
//   }

//   const title = leaf?.label || 'SCI Factory'
//   const doExport = (format) => {
//     const count = exportStatement(format, { columns: statementColumns, sections: statementSections, result: statementResult, title })
//     showToast(`Exported ${count} row${count === 1 ? '' : 's'}`, `${title} · ${format === 'xlsx' ? 'Excel workbook' : 'CSV file'}`)
//   }

//   return (
//     <Page wide>
//       <PageHeader
//         crumbs={[moduleLabel, parentLabel]}
//         title={title}
//         icon={leaf?.icon}
//         description="Statement of Comprehensive Income at factory level — income generated from factory operations against the expenses incurred in production and administration over the period."
//         actions={
//           <>
//             <Button variant="secondary" iconLeft="printer" onClick={() => window.print()}>Print</Button>
//             <ExportButton onExport={doExport} />
//           </>
//         }
//       />

//       <FilterBar
//         fields={[
//           { key: 'factory', label: 'Factory', type: 'select', options: factories },
//           { key: 'from', label: 'Period from', type: 'date' },
//           { key: 'to', label: 'Period to', type: 'date' },
//           { key: 'compare', label: 'Compare with', type: 'select', options: [{ value: 'prior', label: 'Prior period' }, { value: 'year', label: 'Same period last year' }, { value: 'none', label: 'No comparison' }] },
//         ]}
//         onGenerate={() => {}}
//         onReset={() => {}}
//       />

//       <StatRow
//         stats={[
//           { label: 'Total revenue', value: moneyShort(revenue), delta: pct(revenue, pRevenue), tone: 'positive' },
//           { label: 'Gross profit', value: moneyShort(gross), delta: pct(gross, pGross), tone: 'positive', hint: `${grossMargin}% margin` },
//           { label: 'Operating expenses', value: moneyShort(opex), delta: pct(opex, pOpex), tone: 'negative' },
//           { label: 'Net profit', value: moneyShort(net), delta: pct(net, pNet), tone: net >= 0 ? 'positive' : 'negative', hint: `${netMargin}% margin` },
//         ]}
//       />

//       <Statement
//         columns={statementColumns}
//         sections={statementSections}
//         result={statementResult}
//       />

//       <Panel title="Basis of preparation">
//         <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
//           Revenue is recognised on dispatch confirmation, so goods in transit are excluded until the receiving
//           location acknowledges them. Cost of sales draws on landing costs approved through the Production Cost
//           Calculator. Figures reconcile to the Cash Inflow/Outflow Statement for the same period, with timing
//           differences arising where sales are invoiced but not yet remitted.
//         </div>
//       </Panel>
//     </Page>
//   )
// }
import { useEffect, useState, useCallback } from 'react'
import { Page, Panel, StatRow } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { Statement } from '../shells/Statement.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { exportStatement } from '../exporting.js'
import { useStore } from '../store.jsx'
import { money, moneyShort } from '../utils.js'
import ReportApi from '../../api/ReportApi.js'

const reportApi = new ReportApi()

const COMPARE_OPTIONS = [
  { value: 'PRIOR_PERIOD', label: 'Prior period' },
  { value: 'SAME_PERIOD_LAST_YEAR', label: 'Same period last year' },
  { value: 'NONE', label: 'No comparison' },
]

const today = () => new Date().toISOString().slice(0, 10)
const startOfMonth = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10)
}

// ── DS form controls call onChange with either a native event
//    ({ target: { value } }) OR the value itself (string) OR
//    a { value } wrapper. Normalise all three.
function val(payload) {
  if (payload && typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

function fmtChange(pct) {
  if (pct == null) return '—'
  const n = Number(pct)
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`
}
function fmtDelta(pct) {
  return pct == null ? undefined : fmtChange(pct)
}
function changeTone(pct, isCost) {
  if (pct == null) return undefined
  if (isCost) return pct <= 0 ? 'positive' : 'negative'
  return pct >= 0 ? 'positive' : 'negative'
}
function mapLines(lines, isCost) {
  return (lines || []).map((l) => ({
    label: l.label,
    note: l.note || undefined,
    values: (l.values || []).map((v) => money(v || 0)),
    change: fmtChange(l.changePct),
    changeTone: changeTone(l.changePct, isCost),
  }))
}

const DEFAULTS = () => ({
  locationId: '',
  from: startOfMonth(),
  to: today(),
  compare: 'PRIOR_PERIOD',
})

export default function SCIFactory({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  // filters = what the controls show; applied = what the last fetch used
  const [filters, setFilters] = useState(DEFAULTS)
  const [applied, setApplied] = useState(DEFAULTS)
  const setFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value }))

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const query = {
        scope: 'COMPANY',
        from: applied.from,
        to: applied.to,
        compare: applied.compare,
      }
      if (applied.locationId) query.locationId = applied.locationId

      const res = await reportApi.getReportSCICredentials(query)
      setData(res.data)
    } catch (e) {
      showToast('Could not load statement', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, showToast])

  useEffect(() => {
    load()
  }, [load])

  const handleGenerate = () => {
    const from = filters.from || startOfMonth()
    const to = filters.to || today()
    if (from > to) {
      showToast(
        'Check the dates',
        '"Period from" must be before "Period to".',
        true
      )
      return
    }
    setApplied({ ...filters, from, to })
  }

  const handleReset = () => {
    const d = DEFAULTS()
    setFilters(d)
    setApplied(d)
  }

  // ── transform response → Statement shape ──────────────
  const statementColumns = data?.columns || ['This period', 'Prior period']
  const statementSections = (data?.sections || []).map((section) => ({
    title: section.title,
    tone: section.cost ? 'negative' : undefined,
    rows: mapLines(section.lines, section.cost),
    subtotal: section.subtotal
      ? {
          label: section.subtotal.label,
          values: (section.subtotal.values || []).map((v) => money(v || 0)),
          change: fmtChange(section.subtotal.changePct),
          changeTone: changeTone(section.subtotal.changePct, section.cost),
        }
      : undefined,
  }))
  const statementResult = data?.result
    ? {
        label: data.result.label,
        note: data.result.note || undefined,
        values: (data.result.values || []).map((v) => money(v || 0)),
        tone: (data.result.values?.[0] || 0) >= 0 ? 'positive' : 'negative',
        change: fmtChange(data.result.changePct),
        changeTone: changeTone(data.result.changePct, false),
      }
    : null

  const s = data?.stats || {}
  const revenueSection = (data?.sections || []).find((x) => x.title === 'Revenue')
  const cosSection = (data?.sections || []).find((x) => x.title === 'Cost of sales')
  const opexSection = (data?.sections || []).find(
    (x) => x.title === 'Operating expenses'
  )

  const stats = data
    ? [
        {
          label: 'Total revenue',
          value: moneyShort(s.totalRevenue || 0),
          delta: fmtDelta(revenueSection?.subtotal?.changePct),
          tone: (s.totalRevenue || 0) >= 0 ? 'positive' : 'negative',
        },
        {
          label: 'Gross profit',
          value: moneyShort(s.grossProfit || 0),
          delta: fmtDelta(cosSection?.subtotal?.changePct),
          tone: (s.grossProfit || 0) >= 0 ? 'positive' : 'negative',
          hint:
            s.grossMarginPct != null
              ? `${Number(s.grossMarginPct).toFixed(1)}% margin`
              : undefined,
        },
        {
          label: 'Operating expenses',
          value: moneyShort(s.operatingExpenses || 0),
          delta: fmtDelta(opexSection?.subtotal?.changePct),
          tone: 'negative',
        },
        {
          label: 'Net profit',
          value: moneyShort(s.netProfit || 0),
          delta: fmtDelta(data.result?.changePct),
          tone: (s.netProfit || 0) >= 0 ? 'positive' : 'negative',
          hint:
            s.netMarginPct != null
              ? `${Number(s.netMarginPct).toFixed(1)}% margin`
              : undefined,
        },
      ]
    : []

  const title = leaf?.label || 'SCI Factory'
  const doExport = (format) => {
    if (!data) return
    const count = exportStatement(format, {
      columns: statementColumns,
      sections: statementSections,
      result: statementResult,
      title: `${title} · ${data.period.from} – ${data.period.to}`,
    })
    showToast(
      `Exported ${count} row${count === 1 ? '' : 's'}`,
      `${title} · ${format === 'xlsx' ? 'Excel workbook' : 'CSV file'}`
    )
  }

  const factoryOptions = [
    { value: '', label: 'All factories' },
    ...(factories || []).map((f) => ({ value: f.id, label: f.name })),
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading statement…" />}
      <Page wide>
        <PageHeader
          crumbs={[moduleLabel, parentLabel]}
          title={title}
          icon={leaf?.icon}
          description="Statement of Comprehensive Income at factory level — income generated from factory operations against the expenses incurred in production and administration over the period."
          actions={
            <>
              <Button
                variant="secondary"
                iconLeft="printer"
                onClick={() => window.print()}
              >
                Print
              </Button>
              <ExportButton onExport={doExport} />
            </>
          }
        />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'flex-end',
            padding: 16,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ width: 210 }}>
            <Select
              label="Factory"
              options={factoryOptions}
              value={filters.locationId}
              onChange={(e) => setFilter('locationId', val(e))}
            />
          </div>
          <div style={{ width: 170 }}>
            <Input
              label="Period from"
              type="date"
              value={filters.from}
              onChange={(e) => setFilter('from', val(e))}
            />
          </div>
          <div style={{ width: 170 }}>
            <Input
              label="Period to"
              type="date"
              value={filters.to}
              onChange={(e) => setFilter('to', val(e))}
            />
          </div>
          <div style={{ width: 210 }}>
            <Select
              label="Compare with"
              options={COMPARE_OPTIONS}
              value={filters.compare}
              onChange={(e) => setFilter('compare', val(e))}
            />
          </div>
          <Button iconLeft="search" onClick={handleGenerate}>
            Generate
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {data && (
          <>
            <StatRow stats={stats} />
            {statementResult && (
              <Statement
                columns={statementColumns}
                sections={statementSections}
                result={statementResult}
              />
            )}
            <Panel title="Basis of preparation">
              <div
                style={{
                  font: 'var(--type-caption)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                }}
              >
                {data.basisOfPreparation ||
                  'Prepared from each module’s own records on the accrual basis.'}
              </div>
            </Panel>
          </>
        )}

        {!data && !loading && (
          <Panel title="No data">
            <div
              style={{
                font: 'var(--type-caption)',
                color: 'var(--text-muted)',
              }}
            >
              Adjust the filters and click Generate to load the statement.
            </div>
          </Panel>
        )}
      </Page>
    </>
  )
}