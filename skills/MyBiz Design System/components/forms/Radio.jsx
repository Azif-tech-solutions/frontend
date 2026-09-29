import React from 'react';

export function Radio({ label, description, checked, onChange, name, disabled, style }) {
  return (
    <label style={{ display: 'flex', alignItems: description ? 'flex-start' : 'center', gap: 9, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, ...style }}>
      <span onClick={() => !disabled && onChange && onChange(true)}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, marginTop: description ? 2 : 0,
          borderRadius: 'var(--radius-full)', background: 'var(--surface-card)',
          border: `${checked ? 5 : 1}px solid ${checked ? 'var(--brand)' : 'var(--border-strong)'}`,
          transition: 'var(--transition-control)', flex: '0 0 auto' }} data-name={name} />
      <span>
        {label && <span style={{ display: 'block', font: 'var(--type-ui)', color: 'var(--text-strong)' }}>{label}</span>}
        {description && <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>{description}</span>}
      </span>
    </label>
  );
}
