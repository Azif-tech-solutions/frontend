const FOOTER_COLS = [
  ['Platform', ['Bases and views', 'Automations', 'Interfaces', 'MyBiz AI', 'Integrations']],
  ['Solutions', ['Revenue operations', 'Marketing', 'Product', 'Finance', 'People']],
  ['Resources', ['Templates', 'Guides', 'Community', 'Developer docs', 'Support']],
  ['Company', ['About', 'Careers', 'Newsroom', 'Security', 'Contact']]
];

function SiteFooter({ onCta }) {
  const {Button, Input} = window.MyBizDesignSystem_c77ec7;
  return (
    <>
      <section style={{ padding: '84px 40px', background: 'var(--gradient-brand)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ font: 'var(--font-display)', fontSize: 'var(--text-5xl)', lineHeight: 1.1, letterSpacing: 'var(--ls-tight)', color: '#fff', margin: 0 }}>Put your next workflow in one place</h2>
          <p style={{ font: 'var(--type-body-lg)', color: 'rgba(255,255,255,.72)', margin: '18px auto 30px', maxWidth: 520 }}>Free to start. No credit card, no implementation project.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button size="lg" variant="secondary" onClick={onCta}>Get started for free</Button>
            <Button size="lg" variant="ghost" style={{ color: '#fff', border: '1px solid rgba(255,255,255,.32)' }} onClick={onCta}>Book demo</Button>
          </div>
        </div>
      </section>
      <footer style={{ padding: '56px 40px 40px', background: 'var(--surface-page)', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr repeat(4,1fr)', gap: 32 }}>
          <div>
            <img src="../../assets/logo.svg" width="124" height="27" alt="MyBiz" />
            <p style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', maxWidth: 240, marginTop: 14 }}>Product notes and workflow teardowns, once a month.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, maxWidth: 280 }}>
              <Input placeholder="you@company.com" style={{ flex: 1 }} />
              <Button variant="secondary">Subscribe</Button>
            </div>
          </div>
          {FOOTER_COLS.map(([h, items]) => (
            <div key={h}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: 14 }}>{h}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {items.map(i => <span key={i} style={{ font: 'var(--type-ui)', color: 'var(--text-body)', cursor: 'pointer' }}>{i}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 'var(--content-max)', margin: '38px auto 0', paddingTop: 20, borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 20, font: 'var(--type-caption)', color: 'var(--text-subtle)' }}>
          <span>© 2026 MyBiz, Inc.</span><span>Terms</span><span>Privacy</span><span>Cookie preferences</span>
        </div>
      </footer>
    </>
  );
}
Object.assign(window, { SiteFooter });
