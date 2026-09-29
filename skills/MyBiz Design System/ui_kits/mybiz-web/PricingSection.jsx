const PRICING_PLANS = [
  { name: 'Free', price: '$0', per: 'per user / month', blurb: 'For individuals mapping out a first workflow.', feats: ['Unlimited bases', '1,000 records per base', 'Grid, calendar and form views'], cta: 'Start for free', variant: 'secondary' },
  { name: 'Team', price: '$24', per: 'per user / month', blurb: 'For teams running recurring operations together.', feats: ['50,000 records per base', 'Automations and interfaces', 'Standard AI credits', 'Field-level permissions'], cta: 'Start free trial', variant: 'primary', featured: true },
  { name: 'Business', price: '$54', per: 'per user / month', blurb: 'For departments that need governance.', feats: ['250,000 records per base', 'SSO and SCIM provisioning', 'Admin panel and audit log', 'Priority support'], cta: 'Talk to sales', variant: 'secondary' }
];

function PricingSection({ onCta }) {
  const {Button, Badge, Icon, Radio} = window.MyBizDesignSystem_c77ec7;
  const [annual, setAnnual] = React.useState(true);
  return (
    <section style={{ padding: 'var(--section-y) 40px', background: 'var(--surface-sunken)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ font: 'var(--type-h1)', fontSize: 'var(--text-4xl)', letterSpacing: 'var(--ls-tighter)', color: 'var(--text-strong)', margin: 0 }}>Plans that scale with the work</h2>
        <div style={{ display: 'inline-flex', gap: 26, marginTop: 26, padding: '10px 18px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-full)' }}>
          <Radio label="Billed annually" checked={annual} onChange={() => setAnnual(true)} />
          <Radio label="Billed monthly" checked={!annual} onChange={() => setAnnual(false)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginTop: 40, textAlign: 'left' }}>
          {PRICING_PLANS.map(p => (
            <div key={p.name} style={{ display: 'flex', flexDirection: 'column', padding: 26, background: 'var(--surface-card)',
              border: `1px solid ${p.featured ? 'var(--brand-border)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-panel)',
              boxShadow: p.featured ? 'var(--shadow-lg)' : 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>{p.name}</span>
                {p.featured && <Badge tone="brand" uppercase>Most popular</Badge>}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
                <span style={{ font: 'var(--font-display)', fontSize: 'var(--text-5xl)', lineHeight: 1, color: 'var(--text-strong)' }}>
                  {annual ? p.price : '$' + (parseInt(p.price.slice(1), 10) === 0 ? 0 : parseInt(p.price.slice(1), 10) + 6)}
                </span>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{p.per}</span>
              </div>
              <p style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: '12px 0 20px' }}>{p.blurb}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
                {p.feats.map(x => (
                  <span key={x} style={{ display: 'flex', gap: 8, font: 'var(--type-ui)', color: 'var(--text-body)' }}>
                    <Icon name="check" size={15} color="var(--brand)" />{x}
                  </span>
                ))}
              </div>
              <Button fullWidth size="lg" variant={p.variant} style={{ marginTop: 24 }} onClick={onCta}>{p.cta}</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { PricingSection });
