import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { stockGroups } from '../sample.js'
import { commissionGuide } from '../sampleProcess.js'
import { money } from '../utils.js'

const RATE_TYPES = [
  { value: 'unit', label: 'Per unit' },
  { value: 'percentage', label: 'Percentage of price' },
]

/** A per-unit rate is a Naira amount; a percentage rate applies to selling price. */
const effectiveRate = (r) => (r.rateType === 'Percentage' ? (r.price * r.rate) / 100 : r.rate)

const columns = [
  { key: 'code', label: 'Code', width: 100, mono: true },
  { key: 'product', label: 'Finished product', width: 230 },
  { key: 'group', label: 'Group', width: 150 },
  { key: 'price', label: 'Selling price', width: 155, align: 'right', mono: true, render: (r) => money(r.price) },
  {
    key: 'rateType', label: 'Rate type', width: 150,
    render: (r) => <Badge tone={r.rateType === 'Percentage' ? 'info' : 'neutral'}>{r.rateType}</Badge>,
  },
  {
    key: 'rate', label: 'Rate', width: 130, align: 'right', mono: true,
    render: (r) => (r.rateType === 'Percentage' ? `${r.rate.toFixed(1)}%` : money(r.rate)),
  },
  { key: 'effectiveRate', label: 'Commission per unit', width: 190, align: 'right', mono: true, render: (r) => money(effectiveRate(r)) },
  { key: 'effective', label: 'Effective from', width: 150 },
  {
    key: 'status', label: 'Status', width: 110,
    render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'}>{r.status}</Badge>,
  },
]

function RateForm({ crumbs, onBack }) {
  const [rateType, setRateType] = useState('unit')
  const [rate, setRate] = useState('')
  const [price, setPrice] = useState('2400')
  const [active, setActive] = useState(true)

  const isPct = rateType === 'percentage'
  const perUnit = isPct ? ((Number(price) || 0) * (Number(rate) || 0)) / 100 : Number(rate) || 0

  return (
    <FormShell
      crumbs={crumbs}
      title="Set commission rate"
      icon="book-open"
      description="Assign a commission rate to a finished product. Rates defined here drive the monthly commission computed for every authorised dealer."
      headerActions={<Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>Back to guide</Button>}
      submitLabel="Save rate"
      onCancel={onBack}
      note="Rates apply from their effective date. Changing a rate does not alter commissions already allocated for earlier periods."
      aside={
        <>
          <Panel title="Rate preview">
            <MetaRow label="Rate type" value={isPct ? 'Percentage of price' : 'Per unit'} />
            <MetaRow label="Selling price" value={money(Number(price) || 0)} mono />
            <MetaRow label="Rate entered" value={rate ? (isPct ? `${rate}%` : money(Number(rate))) : '—'} mono />
            <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Commission per unit</div>
              <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
                {money(perUnit)}
              </div>
            </div>
            {perUnit > 0 && (
              <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                A dealer selling 1,000 units would earn <strong style={{ color: 'var(--text-strong)' }}>{money(perUnit * 1000)}</strong> on this product.
              </div>
            )}
          </Panel>

          <Callout tone="info" icon="calculator">
            Per-unit rates hold steady as prices move. Percentage rates track the selling price, so commission
            rises automatically after a price increase.
          </Callout>
        </>
      }
    >
      <Panel title="Product & rate">
        <FieldSet columns={2}>
          <Select label="Finished product" options={commissionGuide.map((c) => ({ value: c.code, label: `${c.code} · ${c.product}` }))} placeholder="Select product…" />
          <Select label="Group" options={stockGroups} placeholder="Select group…" />
          <Input label="Selling price (₦)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <Select label="Rate type" options={RATE_TYPES} value={rateType} onChange={(e) => setRateType(e.target.value)} />
          <Input
            label={isPct ? 'Rate (%)' : 'Rate per unit (₦)'}
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder={isPct ? '2.0' : '45.00'}
          />
          <Input label="Effective from" type="date" />
        </FieldSet>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Switch checked={active} onChange={setActive} />
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Active</div>
            <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
              Inactive products earn no commission in the next allocation run.
            </div>
          </div>
        </div>
      </Panel>
    </FormShell>
  )
}

export default function CommsGuide({ leaf, moduleLabel, parentLabel }) {
  const [mode, setMode] = useState('list')
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  if (mode === 'create') return <RateForm crumbs={crumbs} onBack={() => setMode('list')} />

  const rows = commissionGuide.map((r) => ({ ...r, effectiveRate: effectiveRate(r) }))
  const active = rows.filter((r) => r.status === 'Active')

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Comms. Guide'}
      icon={leaf?.icon}
      description="Define the commission rate attached to each finished product. These rates are what the Comms Allocator uses to compute what every authorised dealer has earned each month."
      createLabel="Set rate"
      onCreate={() => setMode('create')}
      searchPlaceholder="Search by product code or name…"
      filters={
        <>
          <Select options={stockGroups} placeholder="All groups" style={{ width: 180 }} />
          <Select options={RATE_TYPES} placeholder="All rate types" style={{ width: 190 }} />
        </>
      }
      stats={[
        { label: 'Products rated', value: String(rows.length) },
        { label: 'Active rates', value: String(active.length) },
        { label: 'Per-unit rates', value: String(rows.filter((r) => r.rateType === 'Per unit').length) },
        { label: 'Average per unit', value: money(active.reduce((n, r) => n + r.effectiveRate, 0) / active.length) },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle="No commission rates set"
      emptyDescription="Set a rate against a product to include it in monthly commission runs."
      footnote="Commission per unit is the resolved Naira amount a dealer earns on one unit sold — the entered rate for per-unit products, or the rate applied to selling price for percentage products."
    />
  )
}
