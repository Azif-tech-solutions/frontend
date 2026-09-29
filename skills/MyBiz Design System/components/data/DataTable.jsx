import React, { useState } from 'react';
import { Icon } from '../core/Icon.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';

export function DataTable({ columns = [], rows = [], selectable = true, showRowNumbers = true, onAddRow, style }) {
  const [selected, setSelected] = useState([]);
  const [hover, setHover] = useState(null);
  const toggle = i => setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
  const cellBase = { display: 'flex', alignItems: 'center', height: 'var(--row-h)', padding: '0 8px',
    borderRight: '1px solid var(--border-subtle)', font: 'var(--fw-regular) var(--text-sm)/1 var(--font-ui)',
    color: 'var(--text-body)', overflow: 'hidden', whiteSpace: 'nowrap' };
  const gutter = (showRowNumbers || selectable) ? 68 : 0;
  const template = `${gutter ? gutter + 'px ' : ''}${columns.map(c => (c.width || 160) + 'px').join(' ')}`;
  return (
    <div style={{ border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-card)', ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: template, background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
        {gutter > 0 && <div key="__gutter" style={{ ...cellBase, gap: 8, color: 'var(--text-subtle)' }}><Checkbox checked={selected.length === rows.length && rows.length > 0} indeterminate={selected.length > 0 && selected.length < rows.length} onChange={v => setSelected(v ? rows.map((_, i) => i) : [])} /></div>}
        {columns.map((c, ci) => (
          <div key={c.key ?? ci} style={{ ...cellBase, gap: 6, font: 'var(--fw-semibold) var(--text-sm)/1 var(--font-ui)', color: 'var(--text-muted)' }}>
            {c.icon && <Icon name={c.icon} size={13} color="var(--text-subtle)" />}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
          </div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
          style={{ display: 'grid', gridTemplateColumns: template, borderBottom: '1px solid var(--border-subtle)',
            background: selected.includes(i) ? 'var(--brand-subtle)' : hover === i ? 'var(--surface-hover)' : 'transparent',
            transition: 'background-color var(--dur-instant) var(--ease-standard)' }}>
          {gutter > 0 && (
            <div key="__gutter" style={{ ...cellBase, gap: 8, color: 'var(--text-subtle)', font: 'var(--type-mono)' }}>
              {(hover === i || selected.includes(i)) && selectable
                ? <Checkbox checked={selected.includes(i)} onChange={() => toggle(i)} />
                : <span style={{ width: 16, textAlign: 'center' }}>{showRowNumbers ? i + 1 : ''}</span>}
              {hover === i && <Icon name="maximize-2" size={12} color="var(--text-subtle)" />}
            </div>
          )}
          {columns.map((c, ci) => (
            <div key={c.key ?? ci} style={{ ...cellBase, fontWeight: ci === 0 ? 'var(--fw-semibold)' : 'var(--fw-regular)', color: ci === 0 ? 'var(--text-strong)' : 'var(--text-body)' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r[c.key]}</span>
            </div>
          ))}
        </div>
      ))}
      {onAddRow && (
        <div onClick={onAddRow} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 'var(--row-h)', padding: '0 8px',
          color: 'var(--text-subtle)', font: 'var(--type-ui)', cursor: 'pointer' }}>
          <Icon name="plus" size={14} /> Add record
        </div>
      )}
    </div>
  );
}
