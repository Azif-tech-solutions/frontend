import { Icon } from '../../ds/components/core/Icon.jsx'

/**
 * Printable paper sheet behind Waybill, Pro-Forma Invoice, Invoice, and Transaction Receipt.
 * `meta` renders as two label:value columns; `lines` is the itemised body.
 */
export function DocumentSheet({
  docType, docNumber, issuer = {}, party = {}, meta = [], columns = [], lines = [],
  totals = [], stamp, footer, watermark,
}) {
  return (
    <div style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', maxWidth: 820, width: '100%',
      position: 'relative', overflow: 'hidden',
    }}>
      {watermark && (
        <span style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none',
          font: 'var(--fw-extrabold) 88px/1 var(--font-ui)', letterSpacing: 'var(--ls-widest)',
          color: 'var(--n-100)', transform: 'rotate(-22deg)', textTransform: 'uppercase', userSelect: 'none',
        }}>{watermark}</span>
      )}

      <div style={{ position: 'relative', padding: '26px 30px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'flex-start', gap: 24 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: 'var(--fw-bold) var(--text-lg)/1.2 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{issuer.name || 'Company Name'}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.6 }}>
            {issuer.address || 'Address line, City, State'}<br />
            {issuer.contact || 'contact@company.com · +234 000 0000 000'}
            {issuer.vatId && <><br />VAT ID: {issuer.vatId}</>}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{docType}</div>
          <div style={{ marginTop: 6, font: 'var(--fw-bold) var(--text-lg)/1.1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>{docNumber}</div>
          {stamp && <div style={{ marginTop: 10, display: 'inline-flex' }}>{stamp}</div>}
        </div>
      </div>

      <div style={{ position: 'relative', padding: '20px 30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 8 }}>Issued to</div>
          <div style={{ font: 'var(--fw-semibold) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)' }}>{party.name || '—'}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.6 }}>
            {party.address}{party.address && <br />}{party.contact}
          </div>
        </div>
        {meta.map((m) => (
          <div key={m.label}>
            <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 8 }}>{m.label}</div>
            <div style={{ font: `var(--fw-semibold) var(--text-sm)/1.5 ${m.mono ? 'var(--font-mono)' : 'var(--font-ui)'}`, color: 'var(--text-strong)' }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={{
                  height: 34, padding: '0 30px', textAlign: c.align || 'left', width: c.width,
                  font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-wide)', textTransform: 'uppercase',
                  color: 'var(--text-muted)', background: 'var(--surface-sunken)',
                  borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap',
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {columns.map((c, ci) => (
                  <td key={c.key} style={{
                    height: 38, padding: '0 30px', textAlign: c.align || 'left',
                    font: c.mono ? 'var(--fw-medium) var(--text-sm)/1.4 var(--font-mono)' : `${ci === 0 ? 'var(--fw-semibold)' : 'var(--fw-regular)'} var(--text-sm)/1.4 var(--font-ui)`,
                    fontVariantNumeric: c.mono ? 'tabular-nums' : undefined,
                    color: ci === 0 ? 'var(--text-strong)' : 'var(--text-body)', whiteSpace: 'nowrap',
                  }}>{c.render ? c.render(l) : l[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totals.length > 0 && (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', padding: '18px 30px', borderBottom: footer ? '1px solid var(--border-subtle)' : 'none' }}>
          <div style={{ width: 'min(320px, 100%)' }}>
            {totals.map((t) => (
              <div key={t.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20,
                padding: '7px 0',
                borderTop: t.emphasis ? '1px solid var(--border-default)' : 'none',
                marginTop: t.emphasis ? 5 : 0,
              }}>
                <span style={{ font: `${t.emphasis ? 'var(--fw-bold)' : 'var(--fw-medium)'} var(--text-sm)/1.4 var(--font-ui)`, color: t.emphasis ? 'var(--text-strong)' : 'var(--text-muted)' }}>{t.label}</span>
                <span style={{
                  font: `${t.emphasis ? 'var(--fw-bold) var(--text-md)' : 'var(--fw-semibold) var(--text-sm)'}/1.4 var(--font-mono)`,
                  fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)',
                }}>{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {footer && (
        <div style={{ position: 'relative', padding: '18px 30px', display: 'flex', alignItems: 'center', gap: 10, font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.6 }}>
          <Icon name="info" size={13} color="var(--text-subtle)" style={{ flex: '0 0 auto' }} />
          <span>{footer}</span>
        </div>
      )}
    </div>
  )
}
