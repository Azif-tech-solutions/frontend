// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow } from '../shells/Page.jsx'
// import { banks, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
// import { money, moneyShort } from '../utils.js'

// /**
//  * Serves both §5.3.9 Credit Petty Cash and §5.3.12 Fund Petty Cash — the PRD
//  * states outright that the second "performs the same function" as the first.
//  */
// export default function FundPettyCash({ leaf, moduleLabel, parentLabel }) {
//   const [amount, setAmount] = useState('')

//   const funded = pettyCashFunding.reduce((n, r) => n + r.amount, 0)
//   const spent = pettyCashPayments.reduce((n, r) => n + r.amount, 0)
//   const balance = pettyCashOpening + funded - spent
//   const credit = Number(amount) || 0

//   const historyColumns = [
//     { key: 'date', label: 'Date', width: 135 },
//     { key: 'ref', label: 'Reference', width: 120, mono: true },
//     { key: 'description', label: 'Description', width: 340 },
//     { key: 'source', label: 'Funding source', width: 200 },
//     { key: 'fundedBy', label: 'Funded by', width: 170 },
//     { key: 'amount', label: 'Amount', width: 170, align: 'right', mono: true, render: (r) => money(r.amount) },
//   ]

//   return (
//     <FormShell
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Credit Petty Cash'}
//       icon={leaf?.icon}
//       description="Fund or replenish the petty cash account, which covers minor operational payments that do not warrant a formal bank transaction — transport, loading and offloading charges, office supplies and similar day-to-day costs."
//       submitLabel="Credit petty cash"
//       onCancel={() => {}}
//       note="The petty cash balance updates immediately, and the funding appears as a debit on the source bank account."
//       aside={
//         <>
//           <Panel title="Petty cash position">
//             <MetaRow label="Opening balance" value={money(pettyCashOpening)} mono />
//             <MetaRow label="Funded to date" value={money(funded)} mono tone="positive" />
//             <MetaRow label="Utilised to date" value={money(spent)} mono tone="negative" />
//             <MetaRow label="Current balance" value={money(balance)} mono />
//             <div style={{ marginTop: 14, padding: '14px 16px', background: 'var(--brand-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Balance after crediting</div>
//               <div style={{ marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-strong)' }}>
//                 {money(balance + credit)}
//               </div>
//             </div>
//           </Panel>

//           <Panel title="What petty cash covers">
//             <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
//               Transport, loading and offloading charges, fuel, office supplies and other small routine expenses.
//               Larger obligations are settled by bank transfer through Payment/Running Cost.
//             </div>
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Funding details" description="Where the funds are coming from and how much.">
//         <FieldSet columns={2}>
//           <Select label="Funding source account" options={banks} placeholder="Select bank account…" />
//           <Input label="Amount to credit (₦)" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
//           <Input label="Funding date" type="date" />
//           <Input label="Transfer / cheque reference" placeholder="e.g. PCF-0082" />
//           <Input label="Authorised by" placeholder="e.g. M. Okonkwo" />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="PCF-0082" />
//         </FieldSet>
//         <div style={{ marginTop: 14 }}>
//           <label style={{ display: 'block' }}>
//             <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
//             <textarea
//               rows={2}
//               placeholder="e.g. Replenishment — end of month float"
//               style={{
//                 width: '100%', padding: '10px 12px', resize: 'vertical',
//                 background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//                 borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//                 font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//               }}
//             />
//           </label>
//         </div>
//         <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//           <Badge tone="brand">Balance {moneyShort(balance)}</Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             {credit ? `Crediting ${money(credit)} brings the account to ${money(balance + credit)}.` : 'Enter an amount to see the resulting balance.'}
//           </span>
//         </div>
//       </Panel>

//       <Panel title="Funding history" description="Previous credits into the petty cash account." padding={0}>
//         <ReportTable
//           columns={historyColumns}
//           rows={pettyCashFunding}
//           rowKey={(r) => r.ref}
//           totals={{ date: 'Total', amount: money(funded) }}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//         />
//       </Panel>
//     </FormShell>
//   )
// }
import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'

const accountApi = new AccountApi()
const PAGE_SIZE = 20

const STATUS_LABEL = { POSTED: 'Posted', REVERSED: 'Reversed' }
const STATUS_TONE = { POSTED: 'success', REVERSED: 'danger' }

const SOURCE_KIND_LABEL = { BANK: 'Bank', CASH: 'Cash' }
const SOURCE_KIND_TONE = { BANK: 'brand', CASH: 'neutral' }

const FALLBACK_SOURCE_KINDS = [
  { value: 'BANK', label: 'Bank' },
  { value: 'CASH', label: 'Cash' },
]

const today = () => new Date().toISOString().slice(0, 10)

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

function pettyCashOption(a) {
  return {
    value: a.id,
    label: `${a.code} · ${a.name}${
      a.location?.name ? ` (${a.location.name})` : ''
    }`,
    currentBalance: a.currentBalance || 0,
    code: a.code,
    name: a.name,
  }
}

export default function FundPettyCash({ leaf, moduleLabel, parentLabel }) {
  const { showToast } = useStore()

  // form values
  const [pettyCashAccountId, setPettyCashAccountId] = useState('')
  const [sourceKind, setSourceKind] = useState('BANK')
  const [sourceBankAccountId, setSourceBankAccountId] = useState('')
  const [sourceCashAccountId, setSourceCashAccountId] = useState('')
  const [amount, setAmount] = useState('')
  const [fundingDate, setFundingDate] = useState(today())
  const [transferOrChequeReference, setTransferOrChequeReference] =
    useState('')
  const [authorisedBy, setAuthorisedBy] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // lookups
  const [pettyCashAccounts, setPettyCashAccounts] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [cashAccounts, setCashAccounts] = useState([])

  // filter metadata
  const [filterMeta, setFilterMeta] = useState(null)

  // history query + pagination
  const [applied, setApplied] = useState({
    pettyCashAccountId: '',
    sourceKind: '',
    status: '',
    from: '',
    to: '',
  })
  const [page, setPage] = useState(0)

  // history data
  const [historyRows, setHistoryRows] = useState([])
  const [historyTotalPages, setHistoryTotalPages] = useState(0)
  const [historyTotalItems, setHistoryTotalItems] = useState(0)
  const [loadingHistory, setLoadingHistory] = useState(false)

  // ── filter metadata ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .getPettyCashFundingFilter()
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

  // ── petty cash accounts (need currentBalance for the form) ─
  useEffect(() => {
    let cancelled = false
    accountApi
      .listCashAccounts({ kind: ['PETTY_CASH'] })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        const options = list.map(pettyCashOption)
        setPettyCashAccounts(options)
        setPettyCashAccountId((prev) => prev || options[0]?.value || '')
      })
      .catch(() => {
        /* non-fatal */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── bank accounts ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listBankAccounts({ status: 'ACTIVE' })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setBankAccounts(
          list.map((b) => ({
            value: b.id,
            label:
              [b.bankName, b.accountNumber].filter(Boolean).join(' · ') ||
              b.accountName ||
              b.code,
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

  // ── cash accounts (till / vault) ────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listCashAccounts({ kind: ['TILL', 'VAULT'] })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setCashAccounts(
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

  // ── reset page when the history filters change ──────────
  useEffect(() => {
    setPage(0)
  }, [applied])

  // ── load history ────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    setLoadingHistory(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (applied.pettyCashAccountId)
        q.pettyCashAccountId = applied.pettyCashAccountId
      if (applied.sourceKind) q.sourceKind = applied.sourceKind
      if (applied.status) q.status = applied.status
      if (applied.from) q.from = applied.from
      if (applied.to) q.to = applied.to

      const res = await accountApi.listPettyCashFunding(q)
      const paged = res.data
      setHistoryRows(paged.items || [])
      setHistoryTotalPages(paged.totalPages || 0)
      setHistoryTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load funding history', e.message, true)
    } finally {
      setLoadingHistory(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // ── filter options — above any conditional returns ──────
  const sourceKindOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'sourceKind')
    return f?.options?.length ? f.options : FALLBACK_SOURCE_KINDS
  }, [filterMeta])

  const statusOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'status')
    return f?.options?.length
      ? f.options
      : [
          { value: 'POSTED', label: 'Posted' },
          { value: 'REVERSED', label: 'Reversed' },
        ]
  }, [filterMeta])

  // ── derived values ──────────────────────────────────────
  const selectedPettyCash = pettyCashAccounts.find(
    (a) => a.value === pettyCashAccountId
  )
  const currentBalance = selectedPettyCash?.currentBalance || 0
  const credit = Number(amount) || 0
  const balanceAfter = currentBalance + credit

  const isBankSource = sourceKind === 'BANK'
  const isCashSource = sourceKind === 'CASH'
  const sourceOptions = isBankSource
    ? bankAccounts
    : isCashSource
      ? cashAccounts
      : []

  const canSubmit =
    !!pettyCashAccountId &&
    !!sourceKind &&
    (isBankSource
      ? !!sourceBankAccountId
      : isCashSource
        ? !!sourceCashAccountId
        : false) &&
    credit > 0 &&
    !!fundingDate &&
    authorisedBy.trim() &&
    (!isBankSource || transferOrChequeReference.trim()) &&
    !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await accountApi.createPettyCashFunding({
        pettyCashAccountId,
        sourceKind,
        sourceBankAccountId: isBankSource ? sourceBankAccountId : '',
        sourceCashAccountId: isCashSource ? sourceCashAccountId : '',
        amount: credit,
        fundingDate,
        transferOrChequeReference: transferOrChequeReference.trim(),
        authorisedBy: authorisedBy.trim(),
        description: description.trim(),
      })
      showToast(
        'Petty cash credited',
        `${money(credit)} funded from ${SOURCE_KIND_LABEL[sourceKind].toLowerCase()} account.`
      )
      // reset form
      setSourceBankAccountId('')
      setSourceCashAccountId('')
      setAmount('')
      setTransferOrChequeReference('')
      setDescription('')

      // refresh history + petty cash balance
      setPage(0)
      await loadHistory()
      try {
        const res = await accountApi.listCashAccounts({
          kind: ['PETTY_CASH'],
        })
        const list = Array.isArray(res.data) ? res.data : []
        setPettyCashAccounts(list.map(pettyCashOption))
      } catch {
        /* non-fatal */
      }
    } catch (e) {
      showToast('Could not credit petty cash', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── history columns ─────────────────────────────────────
  const historyColumns = [
    { key: 'ref', label: 'Reference', width: 110, mono: true },
    {
      key: 'date',
      label: 'Date',
      width: 125,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'pettyCashAccount',
      label: 'Petty cash',
      width: 200,
      render: (r) =>
        r.pettyCashAccount
          ? `${r.pettyCashAccount.code} · ${r.pettyCashAccount.name}`
          : '—',
    },
    {
      key: 'description',
      label: 'Description',
      width: 260,
      render: (r) => r.description || '—',
    },
    {
      key: 'sourceKind',
      label: 'Source',
      width: 110,
      render: (r) => (
        <Badge tone={SOURCE_KIND_TONE[r.sourceKind] || 'neutral'}>
          {SOURCE_KIND_LABEL[r.sourceKind] || r.sourceKind || '—'}
        </Badge>
      ),
    },
    {
      key: 'sourceName',
      label: 'From',
      width: 200,
      render: (r) => r.sourceName || '—',
    },
    {
      key: 'transferOrChequeReference',
      label: 'Transfer ref',
      width: 160,
      mono: true,
      render: (r) => r.transferOrChequeReference || '—',
    },
    {
      key: 'authorisedBy',
      label: 'Authorised by',
      width: 150,
      render: (r) => r.authorisedBy || '—',
    },
    {
      key: 'status',
      label: 'Status',
      width: 110,
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
          {STATUS_LABEL[r.status] || r.status || '—'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 155,
      align: 'right',
      mono: true,
      render: (r) => money(r.amount || 0),
    },
  ]

  // ── petty cash dropdown for form + history filter ───────
  const pettyCashFormOptions = pettyCashAccounts.map((a) => ({
    value: a.value,
    label: a.label,
  }))
  const pettyCashFilterOptions = [
    { value: '', label: 'All accounts' },
    ...pettyCashFormOptions,
  ]

  const pageTotal = historyRows.reduce((n, r) => n + (r.amount || 0), 0)

  return (
    <>
      {(submitting || loadingHistory) && (
        <Loader
          overlay
          label={
            submitting ? 'Crediting petty cash…' : 'Loading history…'
          }
        />
      )}
      <FormShell
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Credit Petty Cash'}
        icon={leaf?.icon}
        description="Fund or replenish the petty cash account, which covers minor operational payments that do not warrant a formal bank transaction — transport, loading and offloading charges, office supplies and similar day-to-day costs."
        submitLabel="Credit petty cash"
        onSubmit={handleSubmit}
        onCancel={() => {}}
        submitDisabled={!canSubmit}
        note="The petty cash balance updates immediately, and the funding appears as a debit on the source bank account."
        aside={
          <>
            <Panel title="Petty cash position">
              <MetaRow
                label="Account"
                value={
                  selectedPettyCash
                    ? `${selectedPettyCash.code} · ${selectedPettyCash.name}`
                    : '—'
                }
              />
              <MetaRow
                label="Current balance"
                value={money(currentBalance)}
                mono
              />
              <MetaRow
                label="Credit amount"
                value={credit ? money(credit) : '—'}
                mono
                tone={credit ? 'positive' : undefined}
              />
              <div
                style={{
                  marginTop: 14,
                  padding: '14px 16px',
                  background: 'var(--brand-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    font: 'var(--type-eyebrow)',
                    letterSpacing: 'var(--ls-widest)',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  Balance after crediting
                </div>
                <div
                  style={{
                    marginTop: 8,
                    font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-strong)',
                  }}
                >
                  {money(balanceAfter)}
                </div>
              </div>
            </Panel>

            <Panel title="What petty cash covers">
              <div
                style={{
                  font: 'var(--type-caption)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                }}
              >
                Transport, loading and offloading charges, fuel, office
                supplies and other small routine expenses. Larger obligations
                are settled by bank transfer through Payment/Running Cost.
              </div>
            </Panel>
          </>
        }
      >
        <Panel
          title="Funding details"
          description="Where the funds are coming from and how much."
        >
          <FieldSet columns={2}>
            <Select
              label="Petty cash account *"
              options={pettyCashFormOptions}
              value={pettyCashAccountId}
              onChange={(v) => setPettyCashAccountId(val(v))}
              placeholder="Select account…"
            />
            <Select
              label="Source kind *"
              options={FALLBACK_SOURCE_KINDS}
              value={sourceKind}
              onChange={(v) => {
                setSourceKind(val(v))
                setSourceBankAccountId('')
                setSourceCashAccountId('')
              }}
            />
            {isBankSource && (
              <Select
                label="Bank account *"
                options={sourceOptions}
                value={sourceBankAccountId}
                onChange={(v) => setSourceBankAccountId(val(v))}
                placeholder={
                  bankAccounts.length
                    ? 'Select bank account…'
                    : 'No bank accounts registered'
                }
                disabled={!bankAccounts.length}
              />
            )}
            {isCashSource && (
              <Select
                label="Cash account *"
                options={sourceOptions}
                value={sourceCashAccountId}
                onChange={(v) => setSourceCashAccountId(val(v))}
                placeholder={
                  cashAccounts.length
                    ? 'Select cash account…'
                    : 'No cash accounts registered'
                }
                disabled={!cashAccounts.length}
              />
            )}
            <Input
              label="Amount to credit (₦) *"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(val(e))}
            />
            <Input
              label="Funding date *"
              type="date"
              value={fundingDate}
              onChange={(e) => setFundingDate(val(e))}
            />
            <Input
              label={
                isBankSource
                  ? 'Transfer / cheque reference *'
                  : 'Transfer / cheque reference'
              }
              placeholder="e.g. PCF-0082"
              value={transferOrChequeReference}
              onChange={(e) =>
                setTransferOrChequeReference(val(e))
              }
            />
            <Input
              label="Authorised by *"
              placeholder="e.g. M. Okonkwo"
              value={authorisedBy}
              onChange={(e) => setAuthorisedBy(val(e))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Description
              </div>
              <textarea
                rows={2}
                placeholder="e.g. Replenishment — end of month float"
                value={description}
                onChange={(e) => setDescription(val(e))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  resize: 'vertical',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-control)',
                  boxShadow: 'var(--shadow-xs)',
                  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
                  color: 'var(--text-strong)',
                  outline: 'none',
                }}
              />
            </label>
          </div>
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <Badge tone="brand">
              Balance {moneyShort(currentBalance)}
            </Badge>
            <span
              style={{
                font: 'var(--type-caption)',
                color: 'var(--text-muted)',
              }}
            >
              {credit
                ? `Crediting ${money(credit)} brings the account to ${money(
                    balanceAfter
                  )}.`
                : 'Enter an amount to see the resulting balance.'}
            </span>
          </div>
        </Panel>

        <Panel
          title="Funding history"
          description="Previous credits into the petty cash account."
          padding={0}
        >
          <div style={{ padding: '12px 16px' }}>
            <FieldSet columns={3}>
              <Select
                label="Petty cash"
                options={pettyCashFilterOptions}
                value={applied.pettyCashAccountId}
                onChange={(v) =>
                  setApplied((s) => ({
                    ...s,
                    pettyCashAccountId: val(v),
                  }))
                }
              />
              <Select
                label="Source"
                options={[
                  { value: '', label: 'All sources' },
                  ...sourceKindOptions,
                ]}
                value={applied.sourceKind}
                onChange={(v) =>
                  setApplied((s) => ({ ...s, sourceKind: val(v) }))
                }
              />
              <Select
                label="Status"
                options={[
                  { value: '', label: 'All statuses' },
                  ...statusOptions,
                ]}
                value={applied.status}
                onChange={(v) =>
                  setApplied((s) => ({ ...s, status: val(v) }))
                }
              />
              <Input
                label="From"
                type="date"
                value={applied.from}
                onChange={(e) =>
                  setApplied((s) => ({ ...s, from: val(e) }))
                }
              />
              <Input
                label="To"
                type="date"
                value={applied.to}
                onChange={(e) =>
                  setApplied((s) => ({ ...s, to: val(e) }))
                }
              />
            </FieldSet>
          </div>
          <ReportTable
            columns={historyColumns}
            rows={historyRows}
            rowKey={(r) => r.id || r.ref}
            totals={{ ref: 'Total', amount: money(pageTotal) }}
            stickyHeader={false}
            style={{ border: 'none', borderRadius: 0 }}
            pagination={{
              page,
              pageCount: historyTotalPages,
              pageSize: PAGE_SIZE,
              total: historyTotalItems,
              onPage: setPage,
            }}
            emptyTitle="No funding history yet"
            emptyDescription="Credits into the petty cash account will appear here."
          />
        </Panel>
      </FormShell>
    </>
  )
}