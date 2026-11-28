import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, fmtDate } from '../utils.js'
import InvoiceApi from '../../api/InvoiceApi.js'
import AccountApi from '../../api/AccountApi.js'
import CustomerApi from '../../api/CustomerApi.js'

const invoiceApi = new InvoiceApi()
const accountApi = new AccountApi()
const customerApi = new CustomerApi()

/* ------------------------------------------------------------------ */
/*  Constants & helpers                                                */
/* ------------------------------------------------------------------ */
const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'FUND_TRANSFER', label: 'Fund transfer' },
  { value: 'POS', label: 'POS' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'DEPOSIT', label: 'Deposit' },
  { value: 'WALLET', label: 'Wallet' },
]

const DELIVERY_TEMPLATES = [
  { value: 'STANDARD', label: 'Standard invoice email' },
  { value: 'REMINDER', label: 'Payment reminder' },
]

const CREDIT_REASONS = [
  { value: 'OVERCHARGE', label: 'Overcharge' },
  { value: 'PRICING_ERROR', label: 'Pricing error' },
  { value: 'DUPLICATE_BILLING', label: 'Duplicate billing' },
  { value: 'DISCOUNT_GRANTED_AFTER_ISSUE', label: 'Discount granted after issue' },
  { value: 'GOODWILL', label: 'Goodwill' },
  { value: 'OTHER', label: 'Other' },
]

const todayIso = () => new Date().toISOString().slice(0, 10)
const round2 = (n) => Math.round(n * 100) / 100

// Current local date-time in the format a datetime-local input expects
const nowLocalInput = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

// iso date + n days -> iso date
const addDays = (iso, n) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  d.setUTCDate(d.getUTCDate() + (Number(n) || 0))
  return d.toISOString().slice(0, 10)
}

const normStatus = (s) => String(s || '').toUpperCase()

const pretty = (s) =>
  String(s || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const invoiceTone = (s) => {
  const v = normStatus(s)
  if (v === 'DRAFT') return 'neutral'
  if (v === 'PAID') return 'success'
  if (v.includes('PARTIAL')) return 'warning'
  if (v.includes('OVERDUE') || v.includes('VOID') || v.includes('CANCEL')) return 'danger'
  return 'brand'
}

function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const dateOf = (d) => (d ? fmtDate(d) : '—')

const textareaStyle = {
  width: '100%',
  padding: '10px 12px',
  resize: 'vertical',
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  font: 'var(--fw-regular) var(--text-sm)/1.5 var(--font-ui)',
  color: 'var(--text-strong)',
  outline: 'none',
}

const smallButtonStyle = {
  height: 'var(--field-h)',
  padding: '0 12px',
  background: 'transparent',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-control)',
  color: 'var(--text-muted)',
  font: 'var(--fw-medium) var(--text-sm)/1 var(--font-ui)',
  cursor: 'pointer',
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      {label && (
        <div
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-strong)',
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={textareaStyle}
      />
    </div>
  )
}

function GridTable({ template, headers, rows, empty = 'Nothing to show.' }) {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: template,
    gap: 10,
    padding: '10px 0',
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 'fit-content' }}>
        <div
          style={{
            ...rowStyle,
            borderBottom: '1px solid var(--border-default)',
            font: 'var(--type-eyebrow)',
            letterSpacing: 'var(--ls-widest)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          {headers.map((h, i) => (
            <div key={i} style={{ textAlign: h.align }}>
              {h.label}
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <div style={{ padding: '14px 0', color: 'var(--text-muted)' }}>{empty}</div>
        )}
        {rows.map((cells, ri) => (
          <div
            key={ri}
            style={{
              ...rowStyle,
              alignItems: 'center',
              borderBottom: '1px solid var(--border-subtle)',
              font: 'var(--type-body)',
              color: 'var(--text-strong)',
            }}
          >
            {cells.map((c, ci) => (
              <div
                key={ci}
                style={{
                  textAlign: headers[ci].align,
                  fontFamily: headers[ci].mono ? 'var(--font-mono)' : undefined,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Small confirm dialog that collects a reason
function ReasonModal({ title, description, label, confirmLabel, busy, onConfirm, onCancel }) {
  const [reason, setReason] = useState('')
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          padding: 22,
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            font: 'var(--fw-bold) var(--text-lg)/1.3 var(--font-ui)',
            color: 'var(--text-strong)',
          }}
        >
          {title}
        </div>
        {description && (
          <div style={{ marginTop: 4, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
            {description}
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          <TextArea label={label} value={reason} onChange={setReason} rows={3} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(reason.trim())} disabled={!reason.trim() || busy}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ------------------------------------------------------------------ */
/*  Issue / edit the invoice header (same fields)                      */
/* ------------------------------------------------------------------ */
function HeaderForm({ kind, invoice, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const isIssue = kind === 'issue'

  const initialTerms =
    invoice.paymentTermsDays != null ? String(invoice.paymentTermsDays) : '0'
  const [issueDate, setIssueDate] = useState(
    invoice.issueDate ? String(invoice.issueDate).slice(0, 10) : todayIso()
  )
  const [termsDays, setTermsDays] = useState(initialTerms)
  const [dueDate, setDueDate] = useState(
    invoice.dueDate
      ? String(invoice.dueDate).slice(0, 10)
      : addDays(todayIso(), initialTerms)
  )
  const [termsNote, setTermsNote] = useState(invoice.paymentTermsNote || '')
  const [buyerEmail, setBuyerEmail] = useState(invoice.buyer?.email || '')
  const [submitting, setSubmitting] = useState(false)

  const missing = []
  if (!issueDate) missing.push('Issue date')
  if (termsDays === '' || Number(termsDays) < 0) missing.push('Payment terms (days)')
  if (!dueDate) missing.push('Due date')
  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const body = {
        issueDate,
        paymentTermsDays: Number(termsDays) || 0,
        dueDate,
        paymentTermsNote: termsNote.trim(),
        buyerEmail: buyerEmail.trim(),
      }
      if (isIssue) await invoiceApi.issueInvoice(invoice.id, body)
      else await invoiceApi.editInvoice(invoice.id, body)
      showToast(
        isIssue ? 'Invoice issued' : 'Invoice updated',
        `${invoice.number || 'The invoice'} ${isIssue ? 'has been issued' : 'was saved'}.`
      )
      onDone()
    } catch (e) {
      showToast(isIssue ? 'Could not issue invoice' : 'Could not update invoice', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label={isIssue ? 'Issuing invoice…' : 'Saving…'} />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`${isIssue ? 'Issue' : 'Edit'} invoice${invoice.number ? ` ${invoice.number}` : ''}`}
        icon="file-text"
        description={
          isIssue
            ? 'Set the dates and payment terms, then issue this draft invoice.'
            : 'Edit the planned issue date, payment terms, due date, note and buyer email of this draft. Lines come from the source document.'
        }
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel={isIssue ? 'Issue invoice' : 'Save changes'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Invoice">
            <MetaRow label="Number" value={invoice.number || '—'} mono />
            <MetaRow label="Buyer" value={invoice.buyer?.name || '—'} />
            <MetaRow label="Total" value={money(invoice.totals?.total || 0)} mono />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these fields to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}
        <Panel
          title="Invoice details"
          description="The due date follows the issue date and payment terms, but you can adjust it."
        >
          <FieldSet columns={2}>
            <Input
              label="Issue date *"
              type="date"
              value={issueDate}
              onChange={(e) => {
                const v = val(e)
                setIssueDate(v)
                setDueDate(addDays(v, termsDays))
              }}
            />
            <Input
              label="Payment terms (days) *"
              type="number"
              placeholder="0"
              value={termsDays}
              onChange={(e) => {
                const v = val(e)
                setTermsDays(v)
                setDueDate(addDays(issueDate, v))
              }}
            />
            <Input
              label="Due date *"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(val(e))}
            />
            <Input
              label="Buyer email"
              placeholder="Where the invoice should be sent"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(val(e))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <TextArea
              label="Payment terms note"
              placeholder="e.g. Payment due within 14 days of issue."
              value={termsNote}
              onChange={setTermsNote}
            />
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Record a payment                                                   */
/* ------------------------------------------------------------------ */
function PaymentForm({ invoice, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const balance = Number(invoice.totals?.balance) || 0

  const [method, setMethod] = useState('FUND_TRANSFER')
  const [amount, setAmount] = useState(String(balance || ''))
  const [paidAt, setPaidAt] = useState(nowLocalInput())
  const [bankId, setBankId] = useState('')
  const [cashId, setCashId] = useState('')
  const [terminalRef, setTerminalRef] = useState('')
  const [payerReference, setPayerReference] = useState('')
  const [bankAccounts, setBankAccounts] = useState([])
  const [cashAccounts, setCashAccounts] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    accountApi
      .listBankAccounts({ status: 'ACTIVE' })
      .then((res) => {
        if (cancelled) return
        const d = res?.data
        setBankAccounts(Array.isArray(d) ? d : d?.items ?? [])
      })
      .catch((e) => !cancelled && showToast('Could not load bank accounts', e.message, true))
    accountApi
      .listCashAccounts({ status: 'ACTIVE' })
      .then((res) => !cancelled && setCashAccounts(Array.isArray(res?.data) ? res.data : []))
      .catch(() => !cancelled && setCashAccounts([]))
    return () => {
      cancelled = true
    }
  }, [showToast])

  const amountN = Number(amount)

  const missing = []
  if (!(amountN > 0)) missing.push('Amount')
  if (amountN > balance) missing.push(`Amount cannot exceed the ${money(balance)} balance`)
  if (!paidAt || Number.isNaN(new Date(paidAt).getTime())) missing.push('Payment date & time')
  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await invoiceApi.createPaymentForInvoice(invoice.id, {
        method,
        amount: amountN,
        paidAt: new Date(paidAt).toISOString(), // e.g. 2026-11-28T03:02:20.058Z
        // nothing picked in a dropdown -> null
        cashAccountId: cashId || null,
        receivingBankAccountId: bankId || null,
        terminalRef: terminalRef.trim(),
        payerReference: payerReference.trim(),
      })
      const pending = normStatus(res?.data?.confirmationStatus).includes('PENDING')
      showToast(
        'Payment recorded',
        pending
          ? `${money(amountN)} recorded and waiting for confirmation.`
          : `${money(amountN)} recorded.`
      )
      onDone()
    } catch (e) {
      showToast('Could not record payment', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Recording payment…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Record payment — ${invoice.number || 'invoice'}`}
        icon="banknote"
        description="Record money received against this invoice. Transfers, cheques and POS payments wait for confirmation before they count."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Record payment"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Invoice">
            <MetaRow label="Total" value={money(invoice.totals?.total || 0)} mono />
            <MetaRow label="Paid" value={money(invoice.totals?.paid || 0)} mono />
            <MetaRow label="Balance" value={money(balance)} mono tone="negative" />
            <MetaRow
              label="After this payment"
              value={money(Math.max(0, round2(balance - (amountN || 0))))}
              mono
            />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}
        <Panel title="Payment">
          <FieldSet columns={2}>
            <Select
              label="Method *"
              options={PAYMENT_METHODS}
              value={method}
              onChange={(v) => setMethod(val(v))}
            />
            <Input
              label="Amount (₦) *"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(val(e))}
              hint={`Balance: ${money(balance)}`}
            />
            <Input
              label="Payment date & time *"
              type="datetime-local"
              value={paidAt}
              onChange={(e) => setPaidAt(val(e))}
            />
            <Select
              label="Receiving bank account"
              options={[
                { value: '', label: 'None' },
                ...bankAccounts.map((b) => ({
                  value: b.id,
                  label: `${b.bankName} · ${b.accountNumberMasked || b.accountNumber} — ${b.accountName}`,
                })),
              ]}
              placeholder="Optional"
              value={bankId}
              onChange={(v) => setBankId(val(v))}
            />
            <Select
              label="Cash account"
              options={[
                { value: '', label: 'None' },
                ...cashAccounts.map((c) => ({ value: c.id, label: `${c.code} · ${c.name}` })),
              ]}
              placeholder="Optional"
              value={cashId}
              onChange={(v) => setCashId(val(v))}
            />
            <Input
              label="Terminal reference"
              placeholder="Optional"
              value={terminalRef}
              onChange={(e) => setTerminalRef(val(e))}
            />
            <Input
              label="Payer reference"
              placeholder="Optional"
              value={payerReference}
              onChange={(e) => setPayerReference(val(e))}
            />
          </FieldSet>
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Email the invoice                                                  */
/* ------------------------------------------------------------------ */
function DeliveryForm({ invoice, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [email, setEmail] = useState(invoice.buyer?.email || '')
  const [template, setTemplate] = useState(
    Number(invoice.totals?.balance) > 0 && normStatus(invoice.displayStatus).includes('OVERDUE')
      ? 'REMINDER'
      : 'STANDARD'
  )
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = !!email.trim() && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await invoiceApi.createInvoiceDelivery(invoice.id, {
        recipientEmail: email.trim(),
        template,
        message: message.trim(),
      })
      showToast('Email queued', `The invoice will be sent to ${email.trim()}.`)
      onDone()
    } catch (e) {
      showToast('Could not send invoice', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Sending…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Email invoice ${invoice.number || ''}`}
        icon="mail"
        description="Send this invoice to the buyer by email, either as the standard invoice or as a payment reminder."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Send email"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Invoice">
            <MetaRow label="Number" value={invoice.number || '—'} mono />
            <MetaRow label="Buyer" value={invoice.buyer?.name || '—'} />
            <MetaRow label="Balance" value={money(invoice.totals?.balance || 0)} mono />
          </Panel>
        }
      >
        <Panel title="Email">
          <FieldSet columns={2}>
            <Input
              label="Recipient email *"
              value={email}
              onChange={(e) => setEmail(val(e))}
            />
            <Select
              label="Template *"
              options={DELIVERY_TEMPLATES}
              value={template}
              onChange={(v) => setTemplate(val(v))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <TextArea
              label="Message"
              placeholder="Optional message to include in the email."
              value={message}
              onChange={setMessage}
            />
          </div>
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Credit note                                                        */
/* ------------------------------------------------------------------ */
function CreditNoteForm({ invoice, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [reason, setReason] = useState('PRICING_ERROR')
  const [reasonNote, setReasonNote] = useState('')
  const [lines, setLines] = useState(() =>
    (invoice.lines || []).map((l) => ({ line: l, quantity: '', amount: '' }))
  )
  const [submitting, setSubmitting] = useState(false)

  function setQty(i, v) {
    setLines((cur) =>
      cur.map((r, ri) =>
        ri === i
          ? {
              ...r,
              quantity: v,
              // suggest the amount from the unit price; it stays editable
              amount: Number(v) > 0 ? String(round2(Number(v) * (r.line.unitPrice || 0))) : '',
            }
          : r
      )
    )
  }

  function setAmount(i, v) {
    setLines((cur) => cur.map((r, ri) => (ri === i ? { ...r, amount: v } : r)))
  }

  const chosen = lines.filter((r) => Number(r.amount) > 0 || Number(r.quantity) > 0)
  const total = chosen.reduce((n, r) => n + (Number(r.amount) || 0), 0)

  const missing = []
  if (!reason) missing.push('Reason')
  if (chosen.length === 0) missing.push('At least one line to credit')
  if (chosen.some((r) => !(Number(r.amount) > 0))) missing.push('An amount on every credited line')
  if (reason === 'OTHER' && !reasonNote.trim()) missing.push('A note explaining the reason')
  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const res = await invoiceApi.issueCreditNoteInvoice(invoice.id, {
        reason,
        reasonNote: reasonNote.trim(),
        lines: chosen.map((r) => ({
          invoiceLineId: r.line.id,
          quantity: Number(r.quantity) || 0,
          amount: Number(r.amount) || 0,
        })),
      })
      showToast('Credit note issued', `${res?.data?.number || 'Credit note'} for ${money(total)}.`)
      onDone()
    } catch (e) {
      showToast('Could not issue credit note', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Issuing credit note…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Credit note — ${invoice.number || 'invoice'}`}
        icon="file-minus"
        description="Credit all or part of this invoice. Enter a quantity and/or amount on each line you are crediting."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Issue credit note"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Credit">
            <MetaRow label="Invoice total" value={money(invoice.totals?.total || 0)} mono />
            <MetaRow label="Already credited" value={money(invoice.totals?.credited || 0)} mono />
            <MetaRow label="This credit note" value={money(total)} mono tone="negative" />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}
        <Panel title="Reason">
          <FieldSet columns={2}>
            <Select
              label="Reason *"
              options={CREDIT_REASONS}
              value={reason}
              onChange={(v) => setReason(val(v))}
            />
          </FieldSet>
          <div style={{ marginTop: 14 }}>
            <TextArea
              label={`Note${reason === 'OTHER' ? ' *' : ''}`}
              placeholder="Explain why this credit is being issued."
              value={reasonNote}
              onChange={setReasonNote}
              rows={2}
            />
          </div>
        </Panel>
        <Panel title="Lines to credit">
          <GridTable
            template="minmax(200px, 2fr) 90px 130px 140px 160px"
            headers={[
              { label: 'Product' },
              { label: 'Invoiced', align: 'right', mono: true },
              { label: 'Unit price', align: 'right', mono: true },
              { label: 'Credit qty', align: 'right' },
              { label: 'Credit amount (₦)', align: 'right' },
            ]}
            empty="This invoice has no lines."
            rows={lines.map((r, i) => [
              r.line.name || r.line.stockItem?.name || '—',
              fmt(r.line.quantity || 0),
              money(r.line.unitPrice || 0),
              <Input
                key="q"
                type="number"
                placeholder="0"
                aria-label={`Credit quantity for ${r.line.name}`}
                value={r.quantity}
                onChange={(e) => setQty(i, val(e))}
              />,
              <Input
                key="a"
                type="number"
                placeholder="0.00"
                aria-label={`Credit amount for ${r.line.name}`}
                value={r.amount}
                onChange={(e) => setAmount(i, val(e))}
              />,
            ])}
          />
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Void (optionally reissue to a corrected buyer)                     */
/* ------------------------------------------------------------------ */
function VoidForm({ invoice, crumbs, onBack, onDone }) {
  const { showToast } = useStore()
  const [reason, setReason] = useState('')
  const [reissue, setReissue] = useState(false)
  const [buyerKind, setBuyerKind] = useState('customer') // customer | walkin
  const [customerId, setCustomerId] = useState('')
  const [customers, setCustomers] = useState([])
  const [buyerEmail, setBuyerEmail] = useState('')
  const [walkIn, setWalkIn] = useState({
    name: '',
    email: '',
    phone: '',
    tin: '',
    address: '',
    stateCode: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!reissue || customers.length) return
    let cancelled = false
    customerApi
      .listCustomers({ page: 0, size: 200 })
      .then((res) => {
        if (cancelled) return
        setCustomers(
          (res?.data?.items || []).map((c) => ({ value: c.id, label: `${c.code} · ${c.name}` }))
        )
      })
      .catch((e) => !cancelled && showToast('Could not load customers', e.message, true))
    return () => {
      cancelled = true
    }
  }, [reissue, customers.length, showToast])

  const missing = []
  if (!reason.trim()) missing.push('Reason')
  if (reissue && buyerKind === 'customer' && !customerId) missing.push('Customer to reissue to')
  if (reissue && buyerKind === 'walkin' && !walkIn.name.trim()) missing.push('Walk-in buyer name')
  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const body = { reason: reason.trim() }
      if (reissue) {
        body.reissue = {
          customerId: buyerKind === 'customer' ? customerId : '',
          walkInBuyer:
            buyerKind === 'walkin'
              ? {
                  name: walkIn.name.trim(),
                  email: walkIn.email.trim(),
                  phone: walkIn.phone.trim(),
                  tin: walkIn.tin.trim(),
                  address: walkIn.address.trim(),
                  stateCode: walkIn.stateCode.trim(),
                }
              : null,
          buyerEmail: buyerEmail.trim(),
        }
      }
      await invoiceApi.voidInvoice(invoice.id, body)
      showToast(
        reissue ? 'Invoice voided and reissued' : 'Invoice voided',
        `${invoice.number || 'The invoice'} has been voided.`
      )
      onDone()
    } catch (e) {
      showToast('Could not void invoice', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Voiding invoice…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Void invoice ${invoice.number || ''}`}
        icon="ban"
        description="Void this invoice. This is only possible while nothing has been paid or credited. To correct the buyer, void and reissue in one step."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel={reissue ? 'Void and reissue' : 'Void invoice'}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Invoice">
            <MetaRow label="Number" value={invoice.number || '—'} mono />
            <MetaRow label="Buyer" value={invoice.buyer?.name || '—'} />
            <MetaRow label="Total" value={money(invoice.totals?.total || 0)} mono />
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these to enable submit"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}
        <Panel title="Reason">
          <TextArea
            placeholder="Why is this invoice being voided?"
            value={reason}
            onChange={setReason}
          />
        </Panel>
        <Panel title="Reissue" description="Optional — issue a replacement invoice to the correct buyer.">
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              font: 'var(--type-body)',
              color: 'var(--text-strong)',
            }}
          >
            <input
              type="checkbox"
              checked={reissue}
              onChange={(e) => setReissue(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            Reissue this invoice to a corrected buyer
          </label>
          {reissue && (
            <div style={{ marginTop: 16 }}>
              <FieldSet columns={2}>
                <Select
                  label="Buyer type"
                  options={[
                    { value: 'customer', label: 'Registered customer' },
                    { value: 'walkin', label: 'Walk-in buyer' },
                  ]}
                  value={buyerKind}
                  onChange={(v) => setBuyerKind(val(v))}
                />
                <Input
                  label="Buyer email"
                  placeholder="Where the new invoice should be sent"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(val(e))}
                />
                {buyerKind === 'customer' ? (
                  <Select
                    label="Customer *"
                    options={customers}
                    placeholder={customers.length ? 'Select customer…' : 'Loading customers…'}
                    value={customerId}
                    onChange={(v) => setCustomerId(val(v))}
                  />
                ) : (
                  <>
                    <Input
                      label="Name *"
                      value={walkIn.name}
                      onChange={(e) => setWalkIn((w) => ({ ...w, name: val(e) }))}
                    />
                    <Input
                      label="Email"
                      value={walkIn.email}
                      onChange={(e) => setWalkIn((w) => ({ ...w, email: val(e) }))}
                    />
                    <Input
                      label="Phone"
                      value={walkIn.phone}
                      onChange={(e) => setWalkIn((w) => ({ ...w, phone: val(e) }))}
                    />
                    <Input
                      label="TIN"
                      value={walkIn.tin}
                      onChange={(e) => setWalkIn((w) => ({ ...w, tin: val(e) }))}
                    />
                    <Input
                      label="Address"
                      value={walkIn.address}
                      onChange={(e) => setWalkIn((w) => ({ ...w, address: val(e) }))}
                    />
                    <Input
                      label="State code"
                      placeholder="e.g. LA"
                      value={walkIn.stateCode}
                      onChange={(e) => setWalkIn((w) => ({ ...w, stateCode: val(e) }))}
                    />
                  </>
                )}
              </FieldSet>
            </div>
          )}
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  The page                                                           */
/* ------------------------------------------------------------------ */
export default function InvoiceDetails({
  leaf,
  moduleLabel,
  parentLabel,
  invoiceId,
  onNavigate,
  onBack,
}) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label || 'Invoice Details'].filter(Boolean)

  const [invoice, setInvoice] = useState(null)
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('view') // view | issue | edit | payment | delivery | credit | void
  const [reverseTarget, setReverseTarget] = useState(null)
  const [reversing, setReversing] = useState(false)

  const load = useCallback(async () => {
    if (!invoiceId) return
    setLoading(true)
    try {
      const [inv, dels] = await Promise.all([
        invoiceApi.getInvoice(invoiceId),
        invoiceApi.listInvoiceDeliveries(invoiceId).catch(() => ({ data: [] })),
      ])
      setInvoice(inv?.data || null)
      setDeliveries(dels?.data || [])
    } catch (e) {
      showToast('Could not load invoice', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [invoiceId, showToast])

  useEffect(() => {
    setMode('view')
    load()
  }, [load])

  const afterAction = () => {
    setMode('view')
    load()
  }

  function goBack() {
    if (onBack) return onBack()
    const customerId = invoice?.buyer?.customer?.id
    if (onNavigate && customerId) {
      return onNavigate({
        id: 'customerproducthistory',
        view: 'customerproducthistory',
        label: 'Customer Payment History',
        param: { customerId },
      })
    }
    window.history.back()
  }

  function openInvoice(id) {
    if (!id || !onNavigate) return
    onNavigate({
      id: 'invoicedetails',
      view: 'invoicedetails',
      label: 'Invoice Details',
      param: { invoiceId: id },
    })
  }

  async function reversePayment(reason) {
    if (!reverseTarget) return
    setReversing(true)
    try {
      await invoiceApi.reversePaymentForInvoice(invoice.id, reverseTarget.id, reason)
      showToast('Payment reversed', `${money(reverseTarget.amount || 0)} was reversed.`)
      setReverseTarget(null)
      await load()
    } catch (e) {
      showToast('Could not reverse payment', e.message, true)
    } finally {
      setReversing(false)
    }
  }

  // ── no invoice chosen ───────────────────────────────────
  if (!invoiceId) {
    return (
      <FormShell
        wide
        crumbs={crumbs}
        title="Invoice details"
        icon="file-text"
        submitLabel={null}
        onCancel={goBack}
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={goBack}>
            Back
          </Button>
        }
      >
        <Panel title="No invoice selected">
          <Callout tone="warning" icon="circle-alert">
            Open this page from an invoice to see its details.
          </Callout>
        </Panel>
      </FormShell>
    )
  }

  if (!invoice) {
    return (
      <>
        {loading && <Loader overlay label="Loading invoice…" />}
        <FormShell
          wide
          crumbs={crumbs}
          title="Invoice details"
          icon="file-text"
          submitLabel={null}
          onCancel={goBack}
          headerActions={
            <Button variant="ghost" iconLeft="arrow-left" onClick={goBack}>
              Back
            </Button>
          }
        >
          <Panel title="Details">
            <div style={{ color: 'var(--text-muted)', padding: 12 }}>
              {loading ? 'Loading…' : 'This invoice could not be loaded.'}
            </div>
          </Panel>
        </FormShell>
      </>
    )
  }

  // ── sub-forms ───────────────────────────────────────────
  const toView = () => setMode('view')
  if (mode === 'issue' || mode === 'edit') {
    return (
      <HeaderForm
        kind={mode}
        invoice={invoice}
        crumbs={crumbs}
        onBack={toView}
        onDone={afterAction}
      />
    )
  }
  if (mode === 'payment') {
    return <PaymentForm invoice={invoice} crumbs={crumbs} onBack={toView} onDone={afterAction} />
  }
  if (mode === 'delivery') {
    return <DeliveryForm invoice={invoice} crumbs={crumbs} onBack={toView} onDone={afterAction} />
  }
  if (mode === 'credit') {
    return <CreditNoteForm invoice={invoice} crumbs={crumbs} onBack={toView} onDone={afterAction} />
  }
  if (mode === 'void') {
    return <VoidForm invoice={invoice} crumbs={crumbs} onBack={toView} onDone={afterAction} />
  }

  // ── read-only view ──────────────────────────────────────
  const status = normStatus(invoice.status)
  const isDraft = status === 'DRAFT'
  const isVoided = !!invoice.voidedAt || status.includes('VOID')
  const totals = invoice.totals || {}
  const buyer = invoice.buyer || {}
  const linked = invoice.linked || {}
  const balance = Number(totals.balance) || 0
  const nothingPaidOrCredited =
    !(Number(totals.paid) > 0) &&
    !(Number(totals.credited) > 0) &&
    !(Number(totals.pendingConfirmation) > 0)

  const canPay = !isDraft && !isVoided && balance > 0
  const canCredit = !isDraft && !isVoided
  const canSend = !isDraft && !isVoided
  const canVoid = !isDraft && !isVoided && nothingPaidOrCredited

  return (
    <>
      {(loading || reversing) && (
        <Loader overlay label={reversing ? 'Reversing payment…' : 'Loading invoice…'} />
      )}
      {reverseTarget && (
        <ReasonModal
          title="Reverse this payment"
          description={`${money(reverseTarget.amount || 0)} via ${
            reverseTarget.methodLabel || pretty(reverseTarget.method)
          }. Only payments still awaiting confirmation can be reversed.`}
          label="Reason *"
          confirmLabel="Reverse payment"
          busy={reversing}
          onConfirm={reversePayment}
          onCancel={() => setReverseTarget(null)}
        />
      )}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Invoice ${invoice.number || '(draft)'} — ${buyer.name || buyer.customer?.name || '—'}`}
        icon="file-text"
        description={`${invoice.showroom?.name || '—'} · ${pretty(invoice.invoiceKind) || 'Invoice'}`}
        submitLabel={null}
        onCancel={goBack}
        headerActions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button variant="secondary" iconLeft="rotate-cw" onClick={load}>
              Refresh
            </Button>
            {isDraft && (
              <Button variant="secondary" iconLeft="pencil" onClick={() => setMode('edit')}>
                Edit
              </Button>
            )}
            {isDraft && (
              <Button iconLeft="file-text" onClick={() => setMode('issue')}>
                Issue invoice
              </Button>
            )}
            {canPay && (
              <Button iconLeft="banknote" onClick={() => setMode('payment')}>
                Record payment
              </Button>
            )}
            {canSend && (
              <Button variant="secondary" iconLeft="mail" onClick={() => setMode('delivery')}>
                Email
              </Button>
            )}
            {canCredit && (
              <Button variant="secondary" iconLeft="file-minus" onClick={() => setMode('credit')}>
                Credit note
              </Button>
            )}
            {canVoid && (
              <Button variant="secondary" iconLeft="ban" onClick={() => setMode('void')}>
                Void
              </Button>
            )}
            <Button variant="ghost" iconLeft="arrow-left" onClick={goBack}>
              Back
            </Button>
          </div>
        }
        aside={
          <Panel title="Totals">
            <MetaRow
              label="Status"
              value={
                <Badge tone={invoiceTone(invoice.displayStatus || invoice.status)}>
                  {invoice.displayStatus || pretty(invoice.status)}
                </Badge>
              }
            />
            <MetaRow label="Subtotal" value={money(totals.lineExtension || 0)} mono />
            <MetaRow
              label="Discount"
              value={(totals.discount || 0) > 0 ? `− ${money(totals.discount)}` : '—'}
              mono
            />
            <MetaRow
              label={`VAT${invoice.vat?.enabled ? ` (${((invoice.vat.rate || 0) * 100).toFixed(1)}%)` : ''}`}
              value={money(totals.vat || 0)}
              mono
            />
            <MetaRow label="Total" value={money(totals.total || 0)} mono />
            <MetaRow label="Paid" value={money(totals.paid || 0)} mono />
            <MetaRow label="Credited" value={money(totals.credited || 0)} mono />
            {(totals.pendingConfirmation || 0) > 0 && (
              <MetaRow label="Pending confirmation" value={money(totals.pendingConfirmation)} mono />
            )}
            <MetaRow
              label="Balance"
              value={money(balance)}
              mono
              tone={balance > 0 ? 'negative' : undefined}
            />
          </Panel>
        }
      >
        {isDraft && (
          <Callout
            tone="info"
            icon="circle-alert"
            title="This invoice is still a draft"
            style={{ marginBottom: 14 }}
          >
            It has not been issued to the customer yet. Edit its dates and terms, or issue it.
          </Callout>
        )}

        {!isDraft && !isVoided && !nothingPaidOrCredited && (
          <Callout
            tone="info"
            icon="circle-alert"
            title="This invoice can no longer be voided"
            style={{ marginBottom: 14 }}
          >
            Payments or credit notes exist against it. Issue a credit note to correct it instead.
          </Callout>
        )}

        {(linked.replacedBy || linked.reissueOf) && (
          <Callout
            tone="info"
            icon="link"
            title={linked.replacedBy ? 'This invoice was replaced' : 'Reissued invoice'}
            style={{ marginBottom: 14 }}
          >
            {linked.replacedBy ? (
              <>
                Replaced by{' '}
                <button
                  type="button"
                  style={{ ...smallButtonStyle, marginLeft: 6 }}
                  onClick={() => openInvoice(linked.replacedBy.id)}
                >
                  {linked.replacedBy.number}
                </button>
              </>
            ) : (
              <>
                Reissued from{' '}
                <button
                  type="button"
                  style={{ ...smallButtonStyle, marginLeft: 6 }}
                  onClick={() => openInvoice(linked.reissueOf.id)}
                >
                  {linked.reissueOf.number}
                </button>
              </>
            )}
          </Callout>
        )}

        <Panel title="Invoice">
          <FieldSet columns={2}>
            <MetaRow label="Number" value={invoice.number || '—'} mono />
            <MetaRow label="Kind" value={pretty(invoice.invoiceKind) || '—'} />
            <MetaRow label="Issue date" value={dateOf(invoice.issueDate)} />
            <MetaRow label="Due date" value={dateOf(invoice.dueDate)} />
            <MetaRow
              label="Payment terms"
              value={invoice.paymentTermsDays != null ? `${invoice.paymentTermsDays} days` : '—'}
            />
            <MetaRow
              label="Days overdue"
              value={invoice.daysOverdue > 0 ? String(invoice.daysOverdue) : '—'}
              mono
            />
            <MetaRow label="Issued by" value={invoice.issuedBy?.name || '—'} />
            <MetaRow label="Issued at" value={dateOf(invoice.issuedAt)} />
            <MetaRow label="Showroom" value={invoice.showroom?.name || '—'} />
            <MetaRow label="Source" value={linked.sourceRef || pretty(linked.sourceType) || '—'} />
            <MetaRow label="Pro-forma" value={linked.proForma || '—'} />
            <MetaRow label="Terms note" value={invoice.paymentTermsNote || '—'} />
          </FieldSet>
        </Panel>

        <Panel title="Buyer">
          <FieldSet columns={2}>
            <MetaRow label="Name" value={buyer.name || '—'} />
            <MetaRow label="Code" value={buyer.code || buyer.customer?.code || '—'} mono />
            <MetaRow label="Email" value={buyer.email || '—'} />
            <MetaRow label="Phone" value={buyer.phone || '—'} />
            <MetaRow label="TIN" value={buyer.tin || '—'} mono />
            <MetaRow label="Address" value={buyer.address || '—'} />
          </FieldSet>
        </Panel>

        <Panel title="Line items" padding={0}>
          <div style={{ padding: '8px 16px 16px' }}>
            <GridTable
              template="minmax(200px, 2fr) 90px 80px 130px 120px 120px 140px"
              headers={[
                { label: 'Product' },
                { label: 'Qty', align: 'right', mono: true },
                { label: 'Unit' },
                { label: 'Unit price', align: 'right', mono: true },
                { label: 'Discount', align: 'right', mono: true },
                { label: 'VAT', align: 'right', mono: true },
                { label: 'Line total', align: 'right', mono: true },
              ]}
              empty="No lines on this invoice."
              rows={(invoice.lines || []).map((l) => [
                l.name || l.stockItem?.name || '—',
                fmt(l.quantity || 0),
                l.unit || '—',
                money(l.unitPrice || 0),
                l.discountAmount ? `− ${money(l.discountAmount)}` : '—',
                money(l.vatAmount || 0),
                money(l.lineTotal || 0),
              ])}
            />
          </div>
        </Panel>

        <Panel title="Payments" padding={0}>
          <div style={{ padding: '8px 16px 16px' }}>
            <GridTable
              template="130px minmax(150px, 1.5fr) 140px 150px minmax(120px, 1fr) 120px"
              headers={[
                { label: 'Date' },
                { label: 'Method' },
                { label: 'Amount', align: 'right', mono: true },
                { label: 'Status' },
                { label: 'Receipt', mono: true },
                { label: '' },
              ]}
              empty="No payments against this invoice."
              rows={(linked.payments || []).map((p) => [
                dateOf(p.date),
                p.methodLabel || pretty(p.method),
                money(p.amount || 0),
                <span key="s">
                  {pretty(p.status) || '—'}
                  {p.reversalReason ? ` — ${p.reversalReason}` : ''}
                </span>,
                p.receipt?.code || '—',
                normStatus(p.status) === 'PENDING' && !isVoided ? (
                  <button
                    key="r"
                    type="button"
                    style={smallButtonStyle}
                    onClick={() => setReverseTarget(p)}
                  >
                    Reverse
                  </button>
                ) : (
                  ''
                ),
              ])}
            />
          </div>
        </Panel>

        {(linked.creditNotes || []).length > 0 && (
          <Panel title="Credit notes" padding={0}>
            <div style={{ padding: '8px 16px 16px' }}>
              <GridTable
                template="minmax(140px, 1fr) 130px minmax(200px, 2fr) 140px 150px 150px"
                headers={[
                  { label: 'Number', mono: true },
                  { label: 'Issued' },
                  { label: 'Reason' },
                  { label: 'Total', align: 'right', mono: true },
                  { label: 'Applied', align: 'right', mono: true },
                  { label: 'Refunded', align: 'right', mono: true },
                ]}
                rows={linked.creditNotes.map((c) => [
                  c.number || '—',
                  dateOf(c.issuedAt),
                  pretty(c.reason) || '—',
                  money(c.total || 0),
                  money(c.appliedToInvoice || 0),
                  money(c.excessRefunded || 0),
                ])}
              />
            </div>
          </Panel>
        )}

        <Panel title="Email deliveries" padding={0}>
          <div style={{ padding: '8px 16px 16px' }}>
            <GridTable
              template="minmax(200px, 2fr) 150px 130px 140px 140px minmax(140px, 1fr)"
              headers={[
                { label: 'Recipient' },
                { label: 'Template' },
                { label: 'Trigger' },
                { label: 'Status' },
                { label: 'Requested' },
                { label: 'By' },
              ]}
              empty="This invoice has not been emailed."
              rows={deliveries.map((d) => [
                d.recipient || '—',
                pretty(d.template) || '—',
                pretty(d.trigger) || '—',
                <Badge key="s" tone={normStatus(d.status).includes('FAIL') ? 'danger' : 'neutral'}>
                  {pretty(d.status) || '—'}
                </Badge>,
                dateOf(d.requestedAt),
                d.requestedBy?.name || '—',
              ])}
            />
          </div>
        </Panel>

        {(invoice.regulatory?.irn || invoice.regulatory?.nrsSubmissionStatus) && (
          <Panel title="Regulatory">
            <FieldSet columns={2}>
              <MetaRow label="IRN" value={invoice.regulatory.irn || '—'} mono />
              <MetaRow
                label="Submission status"
                value={pretty(invoice.regulatory.nrsSubmissionStatus) || '—'}
              />
              <MetaRow
                label="Stamp ID"
                value={invoice.regulatory.cryptographicStampId || '—'}
                mono
              />
              <MetaRow
                label="Access point"
                value={pretty(invoice.regulatory.accessPointSubmission) || '—'}
              />
            </FieldSet>
          </Panel>
        )}

        {isVoided && (
          <Callout tone="danger" icon="ban" title="Invoice voided">
            {invoice.voidReason || 'No reason recorded.'}
            {invoice.voidedBy?.name ? ` — ${invoice.voidedBy.name}` : ''}
            {invoice.voidedAt ? ` · ${fmtDate(invoice.voidedAt)}` : ''}
          </Callout>
        )}
      </FormShell>
    </>
  )
}