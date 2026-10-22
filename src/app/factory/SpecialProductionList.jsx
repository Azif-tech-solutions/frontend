import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Dialog } from '../../ds/components/feedback/Dialog.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { fmt, money } from '../utils.js'
import { useStore } from '../store.jsx'
import FactoryApi from '../../api/FactoryApi.js'

const factoryApi = new FactoryApi()

const PAGE_SIZE = 20

const STATUSES = ['PENDING', 'ACTIVE', 'DELIVERED']
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: titleCase(s) }))
const STATUS_TONE = { PENDING: 'warning', ACTIVE: 'success', DELIVERED: 'neutral' }

function titleCase(s = '') {
  return s ? s.charAt(0) + s.slice(1).toLowerCase() : ''
}

export default function SpecialProductionRuns({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  // filters
  const [factoryFilter, setFactoryFilter] = useState('') // '' = all factories (the endpoint allows it)
  const [clientFilter, setClientFilter] = useState('')   // '' = all clients
  const [search, setSearch] = useState('')               // local only: the endpoint has no search param

  // paging + data
  const [page, setPage] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [items, setItems] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)

  // Special clients: no list endpoint yet, so the dropdown only has "All clients".
  // When it exists, fetch it here and setClients(...) with { id, name } records.
  const [clients] = useState([])

  // status dialog
  const [editing, setEditing] = useState(null) // the run being changed
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving] = useState(false)

  // Ask the server for ONE page; runs again when a filter, the page or refreshKey changes.
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    factoryApi
      .listSpecialProductionRuns({
        locationId: factoryFilter || undefined,
        clientId: clientFilter || undefined,
        page,
        size: PAGE_SIZE,
      })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((error) => {
        if (!cancelled) showToast('Could not load special production runs', error.message, true)
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [factoryFilter, clientFilter, page, refreshKey, showToast])

  function openStatusDialog(run) {
    setEditing(run)
    setNewStatus(run.status)
  }

  function closeStatusDialog() {
    if (saving) return
    setEditing(null)
    setNewStatus('')
  }

  async function saveStatus() {
    if (!editing || !newStatus || newStatus === editing.status) return
    setSaving(true)
    try {
      const res = await factoryApi.updateSpecialProductionRunStatus(editing.id, { status: newStatus })
      const updated = res.data
      // Patch the row in place so the list doesn't need to refetch.
      setItems((its) => its.map((i) => (i.id === editing.id ? { ...i, ...updated } : i)))
      showToast('Status updated', `${editing.orderRef} · ${titleCase(updated?.status || newStatus)}`)
      setEditing(null)
      setNewStatus('')
    } catch (error) {
      showToast('Could not update status', error.message, true)
    } finally {
      setSaving(false)
    }
  }

  // Local search over the page that is currently loaded.
  const q = search.trim().toLowerCase()
  const visible = items.filter((r) => {
    if (!q) return true
    return [r.orderRef, r.batchRef, r.client?.name, r.client?.code, r.status]
      .some((v) => String(v || '').toLowerCase().includes(q))
  })

  const rows = visible.map((r) => ({
    id: r.id,
    orderRef: r.orderRef || '—',
    batchRef: r.batchRef || '—',
    client: r.client?.name || '—',
    quantity: r.quantity != null ? fmt(r.quantity) : '—',
    price: r.price != null ? money(r.price) : '—',
    status: r.status,
    raw: r,
  }))

  const columns = [
    { key: 'orderRef', label: 'Order ref', width: 130, mono: true },
    { key: 'batchRef', label: 'Batch ref', width: 130, mono: true },
    { key: 'client', label: 'Client', width: 220 },
    { key: 'quantity', label: 'Quantity', width: 120, align: 'right', mono: true },
    { key: 'price', label: 'Price', width: 140, align: 'right', mono: true },
    {
      key: 'status', label: 'Status', width: 120,
      render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{titleCase(r.status)}</Badge>,
    },
    {
      key: 'actions', label: '', width: 150,
      render: (r) => (
        <Button variant="secondary" size="sm" onClick={() => openStatusDialog(r.raw)}>
          Update status
        </Button>
      ),
    },
  ]

  const countOnPage = (s) => String(items.filter((r) => r.status === s).length)

  return (
    <RegisterShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Special Production Runs'}
      icon={leaf?.icon}
      description="Every customised production run raised for a special client. Filter by factory or client, and move a run through Pending, Active and Delivered."
      searchPlaceholder="Search this page by order, batch or client…"
      search={search}
      onSearch={setSearch}
      filters={
        <>
          <Select
            options={[{ label: 'All factories', value: '' }, ...factories.map((f) => ({ label: f.name, value: f.id }))]}
            value={factoryFilter}
            onChange={(e) => { setFactoryFilter(e.target.value); setPage(0) }}
            placeholder="All factories"
            style={{ width: 190 }}
          />
          <Select
            options={[{ label: 'All clients', value: '' }, ...clients.map((c) => ({ label: c.name, value: c.id }))]}
            value={clientFilter}
            onChange={(e) => { setClientFilter(e.target.value); setPage(0) }}
            placeholder="All clients"
            style={{ width: 190 }}
          />
        </>
      }
      stats={[
        { label: 'Special runs', value: String(pageInfo.totalItems) },
        { label: 'Pending (this page)', value: countOnPage('PENDING') },
        { label: 'Active (this page)', value: countOnPage('ACTIVE') },
        { label: 'Delivered (this page)', value: countOnPage('DELIVERED') },
      ]}
      columns={columns}
      rows={rows}
      pagination={{
        page,
        pageCount: pageInfo.totalPages,
        pageSize: PAGE_SIZE,
        total: pageInfo.totalItems,
        onPage: setPage,
      }}
      emptyTitle="No special production runs"
      emptyDescription="Runs submitted from Special Production will show up here."
      footnote="Search only narrows the page that is currently loaded. Use the factory and client filters to narrow the full list."
    >
      {loading && <Loader label="Loading special production runs…" />}

      <Dialog
        open={!!editing}
        title="Update run status"
        onClose={closeStatusDialog}
        footer={
          <>
            <Button variant="secondary" onClick={closeStatusDialog} disabled={saving}>Cancel</Button>
            <Button
              iconLeft="check"
              onClick={saveStatus}
              disabled={saving || !newStatus || newStatus === editing?.status}
            >
              {saving ? 'Saving…' : 'Save status'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            {editing?.orderRef} · {editing?.batchRef} · {editing?.client?.name}
          </div>
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
        </div>
      </Dialog>
    </RegisterShell>
  )
}