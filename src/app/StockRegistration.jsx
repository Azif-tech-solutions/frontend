import { useState, useMemo } from 'react'
import { Button } from '../ds/components/core/Button.jsx'
import { IconButton } from '../ds/components/core/IconButton.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import { Switch } from '../ds/components/forms/Switch.jsx'
import { Dropdown } from './Dropdown.jsx'
import { Radio } from '../ds/components/forms/Radio.jsx'
import { Badge } from '../ds/components/core/Badge.jsx'
import { Dialog } from '../ds/components/feedback/Dialog.jsx'
import { DataTable } from '../ds/components/data/DataTable.jsx'
import { Section } from './Section.jsx'
import { useStore } from './store.jsx'
import { unitOptions } from './unitOptions.js'
import { fmt, parseNum, fmtDate } from './utils.js'

/** Compact unit designation for tables — the symbol when the label carries one ("Kilograms (kg)" → "kg"). */
const unitShortOf = (label) => label?.match(/\(([^)]+)\)\s*$/)?.[1] || label || ''

function CategoryCard({ on, disabled, onClick, label, description }) {
  return (
    <div onClick={() => !disabled && onClick()} style={{
      border: `1px solid ${on ? 'var(--brand)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-lg)', padding: 13,
      background: on ? 'var(--brand-subtle)' : 'var(--surface-card)', cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: on ? 'inset 0 0 0 1px var(--brand)' : 'none', transition: 'var(--transition-control)',
    }}>
      <Radio label={label} description={description} checked={on} disabled={disabled} onChange={() => onClick()} />
    </div>
  )
}

export default function StockRegistration({ onNavigate }) {
  const { factories, addFactory, finishedFieldTemplate, addTemplateField, removeTemplateField, products, addProduct, stockEntries, commitStockEntries, units, showToast } = useStore()
  const unitList = unitOptions(units)

  const [factoryId, setFactoryId] = useState('')
  const [factoryDialog, setFactoryDialog] = useState(false)
  const [newFactoryName, setNewFactoryName] = useState('')
  const factory = factories.find((f) => f.id === factoryId) || null

  const confirmNewFactory = () => {
    if (!newFactoryName.trim()) return
    const f = addFactory(newFactoryName)
    setFactoryId(f.id)
    setNewFactoryName('')
    setFactoryDialog(false)
  }

  const [category, setCategory] = useState(null)
  const [rawName, setRawName] = useState('')
  const [rawSize, setRawSize] = useState('')
  const [rawBrand, setRawBrand] = useState('')
  const [rawQty, setRawQty] = useState('')
  const [rawUnit, setRawUnit] = useState('')

  const [fieldDialog, setFieldDialog] = useState(false)
  const [newFieldLabel, setNewFieldLabel] = useState('')

  const [landing, setLanding] = useState('')
  const [markup, setMarkup] = useState('')
  const difference = parseNum(markup) - parseNum(landing)

  const [itemErr, setItemErr] = useState('')
  const [pending, setPending] = useState([])

  // Add-product modal state — this only defines the product's identity (name + fixed field
  // values). Quantity, cost and variant field values are captured later, per variation, on the
  // dedicated variation page — kept off this modal so stock data stays accurate per-SKU.
  const [productModal, setProductModal] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [fieldMode, setFieldMode] = useState({}) // {fieldId: 'fixed' | 'variant'}, defaults to 'variant'
  const [fieldFixedValue, setFieldFixedValue] = useState({}) // {fieldId: string}
  const [productErr, setProductErr] = useState('')
  const [productPrompt, setProductPrompt] = useState(null) // the just-created product, while the follow-up prompt is open

  const confirmNewField = () => {
    if (!newFieldLabel.trim()) return
    addTemplateField(newFieldLabel)
    setNewFieldLabel('')
    setFieldDialog(false)
  }

  const handleRemoveTemplateField = (id) => {
    removeTemplateField(id)
    setFieldMode((m) => { const n = { ...m }; delete n[id]; return n })
    setFieldFixedValue((v) => { const n = { ...v }; delete n[id]; return n })
  }

  const resetItemForm = () => {
    setCategory(null)
    setRawName(''); setRawSize(''); setRawBrand(''); setRawQty(''); setRawUnit('')
    setLanding(''); setMarkup('')
    setItemErr('')
  }

  const resetProductForm = () => {
    setNewProductName('')
    setFieldMode({})
    setFieldFixedValue({})
    setProductErr('')
  }

  const openProductModal = () => {
    resetProductForm()
    setProductModal(true)
  }

  const confirmNewProduct = () => {
    if (!factory) { setProductErr('Select or add a factory first'); return }
    if (!newProductName.trim()) { setProductErr('Name of product is required'); return }
    const missingFixedValue = finishedFieldTemplate.some((f) => (fieldMode[f.id] || 'variant') === 'fixed' && !(fieldFixedValue[f.id] || '').trim())
    if (missingFixedValue) { setProductErr('Enter a value for each fixed field, or mark it as varies by variation'); return }

    const fixedFields = Object.fromEntries(
      finishedFieldTemplate
        .filter((f) => (fieldMode[f.id] || 'variant') === 'fixed')
        .map((f) => [f.label, fieldFixedValue[f.id].trim()])
    )
    const variantFieldIds = finishedFieldTemplate.filter((f) => (fieldMode[f.id] || 'variant') === 'variant').map((f) => f.id)

    const product = addProduct(factory, newProductName, fixedFields, variantFieldIds)
    setProductModal(false)
    setProductPrompt(product)
  }

  const addToList = () => {
    if (!factory) { setItemErr('Select or add a factory first'); return }
    if (category !== 'raw') return
    if (!landing.trim() || !markup.trim()) { setItemErr('Landing cost and markup cost are required'); return }
    if (!rawName.trim() || !rawSize.trim() || !rawBrand.trim()) { setItemErr('Name, size and brand are all required for raw materials'); return }
    if (!parseNum(rawQty)) { setItemErr('Quantity is required'); return }
    if (!rawUnit) { setItemErr('Unit of measurement is required'); return }

    const unitLabel = unitList.find((u) => u.value === rawUnit)?.label || ''
    const identity = `${rawName.trim()} · ${rawSize.trim()} · ${rawBrand.trim()}`
    setPending((p) => [...p, {
      key: `${Date.now()}-${p.length}`,
      factoryId: factory.id, factoryName: factory.name,
      category: 'raw', identity,
      landingCost: parseNum(landing), markupCost: parseNum(markup), difference,
      name: rawName.trim(), size: rawSize.trim(), brand: rawBrand.trim(), fields: null, qty: parseNum(rawQty),
      unit: unitLabel, unitShort: unitShortOf(unitLabel),
    }])
    resetItemForm()
  }

  const removePending = (key) => setPending((p) => p.filter((it) => it.key !== key))

  const submitAll = () => {
    if (pending.length === 0) return
    const items = pending.map((it) => ({
      factoryId: it.factoryId, factoryName: it.factoryName, category: it.category,
      landingCost: it.landingCost, markupCost: it.markupCost, difference: it.difference,
      name: it.name, size: it.size, brand: it.brand, fields: it.fields, qty: it.qty,
      unit: it.unit, unitShort: it.unitShort,
    }))
    const entryDate = commitStockEntries(items)
    showToast(`${items.length} item${items.length === 1 ? '' : 's'} saved to stock records`, fmtDate(entryDate))
    setPending([])
  }

  const totals = useMemo(() => ({
    count: pending.length,
    landing: pending.reduce((s, i) => s + i.landingCost, 0),
    qty: pending.reduce((s, i) => s + i.qty, 0),
  }), [pending])

  const factoryProducts = useMemo(() => products.filter((p) => p.factoryId === factory?.id && p.kind !== 'raw'), [products, factory])
  const goToVariations = (productId) => onNavigate?.({ view: 'productVariation', id: 'stockregister', params: { productId } })

  const tableColumns = [
    { key: 'category', label: 'Category', width: 130 },
    { key: 'item', label: 'Item', width: 340 },
    { key: 'factory', label: 'Factory', width: 120 },
    { key: 'qty', label: 'Qty', width: 110 },
    { key: 'landing', label: 'Landing', width: 100 },
    { key: 'markup', label: 'Markup', width: 100 },
    { key: 'diff', label: 'Difference', width: 100 },
    { key: 'remove', label: '', width: 44 },
  ]
  const tableRows = pending.map((it) => ({
    category: <Badge tone="info">Raw Material</Badge>,
    item: it.identity,
    factory: it.factoryName,
    qty: <span style={{ font: 'var(--type-mono)' }}>{fmt(it.qty)}{it.unitShort ? ` ${it.unitShort}` : ''}</span>,
    landing: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(it.landingCost)}</span>,
    markup: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(it.markupCost)}</span>,
    diff: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(it.difference)}</span>,
    remove: <IconButton icon="x" label="Remove" size="sm" onClick={() => removePending(it.key)} />,
  }))

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--content-max)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start', marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          <Section title="Factory">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
              <Dropdown label="Select factory" value={factoryId} onChange={setFactoryId} options={factories.map((f) => ({ value: f.id, label: f.name }))} placeholder="Choose a factory…" />
              <Button variant="secondary" iconLeft="plus" onClick={() => setFactoryDialog(true)}>Add factory</Button>
            </div>
            {factories.length === 0 && (
              <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                No factories registered yet — add one here, or manage them all under{' '}
                <span
                  onClick={() => onNavigate?.({ id: 'f.factories', view: 'factories', label: 'Factories' })}
                  style={{ color: 'var(--text-link)', fontWeight: 600, cursor: 'pointer' }}
                >Factory › Factories</span>.
              </div>
            )}
          </Section>

          <Section title="Category" dimmed={!factory}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <CategoryCard on={category === 'raw'} disabled={!factory} onClick={() => setCategory('raw')} label="Raw Material" description="Fixed fields — name, size, brand." />
              <CategoryCard on={category === 'finished'} disabled={!factory} onClick={() => setCategory('finished')} label="Finished Product" description="Custom fields you define yourself." />
            </div>
          </Section>

          {category === 'raw' && (
            <Section title="Item details">
              <Input label="Name of material" value={rawName} onChange={(e) => setRawName(e.target.value)} placeholder="e.g. Titanium Dioxide" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
                <Input label="Size" value={rawSize} onChange={(e) => setRawSize(e.target.value)} placeholder="e.g. 25kg" />
                <Input
                  label="Brand"
                  value={rawBrand}
                  onChange={(e) => setRawBrand(e.target.value)}
                  placeholder="e.g. Iroko hardwood — Grade A"
                  hint="However you already file this material — brand, grade, species, or supplier code."
                />
                <Input label="Quantity" value={rawQty} onChange={(e) => setRawQty(e.target.value)} inputMode="numeric" placeholder="0" />
                <Dropdown label="Unit of measurement" value={rawUnit} onChange={setRawUnit} options={unitList} placeholder="Select unit…" />
              </div>

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />
              <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Cost breakdown</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Input label="Landing cost" prefix="₦" value={landing} onChange={(e) => setLanding(e.target.value)} inputMode="numeric" placeholder="0" />
                <Input label="Markup cost" prefix="₦" value={markup} onChange={(e) => setMarkup(e.target.value)} inputMode="numeric" placeholder="0" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: 'var(--type-ui)', color: 'var(--text-muted)' }}>
                <span>Difference (system-calculated)</span>
                <span style={{ font: 'var(--type-mono)', fontWeight: 500, color: 'var(--text-strong)' }}>₦{fmt(difference)}</span>
              </div>

              {itemErr && <div style={{ font: 'var(--type-caption)', color: 'var(--text-danger)' }}>{itemErr}</div>}

              <Button size="lg" iconLeft="plus" style={{ alignSelf: 'flex-start' }} onClick={addToList}>Add to list</Button>
            </Section>
          )}

          {category === 'finished' && (
            <Section title="Finished products">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Create the product here, then add each variation — with its own quantity and cost — on its own page.
                </span>
                <Button variant="secondary" iconLeft="plus" style={{ flex: '0 0 auto' }} onClick={openProductModal}>Add product</Button>
              </div>

              {factoryProducts.length === 0 ? (
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '11px 13px', lineHeight: 1.5 }}>
                  No products yet for this factory. Click "Add product" to create one.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {factoryProducts.map((p) => {
                    const variationCount = stockEntries.filter((e) => e.productId === p.id).length
                    const fixedSummary = Object.entries(p.fixedFields).map(([k, v]) => `${k}: ${v}`).join(' · ')
                    return (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '10px 13px' }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)' }}>{p.name}</div>
                          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                            {fixedSummary ? `${fixedSummary} · ` : ''}{variationCount} variation{variationCount === 1 ? '' : 's'} saved
                          </div>
                        </div>
                        <Button size="sm" variant="secondary" iconLeft="plus" style={{ flex: '0 0 auto' }} onClick={() => goToVariations(p.id)}>Add variation</Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </Section>
          )}
        </div>

        <aside style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-default)', font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>This session</div>
          <div style={{ padding: '2px 18px 16px' }}>
            {[['Factory', factory?.name || '—'], ['Raw items queued', totals.count], ['Total quantity', fmt(totals.qty)], ['Total landing cost', `₦${fmt(totals.landing)}`]].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--border-subtle)' : 'none', font: 'var(--type-ui)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 600, color: 'var(--text-strong)' }}>{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>Raw materials to submit</span>
        <Button iconLeft="check" disabled={pending.length === 0} onClick={submitAll}>Submit All ({pending.length})</Button>
      </div>
      {pending.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
          No raw material items added yet — fill the form above and click "Add to list".
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}><DataTable columns={tableColumns} rows={tableRows} selectable={false} showRowNumbers /></div>
      )}
      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 10 }}>Nothing is saved to stock records until you click <b style={{ color: 'var(--text-muted)' }}>Submit All</b>. Finished-product variations save immediately from their own page.</div>

      <Dialog open={factoryDialog} title="Add a factory" onClose={() => { setFactoryDialog(false); setNewFactoryName('') }}
        footer={<><Button variant="secondary" onClick={() => { setFactoryDialog(false); setNewFactoryName('') }}>Cancel</Button><Button iconLeft="check" onClick={confirmNewFactory}>Add factory</Button></>}>
        <Input label="Factory name" autoFocus value={newFactoryName} onChange={(e) => setNewFactoryName(e.target.value)} placeholder="e.g. Factory A" onKeyDown={(e) => e.key === 'Enter' && confirmNewFactory()} />
      </Dialog>

      <Dialog open={fieldDialog} title="Add a custom field" onClose={() => { setFieldDialog(false); setNewFieldLabel('') }}
        footer={<><Button variant="secondary" onClick={() => { setFieldDialog(false); setNewFieldLabel('') }}>Cancel</Button><Button iconLeft="check" onClick={confirmNewField}>Add field</Button></>}>
        <Input label="Field name" autoFocus value={newFieldLabel} onChange={(e) => setNewFieldLabel(e.target.value)} placeholder="e.g. Color" onKeyDown={(e) => e.key === 'Enter' && confirmNewField()} />
      </Dialog>

      <Dialog open={productModal} title="Add a product" width={520} onClose={() => { setProductModal(false); resetProductForm() }}
        footer={<><Button variant="secondary" onClick={() => { setProductModal(false); resetProductForm() }}>Cancel</Button><Button iconLeft="check" onClick={confirmNewProduct}>Add product</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Name of product" autoFocus value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="e.g. Classic White Shirt" onKeyDown={(e) => e.key === 'Enter' && confirmNewProduct()} />

          {finishedFieldTemplate.length === 0 ? (
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', background: 'var(--surface-sunken)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '11px 13px', lineHeight: 1.5 }}>
              No custom fields defined yet. Add the attributes that describe this product — e.g. Color, Weight, SKU.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>For each field, either fix a value for this product or leave it to vary — values for a varying field are entered per variation.</div>
              {finishedFieldTemplate.map((f) => {
                const mode = fieldMode[f.id] || 'variant'
                return (
                  <div key={f.id} style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', flex: 1 }}>{f.label}</div>
                      <IconButton icon="x" label={`Delete ${f.label} field`} size="sm" onClick={() => handleRemoveTemplateField(f.id)} />
                    </div>
                    <Switch label="Varies per variation" checked={mode === 'variant'} onChange={(on) => setFieldMode((m) => ({ ...m, [f.id]: on ? 'variant' : 'fixed' }))} />
                    {mode === 'fixed' && (
                      <Input value={fieldFixedValue[f.id] || ''} onChange={(e) => setFieldFixedValue((v) => ({ ...v, [f.id]: e.target.value }))} placeholder={`Value for ${f.label}`} />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <Button variant="secondary" iconLeft="plus" style={{ alignSelf: 'flex-start' }} onClick={() => setFieldDialog(true)}>Add custom field</Button>

          {productErr && <div style={{ font: 'var(--type-caption)', color: 'var(--text-danger)' }}>{productErr}</div>}
        </div>
      </Dialog>

      <Dialog open={!!productPrompt} title="Product added" description={productPrompt ? `"${productPrompt.name}" has been created. What would you like to do next?` : ''}
        onClose={() => setProductPrompt(null)}
        footer={<>
          <Button variant="secondary" onClick={() => setProductPrompt(null)}>Close</Button>
          <Button variant="secondary" iconLeft="plus" onClick={() => { setProductPrompt(null); openProductModal() }}>Add another product</Button>
          <Button iconLeft="arrow-right" onClick={() => { const id = productPrompt.id; setProductPrompt(null); goToVariations(id) }}>Add a variation</Button>
        </>}>
      </Dialog>
    </div>
  )
}
