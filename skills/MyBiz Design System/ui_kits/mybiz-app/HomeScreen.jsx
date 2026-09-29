const HOME_RECENTS = [
  { name: 'Pipeline Radar', ws: 'Revenue Ops', when: 'Opened 2h ago', color: 'var(--burgundy-700)' },
  { name: 'Marketing Calendar', ws: 'Growth', when: 'Opened yesterday', color: 'var(--accent-teal)' },
  { name: 'Hiring Tracker', ws: 'People', when: 'Opened Jul 24', color: 'var(--accent-violet)' },
  { name: 'Vendor Contracts', ws: 'Finance', when: 'Opened Jul 21', color: 'var(--accent-amber)' }
];

function HomeScreen({ onOpenBase, onToast }) {
  const {Banner, Card, Button, Badge, Avatar, Icon} = window.MyBizDesignSystem_c77ec7;
  const [banner, setBanner] = React.useState(true);
  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1180 }}>
      <h1 style={{ font: 'var(--type-h1)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', margin: '0 0 20px' }}>Home</h1>
      {banner && (
        <Banner tone="brand" icon="sparkles" onDismiss={() => setBanner(false)} style={{ marginBottom: 20 }}
          title={<>Upgrade to the Team plan before your trial expires in <span style={{ color: 'var(--brand)' }}>13 days</span></>}
          actions={<><Button size="md" iconLeft="zap" onClick={() => onToast('Plan comparison opened')}>Upgrade</Button>
            <a href="#" onClick={e => { e.preventDefault(); onToast('Comparing plans'); }} style={{ font: 'var(--type-ui)' }}>Compare plans</a></>}>
          Keep the automations, interfaces and permissions your team already relies on.
        </Banner>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 34 }}>
        <Card interactive icon="sparkles" iconColor="var(--brand)" title="Start with AI" description="Describe a workflow and MyBiz builds the base." onClick={() => onToast('AI builder coming up')} />
        <Card interactive icon="table-2" iconColor="var(--accent-teal)" title="Start with templates" description="Pick a proven base and adapt it as you go." onClick={() => onToast('Template gallery opened')} />
        <Card interactive icon="upload" iconColor="var(--accent-blue)" title="Quickly upload" description="Migrate spreadsheets in a few minutes." onClick={() => onToast('Import started')} />
        <Card interactive icon="layout-grid" iconColor="var(--accent-violet)" title="Build on your own" description="Start blank and shape your ideal workflow." onClick={() => onToast('Blank base created')} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>Recently opened</span>
        <Badge tone="neutral">{HOME_RECENTS.length}</Badge>
        <div style={{ flex: 1 }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, font: 'var(--type-ui)', color: 'var(--text-muted)' }}>All workspaces <Icon name="chevron-down" size={14} /></span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {HOME_RECENTS.map(r => (
          <div key={r.name} onClick={() => onOpenBase()} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14, background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', cursor: 'pointer' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: r.color, color: '#fff', flex: '0 0 auto' }}>
              <Icon name="table-2" size={19} color="#fff" />
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', font: 'var(--fw-bold) var(--text-md)/1.2 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
              <span style={{ display: 'block', font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 3 }}>{r.ws} · {r.when}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
Object.assign(window, { HomeScreen });
