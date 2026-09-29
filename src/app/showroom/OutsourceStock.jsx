import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { showrooms, outsourcedProducts, outsourcePartners, outsourceReceipts, CURRENT_SHOWROOM } from '../sampleShowroom.js'
import { fmt, money } from '../utils.js'

const COSTS = Object.fromEntries(outsourcedProducts.map((p) => [p.value, p.unitCost]))

const blank = () => ({ id: Math.random().toString(36).slice(2), product: '', qty: '', batch: '', expiry: '' })

export default function OutsourceStock({ leaf, moduleLabel, parentLabel }) {
  const [rows, setRows] = useState([blank()])

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const unitCost = COSTS[r.product]
    const total = unitCost ? unitCost * (Number(r.qty) || 0) : undefined
    return {
      ...r,
      unit: r.product ? 'Cartons' : undefined,
      unitCost: unitCost ? money(unitCost) : undefined,
      lineTotal: total ? money(total) : undefined,
    }
  })

  const columns = [
    // A select, not free text — only company-registered outsourced products.
    { key: 'product', label: 'Registered outsourced product', type: 'select', options: outsourcedProducts, width: 300, placeholder: 'Select registered product…' },
    { key: 'qty', label: 'Quantity', type: 'number', width: 130, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'batch', label: 'Batch no.', type: 'text', width: 140, placeholder: 'e.g. AQ-2214' },
    { key: 'expiry', label: 'Expiry date', type: 'date', width: 160 },
    { key: 'unitCost', label: 'Unit cost', type: 'static', align: 'right', width: 150 },
    { key: 'lineTotal', label: 'Line total', type: 'static', align: 'right', width: 160 },
  ]

  const active = rows.filter((r) => r.product)
  const value = rows.reduce((n, r) => n + (COSTS[r.product] || 0) * (Number(r.qty) || 0), 0)
  const missingExpiry = rows.some((r) => r.product && !r.expiry)

  const historyColumns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'product', label: 'Outsourced product', width: 260 },
    { key: 'partner', label: 'Outsource partner', width: 210 },
    { key: 'batch', label: 'Batch', width: 120, mono: true },
    { key: 'expiry', label: 'Expiry', width: 130 },
    { key: 'qty', label: 'Quantity', width: 120, align: 'right', mono: true, render: (r) => fmt(r.qty) },
    { key: 'unitCost', label: 'Unit cost', width: 150, align: 'right', mono: true, render: (r) => money(r.unitCost) },
    { key: 'receivedBy', label: 'Received by', width: 140 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Outsource Stock'}
      icon={leaf?.icon}
      description="Receive outsourced stock — products not manufactured by the company but formally registered by it. Only registered outsourced products can be received here."
      submitLabel="Receive outsourced stock"
      onCancel={() => {}}
      note="Outsourced products are company-registered, so they carry a product code and are selectable across every dependent module."
      secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
      aside={
        <>
          <Panel title="Receipt summary">
            <MetaRow label="Product lines" value={active.length || '—'} mono />
            <MetaRow label="Total value" value={value ? money(value) : '—'} mono />
            <MetaRow label="Receiving into" value={CURRENT_SHOWROOM} />
            {missingExpiry && (
              <Callout tone="warning" icon="calendar-off" style={{ marginTop: 14 }}>
                One or more lines are missing an expiry date. Shelf-life alerts will not fire for those products.
              </Callout>
            )}
          </Panel>

          <Panel title="Outsource vs finished product">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-strong)' }}>Outsource</strong> means a product the company sells
              but does not manufacture. <strong style={{ color: 'var(--text-strong)' }}>Finished product</strong> means
              one produced internally. Both are registered; only their origin differs.
            </div>
            <div style={{ marginTop: 12 }}>
              <Callout tone="info" icon="circle-alert">
                For third-party goods the company has <strong>not</strong> registered, use Stock Entry (Direct) instead.
              </Callout>
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Partner & delivery" description="Which outsource partner supplied the goods and against which document.">
        <FieldSet columns={3}>
          <Select label="Receiving showroom" options={showrooms} value="sr-ikeja" onChange={() => {}} />
          <Select label="Outsource partner" options={outsourcePartners} placeholder="Select partner…" />
          <Input label="Date received" type="date" />
          <Input label="Partner invoice / waybill" placeholder="e.g. AQ-2214" />
          <Input label="Checked by" placeholder="Showroom staff" />
          <Input label="Reference no." placeholder="Auto-generated" disabled value="OS-1145" />
        </FieldSet>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="brand">Company-registered products only</Badge>
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {outsourcedProducts.length} outsourced products are currently registered.
          </span>
        </div>
      </Panel>

      <Panel
        title="Outsourced products received"
        description="Select each product from the registered outsourced catalogue. Unregistered goods cannot be received here."
        actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
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

      <Panel title="Recent outsource receipts" padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={outsourceReceipts}
          rowKey={(r) => r.ref}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
