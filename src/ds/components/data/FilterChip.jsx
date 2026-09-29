import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function FilterChip({ field, operator, value, active, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 8px 0 10px',
        background: hover ? 'var(--surface-hover)' : 'var(--surface-card)',
        border: `1px solid ${active ? 'var(--brand-border)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-control)', font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
        color: 'var(--text-body)', cursor: 'pointer', transition: 'var(--transition-control)', ...style }}>
      <span>{field}</span>
      {operator && <span style={{ color: 'var(--text-subtle)' }}>{operator}</span>}
      {value}
      <Icon name="chevron-down" size={14} color="var(--text-subtle)" />
    </button>
  );
}
