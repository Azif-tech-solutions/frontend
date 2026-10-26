// import { useState } from 'react'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { CardIdentity, GroupMembers } from './cardParts.jsx'
// import { cardFilters } from './cardConfig.js'
// import { stockGroups, stockCardRows, cardOpeningBalance, withRunningBalance, summariseByDate } from '../sample.js'

// const num = (n) => (n ? n.toLocaleString() : '—')

// export default function BinCardGP({ leaf, moduleLabel, parentLabel }) {
//   const [group] = useState(stockGroups[0])
//   const summarised = summariseByDate(stockCardRows)
//   const rows = withRunningBalance(summarised, cardOpeningBalance, 'balance')

//   const totalIn = summarised.reduce((n, r) => n + r.qtyIn, 0)
//   const totalOut = summarised.reduce((n, r) => n + r.qtyOut, 0)
//   const closing = cardOpeningBalance + totalIn - totalOut

//   const columns = [
//     { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
//     { key: 'date', label: 'Date', width: 160 },
//     { key: 'qtyIn', label: 'Qty in', width: 140, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
//     { key: 'qtyOut', label: 'Qty out', width: 140, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
//     { key: 'balance', label: 'Balance', width: 160, align: 'right', mono: true, render: (r) => num(r.balance) },
//   ]

//   return (
//     <ReportShell
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Bin Card (GP)'}
//       icon={leaf?.icon}
//       meta={<CardIdentity group={group} />}
//       description="Summarised stock movement for a selected group. Shows the total quantity of group members that came in and went out on each date, rather than listing every individual activity."
//       filters={cardFilters}
//       stats={[
//         { label: 'Opening balance', value: cardOpeningBalance.toLocaleString(), hint: '01 Aug 2026' },
//         { label: 'Total qty in', value: totalIn.toLocaleString() },
//         { label: 'Total qty out', value: totalOut.toLocaleString(), tone: 'negative' },
//         { label: 'Closing balance', value: closing.toLocaleString(), hint: '22 Aug 2026' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ sn: 'Total', qtyIn: totalIn.toLocaleString(), qtyOut: totalOut.toLocaleString(), balance: closing.toLocaleString() }}
//       tableTitle={`Daily movement summary — ${group.label}`}
//       tableActions={<CardIdentity group={group} />}
//       emptyTitle="No movement for this group in the selected period"
//       emptyDescription="Widen the date range or choose a different stock group, then generate again."
//       footnote="Report data reflects the underlying transactional records at the moment of generation."
//     >
//       <GroupMembers group={group} />
//     </ReportShell>
//   )
// }
import { useState } from 'react'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel } from '../shells/Page.jsx'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { useStore } from '../store.jsx'
import { fmtDate } from '../utils.js'
import InventoryApi from '../../api/InventoryApi.js'

const inventoryApi = new InventoryApi()
const PAGE_SIZE = 1

const num = (n) => (n ? Number(n).toLocaleString() : '—')
const emptyFilters = { factory: '', group: '', from: '', to: '' }

export default function BinCardGP({ leaf, moduleLabel, parentLabel }) {
  const { factories, categories, showToast } = useStore()

  const [filters, setFilters] = useState(emptyFilters)
  const [report, setReport] = useState(null) // { header, rows: Paged }
  const [period, setPeriod] = useState({ from: '', to: '' })
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)

  const cardFilters = [
    { key: 'factory', label: 'Factory', type: 'select', options: factories.map((f) => ({ value: f.id, label: f.name })), placeholder: 'All factories' },
    { key: 'group', label: 'Stock name (group)', type: 'select', options: categories.map((c) => ({ value: c.id, label: c.name })) },
    { key: 'from', label: 'Date from', type: 'date' },
    { key: 'to', label: 'Date to', type: 'date' },
  ]

  const generate = async (nextPage = 0) => {
    if (!filters.group) {
      showToast('Select a stock group', 'Choose the group whose bin card you want to generate.', true)
      return
    }
    if (filters.from && filters.to && filters.from > filters.to) {
      showToast('Check the dates', '"Date from" must be before "Date to".', true)
      return
    }

    setLoading(true)
    try {
      const res = await inventoryApi.listStockBinLedger({
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
  const paged = report?.rows
  const rawRows = paged?.items ?? []
  const rows = rawRows.map((r) => ({ ...r, date: r.date ? fmtDate(r.date) : '—' }))

  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    { key: 'date', label: 'Date', width: 160 },
    { key: 'qtyIn', label: 'Qty in', width: 140, align: 'right', mono: true, render: (r) => (r.qtyIn ? <span style={{ color: 'var(--success)' }}>{num(r.qtyIn)}</span> : '—') },
    { key: 'qtyOut', label: 'Qty out', width: 140, align: 'right', mono: true, render: (r) => (r.qtyOut ? <span style={{ color: 'var(--danger)' }}>{num(r.qtyOut)}</span> : '—') },
    { key: 'balance', label: 'Balance', width: 160, align: 'right', mono: true, render: (r) => num(r.balance) },
  ]

  const stats = header ? [
    { label: 'Opening balance', value: Number(header.openingBalance).toLocaleString(), hint: period.from ? fmtDate(period.from) : undefined },
    { label: 'Total qty in', value: Number(header.totalReceived).toLocaleString() },
    { label: 'Total qty out', value: Number(header.totalIssued).toLocaleString(), tone: 'negative' },
    { label: 'Closing balance', value: Number(header.closingBalance).toLocaleString(), hint: period.to ? fmtDate(period.to) : undefined },
  ] : undefined

  const totals = header ? {
    sn: 'Total',
    qtyIn: Number(header.totalReceived).toLocaleString(),
    qtyOut: Number(header.totalIssued).toLocaleString(),
    balance: Number(header.closingBalance).toLocaleString(),
  } : undefined

  return (
    <>
      {loading && <Loader overlay label="Generating bin card…" />}
      <ReportShell
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Bin Card (GP)'}
        icon={leaf?.icon}
        meta={header ? <Badge tone="brand" uppercase>{header.group?.name}</Badge> : undefined}
        description="Summarised stock movement for a selected group. Shows the total quantity of group members that came in and went out on each date, rather than listing every individual activity."
        filters={cardFilters}
        filterValues={filters}
        onFilterChange={(key, value) => {
          setFilters((f) => ({ ...f, [key]: value }))
          if (key !== 'from' && key !== 'to') setPage(0)
        }}
        onGenerate={() => generate(0)}
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
          onPage: (p) => generate(p),
        } : undefined}
        tableTitle={header ? `Daily movement summary — ${header.group?.name}` : 'Daily movement summary'}
        emptyTitle={report ? 'No movement for this group in the selected period' : 'Choose a stock group to begin'}
        emptyDescription={report
          ? 'Widen the date range or choose a different stock group, then generate again.'
          : 'Select a stock group (and optionally a factory and dates), then click Generate.'}
        footnote="Report data reflects the underlying transactional records at the moment of generation."
      >
        {header && header.members?.length > 0 && (
          <Panel
            title={`Stock — ${header.group?.name}`}
            description={`${header.memberCount ?? header.members.length} item${(header.memberCount ?? header.members.length) === 1 ? '' : 's'} on this card. Movement is summarised per date across all of them.`}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {header.members.map((m) => (
                <Badge key={m.stockItem?.id} tone="neutral">
                  {m.stockItem?.name} · {m.stockItem?.code}{m.unit ? ` · ${m.unit}` : ''}
                </Badge>
              ))}
            </div>
          </Panel>
        )}
      </ReportShell>
    </>
  )
}