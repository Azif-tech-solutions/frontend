import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { PageHeader } from './PageHeader.jsx'
import { Toolbar } from './FilterBar.jsx'
import { Page, Panel, StatRow, EmptyState } from './Page.jsx'

/**
 * The archetype behind list/register screens (Dealer Register, Bank Register, Price List,
 * Pending Trade, Debtors List…): header → tabs → toolbar → table, with a primary create action.
 */
export function RegisterShell({
  crumbs, title, description, icon,
  createLabel, onCreate, headerActions,
  tabs, tab, onTabChange,
  searchPlaceholder = 'Search records…', filters,
  stats, columns = [], rows = [], totals, onRowClick,
  emptyTitle = 'Nothing registered yet', emptyDescription, emptyAction,
  children, footnote, wide, pageSize, exportLabel = 'Export',
}) {
  const [search, setSearch] = useState('')
  const doExport = useTableExport({ columns, rows, totals, title, emptyHint: 'This register has no records yet.' })

  return (
    <Page wide={wide}>
      <PageHeader
        crumbs={crumbs}
        title={title}
        description={description}
        icon={icon}
        actions={headerActions ?? (createLabel ? <Button iconLeft="plus" onClick={onCreate}>{createLabel}</Button> : null)}
      />

      {stats && stats.length > 0 && <StatRow stats={stats} />}

      {tabs && <Tabs tabs={tabs} value={tab} onChange={onTabChange} />}

      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder={searchPlaceholder}
        filters={filters}
        actions={<ExportButton label={exportLabel} onExport={doExport} />}
      />

      {children}

      <Panel padding={0}>
        {rows.length === 0 ? (
          <EmptyState
            icon="folder-open"
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction ?? (createLabel ? <Button iconLeft="plus" onClick={onCreate}>{createLabel}</Button> : null)}
          />
        ) : (
          <ReportTable columns={columns} rows={rows} totals={totals} onRowClick={onRowClick} pageSize={pageSize} stickyHeader={false} style={{ border: 'none', borderRadius: 0 }} />
        )}
      </Panel>

      {footnote && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>{footnote}</div>}
    </Page>
  )
}
