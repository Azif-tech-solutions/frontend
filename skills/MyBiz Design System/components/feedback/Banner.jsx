import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

const TONES = {
  brand: { bg: 'var(--brand-subtle)', border: 'var(--brand-border)', icon: 'var(--brand)' },
  info: { bg: 'var(--info-bg)', border: '#C3D6F6', icon: 'var(--info)' },
  success: { bg: 'var(--success-bg)', border: '#BEE3CC', icon: 'var(--success)' },
  warning: { bg: 'var(--warning-bg)', border: '#F2DDB0', icon: 'var(--warning)' },
  danger: { bg: 'var(--danger-bg)', border: '#F2C9C9', icon: 'var(--danger)' }
};

export function Banner({ title, children, tone = 'brand', icon, actions, onDismiss, style }) {
  const t = TONES[tone] || TONES.brand;
  return (
    <div style={{ display: 'flex', gap: 12, padding: '16px 18px', background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-panel)', ...style }}>
      {icon && <div style={{ marginTop: 1 }}><Icon name={icon} size={18} color={t.icon} /></div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ font: 'var(--fw-bold) var(--text-lg)/1.3 var(--font-ui)', color: 'var(--text-strong)', letterSpacing: 'var(--ls-tight)' }}>{title}</div>}
        {children && <div style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginTop: 5 }}>{children}</div>}
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>{actions}</div>}
      </div>
      {onDismiss && <IconButton icon="x" label="Dismiss" onClick={onDismiss} />}
    </div>
  );
}
