import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

const BOX = { sm: 24, md: 28, lg: 32 };

export function IconButton({ icon, label, size = 'md', variant = 'ghost', active, onClick, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const box = BOX[size] || BOX.md;
  const onShell = variant === 'onShell';
  const bg = active ? 'var(--surface-active)' : hover ? (onShell ? 'var(--surface-shell-hover)' : 'var(--surface-hover)') : 'transparent';
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: box, height: box,
        border: variant === 'outline' ? '1px solid var(--border-default)' : '1px solid transparent',
        borderRadius: 'var(--radius-control)', background: onShell && active ? 'var(--surface-shell-hover)' : bg,
        color: onShell ? 'rgba(255,255,255,.86)' : 'var(--text-muted)', cursor: 'pointer',
        transition: 'var(--transition-control)', ...style }} {...rest}>
      <Icon name={icon} size={size === 'sm' ? 14 : 16} />
    </button>
  );
}
