import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { LineItems } from '../shells/LineItems.jsx'
import { incomingConsignments, receivedConsignments, CURRENT_SHOWROOM } from '../sampleShowroom.js'
import { fmt } from '../utils.js'

export default function ReceiveProduct({ leaf, moduleLabel, parentLabel }) {
  const [selected, setSelected] = useState(incomingConsignments[0].waybill)
  const consignment = incomingConsignments.find((c) => c.waybill === selected)

  const [rows, setRows] = useState(
    consignment.lines.map((l) => ({ id: l.batch, ...l, accepted: String(l.sent), rejected: '' }))
  )

  function pick(waybill) {
    const c = incomingConsignments.find((x) => x.waybill === waybill)
    setSelected(waybill)
    setRows(c.lines.map((l) => ({ id: l.batch, ...l, accepted: String(l.sent), rejected: '' })))
  }

  function update(i, key, value) {
    setRows((rs) => rs.map((r, ri) => (ri === i ? { ...r, [key]: value } : r)))
  }

  const decorated = rows.map((r) => {
    const acc = Number(r.accepted) || 0
    const rej = Number(r.rejected) || 0
    return { ...r, sentDisplay: fmt(r.sent), variance: acc + rej - r.sent }
  })

  // Accepted plus rejected must reconcile to what was dispatched.
  const errors = decorated.map((r) =>
    r.variance !== 0
      ? {
          field: 'accepted',
          message: r.variance > 0
            ? `Accepted plus rejected exceeds the ${fmt(r.sent)} dispatched by ${fmt(r.variance)}.`
            : `${fmt(-r.variance)} of the ${fmt(r.sent)} dispatched is unaccounted for — record it as accepted or rejected.`,
        }
      : null
  )

  const columns = [
    { key: 'product', label: 'Product', type: 'static', width: 260 },
    { key: 'batch', label: 'Batch', type: 'static', width: 120 },
    { key: 'sentDisplay', label: 'Qty dispatched', type: 'static', align: 'right', width: 140 },
    { key: 'accepted', label: 'Qty accepted', type: 'number', width: 140, placeholder: '0' },
    { key: 'rejected', label: 'Qty rejected', type: 'number', width: 140, placeholder: '0' },
    { key: 'unit', label: 'Unit', type: 'static', width: 110 },
    { key: 'note', label: 'Rejection note', type: 'text', width: 240, placeholder: 'Reason if rejecting' },
  ]

  const totalAccepted = decorated.reduce((n, r) => n + (Number(r.accepted) || 0), 0)
  const totalRejected = decorated.reduce((n, r) => n + (Number(r.rejected) || 0), 0)
  const blocked = errors.some(Boolean)

  const historyColumns = [
    { key: 'waybill', label: 'Waybill', width: 120, mono: true },
    { key: 'origin', label: 'Origin', width: 200 },
    {
      key: 'originType', label: 'Type', width: 120,
      render: (r) => <Badge tone={r.originType === 'Factory' ? 'brand' : 'neutral'}>{r.originType}</Badge>,
    },
    { key: 'product', label: 'Product', width: 240 },
    { key: 'dispatched', label: 'Dispatched', width: 130 },
    { key: 'received', label: 'Received', width: 130 },
    { key: 'sent', label: 'Sent', width: 100, align: 'right', mono: true, render: (r) => fmt(r.sent) },
    { key: 'accepted', label: 'Accepted', width: 110, align: 'right', mono: true, render: (r) => fmt(r.accepted) },
    {
      key: 'rejected', label: 'Rejected', width: 110, align: 'right', mono: true,
      render: (r) => (r.rejected ? <span style={{ color: 'var(--danger)' }}>{fmt(r.rejected)}</span> : '—'),
    },
    { key: 'receivedBy', label: 'Received by', width: 140 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Receive Product'}
      icon={leaf?.icon}
      description="Confirm and record products arriving at this showroom, whether supplied from a factory or transferred from another showroom. Check the goods against the waybill before confirming."
      submitLabel="Confirm receipt"
      onCancel={() => {}}
      note="Stock is added to this showroom only once receipt is confirmed. Rejected quantities are returned against the waybill and do not enter stock."
      aside={
        <>
          <Panel title="Consignment">
            <MetaRow label="Waybill" value={consignment.waybill} mono />
            <MetaRow label="Origin" value={consignment.origin} />
            <MetaRow label="Driver" value={consignment.driver} />
            <MetaRow label="Vehicle" value={consignment.vehicle} mono />
            <MetaRow label="Dispatched" value={consignment.dispatched} />
            <MetaRow label="Accepting into" value={CURRENT_SHOWROOM} />
          </Panel>

          <Panel title="Receipt summary">
            <MetaRow label="Lines" value={rows.length} mono />
            <MetaRow label="Total accepted" value={fmt(totalAccepted)} mono tone="positive" />
            <MetaRow label="Total rejected" value={totalRejected ? fmt(totalRejected) : '—'} mono tone={totalRejected ? 'negative' : undefined} />
            {blocked && (
              <Callout tone="danger" icon="circle-alert" title="Quantities do not reconcile" style={{ marginTop: 14 }}>
                Accepted plus rejected must equal the quantity dispatched on every line before receipt can be confirmed.
              </Callout>
            )}
            {!blocked && totalRejected > 0 && (
              <Callout tone="warning" icon="triangle-alert" style={{ marginTop: 14 }}>
                {fmt(totalRejected)} unit{totalRejected === 1 ? '' : 's'} will be recorded as rejected against
                waybill {consignment.waybill} and raised with the dispatching location.
              </Callout>
            )}
          </Panel>
        </>
      }
    >
      <Panel title="Awaiting receipt" description="Consignments dispatched to this showroom that have not yet been confirmed.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {incomingConsignments.map((c) => {
            const on = c.waybill === selected
            return (
              <div
                key={c.waybill}
                onClick={() => pick(c.waybill)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
                  background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                  border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                }}
              >
                <Icon name={c.originType === 'Factory' ? 'factory' : 'store'} size={16} color={on ? 'var(--brand)' : 'var(--text-subtle)'} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)', color: 'var(--text-strong)' }}>{c.waybill}</span>
                    <Badge tone="warning">{c.status}</Badge>
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>
                    {c.origin} · {c.driver} · {c.dispatched}
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                    {c.lines.length} line{c.lines.length === 1 ? '' : 's'} · {fmt(c.lines.reduce((n, l) => n + l.sent, 0))} units
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel
        title={`Goods on waybill ${consignment.waybill}`}
        description="Count the goods against the waybill. Record anything damaged or short as rejected."
        actions={<Button variant="secondary" size="sm" iconLeft="qr-code">Scan</Button>}
      >
        <FieldSet columns={3}>
          <Input label="Date received" type="date" />
          <Input label="Received by" value="F. Adeniyi" onChange={() => {}} />
          <Input label="Receipt reference" placeholder="Auto-generated" disabled value="RC-2205" />
        </FieldSet>
        <div style={{ marginTop: 16 }}>
          <LineItems
            columns={columns}
            rows={decorated}
            errors={errors}
            onChange={update}
            summary={[
              { label: 'Accepted', value: fmt(totalAccepted) },
              { label: 'Rejected', value: fmt(totalRejected) },
            ]}
          />
        </div>
      </Panel>

      <Panel title="Recently received" description="Consignments already confirmed into this showroom." padding={0}>
        <ReportTable
          columns={historyColumns}
          rows={receivedConsignments}
          rowKey={(r) => r.waybill}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>
    </FormShell>
  )
}
