import { Badge } from '../../ds/components/core/Badge.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { PageHeader } from './PageHeader.jsx'
import { Page, Panel } from './Page.jsx'

/** Stands in for any PRD feature not yet designed, so every nav item resolves. */
export default function Placeholder({ leaf, moduleLabel, parentLabel }) {
  const crumbs = [moduleLabel, parentLabel].filter(Boolean)
  return (
    <Page>
      <PageHeader
        crumbs={crumbs}
        title={leaf?.label || 'Screen'}
        description={leaf?.description}
        icon={leaf?.icon}
        meta={leaf?.ref ? <Badge tone="neutral" uppercase>PRD §{leaf.ref}</Badge> : null}
      />
      <Panel>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '28px 8px' }}>
          <span style={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', flex: '0 0 auto' }}>
            <Icon name="drafting-compass" size={17} color="var(--text-subtle)" />
          </span>
          <div>
            <div style={{ font: 'var(--fw-semibold) var(--text-md)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>Not designed yet</div>
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 5, maxWidth: '60ch', lineHeight: 1.6 }}>
              This screen is in the build queue. Its shell, filters, and table structure are already
              defined by the shared archetypes — it just needs its specific fields laid in.
            </div>
          </div>
        </div>
      </Panel>
    </Page>
  )
}
