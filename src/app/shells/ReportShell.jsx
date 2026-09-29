import { useState } from 'react'
import { Button } from '../../ds/components/core/Button.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { ExportButton } from '../../ds/components/data/ExportButton.jsx'
import { useTableExport } from '../useTableExport.js'
import { Tabs } from '../../ds/components/navigation/Tabs.jsx'
import { PageHeader } from './PageHeader.jsx'
import { FilterBar } from './FilterBar.jsx'
import { Page, Panel, StatRow, EmptyState } from './Page.jsx'

/**
 * The archetype behind every "…Report" / "…Card" / "…Statement" screen in the PRD:
 * header → filter bar → optional KPI strip → results table with export.
 */
export function ReportShell({
  crumbs, title, description, icon, headerActions, meta,
  tabs, tab, onTabChange,
  filters = [], filterValues, onFilterChange, onGenerate, onReset,
  stats, columns = [], rows = [], totals,
  tableTitle = 'Results', tableActions, emptyTitle = 'No records for these filters',
  emptyDescription = 'Adjust the filters above and generate again.',
  footnote, children, wide, pageSize, exportLabel = 'Export',
}) {
  const [values, setValues] = useState(filterValues || {})
  const handle = onFilterChange || ((k, v) => setValues((s) => ({ ...s, [k]: v })))
  const doExport = useTableExport({ columns, rows, totals, title, emptyHint: 'Generate a report with at least one row first.' })

  return (
    <Page wide={wide}>
      <PageHeader
        crumbs={crumbs}
        title={title}
        description={description}
        icon={icon}
        meta={meta}
        actions={headerActions ?? (
          <>
            <Button variant="secondary" iconLeft="printer" onClick={() => window.print()}>Print</Button>
            <ExportButton label={exportLabel} onExport={doExport} />
          </>
        )}
      />

      {tabs && <Tabs tabs={tabs} value={tab} onChange={onTabChange} />}

      {filters.length > 0 && (
        <FilterBar fields={filters} values={filterValues || values} onChange={handle} onGenerate={onGenerate || (() => {})} onReset={onReset || (() => {})} />
      )}

      {stats && stats.length > 0 && <StatRow stats={stats} />}

      {children}

      <Panel
        title={tableTitle}
        description={rows.length ? `${rows.length} record${rows.length === 1 ? '' : 's'}` : undefined}
        actions={tableActions}
        padding={0}
      >
        {rows.length === 0 ? (
          <EmptyState icon="file-search" title={emptyTitle} description={emptyDescription} />
        ) : (
          <ReportTable columns={columns} rows={rows} totals={totals} pageSize={pageSize} stickyHeader={false} style={{ border: 'none', borderRadius: 0 }} />
        )}
      </Panel>

      {footnote && (
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>{footnote}</div>
      )}
    </Page>
  )
}
