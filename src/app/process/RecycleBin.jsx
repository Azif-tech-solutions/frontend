import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Callout } from '../shells/Page.jsx'
import { deletedItems, suspendedProducts } from '../sampleProcess.js'
import { fmt, money, moneyShort } from '../utils.js'

// The PRD gives this module two jobs: recover deleted products, and suspend
// products from sale without deleting them.
const TABS = [
  { value: 'deleted', label: 'Deleted items', icon: 'trash-2' },
  { value: 'suspended', label: 'Suspended from sale', icon: 'circle-pause' },
]

export default function RecycleBin({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('deleted')
  const isDeleted = tab === 'deleted'

  const deletedRows = deletedItems.map((d) => ({ ...d, value: d.qty * d.unitCost }))
  const suspendedRows = suspendedProducts.map((s) => ({ ...s, value: s.qty * s.unitCost }))
  const rows = isDeleted ? deletedRows : suspendedRows

  const deletedColumns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'product', label: 'Product', width: 280 },
    { key: 'qty', label: 'Quantity held', width: 150, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'value', label: 'Value held', width: 175, align: 'right', mono: true, render: (r) => money(r.value) },
    { key: 'reason', label: 'Reason deleted', width: 240 },
    { key: 'deletedBy', label: 'Deleted by', width: 160 },
    { key: 'deleted', label: 'Deleted on', width: 140 },
    { key: 'retention', label: 'Held until', width: 140 },
    {
      key: 'action', label: 'Action', width: 200, sortable: false,
      render: () => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" iconLeft="undo-2">Restore</Button>
          <Button size="sm" variant="secondary">Purge</Button>
        </div>
      ),
    },
  ]

  const suspendedColumns = [
    { key: 'code', label: 'Code', width: 110, mono: true },
    { key: 'product', label: 'Product', width: 250 },
    { key: 'qty', label: 'Stock held', width: 140, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'price', label: 'Selling price', width: 150, align: 'right', mono: true, render: (r) => money(r.price) },
    { key: 'value', label: 'Value held', width: 175, align: 'right', mono: true, render: (r) => money(r.value) },
    { key: 'reason', label: 'Reason suspended', width: 320 },
    { key: 'suspended', label: 'Suspended on', width: 150 },
    { key: 'review', label: 'Review on', width: 140 },
    {
      key: 'action', label: 'Action', width: 175, sortable: false,
      render: () => (
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" iconLeft="play">Resume</Button>
          <Button size="sm" variant="secondary">Reprice</Button>
        </div>
      ),
    },
  ]

  const heldValue = rows.reduce((n, r) => n + r.value, 0)

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Recycle Bin'}
      icon={leaf?.icon}
      description="Temporary storage for deleted products along with their quantities and values, so they can be reviewed or recovered. Also used to suspend a product from sale without removing it."
      tabs={TABS}
      tab={tab}
      onTabChange={setTab}
      searchPlaceholder={isDeleted ? 'Search deleted products…' : 'Search suspended products…'}
      stats={isDeleted
        ? [
            { label: 'Items deleted', value: String(deletedRows.length) },
            { label: 'Quantity held', value: fmt(deletedRows.reduce((n, r) => n + r.qty, 0)) },
            { label: 'Value recoverable', value: moneyShort(heldValue) },
            { label: 'Oldest deletion', value: '08 Aug', hint: 'Purges 07 Sep' },
          ]
        : [
            { label: 'Products suspended', value: String(suspendedRows.length) },
            { label: 'Stock held back', value: fmt(suspendedRows.reduce((n, r) => n + r.qty, 0)) },
            { label: 'Value held back', value: moneyShort(heldValue) },
            { label: 'Next review', value: '30 Aug', hint: 'Cocoa Wafer 40g' },
          ]}
      columns={isDeleted ? deletedColumns : suspendedColumns}
      rows={rows}
      totals={{ code: 'Total', qty: fmt(rows.reduce((n, r) => n + r.qty, 0)), value: money(heldValue) }}
      emptyTitle={isDeleted ? 'Recycle bin is empty' : 'No products suspended'}
      emptyDescription={isDeleted
        ? 'Deleted products appear here and can be restored until their retention date passes.'
        : 'Suspend a product to hold it back from sale while keeping its stock and records intact.'}
      footnote={isDeleted
        ? 'Deleted products retain their quantity and value while held. Restoring returns the product and its stock to circulation; purging removes it permanently and cannot be undone.'
        : 'Suspended products keep their stock and history but cannot be sold. Use this while monitoring market conditions or when exchange-rate movement makes current pricing unprofitable.'}
    >
      {!isDeleted && suspendedRows.length > 0 && (
        <Callout tone="info" icon="circle-pause" title={`${moneyShort(heldValue)} of stock is held back from sale`}>
          Suspension keeps a product off the point of sale without deleting it — useful while watching demand, or
          when exchange-rate movement means current prices no longer cover landing cost. Resume or reprice at review.
        </Callout>
      )}
    </RegisterShell>
  )
}
