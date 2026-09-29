import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Input({ label, hint, error, iconLeft, prefix, suffix, size = 'md', value, onChange, placeholder, type = 'text', disabled, id, style, ...rest }) {
  const [focus, setFocus] = useState(false);
  const h = size === 'lg' ? 'var(--field-h-lg)' : 'var(--field-h)';
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--border-focus)' : 'var(--border-default)';
  return (
    <label htmlFor={id} style={{ display: 'block', ...style }}>
      {label && <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>{label}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: h, padding: size === 'lg' ? '0 14px' : '0 10px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-control)',
        boxShadow: 'var(--shadow-xs)', transition: 'var(--transition-control)' }}>
        {iconLeft && <Icon name={iconLeft} size={16} color="var(--text-subtle)" />}
        {prefix && <span style={{ font: 'var(--type-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-subtle)' }}>{prefix}</span>}
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', boxShadow: 'none', background: 'transparent',
            font: size === 'lg' ? 'var(--type-body)' : 'var(--fw-regular) var(--text-sm)/1.3 var(--font-ui)',
            color: 'var(--text-strong)' }} {...rest} />
        {suffix && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{suffix}</span>}
      </div>
      {(hint || error) && <div style={{ font: 'var(--type-caption)', color: error ? 'var(--text-danger)' : 'var(--text-muted)', marginTop: 5 }}>{error || hint}</div>}
    </label>
  );
}
