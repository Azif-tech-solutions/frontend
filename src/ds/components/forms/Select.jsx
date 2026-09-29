import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Select({ label, options = [], value, onChange, size = 'md', disabled, placeholder = 'Select…', style }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: 'block', ...style }}>
      {label && <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>{label}</div>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: size === 'lg' ? 'var(--field-h-lg)' : 'var(--field-h)',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)', border: `1px solid ${focus ? 'var(--border-focus)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)', transition: 'var(--transition-control)' }}>
        <select value={value} onChange={onChange} disabled={disabled} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ appearance: 'none', width: '100%', height: '100%', border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent',
            padding: '0 30px 0 10px', font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)', color: 'var(--text-strong)', cursor: 'pointer' }}>
          {!value && <option value="">{placeholder}</option>}
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 9, pointerEvents: 'none', display: 'flex' }}><Icon name="chevron-down" size={15} color="var(--text-muted)" /></span>
      </div>
    </label>
  );
}
