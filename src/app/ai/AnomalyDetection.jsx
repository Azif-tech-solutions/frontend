import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { Page, Panel, StatRow, MetaRow, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { ConfidenceMeter, SourceCite } from './aiParts.jsx'
import { anomalies } from '../sampleAI.js'

const TABS = [
  { value: 'Awaiting review', label: 'Awaiting review', icon: 'hourglass' },
  { value: 'Under investigation', label: 'Under investigation', icon: 'search' },
  { value: 'resolved', label: 'Confirmed & dismissed', icon: 'circle-check-big' },
]

const SEVERITY_TONE = { High: 'danger', Medium: 'warning', Low: 'neutral' }

/** The queue is rendered as cards, so the export defines its own flat shape. */
const EXPORT_COLUMNS = [
  { key: 'ref', label: 'Reference' },
  { key: 'detected', label: 'Detected' },
  { key: 'severity', label: 'Severity' },
  { key: 'category', label: 'Category' },
  { key: 'subject', label: 'Subject' },
  { key: 'role', label: 'Role' },
  { key: 'location', label: 'Location' },
  { key: 'confidence', label: 'Signal strength (%)' },
  { key: 'status', label: 'Status' },
  { key: 'evidence', label: 'Traced to', render: (a) => (a.evidence || []).join(' / ') },
  { key: 'detail', label: 'Detail' },
]

export default function AnomalyDetection({ leaf, moduleLabel, parentLabel }) {
  const [tab, setTab] = useState('Awaiting review')

  const rows = tab === 'resolved'
    ? anomalies.filter((a) => a.status.startsWith('Dismissed') || a.status.startsWith('Confirmed'))
    : anomalies.filter((a) => a.status === tab)

  const awaiting = anomalies.filter((a) => a.status === 'Awaiting review')
  const dismissed = anomalies.filter((a) => a.status.startsWith('Dismissed'))
  const confirmed = anomalies.filter((a) => a.status.startsWith('Confirmed'))
  const high = anomalies.filter((a) => a.severity === 'High')

  const title = leaf?.label || 'Fraud/Anomaly Detection'
  const doExport = useTableExport({ columns: EXPORT_COLUMNS, rows, title, emptyHint: 'There is nothing in this queue to export.' })

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Fraud/Anomaly Detection'}
        icon={leaf?.icon}
        description="Continuously analyses cashier transactions, wallet withdrawals and stock adjustments for patterns that deviate from a user's or location's normal activity, and queues them for Management review. The manual Violations/Fraud History lookup remains available and unchanged."
        actions={
          <>
            <Button variant="secondary" iconLeft="shield-alert">Open Violations History</Button>
            <ExportButton label="Export queue" onExport={doExport} />
          </>
        }
      />

      <Callout tone="warning" icon="user-round-check" title="Flags are for review, never for action">
        Nothing here suspends an account, reverses a transaction or penalises anyone. A flag is a statistical
        observation routed to a human — the outcome is decided by Management, and dismissals are logged for audit.
      </Callout>

      <StatRow
        stats={[
          { label: 'Awaiting review', value: String(awaiting.length), tone: awaiting.length ? 'warning' : undefined },
          { label: 'High severity', value: String(high.length), tone: high.length ? 'negative' : undefined },
          { label: 'Confirmed', value: String(confirmed.length), hint: 'Referred to audit' },
          { label: 'Dismissed as false positive', value: String(dismissed.length), hint: 'Logged for audit' },
        ]}
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <Select options={[{ value: 'all', label: 'All severities' }, { value: 'high', label: 'High' }, { value: 'med', label: 'Medium' }, { value: 'low', label: 'Low' }]} placeholder="All severities" style={{ width: 190 }} />
        <Select options={[{ value: 'all', label: 'All categories' }, { value: 'wallet', label: 'Wallet withdrawals' }, { value: 'discount', label: 'Discounts' }, { value: 'adjustment', label: 'Stock adjustments' }]} placeholder="All categories" style={{ width: 210 }} />
        <Select options={[{ value: 'all', label: 'All locations' }, { value: 'ikeja', label: 'Showroom Ikeja' }, { value: 'lekki', label: 'Showroom Lekki' }, { value: 'abuja', label: 'Showroom Abuja' }]} placeholder="All locations" style={{ width: 190 }} />
      </div>

      {rows.length === 0 ? (
        <Panel padding={0}>
          <EmptyState
            icon="shield-check"
            title="Nothing in this queue"
            description={tab === 'Awaiting review' ? 'No unusual activity has been flagged for review.' : 'No items in this state.'}
          />
        </Panel>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rows.map((a) => (
            <Panel key={a.ref} padding={0}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px' }}>
                <span style={{
                  display: 'grid', placeItems: 'center', width: 34, height: 34, flex: '0 0 auto', borderRadius: 'var(--radius-md)',
                  background: a.severity === 'High' ? 'var(--danger-bg)' : a.severity === 'Medium' ? 'var(--warning-bg)' : 'var(--surface-sunken)',
                }}>
                  <Icon
                    name={a.severity === 'High' ? 'octagon-alert' : 'triangle-alert'}
                    size={16}
                    color={a.severity === 'High' ? '#8A1C21' : a.severity === 'Medium' ? 'var(--accent-amber-fg)' : 'var(--text-subtle)'}
                  />
                </span>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--fw-bold) var(--text-md)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{a.category}</span>
                    <Badge tone={SEVERITY_TONE[a.severity]}>{a.severity}</Badge>
                    <Badge tone="neutral" uppercase>{a.ref}</Badge>
                  </div>

                  <div style={{ font: 'var(--fw-regular) var(--text-sm)/1.6 var(--font-ui)', color: 'var(--text-body)', marginTop: 8, maxWidth: '82ch' }}>
                    {a.detail}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
                    <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                      <Icon name="user-round" size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                      {a.subject} · {a.role} · {a.location}
                    </span>
                    <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
                      <Icon name="clock" size={12} style={{ verticalAlign: -2, marginRight: 4 }} />
                      {a.detected}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Signal strength</span>
                      <ConfidenceMeter value={a.confidence} compact />
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
                    <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>Traced to:</span>
                    {a.evidence.map((e) => (
                      <span key={e} style={{
                        height: 22, padding: '0 8px', display: 'inline-flex', alignItems: 'center',
                        background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-mono)', color: 'var(--text-body)',
                      }}>{e}</span>
                    ))}
                  </div>

                  {a.dismissedReason && (
                    <Callout tone="neutral" icon="circle-check" title={`Dismissed by ${a.dismissedBy}`} style={{ marginTop: 12 }}>
                      {a.dismissedReason} Logged for audit — a genuinely repeated pattern will still be flagged again.
                    </Callout>
                  )}
                  {a.confirmedBy && (
                    <Callout tone="danger" icon="octagon-alert" title={`Confirmed by ${a.confirmedBy}`} style={{ marginTop: 12 }}>
                      Referred to internal audit and recorded in Violations/Fraud History.
                    </Callout>
                  )}
                </div>

                <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                  {a.status === 'Awaiting review' || a.status === 'Under investigation' ? (
                    <>
                      <Button size="sm" iconLeft="search">Investigate</Button>
                      <Button size="sm" variant="secondary">Confirm</Button>
                      <Button size="sm" variant="secondary">Dismiss</Button>
                    </>
                  ) : (
                    <Badge tone={a.status.startsWith('Confirmed') ? 'danger' : 'neutral'}>{a.status}</Badge>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Panel title="How flags are raised">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 32px' }}>
          <div>
            <MetaRow label="Cashier transactions" value="Discount and void patterns" />
            <MetaRow label="Wallet withdrawals" value="Timing and amount outliers" />
            <MetaRow label="Stock adjustments" value="Frequency and value outliers" />
          </div>
          <div>
            <MetaRow label="Baseline" value="Per user and per location" />
            <MetaRow label="Automated action" value="None — review only" />
            <MetaRow label="Queue access" value="Management / Admin" />
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <SourceCite sources={['Tenderable', 'Wallet Withdrawal History', 'Adjustments — General Report', 'Instant Discount']} />
        </div>
      </Panel>
    </Page>
  )
}
