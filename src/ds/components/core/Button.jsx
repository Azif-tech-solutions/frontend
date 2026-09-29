import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { height: 28, padding: '0 10px', font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', gap: 6, icon: 14 },
  md: { height: 32, padding: '0 14px', font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-ui)', gap: 6, icon: 16 },
  lg: { height: 44, padding: '0 22px', font: 'var(--fw-bold) var(--text-md)/1 var(--font-ui)', gap: 8, icon: 18 }
};

function variantStyle(variant, hover) {
  switch (variant) {
    case 'secondary':
      return { background: hover ? 'var(--surface-hover)' : 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' };
    case 'ghost':
      return { background: hover ? 'var(--surface-hover)' : 'transparent', color: 'var(--text-body)', border: '1px solid transparent' };
    case 'danger':
      return { background: hover ? 'var(--danger-hover)' : 'var(--danger)', color: '#fff', border: '1px solid transparent' };
    case 'inverse':
      return { background: hover ? 'var(--n-800)' : 'var(--n-900)', color: '#fff', border: '1px solid transparent' };
    default:
      return { background: hover ? 'var(--brand-hover)' : 'var(--brand)', color: 'var(--brand-on)', border: '1px solid transparent', boxShadow: 'var(--shadow-xs)' };
  }
}

export function Button({ children, variant = 'primary', size = 'md', iconLeft, iconRight, disabled, fullWidth, type = 'button', onClick, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const s = SIZES[size] || SIZES.md;
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: s.gap, height: s.height, padding: s.padding,
        font: s.font, letterSpacing: 'var(--ls-tight)', borderRadius: 'var(--radius-control)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
        transform: down && !disabled ? 'scale(var(--press-scale))' : 'none',
        transition: 'var(--transition-control), transform var(--dur-instant) var(--ease-standard)',
        whiteSpace: 'nowrap', ...variantStyle(variant, hover && !disabled), ...style
      }} {...rest}>
      {iconLeft && <Icon name={iconLeft} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </button>
  );
}
