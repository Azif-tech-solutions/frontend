// manufacturerBulk.js
// Put this next to Manufacturers.jsx and bulkImport.js.
// Everything the Manufacturers page needs for bulk upload. BulkUploadDialog itself
// stays generic; this file is what makes it "a manufacturer upload".

import { bulkImport } from './bulkImport.js'

/**
 * Columns, in the order they are pasted or appear in the CSV.
 * The first column (name) is the unique key, same as every other register.
 * Only the four fields the backend accepts today are included. Contact person,
 * address and "what they supply" aren't stored by the backend, so they are
 * left out here (they can still be added one at a time on the form).
 */
export const UNIT_BULK_FIELDS = [
  { key: 'name', label: 'Unit name', placeholder: 'kILOGRAMS' },
  { key: 'code', label: 'Unit code', placeholder: '...' },
  { key: 'symbol', label: 'Unit symbol', placeholder: 'kg' },

]

export const UNIT_BULK_HINT = 'All four columns are required.'

/**
 * Returns a message if the row can't be imported, or '' if it's fine.
 * The name (first column) is already checked by the dialog itself.
 */
export function validateUnitRow(r, existingUnits = []) {
  if (!r.code) return 'Unit code is required'
  if (existingUnits.some((u) => (u.code || '').toLowerCase() === r.code.toLowerCase())) {
    return 'Code already in use — skipped'
  }
  if (!r.symbol) return 'Unit symbol is required'
  return ''
}

/** Turn a pasted row into the body the API expects. */
export function toUnitPayload(r) {
  return {
    unitCode: r.code,
    unitName: r.name,
    symbol: r.symbol,

  };
}

/** Sends each valid row to the server and saves the successes in the store. */
export const importUnits = (records, { factoryApi, addUnit, showToast }) =>
  bulkImport(records, {
    entityLabel: 'unit',
    entityLabelPlural: 'units',
    successHint: 'Selectable on raw material deliveries',
    showToast,
    create: async (record) => (await factoryApi.createUnit(toUnitPayload(record))).data,
    save: (created) => addUnit(factoryApi.toStoreUnit(created)),
  })