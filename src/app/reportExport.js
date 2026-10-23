/* Shared export / print helpers for the report pages. */

const csvCell = (v) => {
  const s = String(v ?? '')
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const escapeHtml = (v) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

/** Downloads a CSV. A BOM is added so Excel opens it as UTF-8 (₦ stays intact). */
export function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Prints a clean table in its own window, so the app chrome stays out of the page. Returns false if the pop-up was blocked. */
export function printTable({ title, subtitle, headers, rows, numericCols = [] }) {
  const w = window.open('', '_blank')
  if (!w) return false
  const th = headers
    .map((h, i) => `<th${numericCols.includes(i) ? ' class="num"' : ''}>${escapeHtml(h)}</th>`)
    .join('')
  const body = rows
    .map((r) => `<tr>${r.map((c, i) => `<td${numericCols.includes(i) ? ' class="num"' : ''}>${escapeHtml(c)}</td>`).join('')}</tr>`)
    .join('')
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  @page{size:landscape}
  body{font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;color:#111;margin:24px}
  h1{font-size:18px;margin:0 0 4px}
  .sub{font-size:12px;color:#555;margin-bottom:16px}
  table{border-collapse:collapse;width:100%;font-size:11px}
  th,td{border:1px solid #ccc;padding:5px 7px;text-align:left}
  th{background:#f3f4f6}
  .num{text-align:right;font-variant-numeric:tabular-nums}
  tr{page-break-inside:avoid}
  thead{display:table-header-group}
</style></head><body>
<h1>${escapeHtml(title)}</h1>
<div class="sub">${escapeHtml(subtitle)}</div>
<table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>
</body></html>`)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 250)
  return true
}