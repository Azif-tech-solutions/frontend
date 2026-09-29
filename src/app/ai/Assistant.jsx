import { useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import { Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { ConfidenceMeter } from './aiParts.jsx'
import { assistantThread, assistantSuggestions } from '../sampleAI.js'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
]

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{
        maxWidth: '72%', padding: '10px 14px', background: 'var(--brand)', color: 'var(--brand-on)',
        borderRadius: 'var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)',
        font: 'var(--fw-regular) var(--text-sm)/1.55 var(--font-ui)',
      }}>
        {text}
      </div>
    </div>
  )
}

function AssistantBubble({ msg }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <span style={{
        display: 'grid', placeItems: 'center', width: 28, height: 28, flex: '0 0 auto', marginTop: 2,
        borderRadius: 'var(--radius-md)', background: 'var(--accent-violet-bg)',
      }}>
        <Icon name="sparkles" size={14} color="var(--accent-violet-fg)" />
      </span>

      <div style={{ maxWidth: '78%', minWidth: 0 }}>
        <div style={{
          padding: '12px 15px', background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xs) var(--radius-lg) var(--radius-lg) var(--radius-lg)',
        }}>
          <div style={{ font: 'var(--fw-regular) var(--text-sm)/1.6 var(--font-ui)', color: 'var(--text-body)' }}>
            {msg.text}
          </div>

          {msg.calculation && (
            <div style={{
              marginTop: 10, padding: '8px 11px', background: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-sm)', font: 'var(--fw-medium) var(--text-xs)/1.5 var(--font-mono)',
              color: 'var(--text-muted)',
            }}>
              {msg.calculation}
            </div>
          )}

          {msg.refused && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
              <Icon name="shield-check" size={13} color="var(--accent-amber-fg)" />
              <span style={{ font: 'var(--type-caption)', color: 'var(--accent-amber-fg)' }}>
                The assistant retrieves and calculates only — it cannot move stock or money.
              </span>
            </div>
          )}

          {msg.deepLink && (
            <div style={{ marginTop: 10 }}>
              <Button size="sm" variant="secondary" iconRight="arrow-right">Open {msg.deepLink}</Button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 7, paddingLeft: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Icon name="link" size={11} color="var(--text-subtle)" />
            {msg.sources.map((s) => (
              <span key={s} style={{
                height: 20, padding: '0 7px', display: 'inline-flex', alignItems: 'center',
                background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)', font: 'var(--fw-medium) var(--text-2xs)/1 var(--font-ui)', color: 'var(--text-muted)',
              }}>{s}</span>
            ))}
          </span>
          <ConfidenceMeter value={msg.confidence} compact />
        </div>
      </div>
    </div>
  )
}

export default function Assistant({ leaf, moduleLabel, parentLabel }) {
  const [lang, setLang] = useState('en')
  const [draft, setDraft] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '24px var(--gutter) 0', maxWidth: 1560, margin: '0 auto', width: '100%' }}>
        <PageHeader
          crumbs={[moduleLabel, parentLabel]}
          title={leaf?.label || 'ZifIQ Assistant'}
          icon={leaf?.icon}
          description="Ask about stock, sales, financial, dealer and production data in plain language, and get answers and calculations drawn from the reports you already have access to."
          actions={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Segmented options={LANGUAGES} value={lang} onChange={setLang} size="sm" />
              <Button variant="secondary" iconLeft="history">Conversation log</Button>
            </div>
          }
        />
      </div>

      <div
        className="zq-formlayout"
        style={{
          flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20,
          padding: '20px var(--gutter) 24px', maxWidth: 1560, margin: '0 auto', width: '100%',
        }}
      >
        <div style={{
          display: 'flex', flexDirection: 'column', minHeight: 0,
          background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden',
        }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--surface-sunken)' }}>
            {assistantThread.map((m, i) => (
              m.from === 'user' ? <UserBubble key={i} text={m.text} /> : <AssistantBubble key={i} msg={m} />
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', padding: 14 }}>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
              {assistantSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setDraft(s)}
                  style={{
                    height: 26, padding: '0 10px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                    background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                    font: 'var(--fw-medium) var(--text-xs)/1 var(--font-ui)', color: 'var(--text-body)',
                  }}
                >{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setDraft('') }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9, height: 42, padding: '0 14px', flex: 1, minWidth: 0,
                background: 'var(--surface-card)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
              }}>
                <Icon name="message-circle" size={17} color="var(--text-subtle)" />
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={lang === 'fr' ? 'Posez une question sur vos données…' : 'Ask about stock, sales, cash or dealers…'}
                  style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'var(--fw-regular) var(--text-md)/1 var(--font-ui)', color: 'var(--text-strong)' }}
                />
              </div>
              <Button type="submit" size="lg" iconLeft="send">Ask</Button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', minHeight: 0 }}>
          <Panel title="Answering as">
            <MetaRow label="User" value="M. Okonkwo" />
            <MetaRow label="Role" value="Administrator" />
            <MetaRow label="Data scope" value="All locations" />
            <MetaRow label="Cost data" value="Visible" />
            <div style={{ marginTop: 12, font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Answers are scoped to your permissions. A Quality Control user asking the same question would get
              the quantities without the landing cost.
            </div>
          </Panel>

          <Callout tone="warning" icon="shield-check" title="Retrieves, never executes">
            The assistant can look things up and calculate across reports, but it cannot move stock, take a
            payment or change a record. It deep-links you to the right module to do that yourself.
          </Callout>

          <Panel title="What it can do">
            {[
              ['search', 'Answer questions across stock, sales, cash, dealer and production data'],
              ['calculator', 'Calculate totals, averages, percentage change and margin on the fly'],
              ['messages-square', 'Follow up in context — it remembers the thread'],
              ['link', 'Cite the report behind every figure it gives you'],
              ['languages', 'Work in English or French'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 0' }}>
                <Icon name={icon} size={14} color="var(--text-subtle)" style={{ marginTop: 2 }} />
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </Panel>

          <Panel title="When it will not answer">
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              If a question is ambiguous, the data is insufficient, or it falls outside supported scope, the
              assistant says so plainly and offers the relevant manual report or a human contact — it does not
              guess at a figure.
            </div>
            <div style={{ marginTop: 12 }}>
              <Badge tone="neutral" uppercase>All conversations logged for audit</Badge>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
