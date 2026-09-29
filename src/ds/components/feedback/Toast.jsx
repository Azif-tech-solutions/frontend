import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

const ICONS = { success: 'check-circle', danger: 'alert-circle', info: 'info', neutral: 'info' };

export function Toast({ children, tone = 'neutral', action, onDismiss, style }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 10px 10px 14px',
      background: 'var(--surface-inverse)', color: '#fff', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)', font: 'var(--type-ui)', maxWidth: 420, ...style }}>
      <Icon name={ICONS[tone]} size={16} color={tone === 'success' ? '#7FD3A0' : tone === 'danger' ? '#F09B9B' : 'rgba(255,255,255,.7)'} />
      <span style={{ flex: 1 }}>{children}</span>
      {action}
      {onDismiss && <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} style={{ color: 'rgba(255,255,255,.7)' }} />}
    </div>
  );
}
