import React, { useState } from 'react';
import { Icon } from './Icon.jsx';

export function Card({ title, description, icon, iconColor = 'var(--brand)', children, interactive, onClick, padding = 20, style }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-card)', padding,
        boxShadow: interactive && hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        borderColor: interactive && hover ? 'var(--border-strong)' : 'var(--border-default)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow var(--dur-normal) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)', ...style }}>
      {icon && <div style={{ marginBottom: 12, color: iconColor }}><Icon name={icon} size={20} color={iconColor} /></div>}
      {title && <div style={{ font: 'var(--type-h4)', color: 'var(--text-strong)', letterSpacing: 'var(--ls-tight)', marginBottom: description ? 6 : 0 }}>{title}</div>}
      {description && <div style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{description}</div>}
      {children}
    </div>
  );
}
