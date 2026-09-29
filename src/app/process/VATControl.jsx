import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { Panel, Callout } from '../shells/Page.jsx'
import { vatSettings } from '../sampleProcess.js'

export default function VATControl({ leaf, moduleLabel, parentLabel }) {
  const [settings, setSettings] = useState(
    Object.fromEntries(vatSettings.map((v) => [v.code, { rate: String(v.rate), enabled: v.enabled }]))
  )

  const update = (code, patch) =>
    setSettings((s) => ({ ...s, [code]: { ...s[code], ...patch } }))

  const rows = vatSettings.map((v) => ({ ...v, ...settings[v.code] }))
  const enabled = rows.filter((r) => r.enabled)
  const rates = new Set(enabled.map((r) => r.rate))

  const columns = [
    { key: 'code', label: 'Branch code', width: 130, mono: true },
    { key: 'showroom', label: 'Showroom', width: 230 },
    { key: 'registration', label: 'VAT registration', width: 190, mono: true },
    {
      key: 'rate', label: 'VAT rate', width: 130, align: 'right', mono: true,
      render: (r) => (r.enabled ? `${Number(r.rate).toFixed(1)}%` : <span style={{ color: 'var(--text-subtle)' }}>—</span>),
    },
    {
      key: 'enabled', label: 'VAT collection', width: 160,
      render: (r) => <Badge tone={r.enabled ? 'success' : 'neutral'}>{r.enabled ? 'Enabled' : 'Disabled'}</Badge>,
    },
    { key: 'effective', label: 'Effective from', width: 150 },
    { key: 'updatedBy', label: 'Last updated by', width: 170 },
  ]

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'VAT Control'}
      icon={leaf?.icon}
      description="Manage VAT settings for each showroom — set the applicable rate, and enable or disable collection where business or regulatory requirements call for it."
      headerActions={<Button iconLeft="save">Save VAT settings</Button>}
      searchPlaceholder="Search by showroom or branch code…"
      stats={[
        { label: 'Showrooms configured', value: String(rows.length) },
        { label: 'VAT enabled', value: String(enabled.length) },
        { label: 'VAT disabled', value: String(rows.length - enabled.length), tone: rows.length - enabled.length ? 'warning' : undefined },
        { label: 'Distinct rates', value: String(rates.size), hint: rates.size === 1 ? 'Uniform across branches' : 'Varies by branch' },
      ]}
      columns={columns}
      rows={rows}
      emptyTitle="No showrooms configured"
      emptyDescription="Register a showroom before configuring its VAT settings."
      footnote="VAT is calculated and applied at the rate configured here for the relevant showroom. A showroom with collection disabled charges no output VAT and reports zero on its VAT report."
    >
      <Panel title="Configure by showroom" description="Set the rate and switch collection on or off for each branch.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {vatSettings.map((v) => {
            const s = settings[v.code]
            return (
              <div
                key={v.code}
                style={{
                  padding: '16px 18px', background: 'var(--surface-card)',
                  border: `1px solid ${s.enabled ? 'var(--border-default)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)', opacity: s.enabled ? 1 : 0.75,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ font: 'var(--fw-bold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{v.showroom}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 3 }}>
                      {v.code} · {v.registration}
                    </div>
                  </div>
                  <Switch checked={s.enabled} onChange={(on) => update(v.code, { enabled: on })} />
                </div>

                <Input
                  label="VAT rate (%)"
                  type="number"
                  value={s.rate}
                  onChange={(e) => update(v.code, { rate: e.target.value })}
                  disabled={!s.enabled}
                  suffix="%"
                  hint={s.enabled ? `Applied to every sale at ${v.showroom}.` : 'Collection is switched off for this branch.'}
                />

                <div style={{ marginTop: 12 }}>
                  <Badge tone={s.enabled ? 'success' : 'neutral'}>
                    {s.enabled ? `Collecting at ${Number(s.rate || 0).toFixed(1)}%` : 'Not collecting'}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      {rows.length - enabled.length > 0 && (
        <Callout tone="warning" icon="percent" title={`${rows.length - enabled.length} showroom has VAT collection disabled`}>
          {rows.filter((r) => !r.enabled).map((r) => r.showroom).join(', ')} will charge no output VAT on sales.
          Confirm this matches the branch's regulatory position before trading begins.
        </Callout>
      )}
    </RegisterShell>
  )
}
