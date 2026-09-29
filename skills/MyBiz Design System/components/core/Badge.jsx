import React from 'react';

const TONES = {
  neutral: { bg: 'var(--n-100)', fg: 'var(--n-700)' },
  brand: { bg: 'var(--brand-subtle)', fg: 'var(--burgundy-700)' },
  success: { bg: 'var(--success-bg)', fg: 'var(--accent-green-fg)' },
  warning: { bg: 'var(--warning-bg)', fg: 'var(--accent-amber-fg)' },
  danger: { bg: 'var(--danger-bg)', fg: '#8A1C21' },
  info: { bg: 'var(--info-bg)', fg: 'var(--accent-blue-fg)' }
};

export function Badge({ children, tone = 'neutral', solid, uppercase, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px',
      borderRadius: 'var(--radius-sm)', background: solid ? t.fg : t.bg, color: solid ? '#fff' : t.fg,
      font: uppercase ? 'var(--type-eyebrow)' : 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)',
      letterSpacing: uppercase ? 'var(--ls-widest)' : 'var(--ls-normal)',
      textTransform: uppercase ? 'uppercase' : 'none', whiteSpace: 'nowrap', ...style }}>{children}</span>
  );
}
