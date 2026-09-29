import { useState, useRef, useEffect } from 'react'
import { Icon } from '../ds/components/core/Icon.jsx'

// A dropdown styled entirely to the MyBiz Design System tokens — used everywhere
// a select appears in this app, instead of the browser's native OS picker.
export function Dropdown({ label, options = [], value, onChange, size = 'md', disabled, placeholder = 'Select…', style }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = options.find((o) => (o.value ?? o) === value)
  const h = size === 'lg' ? 'var(--field-h-lg)' : 'var(--field-h)'

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={ref} style={{ display: 'block', position: 'relative', ...style }}>
      {label && <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>{label}</div>}
      <button type="button" disabled={disabled} onClick={() => !disabled && setOpen((o) => !o)}
        style={{ display: 'flex', alignItems: 'center', width: '100%', height: h,
          background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
          border: `1px solid ${open ? 'var(--border-focus)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)', transition: 'var(--transition-control)',
          padding: '0 30px 0 10px', font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
          color: selected ? 'var(--text-strong)' : 'var(--text-subtle)', cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {selected ? (selected.label ?? selected) : placeholder}
      </button>
      <span style={{ position: 'absolute', right: 9, top: label ? 'calc(50% + 13px)' : '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
        <Icon name="chevron-down" size={15} color="var(--text-muted)" />
      </span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, minWidth: 180, maxHeight: 260, overflowY: 'auto',
          background: 'var(--surface-raised)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', zIndex: 30, padding: 4 }}>
          {options.length === 0 && <div style={{ padding: '8px 10px', font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>No options</div>}
          {options.map((o) => {
            const v = o.value ?? o
            const l = o.label ?? o
            const on = v === value
            return (
              <div key={v} onClick={() => { onChange(v); setOpen(false) }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-hover)' }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent' }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  font: on ? 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)' : 'var(--fw-regular) var(--text-sm)/1.3 var(--font-ui)',
                  color: 'var(--text-strong)', background: on ? 'var(--brand-subtle)' : 'transparent' }}>
                <span style={{ width: 14, flex: '0 0 auto', display: 'flex' }}>{on && <Icon name="check" size={13} strokeWidth={2.4} color="var(--brand)" />}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
