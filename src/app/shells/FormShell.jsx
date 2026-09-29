import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { PageHeader } from './PageHeader.jsx'
import { Page } from './Page.jsx'

/**
 * The archetype behind every entry screen (Stock Refill, Register, Adjustment, Transfer…):
 * header → form panels in the main column → contextual aside → sticky action footer.
 */
export function FormShell({
  crumbs, title, description, icon, headerActions,
  aside, children, submitLabel = 'Submit', onSubmit, onCancel, secondaryAction,
  note, wide,
}) {
  return (
    <Page wide={wide}>
      <PageHeader crumbs={crumbs} title={title} description={description} icon={icon} actions={headerActions} />

      <div className="zq-formlayout" style={{ display: 'grid', gridTemplateColumns: aside ? 'minmax(0, 1fr) 320px' : 'minmax(0, 1fr)', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>{children}</div>
        {aside && <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>{aside}</div>}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        padding: '14px 18px', background: 'var(--surface-card)',
        border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)',
      }}>
        {note && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 200, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            <Icon name="info" size={14} color="var(--text-subtle)" />
            {note}
          </div>
        )}
        {!note && <div style={{ flex: 1 }} />}
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
        {secondaryAction}
        <Button iconLeft="check" onClick={onSubmit}>{submitLabel}</Button>
      </div>
    </Page>
  )
}
