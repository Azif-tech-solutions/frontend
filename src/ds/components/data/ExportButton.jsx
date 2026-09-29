import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

const FORMATS = [
  { value: 'csv', label: 'Export as CSV', hint: 'Comma-separated — opens anywhere', icon: 'file-text' },
  { value: 'xlsx', label: 'Export as Excel', hint: 'Formatted .xlsx workbook', icon: 'file-spreadsheet' },
];

/**
 * Export control offering CSV or Excel. The caller receives the chosen format
 * and does the writing, so the same menu serves tables, logs and registers.
 */
export function ExportButton({ label = 'Export', onExport, disabled, variant = 'secondary', size = 'md', align = 'right' }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const wrap = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  const choose = (format) => { setOpen(false); onExport?.(format); };

  return (
    <span ref={wrap} style={{ position: 'relative', display: 'inline-flex' }}>
      <Button
        variant={variant}
        size={size}
        iconLeft="download"
        iconRight="chevron-down"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
      </Button>

      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', [align]: 0, zIndex: 40, minWidth: 232,
            background: 'var(--surface-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg, 0 10px 30px rgba(0,0,0,.12))',
            padding: 4, overflow: 'hidden',
          }}
        >
          {FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="menuitem"
              onClick={() => choose(f.value)}
              onMouseEnter={() => setHover(f.value)}
              onMouseLeave={() => setHover(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 10px',
                background: hover === f.value ? 'var(--surface-hover)' : 'transparent',
                border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left',
                transition: 'background-color var(--dur-instant) var(--ease-standard)',
              }}
            >
              <Icon name={f.icon} size={16} color="var(--text-muted)" />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', font: 'var(--fw-semibold) var(--text-sm)/1.3 var(--font-ui)', color: 'var(--text-strong)' }}>{f.label}</span>
                <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 1 }}>{f.hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </span>
  );
}
