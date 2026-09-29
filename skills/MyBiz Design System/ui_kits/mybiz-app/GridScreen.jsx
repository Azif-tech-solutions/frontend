const GRID_COLS = [
  { key: 'name', label: 'Account name', icon: 'type', width: 190 },
  { key: 'tier', label: 'Tier', icon: 'circle-dot', width: 96 },
  { key: 'arr', label: 'Estimated ARR', icon: 'hash', width: 132 },
  { key: 'stage', label: 'Funding stage', icon: 'circle-dot', width: 132 },
  { key: 'emp', label: 'Employees', icon: 'hash', width: 108 },
  { key: 'owner', label: 'Account executive', icon: 'user', width: 168 },
  { key: 'last', label: 'Last interaction', icon: 'calendar', width: 136 }
];

// Plain data — JSX is built at render time so the bundle's namespace is populated.
const GRID_DATA = [
  ['Northwind Labs', ['amber', 'Tier 2'], '$4–4.5B', ['violet', 'IPO'], '7,500', 'Dana Reed', '05/15/2024'],
  ['Ardent Systems', ['rose', 'Tier 1'], '$600–700M', ['teal', 'Series F'], '2,500', 'Priya Nair', '02/20/2024'],
  ['Halcyon Data', ['rose', 'Tier 1'], '$100–300M', ['blue', 'Series D'], '800', 'Sam Ortiz', '03/30/2024'],
  ['Cobalt Studio', ['green', 'Tier 3'], '$3–4B', ['teal', 'Series F'], '5,000', 'Dana Reed', '07/04/2024'],
  ['Meridian Cloud', ['rose', 'Tier 1'], '$3–4B', ['amber', 'Series J'], '8,000', 'Lee Chan', '08/19/2024'],
  ['Verity Analytics', ['rose', 'Tier 1'], '$500–560M', ['green', 'Series C'], '2,500', 'Priya Nair', '01/25/2024'],
  ['Kestrel Health', ['green', 'Tier 3'], '$1–1.25B', ['violet', 'IPO'], '3,400', 'Sam Ortiz', '06/11/2024'],
  ['Junipero Works', ['green', 'Tier 3'], '$250–300M', ['teal', 'Series E'], '900', 'Lee Chan', '09/09/2024']
];

function GridScreen({ onToast }) {
  const {SidebarItem, Tabs, DataTable, FilterChip, Tag, Button, IconButton, Icon, Avatar, Badge} = window.MyBizDesignSystem_c77ec7;
  const [view, setView] = React.useState('grid');
  const rows = GRID_DATA.map(([name, tier, arr, stage, emp, ae, last]) => ({
    name,
    tier: <Tag color={tier[0]}>{tier[1]}</Tag>,
    arr,
    stage: <Tag color={stage[0]}>{stage[1]}</Tag>,
    emp,
    owner: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Avatar name={ae} size="xs" />{ae}</span>,
    last
  }));
  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <div style={{ width: 236, flex: '0 0 auto', background: 'var(--surface-page)', borderRight: '1px solid var(--border-default)', padding: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 6px 14px' }}>
          <Avatar name="Pipeline Radar" square size="md" />
          <span style={{ font: 'var(--fw-bold) var(--text-md)/1.2 var(--font-ui)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>Pipeline Radar</span>
          <Icon name="chevron-down" size={15} color="var(--text-muted)" />
        </div>
        <SidebarItem icon="briefcase" label="Accounts HQ" />
        <SidebarItem label="Top targets" level={1} active />
        <SidebarItem label="Dashboard" level={1} />
        <SidebarItem label="All accounts" level={1} />
        <SidebarItem label="Account calendar" level={1} />
        <SidebarItem icon="handshake" label="Opportunities" />
        <SidebarItem icon="target" label="Initiatives" />
        <SidebarItem icon="calendar-days" label="Interactions" trailing={<Badge tone="brand">3</Badge>} />
        <div style={{ flex: 1 }} />
        <SidebarItem icon="plus" label="Add a table" />
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px', borderBottom: '1px solid var(--border-default)' }}>
          <Tabs value={view} onChange={setView} style={{ border: 'none', flex: 1 }}
            tabs={[{ value: 'grid', label: 'Grid', icon: 'table-2' }, { value: 'cal', label: 'Calendar', icon: 'calendar' }, { value: 'kan', label: 'Kanban', icon: 'columns-3' }, { value: 'form', label: 'Form', icon: 'clipboard-list' }]} />
          <Button size="sm" variant="secondary" iconLeft="share-2" onClick={() => onToast('Share dialog opened')}>Share</Button>
          <Button size="sm" iconLeft="sparkles" onClick={() => onToast('Ask MyBiz is thinking…')}>Ask MyBiz</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'var(--surface-sunken)', borderBottom: '1px solid var(--border-default)', flexWrap: 'wrap' }}>
          <FilterChip field="Tier" />
          <FilterChip field="Account executive" />
          <FilterChip field="Risk level" operator="is" value={<Tag color="rose">High</Tag>} active />
          <FilterChip field="Recently funded" operator="is" value={<Icon name="check" size={14} color="var(--success)" />} />
          <div style={{ flex: 1 }} />
          <IconButton icon="arrow-up-down" label="Sort" variant="outline" />
          <IconButton icon="eye-off" label="Hide fields" variant="outline" />
          <IconButton icon="rows-3" label="Row height" variant="outline" />
        </div>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 16 }}>
          <div style={{ font: 'var(--type-h2)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', marginBottom: 12 }}>High growth targets</div>
          <DataTable columns={GRID_COLS} rows={rows} onAddRow={() => onToast('Record added to Top targets')} />
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 10 }}>8 of 412 records · showing an abbreviated set</div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { GridScreen });
