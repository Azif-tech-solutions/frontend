import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';

export function SidebarItem({ icon, label, active, level = 0, trailing, onClick, onShell, style }) {
  const [hover, setHover] = useState(false);
  const bg = onShell
    ? (active ? 'rgba(255,255,255,.14)' : hover ? 'var(--surface-shell-hover)' : 'transparent')
    : (active ? 'var(--surface-active)' : hover ? 'var(--surface-hover)' : 'transparent');
  const fg = onShell ? (active ? '#fff' : 'rgba(255,255,255,.78)') : (active ? 'var(--text-strong)' : 'var(--text-body)');
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, height: level > 0 ? 30 : 36,
        padding: `0 8px 0 ${8 + level * 20}px`, borderRadius: 'var(--radius-md)', background: bg, color: fg,
        font: level > 0 ? 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)' : 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)',
        letterSpacing: 'var(--ls-tight)', cursor: 'pointer', transition: 'var(--transition-control)', ...style }}>
      {icon && <Icon name={icon} size={18} />}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {trailing}
    </div>
  );
}
