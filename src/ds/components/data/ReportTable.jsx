import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
import { Pager } from './Pager.jsx';

/**
 * Ledger-style table for reports and registers.
 * columns: { key, label, align?: 'left'|'right'|'center', width?, mono?, render?(row), sortable? }
 * totals:  optional object keyed like a row, rendered as a bold summary band.
 */
export function ReportTable({
  columns = [], rows = [], totals, rowKey = (_, i) => i,
  onRowClick, dense = false, stickyHeader = true, emptyLabel = 'No records', pageSize = 10, style,
}) {
  const [hover, setHover] = useState(null);
  const [sort, setSort] = useState(null);
  const [rawPage, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(rows.length / (pageSize || rows.length || 1)));
  const page = Math.min(rawPage, pageCount - 1); // clamp when rows shrink (filtering)
  const start = pageSize ? page * pageSize : 0;
  const visible = pageSize ? rows.slice(start, start + pageSize) : rows;

  const h = dense ? 34 : 40;
  const cell = (c) => ({
    padding: dense ? '0 10px' : '0 14px',
    textAlign: c.align || 'left',
    width: c.width,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  function toggleSort(c) {
    if (c.sortable === false) return;
    setSort((s) => (s?.key === c.key ? { key: c.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: c.key, dir: 'asc' }));
  }

  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'var(--surface-card)', ...style }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 'max-content' }}>
          <thead>
            <tr style={{ background: 'var(--surface-sunken)', position: stickyHeader ? 'sticky' : undefined, top: 0, zIndex: 1 }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  onClick={() => toggleSort(c)}
                  style={{
                    ...cell(c), height: 36,
                    font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                    color: 'var(--text-muted)', borderBottom: '1px solid var(--border-default)',
                    cursor: c.sortable === false ? 'default' : 'pointer', userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}>
                    {c.label}
                    {sort?.key === c.key && <Icon name={sort.dir === 'asc' ? 'arrow-up' : 'arrow-down'} size={11} color="var(--text-subtle)" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ height: 88, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
                  {emptyLabel}
                </td>
              </tr>
            )}
            {visible.map((r, vi) => { const i = start + vi; return (
              <tr
                key={rowKey(r, i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={onRowClick ? () => onRowClick(r, i) : undefined}
                style={{
                  height: h,
                  background: hover === i ? 'var(--surface-hover)' : 'transparent',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color var(--dur-instant) var(--ease-standard)',
                }}
              >
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    style={{
                      ...cell(c),
                      font: c.mono
                        ? 'var(--fw-medium) var(--text-sm)/1.3 var(--font-mono)'
                        : `${ci === 0 ? 'var(--fw-semibold)' : 'var(--fw-regular)'} var(--text-sm)/1.35 var(--font-ui)`,
                      color: ci === 0 ? 'var(--text-strong)' : 'var(--text-body)',
                      fontVariantNumeric: c.mono ? 'tabular-nums' : undefined,
                    }}
                  >
                    {c.render ? c.render(r, i) : r[c.key]}
                  </td>
                ))}
              </tr>
            ); })}
          </tbody>
          {totals && rows.length > 0 && (
            <tfoot>
              <tr style={{ height: h, background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-default)' }}>
                {columns.map((c, ci) => (
                  <td
                    key={c.key}
                    style={{
                      ...cell(c),
                      font: c.mono
                        ? 'var(--fw-bold) var(--text-sm)/1.3 var(--font-mono)'
                        : 'var(--fw-bold) var(--text-sm)/1.35 var(--font-ui)',
                      color: 'var(--text-strong)',
                      fontVariantNumeric: c.mono ? 'tabular-nums' : undefined,
                    }}
                  >
                    {ci === 0 && totals[c.key] == null ? 'Total' : totals[c.key]}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <Pager page={page} pageCount={pageCount} start={start} end={Math.min(start + (pageSize || rows.length), rows.length)} total={rows.length} onPage={setPage} />
    </div>
  );
}
