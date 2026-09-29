import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function Tabs({ tabs = [], value, onChange, style }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, borderBottom: '1px solid var(--border-default)', ...style }}>
      {tabs.map(t => {
        const id = t.value ?? t;
        const on = id === value;
        return (
          <div key={id} onClick={() => onChange && onChange(id)}
            onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 12px',
              borderBottom: `2px solid ${on ? 'var(--brand)' : 'transparent'}`,
              color: on ? 'var(--text-strong)' : hover === id ? 'var(--text-body)' : 'var(--text-muted)',
              font: `${on ? 'var(--fw-bold)' : 'var(--fw-medium)'} var(--text-sm)/1 var(--font-ui)`,
              cursor: 'pointer', marginBottom: -1, transition: 'var(--transition-control)' }}>
            {t.icon && <Icon name={t.icon} size={15} />}
            {t.label ?? t}
            {t.count != null && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>{t.count}</span>}
          </div>
        );
      })}
    </div>
  );
}
