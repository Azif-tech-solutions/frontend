// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { ReportShell } from '../shells/ReportShell.jsx'
// import { Panel, MetaRow } from '../shells/Page.jsx'
// import { banks, bankOpeningBalance, bankTransactions } from '../sampleAccount.js'
// import { money, moneyShort, withBalance } from '../utils.js'

// export default function BankStatement({ leaf, moduleLabel, parentLabel }) {
//   const [bankId] = useState('bk-zenith')
//   const account = banks.find((b) => b.value === bankId) || banks[0]

//   const rows = withBalance(bankTransactions, bankOpeningBalance, (t) => (t.type === 'Credit' ? t.amount : -t.amount))

//   const credits = bankTransactions.filter((t) => t.type === 'Credit').reduce((n, t) => n + t.amount, 0)
//   const debits = bankTransactions.filter((t) => t.type === 'Debit').reduce((n, t) => n + t.amount, 0)
//   const closing = bankOpeningBalance + credits - debits

//   const columns = [
//     { key: 'date', label: 'Date', width: 135 },
//     { key: 'ref', label: 'Reference', width: 120, mono: true },
//     { key: 'description', label: 'Description', width: 400 },
//     {
//       key: 'type', label: 'Type', width: 110,
//       render: (t) => <Badge tone={t.type === 'Credit' ? 'success' : 'neutral'}>{t.type}</Badge>,
//     },
//     {
//       key: 'credit', label: 'Credit', width: 165, align: 'right', mono: true,
//       render: (t) => (t.type === 'Credit' ? <span style={{ color: 'var(--success)' }}>{money(t.amount)}</span> : '—'),
//     },
//     {
//       key: 'debit', label: 'Debit', width: 165, align: 'right', mono: true,
//       render: (t) => (t.type === 'Debit' ? <span style={{ color: 'var(--danger)' }}>{money(t.amount)}</span> : '—'),
//     },
//     { key: 'balance', label: 'Balance', width: 175, align: 'right', mono: true, render: (t) => money(t.balance) },
//   ]

//   return (
//     <ReportShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Bank Statement'}
//       icon={leaf?.icon}
//       description="Account statement for a selected company bank account over a chosen date range, with a running balance after every entry."
//       filters={[
//         { key: 'bank', label: 'Bank account', type: 'select', options: banks },
//         { key: 'type', label: 'Entry type', type: 'select', options: [{ value: 'credit', label: 'Credits only' }, { value: 'debit', label: 'Debits only' }] },
//         { key: 'from', label: 'Period from', type: 'date' },
//         { key: 'to', label: 'Period to', type: 'date' },
//       ]}
//       stats={[
//         { label: 'Opening balance', value: moneyShort(bankOpeningBalance), hint: '01 Aug 2026' },
//         { label: 'Total credits', value: moneyShort(credits) },
//         { label: 'Total debits', value: moneyShort(debits), tone: 'negative' },
//         { label: 'Closing balance', value: moneyShort(closing), hint: '23 Aug 2026' },
//       ]}
//       columns={columns}
//       rows={rows}
//       totals={{ date: 'Total', credit: money(credits), debit: money(debits), balance: money(closing) }}
//       tableTitle="Account transactions"
//       emptyTitle="No transactions in this period"
//       emptyDescription="Widen the period or select a different account, then generate again."
//       footnote="Cash lodgements reconcile to the Cash Inflow/Outflow Statement, and transfers to petty cash appear as funding entries on the Petty Cash Statement."
//     >
//       <Panel title="Account" description="The bank account this statement covers.">
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0 32px' }}>
//           <div>
//             <MetaRow label="Bank" value={account.label} />
//             <MetaRow label="Account number" value={account.account} mono />
//             <MetaRow label="Account type" value={account.type} />
//           </div>
//           <div>
//             <MetaRow label="Branch" value={account.branch} />
//             <MetaRow label="Signatory" value={account.signatory} />
//             <MetaRow label="Statement period" value="01 – 23 Aug 2026" />
//           </div>
//         </div>
//       </Panel>
//     </ReportShell>
//   )
// }
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportShell } from '../shells/ReportShell.jsx'
import { Panel, MetaRow } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmtDate, money, moneyShort } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'

const accountApi = new AccountApi()
const PAGE_SIZE = 50

const FALLBACK_ENTRY_TYPES = [
  { value: 'CREDIT', label: 'Credit' },
  { value: 'DEBIT', label: 'Debit' },
]
const FALLBACK_SOURCE_TYPES = [
  { value: 'OPENING', label: 'Opening' },
  { value: 'CASH_LODGEMENT', label: 'Cash lodgement' },
  { value: 'PETTY_CASH_FUNDING', label: 'Petty cash funding' },
  { value: 'RUNNING_COST', label: 'Running cost' },
  { value: 'RECEIPT_CONFIRMED', label: 'Receipt confirmed' },
  { value: 'RECEIPT_REVERSED', label: 'Receipt reversed' },
  { value: 'FUND_DISBURSEMENT_OUT', label: 'Fund disbursement out' },
  { value: 'FUND_DISBURSEMENT_IN', label: 'Fund disbursement in' },
  { value: 'FUND_DISBURSEMENT_RETURN', label: 'Fund disbursement return' },
  { value: 'PETTY_CASH_ALLOCATION_OUT', label: 'Petty cash allocation out' },
  { value: 'PETTY_CASH_ALLOCATION_RETURN', label: 'Petty cash allocation return' },
  { value: 'WALLET_WITHDRAWAL', label: 'Wallet withdrawal' },
  { value: 'DEPOSIT_REFUND', label: 'Deposit refund' },
  { value: 'COMMISSION_PAYOUT', label: 'Commission payout' },
  { value: 'MANUAL', label: 'Manual' },
]

const EMPTY_FILTERS = {
  bankId: '',
  entryType: '',
  sourceType: '',
  from: '',
  to: '',
}

// Bank record → the { value, label, account, type, branch, signatory } shape
// the page uses. Handles several plausible field names.
function normalizeBank(b) {
  return {
    value: b.id || b.value || b.accountId,
    label:
      b.name ||
      b.label ||
      b.bankName ||
      b.accountName ||
      b.account ||
      b.code ||
      '—',
    account:
      b.accountNumber || b.account || b.number || b.accountNo || '—',
    type: b.type || b.accountType || '—',
    branch: b.branch || b.branchName || '—',
    signatory: b.signatoryName || b.signatory || '—',
  }
}

export default function BankStatement({ leaf, moduleLabel, parentLabel }) {
  const store = useStore()
  const showToast = store.showToast

  // ── bank accounts (own source of truth) ────────────────
  const [banks, setBanks] = useState([])
  const [loadingBanks, setLoadingBanks] = useState(false)
  const [banksError, setBanksError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadBanks() {
      // 1) store first — fastest, no network
      const fromStore =
        store.banks || store.bankAccounts || store.accounts || null
      if (Array.isArray(fromStore) && fromStore.length) {
        setBanks(fromStore.map(normalizeBank).filter((b) => b.value))
        return
      }

      // 2) API fallback — call whichever method exists on AccountApi
      setLoadingBanks(true)
      try {
        const fn =
          (typeof accountApi.listBankAccounts === 'function' &&
            accountApi.listBankAccounts) ||
          (typeof accountApi.listAccounts === 'function' &&
            accountApi.listAccounts) ||
          null

        if (!fn) {
          if (!cancelled) {
            setBanksError(
              'No bank accounts source is available. Add listBankAccounts() to AccountApi (or populate store.banks).'
            )
          }
          return
        }

        const res = await fn.call(accountApi, { status: ['ACTIVE'] })
        const data = res?.data
        const list = Array.isArray(data) ? data : data?.items || []
        if (!cancelled) {
          setBanks(list.map(normalizeBank).filter((b) => b.value))
        }
      } catch (e) {
        if (!cancelled) {
          setBanksError(e.message || 'Could not load bank accounts')
          showToast('Could not load bank accounts', e.message, true)
        }
      } finally {
        if (!cancelled) setLoadingBanks(false)
      }
    }

    loadBanks()
    return () => {
      cancelled = true
    }
  }, [store, showToast])

  // ── applied filters + pagination ────────────────────────
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)

  // ── report data ─────────────────────────────────────────
  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // ── filter metadata ─────────────────────────────────────
  const [filterMeta, setFilterMeta] = useState(null)

  // auto-select the first bank once banks load
  useEffect(() => {
    if (!banks.length) return
    setApplied((prev) =>
      prev.bankId && banks.some((b) => b.value === prev.bankId)
        ? prev
        : { ...prev, bankId: banks[0].value }
    )
  }, [banks])

  // load filter metadata once
  useEffect(() => {
    let cancelled = false
    accountApi
      .retreiveBankStatementFilter('')
      .then((res) => {
        if (!cancelled) setFilterMeta(res.data)
      })
      .catch(() => {
        /* non-fatal — fall back to hardcoded enums */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // reset page on new query
  useEffect(() => {
    setPage(0)
  }, [applied])

  // ── load statement ──────────────────────────────────────
  const load = useCallback(async () => {
    if (!applied.bankId) {
      setRows([])
      setSummary(null)
      setTotalPages(0)
      setTotalItems(0)
      return
    }
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (applied.entryType) q.entryType = applied.entryType
      if (applied.sourceType) q.sourceType = applied.sourceType
      if (applied.from) q.from = applied.from
      if (applied.to) q.to = applied.to

      const res = await accountApi.retreiveBankStatementList(
        applied.bankId,
        q
      )
      const paged = res.data
      setRows(paged.items || [])
      setSummary(paged.summary || null)
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
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
      bankId: values?.bankId || '',
      entryType: values?.entryType || '',
      sourceType: values?.sourceType || '',
      from: values?.from || '',
      to: values?.to || '',
    })
  }, [])

  // ── filter options ──────────────────────────────────────
  const entryTypeOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'entryType')
    return f?.options?.length ? f.options : FALLBACK_ENTRY_TYPES
  }, [filterMeta])

  const sourceTypeOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'sourceType')
    return f?.options?.length ? f.options : FALLBACK_SOURCE_TYPES
  }, [filterMeta])

  const sourceLabel = useMemo(() => {
    const m = {}
    for (const o of sourceTypeOptions) m[o.value] = o.label
    return m
  }, [sourceTypeOptions])

  // ── totals ──────────────────────────────────────────────
  const pageCredits = rows.reduce((n, r) => n + (r.credit || 0), 0)
  const pageDebits = rows.reduce((n, r) => n + (r.debit || 0), 0)

  const opening = summary?.openingBalance ?? null
  const totalCredits = summary?.totalCredits ?? pageCredits
  const totalDebits = summary?.totalDebits ?? pageDebits
  const closing = summary?.closingBalance ?? null
  const creditHint =
    !summary?.openingBalance && !summary?.closingBalance
      ? 'This page only'
      : undefined

  const account = banks.find((b) => b.value === applied.bankId) || {}

  // ── columns ─────────────────────────────────────────────
  const columns = [
    {
      key: 'date',
      label: 'Date',
      width: 130,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    { key: 'reference', label: 'Reference', width: 130, mono: true },
    { key: 'description', label: 'Description', width: 360 },
    {
      key: 'sourceType',
      label: 'Source',
      width: 200,
      render: (r) =>
        r.sourceType ? sourceLabel[r.sourceType] || r.sourceType : '—',
    },
    {
      key: 'expenseCategoryName',
      label: 'Category',
      width: 170,
      render: (r) => r.expenseCategoryName || '—',
    },
    {
      key: 'type',
      label: 'Type',
      width: 110,
      render: (r) => {
        const isCredit = r.type === 'CREDIT' || r.credit > 0
        return (
          <Badge tone={isCredit ? 'success' : 'neutral'}>
            {isCredit ? 'Credit' : 'Debit'}
          </Badge>
        )
      },
    },
    {
      key: 'credit',
      label: 'Credit',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) =>
        r.credit ? (
          <span style={{ color: 'var(--success)' }}>{money(r.credit)}</span>
        ) : (
          '—'
        ),
    },
    {
      key: 'debit',
      label: 'Debit',
      width: 165,
      align: 'right',
      mono: true,
      render: (r) =>
        r.debit ? (
          <span style={{ color: 'var(--danger)' }}>{money(r.debit)}</span>
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

  const bankOptions = banks.map((b) => ({ value: b.value, label: b.label }))

  // ── no banks at all ─────────────────────────────────────
  if (!loadingBanks && banks.length === 0) {
    return (
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Bank Statement'}
        icon={leaf?.icon}
        description="Account statement for a selected company bank account over a chosen date range, with a running balance after every entry."
        filters={[]}
        columns={[]}
        rows={[]}
        emptyTitle="No bank accounts available"
        emptyDescription={
          banksError ||
          'No bank account source is configured. Populate store.banks, or add listBankAccounts() to AccountApi.'
        }
      />
    )
  }

  return (
    <>
      {(loading || loadingBanks) && (
        <Loader
          overlay
          label={
            loadingBanks ? 'Loading bank accounts…' : 'Loading statement…'
          }
        />
      )}
      <ReportShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Bank Statement'}
        icon={leaf?.icon}
        description="Account statement for a selected company bank account over a chosen date range, with a running balance after every entry."
        onGenerate={handleGenerate}
        filters={[
          {
            key: 'bankId',
            label: 'Bank account',
            type: 'select',
            options: bankOptions,
            defaultValue: applied.bankId,
          },
          {
            key: 'entryType',
            label: 'Entry type',
            type: 'select',
            options: [{ value: '', label: 'All entries' }, ...entryTypeOptions],
            defaultValue: applied.entryType,
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
            label: 'Opening balance',
            value: opening != null ? moneyShort(opening) : '—',
          },
          {
            label: 'Total credits',
            value: moneyShort(totalCredits),
            hint: creditHint,
          },
          {
            label: 'Total debits',
            value: moneyShort(totalDebits),
            tone: 'negative',
            hint: creditHint,
          },
          {
            label: 'Closing balance',
            value: closing != null ? moneyShort(closing) : '—',
          },
        ]}
        columns={columns}
        rows={rows}
        totals={{
          date: 'Total',
          credit: money(totalCredits),
          debit: money(totalDebits),
          balance: closing != null ? money(closing) : '—',
        }}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        tableTitle="Account transactions"
        emptyTitle="No transactions in this period"
        emptyDescription="Widen the period or select a different account, then generate again."
        footnote="Cash lodgements reconcile to the Cash Inflow/Outflow Statement, and transfers to petty cash appear as funding entries on the Petty Cash Statement."
      >
        <Panel
          title="Account"
          description="The bank account this statement covers."
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '0 32px',
            }}
          >
            <div>
              <MetaRow label="Bank" value={account.label || '—'} />
              <MetaRow
                label="Account number"
                value={account.account || '—'}
                mono
              />
              <MetaRow label="Account type" value={account.type || '—'} />
            </div>
            <div>
              <MetaRow label="Branch" value={account.branch || '—'} />
              <MetaRow label="Signatory" value={account.signatory || '—'} />
              <MetaRow
                label="Statement period"
                value={
                  applied.from && applied.to
                    ? `${fmtDate(applied.from)} – ${fmtDate(applied.to)}`
                    : 'All entries'
                }
              />
            </div>
          </div>
        </Panel>
      </ReportShell>
    </>
  )
}