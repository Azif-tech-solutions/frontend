import { useState,useEffect } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { DataTable } from '../../ds/components/data/DataTable.jsx'
import { Page, Panel, FieldSet, EmptyState } from '../shells/Page.jsx'
import { PageHeader } from '../shells/PageHeader.jsx'
import { categories as sampleCategories } from '../sample.js'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import { BulkUploadDialog, EditRecordDialog } from './RegisterTools.jsx'
import FactoryApi from '../../api/FactoryApi.js'
import Loader from '../../ds/components/core/Loader.jsx'
import { CATEGORY_BULK_FIELDS, CATEGORY_BULK_HINT, validateCategoryRow, importCategories } from '../categoryBulk.js'
import { Dropdown } from '../Dropdown.jsx'
const FIELDS = [
  { key: 'name', label: 'Category name', placeholder: 'Emulsion' },
  { key: 'type', label: 'Type', placeholder: 'ZifCoat' },
  { key: 'description', label: 'Description', placeholder: 'Water-based wall paints' },
]

const TYPE_OPTIONS = [
  { value: 'FINISHED_PRODUCT', label: 'Finished product' },
  { value: 'RAW_MATERIAL', label: 'Raw material' },
  { value: 'PACKAGING', label: 'Packaging' },
]

const factoryApi = new FactoryApi()
/**
 * Category register — the Type/Group every product and material belongs to
 * (PRD 5.1.4). A category defined here is what the Stock Register offers, and
 * what the grouped Stock Card (GP) / Bin Card (GP) report against.
 */
export default function Categories({ leaf, moduleLabel }) {
  const { categories, addCategory, updateCategory, removeCategory, showToast,overrideCategories } = useStore()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [description, setDescription] = useState('')
  const [err, setErr] = useState('')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const exists = (n) => categories.some((c) => c.name.toLowerCase() === n.trim().toLowerCase())

  const submit = async () => {
    const clean = name.trim()
    if (!clean) { setErr('Category name is required'); return }
    if (exists(clean)) { setErr('That category is already defined'); return }
    if (!clean) { setErr('Category name is required'); return }
    if (exists(clean)) { setErr('That category is already defined'); return }
    setErr('') // name is fine now, so clear any old name error
    if (!type) { setTypeErr('Select a type'); return }
    setLoading(true)
    try {
      let createdFactory=await factoryApi.createCategory({ name: clean, type, description })
      addCategory({ id:createdFactory.data.id, name: clean, type, description })
      showToast(`Category added — ${clean}${type.trim() ? ` (${type.trim()})` : ''}`, 'Selectable on the Stock Register')
      setName(''); setType(''); setDescription(''); setErr(''); setTypeErr('')
      // overrideCategories()
    } catch (e) {
      showToast('Category registration failed', e.message, true)
    } finally {
      setLoading(false)
    }
    
  }

  const quickAdd = async(c) => {

    if (exists(c.label)) return
    
    // addCategory({ name: c.label })
    
    try {
      let createdFactory=await factoryApi.createCategory({ name: c.label, type:c.value, description:c.value })
      addCategory({ id:createdFactory.data.id, name: c.value, type:c.value, description:c.value })
      showToast(`Category added — ${c.label}`, 'Selectable on the Stock Register')
      
    } catch (e) {
      showToast('Category registration failed', e.message, true)
    } finally {
      setLoading(false)
    }
  }

  const drop = (c) => {
    removeCategory(c.id)
    showToast(`Removed category — ${c.name}`)
  }

  
   const importAll = (records) => importCategories(records, { factoryApi, addCategory, showToast })
   
   useEffect(() => {
        let cancelled = false
        factoryApi.listCategories()
          .then(({ data }) => {
            if (cancelled) return
            // Arrow function so toStoreSupplier keeps its `this`.
            overrideCategories((data || []).map((s) => factoryApi.toStoreCategory(s)))
          })
          .catch(() => { /* request failed: keep whatever is already in ddthe store */ })
    
        return () => { cancelled = true }
      }, [overrideCategories])
  const columns = [
    { key: 'name', label: 'Category', width: 200 },
    { key: 'type', label: 'Type', width: 160 },
    { key: 'description', label: 'Description', width: 280 },
    { key: 'created', label: 'Added', width: 180 },
    { key: 'actions', label: '', width: 190 },
  ]

  const rows = categories.map((c) => ({
    name: c.name,
    type: c.type || '—',
    description: c.description || '—',
    created: fmtDate(new Date(c.createdAt).toISOString()),
    actions: (
      <div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" iconLeft="pencil" onClick={() => setEditing(c)}>Edit</Button>
        <Button variant="ghost" size="sm" iconLeft="trash-2" onClick={() => drop(c)}>Remove</Button>
      </div>
    ),
  })).reverse()

  const count = categories.length

  return (
    <Page wide>
      <PageHeader
        crumbs={[moduleLabel]}
        icon={leaf?.icon || 'tags'}
        title={leaf?.label || 'Categories'}
        description="Define the groups your products and materials belong to — the Type each item is filed under, and the brand that type sits within. A category added here becomes selectable on the Stock Register and is what the grouped Stock Card and Bin Card report against."
        meta={count > 0 && <Badge tone="success">{`${count} categor${count === 1 ? 'y' : 'ies'} defined`}</Badge>}
      />

      <Panel title="Add a category" description="Name is what users pick on the Stock Register; brand is optional and groups related categories together.">
        <FieldSet columns={3}>
          <Input label="Category name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Emulsion" error={err} />
          {/* <Input label="Type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g. ZifCoat" />
           */}
           <div>
  <Dropdown
    label="Type" value={type} options={TYPE_OPTIONS} placeholder="Select type"
    onChange={(v) => { setType(v); setTypeErr('') }}
  />
  {typeErr && <div style={{ font: 'var(--type-caption)', color: 'var(--text-danger, #b42318)', marginTop: 6 }}>{typeErr}</div>}
</div>
          <Input label="Used for" hint="Optional" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Water-based wall paints" />
        </FieldSet>
        {loading?<Loader />
        :
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Button iconLeft="plus" onClick={submit}>Add category</Button>
                  <Button variant="secondary" iconLeft="upload" onClick={() => setBulkOpen(true)}>Bulk upload</Button>
                </div>
        }
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>
            Default categories — click to keep
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sampleCategories.map((c) => {
              const added = exists(c.label)
              return (
                <button
                  key={c.value}
                  type="button"
                  disabled={added}
                  onClick={() => quickAdd(c)}
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
                  {added ? '✓' : '+'} {c.label}
                </button>
              )
            })}
          </div>
        </div>
      </Panel>

      <Panel title="Defined categories" padding={count ? 0 : 20}>
        {count === 0 ? (
          <EmptyState
            compact
            icon="tags"
            title="No categories defined"
            description="Add the groups this company files its products and materials under — the Stock Register falls back to a default set until you do."
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
                    fields={CATEGORY_BULK_FIELDS}
                    hint={CATEGORY_BULK_HINT}
                    validateRow={(r) => validateCategoryRow(r, categories)}
                    existingNames={categories.map((u) => u.name)}
                    onImport={importAll}
                  />

      <EditRecordDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        entityLabel="category"
        fields={FIELDS}
        record={editing}
        existingNames={categories.map((c) => c.name)}
        onSave={(patch) => { updateCategory(editing.id, patch); showToast(`Category updated — ${patch.name}`) }}
      />
    </Page>
  )
}
