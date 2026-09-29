import { useState, useMemo } from 'react'
import { Badge } from '../ds/components/core/Badge.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import { Dropdown } from './Dropdown.jsx'
import { DataTable } from '../ds/components/data/DataTable.jsx'
import { useStore } from './store.jsx'
import { fmt, fmtDate } from './utils.js'

function identityOf(e) {
  if (e.category === 'raw') return `${e.name} · ${e.size} · ${e.brand}`
  const shared = e.name ? [e.name] : []
  shared.push(...Object.entries(e.fields || {}).map(([k, v]) => `${k}: ${v}`))
  if (e.variants?.length) {
    const axisLabel = (e.variantAxes || [e.variantField]).filter(Boolean).join(' × ')
    const summary = e.variants
      .map((v) => `${v.attrs ? Object.values(v.attrs).join('/') : v.value}×${fmt(v.qty)}`)
      .join(', ')
    shared.push(`${axisLabel}: ${summary}`)
  }
  return shared.join(' · ')
}

export default function StockRecords() {
  const { stockEntries, factories } = useStore()
  const [q, setQ] = useState('')
  const [factoryFilter, setFactoryFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    return stockEntries.filter((e) => {
      if (factoryFilter && e.factoryId !== factoryFilter) return false
      if (categoryFilter && e.category !== categoryFilter) return false
      if (!query) return true
      return `${identityOf(e)} ${e.factoryName}`.toLowerCase().includes(query)
    })
  }, [stockEntries, q, factoryFilter, categoryFilter])

  const columns = [
    { key: 'date', label: 'Entry date', width: 150 },
    { key: 'category', label: 'Category', width: 130 },
    { key: 'item', label: 'Item', width: 320 },
    { key: 'factory', label: 'Factory', width: 120 },
    { key: 'qty', label: 'Qty', width: 110 },
    { key: 'landing', label: 'Landing', width: 100 },
    { key: 'markup', label: 'Markup', width: 100 },
    { key: 'diff', label: 'Difference', width: 100 },
  ]
  const tableRows = rows.map((e) => ({
    date: <span style={{ font: 'var(--type-mono)', fontSize: 12 }}>{fmtDate(e.entryDate)}</span>,
    category: <Badge tone={e.category === 'raw' ? 'info' : 'brand'}>{e.category === 'raw' ? 'Raw Material' : 'Finished Product'}</Badge>,
    item: identityOf(e),
    factory: e.factoryName,
    qty: <span style={{ font: 'var(--type-mono)' }}>{fmt(e.qty)}{e.unitShort ? ` ${e.unitShort}` : ''}</span>,
    landing: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(e.landingCost)}</span>,
    markup: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(e.markupCost)}</span>,
    diff: <span style={{ font: 'var(--type-mono)' }}>₦{fmt(e.difference)}</span>,
  }))

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--content-max)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 200px', gap: 12, marginBottom: 18 }}>
        <Input iconLeft="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search item, factory…" aria-label="Search stock records" />
        <Dropdown value={factoryFilter} onChange={setFactoryFilter} placeholder="All factories" options={factories.map((f) => ({ value: f.id, label: f.name }))} />
        <Dropdown value={categoryFilter} onChange={setCategoryFilter} placeholder="All categories" options={[{ value: 'raw', label: 'Raw Material' }, { value: 'finished', label: 'Finished Product' }]} />
      </div>

      {rows.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
          No stock records yet — register stock to see entries here.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={tableRows} selectable={false} showRowNumbers /></div>
      )}
      <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', marginTop: 10 }}>Showing <b style={{ color: 'var(--text-muted)' }}>{rows.length}</b> of <b style={{ color: 'var(--text-muted)' }}>{stockEntries.length}</b> stock records</div>
    </div>
  )
}
