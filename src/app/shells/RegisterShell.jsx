// import { useState } from 'react'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
// import { useTableExport } from '../useTableExport.js'
// import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
// import { PageHeader } from './PageHeader.jsx'
// import { Toolbar } from './FilterBar.jsx'
// import { Page, Panel, StatRow, EmptyState } from './Page.jsx'
// //registershell .jsx 
// /**
//  * The archetype behind list/register screens (Dealer Register, Bank Register, Price List,
//  * Pending Trade, Debtors List…): header → tabs → toolbar → table, with a primary create action.
//  */
// export function RegisterShell({
//   crumbs, title, description, icon,
//   createLabel, onCreate, headerActions,
//   tabs, tab, onTabChange,
//   searchPlaceholder = 'Search records…', filters,
//   stats, columns = [], rows = [], totals, onRowClick,
//   emptyTitle = 'Nothing registered yet', emptyDescription, emptyAction,
//   children, footnote, wide, pageSize, exportLabel = 'Export',
// }) {
//   const [search, setSearch] = useState('')
//   const doExport = useTableExport({ columns, rows, totals, title, emptyHint: 'This register has no records yet.' })

//   return (
//     <Page wide={wide}>
//       <PageHeader
//         crumbs={crumbs}
//         title={title}
//         description={description}
//         icon={icon}
//         actions={headerActions ?? (createLabel ? <Button iconLeft="plus" onClick={onCreate}>{createLabel}</Button> : null)}
//       />

//       {stats && stats.length > 0 && <StatRow stats={stats} />}

//       {tabs && <Tabs tabs={tabs} value={tab} onChange={onTabChange} />}

//       <Toolbar
//         search={search}
//         onSearch={setSearch}
//         placeholder={searchPlaceholder}
//         filters={filters}
//         actions={<ExportButton label={exportLabel} onExport={doExport} />}
//       />

//       {children}

//       <Panel padding={0}>
//         {rows.length === 0 ? (
//           <EmptyState
//             icon="folder-open"
//             title={emptyTitle}
//             description={emptyDescription}
//             action={emptyAction ?? (createLabel ? <Button iconLeft="plus" onClick={onCreate}>{createLabel}</Button> : null)}
//           />
//         ) : (
//           <ReportTable columns={columns} rows={rows} totals={totals} onRowClick={onRowClick} pageSize={pageSize} stickyHeader={false} style={{ border: 'none', borderRadius: 0 }} />
//         )}
//       </Panel>

//       {footnote && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>{footnote}</div>}
//     </Page>
//   )
// }


import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { PageHeader } from './PageHeader.jsx'
import { Toolbar } from './FilterBar.jsx'
import { Page, Panel, StatRow, EmptyState } from './Page.jsx'
//registershell .jsx

/**
 * Case-insensitive "contains" match of `search` against the given row keys.
 * Only text and numbers are searched; React elements (action buttons, badges)
 * are skipped, so rows that carry JSX cells are safe.
 */
function filterRows(rows, keys, search) {
  const q = search.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) =>
    keys.some((key) => {
      const value = row[key]
      return (typeof value === 'string' || typeof value === 'number') && String(value).toLowerCase().includes(q)
    })
  )
}

/**
 * The archetype behind list/register screens (Dealer Register, Bank Register, Price List,
 * Pending Trade, Debtors List…): header → tabs → toolbar → table, with a primary create action.
 *
 * Search runs on the client against the rows the page passes in:
 *   searchKeys  which row keys the search box looks at (default: every column)
 *   searchable  set to false to turn the box off, e.g. for a page that searches itself
 * Pages that pass neither keep working: the box now filters their rows by any column.
 */
export function RegisterShell({
  crumbs, title, description, icon,
  createLabel, onCreate, headerActions,
  tabs, tab, onTabChange,
  searchPlaceholder = 'Search records…', filters,
  stats, columns = [], rows = [], totals, onRowClick,
  emptyTitle = 'Nothing registered yet', emptyDescription, emptyAction,
  children, footnote, wide, pageSize, exportLabel = 'Export',
  searchable = true, searchKeys,
}) {
  const [search, setSearch] = useState('')

  // What the table (and the export) shows. `rows` itself is untouched, so a
  // page's own stats and totals still describe the full set.
  const visibleRows = searchable ? filterRows(rows, searchKeys ?? columns.map((c) => c.key), search) : rows

  const doExport = useTableExport({ columns, rows: visibleRows, totals, title, emptyHint: 'This register has no records yet.' })

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
        ) : visibleRows.length === 0 ? (
          // Records exist, but none match the search box.
          <EmptyState icon="search" title="No matches" description={`Nothing matches "${search.trim()}".`} />
        ) : (
          <ReportTable columns={columns} rows={visibleRows} totals={totals} onRowClick={onRowClick} pageSize={pageSize} stickyHeader={false} style={{ border: 'none', borderRadius: 0 }} />
        )}
      </Panel>

      {footnote && <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>{footnote}</div>}
    </Page>
  )
}