const FEATURE_ITEMS = [
  { icon: 'sparkles', color: 'var(--burgundy-700)', title: 'AI that knows your data', body: 'Ask a question in plain language and get an answer grounded in the records your team already maintains.' },
  { icon: 'workflow', color: 'var(--accent-teal)', title: 'Automations without code', body: 'Trigger updates, notifications and hand-offs the moment a record changes — no scripting, no glue services.' },
  { icon: 'layout-dashboard', color: 'var(--accent-blue)', title: 'Interfaces for every reader', body: 'Publish focused views so each team sees only the fields and records that matter to their work.' },
  { icon: 'shield-check', color: 'var(--accent-violet)', title: 'Governance built in', body: 'Field-level permissions, audit history and SSO come standard on Business and Enterprise plans.' }
];

const FEATURE_STATS = [['500k+', 'organizations building on MyBiz'], ['80%', 'of the Fortune 100 have a MyBiz workspace'], ['12m', 'average time to first working app']];

function FeatureSection() {
  const {Card, Icon, Badge} = window.MyBizDesignSystem_c77ec7;
  return (
    <>
      <section style={{ padding: 'var(--section-y) 40px', background: 'var(--surface-page)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40, marginBottom: 44 }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--burgundy-700)', marginBottom: 16 }}>Why MyBiz</div>
              <h2 style={{ font: 'var(--type-h1)', fontSize: 'var(--text-4xl)', letterSpacing: 'var(--ls-tighter)', color: 'var(--text-strong)', margin: 0, maxWidth: 620 }}>The workspace your operations already wanted to be</h2>
            </div>
            <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-muted)', maxWidth: 400, margin: 0 }}>
              Start from the data you have. Layer on the views, automations and AI your teams need — in the same place, with the same permissions.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {FEATURE_ITEMS.map(x => <Card key={x.title} icon={x.icon} iconColor={x.color} title={x.title} description={x.body} padding={24} />)}
          </div>
        </div>
      </section>
      <section style={{ padding: '72px 40px', background: 'var(--surface-shell)' }}>
        <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
          {FEATURE_STATS.map(([n, l]) => (
            <div key={n}>
              <div style={{ font: 'var(--font-display)', fontSize: 'var(--text-5xl)', lineHeight: 1, color: '#fff' }}>{n}</div>
              <div style={{ font: 'var(--type-body)', color: 'rgba(255,255,255,.66)', marginTop: 12 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
Object.assign(window, { FeatureSection });
