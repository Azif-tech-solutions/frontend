import { useState, useEffect } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { DataTable } from '../../ds/components/data/DataTable.jsx'
import { Page, Panel, FieldSet, Callout, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { units as sampleUnits } from '../sample.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import { BulkUploadDialog, EditRecordDialog } from './RegisterTools.jsx'
import FactoryApi from '../../api/FactoryApi.js'
import { UNIT_BULK_FIELDS, UNIT_BULK_HINT, validateUnitRow, importUnits } from '../unitBulk.js'

import Loader from '../../ds/components/core/Loader.jsx'
const FIELDS = [
  { key: 'name', label: 'Unit name', placeholder: 'Kilograms' },
  { key: 'symbol', label: 'Symbol', placeholder: 'kg' },
  { key: 'code', label: 'Code', placeholder: '...' },
]

const factoryApi=new FactoryApi()

/** Suggestions — one click each, so the common set doesn't have to be typed out. */
const COMMON = [
  { name: 'Pieces', symbol: 'pcs', code: 'pcs' },
  { name: 'Cartons', symbol: 'ctn', code: 'ctn' },
  { name: 'Kilograms', symbol: 'kg', code: 'kg' },
  { name: 'Grams', symbol: 'g', code: 'g' },
  { name: 'Litres', symbol: 'L', code: 'L' },
  { name: 'Millilitres', symbol: 'ml', code: 'ml' },
  { name: 'Bags', symbol: 'bag', code: 'bag' },
  { name: 'Drums', symbol: 'drum', code: 'drum' },
  { name: 'Rolls', symbol: 'roll', code: 'roll' },
  { name: 'Metres', symbol: 'm', code: 'm' },
  { name: 'Packs', symbol: 'pack', code: 'pack' },
  { name: 'Tonnes', symbol: 't', code: 't' },
]

export default function Units({ leaf, moduleLabel }) {
  const { units, addUnit, updateUnit, removeUnit, showToast,overrideUnits } = useStore()

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const exists = (n) => units.some((u) => u.name.toLowerCase() === n.trim().toLowerCase())

  const submit = async() => {
    const clean = name.trim()
    
    if (!clean) { setErr('Unit name is required'); return }
    if (exists(clean)) { setErr('That unit is already defined'); return }
    setLoading(true)
    try {
      let createdUnit= await factoryApi.createUnit({unitCode:code,unitName:clean,symbol:symbol})
      addUnit({name:clean,symbol,code,id:createdUnit.data.id})
      showToast(`Unit added — ${clean}${symbol.trim() ? ` (${symbol.trim()})` : ''}`, 'Selectable wherever a quantity is entered')
      setName(''); setSymbol(''); setCode(''); setErr('')
    } catch (e) {
      setLoading(false)
      showToast(`Unit ${clean} (${symbol.trim() ? ` (${symbol.trim()})` : ''}) failed to add`, e.message, true)
    }
    setLoading(false)
  }

  const quickAdd = async(u) => {
    if (exists(u.name)) return

    try {
      let createdUnit=await factoryApi.createUnit({unitCode:u.code,unitName:u.name,symbol:u.symbol})
    
      addUnit({...u,id:createdUnit.data.id})
      
      showToast(`Unit added — ${u.name} (${u.symbol})`, 'Selectable wherever a quantity is entered')
    } catch (e) {
      showToast(`Unit ${u.name} (${u.symbol}) failed to add`, e.message, true)
    }
  }

  const drop = (u) => {
    removeUnit(u.id)
    showToast(`Removed unit — ${u.name}`)
  }

 const importAll = (records) => importUnits(records, { factoryApi, addUnit, showToast })



  const columns = [
    { key: 'name', label: 'Unit', width: 200 },
    { key: 'symbol', label: 'Symbol', width: 130 },
    { key: 'code', label: 'Code', width: 280 },
    { key: 'created', label: 'Added', width: 180 },
    { key: 'actions', label: '', width: 190 },
  ]

  const rows = units.map((u) => ({
    name: u.name,
    symbol: u.symbol || '—',
    code: u.code || '—',  
    created: fmtDate(new Date(u.createdAt).toISOString()),
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(u)}>Edit</Button>
        <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => drop(u)}>Remove</Button>
      </div>
    ),
  })).reverse()

   useEffect(() => {
      let cancelled = false
      factoryApi.listUnits()
        .then(({ data }) => {
          if (cancelled) return
          // Arrow function so toStoreSupplier keeps its `this`.
          overrideUnits((data || []).map((s) => factoryApi.toStoreUnit(s)))
        })
        .catch(() => { /* request failed: keep whatever is already in the store */ })
  
      return () => { cancelled = true }
    }, [overrideUnits])
  
  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel]}
        icon={leaf?.icon || 'ruler'}
        title={leaf?.label || 'Units of Measure'}
        description="Define how this company measures its materials and products. A unit added here becomes selectable on the Stock Register, on raw material deliveries, and in recipe composition."
        meta={<Badge tone={units.length ? 'success' : 'warning'}>{units.length ? `${units.length} unit${units.length === 1 ? '' : 's'} defined` : 'None defined yet'}</Badge>}
      />

      {units.length === 0 && (
        <Callout tone="info" title="No units of your own yet">
          Quantity fields currently fall back to a default set of {sampleUnits.length} units. Define your own below —
          as soon as one exists, your set replaces the default everywhere.
        </Callout>
      )}

      <Panel title="Add a unit" description="Name is what users pick; the symbol is what prints on documents.">
        <FieldSet columns={3}>
          <Input label="Unit name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kilograms" error={err} />
          <Input label="Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="e.g. kg" />
          <Input label="Code"  value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g...." />
        </FieldSet>
        {loading ?
        <Loader label="Adding unit..." />
        
      : <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button iconLeft="plus" onClick={submit}>Add unit</Button>
          <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
        </div>}
        

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            Common units — click to add
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {COMMON.map((u) => {
              const added = exists(u.name)
              return (
                <button
                  key={u.name}
                  type="button"
                  disabled={added}
                  onClick={() => quickAdd(u)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px',
                    borderRadius: 'var(--radius-full)', cursor: added ? 'default' : 'pointer',
                    background: added ? 'var(--surface-sunken)' : 'var(--surface-card)',
                    border: `1px solid ${added ? 'var(--border-subtle)' : 'var(--border-default)'}`,
                    font: 'var(--fw-semibold) var(--text-xs)/1 var(--font-ui)',
                    color: added ? 'var(--text-subtle)' : 'var(--text-body)',
                    opacity: added ? 0.6 : 1, transition: 'var(--transition-control)',
                  }}
                >
                  {added ? '✓' : '+'} {u.name} <span style={{ color: 'var(--text-subtle)' }}>({u.symbol})</span>
                </button>
              )
            })}
          </div>
        </div>
      </Panel>

      <Panel title="Defined units" padding={units.length ? 0 : 20}>
        {units.length === 0 ? (
          <EmptyState
            compact
            icon="ruler"
            title="No units defined"
            description="Add the units this company measures in — quantity fields fall back to a default set until you do."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={rows} selectable={false} showRowNumbers /></div>
        )}
      </Panel>

      <BulkUploadDialog
              open={bulkOpen}
              onClose={() => setBulkOpen(false)}
              entityLabel="manufacturer"
              entityLabelPlural="manufacturers"
              fields={UNIT_BULK_FIELDS}
              hint={UNIT_BULK_HINT}
              validateRow={(r) => validateUnitRow(r, units)}
              existingNames={units.map((u) => u.name)}
              onImport={importAll}
            />
      

      <EditRecordDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        entityLabel="unit"
        fields={FIELDS}
        record={editing}
        existingNames={units.map((u) => u.name)}
        onSave={(patch) => { updateUnit(editing.id, patch); showToast(`Unit updated — ${patch.name}`) }}
      />
    </Page>
  )
}
