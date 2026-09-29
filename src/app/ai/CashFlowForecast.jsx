import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { Page, Panel, StatRow, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { FilterBar } from '../shells/FilterBar.jsx'
import { ConfidenceMeter, ForecastBadge, SourceCite, HumanReviewNotice } from './aiParts.jsx'
import { showrooms } from '../sampleShowroom.js'
import { cashForecast } from '../sampleAI.js'
import { money, moneyShort } from '../utils.js'

const HORIZONS = [
  { value: 7, label: 'Next 7 days' },
  { value: 30, label: 'Next 30 days' },
  { value: 90, label: 'Next 90 days' },
]

export default function CashFlowForecast({ leaf, moduleLabel, parentLabel }) {
  const [days, setDays] = useState(30)
  const h = cashForecast.horizons.find((x) => x.days === days) || cashForecast.horizons[1]
  const net = h.inflow - h.outflow
  const shortfall = net < 0

  const weeks = cashForecast.weeks.map((w) => ({ ...w, net: w.inflow - w.outflow }))
  const deficitWeeks = weeks.filter((w) => w.net < 0)

  const weekColumns = [
    { key: 'period', label: 'Period', width: 200 },
    { key: 'inflow', label: 'Projected inflow', width: 185, align: 'right', mono: true, render: (w) => money(w.inflow) },
    { key: 'outflow', label: 'Projected outflow', width: 190, align: 'right', mono: true, render: (w) => money(w.outflow) },
    {
      key: 'net', label: 'Net position', width: 185, align: 'right', mono: true,
      render: (w) => (
        <span style={{ color: w.net < 0 ? 'var(--danger)' : 'var(--success)' }}>
          {w.net < 0 ? '−' : '+'}{money(Math.abs(w.net))}
        </span>
      ),
    },
    {
      key: 'flag', label: '', width: 150, sortable: false,
      render: (w) => (w.net < 0 ? <Badge tone="danger">Outflow exceeds inflow</Badge> : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    { key: 'confidence', label: 'Confidence', width: 160, render: (w) => <ConfidenceMeter value={w.confidence} compact /> },
  ]

  const recurringColumns = [
    { key: 'label', label: 'Recurring commitment', width: 250 },
    { key: 'due', label: 'Falls due', width: 190 },
    { key: 'amount', label: 'Amount', width: 180, align: 'right', mono: true, render: (r) => money(r.amount) },
    { key: 'source', label: 'Source', width: 280 },
  ]

  const title = leaf?.label || 'Cash Flow Forecasting'
  const doExport = useTableExport({
    columns: weekColumns,
    rows: weeks,
    totals: {
      period: 'Total',
      inflow: money(weeks.reduce((n, w) => n + w.inflow, 0)),
      outflow: money(weeks.reduce((n, w) => n + w.outflow, 0)),
      net: money(weeks.reduce((n, w) => n + w.net, 0)),
    },
    title,
    emptyHint: 'There is no projection to export yet.',
  })

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Cash Flow Forecasting'}
        icon={leaf?.icon}
        description="Projects the cash position ahead using historical inflow and outflow patterns, seasonal sales trends and scheduled recurring expenses, so shortfalls can be anticipated rather than discovered."
        meta={<ForecastBadge>Projection</ForecastBadge>}
        actions={
          <>
            <Button variant="secondary" iconLeft="banknote-arrow-up">Open Cash Inflow/Outflow</Button>
            <ExportButton onExport={doExport} />
          </>
        }
      />

      <FilterBar
        fields={[
          { key: 'scope', label: 'Scope', type: 'select', options: [{ value: 'company', label: 'Consolidated — whole company' }, ...showrooms] },
          { key: 'horizon', label: 'Forecast horizon', type: 'select', options: HORIZONS.map((x) => ({ value: String(x.value), label: x.label })) },
          { key: 'from', label: 'From', type: 'date' },
        ]}
        onGenerate={() => {}}
        onReset={() => {}}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Horizon</span>
        <Segmented options={HORIZONS.map((x) => ({ value: x.value, label: x.label }))} value={days} onChange={setDays} size="sm" />
      </div>

      <StatRow
        stats={[
          { label: 'Opening position', value: moneyShort(cashForecast.openingPosition), hint: 'Actual, 23 Aug 2026' },
          { label: `Projected inflow · ${days}d`, value: moneyShort(h.inflow) },
          { label: `Projected outflow · ${days}d`, value: moneyShort(h.outflow), tone: 'negative' },
          { label: 'Projected net', value: `${net < 0 ? '−' : '+'}${moneyShort(Math.abs(net))}`, tone: shortfall ? 'negative' : 'positive', hint: `${h.confidence}% confidence` },
        ]}
      />

      {shortfall && (
        <Callout tone="danger" icon="triangle-alert" title={`Outflow is projected to exceed inflow over the next ${days} days`}>
          The projection shows a shortfall of {money(Math.abs(net))} at {h.confidence}% confidence, with a likely
          range between {money(Math.abs(h.high))} and {money(Math.abs(h.low))}. Funding or deferral decisions should
          be taken against the range, not the midpoint.
        </Callout>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20, alignItems: 'start' }} className="zq-formlayout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Panel title="Week by week" description="Projected movement across the forecast window. Weeks where outflow exceeds inflow are flagged." padding={0}>
            <ReportTable
              columns={weekColumns}
              rows={weeks}
              rowKey={(w) => w.period}
              totals={{
                period: 'Total',
                inflow: money(weeks.reduce((n, w) => n + w.inflow, 0)),
                outflow: money(weeks.reduce((n, w) => n + w.outflow, 0)),
                net: money(weeks.reduce((n, w) => n + w.net, 0)),
              }}
              stickyHeader={false}
              style={{ border: 'none', borderRadius: 0 }}
            />
          </Panel>

          <Panel title="Recurring commitments included" description="Known scheduled expenses folded into the projection." padding={0}>
            <ReportTable
              columns={recurringColumns}
              rows={cashForecast.recurring}
              rowKey={(r) => r.label}
              totals={{ label: 'Total', amount: money(cashForecast.recurring.reduce((n, r) => n + r.amount, 0)) }}
              stickyHeader={false}
              style={{ border: 'none', borderRadius: 0 }}
            />
          </Panel>

          <div style={{ padding: '0 2px' }}>
            <SourceCite sources={['Cash Inflow/Outflow Statement', 'Expenses/Payment List Guide', 'Sales Report']} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title={`Confidence range · ${days} days`}>
            <ConfidenceMeter value={h.confidence} />
            <div style={{ marginTop: 16 }}>
              <MetaRow label="Optimistic case" value={`${h.high < 0 ? '−' : '+'}${money(Math.abs(h.high))}`} mono tone={h.high < 0 ? 'negative' : 'positive'} />
              <MetaRow label="Midpoint" value={`${net < 0 ? '−' : '+'}${money(Math.abs(net))}`} mono tone={net < 0 ? 'negative' : 'positive'} />
              <MetaRow label="Pessimistic case" value={`${h.low < 0 ? '−' : '+'}${money(Math.abs(h.low))}`} mono tone={h.low < 0 ? 'negative' : 'positive'} />
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Icon name="info" size={13} color="var(--text-subtle)" style={{ marginTop: 2 }} />
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
                A forecast is never a single number here. Confidence falls as the horizon lengthens — the 90-day
                view is materially less certain than the 7-day one.
              </span>
            </div>
          </Panel>

          {deficitWeeks.length > 0 && (
            <Panel title="Weeks needing attention">
              {deficitWeeks.map((w) => (
                <div key={w.period} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{w.period}</div>
                  <div style={{ font: 'var(--fw-bold) var(--text-sm)/1.4 var(--font-mono)', color: 'var(--danger)', marginTop: 3 }}>
                    −{money(Math.abs(w.net))}
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                    {w.confidence}% confidence · {money(w.outflow)} out against {money(w.inflow)} in
                  </div>
                </div>
              ))}
            </Panel>
          )}

          <Panel title="Access">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Forecast data is restricted to Accounts and Management, matching the permissions on the underlying
              Cash Inflow/Outflow Statement. It never surfaces a figure a recipient could not see manually.
            </div>
          </Panel>
        </div>
      </div>

      <HumanReviewNotice action="act on a projection">
        This is a projection, not a guaranteed outcome, and it moves no money. Funding, disbursement and deferral
        decisions are taken by Accounts and Management in the relevant module.
      </HumanReviewNotice>
    </Page>
  )
}
