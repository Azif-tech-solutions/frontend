// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { expenseCategories, pettyCashPayments } from '../sampleAccount.js'
// import { money, moneyShort } from '../utils.js'

// export default function PettyCashPaymentHistory({ leaf, moduleLabel, parentLabel }) {
//   const rows = pettyCashPayments.map((p, i) => ({ ...p, sn: i + 1 }))
//   const total = rows.reduce((n, r) => n + r.amount, 0)
//   const categories = new Set(rows.map((r) => r.category)).size
//   const largest = rows.reduce((m, r) => (r.amount > m.amount ? r : m), rows[0])

//   const columns = [
//     { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
//     { key: 'date', label: 'Payment date', width: 140 },
//     { key: 'ref', label: 'Reference', width: 125, mono: true },
//     { key: 'description', label: 'Description', width: 340 },
//     { key: 'category', label: 'Expense category', width: 210 },
//     { key: 'paidTo', label: 'Paid to', width: 200 },
//     { key: 'approvedBy', label: 'Approved by', width: 160 },
//     { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Petty Cash Payment History'}
//       icon={leaf?.icon}
//       description="Every payment made out of the petty cash account, with the expense category it was booked against and who approved it."
//       headerActions={<Badge tone="warning" uppercase>Pending activation</Badge>}
//       filters={[
//         { key: 'category', label: 'Expense category', type: 'select', options: expenseCategories.map((c) => ({ value: c.code, label: c.name })) },
//         { key: 'approvedBy', label: 'Approved by', type: 'select', options: [{ value: 'rd', label: 'R. Danladi' }, { value: 'mo', label: 'M. Okonkwo' }] },
//         { key: 'from', label: 'Period from', type: 'date' },
//         { key: 'to', label: 'Period to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Payments made', value: String(rows.length) },
//         { label: 'Total paid out', value: moneyShort(total) },
//         { label: 'Categories used', value: String(categories) },
//         { label: 'Largest payment', value: moneyShort(largest.amount), hint: largest.category },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ sn: 'Total', amount: money(total) }}
//       tableTitle="Payment history"
//       emptyTitle="No petty cash payments in this period"
//       emptyDescription="Widen the period or clear the category filter, then generate again."
//       footnote="This report is not yet active in the current build. The layout and columns below are final, but live data will only populate once petty cash payment logging is switched on."
//     />
//   )
// }
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()
const PAGE_SIZE = 50

// Fallback — only used if the filter-metadata call fails
const FALLBACK_SOURCES = [
  { value: 'Petty cash payment', label: 'Petty cash payment' },
  { value: 'Running cost', label: 'Running cost' },
]
const FALLBACK_STATUSES = [
  { value: 'POSTED', label: 'Posted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REVERSED', label: 'Reversed' },
]

const STATUS_TONE = {
  POSTED: 'success',
  APPROVED: 'success',
  REVERSED: 'danger',
}
const SOURCE_TONE = {
  'Petty cash payment': 'brand',
  'Running cost': 'info',
}

const EMPTY_FILTERS = {
  pettyCashAccountId: '',
  locationId: '',
  expenseCategoryId: '',
  source: '',
  status: '',
  from: '',
  to: '',
}

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

// ExpenseCategories need every field on the request type — we send
// permissive defaults and narrow by pettyCashAllowed.
const EXPENSE_CATEGORY_QUERY = {
  q: '',
  accountHead: [],
  status: '',
  pettyCashAllowed: true,
  overCap: false,
  sort: '',
}

export default function PettyCashPaymentHistory({ leaf, moduleLabel, parentLabel }) {
  const { factories, showToast } = useStore()

  // ── filter metadata ─────────────────────────────────────
  const [filterMeta, setFilterMeta] = useState(null)

  // ── lookups ─────────────────────────────────────────────
  const [accounts, setAccounts] = useState([])         // petty cash accounts
  const [expenseCategories, setExpenseCategories] = useState([])
  const [locations, setLocations] = useState([])       // factories + showrooms

  // ── applied filters + pagination ────────────────────────
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)

  // ── history data ────────────────────────────────────────
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // ── load filter metadata once ───────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .getPettyCashAccountFilters()
      .then((res) => {
        if (!cancelled) setFilterMeta(res.data)
      })
      .catch(() => {
        /* non-fatal — falls back to hardcoded enums */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── petty cash accounts ─────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listCashAccounts({ kind: ['PETTY_CASH'] })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setAccounts(
          list.map((a) => ({
            value: a.id,
            label: `${a.code} · ${a.name}${
              a.location?.name ? ` (${a.location.name})` : ''
            }`,
          }))
        )
      })
      .catch(() => {
        /* non-fatal */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── expense categories ──────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listExpenseCategories(EXPENSE_CATEGORY_QUERY)
      .then((list) => {
        if (cancelled) return
        setExpenseCategories(
          (list || []).map((c) => ({
            value: c.id,
            label: c.name,
          }))
        )
      })
      .catch(() => {
        /* non-fatal */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── locations (factories + showrooms) ───────────────────
  useEffect(() => {
    let cancelled = false
    showroomApi
      .lookupPickerWithAreas({ status: ['ACTIVE'] })
      .then((res) => {
        if (cancelled) return
        const showroomOptions = (res.data || []).map((s) => ({
          value: s.id,
          label: `${s.label || s.name || s.code} (showroom)`,
        }))
        const factoryOptions = (factories || []).map((f) => ({
          value: f.id,
          label: `${f.name} (factory)`,
        }))
        setLocations([...factoryOptions, ...showroomOptions])
      })
      .catch(() => {
        if (cancelled) return
        setLocations(
          (factories || []).map((f) => ({
            value: f.id,
            label: `${f.name} (factory)`,
          }))
        )
      })
    return () => {
      cancelled = true
    }
  }, [factories])

  // ── reset page when the applied query changes ──────────
  useEffect(() => {
    setPage(0)
  }, [applied])

  // ── load history ────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (applied.pettyCashAccountId) q.pettyCashAccountId = applied.pettyCashAccountId
      if (applied.locationId) q.locationId = applied.locationId
      if (applied.expenseCategoryId) q.expenseCategoryId = applied.expenseCategoryId
      if (applied.source) q.source = applied.source
      if (applied.status) q.status = applied.status
      if (applied.from) q.from = applied.from
      if (applied.to) q.to = applied.to

      const res = await accountApi.getPettyCashAccountHistory(q)
      const paged = res.data
      setRows(paged.items || [])
      setSummary(paged.summary || null)
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load payment history', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  const handleGenerate = useCallback((values) => {
    setApplied({
      pettyCashAccountId: values?.pettyCashAccountId || '',
      locationId: values?.locationId || '',
      expenseCategoryId: values?.expenseCategoryId || '',
      source: values?.source || '',
      status: values?.status || '',
      from: values?.from || '',
      to: values?.to || '',
    })
  }, [])

  // ── filter options ──────────────────────────────────────
  const sourceOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'source')
    return f?.options?.length ? f.options : FALLBACK_SOURCES
  }, [filterMeta])

  const statusOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'status')
    return f?.options?.length ? f.options : FALLBACK_STATUSES
  }, [filterMeta])

  // ── derived numbers ─────────────────────────────────────
  const pageTotal = rows.reduce((n, r) => n + (r.amount || 0), 0)
  const categoryCount = new Set(
    rows.map((r) => r.category).filter(Boolean)
  ).size

  const largest = rows.reduce(
    (m, r) => ((r.amount || 0) > (m?.amount || 0) ? r : m),
    rows[0]
  )

  // summary is `Record<string, unknown>` — try a few common shapes,
  // fall back to page-level sums.
  const totalPaid =
    typeof summary?.totalAmount === 'number'
      ? summary.totalAmount
      : typeof summary?.totalPaid === 'number'
        ? summary.totalPaid
        : pageTotal

  const largestAmount =
    typeof summary?.largestPayment === 'number'
      ? summary.largestPayment
      : largest?.amount || 0

  const largestCategory =
    typeof summary?.largestCategory === 'string'
      ? summary.largestCategory
      : largest?.category || ''

  // ── columns ─────────────────────────────────────────────
  const columns = [
    { key: 'sn', label: 'SN', width: 64, align: 'right', mono: true },
    {
      key: 'date',
      label: 'Payment date',
      width: 140,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    { key: 'ref', label: 'Reference', width: 125, mono: true },
    { key: 'description', label: 'Description', width: 320 },
    {
      key: 'category',
      label: 'Expense category',
      width: 200,
      render: (r) => r.category || '—',
    },
    {
      key: 'pettyCashAccountCode',
      label: 'Account',
      width: 120,
      mono: true,
      render: (r) => r.pettyCashAccountCode || '—',
    },
    {
      key: 'paidTo',
      label: 'Paid to',
      width: 190,
      render: (r) => r.paidTo || '—',
    },
    {
      key: 'approvedBy',
      label: 'Approved by',
      width: 160,
      render: (r) => r.approvedBy || '—',
    },
    {
      key: 'source',
      label: 'Source',
      width: 170,
      render: (r) => (
        <Badge tone={SOURCE_TONE[r.source] || 'neutral'}>
          {r.source || '—'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: 120,
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
          {r.status || '—'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) => money(r.amount || 0),
    },
  ]

  const accountOptions = [
    { value: '', label: 'All petty cash accounts' },
    ...accounts,
  ]
  const locationOptions = [
    { value: '', label: 'All locations' },
    ...locations,
  ]
  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...expenseCategories,
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading payment history…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Petty Cash Payment History'}
        icon={leaf?.icon}
        description="Every payment made out of the petty cash account, with the expense category it was booked against and who approved it."
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'pettyCashAccountId',
            label: 'Petty cash account',
            type: 'select',
            options: accountOptions,
            defaultValue: applied.pettyCashAccountId,
          },
          {
            key: 'expenseCategoryId',
            label: 'Expense category',
            type: 'select',
            options: categoryOptions,
            defaultValue: applied.expenseCategoryId,
          },
          {
            key: 'source',
            label: 'Source',
            type: 'select',
            options: [{ value: '', label: 'All sources' }, ...sourceOptions],
            defaultValue: applied.source,
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [{ value: '', label: 'All statuses' }, ...statusOptions],
            defaultValue: applied.status,
          },
          {
            key: 'locationId',
            label: 'Location',
            type: 'select',
            options: locationOptions,
            defaultValue: applied.locationId,
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
          { label: 'Payments made', value: String(totalItems) },
          { label: 'Total paid out', value: moneyShort(totalPaid) },
          { label: 'Categories used', value: String(categoryCount) },
          {
            label: 'Largest payment',
            value: largestAmount ? moneyShort(largestAmount) : '—',
            hint: largestCategory || undefined,
          },
        ]}
        columns={columns}
        rows={rows}
        totals={{
          sn: 'Total',
          amount: money(totalPaid),
        }}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        tableTitle="Payment history"
        emptyTitle="No petty cash payments in this period"
        emptyDescription="Widen the period or clear the filters, then generate again."
        footnote="Every payment here also appears as an out-flow on the Cash Inflow/Outflow Statement. Running cost payments (source = Running cost) are disbursements outside the petty cash ledger but included here for reconciliation."
      />
    </>
  )
}