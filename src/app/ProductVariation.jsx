import { useState, useMemo } from 'react'
import { Button } from '../ds/components/core/Button.jsx'
import { IconButton } from '../ds/components/core/IconButton.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import { Badge } from '../ds/components/core/Badge.jsx'
import { DataTable } from '../ds/components/data/DataTable.jsx'
import { Section } from './Section.jsx'
import { useStore } from './store.jsx'
import { fmt, parseNum, fmtDate } from './utils.js'

// Dedicated page for adding stock-tracked variations to an already-created product. Kept off the
// product-creation modal so each variation's quantity/cost is entered deliberately, per SKU.
export default function ProductVariation({ productId, onBack }) {
  const { products, finishedFieldTemplate, stockEntries, commitStockEntries, showToast } = useStore()
  const product = products.find((p) => p.id === productId) || null

  const variantFields = useMemo(
    () => (product ? product.variantFieldIds.map((id) => finishedFieldTemplate.find((f) => f.id === id)).filter(Boolean) : []),
    [product, finishedFieldTemplate]
  )
  const existing = useMemo(() => stockEntries.filter((e) => e.productId === productId), [stockEntries, productId])

  const [attrs, setAttrs] = useState({})
  const [qty, setQty] = useState('')
  const [landing, setLanding] = useState('')
  const [markup, setMarkup] = useState('')
  const difference = parseNum(markup) - parseNum(landing)
  const [err, setErr] = useState('')

  if (!product) {
    return (
      <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--content-max)' }}>
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
          Product not found.
        </div>
        <Button variant="secondary" iconLeft="arrow-left" style={{ marginTop: 14 }} onClick={onBack}>Back to Stock Registration</Button>
      </div>
    )
  }

  const addVariation = () => {
    if (variantFields.some((f) => !(attrs[f.id] || '').trim())) { setErr('Enter a value for every variant field'); return }
    if (!parseNum(qty)) { setErr('Quantity is required'); return }
    if (!landing.trim() || !markup.trim()) { setErr('Landing cost and markup cost are required'); return }

    const variantAttrs = Object.fromEntries(variantFields.map((f) => [f.label, (attrs[f.id] || '').trim()]))
    const fields = { ...product.fixedFields, ...variantAttrs }

    commitStockEntries([{
      factoryId: product.factoryId, factoryName: product.factoryName, category: 'finished',
      name: product.name, size: null, brand: null, fields,
      productId: product.id, variantAttrs,
      qty: parseNum(qty), landingCost: parseNum(landing), markupCost: parseNum(markup), difference,
    }])
    showToast('Variation saved to stock records', [product.name, ...Object.entries(variantAttrs).map(([k, v]) => `${k}: ${v}`)].join(' · '))
    setAttrs({}); setQty(''); setLanding(''); setMarkup(''); setErr('')
  }

  const columns = [
    { key: 'date', label: 'Entry date', width: 150 },
    { key: 'variant', label: 'Variant', width: 260 },
    { key: 'qty', label: 'Qty', width: 70 },
    { key: 'landing', label: 'Landing', width: 100 },
    { key: 'markup', label: 'Markup', width: 100 },
    { key: 'diff', label: 'Difference', width: 100 },
  ]
  const rows = existing.map((e) => ({
    date: <span style={{ font: 'var(--type-mono)', fontSize: 12 }}>{fmtDate(e.entryDate)}</span>,
    variant: Object.keys(e.variantAttrs || {}).length ? Object.entries(e.variantAttrs).map(([k, v]) => `${k}: ${v}`).join(' · ') : '—',
    qty: <span style={{ font: 'var(--type-mono)' }}>{fmt(e.qty)}</span>,
    landing: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(e.landingCost)}</span>,
    markup: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(e.markupCost)}</span>,
    diff: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(e.difference)}</span>,
  }))

  const fixedSummary = Object.entries(product.fixedFields).map(([k, v]) => `${k}: ${v}`).join(' · ')

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--content-max)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <IconButton icon="arrow-left" label="Back to Stock Registration" onClick={onBack} />
        <div>
          <div style={{ font: 'var(--type-h3)', color: 'var(--text-strong)', letterSpacing: 'var(--ls-tight)' }}>Add variation — {product.name}</div>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{product.factoryName}{fixedSummary ? ` · ${fixedSummary}` : ''}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 640, marginBottom: 28 }}>
        <Section title="New variation">
          {variantFields.length === 0 ? (
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>This product has no variant fields — each variation added here is just a stock line for {product.name}.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${variantFields.length}, 1fr)`, gap: 14 }}>
              {variantFields.map((f) => (
                <Input key={f.id} label={f.label} value={attrs[f.id] || ''} onChange={(e) => setAttrs((a) => ({ ...a, [f.id]: e.target.value }))} placeholder={`Value for ${f.label}`} />
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <Input label="Quantity" value={qty} onChange={(e) => setQty(e.target.value)} inputMode="numeric" placeholder="0" />
            <Input label="Landing cost" prefix="₦" value={landing} onChange={(e) => setLanding(e.target.value)} inputMode="numeric" placeholder="0" />
            <Input label="Markup cost" prefix="₦" value={markup} onChange={(e) => setMarkup(e.target.value)} inputMode="numeric" placeholder="0" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', font: 'var(--type-ui)', color: 'var(--text-muted)' }}>
            <span>Difference (system-calculated)</span>
            <span style={{ font: 'var(--type-mono)', fontWeight: 500, color: 'var(--text-strong)' }}>₦{fmt(difference)}</span>
          </div>

          {err && <div style={{ font: 'var(--type-caption)', color: 'var(--text-danger)' }}>{err}</div>}

          <Button size="lg" iconLeft="plus" style={{ alignSelf: 'flex-start' }} onClick={addVariation}>Add variation</Button>
        </Section>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ font: 'var(--type-h4)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)' }}>Variations for {product.name}</span>
        <Badge tone="brand">{existing.length} saved</Badge>
      </div>
      {existing.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
          No variations saved yet — add one above.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={rows} selectable={false} showRowNumbers /></div>
      )}
      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 10 }}>Each variation saves straight to stock records — there's no separate submit step here.</div>
    </div>
  )
}
