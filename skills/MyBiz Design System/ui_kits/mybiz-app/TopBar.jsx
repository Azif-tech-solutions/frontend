function TopBar({ onToggleSidebar }) {
  const {IconButton, Avatar, Icon, Tooltip} = window.MyBizDesignSystem_c77ec7;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 'var(--topbar-h)', padding: '0 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--surface-page)', flex: '0 0 auto' }}>
      <IconButton icon="menu" label="Toggle sidebar" onClick={onToggleSidebar} />
      <img src="../../assets/logo.svg" width="118" height="26" alt="MyBiz" style={{ marginLeft: 2 }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 460, height: 34, padding: '0 12px', background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)' }}>
          <Icon name="search" size={15} color="var(--text-subtle)" />
          <span style={{ flex: 1, font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>Search…</span>
          <span style={{ font: 'var(--type-mono)', fontSize: 11, color: 'var(--text-subtle)' }}>⌘K</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, font: 'var(--type-ui)', color: 'var(--text-muted)', paddingRight: 4 }}>
          <Icon name="circle-help" size={15} /> Help
        </div>
        <Tooltip label="Notifications"><IconButton icon="bell" label="Notifications" /></Tooltip>
        <Avatar name="Alex Smith" size="sm" style={{ marginLeft: 4 }} />
      </div>
    </div>
  );
}
Object.assign(window, { TopBar });
