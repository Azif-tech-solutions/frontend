import React from 'react';

export function Switch({ label, checked, onChange, disabled, style }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, ...style }}>
      <span onClick={() => !disabled && onChange && onChange(!checked)}
        style={{ position: 'relative', width: 32, height: 18, borderRadius: 'var(--radius-full)',
          background: checked ? 'var(--brand)' : 'var(--n-300)', transition: 'background-color var(--dur-normal) var(--ease-standard)', flex: '0 0 auto' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 16 : 2, width: 14, height: 14, borderRadius: 'var(--radius-full)',
          background: '#fff', boxShadow: 'var(--shadow-sm)', transition: 'left var(--dur-normal) var(--ease-emphasis)' }} />
      </span>
      {label && <span style={{ font: 'var(--type-ui)', color: 'var(--text-body)' }}>{label}</span>}
    </label>
  );
}
