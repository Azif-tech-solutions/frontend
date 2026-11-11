// import { ReportShell } from '../shells/ReportShell.jsx'
// import { showrooms } from '../sampleShowroom.js'
// import { showroomCashOpening, showroomCashLedger } from '../sampleAccount.js'
// import { money, moneyShort, withBalance } from '../utils.js'

// export default function AccountCashFlow({ leaf, moduleLabel, parentLabel }) {
//   const rows = withBalance(
//     showroomCashLedger.map((r, i) => ({ ...r, sn: i + 1 })),
//     showroomCashOpening,
//     (r) => r.inflow - r.outflow
//   )

//   const inflow = showroomCashLedger.reduce((n, r) => n + r.inflow, 0)
//   const outflow = showroomCashLedger.reduce((n, r) => n + r.outflow, 0)
//   const closing = showroomCashOpening + inflow - outflow

//   // The five columns the PRD specifies, plus a serial for reference.
//   const columns = [
//     { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
//     { key: 'date', label: 'Date', width: 135 },
//     { key: 'remark', label: 'Remark', width: 420 },
//     {
//       key: 'inflow', label: 'In-flow', width: 165, align: 'right', mono: true,
//       render: (r) => (r.inflow ? <span style={{ color: 'var(--success)' }}>{money(r.inflow)}</span> : '—'),
//     },
//     {
//       key: 'outflow', label: 'Out-flow', width: 165, align: 'right', mono: true,
//       render: (r) => (r.outflow ? <span style={{ color: 'var(--danger)' }}>{money(r.outflow)}</span> : '—'),
//     },
//     { key: 'balance', label: 'Balance', width: 175, align: 'right', mono: true, render: (r) => money(r.balance) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Cash Inflow/Outflow Statement'}
//       icon={leaf?.icon}
//       description="How physical cash is generated and used at the selected showroom, with a running balance after every transaction. Generate for any period — monthly, weekly or custom."
//       filters={[
//         { key: 'showroom', label: 'Showroom', type: 'select', options: showrooms },
//         { key: 'direction', label: 'Direction', type: 'select', options: [{ value: 'in', label: 'In-flow only' }, { value: 'out', label: 'Out-flow only' }] },
//         { key: 'from', label: 'Period from', type: 'date' },
//         { key: 'to', label: 'Period to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Opening cash', value: moneyShort(showroomCashOpening), hint: '01 Aug 2026' },
//         { label: 'Total in-flow', value: moneyShort(inflow), delta: `${showroomCashLedger.filter((r) => r.inflow).length} receipts` },
//         { label: 'Total out-flow', value: moneyShort(outflow), tone: 'negative', delta: `${showroomCashLedger.filter((r) => r.outflow).length} payments` },
//         { label: 'Closing cash', value: moneyShort(closing), hint: '23 Aug 2026' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ sn: 'Total', inflow: money(inflow), outflow: money(outflow), balance: money(closing) }}
//       tableTitle="Cash transactions"
//       emptyTitle="No cash movement in this period"
//       emptyDescription="Widen the period or change the showroom, then generate again."
//       footnote="Cash lodgements appear as credits on the corresponding bank statement, and petty cash payments appear identically on the Petty Cash Statement — every entry is reflected consistently across all three."
//     />
//   )
// }

import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { useStore } from '../store.jsx'
import { fmtDate, money, moneyShort } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()
const PAGE_SIZE = 50

// Fallbacks — used only if the filter-metadata call fails
const FALLBACK_DIRECTIONS = [
  { value: 'IN', label: 'In-flow' },
  { value: 'OUT', label: 'Out-flow' },
]
const FALLBACK_SOURCES = [
  { value: 'OPENING', label: 'Opening' },
  { value: 'RECEIPT', label: 'Receipt' },
  { value: 'REFUND', label: 'Refund' },
  { value: 'CASH_LODGEMENT', label: 'Cash lodgement' },
  { value: 'PETTY_CASH_FUNDING', label: 'Petty cash funding' },
  { value: 'PETTY_CASH_PAYMENT', label: 'Petty cash payment' },
  { value: 'RUNNING_COST', label: 'Running cost' },
  { value: 'FUND_DISBURSEMENT_OUT', label: 'Fund disbursement out' },
  { value: 'FUND_DISBURSEMENT_IN', label: 'Fund disbursement in' },
  { value: 'FUND_DISBURSEMENT_RETURN', label: 'Fund disbursement return' },
  { value: 'PETTY_CASH_ALLOCATION_OUT', label: 'Petty cash allocation out' },
  { value: 'PETTY_CASH_ALLOCATION_IN', label: 'Petty cash allocation in' },
  { value: 'PETTY_CASH_ALLOCATION_RETURN', label: 'Petty cash allocation return' },
  { value: 'WALLET_WITHDRAWAL', label: 'Wallet withdrawal' },
  { value: 'DEPOSIT_REFUND', label: 'Deposit refund' },
  { value: 'COMMISSION_PAYOUT', label: 'Commission payout' },
  { value: 'CASH_COUNT_ADJUSTMENT', label: 'Cash count adjustment' },
]

const EMPTY_FILTERS = {
  locationId: '',
  direction: '',
  sourceType: '',
  from: '',
  to: '',
}

export default function AccountCashFlow({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  // ── showrooms ───────────────────────────────────────────
  const [showrooms, setShowrooms] = useState([])
  const [loadingShowrooms, setLoadingShowrooms] = useState(false)

  // ── filter metadata ─────────────────────────────────────
  const [filterMeta, setFilterMeta] = useState(null)

  // ── applied filters + pagination ────────────────────────
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)

  // ── report data ─────────────────────────────────────────
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // load showrooms once, auto-select first so the page populates
  useEffect(() => {
    let cancelled = false
    setLoadingShowrooms(true)
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        const list = (res.data || []).map((s) => ({
          value: s.id,
          label: s.label || s.name || s.code,
        }))
        setShowrooms(list)
        setApplied((prev) =>
          prev.locationId
            ? prev
            : { ...prev, locationId: list[0]?.value || '' }
        )
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load showrooms', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingShowrooms(false)
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  // load filter metadata once (drives direction & source dropdowns)
  useEffect(() => {
    let cancelled = false
    accountApi
      .retreiveAccountCashFlowFilters()
      .then((res) => {
        if (!cancelled) setFilterMeta(res.data)
      })
      .catch(() => {
        /* non-fatal — hardcoded enums take over */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // reset page on new query
  useEffect(() => {
    setPage(0)
  }, [applied])

  // ── load list ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (applied.locationId) q.locationId = applied.locationId
      if (applied.direction) q.direction = applied.direction
      if (applied.sourceType) q.sourceType = applied.sourceType
      if (applied.from) q.from = applied.from
      if (applied.to) q.to = applied.to

      const res = await accountApi.retreiveAccountCashFlow(q)
      const paged = res.data
      setRows(paged.items || [])
      setSummary(paged.summary || null)
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load cash flow', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  // "Generate report" → replace applied filters
  const handleGenerate = useCallback((values) => {
    setApplied({
      locationId: values?.locationId || '',
      direction: values?.direction || '',
      sourceType: values?.sourceType || '',
      from: values?.from || '',
      to: values?.to || '',
    })
  }, [])

  // ── filter options (metadata first, fallback second) ────
  const directionOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'direction')
    return f?.options?.length ? f.options : FALLBACK_DIRECTIONS
  }, [filterMeta])

  const sourceTypeOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'sourceType')
    return f?.options?.length ? f.options : FALLBACK_SOURCES
  }, [filterMeta])

  const sourceLabel = useMemo(() => {
    const m = {}
    for (const o of sourceTypeOptions) m[o.value] = o.label
    return m
  }, [sourceTypeOptions])

  // ── totals ──────────────────────────────────────────────
  const pageInflow = rows.reduce((n, r) => n + (r.inflow || 0), 0)
  const pageOutflow = rows.reduce((n, r) => n + (r.outflow || 0), 0)

  const opening = summary?.openingBalance ?? null
  const totalInflow = summary?.totalInflow ?? pageInflow
  const totalOutflow = summary?.totalOutflow ?? pageOutflow
  const closing = summary?.closingBalance ?? null
  const summaryFromPage =
    !summary?.openingBalance && !summary?.closingBalance

  const inflowCount = rows.filter((r) => r.inflow > 0).length
  const outflowCount = rows.filter((r) => r.outflow > 0).length

  // ── columns ─────────────────────────────────────────────
  const columns = [
    {
      key: 'sn',
      label: 'SN',
      width: 64,
      align: 'right',
      mono: true,
      render: (r, i) => r.sn ?? page * PAGE_SIZE + i + 1,
    },
    {
      key: 'date',
      label: 'Date',
      width: 130,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'reference',
      label: 'Reference',
      width: 120,
      mono: true,
      render: (r) => r.reference || '—',
    },
    {
      key: 'remark',
      label: 'Remark',
      width: 340,
      render: (r) => r.remark || '—',
    },
    {
      key: 'sourceType',
      label: 'Source',
      width: 190,
      render: (r) =>
        r.sourceType ? sourceLabel[r.sourceType] || r.sourceType : '—',
    },
    {
      key: 'expenseCategoryName',
      label: 'Category',
      width: 160,
      render: (r) => r.expenseCategoryName || '—',
    },
    {
      key: 'inflow',
      label: 'In-flow',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) =>
        r.inflow ? (
          <span style={{ color: 'var(--success)' }}>{money(r.inflow)}</span>
        ) : (
          '—'
        ),
    },
    {
      key: 'outflow',
      label: 'Out-flow',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) =>
        r.outflow ? (
          <span style={{ color: 'var(--danger)' }}>{money(r.outflow)}</span>
        ) : (
          '—'
        ),
    },
    {
      key: 'balance',
      label: 'Balance',
      width: 175,
      align: 'right',
      mono: true,
      render: (r) => (r.balance == null ? '—' : money(r.balance)),
    },
  ]

  const showroomOptions = showrooms.map((s) => ({
    value: s.value,
    label: s.label,
  }))

  return (
    <>
      {(loading || loadingShowrooms) && (
        <Loader
          overlay
          label={
            loadingShowrooms ? 'Loading showrooms…' : 'Loading cash flow…'
          }
        />
      )}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Cash Inflow/Outflow Statement'}
        icon={leaf?.icon}
        description="How physical cash is generated and used at the selected showroom, with a running balance after every transaction. Generate for any period — monthly, weekly or custom."
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'locationId',
            label: 'Showroom',
            type: 'select',
            options: showroomOptions,
            defaultValue: applied.locationId,
          },
          {
            key: 'direction',
            label: 'Direction',
            type: 'select',
            options: [{ value: '', label: 'Both' }, ...directionOptions],
            defaultValue: applied.direction,
          },
          {
            key: 'sourceType',
            label: 'Source',
            type: 'select',
            options: [{ value: '', label: 'All sources' }, ...sourceTypeOptions],
            defaultValue: applied.sourceType,
          },
          {
            key: 'from',
            label: 'Period from',
            type: 'date',
            defaultValue: applied.from,
          },
          {
            key: 'to',
            label: 'Period to',
            type: 'date',
            defaultValue: applied.to,
          },
        ]}
        stats={[
          {
            label: 'Opening cash',
            value: opening != null ? moneyShort(opening) : '—',
          },
          {
            label: 'Total in-flow',
            value: moneyShort(totalInflow),
            delta: inflowCount ? `${inflowCount} receipts` : undefined,
            hint: summaryFromPage ? 'This page only' : undefined,
          },
          {
            label: 'Total out-flow',
            value: moneyShort(totalOutflow),
            tone: 'negative',
            delta: outflowCount ? `${outflowCount} payments` : undefined,
            hint: summaryFromPage ? 'This page only' : undefined,
          },
          {
            label: 'Closing cash',
            value: closing != null ? moneyShort(closing) : '—',
          },
        ]}
        columns={columns}
        rows={rows}
        totals={{
          sn: 'Total',
          inflow: money(totalInflow),
          outflow: money(totalOutflow),
          balance: closing != null ? money(closing) : '—',
        }}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        tableTitle="Cash transactions"
        emptyTitle="No cash movement in this period"
        emptyDescription="Widen the period or change the showroom, then generate again."
        footnote="Cash lodgements appear as credits on the corresponding bank statement, and petty cash payments appear identically on the Petty Cash Statement — every entry is reflected consistently across all three."
      />
    </>
  )
}