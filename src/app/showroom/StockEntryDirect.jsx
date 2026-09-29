import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { showrooms, externalSuppliers, directEntries, CURRENT_SHOWROOM } from '../sampleShowroom.js'
import { fmt, money } from '../utils.js'

const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', unit: '', unitCost: '', price: '' })

export default function StockEntryDirect({ leaf, moduleLabel, parentLabel }) {
  const [rows, setRows] = useState([blank()])

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const total = (Number(r.qty) || 0) * (Number(r.unitCost) || 0)
    return { ...r, lineTotal: total ? money(total) : undefined }
  })

  const columns = [
    // Free text, not a select — these products are not in the company catalogue.
    { key: 'product', label: 'Product description', type: 'text', width: 280, placeholder: 'e.g. Chivita 100% Orange 1L' },
    { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'select', options: [{ value: 'ctn', label: 'Cartons' }, { value: 'pcs', label: 'Pieces' }, { value: 'pack', label: 'Packs' }], width: 130, placeholder: 'Unit…' },
    { key: 'unitCost', label: 'Unit cost (₦)', type: 'number', width: 150, placeholder: '0.00' },
    { key: 'price', label: 'Selling price (₦)', type: 'number', width: 160, placeholder: '0.00' },
    { key: 'lineTotal', label: 'Line total', type: 'static', align: 'right', width: 160 },
  ]

  const active = rows.filter((r) => r.product)
  const value = rows.reduce((n, r) => n + (Number(r.qty) || 0) * (Number(r.unitCost) || 0), 0)

  const historyColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'product', label: 'Product', width: 250 },
    { key: 'supplier', label: 'External supplier', width: 200 },
    { key: 'invoice', label: 'Supplier invoice', width: 150, mono: true },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unit', label: 'Unit', width: 110 },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'enteredBy', label: 'Entered by', width: 140 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Stock Entry (Direct)'}
      icon={leaf?.icon}
      description="Record products supplied directly by external bodies or third-party companies, entering them into showroom stock without passing through factory production or internal transfer."
      submitLabel="Enter into stock"
      onCancel={() => {}}
      note="Directly entered products are held against this showroom only and are not added to the company product register."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Entry summary">
            <MetaRow label="Product lines" value={active.length || '—'} mono />
            <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
            <MetaRow label="Entering into" value={CURRENT_SHOWROOM} />
          </Panel>

          <Callout tone="info" icon="circle-alert" title="Unregistered products">
            Products entered here are <strong>not</strong> company-registered. Use Outsource Stock instead when
            receiving an outsourced product the company has formally registered.
          </Callout>
        </>
      }
    >
      <Panel title="Supplier & document" description="Who supplied the goods and against which document.">
        <FieldSet columns={3}>
          <Select label="Receiving showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
          <Select label="External supplier" options={externalSuppliers} placeholder="Select supplier…" />
          <Input label="Date received" type="date" />
          <Input label="Supplier invoice no." placeholder="e.g. CHI-88214" />
          <Input label="Payment terms" placeholder="e.g. 30 days credit" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="DE-0334" />
        </FieldSet>
      </Panel>

      <Panel
        title="Products received"
        description="Type each product description directly — these items are not in the company catalogue and have no product code."
      >
        <LineItems
          columns={columns}
          rows={decorated}
          onChange={update}
          onAdd={() => setRows((rs) => [...rs, blank()])}
          onRemove={(i) => setRows((rs) => (rs.length === 1 ? rs : rs.filter((_, ri) => ri !== i)))}
          addLabel="Add product"
          emptyLabel="No products added yet."
          summary={[
            { label: 'Lines', value: active.length },
            { label: 'Value', value: money(value) },
          ]}
        />
      </Panel>

      <Panel title="Recent direct entries" padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={directEntries}
          rowKey={(r) => r.ref}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
