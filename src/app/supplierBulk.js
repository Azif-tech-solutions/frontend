// supplierBulk.js
// Put this next to Suppliers.jsx and bulkImport.js.
// Everything the Suppliers page needs for bulk upload. BulkUploadDialog itself
// stays generic; this file is what makes it "a supplier upload".

import { bulkImport } from './bulkImport.js'

/**
 * Columns, in the order they are pasted or appear in the CSV.
 * The first column (name) is the unique key, same as every other register.
 * Only the four fields the backend accepts today are included. Contact person,
 * address and "what they supply" aren't stored by the backend, so they are
 * left out here (they can still be added one at a time on the form).
 */
export const SUPPLIER_BULK_FIELDS = [
  { key: 'name', label: 'Supplier name', placeholder: 'Ardova Commodities Ltd' },
  { key: 'code', label: 'Supplier code', placeholder: 'SUP001' },
  { key: 'email', label: 'Email', placeholder: 'sales@supplier.com' },
  { key: 'phone', label: 'Phone', placeholder: '+234 800 000 0000' },
]

export const SUPPLIER_BULK_HINT = 'All four columns are required.'

/**
 * Returns a message if the row can't be imported, or '' if it's fine.
 * The name (first column) is already checked by the dialog itself.
 */
export function validateSupplierRow(r, existingSuppliers = []) {
  if (!r.code) return 'Supplier code is required'
  if (existingSuppliers.some((s) => (s.code || '').toLowerCase() === r.code.toLowerCase())) {
    return 'Code already in use — skipped'
  }
  if (!r.email) return 'Email is required'
  if (!r.phone) return 'Phone number is required'
  return ''
}

/** Turn a pasted row into the body the API expects. */
export function toSupplierPayload(r) {
  return {
    supplierCode: r.code,
    companyName: r.name,
    contactEmail: r.email,
    phone: r.phone,
  }
}

/** Sends each valid row to the server and saves the successes in the store. */
export const importSuppliers = (records, { factoryApi, addSupplier, showToast }) =>
  bulkImport(records, {
    entityLabel: 'supplier',
    entityLabelPlural: 'suppliers',
    successHint: 'Selectable on raw material deliveries',
    showToast,
    create: async (record) => (await factoryApi.createSupplier(toSupplierPayload(record))).data,
    save: (created) => addSupplier(factoryApi.toStoreSupplier(created)),
  })