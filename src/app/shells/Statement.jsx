import { Icon } from '../../ds/components/core/Icon.jsx'

/**
 * Financial-statement layout: grouped line sections with subtotals and a result line.
 * Used by Cash Inflow/Outflow, SCI, and the VAT reports — figures that must read as a
 * statement, not a flat table.
 *
 * sections: { title, tone?: 'positive'|'negative', rows: [{ label, note?, values: [] }],
 *             subtotal: { label, values: [] } }[]
 * result:   { label, values: [], note? }
 * columns:  column headings, e.g. ['This period', 'Prior period']
 */
export function Statement({ columns = ['Amount'], sections = [], result, compareLabel = 'Change' }) {
  const showCompare = columns.length > 1

  const figure = (v, opts = {}) => (
    <span style={{
      font: `${opts.bold ? 'var(--fw-bold)' : 'var(--fw-medium)'} ${opts.big ? 'var(--text-md)' : 'var(--text-sm)'}/1.4 var(--font-mono)`,
      fontVariantNumeric: 'tabular-nums',
      color: opts.tone === 'negative' ? 'var(--danger)' : opts.tone === 'positive' ? 'var(--success)' : opts.muted ? 'var(--text-muted)' : 'var(--text-strong)',
    }}>{v}</span>
  )

  const cols = `minmax(0, 1fr) ${columns.map(() => '160px').join(' ')}${showCompare ? ' 120px' : ''}`

  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: showCompare ? 720 : 520 }}>
          {/* Column headings */}
          <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, padding: '10px 20px', background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)' }}>
            <span />
            {columns.map((c) => (
              <span key={c} style={{ textAlign: 'right', font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{c}</span>
            ))}
            {showCompare && (
              <span style={{ textAlign: 'right', font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{compareLabel}</span>
            )}
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <div style={{ padding: '14px 20px 8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {s.tone === 'positive' && <Icon name="arrow-down-left" size={12} color="var(--success)" />}
                  {s.tone === 'negative' && <Icon name="arrow-up-right" size={12} color="var(--danger)" />}
                  {s.title}
                </span>
              </div>

              {s.rows.map((r) => (
                <div key={r.label} style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, padding: '8px 20px', alignItems: 'baseline' }}>
                  <span style={{ font: 'var(--fw-regular) var(--text-sm)/1.4 var(--font-ui)', color: 'var(--text-body)' }}>
                    {r.label}
                    {r.note && <span style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginLeft: 8 }}>{r.note}</span>}
                  </span>
                  {r.values.map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' }}>{figure(v, { muted: i > 0 })}</span>
                  ))}
                  {showCompare && <span style={{ textAlign: 'right' }}>{figure(r.change ?? '—', { muted: true, tone: r.changeTone })}</span>}
                </div>
              ))}

              {s.subtotal && (
                <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, padding: '10px 20px', alignItems: 'baseline', borderTop: '1px solid var(--border-subtle)', marginTop: 4 }}>
                  <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.4 var(--font-ui)', color: 'var(--text-strong)' }}>{s.subtotal.label}</span>
                  {s.subtotal.values.map((v, i) => (
                    <span key={i} style={{ textAlign: 'right' }}>{figure(v, { bold: true, muted: i > 0 })}</span>
                  ))}
                  {showCompare && <span style={{ textAlign: 'right' }}>{figure(s.subtotal.change ?? '—', { bold: true, tone: s.subtotal.changeTone })}</span>}
                </div>
              )}
            </div>
          ))}

          {result && (
            <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 16, padding: '16px 20px', alignItems: 'baseline', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-default)' }}>
              <span>
                <span style={{ font: 'var(--fw-bold) var(--text-md)/1.3 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{result.label}</span>
                {result.note && <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{result.note}</div>}
              </span>
              {result.values.map((v, i) => (
                <span key={i} style={{ textAlign: 'right' }}>{figure(v, { bold: true, big: true, muted: i > 0, tone: i === 0 ? result.tone : undefined })}</span>
              ))}
              {showCompare && <span style={{ textAlign: 'right' }}>{figure(result.change ?? '—', { bold: true, tone: result.changeTone })}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
