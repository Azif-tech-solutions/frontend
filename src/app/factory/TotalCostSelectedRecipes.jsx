import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Checkbox } from '../../ds/components/forms/Checkbox.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, Callout } from '../shells/Page.jsx'
import { factories, recipeCostPool } from '../sample.js'
import { fmt, money, moneyShort } from '../utils.js'

export default function TotalCostSelectedRecipes({ leaf, moduleLabel, parentLabel }) {
  const [selected, setSelected] = useState(['rm-01', 'rm-03', 'rc-01'])

  const toggle = (key) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]))
  const allOn = selected.length === recipeCostPool.length

  const rows = recipeCostPool
    .filter((m) => selected.includes(m.key))
    .map((m) => ({ ...m, usageCost: m.qtyUsed * m.unitCost, landingValue: m.qtyOnHand * m.unitCost }))

  const usageTotal = rows.reduce((n, r) => n + r.usageCost, 0)
  const landingTotal = rows.reduce((n, r) => n + r.landingValue, 0)

  const columns = [
    { key: 'name', label: 'Raw material / recipe', width: 250 },
    { key: 'unit', label: 'Unit', width: 110 },
    { key: 'qtyUsed', label: 'Qty used', width: 130, align: 'right', mono: true, render: (r) => fmt(r.qtyUsed) },
    { key: 'unitCost', label: 'Unit landing cost', width: 165, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'usageCost', label: 'Usage cost', width: 175, align: 'right', mono: true, render: (r) => money(r.usageCost) },
    { key: 'qtyOnHand', label: 'Qty on hand', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qtyOnHand) },
    { key: 'landingValue', label: 'Landing value on hand', width: 200, align: 'right', mono: true, render: (r) => money(r.landingValue) },
  ]

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Total Cost for Selected Recipes'}
      icon={leaf?.icon}
      description="Select multiple raw materials or recipes and compute their combined landing and usage cost over a date range, to evaluate production feasibility before final approval."
      filters={[
        { key: 'factory', label: 'Factory', type: 'select', options: factories },
        { key: 'from', label: 'Date from', type: 'date' },
        { key: 'to', label: 'Date to', type: 'date' },
      ]}
      generateLabel="Recalculate"
      stats={[
        { label: 'Materials selected', value: `${selected.length}/${recipeCostPool.length}` },
        { label: 'Combined usage cost', value: moneyShort(usageTotal) },
        { label: 'Landing value on hand', value: moneyShort(landingTotal) },
        { label: 'Combined total', value: moneyShort(usageTotal + landingTotal) },
      ]}
      columns={columns}
      rows={rows}
      totals={{ name: 'Total', usageCost: money(usageTotal), landingValue: money(landingTotal) }}
      tableTitle="Selected materials"
      emptyTitle="No materials selected"
      emptyDescription="Tick at least one material above to compute a combined cost."
      footnote="Usage cost reflects quantity consumed within the selected date range. Landing value reflects the cost of stock currently on hand."
    >
      <Panel
        title="Select materials"
        description="Tick every raw material or recipe to include in the calculation."
        actions={
          <Button
            variant="secondary"
            size="sm"
            iconLeft={allOn ? 'square' : 'check-check'}
            onClick={() => setSelected(allOn ? [] : recipeCostPool.map((m) => m.key))}
          >
            {allOn ? 'Clear all' : 'Select all'}
          </Button>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {recipeCostPool.map((m) => {
            const on = selected.includes(m.key)
            return (
              <div
                key={m.key}
                onClick={() => toggle(m.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', cursor: 'pointer',
                  background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                  border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                }}
              >
                <Checkbox checked={on} onChange={() => toggle(m.key)} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>
                    {fmt(m.qtyUsed)} {m.unit.toLowerCase()} used · {money(m.unitCost)}/unit
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {rows.some((r) => r.qtyOnHand < r.qtyUsed) && (
        <Callout tone="warning" icon="triangle-alert" title="Consumption exceeds stock on hand">
          One or more selected materials were consumed faster than the quantity currently held. Confirm
          replenishment before approving a production run that depends on them.
        </Callout>
      )}
    </ReportShell>
  )
}
