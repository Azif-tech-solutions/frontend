// import { useEffect, useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Statement } from '../shells/Statement.jsx'
// import { cashInflows, cashOutflows, cashOpeningBalance, cashLedger } from '../sample.js'
// import { money, moneyShort } from '../utils.js'
// import { useStore } from '../store.jsx'
// import AccountApi from '../../api/AccountApi.js'
// import FactoryApi from '../../api/FactoryApi.js'

// let factoryApi = new FactoryApi()
// let accountApi = new AccountApi()
// const sum = (a, k = 'current') => a.reduce((n, x) => n + x[k], 0)
// const pct = (cur, prior) => (prior ? `${cur >= prior ? '+' : ''}${(((cur - prior) / prior) * 100).toFixed(1)}%` : '—')

// // "THIS_MONTH" -> "This month"
// const sentence = (s = '') => {
//   const t = s.toLowerCase().replace(/_/g, ' ')
//   return t.charAt(0).toUpperCase() + t.slice(1)
// }

// /**
//  * Options for a field that points at a lookup endpoint. The only lookup the
//  * cash-flow filters use today is expense categories, which the existing list
//  * method already covers.
//  */
// async function loadLookup(field) {
//   if (field.lookup?.includes('expense-categories')) {
//     const cats = await accountApi.listExpenseCategories({})
//     return cats.map((c) => ({ value: c.id, label: c.name }))
//   }
//   return []
// }

// /**
//  * Turns the endpoint's field list into the filter definitions ReportShell takes.
//  * Filter keys follow the field keys, so they can go straight back to the API.
//  *   ENUM              -> select (options come with the field)
//  *   UUID with lookup  -> select (options loaded from the lookup)
//  *   MONEY             -> min / max number pair
//  *   DATE              -> from / to pair (the primary date uses plain from / to),
//  *                        with the period presets just before the primary date
//  */
// function buildFilters(meta, lookups) {
//   if (!meta) return []
//   const out = []

//   for (const f of meta.fields || []) {
//     if (f.type === 'ENUM') {
//       out.push({ key: f.key, label: f.label, type: 'select', options: f.options || [] })
//     } else if (f.type === 'UUID' && f.lookup) {
//       out.push({ key: f.key, label: f.label, type: 'select', options: lookups[f.key] || [] })
//     } else if (f.type === 'MONEY') {
//       out.push(
//         { key: `${f.key}Min`, label: `${f.label} from`, type: 'number' },
//         { key: `${f.key}Max`, label: `${f.label} to`, type: 'number' },
//       )
//     } else if (f.type === 'DATE') {
//       const primary = f.key === meta.primaryDate
//       if (primary && meta.periodPresets?.length) {
//         out.push({
//           key: 'period',
//           label: 'Period',
//           type: 'select',
//           options: meta.periodPresets.map((p) => ({ value: p, label: sentence(p) })),
//         })
//       }
//       out.push(
//         { key: primary ? 'from' : `${f.key}From`, label: `${f.label} from`, type: 'date' },
//         { key: primary ? 'to' : `${f.key}To`, label: `${f.label} to`, type: 'date' },
//       )
//     }
//   }
//   return out
// }

// export default function CashFlowStatement({ leaf, moduleLabel, parentLabel }) {
//   const { showToast } = useStore()
//   const [filters, setFilters] = useState([])

//   // Filters come from the backend, so a new field there shows up here without a code change.
//   useEffect(() => {
//     let cancelled = false
//     accountApi
//       .getCashFlowFieldFilters()
//       .then(async (meta) => {
//         const lookups = {}
//         await Promise.all(
//           (meta.fields || [])
//             .filter((f) => f.lookup)
//             .map(async (f) => {
//               try { lookups[f.key] = await loadLookup(f) } catch { lookups[f.key] = [] }
//             }),
//         )
//         if (!cancelled) setFilters(buildFilters(meta, lookups))
//       })
//       .catch((e) => !cancelled && showToast('Could not load filters', e.message, true))
//     return () => { cancelled = true }
//   }, [showToast])

//   const inflow = sum(cashInflows)
//   const outflow = sum(cashOutflows)
//   const net = inflow - outflow
//   const closing = cashOpeningBalance + net

//   const line = (r) => ({
//     label: r.label,
//     note: r.note,
//     values: [money(r.current), money(r.prior)],
//     change: pct(r.current, r.prior),
//     changeTone: r.current >= r.prior ? 'positive' : 'negative',
//   })

//   const columns = [
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'ref', label: 'Reference', width: 110, mono: true },
//     { key: 'description', label: 'Description', width: 330 },
//     { key: 'head', label: 'Head', width: 240 },
//     {
//       key: 'direction', label: 'Direction', width: 110,
//       render: (r) => <Badge tone={r.direction === 'In' ? 'success' : 'neutral'}>{r.direction}</Badge>,
//     },
//     {
//       key: 'amount', label: 'Amount', width: 180, align: 'right', mono: true,
//       render: (r) => (
//         <span style={{ color: r.direction === 'In' ? 'var(--success)' : 'var(--danger)' }}>
//           {r.direction === 'In' ? '+' : '−'}{money(r.amount).replace('₦', '₦')}
//         </span>
//       ),
//     },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Cash Inflow/Outflow Statement'}
//       icon={leaf?.icon}
//       description="Movement of funds through the factory — cash generated from factory and by-product sales, and funds disbursed by Management for internal operational use."
//       filters={filters}
//       stats={[
//         { label: 'Opening balance', value: moneyShort(cashOpeningBalance), hint: '01 Aug 2026' },
//         { label: 'Total inflow', value: moneyShort(inflow), delta: pct(inflow, sum(cashInflows, 'prior')) },
//         { label: 'Total outflow', value: moneyShort(outflow), tone: 'negative', delta: pct(outflow, sum(cashOutflows, 'prior')) },
//         { label: 'Closing balance', value: moneyShort(closing), hint: '23 Aug 2026' },
//       ]}
//       columns={columns}
//       rows={cashLedger}
//       totals={{ date: 'Net movement', amount: money(net) }}
//       tableTitle="Transaction ledger"
//       emptyTitle="No cash movement in this period"
//       emptyDescription="Widen the date range or clear the head filter, then generate again."
//       footnote="Every entry above rolls into the statement heads shown, and is reflected consistently across the Petty Cash and Bank statements."
//     >
//       <Statement
//         columns={['This period', 'Prior period']}
//         sections={[
//           {
//             title: 'Inflows',
//             tone: 'positive',
//             rows: cashInflows.map(line),
//             subtotal: { label: 'Total inflow', values: [money(inflow), money(sum(cashInflows, 'prior'))], change: pct(inflow, sum(cashInflows, 'prior')), changeTone: 'positive' },
//           },
//           {
//             title: 'Outflows',
//             tone: 'negative',
//             rows: cashOutflows.map(line),
//             subtotal: { label: 'Total outflow', values: [money(outflow), money(sum(cashOutflows, 'prior'))], change: pct(outflow, sum(cashOutflows, 'prior')), changeTone: 'negative' },
//           },
//         ]}
//         result={{
//           label: 'Net cash movement',
//           note: `Opening ${money(cashOpeningBalance)} · Closing ${money(closing)}`,
//           values: [money(net), money(sum(cashInflows, 'prior') - sum(cashOutflows, 'prior'))],
//           tone: net >= 0 ? 'positive' : 'negative',
//           change: pct(net, sum(cashInflows, 'prior') - sum(cashOutflows, 'prior')),
//           changeTone: 'positive',
//         }}
//       />
//     </ReportShell>
//   )
// }




import { useEffect, useMemo, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { money, moneyShort } from '../utils.js'
import { useStore } from '../store.jsx'
import AccountApi from '../../api/AccountApi.js'

const accountApi = new AccountApi()

const PAGE_SIZE = 20

// "THIS_MONTH" -> "This month"
const sentence = (s = '') => {
  const t = s.toLowerCase().replace(/_/g, ' ')
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const fmtDate = (iso) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso || ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Options for a field that points at a lookup endpoint. The only lookup the
 * cash-flow filters use today is expense categories, which the existing list
 * method already covers.
 */
async function loadLookup(field) {
  if (field.lookup?.includes('expense-categories')) {
    const cats = await accountApi.listExpenseCategories({})
    return cats.map((c) => ({ value: c.id, label: c.name }))
  }
  return []
}

/**
 * Turns the endpoint's field list into the filter definitions ReportShell takes.
 * Filter keys follow the field keys, so they go straight back to the API.
 */
function buildFilters(meta, lookups) {
  if (!meta) return []
  const out = []

  for (const f of meta.fields || []) {
    if (f.type === 'ENUM') {
      out.push({ key: f.key, label: f.label, type: 'select', options: f.options || [] })
    } else if (f.type === 'UUID' && f.lookup) {
      out.push({ key: f.key, label: f.label, type: 'select', options: lookups[f.key] || [] })
    } else if (f.type === 'MONEY') {
      out.push(
        { key: `${f.key}Min`, label: `${f.label} from`, type: 'number' },
        { key: `${f.key}Max`, label: `${f.label} to`, type: 'number' },
      )
    } else if (f.type === 'DATE') {
      const primary = f.key === meta.primaryDate
      if (primary && meta.periodPresets?.length) {
        out.push({
          key: 'period',
          label: 'Period',
          type: 'select',
          options: meta.periodPresets.map((p) => ({ value: p, label: sentence(p) })),
        })
      }
      out.push(
        { key: primary ? 'from' : `${f.key}From`, label: `${f.label} from`, type: 'date' },
        { key: primary ? 'to' : `${f.key}To`, label: `${f.label} to`, type: 'date' },
      )
    }
  }
  return out
}

// Drop empty filter values so they are not sent as blank query params.
const cleanFilters = (values = {}) =>
  Object.fromEntries(Object.entries(values).filter(([, v]) => v !== '' && v != null))

export default function CashFlowStatement({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  // filters (built from the backend's field list)
  const [filters, setFilters] = useState([])
  const [sourceLabels, setSourceLabels] = useState({})

  // data
  const [applied, setApplied] = useState({}) // filter values the list is currently using
  const [page, setPage] = useState(0)
  const [items, setItems] = useState([])
  const [pageInfo, setPageInfo] = useState({ totalItems: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)

  // Filters come from the backend, so a new field there shows up here without a code change.
  useEffect(() => {
    let cancelled = false
    accountApi
      .getCashFlowFieldFilters()
      .then(async (meta) => {
        const lookups = {}
        await Promise.all(
          (meta.fields || [])
            .filter((f) => f.lookup)
            .map(async (f) => {
              try { lookups[f.key] = await loadLookup(f) } catch { lookups[f.key] = [] }
            }),
        )
        if (cancelled) return
        setFilters(buildFilters(meta, lookups))
        // sourceType value -> label, used for the Head column
        const src = (meta.fields || []).find((f) => f.key === 'sourceType')
        setSourceLabels(Object.fromEntries((src?.options || []).map((o) => [o.value, o.label])))
      })
      .catch((e) => !cancelled && showToast('Could not load filters', e.message, true))
    return () => { cancelled = true }
  }, [showToast])

  // One page of the statement. Runs again when the applied filters or the page change.
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    accountApi
      .getCashFlowStatement({ ...applied, page, size: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return
        const d = res.data
        setItems(d.items ?? [])
        setPageInfo({ totalItems: d.totalItems ?? 0, totalPages: d.totalPages ?? 1 })
      })
      .catch((e) => !cancelled && showToast('Could not load cash flow', e.message, true))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [applied, page, showToast])

  // Called by ReportShell when the user generates the report with the chosen filters.
  const applyFilters = (values) => {
    setApplied(cleanFilters(values))
    setPage(0)
  }

  // Normalise each API row. The type file spells the inflow field "inflflow";
  // both spellings are read so either works.
  const entries = useMemo(
    () =>
      items.map((r) => {
        const inAmt = Number(r.inflow ?? r.inflflow) || 0
        const outAmt = Number(r.outflow) || 0
        return {
          id: r.id,
          date: fmtDate(r.date),
          ref: r.reference || '—',
          description: r.remark || '—',
          head: r.expenseCategoryName || sourceLabels[r.sourceType] || sentence(r.sourceType) || '—',
          account: r.accountName || r.accountCode || '—',
          direction: inAmt > 0 ? 'In' : 'Out',
          amount: inAmt > 0 ? inAmt : outAmt,
          inAmt,
          outAmt,
          balance: Number(r.balance) || 0,
        }
      }),
    [items, sourceLabels],
  )

  // Totals cover the entries on this page only; the endpoint is paged.
  const inflow = entries.reduce((n, e) => n + e.inAmt, 0)
  const outflow = entries.reduce((n, e) => n + e.outAmt, 0)
  const net = inflow - outflow

  // Group this page's entries by head for the statement.
  const group = (dir) => {
    const map = new Map()
    for (const e of entries) {
      const v = dir === 'In' ? e.inAmt : e.outAmt
      if (v > 0) map.set(e.head, (map.get(e.head) || 0) + v)
    }
    return [...map].map(([label, value]) => ({ label, values: [money(value)] }))
  }

  const columns = [
    { key: 'date', label: 'Date', width: 130 },
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    { key: 'description', label: 'Description', width: 300 },
    { key: 'head', label: 'Head', width: 200 },
    { key: 'account', label: 'Account', width: 160 },
    {
      key: 'direction', label: 'Direction', width: 110,
      render: (r) => <Badge tone={r.direction === 'In' ? 'success' : 'neutral'}>{r.direction}</Badge>,
    },
    {
      key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true,
      render: (r) => (
        <span style={{ color: r.direction === 'In' ? 'var(--success)' : 'var(--danger)' }}>
          {r.direction === 'In' ? '+' : '−'}{money(r.amount)}
        </span>
      ),
    },
    {
      key: 'balance', label: 'Balance', width: 170, align: 'right', mono: true,
      render: (r) => money(r.balance),
    },
  ]
  const resetFilters = () => {
  setApplied({})
  setPage(0)
}

  return (
    <ReportShell
      wide
      crumbs={[moduleLabel, parentLabel]}
      title={leaf?.label || 'Cash Inflow/Outflow Statement'}
      icon={leaf?.icon}
      description="Movement of funds through the factory — cash generated from factory and by-product sales, and funds disbursed by Management for internal operational use."
      filters={filters}
       onReset={resetFilters}
      onGenerate={applyFilters}
      stats={[
        { label: 'Total inflow', value: moneyShort(inflow), hint: 'This page' },
        { label: 'Total outflow', value: moneyShort(outflow), tone: 'negative', hint: 'This page' },
        { label: 'Net movement', value: moneyShort(net), hint: 'This page' },
        { label: 'Entries', value: String(pageInfo.totalItems), hint: 'Matching the filters' },
      ]}
      columns={columns}
      rows={entries}
      pagination={{
        page,
        pageCount: pageInfo.totalPages,
        pageSize: PAGE_SIZE,
        total: pageInfo.totalItems,
        onPage: setPage,
      }}
      // onGenerate={applyFilters}
     
      totals={{ date: 'Net movement (this page)', amount: money(net) }}
      tableTitle="Transaction ledger"
      emptyTitle="No cash movement in this period"
      emptyDescription="Widen the date range or clear the head filter, then generate again."
      footnote="Every entry above rolls into the statement heads shown, and is reflected consistently across the Petty Cash and Bank statements."
    >
      {loading && <Loader overlay label="Loading cash flow…" />}

      {entries.length > 0 && (
        <Statement
          columns={['Entries on this page']}
          sections={[
            {
              title: 'Inflows',
              tone: 'positive',
              rows: group('In'),
              subtotal: { label: 'Total inflow', values: [money(inflow)] },
            },
            {
              title: 'Outflows',
              tone: 'negative',
              rows: group('Out'),
              subtotal: { label: 'Total outflow', values: [money(outflow)] },
            },
          ]}
          result={{
            label: 'Net cash movement',
            values: [money(net)],
            tone: net >= 0 ? 'positive' : 'negative',
          }}
        />
      )}
    </ReportShell>
  )
}