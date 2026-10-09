import { useRef, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
import { DataTable } from '../../ds/components/data/DataTable.jsx'
import { Dropdown } from '../Dropdown.jsx'
/**
 * Shared tools for the register screens (Factories, Suppliers, Manufacturers,
 * Units of Measure): a CSV/paste bulk-upload dialog and a field-driven edit
 * dialog. Both take the same `fields` config — [{ key, label, placeholder }],
 * first field is the record's unique name.
 */

/** Split pasted or uploaded text into rows of cells. Tabs win over commas so a paste from a spreadsheet works as-is. */
function parseDelimited(text) {
  const delim = text.includes('\t') ? '\t' : ','
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const cells = []
      let cur = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (inQuotes) {
          if (ch === '"') {
            if (line[i + 1] === '"') { cur += '"'; i++ } else inQuotes = false
          } else cur += ch
        } else if (ch === '"') inQuotes = true
        else if (ch === delim) { cells.push(cur.trim()); cur = '' }
        else cur += ch
      }
      cells.push(cur.trim())
      return cells
    })
}

const textareaStyle = {
  width: '100%', minHeight: 130, padding: '10px 12px', resize: 'vertical',
  background: 'var(--surface-card)', border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-mono)', color: 'var(--text-strong)', outline: 'none',
}

// Replace the existing BulkUploadDialog function in RegisterTools.jsx with this one.
// parseDelimited and textareaStyle stay exactly as they are. No new imports are needed.
//
// Two new optional props, so the other registers keep working unchanged:
//   validateRow(record) => string   a message blocks that row; '' (or nothing) means it's fine
//   hint                            replaces the default "Only the first column is required;" text
// onImport may now be async. Returning false keeps the dialog open (e.g. some rows failed to save).

export function BulkUploadDialog({ open, onClose, entityLabel, entityLabelPlural, fields, existingNames, onImport, validateRow, hint }) {
  const [text, setText] = useState(null)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef(null)
  const value = text ?? ''

  const close = () => { setText(null); onClose() }

  const headerWords = new Set(fields.flatMap((f) => [f.key.toLowerCase(), f.label.toLowerCase()]))
  const parsed = parseDelimited(value)
  const body = parsed.length && parsed[0].some((c) => headerWords.has(c.toLowerCase())) ? parsed.slice(1) : parsed

  const taken = new Set((existingNames || []).map((n) => n.toLowerCase()))
  const seen = new Set()
  const rows = body.map((cells) => {
    const record = Object.fromEntries(fields.map((f, i) => [f.key, cells[i] || '']))
    const name = record[fields[0].key]
    let problem = ''
    if (!name) problem = `${fields[0].label} is required`
    else if (taken.has(name.toLowerCase())) problem = 'Already registered — skipped'
    else if (seen.has(name.toLowerCase())) problem = 'Duplicate row — skipped'
    // Register-specific rules (required columns, formats), only checked once the name checks pass.
    else if (validateRow) problem = validateRow(record) || ''
    if (name) seen.add(name.toLowerCase())
    return { record, problem }
  })
  const valid = rows.filter((r) => !r.problem).map((r) => r.record)

  const pickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setText(String(reader.result || ''))
    reader.readAsText(file)
    e.target.value = ''
  }

  const doImport = async () => {
    setImporting(true)
    try {
      const result = await onImport(valid)
      if (result !== false) close()
    } finally {
      setImporting(false)
    }
  }

  const previewColumns = [
    ...fields.map((f) => ({ key: f.key, label: f.label, width: f.key === fields[0].key ? 180 : 140 })),
    { key: '_status', label: 'Status', width: 190 },
  ]
  const previewRows = rows.map((r) => ({
    ...r.record,
    _status: r.problem ? <Badge tone="warning">{r.problem}</Badge> : <Badge tone="success">Ready</Badge>,
  }))

  return (
    <Dialog
      open={open}
      width={720}
      title={`Bulk upload ${entityLabelPlural}`}
      description={`Paste rows from a spreadsheet or choose a CSV file. Columns in order: ${fields.map((f) => f.label).join(', ')}. ${hint ?? 'Only the first column is required;'} A header row is detected and skipped.`}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={importing}>Cancel</Button>
          <Button iconLeft="upload" disabled={!valid.length || importing} onClick={doImport}>
            {importing ? 'Importing…' : `Import ${valid.length || ''} ${valid.length === 1 ? entityLabel : entityLabelPlural}`}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button variant="secondary" iconLeft="file-up" onClick={() => fileRef.current?.click()} disabled={importing}>Choose CSV file</Button>
          <input ref={fileRef} type="file" accept=".csv,.tsv,.txt" style={{ display: 'none' }} onChange={pickFile} />
          <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>…or paste the rows below.</span>
        </div>

        <textarea
          value={value}
          onChange={(e) => setText(e.target.value)}
          placeholder={`e.g.\n${fields.map((f) => f.placeholder || f.label).join(', ')}`}
          style={textareaStyle}
          disabled={importing}
        />

        {rows.length > 0 && (
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
            <DataTable columns={previewColumns} rows={previewRows} selectable={false} showRowNumbers />
          </div>
        )}
      </div>
    </Dialog>
  )
}

// export function EditRecordDialog({ open, onClose, entityLabel, fields, record, existingNames, onSave }) {
//   const [draft, setDraft] = useState(null)
//   const [err, setErr] = useState('')
//   const values = draft ?? record ?? {}

//   const close = () => { setDraft(null); setErr(''); onClose() }

//   const save = () => {
//     const nameKey = fields[0].key
//     const name = (values[nameKey] || '').trim()
//     if (!name) { setErr(`${fields[0].label} is required`); return }
//     const clash = (existingNames || []).some((n) => n.toLowerCase() === name.toLowerCase() && n.toLowerCase() !== (record?.[nameKey] || '').toLowerCase())
//     if (clash) { setErr(`That ${entityLabel} name is already in use`); return }
//     onSave(Object.fromEntries(fields.map((f) => [f.key, (values[f.key] || '').trim()])))
//     close()
//   }

//   return (
//     <Dialog
//       open={open}
//       width={520}
//       title={`Edit ${entityLabel}`}
//       onClose={close}
//       footer={
//         <>
//           <Button variant="secondary" onClick={close}>Cancel</Button>
//           <Button iconLeft="check" onClick={save}>Save changes</Button>
//         </>
//       }
//     >
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//         {fields.map((f, i) => (
//           <Input
//             key={f.key}
//             label={f.label}
//             autoFocus={i === 0}
//             value={values[f.key] || ''}
//             onChange={(e) => setDraft({ ...values, [f.key]: e.target.value })}
//             placeholder={f.placeholder}
//             error={i === 0 ? err : undefined}
//           />
//         ))}
//       </div>
//     </Dialog>
//   )
// }

// Replace the existing EditRecordDialog in RegisterTools.jsx with this version.
// Add this import at the top of RegisterTools.jsx (adjust the path if needed):
//   import { Dropdown } from '../Dropdown.jsx'
//
// Plain text fields work exactly as before. Fields can now also have:
//   type: 'select'    + options: [{ value, label }]
//   type: 'checkbox'
//   type: 'number'
//   required: true               (checked on save; the first field is always required)
//   showIf: (values) => boolean  (field only shows, and is only checked, when true)
//   validate: (value, values) => string | undefined   (return a message to block saving)

export function EditRecordDialog({ open, onClose, entityLabel, fields, record, existingNames, onSave }) {
  const [draft, setDraft] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const values = draft ?? record ?? {}

  const isVisible = (f) => !f.showIf || f.showIf(values)
  const setValue = (key, value) => setDraft({ ...values, [key]: value })
  const asText = (v) => String(v ?? '').trim()

  const close = () => { setDraft(null); setErrors({}); onClose() }

  const save = async () => {
    const e = {}
    const nameKey = fields[0].key
    const name = asText(values[nameKey])

    // First field: required and must be unique (same rules as before).
    if (!name) {
      e[nameKey] = `${fields[0].label} is required`
    } else {
      const clash = (existingNames || []).some(
        (n) => n.toLowerCase() === name.toLowerCase() && n.toLowerCase() !== (record?.[nameKey] || '').toLowerCase()
      )
      if (clash) e[nameKey] = `That ${entityLabel} name is already in use`
    }

    // Remaining fields: only the visible ones are checked.
    fields.forEach((f, i) => {
      if (i === 0 || !isVisible(f) || f.type === 'checkbox') return
      if (f.required && !asText(values[f.key])) {
        e[f.key] = `${f.label} is required`
      } else if (f.validate) {
        const message = f.validate(values[f.key], values)
        if (message) e[f.key] = message
      }
    })

    setErrors(e)
    if (Object.keys(e).length) return

    // Build the record to save: checkboxes stay booleans, everything else is trimmed text.
    const patch = Object.fromEntries(
      fields.map((f) => [f.key, f.type === 'checkbox' ? !!values[f.key] : asText(values[f.key])])
    )

    setSaving(true)
    try {
      // onSave may be async. Returning false keeps the dialog open (e.g. the API call failed).
      const result = await onSave(patch)
      if (result !== false) close()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog
      open={open}
      width={520}
      title={`Edit ${entityLabel}`}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={saving}>Cancel</Button>
          <Button iconLeft="check" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {fields.filter(isVisible).map((f, i) => {
          if (f.type === 'select') {
            return (
              <Dropdown
                key={f.key}
                label={f.label}
                value={values[f.key] ?? ''}
                onChange={(v) => setValue(f.key, v)}
                options={f.options || []}
              />
            )
          }

          if (f.type === 'checkbox') {
            return (
              <label key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 10, font: 'var(--type-ui)', color: 'var(--text-strong)', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!values[f.key]} onChange={(e) => setValue(f.key, e.target.checked)} />
                {f.label}
              </label>
            )
          }

          return (
            <Input
              key={f.key}
              label={f.label}
              type={f.type === 'number' ? 'number' : undefined}
              autoFocus={i === 0}
              value={values[f.key] ?? ''}
              onChange={(e) => setValue(f.key, e.target.value)}
              placeholder={f.placeholder}
              error={errors[f.key]}
            />
          )
        })}
      </div>
    </Dialog>
  )
}