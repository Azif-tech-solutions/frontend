import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { productErrors } from '../sampleProcess.js'
import { fmt } from '../utils.js'

export default function ErrorHandler({ leaf, moduleLabel, parentLabel }) {
  const [selectedId, setSelectedId] = useState(productErrors[0].id)
  const [corrected, setCorrected] = useState({})

  const item = productErrors.find((e) => e.id === selectedId) || productErrors[0]
  const value = corrected[item.id] ?? item.suggested
  const changed = value !== item.current

  const columns = [
    { key: 'id', label: 'Flag', width: 100, mono: true },
    { key: 'code', label: 'Product code', width: 130, mono: true },
    { key: 'field', label: 'Field', width: 150 },
    { key: 'current', label: 'Current value', width: 300, render: (e) => <span style={{ color: 'var(--danger)' }}>{e.current}</span> },
    { key: 'suggested', label: 'Suggested correction', width: 300, render: (e) => <span style={{ color: 'var(--success)' }}>{e.suggested}</span> },
    { key: 'usedIn', label: 'Records affected', width: 160, align: 'right', mono: true, render: (e) => fmt(e.usedIn) },
    {
      key: 'severity', label: 'Type', width: 120,
      render: (e) => <Badge tone={e.severity === 'Spelling' ? 'warning' : 'info'}>{e.severity}</Badge>,
    },
    { key: 'flaggedBy', label: 'Flagged by', width: 180 },
    { key: 'flagged', label: 'Flagged on', width: 140 },
  ]

  return (
    <FormShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Error Handler'}
      icon={leaf?.icon}
      description="Review and correct errors in product information — most often spelling mistakes in names, descriptions and units — so reports, transactions and stock records all carry the right detail."
      submitLabel="Apply correction"
      onCancel={() => {}}
      note="Correcting a value updates the product record everywhere it appears. Historic transactions keep their reference but display the corrected description."
      aside={
        <>
          <Panel title="Correction">
            <MetaRow label="Flag" value={item.id} mono />
            <MetaRow label="Product" value={item.code} mono />
            <MetaRow label="Field" value={item.field} />
            <MetaRow label="Records affected" value={fmt(item.usedIn)} mono />
            <MetaRow label="Flagged by" value={item.flaggedBy} />
            {changed && (
              <Callout tone="warning" icon="triangle-alert" title={`${fmt(item.usedIn)} records will update`} style={{ marginTop: 14 }}>
                This value appears across stock cards, transactions and reports. All of them will show the
                corrected text once applied.
              </Callout>
            )}
          </Panel>

          <Panel title="Outstanding flags">
            <MetaRow label="Total flagged" value={productErrors.length} mono />
            <MetaRow label="Spelling" value={productErrors.filter((e) => e.severity === 'Spelling').length} mono />
            <MetaRow label="Naming" value={productErrors.filter((e) => e.severity === 'Naming').length} mono />
            <MetaRow label="Records affected" value={fmt(productErrors.reduce((n, e) => n + e.usedIn, 0))} mono />
          </Panel>
        </>
      }
    >
      <Panel title="Flagged entries" description="Product records containing suspected errors. Select one to correct it.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
          {productErrors.map((e) => {
            const on = e.id === selectedId
            return (
              <div
                key={e.id}
                onClick={() => setSelectedId(e.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', cursor: 'pointer',
                  background: on ? 'var(--brand-subtle)' : 'var(--surface-card)',
                  border: `1px solid ${on ? 'var(--brand-border)' : 'var(--border-default)'}`,
                  borderRadius: 'var(--radius-md)', transition: 'var(--transition-control)',
                }}
              >
                <Icon name="spell-check" size={16} color={on ? 'var(--brand)' : 'var(--text-subtle)'} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)', color: 'var(--text-strong)' }}>{e.code}</span>
                    <Badge tone={e.severity === 'Spelling' ? 'warning' : 'info'}>{e.severity}</Badge>
                  </div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--danger)', marginTop: 4, textDecoration: 'line-through' }}>{e.current}</div>
                  <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                    {e.field} · {fmt(e.usedIn)} records
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Correct the value" description="The suggested correction is pre-filled. Amend it if the suggestion is not right.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: '14px 16px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: '#8A1C21' }}>Current value</div>
            <div style={{ marginTop: 8, font: 'var(--fw-semibold) var(--text-md)/1.4 var(--font-ui)', color: '#8A1C21' }}>{item.current}</div>
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--accent-green-fg)' }}>Corrected value</div>
            <div style={{ marginTop: 8, font: 'var(--fw-semibold) var(--text-md)/1.4 var(--font-ui)', color: 'var(--accent-green-fg)' }}>{value}</div>
          </div>
        </div>

        <FieldSet columns={2}>
          <Input label="Field being corrected" value={item.field} onChange={() => {}} disabled />
          <Input
            label="Corrected value"
            value={value}
            onChange={(e) => setCorrected((s) => ({ ...s, [item.id]: e.target.value }))}
            hint="Applies everywhere this product appears."
          />
        </FieldSet>
      </Panel>

      <Panel title="All flagged entries" padding={0}>
        <ReportTable
          columns={columns}
          rows={productErrors}
          rowKey={(e) => e.id}
          onRowClick={(e) => setSelectedId(e.id)}
          stickyHeader={false}
          style={{ border: 'none', borderRadius: 0 }}
        />
      </Panel>

      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>
        Corrections here keep product records clean so reports, transactions and stock cards all reflect accurate
        product information. Flags raised by the system spell check can be dismissed if the spelling is intentional.
      </div>
    </FormShell>
  )
}
