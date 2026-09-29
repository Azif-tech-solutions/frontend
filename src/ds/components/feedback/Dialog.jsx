import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

export function Dialog({ open = true, title, description, children, footer, width = 480, onClose, style }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface-overlay)', display: 'grid', placeItems: 'center', zIndex: 50 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ width, maxWidth: '92%', background: 'var(--surface-raised)', borderRadius: 'var(--radius-panel)',
          boxShadow: 'var(--shadow-xl)', overflow: 'hidden', ...style }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '20px 20px 0' }}>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', letterSpacing: 'var(--ls-tight)' }}>{title}</div>
            {description && <div style={{ font: 'var(--type-body)', color: 'var(--text-muted)', marginTop: 6 }}>{description}</div>}
          </div>
          {onClose && <IconButton icon="x" label="Close" onClick={onClose} />}
        </div>
        {children && <div style={{ padding: '18px 20px 0' }}>{children}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 20, marginTop: 4 }}>{footer}</div>
      </div>
    </div>
  );
}
