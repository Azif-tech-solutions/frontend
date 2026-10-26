export const fmt = (n) => Number(n || 0).toLocaleString('en-US')
export const parseNum = (v) => Number(String(v).replace(/[^0-9.]/g, '')) || 0

/** Naira amount with two decimals. */
export const money = (n) => `₦${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
/** Naira amount, no decimals — for KPI figures where precision is noise. */
export const moneyShort = (n) => `₦${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

/**
 * Attaches a running balance to each row. `delta` returns the signed change for
 * a row. Pure, so it is safe to call during render.
 */
export function withBalance(rows, opening, delta, key = 'balance') {
  let bal = opening
  return rows.map((r) => {
    bal += delta(r)
    return { ...r, [key]: bal }
  })
}

export function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '—'
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}

export function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
  return `${String(d.getDate()).padStart(2, '0')} ${mon} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}



// "THIS_MONTH" -> "This month"
const sentence = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const YES_NO = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

/**
 * Turns a /filters endpoint response into FilterBar field definitions.
 *   meta       the endpoint's `data` object ({ fields, primaryDate, periodPresets })
 *   lookups    { [fieldKey]: options[] } for UUID fields that have a `lookup`
 *   locations  options for LOCATION fields, e.g. built from the store's factories
 *   exclude    field keys to skip (e.g. a field already driven by a tab)
 */
export function buildFilters(meta, { lookups = {}, locations = [], exclude = [] } = {}) {
  if (!meta) return []
  const out = []

  for (const f of meta.fields || []) {
    if (exclude.includes(f.key)) continue

    switch (f.type) {
      case 'LOCATION':
        out.push({ key: f.key, label: f.label, type: 'select', options: locations })
        break

      case 'ENUM':
        out.push({ key: f.key, label: f.label, type: 'select', options: f.options || [] })
        break

      case 'BOOLEAN':
        out.push({ key: f.key, label: f.label, type: 'select', options: YES_NO })
        break

      case 'UUID':
        // A UUID with no lookup has nothing to pick from, so it is skipped.
        if (f.lookup) {
          out.push({ key: f.key, label: f.label, type: 'select', options: lookups[f.key] || [] })
        }
        break

      case 'MONEY':
        out.push(
          { key: `${f.key}Min`, label: `${f.label} from`, type: 'number' },
          { key: `${f.key}Max`, label: `${f.label} to`, type: 'number' },
        )
        break

      case 'DATE':
      case 'DATETIME': {
        const primary = f.key === meta.primaryDate
        if (primary && meta.periodPresets?.length) {
          out.push({
            key: 'period',
            label: 'Period',
            type: 'select',
            options: meta.periodPresets.map((p) => ({ value: p, label: sentence(p) })),
          })
        }
        out.push(
          { key: primary ? 'from' : `${f.key}From`, label: `${f.label} from`, type: 'date' },
          { key: primary ? 'to' : `${f.key}To`, label: `${f.label} to`, type: 'date' },
        )
        break
      }

      default:
        break
    }
  }
  return out
}