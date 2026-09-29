import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Page, Panel, MetaRow, Callout } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { useStore } from '../store.jsx'

// The PRD caps passwords at six characters for system standardisation.
const MAX_LENGTH = 6

export default function ChangePassword({ leaf, moduleLabel, parentLabel }) {
  const { user } = useStore()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')

  const tooLong = next.length > MAX_LENGTH
  const mismatch = confirm.length > 0 && next !== confirm
  const tooShort = next.length > 0 && next.length < 4
  const sameAsCurrent = next.length > 0 && next === current
  const ready = current && next && confirm && !tooLong && !mismatch && !tooShort && !sameAsCurrent

  return (
    <Page>
      <PageHeader
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Change My Password'}
        icon={leaf?.icon}
        description="Set your own account password without needing administrative help. Choose something memorable that others could not easily guess."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }} className="zq-formlayout">
        <Panel title="New password" description={`Passwords are limited to a maximum of ${MAX_LENGTH} characters.`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
            <Input
              label="Current password"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Enter your current password"
            />

            <div>
              <Input
                label="New password"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder={`Up to ${MAX_LENGTH} characters`}
                maxLength={MAX_LENGTH}
                error={tooLong ? `Maximum ${MAX_LENGTH} characters` : sameAsCurrent ? 'New password must differ from your current one' : undefined}
                hint={!tooLong && !sameAsCurrent ? 'Memorable, but not easily guessed by others.' : undefined}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                {Array.from({ length: MAX_LENGTH }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      flex: 1, height: 3, borderRadius: 'var(--radius-full)',
                      background: i < next.length ? (tooShort ? 'var(--warning)' : 'var(--brand)') : 'var(--border-default)',
                      transition: 'background-color var(--dur-fast) var(--ease-standard)',
                    }}
                  />
                ))}
                <span style={{ font: 'var(--fw-medium) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-subtle)', marginLeft: 4, minWidth: 28, textAlign: 'right' }}>
                  {next.length}/{MAX_LENGTH}
                </span>
              </div>
            </div>

            <Input
              label="Confirm new password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter the new password"
              maxLength={MAX_LENGTH}
              error={mismatch ? 'Passwords do not match' : undefined}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4 }}>
              <Button iconLeft="check" disabled={!ready}>Update password</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </div>
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Panel title="Account">
            <MetaRow label="User" value={user.name || 'Administrator'} />
            <MetaRow label="Email" value={user.email || '—'} />
            <MetaRow label="Last changed" value="14 Jun 2026" />
            <MetaRow label="Last sign-in" value="24 Aug 2026, 07:52" />
          </Panel>

          <Callout tone="info" icon="shield-check" title="Verification required">
            Changing your password requires your current one. If you have forgotten it, an administrator must
            reset the account for you.
          </Callout>

          <Panel title="Choosing a password">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                'Avoid your name, birthday or phone number',
                'Avoid sequences such as 123456 or abcdef',
                'Do not reuse a password from another system',
                'Never share it, including with colleagues',
              ].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Icon name="check" size={13} color="var(--success)" style={{ marginTop: 2 }} />
                  <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  )
}
