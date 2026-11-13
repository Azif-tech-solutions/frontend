// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Statement } from '../shells/Statement.jsx'
// import { expenseCategories, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
// import { money, moneyShort, withBalance } from '../utils.js'

// export default function PettyCashStatement({ leaf, moduleLabel, parentLabel }) {
//   const funded = pettyCashFunding.reduce((n, r) => n + r.amount, 0)
//   const spent = pettyCashPayments.reduce((n, r) => n + r.amount, 0)
//   const closing = pettyCashOpening + funded - spent

//   // Combined ledger so funding and spending read in date order.
//   const entries = [
//     ...pettyCashFunding.map((f) => ({ ...f, direction: 'Funding', category: '—', amount: f.amount })),
//     ...pettyCashPayments.map((p) => ({ ...p, direction: 'Payment' })),
//   ].sort((a, b) => new Date(a.date.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3')) - new Date(b.date.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3')))

//   const rows = withBalance(entries, pettyCashOpening, (e) => (e.direction === 'Funding' ? e.amount : -e.amount))

//   // Utilisation grouped by expense category, for the statement body.
//   const byCategory = Object.values(
//     pettyCashPayments.reduce((acc, p) => {
//       acc[p.category] ||= { label: p.category, total: 0, count: 0 }
//       acc[p.category].total += p.amount
//       acc[p.category].count += 1
//       return acc
//     }, {})
//   ).sort((a, b) => b.total - a.total)

//   const columns = [
//     { key: 'date', label: 'Date', width: 135 },
//     { key: 'ref', label: 'Reference', width: 120, mono: true },
//     { key: 'description', label: 'Description', width: 340 },
//     { key: 'category', label: 'Category', width: 200 },
//     {
//       key: 'direction', label: 'Type', width: 120,
//       render: (r) => <Badge tone={r.direction === 'Funding' ? 'success' : 'neutral'}>{r.direction}</Badge>,
//     },
//     {
//       key: 'in', label: 'Funded', width: 160, align: 'right', mono: true,
//       render: (r) => (r.direction === 'Funding' ? <span style={{ color: 'var(--success)' }}>{money(r.amount)}</span> : '—'),
//     },
//     {
//       key: 'out', label: 'Utilised', width: 160, align: 'right', mono: true,
//       render: (r) => (r.direction === 'Payment' ? <span style={{ color: 'var(--danger)' }}>{money(r.amount)}</span> : '—'),
//     },
//     { key: 'balance', label: 'Balance', width: 165, align: 'right', mono: true, render: (r) => money(r.balance) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Petty Cash Statement'}
//       icon={leaf?.icon}
//       description="How the petty cash account was funded and how it has been utilised over the period, with a running balance after every entry."
//       filters={[
//         { key: 'category', label: 'Expense category', type: 'select', options: expenseCategories.map((c) => ({ value: c.code, label: c.name })) },
//         { key: 'direction', label: 'Entry type', type: 'select', options: [{ value: 'funding', label: 'Funding only' }, { value: 'payment', label: 'Payments only' }] },
//         { key: 'from', label: 'Period from', type: 'date' },
//         { key: 'to', label: 'Period to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Opening balance', value: moneyShort(pettyCashOpening), hint: '01 Aug 2026' },
//         { label: 'Total funded', value: moneyShort(funded), delta: `${pettyCashFunding.length} top-ups` },
//         { label: 'Total utilised', value: moneyShort(spent), tone: 'negative', delta: `${pettyCashPayments.length} payments` },
//         { label: 'Balance available', value: moneyShort(closing), hint: '23 Aug 2026' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ date: 'Total', in: money(funded), out: money(spent), balance: money(closing) }}
//       tableTitle="Petty cash ledger"
//       emptyTitle="No petty cash activity in this period"
//       emptyDescription="Widen the period or clear the category filter, then generate again."
//       footnote="Every payment here also appears as an out-flow on the Cash Inflow/Outflow Statement, and each funding entry matches a debit on the funding bank account."
//     >
//       <Statement
//         columns={['Amount']}
//         sections={[
//           {
//             title: 'Funding',
//             tone: 'positive',
//             rows: [
//               { label: 'Opening balance', note: '01 Aug 2026', values: [money(pettyCashOpening)] },
//               ...pettyCashFunding.map((f) => ({ label: f.description, note: f.date, values: [money(f.amount)] })),
//             ],
//             subtotal: { label: 'Total available', values: [money(pettyCashOpening + funded)] },
//           },
//           {
//             title: 'Utilisation by category',
//             tone: 'negative',
//             rows: byCategory.map((c) => ({
//               label: c.label,
//               note: `${c.count} payment${c.count === 1 ? '' : 's'}`,
//               values: [money(c.total)],
//             })),
//             subtotal: { label: 'Total utilised', values: [money(spent)] },
//           },
//         ]}
//         result={{
//           label: 'Petty cash balance',
//           note: `${((spent / (pettyCashOpening + funded)) * 100).toFixed(1)}% of available funds utilised this period.`,
//           values: [money(closing)],
//           tone: closing > 0 ? 'positive' : 'negative',
//         }}
//       />
//     </ReportShell>
//   )
// }

import { useEffect, useState, useCallback } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Statement } from '../shells/Statement.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'

const accountApi = new AccountApi()
const PAGE_SIZE = 50

// Direction → badge tone. Backend uses strings like "Opening", "Funding",
// "Payment"; match case-insensitively so we don't break on a rename.
function directionTone(r) {
  const d = (r.direction || '').toLowerCase()
  if (d.includes('open')) return 'neutral'
  if (d.includes('fund') || d.includes('receipt') || (r.in || 0) > 0)
    return 'success'
  if (d.includes('pay') || d.includes('out') || (r.out || 0) > 0)
    return 'danger'
  return 'neutral'
}

function isOpening(r) {
  return /opening/i.test(r.direction || '')
}

export default function PettyCashStatement({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  // data
  const [accounts, setAccounts] = useState([])
  const [period, setPeriod] = useState(null)
  const [ledgerItems, setLedgerItems] = useState([])
  const [ledgerTotalPages, setLedgerTotalPages] = useState(0)
  const [ledgerTotalItems, setLedgerTotalItems] = useState(0)
  const [statement, setStatement] = useState(null)

  // query
  const [applied, setApplied] = useState({ accountId: '', from: '', to: '' })
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  // reset page on new query
  useEffect(() => {
    setPage(0)
  }, [applied])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (applied.accountId) q.pettyCashAccountId = applied.accountId
      if (applied.from) q.from = applied.from
      if (applied.to) q.to = applied.to

      const res = await accountApi.getPettyCashAccountStatement(q)
      const d = res.data
      setAccounts(d.accounts || [])
      setPeriod(d.period || null)
      setLedgerItems(d.ledger?.items || [])
      setLedgerTotalPages(d.ledger?.totalPages || 0)
      setLedgerTotalItems(d.ledger?.totalItems || 0)
      setStatement(d.statement || null)
    } catch (e) {
      showToast('Could not load statement', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  const handleGenerate = useCallback((values) => {
    setApplied({
      accountId: values?.accountId || '',
      from: values?.from || '',
      to: values?.to || '',
    })
  }, [])

  // ── derived numbers ────────────────────────────────────
  const pageIn = ledgerItems.reduce((n, r) => n + (r.in || 0), 0)
  const pageOut = ledgerItems.reduce((n, r) => n + (r.out || 0), 0)

  const openingEntries = ledgerItems.filter(isOpening)
  const openingFromLedger = openingEntries.reduce(
    (n, r) => n + (r.in || 0),
    0
  )

  const paymentEntries = ledgerItems.filter((r) => (r.out || 0) > 0)

  // Opening / available: prefer the ledger when it has explicit Opening rows
  // (the server returns 0 for those fields even when the ledger carries the
  // initial balance). Fall back to statement for paginated views.
  const openingBalance =
    openingFromLedger || (statement?.funding?.openingBalance ?? 0)
  const totalAvailable = pageIn || (statement?.funding?.totalAvailable ?? 0)
  const totalUtilised = pageOut || (statement?.totalUtilised ?? 0)
  const closingBalance =
    statement?.closingBalance ??
    (ledgerItems[ledgerItems.length - 1]?.balance ?? 0)
  const utilisedPct = statement?.utilisedPct ?? 0

  // utilisation by category — server value when populated, ledger fallback
  const utilisationByCategory =
    statement?.utilisationByCategory?.length
      ? statement.utilisationByCategory
      : Object.values(
          paymentEntries.reduce((acc, r) => {
            const key = r.category || 'Uncategorised'
            acc[key] ||= { category: key, amount: 0, count: 0 }
            acc[key].amount += r.out
            acc[key].count += 1
            return acc
          }, {})
        ).sort((a, b) => b.amount - a.amount)

  // ── columns ────────────────────────────────────────────
  const columns = [
    {
      key: 'date',
      label: 'Date',
      width: 130,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    { key: 'ref', label: 'Reference', width: 120, mono: true },
    { key: 'accountCode', label: 'Account', width: 110, mono: true },
    { key: 'description', label: 'Description', width: 300 },
    {
      key: 'category',
      label: 'Category',
      width: 180,
      render: (r) => r.category || '—',
    },
    {
      key: 'direction',
      label: 'Type',
      width: 120,
      render: (r) => (
        <Badge tone={directionTone(r)}>{r.direction || '—'}</Badge>
      ),
    },
    {
      key: 'in',
      label: 'In',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) =>
        r.in ? (
          <span style={{ color: 'var(--success)' }}>{money(r.in)}</span>
        ) : (
          '—'
        ),
    },
    {
      key: 'out',
      label: 'Out',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) =>
        r.out ? (
          <span style={{ color: 'var(--danger)' }}>{money(r.out)}</span>
        ) : (
          '—'
        ),
    },
    {
      key: 'balance',
      label: 'Balance',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) => (r.balance == null ? '—' : money(r.balance)),
    },
  ]

  // ── filter options ─────────────────────────────────────
  const accountOptions = [
    { value: '', label: 'All petty cash accounts' },
    ...accounts.map((a) => ({
      value: a.id,
      label: `${a.code} · ${a.name}${a.locationName ? ` (${a.locationName})` : ''}`,
    })),
  ]

  const periodFrom = period?.from
    ? fmtDate(period.from)
    : applied.from
      ? fmtDate(applied.from)
      : '—'
  const periodTo = period?.to
    ? fmtDate(period.to)
    : applied.to
      ? fmtDate(applied.to)
      : '—'

  // ── Statement shell sections ───────────────────────────
  const fundingRows = []

  // opening entries (either from statement, or from the ledger page 0)
  if (openingEntries.length > 0) {
    fundingRows.push(
      ...openingEntries.map((r) => ({
        label: r.description || 'Opening balance',
        note: `${r.accountCode}${r.date ? ` · ${fmtDate(r.date)}` : ''}`,
        values: [money(r.in || 0)],
      }))
    )
  } else if ((statement?.funding?.openingBalance ?? 0) > 0) {
    fundingRows.push({
      label: 'Opening balance',
      note: periodFrom,
      values: [money(statement.funding.openingBalance)],
    })
  }

  // additional funding (Funding/Receipt-direction entries on this page)
  const extraFunding = ledgerItems.filter(
    (r) => (r.in || 0) > 0 && !isOpening(r)
  )
  if (extraFunding.length > 0) {
    fundingRows.push(
      ...extraFunding.map((r) => ({
        label: r.description || 'Funding',
        note: `${r.accountCode}${r.date ? ` · ${fmtDate(r.date)}` : ''}`,
        values: [money(r.in || 0)],
      }))
    )
  }

  const sections = []
  if (fundingRows.length > 0) {
    sections.push({
      title: 'Funding',
      tone: 'positive',
      rows: fundingRows,
      subtotal: {
        label: 'Total available',
        values: [money(totalAvailable)],
      },
    })
  }
  sections.push({
    title: 'Utilisation by category',
    tone: 'negative',
    rows:
      utilisationByCategory.length > 0
        ? utilisationByCategory.map((c) => ({
            label: c.category,
            note:
              c.count != null
                ? `${c.count} payment${c.count === 1 ? '' : 's'}`
                : undefined,
            values: [money(c.amount)],
          }))
        : [{ label: 'No utilisation this period', values: ['—'] }],
    subtotal: {
      label: 'Total utilised',
      values: [money(totalUtilised)],
    },
  })

  const resultNote =
    totalAvailable > 0
      ? `${utilisedPct.toFixed(1)}% of available funds utilised this period.`
      : 'No funds available in this period.'

  return (
    <>
      {loading && <Loader overlay label="Loading statement…" />}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Petty Cash Statement'}
        icon={leaf?.icon}
        description="How the petty cash account was funded and how it has been utilised over the period, with a running balance after every entry."
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'accountId',
            label: 'Petty cash account',
            type: 'select',
            options: accountOptions,
            defaultValue: applied.accountId,
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
            label: 'Opening balance',
            value: moneyShort(openingBalance),
            hint: periodFrom,
          },
          {
            label: 'Total available',
            value: moneyShort(totalAvailable),
            delta:
              fundingRows.length > 0
                ? `${fundingRows.length} entr${fundingRows.length === 1 ? 'y' : 'ies'}`
                : undefined,
          },
          {
            label: 'Total utilised',
            value: moneyShort(totalUtilised),
            tone: 'negative',
            delta:
              paymentEntries.length > 0
                ? `${paymentEntries.length} payment${paymentEntries.length === 1 ? '' : 's'}`
                : undefined,
          },
          {
            label: 'Balance available',
            value: moneyShort(closingBalance),
            hint: periodTo,
          },
        ]}
        columns={columns}
        rows={ledgerItems}
        totals={{
          date: 'Total',
          in: money(pageIn),
          out: money(pageOut),
          balance: money(closingBalance),
        }}
        pagination={{
          page,
          pageCount: ledgerTotalPages,
          pageSize: PAGE_SIZE,
          total: ledgerTotalItems,
          onPage: setPage,
        }}
        tableTitle="Petty cash ledger"
        emptyTitle="No petty cash activity in this period"
        emptyDescription="Widen the period or choose a different account, then generate again."
        footnote="Every payment here also appears as an out-flow on the Cash Inflow/Outflow Statement, and each funding entry matches a debit on the funding bank account."
      >
        <Statement
          columns={['Amount']}
          sections={sections}
          result={{
            label: 'Petty cash balance',
            note: resultNote,
            values: [money(closingBalance)],
            tone: closingBalance > 0 ? 'positive' : 'negative',
          }}
        />
      </ReportShell>
    </>
  )
}