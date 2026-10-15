import { useState } from 'react'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel } from '../shells/Page.jsx'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()
const PAGE_SIZE = 20

const num = (n) => (n ? Number(n).toLocaleString() : '—')
const emptyFilters = { factory: '', group: '', from: '', to: '' }

export default function StockCardGP({ leaf, moduleLabel, parentLabel }) {
  const { factories, categories, showToast } = useStore()

  const [filters, setFilters] = useState(emptyFilters)
  const [report, setReport] = useState(null) // { header, rows: Paged } from the API
  const [period, setPeriod] = useState({ from: '', to: '' })
  const [loading, setLoading] = useState(false)

  // pagination
  const [page, setPage] = useState(0)

  const cardFilters = [
    { key: 'factory', label: 'Factory', type: 'select', options: factories.map((f) => ({ value: f.id, label: f.name })), placeholder: 'All factories' },
    { key: 'group', label: 'Stock name (group)', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })) },
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  const generate = async (nextPage = 0) => {
    if (!filters.group) {
      showToast('Select a stock group', 'Choose the group whose card you want to generate.', true)
      return
    }
    if (filters.from && filters.to && filters.from > filters.to) {
      showToast('Check the dates', '"Date from" must be before "Date to".', true)
      return
    }

    setLoading(true)
    try {
      const res = await inventoryApi.listStockLedger({
        groupBy: 'CATEGORY',
        groupId: filters.group,
        locationId: filters.factory || undefined,
        from: filters.from || undefined,
        to: filters.to || undefined,
        page: nextPage,
        size: PAGE_SIZE,
      })
      setReport(res.data)
      setPeriod({ from: filters.from, to: filters.to })
      setPage(nextPage)
    } catch (error) {
      showToast('Could not generate report', error.message, true)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFilters(emptyFilters)
    setReport(null)
    setPeriod({ from: '', to: '' })
    setPage(0)
  }

  const header = report?.header
  const paged = report?.rows                          // Paged<StockLedgerRow>
  const rawRows = paged?.items ?? []
  const rows = rawRows.map((r) => ({ ...r, date: r.date ? fmtDate(r.date) : '—' }))

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: 130 },
    { key: 'itemName', label: 'Item', width: 220 },
    { key: 'locationName', label: 'Location', width: 180 },
    { key: 'remark', label: 'Remark', width: 320 },
    { key: 'qtyIn', label: 'Qty in', width: 110, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: 110, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: 'qtyRemain', label: 'Qty remain', width: 130, align: 'right', mono: true, render: (r) => num(r.qtyRemain) },
  ]

  const stats = header ? [
    { label: 'Opening balance', value: Number(header.openingBalance).toLocaleString(), hint: period.from ? fmtDate(period.from) : undefined },
    { label: 'Total qty in', value: Number(header.totalReceived).toLocaleString(), delta: `${rawRows.filter((r) => r.qtyIn).length} entries` },
    { label: 'Total qty out', value: Number(header.totalIssued).toLocaleString(), tone: 'negative', delta: `${rawRows.filter((r) => r.qtyOut).length} entries` },
    { label: 'Closing balance', value: Number(header.closingBalance).toLocaleString(), hint: period.to ? fmtDate(period.to) : undefined },
  ] : undefined

  const totals = header ? {
    sn: 'Total',
    qtyIn: Number(header.totalReceived).toLocaleString(),
    qtyOut: Number(header.totalIssued).toLocaleString(),
    qtyRemain: Number(header.closingBalance).toLocaleString(),
  } : undefined

  return (
    <>
      {loading && <Loader overlay label="Generating stock card…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Stock Card (GP)'}
        icon={leaf?.icon}
        meta={header ? <Badge tone="brand">{header.group?.name}</Badge> : undefined}
        description="Detailed movement history for a selected stock group. Every transaction involving any member of the group is recorded as its own entry, with a remark describing it."
        filters={cardFilters}
        filterValues={filters}
        onFilterChange={(key, value) => {
          setFilters((f) => ({ ...f, [key]: value }))
          // changing filters should start a new report from page 0
          if (key !== 'from' && key !== 'to') setPage(0)
        }}
        onGenerate={() => generate(0)}          // always start at page 0 when generating
        onReset={reset}
        stats={stats}
        columns={columns}
        rows={rows}
        totals={totals}
        pagination={paged ? {
          page: paged.page ?? page,
          pageCount: paged.totalPages ?? 1,
          pageSize: PAGE_SIZE,
          total: paged.totalItems ?? 0,
          onPage: (p) => generate(p),           // re-fetch the requested page
        } : undefined}
        tableTitle={header ? `Group activity — ${header.group?.name}` : 'Group activity'}
        emptyTitle={report ? 'No activity for this group in the selected period' : 'Choose a stock group to begin'}
        emptyDescription={report
          ? 'Widen the date range or choose a different stock group, then generate again.'
          : 'Select a stock group (and optionally a factory and dates), then click Generate.'}
        footnote="Report data reflects the underlying transactional records at the moment of generation."
      >
        {header && header.members?.length > 0 && (
          <Panel title="Group members" description={`${header.memberCount ?? header.members.length} item${(header.memberCount ?? header.members.length) === 1 ? '' : 's'} in this group`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {header.members.map((m) => (
                <Badge key={m.stockItem?.id || m.stockItemId} tone="neutral">
                  {m.stockItem?.name || m.name} · {m.stockItem?.code || m.code}{m.unit ? ` · ${m.unit}` : ''}
                </Badge>
              ))}
            </div>
          </Panel>
        )}
      </ReportShell>
    </>
  )
}