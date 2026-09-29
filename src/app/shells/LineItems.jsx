import { useState } from 'react'
import { Icon } from '../../ds/components/core/Icon.jsx'

/**
 * Editable line-item grid used by every multi-row entry screen
 * (Stock Refill, Stock Transfer, Production, POS, Invoice).
 * columns: { key, label, type: 'select'|'number'|'text'|'date'|'static',
 *            options?, width?, align?, suffix?, placeholder?, mono?, hint? }[]
 */
function Cell({ col, value, onChange, last, invalid }) {
  const [focus, setFocus] = useState(false)
  const align = col.align || (col.type === 'number' ? 'right' : 'left')
  const base = {
    width: '100%', height: 34, border: 'none', outline: 'none', background: 'transparent',
    padding: '0 12px', textAlign: align,
    font: col.mono || col.type === 'number'
      ? 'var(--fw-medium) var(--text-sm)/1 var(--font-mono)'
      : 'var(--fw-regular) var(--text-sm)/1 var(--font-ui)',
    fontVariantNumeric: col.mono || col.type === 'number' ? 'tabular-nums' : undefined,
    color: 'var(--text-strong)',
  }

  if (col.type === 'static') {
    return (
      <td style={{ borderRight: last ? 'none' : '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', color: 'var(--text-muted)' }}>
          {value ?? '—'}{col.suffix && <span style={{ marginLeft: 4, color: 'var(--text-subtle)' }}>{col.suffix}</span>}
        </div>
      </td>
    )
  }

  return (
    <td style={{
      borderRight: last ? 'none' : '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: focus ? 'inset 0 0 0 2px var(--border-focus)' : invalid ? 'inset 0 0 0 1.5px var(--danger)' : 'none',
      background: invalid && !focus ? 'var(--danger-bg)' : undefined,
      position: 'relative', transition: 'box-shadow var(--dur-fast) var(--ease-standard)',
    }}>
      {col.type === 'select' ? (
        <select
          value={value ?? ''} onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...base, appearance: 'none', paddingRight: 26, cursor: 'pointer', color: value ? 'var(--text-strong)' : 'var(--text-subtle)' }}
        >
          <option value="">{col.placeholder || 'Select…'}</option>
          {(col.options || []).map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
      ) : (
        <input
          type={col.type === 'number' ? 'number' : col.type === 'date' ? 'date' : 'text'}
          value={value ?? ''} onChange={(e) => onChange(e.target.value)}
          placeholder={col.placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={base}
        />
      )}
      {col.type === 'select' && (
        <span style={{ position: 'absolute', right: 8, top: 11, pointerEvents: 'none', display: 'flex' }}>
          <Icon name="chevron-down" size={13} color="var(--text-subtle)" />
        </span>
      )}
    </td>
  )
}

export function LineItems({
  columns = [], rows = [], onChange, onAdd, onRemove,
  addLabel = 'Add line', emptyLabel = 'No lines added yet.', summary,
  errors = [],
}) {
  const problems = errors.map((e, i) => (e ? { ...e, line: i + 1 } : null)).filter(Boolean)
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 'max-content' }}>
          <colgroup>
            <col style={{ width: 44 }} />
            {columns.map((c) => <col key={c.key} style={{ width: c.width || 160 }} />)}
            {onRemove && <col style={{ width: 44 }} />}
          </colgroup>
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th style={{ height: 34, borderBottom: '1px solid var(--border-default)', borderRight: '1px solid var(--border-subtle)' }} />
              {columns.map((c) => (
                <th key={c.key} style={{
                  height: 34, padding: '0 12px', textAlign: c.align || (c.type === 'number' ? 'right' : 'left'),
                  font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                  color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)',
                  borderRight: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
                }}>{c.label}</th>
              ))}
              {onRemove && <th style={{ borderBottom: '1px solid var(--border-default)' }} />}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + (onRemove ? 2 : 1)} style={{ height: 64, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                  {emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.id ?? i}>
                <td style={{
                  textAlign: 'center', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)',
                  font: 'var(--fw-medium) var(--text-xs)/1 var(--font-mono)',
                  color: errors[i] ? 'var(--danger)' : 'var(--text-subtle)',
                  background: errors[i] ? 'var(--danger-bg)' : 'var(--surface-sunken)',
                }}>{i + 1}</td>
                {columns.map((c, ci) => (
                  <Cell
                    key={c.key}
                    col={c}
                    value={r[c.key]}
                    onChange={(v) => onChange?.(i, c.key, v)}
                    last={ci === columns.length - 1 && !onRemove}
                    invalid={errors[i]?.field === c.key}
                  />
                ))}
                {onRemove && (
                  <td style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                    <button
                      type="button" onClick={() => onRemove(i)} aria-label="Remove line"
                      style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, margin: '0 auto', border: 'none', background: 'transparent', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-subtle)' }}
                    >
                      <Icon name="x" size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {problems.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--danger-bg)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {problems.map((p) => (
            <div key={p.line} style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--fw-medium) var(--text-xs)/1.4 var(--font-ui)', color: '#8A1C21' }}>
              <Icon name="circle-alert" size={13} color="#8A1C21" />
              <span><strong>Line {p.line}</strong> — {p.message}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '8px 12px', background: 'var(--surface-card)' }}>
        {onAdd && (
          <button
            type="button" onClick={onAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', border: '1px dashed var(--border-strong)', background: 'transparent', borderRadius: 'var(--radius-control)', font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', color: 'var(--text-body)', cursor: 'pointer' }}
          >
            <Icon name="plus" size={13} /> {addLabel}
          </button>
        )}
        <div style={{ flex: 1 }} />
        {summary?.map((s) => (
          <div key={s.label} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 7 }}>
            <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{s.label}</span>
            <span style={{ font: 'var(--fw-bold) var(--text-sm)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
