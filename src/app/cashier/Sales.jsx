import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../../ds/components/core/Badge.jsx'
import { Button } from '../../ds/components/core/Button.jsx'
import { Input } from '../../ds/components/forms/Input.jsx'
import { Select } from '../../ds/components/forms/Select.jsx'
import Loader from '../../ds/components/core/Loader.jsx'
import { RegisterShell } from '../shells/RegisterShell.jsx'
import { FormShell } from '../shells/FormShell.jsx'
import { Panel, FieldSet, MetaRow, Callout } from '../shells/Page.jsx'
import { useStore } from '../store.jsx'
import { fmt, money, moneyShort, fmtDate } from '../utils.js'
import CashierApi from '../../api/CashierApi.js'
import CustomerApi from '../../api/CustomerApi.js'
import ShowroomApi from '../../api/ShowroomApi.js'

import TenantApi from '../../api/TenantApi.js'
import AccountApi from '../../api/AccountApi.js'
// Adjust the path/casing if your invoice api file is named differently
import InvoiceApi from '../../api/InvoiceApi.js'
// Adjust the path if TillSessions.jsx is not a sibling of this file
import { OpenTillPanel, isNoTillError } from './TillSessions.jsx'

const cashierApi = new CashierApi()
const customerApi = new CustomerApi()
const showroomApi = new ShowroomApi()
const tenantApi = new TenantApi()
const accountApi = new AccountApi()
const invoiceApi = new InvoiceApi()

const PAGE_SIZE = 20

/* ------------------------------------------------------------------ */
/*  Status maps                                                        */
/* ------------------------------------------------------------------ */
const STATUS_CONFIG = {
  OPEN: { label: 'Open', tone: 'warning' },
  DRAFT: { label: 'Draft', tone: 'neutral' },
  IN_PROGRESS: { label: 'In progress', tone: 'warning' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  VOIDED: { label: 'Voided', tone: 'danger' },
  VOID: { label: 'Voided', tone: 'danger' },
  ABANDONED: { label: 'Abandoned', tone: 'neutral' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
}

// Anything not in this list is treated as an open (editable) sale
const CLOSED_STATUSES = ['COMPLETED', 'VOIDED', 'VOID', 'ABANDONED', 'CANCELLED']

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'Completed (default)' },
  { value: 'OPEN', label: 'Open' },
  { value: 'VOIDED', label: 'Voided' },
  { value: 'ABANDONED', label: 'Abandoned' },
]

const normStatus = (s) => String(s || '').toUpperCase()
const isOpenStatus = (s) => !CLOSED_STATUSES.includes(normStatus(s))

const pretty = (s) =>
  String(s || '')
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

const statusOf = (s) =>
  STATUS_CONFIG[normStatus(s)] || {
    label: pretty(s) || '—',
    tone: 'neutral',
  }

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function val(payload) {
  if (payload == null) return payload
  if (typeof payload === 'object') {
    if (payload.target && 'value' in payload.target) return payload.target.value
    if ('value' in payload) return payload.value
  }
  return payload
}

const uid = () => Math.random().toString(36).slice(2)
const isCash = (m) => String(m || '').toUpperCase().includes('CASH')
const round2 = (n) => Math.round(n * 100) / 100

// Dropdown option for a customer: CODE · Name — phone — contact person
const customerOption = (c) => ({
  value: c.id,
  label: [`${c.code} · ${c.name}`, c.phone, c.contactPerson]
    .filter(Boolean)
    .join(' — '),
})

const todayIso = () => new Date().toISOString().slice(0, 10)

// iso date (YYYY-MM-DD) + n days -> iso date
const addDays = (iso, n) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  d.setUTCDate(d.getUTCDate() + (Number(n) || 0))
  return d.toISOString().slice(0, 10)
}

const fmtDateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
}

const linesToCart = (lines = []) =>
  lines.map((l) => ({
    key: uid(),
    stockItemId: l.stockItem?.id,
    name: l.name || l.stockItem?.name || '—',
    code: l.code || l.stockItem?.code || '',
    unit: l.unit || '',
    price: Number(l.unitPrice) || 0,
    quantity: String(l.quantity ?? ''),
  }))

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

/* ------------------------------------------------------------------ */
/*  Small shared pieces                                                */
/* ------------------------------------------------------------------ */
function CheckRow({ checked, onChange, label, hint }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        cursor: 'pointer',
        font: 'var(--type-body)',
        color: 'var(--text-strong)',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: 3, width: 16, height: 16, cursor: 'pointer' }}
      />
      <span>
        {label}
        {hint && (
          <span
            style={{
              display: 'block',
              font: 'var(--type-caption)',
              color: 'var(--text-muted)',
              marginTop: 2,
            }}
          >
            {hint}
          </span>
        )}
      </span>
    </label>
  )
}

// Type-to-filter dropdown. `options`: [{ value, label }]. `emptyLabel` adds a
// first "no selection" row that sets the value to ''.
// If `onQueryChange` is given, filtering is done by the caller (e.g. a server
// search) and `options` are shown as-is. The list is rendered in a portal with
// fixed positioning so it is never clipped by a card's overflow.
function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search…',
  emptyLabel,
  onQueryChange,
  loading = false,
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(null)
  const [rect, setRect] = useState(null)
  const inputRef = useRef(null)

  const selected = options.find((o) => o.value === value) || (picked?.value === value ? picked : null)
  const q = query.trim().toLowerCase()
  const filtered = (onQueryChange || !q
    ? options
    : options.filter((o) => String(o.label).toLowerCase().includes(q))
  ).slice(0, 50)

  function measure() {
    if (inputRef.current) setRect(inputRef.current.getBoundingClientRect())
  }

  useEffect(() => {
    if (!open) return
    measure()
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [open])

  function pick(o) {
    setPicked(o)
    onChange(o ? o.value : '')
    setQuery('')
    onQueryChange?.('')
    setOpen(false)
  }

  const rowStyle = {
    padding: '9px 12px',
    cursor: 'pointer',
    font: 'var(--type-body)',
    color: 'var(--text-strong)',
  }

  const spaceBelow = rect ? window.innerHeight - rect.bottom : 0
  const flipUp = rect && spaceBelow < 200 && rect.top > spaceBelow
  const maxH = rect
    ? Math.max(120, Math.min(260, (flipUp ? rect.top : spaceBelow) - 16))
    : 260

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
      <input
        ref={inputRef}
        type="text"
        value={open ? query : selected?.label || ''}
        placeholder={selected?.label || emptyLabel || placeholder}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setQuery(e.target.value)
          onQueryChange?.(e.target.value)
          setOpen(true)
        }}
        style={{
          width: '100%',
          height: 'var(--field-h)',
          padding: '0 12px',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-control)',
          font: 'var(--fw-regular) var(--text-sm)/1 var(--font-ui)',
          color: 'var(--text-strong)',
          outline: 'none',
        }}
      />
      {open &&
        rect &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              zIndex: 10000,
              left: rect.left,
              width: rect.width,
              ...(flipUp
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
              maxHeight: maxH,
              overflowY: 'auto',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-control)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            {emptyLabel && (
              <div
                style={{ ...rowStyle, color: 'var(--text-muted)' }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(null)
                }}
              >
                {emptyLabel}
              </div>
            )}
            {filtered.map((o) => (
              <div
                key={o.value}
                style={{
                  ...rowStyle,
                  background:
                    o.value === value ? 'var(--brand-subtle)' : undefined,
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  pick(o)
                }}
              >
                {o.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  ...rowStyle,
                  color: 'var(--text-muted)',
                  cursor: 'default',
                }}
              >
                {loading ? 'Searching…' : 'No matches.'}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

// Simple CSS-grid table. headers: [{ label, align, mono }], rows: node[][]
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
          <div style={{ padding: '14px 0', color: 'var(--text-muted)' }}>
            {empty}
          </div>
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

/* ------------------------------------------------------------------ */
/*  New sale — check till, optionally pick a customer, start a cart    */
/* ------------------------------------------------------------------ */
function NewSaleForm({ crumbs, customers, onBack, onCreated }) {
  const { showToast } = useStore()
  const [customerId, setCustomerId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Customer search (server-side, by name)
  const [custQuery, setCustQuery] = useState('')
  const [custOptions, setCustOptions] = useState(customers)
  const [custSearching, setCustSearching] = useState(false)

  useEffect(() => {
    if (!custQuery.trim()) setCustOptions(customers)
  }, [customers, custQuery])

  useEffect(() => {
    const term = custQuery.trim()
    if (!term) return
    let cancelled = false
    const t = setTimeout(async () => {
      setCustSearching(true)
      try {
        const res = await customerApi.listCustomers({ name: term, page: 0, size: 50 })
        if (!cancelled) setCustOptions((res.data?.items || []).map(customerOption))
      } catch {
        if (!cancelled) setCustOptions([])
      } finally {
        if (!cancelled) setCustSearching(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [custQuery])

  // Till state: 'checking' | 'choose' | 'open' | 'closing' | 'none'
  //  choose  = a till is open; ask whether to continue with it or close it
  //  open    = continuing with the current till; pick a customer
  //  closing = counting cash to close the current till
  //  none    = no open till; show the open-till panel
  const [tillState, setTillState] = useState('checking')
  const [till, setTill] = useState(null)
  const [justClosed, setJustClosed] = useState(false)

  // Close-till form
  const [countedCash, setCountedCash] = useState('')
  const [closeNote, setCloseNote] = useState('')
  const [closingBusy, setClosingBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    cashierApi
      .getCurrentCashierTillSession()
      .then((res) => {
        if (cancelled) return
        const s = res?.data || null
        const isOpenSession = s && String(s.status).toUpperCase() === 'OPEN'
        setTill(isOpenSession ? s : null)
        setTillState(isOpenSession ? 'choose' : 'none')
      })
      .catch((e) => {
        if (cancelled) return
        if (isNoTillError(e)) {
          setTillState('none')
        } else {
          // Unknown failure: don't block; createSale will surface the real error
          showToast('Could not check your till', e.message, true)
          setTillState('open')
        }
      })
    return () => {
      cancelled = true
    }
  }, [showToast])

  async function submit() {
    if (submitting || tillState !== 'open') return
    setSubmitting(true)
    try {
      // Customer is optional — send null for a sale with no customer
      const res = await cashierApi.createSale(customerId || null)
      showToast('Sale started', 'Add products to the cart to continue.')
      onCreated(res.data)
    } catch (e) {
      // Till was closed/force-closed since we checked
      if (isNoTillError(e)) {
        setTill(null)
        setTillState('none')
        showToast('No open till', 'Open a till session to start selling.', true)
      } else {
        showToast('Could not start sale', e.message, true)
      }
    } finally {
      setSubmitting(false)
    }
  }

  /* ---- close till ---- */
  const expected = Number(till?.running?.expectedCashNow) || 0
  const counted = Number(countedCash)
  const variance =
    countedCash === '' || Number.isNaN(counted)
      ? null
      : Math.round((counted - expected) * 100) / 100

  const closeMissing = []
  if (countedCash === '' || Number.isNaN(counted) || counted < 0) closeMissing.push('Counted cash')
  if (variance != null && variance !== 0 && !closeNote.trim()) {
    closeMissing.push('A note explaining the variance')
  }
  const canClose = closeMissing.length === 0 && !closingBusy && !!till?.id

  async function closeTill() {
    if (!canClose) return
    setClosingBusy(true)
    try {
      await cashierApi.closeCashierTillSession(till.id, {
        countedCash: counted,
        note: closeNote.trim(),
      })
      showToast('Till closed', 'The session has been closed and reconciled.')
      setTill(null)
      setCountedCash('')
      setCloseNote('')
      setJustClosed(true)
      setTillState('none')
    } catch (e) {
      showToast('Could not close till', e.message, true)
    } finally {
      setClosingBusy(false)
    }
  }

  const tillLabel = till?.till?.name || till?.till?.code
  const running = till?.running || {}

  return (
    <>
      {(submitting || closingBusy || tillState === 'checking') && (
        <Loader
          overlay
          label={
            submitting
              ? 'Starting sale…'
              : closingBusy
                ? 'Closing till…'
                : 'Checking your till…'
          }
        />
      )}
      <FormShell
        crumbs={crumbs}
        title="New sale"
        icon="shopping-cart"
        description="Start a sale on your open till. Picking a customer is optional — prices and credit limits depend on who is buying."
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel="Start sale"
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={submitting || tillState !== 'open'}
        note="A sale can only be started if you have an open till. No stock or money is touched until the sale is completed."
      >
        {tillState === 'none' && (
          <>
            <Callout
              tone={justClosed ? 'info' : 'warning'}
              icon="circle-alert"
              title={justClosed ? 'Till closed' : "You don't have an open till"}
              style={{ marginBottom: 14 }}
            >
              {justClosed
                ? 'Open a new till session below to keep selling.'
                : 'Open a till session below, then start selling.'}
            </Callout>
            <OpenTillPanel
              onOpened={(session) => {
                setTill(session)
                setJustClosed(false)
                // A fresh till was just opened on purpose, so go straight to the customer picker
                setTillState('open')
              }}
            />
          </>
        )}

        {tillState === 'choose' && till && (
          <Panel
            title="You already have a till open"
            description="Keep selling on it, or close it with a cash count and open a new one."
          >
            <FieldSet columns={2}>
              <MetaRow label="Till" value={tillLabel || '—'} />
              <MetaRow label="Showroom" value={till.location?.name || '—'} />
              <MetaRow label="Opened" value={fmtDateTime(till.openedAt)} />
              <MetaRow label="Opening float" value={money(till.openingFloat || 0)} mono />
              <MetaRow label="Sales so far" value={fmt(running.salesCount || 0)} mono />
              <MetaRow label="Expected cash now" value={money(expected)} mono />
            </FieldSet>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
              <Button iconLeft="arrow-right" onClick={() => setTillState('open')}>
                Continue with this till
              </Button>
              <Button
                variant="secondary"
                iconLeft="lock"
                onClick={() => setTillState('closing')}
              >
                Close till and open a new one
              </Button>
            </div>
          </Panel>
        )}

        {tillState === 'closing' && till && (
          <>
            {closeMissing.length > 0 && (
              <Callout
                tone="warning"
                icon="circle-alert"
                title="Complete these fields to close the till"
                style={{ marginBottom: 14 }}
              >
                {closeMissing.join(' · ')}
              </Callout>
            )}
            <Panel
              title={`Close ${tillLabel || 'till'}`}
              description="Count the cash in the drawer and enter it below. The difference from the expected amount is recorded as the variance."
            >
              <FieldSet columns={2}>
                <MetaRow label="Opening float" value={money(till.openingFloat || 0)} mono />
                <MetaRow label="Cash taken" value={money(running.cashTaken || 0)} mono />
                <MetaRow label="Expected cash" value={money(expected)} mono />
                <MetaRow
                  label="Variance"
                  value={
                    variance == null
                      ? '—'
                      : variance === 0
                        ? money(0)
                        : `${variance > 0 ? '+' : '−'} ${money(Math.abs(variance))}`
                  }
                  mono
                  tone={variance ? 'negative' : undefined}
                />
              </FieldSet>
              <div style={{ width: 240, marginTop: 16 }}>
                <Input
                  label="Counted cash (₦) *"
                  type="number"
                  placeholder="0.00"
                  value={countedCash}
                  onChange={(e) => setCountedCash(val(e))}
                  hint={`Expected: ${money(expected)}`}
                />
              </div>
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    font: 'var(--type-caption)',
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  Note (required when the counted cash doesn't match what was expected)
                </div>
                <textarea
                  rows={3}
                  placeholder="e.g. Short by ₦500 — change given in error."
                  value={closeNote}
                  onChange={(e) => setCloseNote(e.target.value)}
                  style={textareaStyle}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
                <Button iconLeft="lock" onClick={closeTill} disabled={!canClose}>
                  Close till
                </Button>
                <Button variant="ghost" onClick={() => setTillState('choose')} disabled={closingBusy}>
                  Cancel
                </Button>
              </div>
            </Panel>
          </>
        )}

        {tillState === 'open' && (
          <Panel
            title="Customer (optional)"
            description={
              tillLabel
                ? `Who is buying, if you want to record it. Selling on ${tillLabel}${
                    till?.location?.name ? ` · ${till.location.name}` : ''
                  }.`
                : 'Who is buying, if you want to record it.'
            }
          >
            <FieldSet columns={2}>
              <SearchableSelect
                label="Customer"
                options={custOptions}
                value={customerId}
                onChange={setCustomerId}
                onQueryChange={setCustQuery}
                loading={custSearching}
                placeholder="Search by name, phone or contact person…"
                emptyLabel="No customer"
              />
            </FieldSet>
            {till?.id && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
                  Done for the day, or want a fresh till session?
                </div>
                <Button variant="secondary" iconLeft="lock" onClick={() => setTillState('closing')}>
                  Close this till
                </Button>
              </div>
            )}
          </Panel>
        )}
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Checkout — build the cart, take payment, complete                  */
/* ------------------------------------------------------------------ */
function SaleCheckout({ sale, crumbs, onBack, onSaleChange, onCompleted, onAbandon }) {
  const { showToast } = useStore()

  const customerId = sale.customer?.customer?.id
  const locationId = sale.location?.id

  /* ---- cart ---- */
  const [cart, setCart] = useState(() => linesToCart(sale.lines))
  const [busy, setBusy] = useState(false)

  // Re-sync with the server copy whenever the sale version changes
  useEffect(() => {
    setCart(linesToCart(sale.lines))
  }, [sale.id, sale.version]) // eslint-disable-line react-hooks/exhaustive-deps

  const cartSig = cart
    .filter((c) => Number(c.quantity) > 0)
    .map((c) => `${c.stockItemId}:${Number(c.quantity)}`)
    .join('|')
  const saleSig = (sale.lines || [])
    .map((l) => `${l.stockItem?.id}:${Number(l.quantity)}`)
    .join('|')
  const cartDirty = cartSig !== saleSig
  const cartLineCount = cart.filter((c) => Number(c.quantity) > 0).length

  /* ---- catalogue ---- */
  const [search, setSearch] = useState('')
  const [catalogue, setCatalogue] = useState([])
  const [catLoading, setCatLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const t = setTimeout(async () => {
      setCatLoading(true)
      try {
        const q = { page: 0, size: 20, customerId, locationId }
        if (search.trim()) q.q = search.trim()
        const res = await cashierApi.getShowroomCatalogue(q)
        if (!cancelled) setCatalogue(res?.data?.items || [])
      } catch (e) {
        if (!cancelled) showToast('Could not load catalogue', e.message, true)
      } finally {
        if (!cancelled) setCatLoading(false)
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [search, customerId, locationId, showToast])

  function addToCart(item) {
    const id = item.stockItem?.id
    if (!id) return
    setCart((cs) => {
      const i = cs.findIndex((c) => c.stockItemId === id)
      if (i >= 0) {
        return cs.map((c, ci) =>
          ci === i ? { ...c, quantity: String((Number(c.quantity) || 0) + 1) } : c
        )
      }
      return [
        ...cs,
        {
          key: uid(),
          stockItemId: id,
          name: item.name || item.stockItem?.name,
          code: item.code || item.stockItem?.code || '',
          unit: item.unit || '',
          price: Number(item.price) || 0,
          quantity: '1',
        },
      ]
    })
  }

  function setQty(i, value) {
    setCart((cs) => cs.map((c, ci) => (ci === i ? { ...c, quantity: value } : c)))
  }

  function removeFromCart(i) {
    setCart((cs) => cs.filter((_, ci) => ci !== i))
  }

  async function saveCart() {
    const lines = cart
      .filter((c) => c.stockItemId && Number(c.quantity) > 0)
      .map((c) => ({ stockItemId: c.stockItemId, quantity: Number(c.quantity) }))
    if (!lines.length) {
      return showToast('Empty cart', 'Add at least one product with a quantity.', true)
    }
    setBusy(true)
    try {
      const res = await cashierApi.replaceSalesLines(sale.id, {
        version: sale.version,
        lines,
      })
      onSaleChange(res.data)
      showToast('Cart saved', 'Prices have been refreshed from the price list.')
    } catch (e) {
      showToast('Could not save cart', e.message, true)
    } finally {
      setBusy(false)
    }
  }

  /* ---- load from pro-forma ---- */
  const [proformas, setProformas] = useState([])
  const [proformaId, setProformaId] = useState('')

  useEffect(() => {
    if (!customerId) return
    let cancelled = false
    cashierApi
      .listProformasQuotations({ status: 'SENT', customerId, page: 0, size: 50 })
      .then((res) => !cancelled && setProformas(res?.data?.items || []))
      .catch(() => !cancelled && setProformas([]))
    return () => {
      cancelled = true
    }
  }, [customerId])

  async function loadProforma() {
    if (!proformaId) return
    setBusy(true)
    try {
      const res = await cashierApi.loadProformaforsale(sale.id, {
        proFormaId: proformaId,
        version: sale.version,
      })
      onSaleChange(res.data)
      setProformaId('')
      showToast('Pro-forma loaded', 'The quoted lines and prices are now in the cart.')
    } catch (e) {
      showToast('Could not load pro-forma', e.message, true)
    } finally {
      setBusy(false)
    }
  }

  /* ---- payments ---- */
  const methodOptions = (sale.allowedMethods?.length ? sale.allowedMethods : ['CASH']).map(
    (m) => ({ value: m, label: pretty(m) })
  )
  const blankPayment = () => ({
    id: uid(),
    method: methodOptions[0]?.value || 'CASH',
    amount: '',
    tendered: '',
    terminalRef: '',
    payerReference: '',
    receivingBankAccountId: '',
  })
  const [payments, setPayments] = useState(() => [blankPayment()])
  const [onAccount, setOnAccount] = useState('')
  const [creditOverrideReason, setCreditOverrideReason] = useState('')

  const [bankAccounts, setBankAccounts] = useState([])

  useEffect(() => {
    let cancelled = false
    accountApi
      .listBankAccounts({ status: 'ACTIVE' })
      .then((res) => {
        if (cancelled) return
        const d = res?.data
        setBankAccounts(Array.isArray(d) ? d : d?.items ?? [])
      })
      .catch(
        (e) => !cancelled && showToast('Could not load bank accounts', e.message, true)
      )
    return () => {
      cancelled = true
    }
  }, [showToast])

  // This showroom's own accounts first, then the rest
  const bankOptions = [
    { value: '', label: 'Select account…' },
    ...[...bankAccounts]
      .sort(
        (a, b) =>
          Number(b.location?.id === locationId) - Number(a.location?.id === locationId)
      )
      .map((b) => ({
        value: b.id,
        label: `${b.bankName} · ${b.accountNumberMasked || b.accountNumber} — ${b.accountName}${
          b.location?.name ? ` (${b.location.name})` : ''
        }`,
      })),
  ]

  function updatePayment(i, key, value) {
    setPayments((ps) => ps.map((p, pi) => (pi === i ? { ...p, [key]: value } : p)))
  }

  /* ---- supply ---- */
  const [supplyNow, setSupplyNow] = useState({}) // lineNo -> string
  const supplyOf = (l) => supplyNow[l.lineNo] ?? String(l.quantity ?? 0)

  /* ---- invoice ---- */
  const [issueInvoice, setIssueInvoice] = useState(false)
  const [buyer, setBuyer] = useState({
    name: sale.customerName || '',
    email: '',
    phone: '',
    tin: '',
    address: '',
    stateCode: '',
  })

  /* ---- totals / validation ---- */
  const total = Number(sale.totals?.total) || 0
  const paid = payments.reduce((n, p) => n + (Number(p.amount) || 0), 0)
  const onAcc = Number(onAccount) || 0
  const remaining = round2(total - paid - onAcc)
  const creditAvailable = Number(sale.customer?.creditAvailable) || 0
  const needsOverride =
    onAcc > 0 && (sale.customer?.overLimit || onAcc > creditAvailable)

  const overSupplied = (sale.lines || []).filter(
    (l) => (Number(supplyOf(l)) || 0) > (Number(l.available) || 0) && l.insufficient
  )

  const missing = []
  if (cartLineCount === 0) missing.push('At least one product in the cart')
  if (cartDirty) missing.push('Save cart changes')
  if (!cartDirty && total > 0 && remaining !== 0) {
    missing.push(
      remaining > 0
        ? `${money(remaining)} still to be paid or put on account`
        : `Payments exceed the total by ${money(Math.abs(remaining))}`
    )
  }
  if (needsOverride && !creditOverrideReason.trim()) missing.push('Credit override reason')
  if (issueInvoice && !buyer.name.trim()) missing.push('Invoice buyer name')
  overSupplied.forEach((l) => missing.push(`Stock for ${l.name}`))

  const [submitting, setSubmitting] = useState(false)
  const canComplete = missing.length === 0 && !submitting && !busy

  async function complete() {
    if (!canComplete) return
    setSubmitting(true)
    try {
      const body = {
        id: sale.id,
        version: sale.version,
        payments: payments
          .filter((p) => Number(p.amount) > 0)
          .map((p) => ({
            method: p.method,
            amount: Number(p.amount),
            tendered: isCash(p.method)
              ? Number(p.tendered) || Number(p.amount)
              : Number(p.amount),
            terminalRef: p.terminalRef.trim(),
            payerReference: p.payerReference.trim(),
            receivingBankAccountId: p.receivingBankAccountId.trim(),
          })),
        onAccount: onAcc,
        supply: (sale.lines || []).map((l) => ({
          lineNo: l.lineNo,
          supplyNow: Number(supplyOf(l)) || 0,
          fromLocationId: locationId,
        })),
        creditOverrideReason: creditOverrideReason.trim(),
        fromLocationId: locationId,
      }
      if (issueInvoice) {
        body.invoiceBuyer = {
          name: buyer.name.trim(),
          email: buyer.email.trim(),
          phone: buyer.phone.trim(),
          tin: buyer.tin.trim(),
          address: buyer.address.trim(),
          stateCode: buyer.stateCode.trim(),
        }
      }
      const res = await cashierApi.completeSale(sale.id, body)
      showToast('Sale completed', `${res?.data?.ref || sale.ref} has been recorded.`)
      onCompleted(res.data)
    } catch (e) {
      showToast('Could not complete sale', e.message, true)
    } finally {
      setSubmitting(false)
    }
  }

  const cashChange = payments.reduce((n, p) => {
    if (!isCash(p.method)) return n
    const t = Number(p.tendered) || 0
    const a = Number(p.amount) || 0
    return t > a ? n + (t - a) : n
  }, 0)

  return (
    <>
      {(busy || submitting) && (
        <Loader overlay label={submitting ? 'Completing sale…' : 'Updating cart…'} />
      )}
      <FormShell
        wide
        crumbs={crumbs}
        title={`Sale ${sale.ref || ''} — ${sale.customerName || sale.customer?.customer?.name || '—'}`}
        icon="shopping-cart"
        description={`${sale.location?.name || '—'} · Till ${sale.till?.name || sale.till?.code || '—'} · Version ${sale.version}`}
        headerActions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" iconLeft="trash-2" onClick={onAbandon}>
              Abandon sale
            </Button>
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to list
            </Button>
          </div>
        }
        submitLabel="Complete sale"
        onSubmit={complete}
        onCancel={onBack}
        submitDisabled={!canComplete}
        note="Completing the sale records the payments, takes stock out of the showroom and cannot be undone except by voiding within the void window."
        aside={
          <Panel title="Sale summary">
            <MetaRow label="Items" value={String(cartLineCount)} mono />
            <MetaRow label="Gross" value={money(sale.totals?.gross || 0)} mono />
            <MetaRow
              label="Line discounts"
              value={
                (sale.totals?.lineDiscounts || 0) > 0
                  ? `− ${money(sale.totals.lineDiscounts)}`
                  : '—'
              }
              mono
            />
            <MetaRow
              label="Instant discount"
              value={
                (sale.totals?.instantDiscount || 0) > 0
                  ? `− ${money(sale.totals.instantDiscount)}`
                  : '—'
              }
              mono
            />
            <MetaRow label="Net" value={money(sale.totals?.net || 0)} mono />
            <MetaRow
              label={`VAT (${((sale.totals?.vatRate || 0) * 100).toFixed(1)}%)`}
              value={money(sale.totals?.vat || 0)}
              mono
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
                Total payable
              </div>
              <div
                style={{
                  marginTop: 8,
                  font: 'var(--fw-bold) var(--text-2xl)/1 var(--font-mono)',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--text-strong)',
                }}
              >
                {money(total)}
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <MetaRow label="Paid now" value={money(paid)} mono />
              <MetaRow label="On account" value={money(onAcc)} mono />
              <MetaRow
                label="Balance"
                value={money(remaining)}
                mono
                tone={remaining !== 0 ? 'negative' : undefined}
              />
              {cashChange > 0 && (
                <MetaRow label="Change due" value={money(cashChange)} mono />
              )}
            </div>
            {sale.customer && (
              <div style={{ marginTop: 14 }}>
                <MetaRow label="Credit limit" value={money(sale.customer.creditLimit || 0)} mono />
                <MetaRow label="Outstanding" value={money(sale.customer.outstanding || 0)} mono />
                <MetaRow label="Credit available" value={money(creditAvailable)} mono />
                <MetaRow label="Wallet" value={money(sale.customer.walletBalance || 0)} mono />
                <MetaRow label="Deposit" value={money(sale.customer.depositBalance || 0)} mono />
              </div>
            )}
          </Panel>
        }
      >
        {missing.length > 0 && (
          <Callout
            tone="warning"
            icon="circle-alert"
            title="Complete these to enable “Complete sale”"
            style={{ marginBottom: 14 }}
          >
            {missing.join(' · ')}
          </Callout>
        )}

        {sale.customer?.overLimit && (
          <Callout
            tone="danger"
            icon="circle-alert"
            title="Customer is over their credit limit"
            style={{ marginBottom: 14 }}
          >
            Any amount put on account will need a credit override reason.
          </Callout>
        )}

        {proformas.length > 0 && (
          <Panel
            title="Load from pro-forma"
            description="Replace the cart with a sent pro-forma for this customer (its lines and quoted prices)."
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 280, flex: 1 }}>
                <Select
                  label="Pro-forma"
                  options={[
                    { value: '', label: 'Select pro-forma…' },
                    ...proformas.map((p) => ({
                      value: p.id,
                      label: `${p.ref} · ${money(p.value || 0)}`,
                    })),
                  ]}
                  value={proformaId}
                  onChange={(v) => setProformaId(val(v))}
                />
              </div>
              <Button iconLeft="download" onClick={loadProforma} disabled={!proformaId || busy}>
                Load into sale
              </Button>
            </div>
          </Panel>
        )}

        <Panel title="Add products" description="Search the showroom catalogue. Prices shown are for this customer.">
          <Input
            placeholder="Search by name, code or barcode…"
            value={search}
            onChange={(e) => setSearch(val(e))}
          />
          <div style={{ marginTop: 12 }}>
            {catLoading && (
              <div style={{ color: 'var(--text-muted)', padding: '8px 0' }}>Loading…</div>
            )}
            {!catLoading && (
              <GridTable
                template="minmax(200px, 2fr) 110px 90px 140px 100px"
                headers={[
                  { label: 'Product' },
                  { label: 'Code', mono: true },
                  { label: 'Unit' },
                  { label: 'Price', align: 'right', mono: true },
                  { label: '' },
                ]}
                empty="No products found."
                rows={catalogue.map((it) => [
                  <span key="n">
                    {it.name}
                    {it.lowStock && (
                      <Badge tone="warning" style={{ marginLeft: 8 }}>
                        Low · {fmt(it.available || 0)}
                      </Badge>
                    )}
                    {!it.lowStock && (it.available || 0) <= 0 && (
                      <Badge tone="danger" style={{ marginLeft: 8 }}>
                        Out of stock
                      </Badge>
                    )}
                  </span>,
                  it.code || '—',
                  it.unit || '—',
                  money(it.price || 0),
                  <Button
                    key="a"
                    variant="secondary"
                    iconLeft="plus"
                    onClick={() => addToCart(it)}
                  >
                    Add
                  </Button>,
                ])}
              />
            )}
          </div>
        </Panel>

        <Panel title="Cart" description="Change quantities, then save the cart so prices and totals are recalculated from the price list.">
          <GridTable
            template="minmax(200px, 2fr) 90px 130px 150px 110px"
            headers={[
              { label: 'Product' },
              { label: 'Unit' },
              { label: 'Quantity', align: 'right' },
              { label: 'Unit price', align: 'right', mono: true },
              { label: '' },
            ]}
            empty="The cart is empty."
            rows={cart.map((c, i) => [
              <span key="n">
                {c.name}
                {c.code && (
                  <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>({c.code})</span>
                )}
              </span>,
              c.unit || '—',
              <Input
                key="q"
                type="number"
                placeholder="0"
                value={c.quantity}
                onChange={(e) => setQty(i, val(e))}
              />,
              c.price ? money(c.price) : '—',
              <button
                key="r"
                type="button"
                onClick={() => removeFromCart(i)}
                aria-label={`Remove ${c.name}`}
                style={smallButtonStyle}
              >
                Remove
              </button>,
            ])}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
            }}
          >
            <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              {cartDirty ? 'You have unsaved cart changes.' : 'Cart is up to date.'}
            </div>
            <Button iconLeft="save" onClick={saveCart} disabled={!cartDirty || busy}>
              Save cart
            </Button>
          </div>
        </Panel>

        <Panel
          title="Payment"
          description="Split the total across payment methods and/or put part of it on the customer's account."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {payments.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  paddingBottom: 14,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ width: 190 }}>
                  <Select
                    label={i === 0 ? 'Method' : undefined}
                    options={methodOptions}
                    value={p.method}
                    onChange={(v) => updatePayment(i, 'method', val(v))}
                  />
                </div>
                <div style={{ width: 160 }}>
                  <Input
                    label={i === 0 ? 'Amount (₦)' : undefined}
                    type="number"
                    placeholder="0.00"
                    value={p.amount}
                    onChange={(e) => updatePayment(i, 'amount', val(e))}
                  />
                </div>
                {isCash(p.method) ? (
                  <div style={{ width: 160 }}>
                    <Input
                      label={i === 0 ? 'Cash tendered (₦)' : undefined}
                      type="number"
                      placeholder="Same as amount"
                      value={p.tendered}
                      onChange={(e) => updatePayment(i, 'tendered', val(e))}
                    />
                  </div>
                ) : (
                  <>
                    <div style={{ width: 170 }}>
                      <Input
                        label={i === 0 ? 'Terminal ref.' : undefined}
                        placeholder="Optional"
                        value={p.terminalRef}
                        onChange={(e) => updatePayment(i, 'terminalRef', val(e))}
                      />
                    </div>
                    <div style={{ width: 170 }}>
                      <Input
                        label={i === 0 ? 'Payer reference' : undefined}
                        placeholder="Optional"
                        value={p.payerReference}
                        onChange={(e) => updatePayment(i, 'payerReference', val(e))}
                      />
                    </div>
                    <div style={{ width: 340 }}>
                      <Select
                        label={i === 0 ? 'Receiving bank account' : undefined}
                        options={bankOptions}
                        value={p.receivingBankAccountId}
                        onChange={(v) => updatePayment(i, 'receivingBankAccountId', val(v))}
                      />
                    </div>
                  </>
                )}
                {payments.length > 1 && (
                  <button
                    type="button"
                    style={smallButtonStyle}
                    onClick={() => setPayments((ps) => ps.filter((_, pi) => pi !== i))}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                iconLeft="plus"
                onClick={() => setPayments((ps) => [...ps, blankPayment()])}
              >
                Add payment
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setPayments((ps) =>
                    ps.map((p, pi) =>
                      pi === ps.length - 1
                        ? { ...p, amount: String(round2((Number(p.amount) || 0) + remaining)) }
                        : p
                    )
                  )
                }
                disabled={remaining <= 0}
              >
                Fill balance
              </Button>
            </div>

            <div style={{ width: 200 }}>
              <Input
                label="On account (₦)"
                type="number"
                placeholder="0.00"
                value={onAccount}
                onChange={(e) => setOnAccount(val(e))}
                hint={`Credit available: ${money(creditAvailable)}`}
              />
            </div>

            {needsOverride && (
              <Input
                label="Credit override reason *"
                placeholder="Why is this customer being allowed past their credit limit?"
                value={creditOverrideReason}
                onChange={(e) => setCreditOverrideReason(val(e))}
              />
            )}
          </div>
        </Panel>

        <Panel
          title="Supply"
          description="How much of each line leaves the showroom now. Reduce a quantity to supply part of an order and the rest stays outstanding."
        >
          <GridTable
            template="minmax(200px, 2fr) 100px 110px 140px"
            headers={[
              { label: 'Product' },
              { label: 'Ordered', align: 'right', mono: true },
              { label: 'In stock', align: 'right', mono: true },
              { label: 'Supply now', align: 'right' },
            ]}
            empty="Save the cart to see supply lines."
            rows={(sale.lines || []).map((l) => [
              <span key="n">
                {l.name}
                {l.insufficient && (
                  <Badge tone="warning" style={{ marginLeft: 8 }}>
                    Insufficient stock
                  </Badge>
                )}
              </span>,
              fmt(l.quantity || 0),
              fmt(l.available || 0),
              <Input
                key="s"
                type="number"
                value={supplyOf(l)}
                onChange={(e) => setSupplyNow((s) => ({ ...s, [l.lineNo]: val(e) }))}
              />,
            ])}
          />
        </Panel>

        <Panel title="Invoice">
          <CheckRow
            checked={issueInvoice}
            onChange={setIssueInvoice}
            label="Issue an invoice with this sale"
            hint="Leave unticked for a plain sale. An invoice can still be issued later from the sale's detail view."
          />
          {issueInvoice && (
            <div style={{ marginTop: 14 }}>
              <FieldSet columns={2}>
                <Input
                  label="Buyer name *"
                  value={buyer.name}
                  onChange={(e) => setBuyer((b) => ({ ...b, name: val(e) }))}
                />
                <Input
                  label="Email"
                  value={buyer.email}
                  onChange={(e) => setBuyer((b) => ({ ...b, email: val(e) }))}
                />
                <Input
                  label="Phone"
                  value={buyer.phone}
                  onChange={(e) => setBuyer((b) => ({ ...b, phone: val(e) }))}
                />
                <Input
                  label="TIN"
                  value={buyer.tin}
                  onChange={(e) => setBuyer((b) => ({ ...b, tin: val(e) }))}
                />
                <Input
                  label="Address"
                  value={buyer.address}
                  onChange={(e) => setBuyer((b) => ({ ...b, address: val(e) }))}
                />
                <Input
                  label="State code"
                  placeholder="e.g. LA"
                  value={buyer.stateCode}
                  onChange={(e) => setBuyer((b) => ({ ...b, stateCode: val(e) }))}
                />
              </FieldSet>
            </div>
          )}
        </Panel>
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Detail view (read-only)                                            */
/* ------------------------------------------------------------------ */

// Pulls the invoice reference off a sale. Adjust here if your sale payload
// names these fields differently.
const invoiceRefOf = (sale) => ({
  id: sale?.invoice?.id || sale?.invoiceId || '',
  number: sale?.invoiceNumber || sale?.invoice?.number || '',
  status: sale?.invoice?.status || sale?.invoiceStatus || '',
  buyerEmail: sale?.invoice?.buyer?.email || '',
  paymentTermsDays: sale?.invoice?.paymentTermsDays,
  paymentTermsNote: sale?.invoice?.paymentTermsNote || '',
})

function SaleDetail({ sale, loading, crumbs, onBack, onRefresh, onAction,onNavigate }) {
  if (loading || !sale) {
    return (
      <>
        {loading && <Loader overlay label="Loading sale…" />}
        <FormShell
          crumbs={crumbs}
          title="Loading…"
          icon="receipt"
          submitLabel={null}
          onCancel={onBack}
          headerActions={
            <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
              Back to list
            </Button>
          }
        >
          <Panel title="Details">
            <div style={{ color: 'var(--text-muted)', padding: 12 }}>Loading…</div>
          </Panel>
        </FormShell>
      </>
    )
  }

  const config = statusOf(sale.status)
  const status = normStatus(sale.status)
  const isCompleted = status === 'COMPLETED'
  const windowOpen = sale.voidableUntil ? new Date(sale.voidableUntil) > new Date() : false
  const canVoid = isCompleted && !sale.voidedAt && windowOpen
  const canInvoice = isCompleted && !sale.invoice && !sale.invoiceNumber

  const inv = invoiceRefOf(sale)
  const canIssueDraft = !!inv.id && normStatus(inv.status) === 'DRAFT'

  const actions = (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button variant="secondary" iconLeft="rotate-cw" onClick={onRefresh}>
        Refresh
      </Button>
            {inv.id && (
        <Button
          variant="secondary"
          iconLeft="file-text"
          onClick={() =>
            onNavigate?.({
              id: 'invoicedetails',
              view: 'invoicedetails',
              label: 'Invoice Details',
              params: { invoiceId: inv.id },
            })
          }
        >
          View invoice
        </Button>
      )}
      {canInvoice && (
        <Button iconLeft="file-text" onClick={() => onAction('invoice')}>
          Issue invoice
        </Button>
      )}
      {canIssueDraft && (
        <Button iconLeft="file-text" onClick={() => onAction('issueDraft')}>
          Issue invoice
        </Button>
      )}
      {canVoid && (
        <Button variant="secondary" iconLeft="ban" onClick={() => onAction('void')}>
          Void sale
        </Button>
      )}
      <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
        Back to list
      </Button>
    </div>
  )

  return (
    <FormShell
      wide
      crumbs={crumbs}
      title={`${sale.ref} — ${sale.customerName || sale.customer?.customer?.name || '—'}`}
      icon="receipt"
      description={`Sold ${sale.saleDate ? fmtDate(sale.saleDate) : '—'}${
        sale.completedAt ? ` · Completed ${fmtDate(sale.completedAt)}` : ''
      }`}
      submitLabel={null}
      onCancel={onBack}
      headerActions={actions}
      aside={
        <Panel title="Status & totals">
          <MetaRow label="Status" value={<Badge tone={config.tone}>{config.label}</Badge>} />
          <MetaRow label="Gross" value={money(sale.totals?.gross || 0)} mono />
          <MetaRow
            label="Line discounts"
            value={
              (sale.totals?.lineDiscounts || 0) > 0
                ? `− ${money(sale.totals.lineDiscounts)}`
                : '—'
            }
            mono
          />
          <MetaRow
            label="Instant discount"
            value={
              (sale.totals?.instantDiscount || 0) > 0
                ? `− ${money(sale.totals.instantDiscount)}`
                : '—'
            }
            mono
          />
          <MetaRow label="Net" value={money(sale.totals?.net || 0)} mono />
          <MetaRow
            label={`VAT (${((sale.totals?.vatRate || 0) * 100).toFixed(1)}%)`}
            value={money(sale.totals?.vat || 0)}
            mono
          />
          <MetaRow label="Total" value={money(sale.totals?.total || 0)} mono />
          <MetaRow label="Paid now" value={money(sale.paidNow || 0)} mono />
          <MetaRow label="On account" value={money(sale.onAccount || 0)} mono />
          {(sale.cashTendered || 0) > 0 && (
            <MetaRow label="Cash tendered" value={money(sale.cashTendered)} mono />
          )}
          {(sale.changeGiven || 0) > 0 && (
            <MetaRow label="Change given" value={money(sale.changeGiven)} mono />
          )}
          {inv.number && <MetaRow label="Invoice" value={inv.number || '—'} mono onClick={() => console.log("ddad")} />}
          {inv.status && (
            <MetaRow
              label="Invoice status"
              value={<Badge tone={statusOf(inv.status).tone}>{statusOf(inv.status).label}</Badge>}
            />
          )}
          {isCompleted && sale.voidableUntil && (
            <MetaRow
              label={windowOpen ? 'Voidable until' : 'Void window closed'}
              value={fmtDate(sale.voidableUntil)}
            />
          )}
        </Panel>
      }
    >
      <Panel title="Sale">
        <FieldSet columns={2}>
          <MetaRow label="Reference" value={sale.ref || '—'} mono />
          <MetaRow label="Channel" value={pretty(sale.channel) || '—'} />
          <MetaRow label="Showroom" value={sale.location?.name || '—'} />
          <MetaRow label="Till" value={sale.till?.name || sale.till?.code || '—'} />
          <MetaRow label="Cashier" value={sale.cashier?.name || '—'} />
          <MetaRow label="Supply status" value={pretty(sale.supplyStatus) || '—'} />
          <MetaRow label="Price basis" value={pretty(sale.priceBasis) || '—'} />
          <MetaRow
            label="Started"
            value={sale.startedAt ? fmtDate(sale.startedAt) : '—'}
          />
        </FieldSet>
      </Panel>

      <Panel title="Customer">
        <FieldSet columns={2}>
          <MetaRow label="Customer" value={sale.customerName || sale.customer?.customer?.name || '—'} />
          <MetaRow label="Code" value={sale.customer?.customer?.code || '—'} mono />
          <MetaRow label="Type" value={pretty(sale.customer?.type) || '—'} />
          <MetaRow label="Category" value={pretty(sale.customer?.category) || '—'} />
          <MetaRow label="Credit limit" value={money(sale.customer?.creditLimit || 0)} mono />
          <MetaRow label="Outstanding" value={money(sale.customer?.outstanding || 0)} mono />
          <MetaRow label="Wallet" value={money(sale.customer?.walletBalance || 0)} mono />
          <MetaRow label="Deposit" value={money(sale.customer?.depositBalance || 0)} mono />
        </FieldSet>
      </Panel>

      <Panel title="Line items" padding={0}>
        <div style={{ padding: '8px 16px 16px' }}>
          <GridTable
            template="minmax(200px, 2fr) 80px 90px 130px 130px 120px 140px 110px"
            headers={[
              { label: 'Product' },
              { label: 'Qty', align: 'right', mono: true },
              { label: 'Unit' },
              { label: 'Unit price', align: 'right', mono: true },
              { label: 'Discount', align: 'right', mono: true },
              { label: 'VAT', align: 'right', mono: true },
              { label: 'Line total', align: 'right', mono: true },
              { label: 'Supplied', align: 'right', mono: true },
            ]}
            empty="No lines on this sale."
            rows={(sale.lines || []).map((l) => [
              l.name || l.stockItem?.name || '—',
              fmt(l.quantity || 0),
              l.unit || '—',
              money(l.unitPrice || 0),
              l.lineDiscount ? `− ${money(l.lineDiscount)}` : '—',
              money(l.vatAmount || 0),
              money(l.lineTotal || 0),
              `${fmt(l.supplied || 0)}${l.outstanding ? ` (${fmt(l.outstanding)} due)` : ''}`,
            ])}
          />
        </div>
      </Panel>

      <Panel title="Payments" padding={0}>
        <div style={{ padding: '8px 16px 16px' }}>
          <GridTable
            template="minmax(160px, 1.5fr) 140px 140px 150px minmax(140px, 1fr)"
            headers={[
              { label: 'Method' },
              { label: 'Amount', align: 'right', mono: true },
              { label: 'Receipt', mono: true },
              { label: 'Confirmation' },
              { label: 'Reference', mono: true },
            ]}
            empty="No payments were taken on this sale."
            rows={(sale.payments || []).map((p) => [
              p.methodLabel || pretty(p.method),
              money(p.amount || 0),
              p.receiptRef || p.receipt?.code || '—',
              pretty(p.confirmationStatus) || '—',
              p.terminalRef || p.payerReference || '—',
            ])}
          />
          {(sale.onAccount || 0) > 0 && (
            <div style={{ marginTop: 10, font: 'var(--type-caption)', color: 'var(--text-muted)' }}>
              {money(sale.onAccount)} was put on the customer's account.
            </div>
          )}
        </div>
      </Panel>

      {sale.instantDiscount && (
        <Panel title="Instant discount">
          <FieldSet columns={2}>
            <MetaRow label="Reference" value={sale.instantDiscount.ref} mono />
            <MetaRow label="Amount" value={money(sale.instantDiscount.amount || 0)} mono />
            <MetaRow
              label="Share of base"
              value={`${((sale.instantDiscount.pctOfBase || 0) * 100).toFixed(1)}%`}
            />
            <MetaRow label="Status" value={pretty(sale.instantDiscount.status)} />
            <MetaRow label="Reason" value={sale.instantDiscount.reason || '—'} />
          </FieldSet>
        </Panel>
      )}

      {sale.creditOverrideReason && (
        <Callout tone="warning" icon="circle-alert" title="Credit limit overridden">
          {sale.creditOverrideReason}
          {sale.creditOverrideBy?.name ? ` — ${sale.creditOverrideBy.name}` : ''}
        </Callout>
      )}

      {(sale.voidedAt || status === 'VOIDED' || status === 'VOID') && (
        <Callout tone="danger" icon="ban" title="Sale voided">
          {sale.voidReason || 'No reason recorded.'}
          {sale.voidedBy?.name ? ` — ${sale.voidedBy.name}` : ''}
          {sale.voidedAt ? ` · ${fmtDate(sale.voidedAt)}` : ''}
        </Callout>
      )}
    </FormShell>
  )
}

/* ------------------------------------------------------------------ */
/*  Action dialog (void / issue invoice / issue draft / abandon)       */
/* ------------------------------------------------------------------ */
function SaleActionDialog({ action, sale, crumbs, onBack, onDone }) {
  const { showToast } = useStore()

  const draftInv = invoiceRefOf(sale)

  const [reason, setReason] = useState('')
  const [buyer, setBuyer] = useState({
    name: sale.customerName || '',
    email: '',
    phone: '',
    tin: '',
    address: '',
    stateCode: '',
  })

  // Issue-draft-invoice form
  const initialTerms =
    draftInv.paymentTermsDays != null ? String(draftInv.paymentTermsDays) : '0'
  const [issueDate, setIssueDate] = useState(todayIso())
  const [termsDays, setTermsDays] = useState(initialTerms)
  const [dueDate, setDueDate] = useState(addDays(todayIso(), initialTerms))
  const [termsNote, setTermsNote] = useState(draftInv.paymentTermsNote)
  const [buyerEmail, setBuyerEmail] = useState(draftInv.buyerEmail)

  const [submitting, setSubmitting] = useState(false)

  const CONFIG = {
    void: {
      title: `Void ${sale.ref}`,
      icon: 'ban',
      submitLabel: 'Void sale',
      description:
        'Reverses this sale: stock goes back, receipts and wallet debits are reversed and the invoice is voided. Only possible within the void window.',
    },
    invoice: {
      title: `Issue invoice for ${sale.ref}`,
      icon: 'file-text',
      submitLabel: 'Issue invoice',
      description:
        'Issue the invoice for this sale after the fact, addressed to the buyer below.',
    },
    issueDraft: {
      title: `Issue invoice${draftInv.number ? ` ${draftInv.number}` : ''} for ${sale.ref}`,
      icon: 'file-text',
      submitLabel: 'Issue invoice',
      description:
        'This sale has a draft invoice. Set the dates and payment terms below to issue it.',
    },
    abandon: {
      title: `Abandon ${sale.ref || 'sale'}`,
      icon: 'trash-2',
      submitLabel: 'Abandon sale',
      description:
        'Clears this open sale. No stock or money has been touched, so nothing needs reversing.',
    },
  }[action]

  if (!CONFIG) return null

  const missing = []
  if (action === 'void' && !reason.trim()) missing.push('Reason')
  if (action === 'invoice' && !buyer.name.trim()) missing.push('Buyer name')
  if (action === 'issueDraft') {
    if (!draftInv.id) missing.push('Invoice reference')
    if (!issueDate) missing.push('Issue date')
    if (termsDays === '' || Number(termsDays) < 0) missing.push('Payment terms (days)')
    if (!dueDate) missing.push('Due date')
  }
  const canSubmit = missing.length === 0 && !submitting

  async function submit() {
    if (!canSubmit) return
    setSubmitting(true)
    try {
      if (action === 'void') {
        await cashierApi.voidSale(sale.id, reason.trim())
      } else if (action === 'invoice') {
        await cashierApi.issueSaleInvoice(sale.id, {
          buyer: {
            name: buyer.name.trim(),
            email: buyer.email.trim(),
            phone: buyer.phone.trim(),
            tin: buyer.tin.trim(),
            address: buyer.address.trim(),
            stateCode: buyer.stateCode.trim(),
          },
        })
      } else if (action === 'issueDraft') {
        await invoiceApi.issueInvoice(draftInv.id, {
          issueDate,
          paymentTermsDays: Number(termsDays) || 0,
          dueDate,
          paymentTermsNote: termsNote.trim(),
          buyerEmail: buyerEmail.trim(),
        })
      } else if (action === 'abandon') {
        await cashierApi.abandonSale(sale.id, { version: sale.version })
      }
      showToast(
        action === 'issueDraft' ? 'Invoice issued' : 'Action complete',
        action === 'issueDraft'
          ? `${draftInv.number || 'The invoice'} has been issued.`
          : `${sale.ref || 'The sale'} has been updated.`
      )
      onDone(action)
    } catch (e) {
      showToast(
        action === 'issueDraft' ? 'Could not issue invoice' : `Could not ${action}`,
        e.message,
        true
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {submitting && <Loader overlay label="Processing…" />}
      <FormShell
        wide
        crumbs={crumbs}
        title={CONFIG.title}
        icon={CONFIG.icon}
        description={CONFIG.description}
        headerActions={
          <Button variant="ghost" iconLeft="arrow-left" onClick={onBack}>
            Back
          </Button>
        }
        submitLabel={CONFIG.submitLabel}
        onSubmit={submit}
        onCancel={onBack}
        submitDisabled={!canSubmit}
        aside={
          <Panel title="Sale">
            <MetaRow label="Ref" value={sale.ref || '—'} mono />
            <MetaRow label="Customer" value={sale.customerName || '—'} />
            <MetaRow label="Total" value={money(sale.totals?.total || 0)} mono />
            <MetaRow
              label="Status"
              value={<Badge tone={statusOf(sale.status).tone}>{statusOf(sale.status).label}</Badge>}
            />
            {action === 'issueDraft' && draftInv.number && (
              <MetaRow label="Invoice" value={draftInv.number} mono />
            )}
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

        {action === 'void' && (
          <Panel
            title="Reason"
            description="Recorded against the sale and visible to staff."
          >
            <textarea
              rows={4}
              placeholder="Why is this sale being voided?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={textareaStyle}
            />
          </Panel>
        )}

        {action === 'invoice' && (
          <Panel title="Buyer">
            <FieldSet columns={2}>
              <Input
                label="Name *"
                value={buyer.name}
                onChange={(e) => setBuyer((b) => ({ ...b, name: val(e) }))}
              />
              <Input
                label="Email"
                value={buyer.email}
                onChange={(e) => setBuyer((b) => ({ ...b, email: val(e) }))}
              />
              <Input
                label="Phone"
                value={buyer.phone}
                onChange={(e) => setBuyer((b) => ({ ...b, phone: val(e) }))}
              />
              <Input
                label="TIN"
                value={buyer.tin}
                onChange={(e) => setBuyer((b) => ({ ...b, tin: val(e) }))}
              />
              <Input
                label="Address"
                value={buyer.address}
                onChange={(e) => setBuyer((b) => ({ ...b, address: val(e) }))}
              />
              <Input
                label="State code"
                placeholder="e.g. LA"
                value={buyer.stateCode}
                onChange={(e) => setBuyer((b) => ({ ...b, stateCode: val(e) }))}
              />
            </FieldSet>
          </Panel>
        )}

        {action === 'issueDraft' && (
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
              <div
                style={{
                  font: 'var(--type-label)',
                  color: 'var(--text-strong)',
                  marginBottom: 6,
                }}
              >
                Payment terms note
              </div>
              <textarea
                rows={3}
                placeholder="e.g. Payment due within 14 days of issue."
                value={termsNote}
                onChange={(e) => setTermsNote(e.target.value)}
                style={textareaStyle}
              />
            </div>
          </Panel>
        )}

        {action === 'abandon' && (
          <Callout tone="info" icon="circle-alert" title="Nothing has been charged">
            The cart will be cleared and the till freed up for the next sale.
          </Callout>
        )}
      </FormShell>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function Sales({ leaf, moduleLabel, parentLabel,onNavigate }) {
  const { showToast } = useStore()
  const crumbs = [moduleLabel, parentLabel, leaf?.label].filter(Boolean)

  const [mode, setMode] = useState('list') // list | new | checkout | detail
  const [active, setActive] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [actionType, setActionType] = useState(null)

  // List state
  const [rows, setRows] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [cashierFilter, setCashierFilter] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  // Lookups
  const [showrooms, setShowrooms] = useState([])
  const [customers, setCustomers] = useState([])
  const [cashiers, setCashiers] = useState([])
  const [loadingLookups, setLoadingLookups] = useState(true)

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 200)
    return () => clearTimeout(t)
  }, [searchInput])

  // Load lookups once
  useEffect(() => {
    let cancelled = false
    setLoadingLookups(true)
    Promise.all([
      showroomApi
        .lookupPickerWithAreas({ status: ['ACTIVE'] })
        .catch(() => ({ data: [] })),
      customerApi
        .listCustomers({ page: 0, size: 200 })
        .catch(() => ({ data: { items: [] } })),
      tenantApi
        .getTenantMemberList({ page: 0, size: 200 })
        .catch(() => ({ data: { items: [] } })),
    ])
      .then(([showroomRes, customerRes, memberRes]) => {
        if (cancelled) return
        setShowrooms(
          (showroomRes.data || []).map((s) => ({
            value: s.id,
            label: s.label || s.name || s.code,
          }))
        )
        setCustomers(
          (customerRes.data?.items || []).map(customerOption)
        )
        setCashiers(
          (memberRes.data?.items || [])
            .filter(
              (m) =>
                String(m.role?.name || '').toLowerCase() === 'cashier' &&
                m.status === 'ACTIVE'
            )
            .map((m) => ({
              value: m.userId,
              label: m.displayName || m.email,
            }))
        )
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

  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [statusFilter, locationFilter, cashierFilter, customerFilter, fromDate, toDate, search])

  // Load list
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const q = { page, size: PAGE_SIZE }
      if (statusFilter) q.status = statusFilter
      if (locationFilter) q.locationId = locationFilter
      if (cashierFilter) q.cashierUserId = cashierFilter
      if (customerFilter) q.customerId = customerFilter
      if (fromDate) q.from = fromDate
      if (toDate) q.to = toDate
      if (search) q.ref = search

      const res = await cashierApi.listSales(q)
      const paged = res.data
      setRows(paged.items || [])
      setTotalPages(paged.totalPages || 0)
      setTotalItems(paged.totalItems || 0)
    } catch (e) {
      showToast('Could not load sales', e.message, true)
    } finally {
      setLoading(false)
    }
  }, [
    page,
    statusFilter,
    locationFilter,
    cashierFilter,
    customerFilter,
    fromDate,
    toDate,
    search,
    showToast,
  ])

  useEffect(() => {
    load()
  }, [load])

  // Detail loader
  const loadSale = useCallback(
    async (id) => {
      setLoadingDetail(true)
      try {
        const res = await cashierApi.getSale(id)
        setActive(res.data)
        return res.data
      } catch (e) {
        showToast('Could not load sale', e.message, true)
        return null
      } finally {
        setLoadingDetail(false)
      }
    },
    [showToast]
  )

  // Open sales go to checkout (editable); everything else is read-only detail
  async function openSale(row) {
    const sale = await loadSale(row.id)
    if (sale) setMode(isOpenStatus(sale.status) ? 'checkout' : 'detail')
  }

  function backToList() {
    setMode('list')
    setActive(null)
    setActionType(null)
    load()
  }

  function onAction(action) {
    if (['void', 'invoice', 'issueDraft', 'abandon'].includes(action)) setActionType(action)
  }

  // ── Render branches ───────────────────────────────────
  if (actionType && active) {
    return (
      <SaleActionDialog
        action={actionType}
        sale={active}
        crumbs={crumbs}
        onBack={() => setActionType(null)}
        onDone={async (kind) => {
          setActionType(null)
          if (kind === 'abandon') {
            backToList()
            return
          }
          await loadSale(active.id)
          load()
        }}
      />
    )
  }

  if (mode === 'new') {
    return (
      <NewSaleForm
        crumbs={crumbs}
        customers={customers}
        onBack={() => setMode('list')}
        onCreated={(sale) => {
          setActive(sale)
          setMode('checkout')
        }}
      />
    )
  }

  if (mode === 'checkout' && active) {
    return (
      <SaleCheckout
        sale={active}
        crumbs={crumbs}
        onBack={backToList}
        onSaleChange={setActive}
        onCompleted={(sale) => {
          setActive(sale)
          setMode('detail')
          load()
        }}
        onAbandon={() => setActionType('abandon')}
      />
    )
  }

  if (mode === 'detail') {
    return (
      <SaleDetail
        sale={active}
        loading={loadingDetail}
        crumbs={crumbs}
        onBack={backToList}
        onRefresh={() => active && loadSale(active.id)}
        onAction={onAction}
        onNavigate={onNavigate}
      />
    )
  }

  // ── List view ─────────────────────────────────────────
  const columns = [
    { key: 'ref', label: 'Reference', width: 130, mono: true },
    {
      key: 'date',
      label: 'Date',
      width: 120,
      render: (r) => (r.date ? fmtDate(r.date) : '—'),
    },
    {
      key: 'customerName',
      label: 'Customer',
      width: 220,
      render: (r) => r.customerName || r.customer?.name || '—',
    },
    {
      key: 'cashier',
      label: 'Cashier',
      width: 160,
      render: (r) => r.cashier?.name || '—',
    },
    {
      key: 'location',
      label: 'Showroom',
      width: 170,
      render: (r) => r.location?.name || '—',
    },
    {
      key: 'items',
      label: 'Items',
      width: 80,
      align: 'right',
      mono: true,
      render: (r) => fmt(r.items || 0),
    },
    {
      key: 'total',
      label: 'Total',
      width: 150,
      align: 'right',
      mono: true,
      render: (r) => money(r.total || 0),
    },
    {
      key: 'methods',
      label: 'Paid by',
      width: 170,
      render: (r) => {
        const m = (r.methods || []).map(pretty).join(', ')
        if ((r.onAccount || 0) > 0) return m ? `${m} + Account` : 'On account'
        return m || '—'
      },
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice',
      width: 130,
      mono: true,
      render: (r) => r.invoiceNumber || r.invoice?.number || '—',
    },
    {
      key: 'status',
      label: 'Status',
      width: 130,
      render: (r) => {
        const c = statusOf(r.status)
        return <Badge tone={c.tone}>{c.label}</Badge>
      },
    },

    {
      key: 'supplyStatus',
      label: 'Supply status',
      width: 130,
      render: (r) => {
        const c = statusOf(r.supplyStatus)
        return <Badge tone={c.tone}>{c.label}</Badge>
      },
    },
  ]

  const showroomFilterOptions = [{ value: '', label: 'All showrooms' }, ...showrooms]
  const cashierFilterOptions = [{ value: '', label: 'All cashiers' }, ...cashiers]
  const customerFilterOptions = [{ value: '', label: 'All customers' }, ...customers]

  const totalValue = rows.reduce((n, r) => n + (r.total || 0), 0)
  const onAccountTotal = rows.reduce((n, r) => n + (r.onAccount || 0), 0)

  return (
    <>
      {(loading || loadingLookups || loadingDetail) && (
        <Loader
          overlay
          label={
            loadingLookups
              ? 'Loading lookups…'
              : loadingDetail
                ? 'Loading sale…'
                : 'Loading sales…'
          }
        />
      )}
      <RegisterShell
        wide
        crumbs={[moduleLabel, parentLabel]}
        title={leaf?.label || 'Sales'}
        icon={leaf?.icon}
        description="Every sale rung up at the showrooms. Start a new sale, resume an open one, or open a completed sale to view its payments, issue an invoice or void it."
        createLabel="New sale"
        onCreate={() => setMode('new')}
        search={searchInput}
        onSearch={setSearchInput}
        searchPlaceholder="Search by transaction or invoice number…"
        pagination={{
          page,
          pageCount: totalPages,
          pageSize: PAGE_SIZE,
          total: totalItems,
          onPage: setPage,
        }}
        filters={
          <>
            <Select
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(v) => setStatusFilter(val(v))}
              style={{ width: 180 }}
            />
            <Select
              options={showroomFilterOptions}
              value={locationFilter}
              onChange={(v) => setLocationFilter(val(v))}
              style={{ width: 190 }}
            />
            <Select
              options={cashierFilterOptions}
              value={cashierFilter}
              onChange={(v) => setCashierFilter(val(v))}
              style={{ width: 190 }}
            />
            <Select
              options={customerFilterOptions}
              value={customerFilter}
              onChange={(v) => setCustomerFilter(val(v))}
              style={{ width: 210 }}
            />
            <Input
              type="date"
              aria-label="From date"
              value={fromDate}
              onChange={(e) => setFromDate(val(e))}
              style={{ width: 150 }}
            />
            <Input
              type="date"
              aria-label="To date"
              value={toDate}
              onChange={(e) => setToDate(val(e))}
              style={{ width: 150 }}
            />
          </>
        }
        stats={[
          { label: 'Sales', value: String(totalItems) },
          { label: 'Value (this page)', value: moneyShort(totalValue) },
          { label: 'On account (this page)', value: moneyShort(onAccountTotal) },
          { label: 'Latest', value: rows[0]?.date ? fmtDate(rows[0].date) : '—' },
        ]}
        columns={columns}
        rows={rows}
        onRowClick={openSale}
        emptyTitle="No sales found"
        emptyDescription="Start a new sale, or adjust the filters above."
        footnote="Completed sales can be voided within the void window. Open sales can be resumed by clicking them."
      />
    </>
  )
}