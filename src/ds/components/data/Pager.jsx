import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Pagination band shown under a table. Renders nothing while everything fits on
 * one page, so tables stay clean until they actually grow.
 */
export function Pager({ page, pageCount, start, end, total, onPage }) {
  if (pageCount <= 1) return null;

  const btn = (disabled) => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, padding: 0,
    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)',
    background: 'var(--surface-card)', color: disabled ? 'var(--text-subtle)' : 'var(--text-muted)',
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
    transition: 'var(--transition-control)',
  });

  const go = (p) => onPage(Math.min(Math.max(p, 0), pageCount - 1));

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '8px 12px', borderTop: '1px solid var(--border-default)', background: 'var(--surface-sunken)',
    }}>
      <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
        Showing <b style={{ color: 'var(--text-strong)' }}>{start + 1}–{end}</b> of <b style={{ color: 'var(--text-strong)' }}>{total}</b>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button type="button" aria-label="First page" disabled={page === 0} onClick={() => go(0)} style={btn(page === 0)}>
          <Icon name="chevrons-left" size={14} />
        </button>
        <button type="button" aria-label="Previous page" disabled={page === 0} onClick={() => go(page - 1)} style={btn(page === 0)}>
          <Icon name="chevron-left" size={14} />
        </button>
        <span style={{ font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)', color: 'var(--text-muted)', padding: '0 6px', whiteSpace: 'nowrap' }}>
          Page {page + 1} of {pageCount}
        </span>
        <button type="button" aria-label="Next page" disabled={page >= pageCount - 1} onClick={() => go(page + 1)} style={btn(page >= pageCount - 1)}>
          <Icon name="chevron-right" size={14} />
        </button>
        <button type="button" aria-label="Last page" disabled={page >= pageCount - 1} onClick={() => go(pageCount - 1)} style={btn(page >= pageCount - 1)}>
          <Icon name="chevrons-right" size={14} />
        </button>
      </div>
    </div>
  );
}
