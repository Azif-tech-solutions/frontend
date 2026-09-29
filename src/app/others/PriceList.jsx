import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { stockGroups } from '../sample.js'
import { priceList } from '../sampleOthers.js'
import { money, moneyShort } from '../utils.js'

export default function PriceList({ leaf, moduleLabel, parentLabel }) {
  const rows = priceList.map((p) => ({
    ...p,
    margin: p.price - p.cost,
    marginPct: ((p.price - p.cost) / p.price) * 100,
    dealerMargin: p.dealerPrice - p.cost,
  }))

  const avgMargin = rows.reduce((n, r) => n + r.marginPct, 0) / rows.length
  const thin = rows.filter((r) => r.marginPct < 25)

  const columns = [
    { key: 'code', label: 'Code', width: 100, mono: true },
    { key: 'product', label: 'Product', width: 230 },
    { key: 'group', label: 'Group', width: 150 },
    { key: 'unit', label: 'Unit', width: 110 },
    { key: 'price', label: 'Retail price', width: 160, align: 'right', mono: true, render: (r) => money(r.price) },
    { key: 'dealerPrice', label: 'Dealer price', width: 160, align: 'right', mono: true, render: (r) => money(r.dealerPrice) },
    { key: 'cost', label: 'Landing cost', width: 160, align: 'right', mono: true, render: (r) => money(r.cost) },
    { key: 'margin', label: 'Retail margin', width: 165, align: 'right', mono: true, render: (r) => money(r.margin) },
    {
      key: 'marginPct', label: 'Margin %', width: 130, align: 'right', mono: true,
      render: (r) => (
        <span style={{ color: r.marginPct < 25 ? 'var(--warning)' : 'var(--text-strong)' }}>
          {r.marginPct.toFixed(1)}%
        </span>
      ),
    },
    { key: 'effective', label: 'Effective from', width: 150 },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Price List'}
      icon={leaf?.icon}
      description="Estimated selling prices across the catalogue, with the dealer price and the margin each product carries over its landing cost."
      headerActions={<Button variant="secondary" iconLeft="printer">Print price list</Button>}
      searchPlaceholder="Search by product code or name…"
      filters={<Select options={stockGroups} placeholder="All groups" style={{ width: 190 }} />}
      stats={[
        { label: 'Products priced', value: String(rows.length) },
        { label: 'Average margin', value: `${avgMargin.toFixed(1)}%` },
        { label: 'Thin margin', value: String(thin.length), tone: thin.length ? 'warning' : undefined, hint: 'Below 25%' },
        { label: 'Catalogue value', value: moneyShort(rows.reduce((n, r) => n + r.price, 0)), hint: 'Sum of unit prices' },
      ]}
      columns={columns}
      rows={rows}
      onRowClick={() => {}}
      emptyTitle="No products priced"
      emptyDescription="Set a selling price against a product to include it in the price list."
      footnote="Prices shown are estimates and hold until superseded. Landing cost and margin columns are visible only to Administrators and Management; a dealer price applies automatically to authorised dealers at the point of sale."
    />
  )
}
