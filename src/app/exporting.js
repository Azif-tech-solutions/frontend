// Table export — CSV and Excel (.xlsx), no dependencies.
//
// Table rows in this app hold React elements as often as they hold strings
// (badges, coloured spans, action buttons), so every value is flattened to its
// visible text before it reaches a file. Columns whose cells are pure UI —
// row actions, checkboxes — are dropped.

/** Visible text of a cell value, including React elements and their children. */
export function cellText(value) {
  if (value == null || value === false || value === true) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return value.map(cellText).join('')
  // React element — recurse into its children.
  if (typeof value === 'object' && value.props) return cellText(value.props.children)
  return ''
}

/** Cells that are only controls carry no information worth exporting. */
const ACTION_KEYS = new Set(['actions', 'action', 'remove'])
const isActionColumn = (c) => ACTION_KEYS.has(String(c.key || '').toLowerCase())

/**
 * Normalise a table into a header row plus text rows.
 * Honours a column's `render` so an exported cell matches what is on screen.
 */
export function tableToGrid(columns, rows, totals) {
  const cols = columns.filter((c) => !isActionColumn(c) && (c.label || c.key))
  const header = cols.map((c) => String(c.label || c.key))
  const body = rows.map((r, i) => cols.map((c) => cellText(c.render ? c.render(r, i) : r[c.key])))
  if (totals) {
    body.push(cols.map((c, ci) => {
      const v = totals[c.key]
      return cellText(ci === 0 && v == null ? 'Total' : v)
    }))
  }
  return [header, ...body]
}

/**
 * Normalise a financial statement (SCI, VAT, cash flow) into the same grid.
 * Section headings and subtotals are kept as their own rows so the exported
 * sheet reads like the statement on screen.
 */
export function statementToGrid(columns, sections, result) {
  const grid = [['', ...columns.map(cellText)]]
  for (const s of sections) {
    if (s.title) grid.push([cellText(s.title), ...columns.map(() => '')])
    for (const r of s.rows || []) {
      grid.push([cellText(r.label), ...columns.map((_, i) => cellText(r.values?.[i]))])
    }
    if (s.subtotal) {
      grid.push([cellText(s.subtotal.label), ...columns.map((_, i) => cellText(s.subtotal.values?.[i]))])
    }
  }
  if (result) grid.push([cellText(result.label), ...columns.map((_, i) => cellText(result.values?.[i]))])
  return grid
}

// ── CSV ────────────────────────────────────────────────────────────────────

const csvCell = (s) => (/[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s)

export function toCSV(grid) {
  return grid.map((row) => row.map(csvCell).join(',')).join('\r\n')
}

// ── XLSX ───────────────────────────────────────────────────────────────────
// A .xlsx file is a ZIP of XML parts. Everything here is written uncompressed
// (STORE), which Excel, Numbers and LibreOffice all accept.

const xmlEscape = (s) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]))

/** A1, B1 … Z1, AA1 — Excel's column lettering. */
function cellRef(col, row) {
  let s = ''
  for (let n = col; n >= 0; n = Math.floor(n / 26) - 1) s = String.fromCharCode(65 + (n % 26)) + s
  return `${s}${row + 1}`
}

/** Numeric cells are written as numbers so Excel can sum them; everything else is inline text. */
const NUMERIC = /^-?[\d,]*\.?\d+$/

function sheetXML(grid) {
  const rows = grid.map((cells, r) => {
    const body = cells.map((raw, c) => {
      const text = String(raw ?? '')
      const ref = cellRef(c, r)
      if (!text) return `<c r="${ref}"/>`
      const bare = text.replace(/,/g, '')
      if (r > 0 && NUMERIC.test(text) && Number.isFinite(Number(bare))) {
        return `<c r="${ref}"><v>${Number(bare)}</v></c>`
      }
      return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(text)}</t></is></c>`
    }).join('')
    return `<row r="${r + 1}">${body}</row>`
  }).join('')

  const widths = (grid[0] || []).map((_, c) => {
    const longest = grid.reduce((n, row) => Math.max(n, String(row[c] ?? '').length), 0)
    return `<col min="${c + 1}" max="${c + 1}" width="${Math.min(Math.max(longest + 2, 10), 60)}" customWidth="1"/>`
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols>${widths}</cols><sheetData>${rows}</sheetData></worksheet>`
}

function workbookXML(sheetName) {
  // Excel rejects these characters in a sheet name, and caps it at 31 chars.
  const safe = xmlEscape((sheetName || 'Sheet1').replace(/[\\/*?:[\]]/g, ' ').slice(0, 31))
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${safe}" sheetId="1" r:id="rId1"/></sheets></workbook>`
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`

// ── Minimal ZIP writer (STORE, no compression) ─────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c >>> 0
  }
  return t
})()

function crc32(bytes) {
  let c = 0xffffffff
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function zip(files) {
  const enc = new TextEncoder()
  const parts = []
  const central = []
  let offset = 0

  const push = (arr) => { parts.push(arr); offset += arr.length }
  const u16 = (n) => [n & 0xff, (n >>> 8) & 0xff]
  const u32 = (n) => [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]

  for (const { name, content } of files) {
    const nameBytes = enc.encode(name)
    const data = enc.encode(content)
    const crc = crc32(data)
    const localOffset = offset

    push(new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0),
    ]))
    push(nameBytes)
    push(data)

    central.push(new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length),
      ...u16(nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0),
      ...u32(localOffset),
      ...nameBytes,
    ]))
  }

  const centralStart = offset
  central.forEach(push)

  push(new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0),
    ...u16(files.length), ...u16(files.length),
    ...u32(offset - centralStart), ...u32(centralStart), ...u16(0),
  ]))

  const total = parts.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let at = 0
  for (const p of parts) { out.set(p, at); at += p.length }
  return out
}

/** A complete .xlsx workbook holding one sheet, as bytes. */
export function toXLSX(grid, sheetName) {
  return zip([
    { name: '[Content_Types].xml', content: CONTENT_TYPES },
    { name: '_rels/.rels', content: ROOT_RELS },
    { name: 'xl/workbook.xml', content: workbookXML(sheetName) },
    { name: 'xl/_rels/workbook.xml.rels', content: WORKBOOK_RELS },
    { name: 'xl/worksheets/sheet1.xml', content: sheetXML(grid) },
  ])
}

// ── Download ───────────────────────────────────────────────────────────────

/** Safe, dated filename stem — "Stock Card (GP)" → "stock-card-gp-2026-08-28". */
export function exportFilename(title) {
  const stem = String(title || 'export').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'export'
  return `${stem}-${new Date().toISOString().slice(0, 10)}`
}

function save(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** Write a prepared grid to the user's machine in the chosen format. */
export function exportGrid(format, grid, title) {
  const stem = exportFilename(title)
  if (format === 'xlsx') {
    save(new Blob([toXLSX(grid, title)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${stem}.xlsx`)
  } else {
    // The BOM keeps Excel from mangling the ₦ sign and other non-ASCII text.
    save(new Blob(['﻿', toCSV(grid)], { type: 'text/csv;charset=utf-8' }), `${stem}.csv`)
  }
  return grid.length - 1
}

/** Write a table (columns + rows, honouring `render`) in the chosen format. */
export function exportTable(format, { columns, rows, totals, title }) {
  return exportGrid(format, tableToGrid(columns, rows, totals), title)
}

/** Write a financial statement in the chosen format. */
export function exportStatement(format, { columns, sections, result, title }) {
  return exportGrid(format, statementToGrid(columns, sections, result), title)
}
