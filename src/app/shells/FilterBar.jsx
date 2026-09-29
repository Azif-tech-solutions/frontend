import { Button } from '../../ds/components/core/Button.jsx'
import { Icon } from '../../ds/components/core/Icon.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'

/**
 * Filter row that precedes every report.
 * fields: { key, label, type: 'select'|'date'|'text'|'number', options?, placeholder?, span? }[]
 */
export function FilterBar({ fields = [], values = {}, onChange = () => {}, onGenerate, onReset, generateLabel = 'Generate report', children }) {
  return (
    <div style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', padding: 16,
      display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 240, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        {fields.map((f) => {
          const common = { label: f.label, value: values[f.key] ?? '', onChange: (e) => onChange(f.key, e.target.value), style: f.span ? { gridColumn: `span ${f.span}` } : undefined }
          if (f.type === 'select') return <Select key={f.key} {...common} options={f.options || []} placeholder={f.placeholder || 'All'} />
          return <Input key={f.key} {...common} type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'} placeholder={f.placeholder} iconLeft={f.icon} />
        })}
        {children}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {onReset && <Button variant="ghost" onClick={onReset}>Reset</Button>}
        {onGenerate && <Button iconLeft="play" onClick={onGenerate}>{generateLabel}</Button>}
      </div>
    </div>
  )
}

/** Compact search + actions row for register/list screens. */
export function Toolbar({ search, onSearch, placeholder = 'Search…', filters, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, height: 32, padding: '0 10px', minWidth: 240, flex: '1 1 240px', maxWidth: 380,
        background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
      }}>
        <Icon name="search" size={15} color="var(--text-subtle)" />
        <input
          value={search ?? ''}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder={placeholder}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', font: 'var(--fw-regular) var(--text-sm)/1 var(--font-ui)', color: 'var(--text-strong)' }}
        />
      </div>
      {filters}
      <div style={{ flex: 1 }} />
      {actions}
    </div>
  )
}
