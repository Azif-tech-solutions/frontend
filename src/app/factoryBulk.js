// factoryBulk.js
// Put this next to Factories.jsx and RegisterTools.jsx.
// Everything the Factories page needs to bulk upload factories to the server.

// Keep in sync with STATUS_OPTIONS in Factories.jsx.
const STATUSES = ['ACTIVE', 'PENDING', 'SUSPEND']

/**
 * Columns, in the order they are pasted or appear in the CSV.
 * The first column (name) is the unique key, same as every other register.
 * Matching header names (key or label) are detected and skipped automatically.
 */
export const BULK_FIELDS = [
  { key: 'name', label: 'Factory name', placeholder: 'Ridgeway Factory A' },
  { key: 'code', label: 'Factory code', placeholder: 'FA' },
  { key: 'address', label: 'Location', placeholder: 'Street, city' },
  { key: 'state', label: 'State', placeholder: 'Lagos' },
  { key: 'phone', label: 'Phone number', placeholder: '+234 800 000 0000' },
  { key: 'status', label: 'Status', placeholder: 'ACTIVE' },
  { key: 'vatEnabled', label: 'VAT enabled', placeholder: 'no' },
  { key: 'vatRate', label: 'VAT rate', placeholder: '7.5' },
  { key: 'vatRegistrationNumber', label: 'VAT registration number', placeholder: 'VAT-0000' },
]

export const BULK_HINT =
  'Name, code, location, state and phone are required. Status can be Active, Pending or Suspend (blank means Active). ' +
  'VAT enabled is yes or no; if yes, the VAT rate (0–100) and VAT registration number are required.'

const isYes = (v) => ['yes', 'y', 'true', '1'].includes(String(v ?? '').trim().toLowerCase())

/**
 * Returns a message if the row can't be imported, or '' if it's fine.
 * The name (first column) is already checked by the dialog itself.
 */
export function validateFactoryRow(r, existingFactories = []) {
  if (!r.code) return 'Factory code is required'
  if (existingFactories.some((f) => (f.code || '').toLowerCase() === r.code.toLowerCase())) {
    return 'Code already in use — skipped'
  }
  if (!r.address) return 'Location is required'
  if (!r.state) return 'State is required'
  if (!r.phone) return 'Phone number is required'

  const status = (r.status || '').toUpperCase()
  if (status && !STATUSES.includes(status)) return 'Status must be Active, Pending or Suspend'

  if (isYes(r.vatEnabled)) {
    const rate = Number(r.vatRate)
    if (!String(r.vatRate).trim() || Number.isNaN(rate) || rate < 0 || rate > 100) {
      return 'VAT rate must be between 0 and 100'
    }
    if (!r.vatRegistrationNumber) return 'VAT registration number is required'
  }
  return ''
}

/** Turn a pasted row (all text) into the body the API expects (real number and boolean). */
export function toFactoryPayload(r) {
  const vatEnabled = isYes(r.vatEnabled)
  return {
    name: r.name,
    code: r.code,
    address: r.address,
    state: r.state,
    phone: r.phone,
    status: (r.status || 'ACTIVE').toUpperCase(),
    vatEnabled,
    vatRate: vatEnabled ? Number(r.vatRate) : 0,
    vatRegistrationNumber: vatEnabled ? r.vatRegistrationNumber : '',
  }
}

/**
 * Creates each factory on the server, one at a time, and saves every success
 * into the store. One at a time keeps the order predictable and avoids firing
 * dozens of requests at once (and any token refresh happens only once).
 *
 * Returns false if any row failed, which tells the dialog to stay open.
 * The rows that did save now exist in the store, so the dialog marks them
 * "Already registered — skipped", leaving only the failed rows to retry.
 */
export async function importFactories(records, { factoryApi, addFactory, showToast }) {
  let saved = 0
  const failed = []

  for (const record of records) {
    try {
      const res = await factoryApi.createFactory(toFactoryPayload(record))
      const created = res.data
      // The API has no id field, so the code doubles as the id (same rule as everywhere else).
      addFactory({ ...created, id: created.id ?? created.code })
      saved += 1
    } catch (error) {
      failed.push({ name: record.name, reason: error.message })
    }
  }

  if (!failed.length) {
    showToast(
      `${saved} factor${saved === 1 ? 'y' : 'ies'} imported`,
      'Ready for stock registration'
    )
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