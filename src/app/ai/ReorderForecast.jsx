import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { ConfidenceMeter, ForecastBadge, SourceCite, HumanReviewNotice } from './aiParts.jsx'
import { factories, suppliers } from '../sample.js'
import { reorderForecasts } from '../sampleAI.js'
import { fmt } from '../utils.js'

const TREND_ICON = { rising: 'trending-up', falling: 'trending-down', steady: 'minus' }

export default function ReorderForecast({ leaf, moduleLabel, parentLabel }) {
  const rows = reorderForecasts
  const forecastable = rows.filter((r) => r.confidence >= 55)
  const insufficient = rows.filter((r) => r.confidence < 55)
  const dueNow = forecastable.filter((r) => r.daysToThreshold === 0)
  const spikes = rows.filter((r) => r.spike)
  const orderValue = forecastable.reduce((n, r) => n + (r.suggested || 0), 0)

  const columns = [
    { key: 'item', label: 'Material / recipe', width: 250 },
    { key: 'onHand', label: 'On hand', width: 120, align: 'right', mono: true, render: (r) => fmt(r.onHand) },
    { key: 'reorderLevel', label: 'Threshold', width: 120, align: 'right', mono: true, render: (r) => fmt(r.reorderLevel) },
    {
      key: 'dailyUse', label: 'Consumption / day', width: 175, align: 'right', mono: true,
      render: (r) => (r.dailyUse == null
        ? <span style={{ color: 'var(--text-subtle)' }}>—</span>
        : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
            <Icon name={TREND_ICON[r.trend]} size={12} color={r.trend === 'rising' ? 'var(--danger)' : r.trend === 'falling' ? 'var(--success)' : 'var(--text-subtle)'} />
            {r.dailyUse.toFixed(1)}
          </span>
        )),
    },
    {
      key: 'forecastDate', label: 'Forecast threshold date', width: 200,
      render: (r) => (r.forecastDate
        ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <ForecastBadge>{r.daysToThreshold === 0 ? 'Reached' : `${r.daysToThreshold}d`}</ForecastBadge>
            <span>{r.forecastDate}</span>
          </span>
        )
        : <span style={{ color: 'var(--text-subtle)' }}>Cannot forecast</span>),
    },
    {
      key: 'suggested', label: 'Suggested order', width: 155, align: 'right', mono: true,
      render: (r) => (r.suggested == null
        ? <span style={{ color: 'var(--text-subtle)' }}>—</span>
        : r.suggested === 0 ? <span style={{ color: 'var(--text-subtle)' }}>None needed</span> : fmt(r.suggested)),
    },
    { key: 'leadTime', label: 'Lead time', width: 120, align: 'right', mono: true, render: (r) => `${r.leadTime} d` },
    {
      key: 'confidence', label: 'Confidence', width: 160,
      render: (r) => <ConfidenceMeter value={r.confidence} compact />,
    },
    {
      key: 'action', label: 'Action', width: 260, sortable: false,
      render: (r) => (r.suggested
        ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <Button size="sm" iconLeft="check">Accept</Button>
            <Button size="sm" variant="secondary">Adjust</Button>
            <Button size="sm" variant="secondary">Dismiss</Button>
          </div>
        )
        : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Smart Re-Order Forecasting'}
      icon={leaf?.icon}
      description="Projects when each item will reach its re-order point using actual consumption trend rather than a fixed threshold, and suggests an order quantity adjusted for lead time. The static Re-Order Report remains available alongside it."
      headerActions={
        <>
          <Button variant="secondary" iconLeft="clipboard-list">Open static Re-Order Report</Button>
          <Button variant="secondary" iconLeft="refresh-cw">Recompute</Button>
        </>
      }
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'supplier', label: 'Supplier', type: 'select', options: suppliers },
        { key: 'confidence', label: 'Confidence', type: 'select', options: [{ value: 'high', label: 'High only' }, { value: 'med', label: 'Medium and above' }, { value: 'all', label: 'All' }] },
        { key: 'horizon', label: 'Forecast horizon', type: 'select', options: [{ value: '30', label: 'Next 30 days' }, { value: '60', label: 'Next 60 days' }, { value: '90', label: 'Next 90 days' }] },
      ]}
      generateLabel="Refresh forecast"
      stats={[
        { label: 'At threshold now', value: String(dueNow.length), tone: dueNow.length ? 'negative' : undefined, delta: dueNow.length ? 'order today' : undefined },
        { label: 'Forecast to reach it', value: String(forecastable.length - dueNow.length), hint: 'Within 90 days' },
        { label: 'Suggested order volume', value: fmt(orderValue), hint: 'Units across all items' },
        { label: 'Consumption spikes', value: String(spikes.length), tone: spikes.length ? 'warning' : undefined, hint: spikes.length ? 'Flagged for review' : undefined },
      ]}
      columns={columns}
      rows={rows}
      tableTitle="Forecast by item"
      emptyTitle="No items to forecast"
      emptyDescription="Nothing tracked has enough consumption history to project against."
      footnote="Forecasts are projections, not guaranteed stock behaviour. They recompute daily as new stock movement is recorded, and a suggestion can always be adjusted or dismissed without blocking a manual re-order."
    >
      <HumanReviewNotice action="accept, adjust or dismiss each suggestion">
        Suggested orders are proposals only. Nothing is purchased and no stock changes until an authorised user
        accepts a suggestion and raises the order — and the static Re-Order Report stays fully available for
        comparison and override.
      </HumanReviewNotice>

      {spikes.length > 0 && (
        <Callout tone="warning" icon="trending-up" title={`${spikes.length} item shows an abnormal consumption spike`}>
          {spikes.map((s) => s.item.split(' · ')[1]).join(', ')} — consumption is running well above its trend.
          Worth confirming the usage is genuine before ordering to the suggested quantity.
        </Callout>
      )}

      {insufficient.length > 0 && (
        <Callout tone="neutral" icon="triangle-alert" title="Some items cannot be forecast yet">
          {insufficient.map((i) => `${i.item.split(' · ')[1]} (${i.history} days of history)`).join(', ')} —
          under 30 days of stock movement. These fall back to their static re-order threshold rather than showing
          a prediction that would not be reliable.
        </Callout>
      )}

      <div style={{ padding: '0 2px' }}>
        <SourceCite sources={['Stock Movement Report', 'Bin Card', 'Re-Order Report']} />
      </div>
    </ReportShell>
  )
}
