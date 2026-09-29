import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ label, checked, indeterminate, onChange, disabled, style }) {
  const on = checked || indeterminate;
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, ...style }}>
      <span onClick={() => !disabled && onChange && onChange(!checked)}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16,
          borderRadius: 'var(--radius-xs)', background: on ? 'var(--brand)' : 'var(--surface-card)',
          border: `1px solid ${on ? 'var(--brand)' : 'var(--border-strong)'}`, color: '#fff',
          transition: 'var(--transition-control)', flex: '0 0 auto' }}>
        {on && <Icon name={indeterminate ? 'minus' : 'check'} size={11} strokeWidth={3} color="#fff" />}
      </span>
      {label && <span style={{ font: 'var(--type-ui)', color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
