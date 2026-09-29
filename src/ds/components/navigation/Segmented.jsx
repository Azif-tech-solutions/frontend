import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

/** Pill segment group — active segment is a solid fill, inactive are plain text. */
export function Segmented({ options = [], value, onChange, size = 'md', style }) {
  const [hover, setHover] = useState(null);
  const h = size === 'sm' ? 26 : 30;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2, padding: 3,
      background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-control)', ...style,
    }}>
      {options.map((o) => {
        const id = o.value ?? o;
        const on = id === value;
        return (
          <button
            key={id} type="button" onClick={() => onChange?.(id)}
            onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, height: h, padding: '0 12px',
              border: 'none', borderRadius: 'calc(var(--radius-control) - 1px)',
              background: on ? 'var(--surface-card)' : hover === id ? 'var(--surface-hover)' : 'transparent',
              boxShadow: on ? 'var(--shadow-xs)' : 'none',
              font: `${on ? 'var(--fw-bold)' : 'var(--fw-medium)'} var(--text-sm)/1 var(--font-ui)`,
              letterSpacing: 'var(--ls-tight)',
              color: on ? 'var(--text-strong)' : 'var(--text-muted)',
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition-control)',
            }}
          >
            {o.icon && <Icon name={o.icon} size={14} />}
            {o.label ?? o}
          </button>
        );
      })}
    </div>
  );
}
