import { useState } from 'react'
import { Icon } from '../ds/components/core/Icon.jsx'
import { useStore } from './store.jsx'

function Kpi({ icon, label, value, foot }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken)', border: '1px solid var(--border-default)' }}>
          <Icon name={icon} size={15} color="var(--text-strong)" />
        </span>
      </div>
      <div style={{ font: 'var(--fw-bold) var(--text-3xl)/1 var(--font-mono)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{value}</div>
      <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 8 }}>{foot}</div>
    </div>
  )
}

/**
 * Quick action — the primary call to action on this screen, so it is deliberately
 * louder than a plain Card: brand-tinted icon badge, arrow affordance, and a lift
 * on hover that pulls the eye before anything else on the page.
 */
function QuickAction({ icon, title, description, onClick, urgent }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', cursor: 'pointer', appearance: 'none', width: '100%',
        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 18px 20px',
        background: 'var(--surface-card)',
        border: `1px solid ${hover || urgent ? 'var(--brand)' : 'var(--brand-border)'}`,
        outline: urgent ? '2px solid var(--brand-subtle-hover)' : 'none',
        borderRadius: 'var(--radius-card)',
        boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow var(--dur-normal) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      }}
    >
      <span style={{
        display: 'grid', placeItems: 'center', width: 40, height: 40, flex: '0 0 auto',
        borderRadius: 'var(--radius-lg)', background: hover || urgent ? 'var(--brand)' : 'var(--brand-subtle)',
        transition: 'background var(--dur-fast) var(--ease-standard)',
      }}>
        <Icon name={icon} size={19} color={hover || urgent ? 'var(--brand-on)' : 'var(--brand)'} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{title}</span>
          <Icon name="arrow-right" size={15} color="var(--brand)" style={{ transform: hover ? 'translateX(3px)' : 'none', transition: 'transform var(--dur-fast) var(--ease-standard)' }} />
        </span>
        <span style={{ display: 'block', marginTop: 6, font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{description}</span>
      </span>
    </button>
  )
}

export default function Overview({ onNavigate }) {
  const { branches, factories, stockEntries } = useStore()

  const noFactories = factories.length === 0
  const locationCount = branches.length || 1
  const rawCount = stockEntries.filter((e) => e.category === 'raw').length
  const finishedCount = stockEntries.filter((e) => e.category === 'finished').length

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--content-max)' }}>
      <section style={{
        background: 'var(--brand-subtle)', border: '1px solid var(--brand-border)',
        borderRadius: 'var(--radius-panel)', padding: 20, marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Icon name="zap" size={15} color="var(--brand)" />
          <span style={{ font: 'var(--fw-bold) var(--text-md)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--brand)' }}>Quick actions</span>
        </div>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginBottom: 16 }}>
          {noFactories
            ? 'Start with a factory — the Factory module records everything against one.'
            : 'The things you will do most — start here.'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          <QuickAction
            icon="factory"
            title={noFactories ? 'Create your first factory' : 'Create aa factory'}
            description={noFactories
              ? 'Required before stock can be registered or any Factory screen used.'
              : 'Add another production site to the register.'}
            urgent={noFactories}
            onClick={() => {
            onNavigate({ id: 'ai.eri', view: 'ai.eri',  })
              // onNavigate({ id: 'f.factories', view: 'factories', label: 'Factories' })
            }
            }
          />
          <QuickAction
            icon="package"
            title="Register stock"
            description="Add finished products or raw materials to a factory."
            onClick={() => onNavigate({ view: 'stockregister', id: 'stockregister', label: 'Stock Registration' })}
          />
          <QuickAction
            icon="clipboard-list"
            title="View stock records"
            description="Browse everything submitted, by factory or category."
            onClick={() => onNavigate({ view: 'stockrecords', id: 'stockrecords', label: 'Stock Records' })}
          />
          <QuickAction
            icon="building-2"
            title="Manage branches"
            description="Add locations beyond your primary company address."
            onClick={() => onNavigate({ id: 's.branches', view: 'branches', label: 'Branches' })}
          />
        </div>
      </section>

      <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 10 }}>Where the business stands today</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14 }}>
        <Kpi icon="building-2" label="Locations" value={locationCount} foot={branches.length ? `${branches.length} branch${branches.length === 1 ? '' : 'es'}` : 'Company is the primary location'} />
        <Kpi icon="factory" label="Factories" value={factories.length} foot={factories.length ? 'registered so far' : 'none yet — create one to begin'} />
        <Kpi icon="package" label="Finished products" value={finishedCount} foot="stock entries recorded" />
        <Kpi icon="flask-conical" label="Raw materials" value={rawCount} foot="stock entries recorded" />
      </div>
    </div>
  )
}
