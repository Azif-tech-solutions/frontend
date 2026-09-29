const HERO_COLS = [
  { key: 'name', label: 'Account name', icon: 'type', width: 176 },
  { key: 'tier', label: 'Tier', icon: 'circle-dot', width: 92 },
  { key: 'arr', label: 'Estimated ARR', icon: 'hash', width: 126 },
  { key: 'stage', label: 'Funding stage', icon: 'circle-dot', width: 126 },
  { key: 'emp', label: 'Employees', icon: 'hash', width: 104 },
  { key: 'site', label: 'Website', icon: 'link', width: 168 }
];

// Plain data — JSX is built at render time so the bundle's namespace is populated.
const HERO_DATA = [
  ['Northwind Labs', ['amber', 'Tier 2'], '$4–4.5B', ['violet', 'IPO'], '7,500', 'northwindlabs.com'],
  ['Ardent Systems', ['rose', 'Tier 1'], '$600–700M', ['teal', 'Series F'], '2,500', 'ardent.systems'],
  ['Halcyon Data', ['rose', 'Tier 1'], '$100–300M', ['blue', 'Series D'], '800', 'halcyondata.io'],
  ['Cobalt Studio', ['green', 'Tier 3'], '$3–4B', ['teal', 'Series F'], '5,000', 'cobalt.studio'],
  ['Meridian Cloud', ['rose', 'Tier 1'], '$3–4B', ['amber', 'Series J'], '8,000', 'meridiancloud.com']
];

function Hero({ onCta, onPrompt }) {
  const {Button, Icon, Tag, DataTable, SidebarItem, Avatar} = window.MyBizDesignSystem_c77ec7;
  const [prompt, setPrompt] = React.useState('Surface top accounts with up-to-date signals.');
  const rows = HERO_DATA.map(([name, tier, arr, stage, emp, site]) => ({
    name, arr, emp, site,
    tier: <Tag color={tier[0]}>{tier[1]}</Tag>,
    stage: <Tag color={stage[0]}>{stage[1]}</Tag>
  }));
  return (
    <section style={{ padding: '80px 40px 0', background: 'var(--gradient-warm-wash)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--burgundy-700)', marginBottom: 20 }}>The connected workspace</div>
        <h1 style={{ font: 'var(--type-display)', fontSize: 'var(--text-6xl)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', margin: 0 }}>
          All your teams, all their workflows —<br /><span style={{ fontStyle: 'italic', color: 'var(--burgundy-700)' }}>connected in one workspace</span>
        </h1>
        <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-muted)', maxWidth: 640, margin: '24px auto 0' }}>
          Build AI-powered workflows that unify your data, keep collaboration in one place, and set your teams up for long-term success. No code required.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
          <Button size="lg" onClick={onCta}>Get started for free</Button>
          <Button size="lg" variant="secondary" onClick={onCta}>Book demo</Button>
        </div>
      </div>
      <div style={{ maxWidth: 1180, margin: '64px auto 0', background: 'var(--burgundy-100)', borderRadius: 'var(--radius-3xl) var(--radius-3xl) 0 0', padding: '40px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 720, margin: '0 auto 32px', background: 'var(--surface-card)', border: '1px solid var(--n-0)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-lg)', padding: '18px 18px 18px 22px' }}>
          <input value={prompt} onChange={e => setPrompt(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'var(--fw-regular) var(--text-xl)/1.3 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }} />
          <button onClick={() => onPrompt(prompt)} aria-label="Build it"
            style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--brand)', border: 'none', cursor: 'pointer', flex: '0 0 auto' }}>
            <Icon name="arrow-right" size={18} color="#fff" />
          </button>
        </div>
        <div style={{ display: 'flex', background: 'var(--surface-card)', borderRadius: 'var(--radius-panel) var(--radius-panel) 0 0', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', height: 330 }}>
          <div style={{ width: 220, background: 'var(--surface-page)', borderRight: '1px solid var(--border-default)', padding: 12, flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 6px 14px' }}>
              <Avatar name="Pipeline Radar" square size="sm" />
              <span style={{ font: 'var(--fw-bold) var(--text-sm)/1.2 var(--font-ui)', color: 'var(--text-strong)' }}>Pipeline Radar</span>
            </div>
            <SidebarItem icon="briefcase" label="Accounts HQ" />
            <SidebarItem label="Top targets" level={1} active />
            <SidebarItem label="Dashboard" level={1} />
            <SidebarItem label="All accounts" level={1} />
            <SidebarItem icon="handshake" label="Opportunities" />
            <SidebarItem icon="target" label="Initiatives" />
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: 18, overflow: 'hidden' }}>
            <div style={{ font: 'var(--type-h3)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', marginBottom: 12 }}>High growth targets</div>
            <DataTable columns={HERO_COLS} rows={rows} />
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
