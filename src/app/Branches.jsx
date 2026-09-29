import { useState } from 'react'
import { Icon } from '../ds/components/core/Icon.jsx'
import { Button } from '../ds/components/core/Button.jsx'
import { Input } from '../ds/components/forms/Input.jsx'
import { DataTable } from '../ds/components/data/DataTable.jsx'
import { useStore } from './store.jsx'

export default function Branches() {
  const { company, branches, addBranch, showToast } = useStore()

  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [address, setAddress] = useState('')
  const [err, setErr] = useState('')

  const submit = () => {
    if (!name.trim()) { setErr('Branch name is required'); return }
    addBranch({ name, number, address })
    showToast(`Added branch — ${name.trim()}`, number || '')
    setName(''); setNumber(''); setAddress(''); setErr('')
  }

  const columns = [
    { key: 'name', label: 'Name', width: 220 },
    { key: 'number', label: 'Number', width: 180 },
    { key: 'address', label: 'Address', width: 300 },
  ]
  const rows = branches.map((b) => ({ name: b.name || '—', number: b.number || '—', address: b.address || '—' }))

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 'var(--content-max)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start', marginBottom: 28 }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 20, height: 20, borderRadius: 'var(--radius-md)', background: 'var(--brand-subtle)', color: 'var(--brand)', display: 'grid', placeItems: 'center', font: 'var(--fw-bold) var(--text-2xs)/1 var(--font-mono)', flex: '0 0 auto' }}>+</span>
            <span style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Add a branch</span>
          </div>
          <Input label="Branch name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Downtown Branch" error={err} />
          <Input label="Branch number / contact" hint="Optional" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. +1 555 010 2201" />
          <Input label="Branch address" hint="Optional" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state" />
          <Button iconLeft="check" style={{ alignSelf: 'flex-start' }} onClick={submit}>Add branch</Button>
        </div>

        <aside style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-xs)', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-default)', font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Primary location</div>
          <div style={{ padding: '2px 18px 6px' }}>
            {[['Company', company.name], ['Address', company.address], ['Phone', company.phone]].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--border-subtle)' : 'none', font: 'var(--type-ui)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span><span style={{ fontWeight: 600, color: 'var(--text-strong)', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '14px 18px 16px', borderTop: '1px solid var(--border-default)', font: 'var(--type-caption)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
            <Icon name="lock" size={13} color="var(--text-subtle)" style={{ marginTop: 1, flex: '0 0 auto' }} />
            Used automatically whenever no branches have been added.
          </div>
        </aside>
      </div>

      <div style={{ font: 'var(--type-h4)', letterSpacing: 'var(--ls-tight)', color: 'var(--text-strong)', marginBottom: 10 }}>All branches</div>
      {branches.length === 0 ? (
        <div style={{ border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-lg)', padding: 24, textAlign: 'center', font: 'var(--type-ui)', color: 'var(--text-subtle)' }}>
          No additional branches yet — {company.name} is your single location.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}><DataTable columns={columns} rows={rows} selectable={false} showRowNumbers /></div>
      )}
    </div>
  )
}
