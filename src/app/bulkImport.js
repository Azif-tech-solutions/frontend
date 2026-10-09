// bulkImport.js
// It is the one shared "send rows to the
// server and save the successes" routine, so each register page only has to
// describe how ITS record is created and saved.

/**
 * Creates records on the server one at a time and saves each success.
 *
 *   create(record)  calls the API for one row and returns the created item
 *   save(created)   puts that item into the store (addSupplier, addFactory, ...)
 *
 * One at a time keeps the order predictable and avoids firing dozens of
 * requests at once.
 *
 * Returns false if any row failed, which makes BulkUploadDialog stay open.
 * Rows that did save are now in the store, so the dialog marks them
 * "Already registered — skipped" and only the failed rows are left to retry.
 */
export async function bulkImport(records, { entityLabel, entityLabelPlural, create, save, showToast, successHint }) {
  let saved = 0
  const failed = []

  for (const record of records) {
    try {
      const created = await create(record)
      save(created, record)
      saved += 1
    } catch (error) {
      // The first column is always the record's name.
      failed.push({ name: Object.values(record)[0], reason: error.message })
    }
  }

  if (!failed.length) {
    showToast(`${saved} ${saved === 1 ? entityLabel : entityLabelPlural} imported`, successHint)
    return
  }

  const more = failed.length > 1 ? ` (+${failed.length - 1} more)` : ''
  showToast(
    saved ? `${saved} imported, ${failed.length} failed` : 'Bulk import failed',
    `${failed[0].name}: ${failed[0].reason}${more}`,
    true
  )
  return false
}