// import { useState } from 'react'
// import { Badge } from '../../ds/components/core/Badge.jsx'
// import { Button } from '../../ds/components/core/Button.jsx'
// import { Input } from '../../ds/components/forms/Input.jsx'
// import { Select } from '../../ds/components/forms/Select.jsx'
// import { ReportTable } from '../../ds/components/data/ReportTable.jsx'
// import { FormShell } from '../shells/FormShell.jsx'
// import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
// import { expenseCategories, paymentMethods, runningCosts, pettyCashOpening, pettyCashFunding, pettyCashPayments } from '../sampleAccount.js'
// import { banks } from '../sampleAccount.js'
// import { money, moneyShort } from '../utils.js'

// const STATUS_TONE = { Approved: 'success', 'Pending approval': 'warning', Rejected: 'danger' }

// const activeCategories = expenseCategories.filter((c) => c.status === 'Active')

// export default function RunningCost({ leaf, moduleLabel, parentLabel }) {
//   const [categoryCode, setCategoryCode] = useState('')
//   const [method, setMethod] = useState('petty')
//   const [amount, setAmount] = useState('')

//   const category = expenseCategories.find((c) => c.code === categoryCode)
//   const pettyBalance = pettyCashOpening
//     + pettyCashFunding.reduce((n, r) => n + r.amount, 0)
//     - pettyCashPayments.reduce((n, r) => n + r.amount, 0)

//   const requested = Number(amount) || 0
//   const fromPetty = method === 'petty'
//   const overdrawn = fromPetty && requested > pettyBalance
//   // The guide governs which categories may be settled from petty cash.
//   const categoryBlocked = fromPetty && category && category.pettyCashAllowed === 'No'

//   const pending = runningCosts.filter((r) => r.status === 'Pending approval')
//   const approved = runningCosts.filter((r) => r.status === 'Approved')

//   const historyColumns = [
//     { key: 'date', label: 'Date', width: 130 },
//     { key: 'ref', label: 'Reference', width: 115, mono: true },
//     { key: 'description', label: 'Description', width: 320 },
//     { key: 'category', label: 'Category', width: 210 },
//     { key: 'payee', label: 'Payee', width: 180 },
//     { key: 'method', label: 'Method', width: 150 },
//     { key: 'amount', label: 'Amount', width: 160, align: 'right', mono: true, render: (r) => money(r.amount) },
//     {
//       key: 'status', label: 'Status', width: 160,
//       render: (r) => <Badge tone={STATUS_TONE[r.status] || 'neutral'}>{r.status}</Badge>,
//     },
//     { key: 'approvedBy', label: 'Approved by', width: 150 },
//   ]

//   return (
//     <FormShell
//       wide
//       crumbs={[moduleLabel, parentLabel]}
//       title={leaf?.label || 'Payment/Running Cost'}
//       icon={leaf?.icon}
//       description="Record the company's daily payments and operational expenses. Every entry is classified against the Expenses/Payment Guide and verified by accounting personnel before it is processed."
//       submitLabel="Submit for approval"
//       onCancel={() => {}}
//       note="Approved payments automatically update both the Petty Cash records and the Cash Inflow/Outflow Statement."
//       secondaryAction={<Button variant="secondary" iconLeft="save">Save draft</Button>}
//       aside={
//         <>
//           <Panel title="Payment summary">
//             <MetaRow label="Category" value={category ? category.name : '—'} />
//             <MetaRow label="Method" value={paymentMethods.find((m) => m.value === method)?.label} />
//             <MetaRow label="Amount" value={requested ? money(requested) : '—'} mono />
//             {fromPetty && <MetaRow label="Petty cash balance" value={money(pettyBalance)} mono />}
//             {fromPetty && requested > 0 && !overdrawn && (
//               <MetaRow label="Balance after" value={money(pettyBalance - requested)} mono />
//             )}
//             {categoryBlocked && (
//               <Callout tone="danger" icon="circle-alert" title="Not payable from petty cash" style={{ marginTop: 14 }}>
//                 The guide marks <strong>{category.name}</strong> as ineligible for petty cash. Settle it by bank
//                 transfer or cheque instead.
//               </Callout>
//             )}
//             {overdrawn && !categoryBlocked && (
//               <Callout tone="danger" icon="circle-alert" title="Insufficient petty cash" style={{ marginTop: 14 }}>
//                 Only {money(pettyBalance)} remains. Credit the petty cash account or pay by another method.
//               </Callout>
//             )}
//           </Panel>

//           <Panel title="Awaiting approval">
//             <MetaRow label="Entries pending" value={pending.length} mono tone={pending.length ? 'negative' : undefined} />
//             <MetaRow label="Value pending" value={money(pending.reduce((n, r) => n + r.amount, 0))} mono />
//             <MetaRow label="Approved this period" value={money(approved.reduce((n, r) => n + r.amount, 0))} mono tone="positive" />
//           </Panel>
//         </>
//       }
//     >
//       <Panel title="Payment details" description="Classify the payment against a registered expense category before submitting.">
//         <FieldSet columns={3}>
//           <Select
//             label="Expense category"
//             options={activeCategories.map((c) => ({ value: c.code, label: c.name }))}
//             value={categoryCode}
//             onChange={(e) => setCategoryCode(e.target.value)}
//             placeholder="Select category…"
//           />
//           <Input label="Payee" placeholder="e.g. Buildwell Ltd" />
//           <Input
//             label="Amount (₦)"
//             type="number"
//             placeholder="0.00"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             error={overdrawn ? `Exceeds petty cash balance of ${money(pettyBalance)}` : undefined}
//           />
//           <Select label="Payment method" options={paymentMethods} value={method} onChange={(e) => setMethod(e.target.value)} />
//           {!fromPetty && <Select label="Paying account" options={banks} placeholder="Select bank account…" />}
//           <Input label="Payment date" type="date" />
//           <Input label="Invoice / receipt no." placeholder="Supplier document reference" />
//           <Input label="Reference no." placeholder="Auto-generated" disabled value="RC-2292" />
//         </FieldSet>
//         <div style={{ marginTop: 14 }}>
//           <label style={{ display: 'block' }}>
//             <div style={{ font: 'var(--type-label)', color: 'var(--text-strong)', marginBottom: 6 }}>Description</div>
//             <textarea
//               rows={2}
//               placeholder="What the payment covers and why it was incurred."
//               style={{
//                 width: '100%', padding: '10px 12px', resize: 'vertical',
//                 background: 'var(--surface-card)', border: '1px solid var(--border-default)',
//                 borderRadius: 'var(--radius-control)', boxShadow: 'var(--shadow-xs)',
//                 font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)', color: 'var(--text-strong)', outline: 'none',
//               }}
//             />
//           </label>
//         </div>
//         {category && (
//           <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
//             <Badge tone="neutral" uppercase>{category.code}</Badge>
//             <Badge tone={category.pettyCashAllowed === 'Yes' ? 'success' : 'neutral'}>
//               {category.pettyCashAllowed === 'Yes' ? 'Petty cash allowed' : 'Bank settlement only'}
//             </Badge>
//             <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{category.description}</span>
//           </div>
//         )}
//       </Panel>

//       <Panel
//         title="Recent payments"
//         description="Entries recorded through this module, with their verification status."
//         padding={0}
//       >
//         <ReportTable
//           columns={historyColumns}
//           rows={runningCosts}
//           rowKey={(r) => r.ref}
//           totals={{ date: 'Total', amount: money(runningCosts.reduce((n, r) => n + r.amount, 0)) }}
//           stickyHeader={false}
//           style={{ border: 'none', borderRadius: 0 }}
//         />
//       </Panel>

//       <div style={{ font: 'var(--type-caption)', color: 'var(--text-subtle)', maxWidth: '80ch' }}>
//         Total recorded this period: {moneyShort(runningCosts.reduce((n, r) => n + r.amount, 0))} across{' '}
//         {runningCosts.length} entries, of which {pending.length} await verification by accounting personnel.
//       </div>
//     </FormShell>
//   )
// }


import { useEffect, useState, useCallback, useMemo } from 'react'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { money, moneyShort, fmtDate } from '../utils.js'
import AccountApi from '../../api/AccountApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'
import FactoryApi from '../../api/FactoryApi.js'

const accountApi = new AccountApi()
const showroomApi = new ShowroomApi()
const factoryApi = new FactoryApi()
const PAGE_SIZE = 50

// ── constants ─────────────────────────────────────────────
const STATUS_LABEL = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  REVERSED: 'Reversed',
}
const STATUS_TONE = {
  DRAFT: 'neutral',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  REVERSED: 'neutral',
}

const FALLBACK_METHODS = [
  { value: 'PETTY_CASH', label: 'Petty cash' },
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank transfer' },
  { value: 'CHEQUE', label: 'Cheque' },
]
const METHOD_LABEL = Object.fromEntries(
  FALLBACK_METHODS.map((m) => [m.value, m.label])
)

// which pool a method draws from
const isCashMethod = (m) => m === 'PETTY_CASH' || m === 'CASH'
const isBankMethod = (m) => m === 'BANK_TRANSFER' || m === 'CHEQUE'

const EMPTY_FILTERS = {
  status: '',
  expenseCategoryId: '',
  paymentMethod: '',
  locationId: '',
  from: '',
  to: '',
}

const today = () => new Date().toISOString().slice(0, 10)

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

// ── shared form (create + edit) ───────────────────────────
function RunningCostForm({
  mode,
  existing,
  crumbs,
  categories,
  pettyCashAccounts,
  cashAccounts,
  bankAccounts,
  locations,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()
  const isEdit = mode === 'edit'

  // Derive the initial method from the existing record; response field is
  // `method`, credentials field is `paymentMethod`.
  const initialMethod = existing?.method || 'PETTY_CASH'
  const initialAccountId = existing?.payingAccountId || ''

  const [expenseCategoryId, setExpenseCategoryId] = useState(
    existing?.expenseCategory?.id || existing?.expenseCategoryId || ''
  )
  const [paymentMethod, setPaymentMethod] = useState(initialMethod)
  const [amount, setAmount] = useState(
    existing?.amount != null ? String(existing.amount) : ''
  )
  const [payee, setPayee] = useState(existing?.payee || '')
  const [description, setDescription] = useState(
    existing?.description || ''
  )
  const [paymentDate, setPaymentDate] = useState(
    existing?.date || existing?.paymentDate || today()
  )
  const [payingAccountId, setPayingAccountId] = useState(initialAccountId)
  const [invoiceOrReceiptNo, setInvoiceOrReceiptNo] = useState(
    existing?.invoiceOrReceiptNo || ''
  )
  const [chequeNumber, setChequeNumber] = useState(
    existing?.chequeNumber || ''
  )
  const [inputVatAmount, setInputVatAmount] = useState(
    existing?.inputVatAmount != null && existing.inputVatAmount !== 0
      ? String(existing.inputVatAmount)
      : ''
  )
  const [supplierTin, setSupplierTin] = useState(
    existing?.supplierTin || ''
  )
  const [locationId, setLocationId] = useState(
    existing?.location?.id || existing?.locationId || ''
  )
  const [submitting, setSubmitting] = useState(false)

  const category = categories.find((c) => c.value === expenseCategoryId)

  const accountPool = isCashMethod(paymentMethod)
    ? paymentMethod === 'PETTY_CASH'
      ? pettyCashAccounts
      : cashAccounts
    : bankAccounts

  const selectedAccount = accountPool.find(
    (a) => a.value === payingAccountId
  )

  // Reset the paying account when the method changes to one that can't use
  // the previously-selected account
  useEffect(() => {
    if (!payingAccountId) return
    if (!accountPool.some((a) => a.value === payingAccountId)) {
      setPayingAccountId('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod])

  const requested = Number(amount) || 0
  const isPetty = paymentMethod === 'PETTY_CASH'
  const isCheque = paymentMethod === 'CHEQUE'
  const pettyBalance = isPetty ? selectedAccount?.currentBalance ?? 0 : 0
  const categoryBlocked = isPetty && category && !category.pettyCashAllowed
  const overdrawn =
    isPetty && selectedAccount && requested > pettyBalance

  const canSubmit =
    expenseCategoryId &&
    paymentMethod &&
    requested > 0 &&
    payee.trim() &&
    paymentDate &&
    payingAccountId &&
    (!isCheque || chequeNumber.trim()) &&
    !submitting &&
    !categoryBlocked &&
    !overdrawn

  async function save(submit) {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      // Split the account id into the two backend fields
      const payingCashAccountId = isCashMethod(paymentMethod)
        ? payingAccountId
        : ''
      const payingBankAccountId = isBankMethod(paymentMethod)
        ? payingAccountId
        : ''

      const body = {
        locationId: locationId || '',
        expenseCategoryId,
        payee: payee.trim(),
        amount: requested,
        paymentMethod,
        payingCashAccountId,
        payingBankAccountId,
        chequeNumber: isCheque ? chequeNumber.trim() : '',
        invoiceOrReceiptNo: invoiceOrReceiptNo.trim(),
        inputVatAmount: Number(inputVatAmount) || 0,
        supplierTin: supplierTin.trim(),
        paymentDate,
        description: description.trim(),
        submit,
      }

      if (isEdit) {
        await accountApi.editRejected_or_DraftRunningCost(
          existing.id,
          body
        )
        showToast(
          'Payment updated',
          submit
            ? 'Payment updated and submitted for approval.'
            : 'Payment saved as draft.'
        )
      } else {
        await accountApi.createRunningCost(body)
        showToast(
          submit ? 'Payment submitted' : 'Draft saved',
          submit
            ? 'Your running cost has been submitted for approval.'
            : 'You can submit this draft for approval at any time.'
        )
      }
      onDone()
    } catch (e) {
      showToast(
        isEdit ? 'Could not update payment' : 'Could not create payment',
        e.message,
        true
      )
    } finally {
      setSubmitting(false)
    }
  }

  const accountLabel =
    paymentMethod === 'PETTY_CASH'
      ? 'Petty cash account *'
      : paymentMethod === 'CASH'
        ? 'Cash account *'
        : 'Bank account *'

  return (
    <>
      {submitting && (
        <Loader
          overlay
          label={isEdit ? 'Saving changes…' : 'Recording payment…'}
        />
      )}
      <FormShell
        wide
        crumbs={crumbs}
        title={
          isEdit
            ? `Edit ${existing.ref || 'payment'}`
            : 'Record running cost'
        }
        icon={isEdit ? 'edit' : 'receipt'}
        description={
          isEdit
            ? 'Update the details of this payment. Saving keeps it as a draft; submitting sends it for approval again.'
            : "Record the company's daily payments and operational expenses. Every entry is classified against the Expenses Guide and verified by accounting personnel before it is paid."
        }
        submitLabel="Submit for approval"
        onSubmit={() => save(true)}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        secondaryAction={
          <Button
            variant="secondary"
            iconLeft="save"
            onClick={() => save(false)}
            disabled={!canSubmit || submitting}
          >
            Save draft
          </Button>
        }
        note="Approved payments automatically update both the Petty Cash records and the Cash Inflow/Outflow Statement."
        aside={
          <Panel title="Payment summary">
            <MetaRow
              label="Category"
              value={category ? category.label : '—'}
            />
            <MetaRow
              label="Method"
              value={METHOD_LABEL[paymentMethod] || '—'}
            />
            <MetaRow
              label="Amount"
              value={requested ? money(requested) : '—'}
              mono
            />
            {isPetty && selectedAccount && (
              <MetaRow
                label="Petty cash balance"
                value={money(pettyBalance)}
                mono
              />
            )}
            {isPetty && selectedAccount && requested > 0 && !overdrawn && (
              <MetaRow
                label="Balance after"
                value={money(pettyBalance - requested)}
                mono
              />
            )}
            {categoryBlocked && (
              <Callout
                tone="danger"
                icon="circle-alert"
                title="Not payable from petty cash"
                style={{ marginTop: 14 }}
              >
                The guide marks <strong>{category.label}</strong> as
                ineligible for petty cash. Settle it by bank transfer or
                cheque instead.
              </Callout>
            )}
            {overdrawn && !categoryBlocked && (
              <Callout
                tone="danger"
                icon="circle-alert"
                title="Insufficient petty cash"
                style={{ marginTop: 14 }}
              >
                Only {money(pettyBalance)} remains. Credit the petty cash
                account or pay by another method.
              </Callout>
            )}
          </Panel>
        }
      >
        <Panel
          title="Payment details"
          description="Classify the payment against a registered expense category before saving."
        >
          <FieldSet columns={3}>
            <Select
              label="Expense category *"
              options={categories}
              value={expenseCategoryId}
              onChange={(v) => setExpenseCategoryId(val(v))}
              placeholder="Select category…"
            />
            <Input
              label="Payee *"
              placeholder="e.g. Buildwell Ltd"
              value={payee}
              onChange={(e) => setPayee(val(e))}
            />
            <Input
              label="Amount (₦) *"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(val(e))}
              error={
                overdrawn
                  ? `Exceeds petty cash balance of ${money(pettyBalance)}`
                  : undefined
              }
            />
            <Select
              label="Payment method *"
              options={FALLBACK_METHODS}
              value={paymentMethod}
              onChange={(v) => setPaymentMethod(val(v))}
            />
            <Select
              label={accountLabel}
              options={accountPool}
              placeholder={
                accountPool.length ? 'Select account…' : 'No accounts registered'
              }
              value={payingAccountId}
              onChange={(v) => setPayingAccountId(val(v))}
              disabled={!accountPool.length}
            />
            <Input
              label="Payment date *"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(val(e))}
            />
            <Input
              label="Invoice / receipt no."
              placeholder="Supplier document reference"
              value={invoiceOrReceiptNo}
              onChange={(e) => setInvoiceOrReceiptNo(val(e))}
            />
            {isCheque && (
              <Input
                label="Cheque number *"
                placeholder="e.g. 001234"
                value={chequeNumber}
                onChange={(e) => setChequeNumber(val(e))}
              />
            )}
            <Input
              label="Input VAT (₦)"
              type="number"
              placeholder="0.00"
              value={inputVatAmount}
              onChange={(e) => setInputVatAmount(val(e))}
            />
            <Input
              label="Supplier TIN"
              placeholder="Optional"
              value={supplierTin}
              onChange={(e) => setSupplierTin(val(e))}
            />
            <Select
              label="Location"
              options={locations}
              placeholder="Select location…"
              value={locationId}
              onChange={(v) => setLocationId(val(v))}
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
                placeholder="What the payment covers and why it was incurred."
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
          {category && (
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              <Badge tone="neutral" uppercase>
                {category.code || 'Category'}
              </Badge>
              <Badge
                tone={category.pettyCashAllowed ? 'success' : 'neutral'}
              >
                {category.pettyCashAllowed
                  ? 'Petty cash allowed'
                  : 'Bank settlement only'}
              </Badge>
              {category.description && (
                <span
                  style={{
                    font: 'var(--type-caption)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {category.description}
                </span>
              )}
            </div>
          )}
        </Panel>
      </FormShell>
    </>
  )
}

// ── action dialog (approve / reject / reverse / delete) ────
function ActionDialog({
  kind,
  item,
  crumbs,
  currentUserId,
  onBack,
  onDone,
}) {
  const { showToast } = useStore()
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const config = {
    approve: {
      title: `Approve ${item.ref}`,
      icon: 'check',
      submitLabel: 'Approve',
      description:
        'Approval pays this running cost from the selected account and posts it to the Cash Flow statement.',
      needsReason: false,
    },
    reject: {
      title: `Reject ${item.ref}`,
      icon: 'x',
      submitLabel: 'Reject',
      description:
        'Rejection stops the payment from proceeding. The submitter can edit and resubmit.',
      needsReason: true,
    },
    reverse: {
      title: `Reverse ${item.ref}`,
      icon: 'undo',
      submitLabel: 'Reverse',
      description:
        'Reversal returns the paid amount to the paying account and marks this entry as reversed.',
      needsReason: true,
    },
    delete: {
      title: `Delete ${item.ref}`,
      icon: 'trash-2',
      submitLabel: 'Delete',
      description:
        'Deleting removes this draft permanently. Only drafts can be deleted.',
      needsReason: false,
    },
  }[kind]

  const canSubmit = !submitting && (!config.needsReason || reason.trim())

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      if (kind === 'approve') {
        await accountApi.approveRunningCost(item.id)
      } else if (kind === 'reject') {
        // credentials field is rejectionReason, not reason
        await accountApi.rejectRunningCost(item.id, {
          rejectionReason: reason.trim(),
        })
      } else if (kind === 'reverse') {
        await accountApi.reverseRunningCost(item.id, {
          reason: reason.trim(),
        })
      } else if (kind === 'delete') {
        await accountApi.deleteDraftRunningCost(item.id)
      }
      showToast(
        `${config.title.split(' ')[0]} complete`,
        `${item.ref} has been updated.`
      )
      onDone()
    } catch (e) {
      showToast(`Could not ${kind} payment`, e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  const selfApprovalBlocked =
    kind === 'approve' && item?.submittedBy?.id === currentUserId

  return (
    <>
      {submitting && <Loader overlay label="Processing…" />}
      <FormShell
        crumbs={crumbs}
        title={config.title}
        icon={config.icon}
        description={config.description}
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back to list
          </Button>
        }
        submitLabel={config.submitLabel}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit || selfApprovalBlocked}
        aside={
          <Panel title="Payment">
            <MetaRow label="Ref" value={item.ref} mono />
            <MetaRow label="Payee" value={item.payee || '—'} />
            <MetaRow label="Amount" value={money(item.amount || 0)} mono />
            <MetaRow
              label="Method"
              value={METHOD_LABEL[item.method] || item.method || '—'}
            />
            <MetaRow
              label="Status"
              value={
                <Badge tone={STATUS_TONE[item.status] || 'neutral'}>
                  {STATUS_LABEL[item.status] || item.status}
                </Badge>
              }
            />
            {item.submittedBy?.name && (
              <MetaRow label="Submitted by" value={item.submittedBy.name} />
            )}
          </Panel>
        }
      >
        {selfApprovalBlocked && (
          <Callout
            tone="warning"
            icon="user-round"
            title="You cannot approve your own payment"
            style={{ marginBottom: 14 }}
          >
            Ask a different approver or an administrator to sign off on this
            running cost.
          </Callout>
        )}
        {config.needsReason && (
          <Panel
            title="Reason"
            description="This is recorded against the entry."
          >
            <textarea
              rows={3}
              placeholder={`Why are you ${
                kind === 'reject' ? 'rejecting' : 'reversing'
              } this payment?`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
          </Panel>
        )}
        {!config.needsReason && (
          <Panel title="Confirmation">
            <div
              style={{
                color: 'var(--text-strong)',
                font: 'var(--type-body)',
              }}
            >
              {kind === 'approve' && (
                <>
                  Approving will pay <strong>{money(item.amount || 0)}</strong>{' '}
                  to <strong>{item.payee || 'the payee'}</strong>. The amount
                  will be debited from the paying account and recorded on the
                  cash flow statement.
                </>
              )}
              {kind === 'delete' && (
                <>
                  You're about to permanently delete draft{' '}
                  <strong>{item.ref}</strong>. This cannot be undone.
                </>
              )}
            </div>
          </Panel>
        )}
      </FormShell>
    </>
  )
}

// ── main list ─────────────────────────────────────────────
export default function RunningCost({ leaf, moduleLabel, parentLabel }) {
  const { user, showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)
  const currentUserId = user?.id

  const [mode, setMode] = useState('list')
  const [active, setActive] = useState(null)

  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [page, setPage] = useState(0)

  const [rows, setRows] = useState([])
  const [summary, setSummary] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)

  // filter metadata
  const [filterMeta, setFilterMeta] = useState(null)

  // lookups
  const [categories, setCategories] = useState([])
  const [pettyCashAccounts, setPettyCashAccounts] = useState([])
  const [cashAccounts, setCashAccounts] = useState([])
  const [bankAccounts, setBankAccounts] = useState([])
  const [factories, setFactories] = useState([])
  const [locations, setLocations] = useState([])

  // ── filter metadata ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .getRunningCostFilters()
      .then((res) => {
        if (!cancelled) setFilterMeta(res.data)
      })
      .catch(() => {
        /* non-fatal */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // ── categories ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listExpenseCategories({
        q: '',
        accountHead: [],
        status: 'ACTIVE',
        // pettyCashAllowed: false,
        // overCap: false,
        sort: '',
      })
      .then((list) => {
        console.log('[listExpenseCategories] list', list)
        if (cancelled) return
        setCategories(
          (list || []).map((c) => ({
            value: c.id,
            label: c.name,
            code: c.code,
            description: c.description,
            pettyCashAllowed: !!c.pettyCashAllowed,
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

  // ── petty cash accounts ─────────────────────────────────
  useEffect(() => {
    let cancelled = false
    accountApi
      .listCashAccounts({ kind: ['PETTY_CASH'] })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res.data) ? res.data : []
        setPettyCashAccounts(
          list.map((a) => ({
            value: a.id,
            label: `${a.code} · ${a.name}${
              a.location?.name ? ` (${a.location.name})` : ''
            }`,
            currentBalance: a.currentBalance || 0,
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
            currentBalance: a.currentBalance || 0,
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
            currentBalance: b.currentBalance || 0,
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

  // ── factories from FactoryApi ───────────────────────────
  useEffect(() => {
    let cancelled = false
    factoryApi
      .listFactories()
      .then((res) => {
        if (cancelled) return
        setFactories(res.data || [])
      })
      .catch(() => {
        /* non-fatal — location dropdown will just show showrooms */
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

  // ── reset page on filter change ─────────────────────────
  useEffect(() => {
    setPage(0)
  }, [applied])

  // ── load list ───────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (applied.status) q.status = applied.status
      if (applied.expenseCategoryId)
        q.expenseCategoryId = applied.expenseCategoryId
      if (applied.paymentMethod) q.paymentMethod = applied.paymentMethod
      if (applied.locationId) q.locationId = applied.locationId
      if (applied.from) q.from = applied.from
      if (applied.to) q.to = applied.to

      const res = await accountApi.listRunningCosts(q)
      const paged = res.data
      setRows(paged.items || [])
      setSummary(paged.summary || null)
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load running costs', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [applied, page, showToast])

  useEffect(() => {
    load()
  }, [load])

  const handleGenerate = useCallback((values) => {
    setApplied({
      status: values?.status || '',
      expenseCategoryId: values?.expenseCategoryId || '',
      paymentMethod: values?.paymentMethod || '',
      locationId: values?.locationId || '',
      from: values?.from || '',
      to: values?.to || '',
    })
  }, [])

  const afterMutation = () => {
    setMode('list')
    setActive(null)
    load()
  }

  // ── filter options — MUST stay above the early returns ──
  const statusOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'status')
    return f?.options?.length
      ? f.options
      : Object.entries(STATUS_LABEL).map(([value, label]) => ({
          value,
          label,
        }))
  }, [filterMeta])

  const methodOptions = useMemo(() => {
    const f = filterMeta?.fields?.find((x) => x.key === 'paymentMethod')
    return f?.options?.length ? f.options : FALLBACK_METHODS
  }, [filterMeta])

  // ── modes — safe to early return, all hooks above ───────
  if (mode === 'create' || mode === 'edit') {
    return (
      <RunningCostForm
        mode={mode}
        existing={mode === 'edit' ? active : null}
        crumbs={crumbs}
        categories={categories}
        pettyCashAccounts={pettyCashAccounts}
        cashAccounts={cashAccounts}
        bankAccounts={bankAccounts}
        locations={locations}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  if (['approve', 'reject', 'reverse', 'delete'].includes(mode)) {
    return (
      <ActionDialog
        kind={mode}
        item={active}
        crumbs={crumbs}
        currentUserId={currentUserId}
        onBack={() => setMode('list')}
        onDone={afterMutation}
      />
    )
  }

  // ── columns ─────────────────────────────────────────────
  const columns = [
    { key: 'ref', label: 'Reference', width: 115, mono: true },
    {
      // response field is `date`, not `paymentDate`
      key: 'date',
      label: 'Date',
      width: 125,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    { key: 'description', label: 'Description', width: 260 },
    {
      key: 'expenseCategory',
      label: 'Category',
      width: 180,
      render: (r) => r.expenseCategory?.name || '—',
    },
    {
      key: 'payee',
      label: 'Payee',
      width: 160,
      render: (r) => r.payee || '—',
    },
    {
      // response field is `method`
      key: 'method',
      label: 'Method',
      width: 140,
      render: (r) => METHOD_LABEL[r.method] || r.method || '—',
    },
    {
      key: 'payingAccount',
      label: 'Paid from',
      width: 190,
      render: (r) => r.payingAccount || '—',
    },
    {
      key: 'amount',
      label: 'Amount',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => money(r.amount || 0),
    },
    {
      key: 'status',
      label: 'Status',
      width: 150,
      render: (r) => (
        <Badge tone={STATUS_TONE[r.status] || 'neutral'}>
          {STATUS_LABEL[r.status] || r.status || '—'}
        </Badge>
      ),
    },
    {
      key: 'submittedBy',
      label: 'Submitted by',
      width: 160,
      render: (r) => r.submittedBy?.name || '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 280,
      sortable: false,
      render: (r) => {
        const isSubmitter = r.submittedBy?.id === currentUserId
        const canEdit =
          r.status === 'DRAFT' || r.status === 'REJECTED'
        const canSubmit = canEdit
        const canApprove =
          r.status === 'PENDING_APPROVAL' && !isSubmitter
        const canReject =
          r.status === 'PENDING_APPROVAL' && !isSubmitter
        const canReverse = r.status === 'APPROVED'
        const canDelete = r.status === 'DRAFT'

        return (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {canApprove && (
              <Button
                size="sm"
                onClick={() => {
                  setActive(r)
                  setMode('approve')
                }}
              >
                Approve
              </Button>
            )}
            {canReject && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setActive(r)
                  setMode('reject')
                }}
              >
                Reject
              </Button>
            )}
            {canEdit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setActive(r)
                  setMode('edit')
                }}
              >
                Edit
              </Button>
            )}
            {canSubmit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  try {
                    await accountApi.submitRunningCost(r.id)
                    showToast(
                      'Submitted for approval',
                      `${r.ref} is now pending approval.`
                    )
                    load()
                  } catch (e) {
                    showToast(
                      'Could not submit payment',
                      e.message,
                      true
                    )
                  }
                }}
              >
                Submit
              </Button>
            )}
            {canReverse && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setActive(r)
                  setMode('reverse')
                }}
              >
                Reverse
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setActive(r)
                  setMode('delete')
                }}
              >
                Delete
              </Button>
            )}
            {!canApprove &&
              !canReject &&
              !canEdit &&
              !canSubmit &&
              !canReverse &&
              !canDelete && (
                <span
                  style={{
                    font: 'var(--type-caption)',
                    color: 'var(--text-subtle)',
                  }}
                >
                  —
                </span>
              )}
          </div>
        )
      },
    },
  ]

  // ── stats ───────────────────────────────────────────────
  const pageTotal = rows.reduce((n, r) => n + (r.amount || 0), 0)
  const pagePending = rows.filter(
    (r) => r.status === 'PENDING_APPROVAL'
  )
  const pageApproved = rows.filter((r) => r.status === 'APPROVED')

  const summaryTotal =
    typeof summary?.totalAmount === 'number'
      ? summary.totalAmount
      : pageTotal
  const summaryPending =
    typeof summary?.pendingAmount === 'number'
      ? summary.pendingAmount
      : pagePending.reduce((n, r) => n + (r.amount || 0), 0)
  const summaryApproved =
    typeof summary?.approvedAmount === 'number'
      ? summary.approvedAmount
      : pageApproved.reduce((n, r) => n + (r.amount || 0), 0)

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((c) => ({ value: c.value, label: c.label })),
  ]
  const locationOptions = [
    { value: '', label: 'All locations' },
    ...locations,
  ]
  const statusFilterOptions = [
    { value: '', label: 'All statuses' },
    ...statusOptions,
  ]
  const methodFilterOptions = [
    { value: '', label: 'All methods' },
    ...methodOptions,
  ]

  return (
    <>
      {loading && <Loader overlay label="Loading running costs…" />}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Payment / Running Cost'}
        icon={leaf?.icon}
        description="Record the company's daily payments and operational expenses. Every entry is classified against the Expenses Guide and verified by accounting personnel before it is paid."
        createLabel="Record running cost"
        onCreate={() => setMode('create')}
        searchPlaceholder="Search by ref, payee or description…"
        onGenerate={handleGenerate}
        filters={
          <>
            <Select
              options={statusFilterOptions}
              value={applied.status}
              onChange={(v) =>
                setApplied((s) => ({ ...s, status: val(v) }))
              }
              style={{ width: 170 }}
            />
            <Select
              options={categoryOptions}
              value={applied.expenseCategoryId}
              onChange={(v) =>
                setApplied((s) => ({ ...s, expenseCategoryId: val(v) }))
              }
              style={{ width: 200 }}
            />
            <Select
              options={methodFilterOptions}
              value={applied.paymentMethod}
              onChange={(v) =>
                setApplied((s) => ({ ...s, paymentMethod: val(v) }))
              }
              style={{ width: 170 }}
            />
            <Select
              options={locationOptions}
              value={applied.locationId}
              onChange={(v) =>
                setApplied((s) => ({ ...s, locationId: val(v) }))
              }
              style={{ width: 200 }}
            />
            <Input
              label="From"
              type="date"
              value={applied.from}
              onChange={(e) =>
                setApplied((s) => ({ ...s, from: val(e) }))
              }
              style={{ width: 160 }}
            />
            <Input
              label="To"
              type="date"
              value={applied.to}
              onChange={(e) =>
                setApplied((s) => ({ ...s, to: val(e) }))
              }
              style={{ width: 160 }}
            />
          </>
        }
        stats={[
          { label: 'Entries', value: String(totalItems) },
          { label: 'Total value', value: moneyShort(summaryTotal) },
          {
            label: 'Pending approval',
            value: moneyShort(summaryPending),
            tone: summaryPending ? 'warning' : undefined,
            hint:
              pagePending.length > 0
                ? `${pagePending.length} awaiting verification`
                : undefined,
          },
          { label: 'Approved', value: moneyShort(summaryApproved) },
        ]}
        columns={columns}
        rows={rows}
        totals={{
          ref: 'Total',
          amount: money(pageTotal),
        }}
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        emptyTitle="No running costs recorded"
        emptyDescription="Record a running cost to track daily operational spending."
        footnote="Approved payments automatically update both the Petty Cash records and the Cash Inflow/Outflow Statement. Submitters cannot approve their own entries."
      />
    </>
  )
}