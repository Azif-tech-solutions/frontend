// categoryBulk.js
// Put this next to Categories.jsx and bulkImport.js.
// Everything the Categories page needs for bulk upload. BulkUploadDialog itself
// stays generic; this file is what makes it "a category upload".

import { bulkImport } from './bulkImport.js'

/**
 * Columns, in the order they are pasted or appear in the CSV.
 * The first column (name) is the unique key, same as every other register.
 * Only the four fields the backend accepts today are included. Contact person,
 * address and "what they supply" aren't stored by the backend, so they are
 * left out here (they can still be added one at a time on the form).
 */
export const CATEGORY_BULK_FIELDS = [
  { key: 'name', label: 'Category name', placeholder: 'Category name' },
  { key: 'type', label: 'Category type', placeholder: '...' },
  { key: 'description', label: 'Category description', placeholder: 'Category description' },

]

export const CATEGORY_BULK_HINT = 'All three columns are required.'

/**
 * Returns a message if the row can't be imported, or '' if it's fine.
 * The name (first column) is already checked by the dialog itself.
 */
export function validateCategoryRow(r, existingCategories = []) {
  if (!r.name) return 'Category name is required'
  if (existingCategories.some((u) => (u.code || '').toLowerCase() === r.code.toLowerCase())) {
    return 'Code already in use — skipped'
  }
//   if (!r.symbol) return 'Unit symbol is required'
  return ''
}

/** Turn a pasted row into the body the API expects. */
export function toCategoryPayload(r) {
  return {
    name: r.name,
    type: r.type,
    description: r.description,

  };
}

/** Sends each valid row to the server and saves the successes in the store. */
export const importCategories = (records, { factoryApi, addCategory, showToast }) =>
  bulkImport(records, {
    entityLabel: 'category',
    entityLabelPlural: 'categories',
    successHint: 'Selectable on product deliveries',
    showToast,
    create: async (record) => (await factoryApi.createCategory(toCategoryPayload(record))).data,
    save: (created) => addCategory(factoryApi.toStoreCategory(created)),
  })
