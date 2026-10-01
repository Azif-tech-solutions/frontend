//Sidebar.jsx
import { useMemo, useState } from 'react'
import { Avatar } from '../ds/components/core/Avatar.jsx'
import { Icon } from '../ds/components/core/Icon.jsx'
import { IconButton } from '../ds/components/core/IconButton.jsx'
import { navModules } from './nav'
import { useStore } from './store.jsx'
import logoMark from '../assets/logo-mark.svg'

const eyebrow = {
  font: 'var(--type-eyebrow)',
  letterSpacing: 'var(--ls-widest)',
  textTransform: 'uppercase',
  color: 'var(--text-subtle)',
}

function Row({ icon, label, active, open, expandable, level, onClick }) {
  const [hover, setHover] = useState(false)
  const pad = 8 + level * 14
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, height: level === 0 ? 32 : 30,
        padding: `0 8px 0 ${pad}px`, borderRadius: 'var(--radius-md)',
        background: active ? 'var(--surface-active)' : hover ? 'var(--surface-hover)' : 'transparent',
        color: active ? 'var(--text-strong)' : level === 2 ? 'var(--text-muted)' : 'var(--text-body)',
        font: `${active ? 'var(--fw-bold)' : level === 0 ? 'var(--fw-semibold)' : 'var(--fw-medium)'} var(--text-sm)/1 var(--font-ui)`,
        letterSpacing: 'var(--ls-tight)', cursor: 'pointer',
        transition: 'var(--transition-control)', position: 'relative',
      }}
    >
      {active && level > 0 && (
        <span style={{ position: 'absolute', left: pad - 9, top: 7, bottom: 7, width: 2, borderRadius: 1, background: 'var(--brand)' }} />
      )}
      {icon ? <Icon name={icon} size={level === 0 ? 16 : 14} /> : <span style={{ width: level === 2 ? 0 : 14, flex: '0 0 auto' }} />}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {expandable && (
        <Icon name="chevron-right" size={13} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-standard)', color: 'var(--text-subtle)' }} />
      )}
    </div>
  )
}

export default function Sidebar({ activeId, onNavigate, open, className = '' }) {
  const { company, user, logout } = useStore()
  const [query, setQuery] = useState('')
  const [openModules, setOpenModules] = useState(() => ({ factory: true }))
  const [openItems, setOpenItems] = useState({})

  const q = query.trim().toLowerCase()

  // When searching, show a flat result list instead of the module tree.
  const results = useMemo(() => {
    if (!q) return null
    const out = []
    for (const m of navModules) {
      for (const i of m.items) {
        const kids = i.children || [i]
        for (const leaf of kids) {
          const hay = `${m.label} ${i.label} ${leaf.label}`.toLowerCase()
          if (hay.includes(q)) out.push({ leaf, module: m, parent: i.children ? i : null })
        }
      }
    }
    return out.slice(0, 40)
  }, [q])

  return (
    <div
      className={`app-sidebar ${open ? 'open' : ''} ${className}`.trim()}
      style={{
        width: 'var(--sidebar-w)', flex: '0 0 auto', height: '100%', background: 'var(--surface-page)',
        borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', padding: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 12px' }}>
        <img src={logoMark} alt="" style={{ width: 24, height: 24, borderRadius: 'var(--radius-md)', display: 'block' }} />
        <span style={{ font: 'var(--fw-bold) var(--text-md)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>Zif iQ</span>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 7, height: 30, padding: '0 9px', marginBottom: 10,
        background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-control)',
      }}>
        <Icon name="search" size={14} color="var(--text-subtle)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search modules…"
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            font: 'var(--fw-regular) var(--text-sm)/1 var(--font-ui)', color: 'var(--text-strong)',
          }}
        />
        {q && <Icon name="x" size={13} color="var(--text-subtle)" style={{ cursor: 'pointer' }} onClick={() => setQuery('')} />}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 6 }}>
        {results ? (
          results.length === 0 ? (
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', padding: '8px 10px' }}>
              No module matches “{query}”.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {results.map(({ leaf, module, parent }) => (
                <div key={leaf.id} onClick={() => { onNavigate(leaf); setQuery('') }} style={{ cursor: 'pointer' }}>
                  <Row
                    icon={leaf.icon || parent?.icon || module.icon}
                    label={leaf.label}
                    active={leaf.id === activeId}
                    level={0}
                  />
                  {!module.standalone && (
                    <div style={{ ...eyebrow, padding: '0 8px 4px 30px', color: 'var(--text-subtle)' }}>
                      {module.label}{parent ? ` › ${parent.label}` : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          navModules.map((m) => {
            // A standalone module has no wrapper header — its items sit directly
            // at the top level of the tree (Overview).
            if (m.standalone) {
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {m.items.map((i) => (
                    <Row key={i.id} icon={i.icon} label={i.label} level={0} active={i.id === activeId} onClick={() => onNavigate(i)} />
                  ))}
                </div>
              )
            }
            const mOpen = !!openModules[m.id]
            return (
              <div key={m.id}>
                <Row
                  icon={m.icon}
                  label={m.label}
                  level={0}
                  expandable
                  open={mOpen}
                  onClick={() => setOpenModules((s) => ({ ...s, [m.id]: !s[m.id] }))}
                />
                {mOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                    {m.items.map((i) => {
                      if (!i.children) {
                        return <Row key={i.id} icon={i.icon} label={i.label} level={1} active={i.id === activeId} onClick={() => onNavigate(i)} />
                      }
                      const iOpen = !!openItems[i.id] || i.children.some((c) => c.id === activeId)
                      return (
                        <div key={i.id}>
                          <Row
                            icon={i.icon}
                            label={i.label}
                            level={1}
                            expandable
                            open={iOpen}
                            onClick={() => setOpenItems((s) => ({ ...s, [i.id]: !iOpen }))}
                          />
                          {iOpen && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {i.children.map((c) => (
                                <Row key={c.id} label={c.label} level={2} active={c.id === activeId} onClick={() => onNavigate(c)} />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderTop: '1px solid var(--border-subtle)' }}>
        <Avatar name={user.name || company.name || 'Company'} size="sm" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || 'Administrator'}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email || 'Administrator'}</div>
        </div>
        <IconButton icon="log-out" label="Sign out" size="sm" onClick={logout} />
      </div>
    </div>
  )
}
