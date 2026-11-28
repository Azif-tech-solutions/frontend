// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { expenseCategories, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
// import { dealerWallets } from '../sampleShowroom.js'
// import { money } from '../utils.js'

// const MODES = [
//   { value: 'petty', label: 'Petty cash payment', icon: 'banknote-arrow-down' },
//   { value: 'wallet', label: 'Wallet withdrawal', icon: 'wallet' },
// ]

// const WITHDRAWAL_REASONS = [
//   { value: 'request', label: 'Dealer withdrawal request' },
//   { value: 'commission', label: 'Recovery of excess commission' },
//   { value: 'correction', label: 'Correction of over-credit' },
//   { value: 'settlement', label: 'Settlement against outstanding invoice' },
// ]

// const pettyCategories = expenseCategories
//   .filter((c) => c.pettyCashAllowed === 'Yes' && c.status === 'Active')
//   .map((c) => ({ value: c.code, label: c.name }))

// export default function PettyCashPayment({ leaf, moduleLabel, parentLabel }) {
//   const [mode, setMode] = useState('petty')
//   const [amount, setAmount] = useState('')
//   const [dealerId, setDealerId] = useState('dl-bendel')

//   const isWallet = mode === 'wallet'
//   const wallet = dealerWallets.find((d) => d.value === dealerId) || dealerWallets[0]

//   const funded = pettyCashFunding.reduce((n, r) => n + r.amount, 0)
//   const spent = pettyCashPayments.reduce((n, r) => n + r.amount, 0)
//   const pettyBalance = pettyCashOpening + funded - spent

//   const available = isWallet ? wallet.balance : pettyBalance
//   const requested = Number(amount) || 0
//   const remaining = available - requested

//   // A wallet balance may never go negative, and petty cash cannot be overdrawn.
//   const overdrawn = requested > available

//   return (
//     <FormShell
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Petty Cash Payment / Wallet Withdrawal'}
//       icon={leaf?.icon}
//       description="Process petty cash disbursements, and manage withdrawals from a dealer's wallet — whether the dealer has requested their balance or the company is recovering excess commission."
//       submitLabel={isWallet ? 'Process withdrawal' : 'Process payment'}
//       onCancel={() => {}}
//       note={isWallet
//         ? 'The dealer’s wallet balance updates immediately. A withdrawal can never take a wallet below zero.'
//         : 'The petty cash balance updates immediately, and the payment appears on both the Petty Cash Statement and the Cash Inflow/Outflow Statement.'}
//       aside={
//         <>
//           <Panel title={isWallet ? 'Wallet position' : 'Petty cash position'}>
//             {isWallet ? (
//               <>
//                 <MetaRow label="Dealer" value={wallet.label} />
//                 <MetaRow label="Current balance" value={money(wallet.balance)} mono />
//               </>
//             ) : (
//               <>
//                 <MetaRow label="Funded to date" value={money(funded)} mono tone="positive" />
//                 <MetaRow label="Utilised to date" value={money(spent)} mono tone="negative" />
//                 <MetaRow label="Current balance" value={money(pettyBalance)} mono />
//               </>
//             )}
//             <MetaRow label={isWallet ? 'Withdrawal' : 'Payment'} value={requested ? money(requested) : '—'} mono tone={requested ? 'negative' : undefined} />
//             <div style={{
//               marginTop: 14, padding: '14px 16px',
//               background: overdrawn ? 'var(--danger-bg)' : 'var(--brand-subtle)',
//               border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
//             }}>
//               <div style={{ font: 'var(--type-eyebrow)', letterSpacing: 'var(--ls-widest)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Balance after</div>
//               <div style={{
//                 marginTop: 8, font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)', fontVariantNumeric: 'tabular-nums',
//                 color: overdrawn ? 'var(--danger)' : 'var(--text-strong)',
//               }}>
//                 {money(remaining)}
//               </div>
//             </div>
//             {overdrawn && (
//               <Callout tone="danger" icon="circle-alert" title={isWallet ? 'Withdrawal exceeds wallet balance' : 'Insufficient petty cash'} style={{ marginTop: 14 }}>
//                 {isWallet
//                   ? `Only ${money(available)} is available in this wallet. A wallet balance may never go negative, so the withdrawal cannot be processed at this amount.`
//                   : `Only ${money(available)} remains in petty cash. Credit the account before processing a payment this size.`}
//               </Callout>
//             )}
//           </Panel>

//           {isWallet && (
//             <Panel title="Withdrawal control">
//               <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
//                 Dealer-requested withdrawals require a one-time code sent to the dealer's registered number, issued
//                 through Wallet Withdrawal OTP. Company-initiated recoveries are authorised by Management instead.
//               </div>
//             </Panel>
//           )}
//         </>
//       }
//     >
//       <Panel
//         title={isWallet ? 'Withdrawal' : 'Payment'}
//         description={isWallet
//           ? 'Withdraw funds from a registered dealer’s wallet.'
//           : 'Record an actual disbursement from the petty cash account.'}
//         actions={<Segmented options={MODES} value={mode} onChange={setMode} size="sm" />}
//       >
//         {isWallet ? (
//           <FieldSet columns={2}>
//             <Select label="Dealer" options={dealerWallets} value={dealerId} onChange={(e) => setDealerId(e.target.value)} />
//             <Input
//               label="Withdrawal amount (₦)"
//               type="number"
//               placeholder="0.00"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               error={overdrawn ? `Exceeds available balance of ${money(available)}` : undefined}
//             />
//             <Select label="Reason" options={WITHDRAWAL_REASONS} placeholder="Select reason…" />
//             <Input label="Withdrawal date" type="date" />
//             <Input label="Paid via" placeholder="e.g. Bank transfer to dealer account" />
//             <Input label="Authorised by" placeholder="e.g. M. Okonkwo" />
//           </FieldSet>
//         ) : (
//           <FieldSet columns={2}>
//             <Select label="Expense category" options={pettyCategories} placeholder="Select category…" />
//             <Input
//               label="Amount (₦)"
//               type="number"
//               placeholder="0.00"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               error={overdrawn ? `Exceeds available balance of ${money(available)}` : undefined}
//             />
//             <Input label="Paid to" placeholder="e.g. Autoworks Ikeja" />
//             <Input label="Payment date" type="date" />
//             <Input label="Approved by" placeholder="e.g. R. Danladi" />
//             <Input label="Reference no." placeholder="Auto-generated" disabled value="PCP-1175" />
//           </FieldSet>
//         )}

//         <div style={{ marginTop: 14 }}>
//           <label style={{ display: 'block' }}>
//             <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>
//               {isWallet ? 'Withdrawal note' : 'Description'}
//             </div>
//             <textarea
//               rows={2}
//               placeholder={isWallet ? 'Context for this withdrawal, visible on the dealer’s statement.' : 'What the payment covers.'}
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
//           <Badge tone={isWallet ? 'brand' : 'neutral'}>{isWallet ? 'Dealer wallet' : 'Petty cash'}</Badge>
//           <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
//             {money(available)} available{requested ? ` · ${money(remaining)} would remain` : ''}.
//           </span>
//         </div>
//       </Panel>
//     </FormShell>
//   )
// }


import { useEffect, useState } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import { Segmented } from '../../ds/components/navigation/Segmented.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import CustomerApi from '../../api/CustomerApi.js'
import OtpApi from '../../api/OtpApi.js'
import TenantApi from '../../api/TenantApi.js'

const accountApi = new AccountApi()
const customerApi = new CustomerApi()
const otpApi = new OtpApi()
const tenantApi = new TenantApi()

const today = () => new Date().toISOString().slice(0, 10)

const MODES = [
  { value: 'petty', label: 'Petty cash payment', icon: 'banknote-arrow-down' },
  { value: 'wallet', label: 'Wallet withdrawal', icon: 'wallet' },
]

const WITHDRAWAL_REASONS = [
  { value: 'DEALER_REQUEST', label: 'Dealer withdrawal request' },
  {
    value: 'EXCESS_COMMISSION_RECOVERY',
    label: 'Recovery of excess commission',
  },
  { value: 'OVER_CREDIT_CORRECTION', label: 'Correction of over-credit' },
  {
    value: 'INVOICE_SETTLEMENT',
    label: 'Settlement against outstanding invoice',
  },
  { value: 'DEPOSIT_REFUND', label: 'Deposit refund' },
]

const BALANCE_TYPES = [
  { value: 'WALLET', label: 'Wallet' },
  { value: 'DEPOSIT', label: 'Deposit' },
]

const PAYOUT_KINDS = [
  { value: 'CASH', label: 'Cash (petty cash account)' },
  { value: 'BANK', label: 'Bank transfer' },
]

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

function cashOption(a) {
  if (!a?.id) return null
  return {
    value: a.id,
    label: `${a.code} · ${a.name}${
      a.location?.name ? ` (${a.location.name})` : ''
    }`,
    currentBalance: a.currentBalance || 0,
  }
}

function bankOption(b) {
  if (!b?.id) return null
  return {
    value: b.id,
    label: `${b.code} · ${b.bankName} – ${b.accountName}`,
  }
}

export default function PettyCashPayment({ leaf, moduleLabel, parentLabel }) {
  const store = useStore()
  const showToast = store.showToast
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
  const currentUserId = store.user?.id || store.session?.user?.id || ''
  const currentUserName =
    store.user?.name || store.session?.user?.name || ''

  const [mode, setMode] = useState('petty')

  // ── lookups ─────────────────────────────────────────────
  const [pettyCashAccounts, setPettyCashAccounts] = useState([])
  const [expenseCategories, setExpenseCategories] = useState([])
  const [dealers, setDealers] = useState([])
  const [members, setMembers] = useState([])
  const [loadingLookups, setLoadingLookups] = useState(true)

  // ── petty cash form ─────────────────────────────────────
  const [pcAccountId, setPcAccountId] = useState('')
  const [pcCategoryId, setPcCategoryId] = useState('')
  const [pcAmount, setPcAmount] = useState('')
  const [pcPaidTo, setPcPaidTo] = useState('')
  const [pcDate, setPcDate] = useState(today())
  const [pcApprovedBy, setPcApprovedBy] = useState(currentUserName)
  const [pcDescription, setPcDescription] = useState('')

  // ── wallet form ─────────────────────────────────────────
  const [wCustomerId, setWCustomerId] = useState('')
  const [wBalanceType, setWBalanceType] = useState('WALLET')
  const [wReason, setWReason] = useState('DEALER_REQUEST')
  const [wAmount, setWAmount] = useState('')
  const [wPaidVia, setWPaidVia] = useState('')
  const [wAuthorisedByUserId, setWAuthorisedByUserId] = useState(
    currentUserId || ''
  )
  const [wDate, setWDate] = useState(today())
  const [wNote, setWNote] = useState('')
  const [bankAccounts, setBankAccounts] = useState([])
  const [wPayoutKind, setWPayoutKind] = useState('CASH')
  const [wPayoutCashAccountId, setWPayoutCashAccountId] = useState('')
  const [wPayoutBankAccountId, setWPayoutBankAccountId] = useState('')

  // ── OTP flow state ──────────────────────────────────────
  const [otpStage, setOtpStage] = useState('none')
  const [otpChallengeId, setOtpChallengeId] = useState(null)
  const [otpCodeSent, setOtpCodeSent] = useState('')
  const [otpCodeInput, setOtpCodeInput] = useState('')
  const [otpExpiresAt, setOtpExpiresAt] = useState('')

  const [submitting, setSubmitting] = useState(false)

  // ── load lookups ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setLoadingLookups(true)

    Promise.all([
      accountApi
        .listCashAccounts({ kind: ['PETTY_CASH'] })
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : []
          return list.map(cashOption).filter(Boolean)
        })
        .catch(() => []),

      accountApi
        .listExpenseCategories({
          q: '',
          accountHead: [],
          status: 'ACTIVE',
          pettyCashAllowed: true,
          overCap: false,
          sort: '',
        })
        .then((list) =>
          (list || [])
            .filter((c) => c.pettyCashAllowed)
            .map((c) => ({ value: c.id, label: c.name }))
        )
        .catch(() => []),

      customerApi
        .listCustomers({
          type: ['AUTHORISED_DEALER'],
          page: 0,
          size: 200,
        })
        .then((res) => {
          const list = res.data?.items || []
          return list.map((d) => ({
            value: d.id,
            label: `${d.code} · ${d.name}`,
            walletBalance: d.walletBalance || 0,
            depositBalance: d.depositBalance || 0,
          }))
        })
        .catch(() => []),

      tenantApi
        .getTenantMemberList({ page: 0, size: 200 })
        .then((res) => {
          const list = res.data?.items || []
          return list.map((m) => ({
            value: m.userId,
            label: `${m.displayName} (${m.email})`,
            displayName: m.displayName,
          }))
        })
        .catch(() => []),

      accountApi
        .listBankAccounts({ status: 'ACTIVE' })
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : []
          return list.map(bankOption).filter(Boolean)
        })
        .catch(() => []),
    ])
      .then(([pettyAccounts, categories, dealerList, memberList, bankList]) => {
        if (cancelled) return
        setPettyCashAccounts(pettyAccounts)
        setExpenseCategories(categories)
        setDealers(dealerList)
        setMembers(memberList)
        setBankAccounts(bankList)

        setPcAccountId((prev) => prev || pettyAccounts[0]?.value || '')
        setWCustomerId((prev) => prev || dealerList[0]?.value || '')
        setWPayoutCashAccountId((prev) => prev || pettyAccounts[0]?.value || '')
        setWPayoutBankAccountId((prev) => prev || bankList[0]?.value || '')
      })
      .catch((e) => {
        if (!cancelled) showToast('Could not load lookups', e.message, true)
      })
      .finally(() => {
        if (!cancelled) setLoadingLookups(false)
      })

    return () => {
      cancelled = true
    }
  }, [showToast])

  // ── invalidate a sent OTP when the bound fields change ─
  useEffect(() => {
    if (otpStage === 'sent') {
      setOtpStage('none')
      setOtpChallengeId(null)
      setOtpCodeSent('')
      setOtpCodeInput('')
      setOtpExpiresAt('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wCustomerId, wAmount, wBalanceType, wReason])

  // ── reset OTP when leaving wallet mode ──────────────────
  useEffect(() => {
    if (mode !== 'wallet') {
      setOtpStage('none')
      setOtpChallengeId(null)
      setOtpCodeSent('')
      setOtpCodeInput('')
      setOtpExpiresAt('')
    }
  }, [mode])

  // ── derived values ──────────────────────────────────────
  const selectedPcAccount = pettyCashAccounts.find(
    (a) => a.value === pcAccountId
  )
  const pcBalance = selectedPcAccount?.currentBalance || 0
  const pcRequested = Number(pcAmount) || 0
  const pcOverdrawn = pcRequested > pcBalance
  const pcRemaining = pcBalance - pcRequested

  const selectedDealer = dealers.find((d) => d.value === wCustomerId)
  const walletBalance =
    wBalanceType === 'WALLET'
      ? selectedDealer?.walletBalance || 0
      : selectedDealer?.depositBalance || 0
  const walletRequested = Number(wAmount) || 0
  const walletOverdrawn = walletRequested > walletBalance
  const walletRemaining = walletBalance - walletRequested

  const isWallet = mode === 'wallet'
  const otpSent = isWallet && otpStage === 'sent'

  // ── submit gates ────────────────────────────────────────
  const canSubmitPetty =
    !submitting &&
    !!pcAccountId &&
    !!pcCategoryId &&
    pcRequested > 0 &&
    !pcOverdrawn &&
    !!pcPaidTo.trim() &&
    !!pcDate &&
    !!pcApprovedBy &&
    !!pcDescription.trim()

  const canSubmitWalletPreOtp =
    !submitting &&
    !!wCustomerId &&
    !!wBalanceType &&
    !!wReason &&
    walletRequested > 0 &&
    !walletOverdrawn &&
    !!wPaidVia.trim() &&
    !!wAuthorisedByUserId &&
    !!wDate &&
    (wPayoutKind === 'CASH'
      ? !!wPayoutCashAccountId
      : !!wPayoutBankAccountId)

  const canSubmitWalletSent = !submitting && !!otpCodeInput.trim()

  const canSubmitWallet = otpSent
    ? canSubmitWalletSent
    : canSubmitWalletPreOtp

  const canSubmit = isWallet ? canSubmitWallet : canSubmitPetty

  // ── OTP reset helper ────────────────────────────────────
  function resetOtp() {
    setOtpStage('none')
    setOtpChallengeId(null)
    setOtpCodeSent('')
    setOtpCodeInput('')
    setOtpExpiresAt('')
  }

  // ── petty cash submit ───────────────────────────────────
  async function handlePettySubmit() {
    if (!canSubmitPetty) return
    setSubmitting(true)
    try {
      await accountApi.createPettyCashPayment({
        pettyCashAccountId: pcAccountId,
        expenseCategoryId: pcCategoryId,
        amount: pcRequested,
        paidTo: pcPaidTo.trim(),
        paymentDate: pcDate,
        approvedBy: pcApprovedBy,
        description: pcDescription.trim(),
      })
      showToast(
        'Payment processed',
        `${money(pcRequested)} paid from petty cash.`
      )
      setPcAmount('')
      setPcPaidTo('')
      setPcDescription('')
      setPcCategoryId('')
      try {
        const res = await accountApi.listCashAccounts({
          kind: ['PETTY_CASH'],
        })
        const list = Array.isArray(res.data) ? res.data : []
        setPettyCashAccounts(list.map(cashOption).filter(Boolean))
      } catch {
        /* non-fatal */
      }
    } catch (e) {
      showToast('Could not process payment', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  // ── wallet submit (two stages) ──────────────────────────
  async function handleWalletSubmit() {
    // Stage 2: verify OTP, then submit withdrawal
    if (otpSent) {
      if (!otpCodeInput.trim()) {
        showToast(
          'Enter the code',
          'Ask the dealer for the OTP they received.',
          true
        )
        return
      }
      setSubmitting(true)
      try {
        const v = await otpApi.verifyOtp(otpChallengeId, {
          code: otpCodeInput.trim(),
        })
        if (!v?.data?.verified) {
          showToast(
            'OTP incorrect',
            'Double-check the code and try again.',
            true
          )
          return
        }

        await accountApi.dealerWalletWithdrawal({
          customerId: wCustomerId,
          balanceType: wBalanceType,
          reason: wReason,
          amount: walletRequested,
          payoutKind: wPayoutKind,
          payoutBankAccountId:
            wPayoutKind === 'BANK' ? wPayoutBankAccountId : '',
          payoutCashAccountId:
            wPayoutKind === 'CASH' ? wPayoutCashAccountId : '',
          paidVia: wPaidVia.trim(),
          otpChallengeId,
          authorisedByUserId: wAuthorisedByUserId,
          withdrawalDate: wDate,
          locationId: '',
          note: wNote.trim(),
        })
        showToast(
          'Withdrawal processed',
          `${money(walletRequested)} withdrawn from ${
            selectedDealer?.label || 'the dealer'
          }'s ${wBalanceType.toLowerCase()}.`
        )

        resetOtp()
        setWAmount('')
        setWPaidVia('')
        setWNote('')

        try {
          const res = await customerApi.listCustomers({
            type: ['AUTHORISED_DEALER'],
            page: 0,
            size: 200,
          })
          const list = res.data?.items || []
          setDealers(
            list.map((d) => ({
              value: d.id,
              label: `${d.code} · ${d.name}`,
              walletBalance: d.walletBalance || 0,
              depositBalance: d.depositBalance || 0,
            }))
          )
        } catch {
          /* non-fatal */
        }
      } catch (e) {
        showToast('Could not verify or process withdrawal', e.message, true)
      } finally {
        setSubmitting(false)
      }
      return
    }

    // Stage 1: create + issue OTP
    if (!canSubmitWalletPreOtp) return
    setSubmitting(true)
    try {
      const created = await otpApi.createOtpChallenge({
        purpose: 'WALLET_WITHDRAWAL',
        targetReference: wCustomerId,
        // amount is already in naira — no cents conversion
        context: { amount: walletRequested },
      })
      const challengeId = created?.data?.challengeId
      if (!challengeId) {
        throw new Error('OTP challenge could not be created')
      }

      const issued = await otpApi.issueOtp(challengeId)
      const code =
        issued?.data?.code || issued?.data?.otp || issued?.code || ''

      setOtpChallengeId(challengeId)
      setOtpCodeSent(code)
      setOtpExpiresAt(issued?.data?.expiresAt || '')
      setOtpStage('sent')
      showToast(
        'OTP sent to dealer',
        'Ask the dealer for the code they received, then enter it below to complete the withdrawal.'
      )
    } catch (e) {
      showToast('Could not send OTP', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = isWallet ? handleWalletSubmit : handlePettySubmit

  // ── submit label ────────────────────────────────────────
  const submitLabel = isWallet
    ? otpSent
      ? 'Verify & process withdrawal'
      : 'Send OTP to dealer'
    : 'Process payment'

  // ── render ──────────────────────────────────────────────
  return (
    <>
      {(loadingLookups || submitting) && (
        <Loader
          overlay
          label={
            loadingLookups
              ? 'Loading…'
              : otpSent
                ? 'Verifying OTP…'
                : isWallet
                  ? 'Processing withdrawal…'
                  : 'Processing payment…'
          }
        />
      )}
      <FormShell
        crumbs={crumbs}
        title={leaf?.label || 'Petty Cash Payment / Wallet Withdrawal'}
        icon={leaf?.icon}
        description="Process petty cash disbursements, and manage withdrawals from a dealer's wallet — whether the dealer has requested their balance or the company is recovering excess commission."
        submitLabel={submitLabel}
        onSubmit={handleSubmit}
        onCancel={() => {}}
        submitDisabled={!canSubmit}
        note={
          isWallet
            ? "The dealer's wallet balance updates immediately. A withdrawal can never take a wallet below zero."
            : 'The petty cash balance updates immediately, and the payment appears on both the Petty Cash Statement and the Cash Inflow/Outflow Statement.'
        }
        aside={
          <Panel
            title={isWallet ? 'Wallet position' : 'Petty cash position'}
          >
            {isWallet ? (
              <>
                <MetaRow
                  label="Dealer"
                  value={selectedDealer?.label || '—'}
                />
                <MetaRow
                  label="Balance type"
                  value={
                    BALANCE_TYPES.find((b) => b.value === wBalanceType)
                      ?.label || '—'
                  }
                />
                <MetaRow
                  label="Current balance"
                  value={money(walletBalance)}
                  mono
                />
                <MetaRow
                  label="Withdrawal"
                  value={walletRequested ? money(walletRequested) : '—'}
                  mono
                  tone={walletRequested ? 'negative' : undefined}
                />
              </>
            ) : (
              <>
                <MetaRow
                  label="Petty cash account"
                  value={selectedPcAccount?.label || '—'}
                />
                <MetaRow
                  label="Current balance"
                  value={money(pcBalance)}
                  mono
                />
                <MetaRow
                  label="Payment"
                  value={pcRequested ? money(pcRequested) : '—'}
                  mono
                  tone={pcRequested ? 'negative' : undefined}
                />
              </>
            )}
            <div
              style={{
                marginTop: 14,
                padding: '14px 16px',
                background: (isWallet ? walletOverdrawn : pcOverdrawn)
                  ? 'var(--danger-bg)'
                  : 'var(--brand-subtle)',
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
                Balance after
              </div>
              <div
                style={{
                  marginTop: 8,
                  font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)',
                  fontVariantNumeric: 'tabular-nums',
                  color:
                    (isWallet ? walletOverdrawn : pcOverdrawn)
                      ? 'var(--danger)'
                      : 'var(--text-strong)',
                }}
              >
                {money(isWallet ? walletRemaining : pcRemaining)}
              </div>
            </div>
            {(isWallet ? walletOverdrawn : pcOverdrawn) && (
              <Callout
                tone="danger"
                icon="circle-alert"
                title={
                  isWallet
                    ? 'Withdrawal exceeds wallet balance'
                    : 'Insufficient petty cash'
                }
                style={{ marginTop: 14 }}
              >
                {isWallet
                  ? `Only ${money(walletBalance)} is available in this wallet. A wallet balance may never go negative, so the withdrawal cannot be processed at this amount.`
                  : `Only ${money(pcBalance)} remains in petty cash. Credit the account before processing a payment this size.`}
              </Callout>
            )}
            {isWallet && !otpSent && (
              <Callout
                tone="info"
                icon="shield-check"
                title="OTP required"
                style={{ marginTop: 14 }}
              >
                A one-time code will be sent to the dealer when you continue.
                The withdrawal can only be processed after that code is
                verified.
              </Callout>
            )}
          </Panel>
        }
      >
        <Panel
          title={isWallet ? 'Withdrawal' : 'Payment'}
          description={
            isWallet
              ? 'Withdraw funds from a registered dealer’s wallet.'
              : 'Record an actual disbursement from the petty cash account.'
          }
          actions={
            <Segmented
              options={MODES}
              value={mode}
              onChange={setMode}
              size="sm"
            />
          }
        >
          {isWallet ? (
            <FieldSet columns={2}>
              <Select
                label="Dealer *"
                options={dealers}
                placeholder={
                  dealers.length ? 'Select dealer…' : 'No dealers registered'
                }
                value={wCustomerId}
                onChange={(v) => setWCustomerId(val(v))}
                disabled={!dealers.length || otpSent}
              />
              <Select
                label="Balance type *"
                options={BALANCE_TYPES}
                value={wBalanceType}
                onChange={(v) => setWBalanceType(val(v))}
                disabled={otpSent}
              />
              <Input
                label="Withdrawal amount (₦) *"
                type="number"
                placeholder="0.00"
                value={wAmount}
                onChange={(e) => setWAmount(val(e))}
                error={
                  walletOverdrawn
                    ? `Exceeds available balance of ${money(walletBalance)}`
                    : undefined
                }
                hint={`${money(walletBalance)} available`}
                disabled={otpSent}
              />
              <Select
                label="Reason *"
                options={WITHDRAWAL_REASONS}
                placeholder="Select reason…"
                value={wReason}
                onChange={(v) => setWReason(val(v))}
                disabled={otpSent}
              />
              <Input
                label="Withdrawal date *"
                type="date"
                value={wDate}
                onChange={(e) => setWDate(val(e))}
                disabled={otpSent}
              />
              <Input
                label="Paid via *"
                placeholder="e.g. Ledger adjustment against dealer account"
                value={wPaidVia}
                onChange={(e) => setWPaidVia(val(e))}
                disabled={otpSent}
              />
              <Select
                label="Authorised by *"
                options={members}
                placeholder={
                  members.length
                    ? 'Select authoriser…'
                    : 'No members available'
                }
                value={wAuthorisedByUserId}
                onChange={(v) => setWAuthorisedByUserId(val(v))}
                disabled={!members.length || otpSent}
              />
              <Select
                label="Payout kind *"
                options={PAYOUT_KINDS}
                value={wPayoutKind}
                onChange={(v) => setWPayoutKind(val(v))}
                disabled={otpSent}
              />
              {wPayoutKind === 'CASH' ? (
                <Select
                  label="Petty cash account *"
                  options={pettyCashAccounts}
                  placeholder={
                    pettyCashAccounts.length
                      ? 'Select account…'
                      : 'No petty cash accounts registered'
                  }
                  value={wPayoutCashAccountId}
                  onChange={(v) => setWPayoutCashAccountId(val(v))}
                  disabled={!pettyCashAccounts.length || otpSent}
                />
              ) : (
                <Select
                  label="Bank account *"
                  options={bankAccounts}
                  placeholder={
                    bankAccounts.length
                      ? 'Select bank account…'
                      : 'No bank accounts registered'
                  }
                  value={wPayoutBankAccountId}
                  onChange={(v) => setWPayoutBankAccountId(val(v))}
                  disabled={!bankAccounts.length || otpSent}
                />
              )}
            </FieldSet>
          ) : (
            <FieldSet columns={2}>
              <Select
                label="Petty cash account *"
                options={pettyCashAccounts}
                placeholder={
                  pettyCashAccounts.length
                    ? 'Select account…'
                    : 'No petty cash accounts registered'
                }
                value={pcAccountId}
                onChange={(v) => setPcAccountId(val(v))}
                disabled={!pettyCashAccounts.length}
              />
              <Select
                label="Expense category *"
                options={expenseCategories}
                placeholder={
                  expenseCategories.length
                    ? 'Select category…'
                    : 'No petty-cash categories registered'
                }
                value={pcCategoryId}
                onChange={(v) => setPcCategoryId(val(v))}
                disabled={!expenseCategories.length}
              />
              <Input
                label="Amount (₦) *"
                type="number"
                placeholder="0.00"
                value={pcAmount}
                onChange={(e) => setPcAmount(val(e))}
                error={
                  pcOverdrawn
                    ? `Exceeds available balance of ${money(pcBalance)}`
                    : undefined
                }
                hint={`${money(pcBalance)} available`}
              />
              <Input
                label="Paid to *"
                placeholder="e.g. Autoworks Ikeja"
                value={pcPaidTo}
                onChange={(e) => setPcPaidTo(val(e))}
              />
              <Input
                label="Payment date *"
                type="date"
                value={pcDate}
                onChange={(e) => setPcDate(val(e))}
              />
              <Select
                label="Approved by *"
                options={members}
                placeholder={
                  members.length
                    ? 'Select approver…'
                    : 'No members available'
                }
                value={
                  members.find((m) => m.displayName === pcApprovedBy)
                    ?.value || ''
                }
                onChange={(v) => {
                  const m = members.find((x) => x.value === val(v))
                  setPcApprovedBy(m?.displayName || '')
                }}
                disabled={!members.length}
              />
            </FieldSet>
          )}

          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block' }}>
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                {isWallet ? 'Withdrawal note' : 'Description *'}
              </div>
              <textarea
                rows={2}
                placeholder={
                  isWallet
                    ? 'Context for this withdrawal, visible on the dealer’s statement.'
                    : 'What the payment covers.'
                }
                value={isWallet ? wNote : pcDescription}
                onChange={(e) =>
                  isWallet ? setWNote(val(e)) : setPcDescription(val(e))
                }
                disabled={isWallet && otpSent}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  resize: 'vertical',
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-control)',
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
            <Badge tone={isWallet ? 'brand' : 'neutral'}>
              {isWallet ? 'Dealer wallet' : 'Petty cash'}
            </Badge>
            <span
              style={{
                font: 'var(--type-caption)',
                color: 'var(--text-muted)',
              }}
            >
              {isWallet
                ? `${money(walletBalance)} available${
                    walletRequested
                      ? ` · ${money(walletRemaining)} would remain`
                      : ''
                  }.`
                : `${money(pcBalance)} available${
                    pcRequested
                      ? ` · ${money(pcRemaining)} would remain`
                      : ''
                  }.`}
            </span>
          </div>
        </Panel>

        {otpSent && (
          <Panel
            title="Verify the one-time code"
            description="The dealer receives an SMS with a 6-digit code. Ask them for it and enter it below to authorise the withdrawal."
          >
            {otpCodeSent && (
              <Callout
                tone="info"
                icon="shield-check"
                title="Code for verification"
                style={{ marginBottom: 14 }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 20,
                    letterSpacing: 4,
                    marginTop: 6,
                  }}
                >
                  {otpCodeSent}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                  }}
                >
                  This is the code the dealer received. It's shown here for
                  testing — in production, only the dealer's phone sees it.
                </div>
              </Callout>
            )}
            <FieldSet columns={2}>
              <Input
                label="OTP code *"
                placeholder="Enter 6-digit code"
                value={otpCodeInput}
                onChange={(e) => setOtpCodeInput(val(e))}
                hint={
                  otpExpiresAt
                    ? `Expires ${new Date(
                        otpExpiresAt
                      ).toLocaleTimeString()}`
                    : undefined
                }
              />
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button variant="secondary" onClick={resetOtp}>
                  Start over
                </Button>
              </div>
            </FieldSet>
          </Panel>
        )}
      </FormShell>
    </>
  )
}