import React from 'react';
import { Icon } from './Icon.jsx';

const COLORS = ['amber', 'teal', 'blue', 'violet', 'green', 'rose'];

export function Tag({ children, color = 'blue', onRemove, style }) {
  const c = COLORS.includes(color) ? color : 'blue';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 20, padding: onRemove ? '0 4px 0 8px' : '0 8px',
      borderRadius: 'var(--radius-full)', background: `var(--accent-${c}-bg)`, color: `var(--accent-${c}-fg)`,
      font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', whiteSpace: 'nowrap', maxWidth: 200, ...style }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span>
      {onRemove && <span onClick={onRemove} style={{ display: 'inline-flex', cursor: 'pointer', opacity: .6 }}><Icon name="x" size={11} /></span>}
    </span>
  );
}
