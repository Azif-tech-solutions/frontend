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
