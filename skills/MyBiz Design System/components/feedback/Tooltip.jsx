import React, { useState } from 'react';

export function Tooltip({ label, shortcut, placement = 'top', children, style }) {
  const [show, setShow] = useState(false);
  const pos = placement === 'bottom' ? { top: 'calc(100% + 6px)' } : { bottom: 'calc(100% + 6px)' };
  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', ...pos,
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 'var(--radius-sm)',
          background: 'var(--n-900)', color: '#fff', font: 'var(--fw-medium) var(--text-xs)/1.2 var(--font-ui)',
          whiteSpace: 'nowrap', boxShadow: 'var(--shadow-md)', zIndex: 40, pointerEvents: 'none' }}>
          {label}
          {shortcut && <span style={{ font: 'var(--type-mono)', fontSize: 11, opacity: .6 }}>{shortcut}</span>}
        </span>
      )}
    </span>
  );
}
