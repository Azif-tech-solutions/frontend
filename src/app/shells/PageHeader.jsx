import { useState } from 'react'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { crumbTargetByLabel } from '../nav.js'
import { useNavigateTo } from '../navContext.jsx'

/**
 * One breadcrumb. Clickable when the label resolves to a navigable target —
 * a module, or a parent item with children — and plain text otherwise (the
 * current screen's own label, or a label outside the nav tree).
 */
function Crumb({ label, current }) {
  const navigate = useNavigateTo()
  const [hover, setHover] = useState(false)
  const target = label === current ? null : crumbTargetByLabel[label]
  const clickable = !!(target && navigate)
  return (
    <span
      onClick={clickable ? () => navigate(target) : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
        color: clickable && hover ? 'var(--text-link)' : 'var(--text-subtle)',
        cursor: clickable ? 'pointer' : 'default',
        textDecoration: clickable && hover ? 'underline' : 'none',
        transition: 'color var(--dur-fast) var(--ease-standard)',
      }}
    >{label}</span>
  )
}

/**
 * Standard page masthead: breadcrumb → title → description, with actions right-aligned.
 * `crumbs` is an array of strings, outermost first.
 */
export function PageHeader({ crumbs = [], title, description, meta, actions, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        {crumbs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <Icon name="chevron-right" size={12} color="var(--text-subtle)" />}
                <Crumb label={c} current={title} />
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon && (
            <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--brand-subtle)', color: 'var(--brand)', flex: '0 0 auto' }}>
              <Icon name={icon} size={17} color="var(--brand)" />
            </span>
          )}
          <h1 style={{ margin: 0, font: 'var(--fw-bold) var(--text-2xl)/1.15 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{title}</h1>
        </div>
        {description && (
          <p style={{ margin: '8px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '68ch' }}>{description}</p>
        )}
        {meta && <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{meta}</div>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingTop: crumbs.length ? 24 : 0 }}>{actions}</div>}
    </div>
  )
}
