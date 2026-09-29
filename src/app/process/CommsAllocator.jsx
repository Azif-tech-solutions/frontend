import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { Panel, Callout } from '../shells/Page.jsx'
import { commissionGuide, commissionSales, commissionRuns } from '../sampleProcess.js'
import { fmt, money, moneyShort } from '../utils.js'

const VIEWS = [
  { value: 'dealer', label: 'By dealer' },
  { value: 'line', label: 'By product line' },
]

const RATES = Object.fromEntries(commissionGuide.map((c) => [c.code, c]))
const perUnit = (c) => (c.rateType === 'Percentage' ? (c.price * c.rate) / 100 : c.rate)

/** Sales joined to their rate. Inactive products earn nothing. */
const allocations = commissionSales.map((s) => {
  const rate = RATES[s.code]
  const eligible = rate && rate.status === 'Active'
  const unitRate = eligible ? perUnit(rate) : 0
  return {
    ...s,
    product: rate?.product || s.code,
    rateType: rate?.rateType || '—',
    unitRate,
    commission: unitRate * s.qty,
    eligible,
  }
})

export default function CommsAllocator({ leaf, moduleLabel, parentLabel }) {
  const [view, setView] = useState('dealer')

  const byDealer = Object.values(
    allocations.reduce((acc, a) => {
      acc[a.dealer] ||= { dealer: a.dealer, products: 0, qty: 0, commission: 0 }
      acc[a.dealer].products += 1
      acc[a.dealer].qty += a.qty
      acc[a.dealer].commission += a.commission
      return acc
    }, {})
  ).sort((a, b) => b.commission - a.commission)

  const total = allocations.reduce((n, a) => n + a.commission, 0)
  const totalQty = allocations.reduce((n, a) => n + a.qty, 0)
  const ineligible = allocations.filter((a) => !a.eligible)

  const dealerColumns = [
    { key: 'dealer', label: 'Dealer', width: 260 },
    { key: 'products', label: 'Products sold', width: 150, align: 'right', mono: true, render: (r) => fmt(r.products) },
    { key: 'qty', label: 'Units sold', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'commission', label: 'Commission earned', width: 200, align: 'right', mono: true, render: (r) => money(r.commission) },
    {
      key: 'share', label: 'Share of run', width: 140, align: 'right', mono: true,
      render: (r) => `${((r.commission / total) * 100).toFixed(1)}%`,
    },
  ]

  const lineColumns = [
    { key: 'dealer', label: 'Dealer', width: 230 },
    { key: 'code', label: 'Code', width: 100, mono: true },
    { key: 'product', label: 'Product', width: 220 },
    { key: 'qty', label: 'Units sold', width: 135, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'rateType', label: 'Rate type', width: 140 },
    { key: 'unitRate', label: 'Rate per unit', width: 155, align: 'right', mono: true, render: (r) => money(r.unitRate) },
    {
      key: 'commission', label: 'Commission', width: 175, align: 'right', mono: true,
      render: (r) => (r.eligible ? money(r.commission) : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'eligible', label: 'Eligible', width: 130,
      render: (r) => <Badge tone={r.eligible ? 'success' : 'neutral'}>{r.eligible ? 'Yes' : 'No rate'}</Badge>,
    },
  ]

  const isDealer = view === 'dealer'

  const title = leaf?.label || 'Comms Allocator'
  const doExport = useTableExport({
    columns: isDealer ? dealerColumns : lineColumns,
    rows: isDealer ? byDealer : allocations,
    title,
    emptyHint: 'Run an allocation before exporting.',
  })

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Comms Allocator'}
      icon={leaf?.icon}
      description="Compute and distribute commission to dealers using the rates set in the Comms. Guide, applied to what each dealer actually sold in the period."
      headerActions={
        <>
          <ExportButton onExport={doExport} />
          <Button iconLeft="play">Run allocation</Button>
        </>
      }
      filters={[
        { key: 'period', label: 'Commission period', type: 'select', options: [{ value: 'aug', label: 'August 2026' }, { value: 'jul', label: 'July 2026' }, { value: 'jun', label: 'June 2026' }] },
        { key: 'dealer', label: 'Dealer', type: 'select', options: byDealer.map((d) => ({ value: d.dealer, label: d.dealer })) },
        { key: 'from', label: 'Period from', type: 'date' },
        { key: 'to', label: 'Period to', type: 'date' },
      ]}
      generateLabel="Recalculate"
      stats={[
        { label: 'Dealers in run', value: String(byDealer.length) },
        { label: 'Units sold', value: fmt(totalQty) },
        { label: 'Commission payable', value: moneyShort(total) },
        { label: 'Top earner', value: byDealer[0].dealer.split(' ')[0], hint: moneyShort(byDealer[0].commission) },
      ]}
      columns={isDealer ? dealerColumns : lineColumns}
      rows={isDealer ? byDealer : allocations}
      totals={isDealer
        ? { dealer: 'Total', qty: fmt(totalQty), commission: money(total) }
        : { dealer: 'Total', qty: fmt(totalQty), commission: money(total) }}
      tableTitle={isDealer ? 'Commission by dealer' : 'Commission by product line'}
      tableActions={<Segmented options={VIEWS} value={view} onChange={setView} size="sm" />}
      emptyTitle="No commission to allocate"
      emptyDescription="No qualifying sales were recorded for the selected period."
      footnote="Commission is quantity sold multiplied by the rate in force for that product. Products without an active rate in the Comms. Guide earn nothing and are shown as ineligible."
    >
      {ineligible.length > 0 && (
        <Callout tone="warning" icon="triangle-alert" title={`${ineligible.length} sales line${ineligible.length === 1 ? '' : 's'} earned no commission`}>
          {ineligible.map((a) => a.product).join(', ')} — no active rate exists in the Comms. Guide, so these
          sales are excluded from the run. Set a rate before allocating if they should qualify.
        </Callout>
      )}

      <Panel title="Previous runs" description="Commission allocations already computed and paid.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {commissionRuns.map((r) => (
            <div key={r.ref} style={{ padding: '14px 16px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--text-strong)' }}>{r.period}</span>
                <Badge tone="success">{r.status}</Badge>
              </div>
              <div style={{ marginTop: 10, font: 'var(--fw-bold) var(--text-lg)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(r.total)}
              </div>
              <div style={{ marginTop: 8, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                {r.ref} · {r.dealers} dealers · run {r.runOn} by {r.runBy}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </ReportShell>
  )
}
