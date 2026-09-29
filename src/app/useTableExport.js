import { useCallback } from 'react'
import { exportTable } from './exporting.js'
import { useStore } from './store.jsx'

/**
 * Wires a table to the CSV/Excel export menu. Returns the handler an
 * ExportButton expects, so every export in the app reports success — and
 * refuses an empty table — the same way.
 */
export function useTableExport({ columns, rows, totals, title, emptyHint }) {
  const { showToast } = useStore()
  return useCallback((format) => {
    if (!rows?.length) {
      showToast('Nothing to export', emptyHint || 'There are no rows on this screen yet.', true)
      return
    }
    const count = exportTable(format, { columns, rows, totals, title })
    showToast(
      `Exported ${count} row${count === 1 ? '' : 's'}`,
      `${title} · ${format === 'xlsx' ? 'Excel workbook' : 'CSV file'}`,
    )
  }, [columns, rows, totals, title, emptyHint, showToast])
}
