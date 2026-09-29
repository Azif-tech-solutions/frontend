export function Section({ title, children, dimmed }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', padding: 20, opacity: dimmed ? 0.5 : 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{title}</span>
      {children}
    </div>
  )
}
