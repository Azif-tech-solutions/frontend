function Sidebar({ route, onNavigate }) {
  const {SidebarItem, Button, Icon, IconButton, Badge} = window.MyBizDesignSystem_c77ec7;
  return (
    <div style={{ width: 'var(--sidebar-w)', flex: '0 0 auto', borderRight: '1px solid var(--border-default)', background: 'var(--surface-page)', display: 'flex', flexDirection: 'column', padding: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SidebarItem icon="house" label="Home" active={route === 'home'} onClick={() => onNavigate('home')} />
        <SidebarItem icon="star" label="Starred" trailing={<Icon name="chevron-right" size={15} />} />
        <SidebarItem icon="share-2" label="Shared" />
        <SidebarItem icon="users" label="Workspaces" trailing={<span style={{ display: 'flex', gap: 2 }}><IconButton icon="plus" label="New workspace" size="sm" /><Icon name="chevron-down" size={15} /></span>} />
        <SidebarItem label="Revenue Ops" level={1} trailing={<Badge>4</Badge>} />
        <SidebarItem label="Pipeline Radar" level={1} active={route === 'grid'} onClick={() => onNavigate('grid')} />
        <SidebarItem label="Marketing Calendar" level={1} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
        <SidebarItem icon="book-open" label="Templates and apps" />
        <SidebarItem icon="store" label="Marketplace" />
        <SidebarItem icon="upload" label="Import" />
      </div>
      <Button fullWidth size="lg" iconLeft="plus" style={{ marginTop: 12 }}>Create</Button>
    </div>
  );
}
Object.assign(window, { Sidebar });
