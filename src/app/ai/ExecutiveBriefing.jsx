import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Switch } from '../../ds/components/forms/Switch.jsx'
import { Page, Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { SourceCite, HumanReviewNotice } from './aiParts.jsx'
import { briefings, briefingItems } from '../sampleAI.js'

const KIND_ICON = { Sales: 'chart-column', Cash: 'banknote-arrow-up', Stock: 'package', Risk: 'shield-alert', Receivables: 'file-warning' }
const TONE_COLOUR = {
  positive: { bg: 'var(--success-bg)', fg: 'var(--accent-green-fg)' },
  warning: { bg: 'var(--warning-bg)', fg: 'var(--accent-amber-fg)' },
  negative: { bg: 'var(--danger-bg)', fg: '#8A1C21' },
}

export default function ExecutiveBriefing({ leaf, moduleLabel, parentLabel }) {
  const [ref, setRef] = useState(briefings[0].ref)
  const [email, setEmail] = useState(true)
  const briefing = briefings.find((b) => b.ref === ref) || briefings[0]

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Executive Insights'}
        icon={leaf?.icon}
        description="A scheduled plain-language digest of what moved in sales, stock, cash and flagged risk over the period — surfacing what changed and why it may matter, rather than restating every figure."
        meta={
          <>
            <Badge tone="brand">{briefing.cadence}</Badge>
            <Badge tone="neutral">{briefing.period}</Badge>
            <Badge tone="neutral" uppercase>Generated {briefing.generated}</Badge>
          </>
        }
        actions={
          <>
            <Button variant="secondary" iconLeft="printer">Print</Button>
            <Button variant="secondary" iconLeft="send">Email to me</Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }} className="zq-formlayout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <Panel title={`Briefing — ${briefing.period}`} description="Six things worth knowing from the past week.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {briefingItems.map((item, i) => {
                const tone = TONE_COLOUR[item.tone] || TONE_COLOUR.warning
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: '15px 0', borderBottom: i < briefingItems.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <span style={{ display: 'grid', placeItems: 'center', width: 32, height: 32, flex: '0 0 auto', borderRadius: 'var(--radius-md)', background: tone.bg }}>
                      <Icon name={KIND_ICON[item.kind] || 'info'} size={15} color={tone.fg} />
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ font: 'var(--fw-bold) var(--text-md)/1.35 var(--font-ui)', color: 'var(--text-strong)' }}>{item.headline}</span>
                        <Badge tone="neutral" uppercase>{item.kind}</Badge>
                      </div>
                      <div style={{ font: 'var(--fw-regular) var(--text-sm)/1.65 var(--font-ui)', color: 'var(--text-body)', marginTop: 6, maxWidth: '84ch' }}>
                        {item.detail}
                      </div>
                      <div style={{ marginTop: 9 }}>
                        <SourceCite sources={item.sources} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>

          <HumanReviewNotice action="act on anything it raises">
            A briefing reports; it never acts. Nothing here orders stock, moves cash, chases a debtor or
            penalises anyone — each item links back to the report where an authorised user can decide what to do.
          </HumanReviewNotice>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Briefing history" description="Retained as an auditable record.">
            {briefings.map((b) => {
              const on = b.ref === ref
              return (
                <div
                  key={b.ref}
                  onClick={() => setRef(b.ref)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 12px', cursor: 'pointer',
                    background: on ? 'var(--brand-subtle)' : 'transparent',
                    border: `1px solid ${on ? 'var(--brand-border)' : 'transparent'}`,
                    borderRadius: 'var(--radius-md)', marginBottom: 4,
                  }}
                >
                  <Icon name="newspaper" size={15} color={on ? 'var(--brand)' : 'var(--text-subtle)'} style={{ marginTop: 2 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{b.period}</div>
                    <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 2 }}>
                      {b.ref} · {b.items} items{b.flags ? ` · ${b.flags} flags` : ''}
                    </div>
                  </div>
                  {b.status === 'Current' && <Badge tone="success">Current</Badge>}
                </div>
              )
            })}
          </Panel>

          <Panel title="Delivery">
            <MetaRow label="Cadence" value={briefing.cadence} />
            <MetaRow label="Delivered" value="In-app notification" />
            <MetaRow label="Next briefing" value="31 Aug 2026, 06:00" />
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch checked={email} onChange={setEmail} />
              <div>
                <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Also send by email</div>
                <div style={{ font: 'var(--fw-regular) var(--text-xs)/1.4 var(--font-ui)', color: 'var(--text-muted)', marginTop: 2 }}>
                  In-app delivery is always on.
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="What to include" description="Choose the metrics and thresholds surfaced in your briefing.">
            <Select label="Cadence" options={[{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' }]} value="weekly" onChange={() => {}} />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Sales performance', 'Stock position and re-order', 'Cash flow projection', 'Anomaly flags', 'Overdue receivables'].map((m) => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Switch checked onChange={() => {}} />
                  <span style={{ font: 'var(--type-ui)', color: 'var(--text-body)' }}>{m}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Callout tone="info" icon="lock" title="Scoped to the recipient">
            A briefing never shows a figure the recipient could not see in the source report. A showroom manager's
            briefing covers their showroom; landing cost appears only for Management and Administration.
          </Callout>
        </div>
      </div>
    </Page>
  )
}
