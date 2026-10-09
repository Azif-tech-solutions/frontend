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
export const MANUFACTURER_BULK_FIELDS = [
  { key: 'name', label: 'Manufacturer name', placeholder: 'Ardova Commodities Ltd' },
  { key: 'code', label: 'Manufacturer code', placeholder: 'MAN001' },
  { key: 'email', label: 'Email', placeholder: 'sales@manufacturer.com' },
  { key: 'phone', label: 'Phone', placeholder: '+234 800 000 0000' },
  { key: 'country', label: 'Country', placeholder: 'Nigeria' },
  { key: 'produces', label: 'What they produce', placeholder: 'Sugar/Sugar Refinery/Other' },//seperate by commas GPT
  { key: 'status', label: 'Status', placeholder: 'Active' },
]

export const MANUFACTURER_BULK_HINT = 'All four columns are required.'

/**
 * Returns a message if the row can't be imported, or '' if it's fine.
 * The name (first column) is already checked by the dialog itself.
 */
export function validateManufacturerRow(r, existingManufacturers = []) {
  if (!r.code) return 'Manufacturer code is required'
  if (existingManufacturers.some((m) => (m.code || '').toLowerCase() === r.code.toLowerCase())) {
    return 'Code already in use — skipped'
  }
  if (!r.email) return 'Email is required'
  if (!r.phone) return 'Phone number is required'
  return ''
}

/** Turn a pasted row into the body the API expects. */
export function toManufacturerPayload(r) {
  return {
    manufacturerCode: r.code,
    name: r.name,
    country: r.country,
    contactEmail: r.email,
    phone: r.phone,
    produces: r.produces.split("/").join(","),
    status: r.status,
  };
}

/** Sends each valid row to the server and saves the successes in the store. */
export const importManufacturers = (records, { factoryApi, addManufacturer, showToast }) =>
  bulkImport(records, {
    entityLabel: 'manufacturer',
    entityLabelPlural: 'manufacturers',
    successHint: 'Selectable on raw material deliveries',
    showToast,
    create: async (record) => (await factoryApi.createManufacturer(toManufacturerPayload(record))).data,
    save: (created) => addManufacturer(factoryApi.toStoreManufacturer(created)),
  })