const HEADER_NAV = ['Platform', 'Solutions', 'Resources', 'Enterprise', 'Pricing'];

function SiteHeader({ onCta }) {
  const {Button, Icon} = window.MyBizDesignSystem_c77ec7;
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 26, height: 72, padding: '0 40px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-page)', position: 'sticky', top: 0, zIndex: 20 }}>
      <img src="../../assets/logo.svg" width="134" height="29" alt="MyBiz" />
      <nav style={{ display: 'flex', alignItems: 'center', gap: 22, flex: 1 }}>
        {HEADER_NAV.map((n, i) => (
          <span key={n} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, font: 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', cursor: 'pointer' }}>
            {n}{i < 3 && <Icon name="chevron-right" size={14} color="var(--text-subtle)" />}
          </span>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button size="lg" variant="secondary" onClick={onCta}>Book demo</Button>
        <Button size="lg" variant="inverse" onClick={onCta}>Sign up for free</Button>
        <span style={{ font: 'var(--fw-semibold) var(--text-md)/1 var(--font-ui)', color: 'var(--text-strong)', cursor: 'pointer' }}>Log in</span>
      </div>
    </header>
  );
}
Object.assign(window, { SiteHeader });
