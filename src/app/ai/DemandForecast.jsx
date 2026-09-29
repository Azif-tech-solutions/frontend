import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { ConfidenceMeter, ForecastBadge, SourceCite, HumanReviewNotice } from './aiParts.jsx'
import { showrooms } from '../sampleShowroom.js'
import { finishedProducts } from '../sample.js'
import { demandForecasts } from '../sampleAI.js'
import { fmt } from '../utils.js'

const SCOPES = [
  { value: 'showroom', label: 'By showroom' },
  { value: 'company', label: 'Consolidated' },
]

export default function DemandForecast({ leaf, moduleLabel, parentLabel }) {
  const [scope, setScope] = useState('showroom')

  const forecastable = demandForecasts.filter((d) => d.forecast != null)
  const noHistory = demandForecasts.filter((d) => d.forecast == null)
  const atRisk = forecastable.filter((d) => d.forecast > d.stock)

  const rows = scope === 'showroom'
    ? demandForecasts
    : Object.values(
        forecastable.reduce((acc, d) => {
          acc[d.product] ||= { product: d.product, showroom: 'All showrooms', sold: 0, forecast: 0, stock: 0, trend: d.trend, seasonality: d.seasonality, confidence: 0, n: 0, history: d.history }
          acc[d.product].sold += d.sold
          acc[d.product].forecast += d.forecast
          acc[d.product].stock += d.stock
          acc[d.product].confidence += d.confidence
          acc[d.product].n += 1
          return acc
        }, {})
      ).map((d) => ({ ...d, confidence: Math.round(d.confidence / d.n) }))

  const columns = [
    { key: 'product', label: 'Product', width: 250 },
    ...(scope === 'showroom' ? [{ key: 'showroom', label: 'Showroom', width: 185 }] : []),
    { key: 'sold', label: 'Sold last period', width: 165, align: 'right', mono: true, render: (d) => fmt(d.sold) },
    {
      key: 'forecast', label: 'Forecast demand', width: 175, align: 'right', mono: true,
      render: (d) => (d.forecast == null
        ? <span style={{ color: 'var(--text-subtle)' }}>No history</span>
        : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end' }}>
            <ForecastBadge>{d.trend === 'rising' ? '↑' : d.trend === 'falling' ? '↓' : '→'}</ForecastBadge>
            {fmt(d.forecast)}
          </span>
        )),
    },
    { key: 'stock', label: 'Current stock', width: 155, align: 'right', mono: true, render: (d) => fmt(d.stock) },
    {
      key: 'gap', label: 'Cover', width: 165, align: 'right', mono: true,
      render: (d) => {
        if (d.forecast == null) return <span style={{ color: 'var(--text-subtle)' }}>—</span>
        const gap = d.stock - d.forecast
        return (
          <span style={{ color: gap < 0 ? 'var(--danger)' : 'var(--success)' }}>
            {gap < 0 ? `${fmt(Math.abs(gap))} short` : `${fmt(gap)} spare`}
          </span>
        )
      },
    },
    { key: 'seasonality', label: 'Seasonality', width: 190, render: (d) => d.seasonality || '—' },
    {
      key: 'confidence', label: 'Confidence', width: 160,
      render: (d) => (d.forecast == null
        ? <Badge tone="neutral">Not data-backed</Badge>
        : <ConfidenceMeter value={d.confidence} compact />),
    },
    {
      key: 'action', label: 'Action', width: 230, sortable: false,
      render: (d) => (d.forecast != null && d.forecast > d.stock
        ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button size="sm" variant="secondary" iconLeft="truck">Transfer</Button>
            <Button size="sm" variant="secondary" iconLeft="refresh-cw">Re-order</Button>
          </div>
        )
        : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Sales & Demand Forecasting'}
      icon={leaf?.icon}
      description="Forecasts expected demand per product per showroom from historical sales, seasonality and recorded promotional activity, so production scheduling and stock allocation can be aligned with what is actually expected to sell."
      headerActions={
        <>
          <Button variant="secondary" iconLeft="chart-column">Open Sales Report</Button>
          <Button variant="secondary" iconLeft="refresh-cw">Recompute</Button>
        </>
      }
      filters={[
        { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
        { key: 'product', label: 'Product', type: 'select', options: finishedProducts },
        { key: 'horizon', label: 'Forecast window', type: 'select', options: [{ value: '30', label: 'Next 30 days' }, { value: '60', label: 'Next 60 days' }, { value: '90', label: 'Next 90 days' }] },
        { key: 'risk', label: 'Stockout risk', type: 'select', options: [{ value: 'at-risk', label: 'At risk only' }, { value: 'all', label: 'All products' }] },
      ]}
      generateLabel="Refresh forecast"
      stats={[
        { label: 'Products forecast', value: String(forecastable.length) },
        { label: 'Forecast demand', value: fmt(forecastable.reduce((n, d) => n + d.forecast, 0)), hint: 'Units, next 30 days' },
        { label: 'At risk of stockout', value: String(atRisk.length), tone: atRisk.length ? 'negative' : undefined, delta: atRisk.length ? 'action needed' : undefined },
        { label: 'Cannot forecast', value: String(noHistory.length), tone: noHistory.length ? 'warning' : undefined, hint: noHistory.length ? 'No sales history' : undefined },
      ]}
      columns={columns}
      rows={rows}
      tableTitle={scope === 'showroom' ? 'Demand by product and showroom' : 'Demand consolidated across showrooms'}
      tableActions={<Segmented options={SCOPES} value={scope} onChange={setScope} size="sm" />}
      emptyTitle="No demand forecast available"
      emptyDescription="No product in scope has enough sales history to forecast against."
      footnote="Forecasts recompute on a schedule as new sales are recorded. They respect the same showroom-level access as the Sales Report they draw from."
    >
      <HumanReviewNotice action="raise a transfer or re-order">
        A forecast moves no stock. Where demand is projected to exceed cover, the Transfer and Re-order actions
        deep-link into those workflows for an authorised user to complete — nothing is initiated automatically.
      </HumanReviewNotice>

      {atRisk.length > 0 && (
        <Callout tone="danger" icon="triangle-alert" title={`${atRisk.length} products are forecast to run out within the window`}>
          {atRisk.map((d) => `${d.product.split(' · ')[1]} at ${d.showroom.replace('Showroom ', '')} (${fmt(d.forecast - d.stock)} short)`).join('; ')}.
          Each links directly into Stock Transfer and the Re-Order workflow.
        </Callout>
      )}

      {noHistory.length > 0 && (
        <Callout tone="neutral" icon="circle-help" title="Some products have no sales history">
          {noHistory.map((d) => d.product.split(' · ')[1]).join(', ')} have never sold. No forecast is shown for
          them — presenting one would imply a confidence the data cannot support.
        </Callout>
      )}

      <div style={{ padding: '0 2px' }}>
        <SourceCite sources={['Sales Report', 'Comprehensive Stock Report', 'Instant Discount']} />
      </div>
    </ReportShell>
  )
}
