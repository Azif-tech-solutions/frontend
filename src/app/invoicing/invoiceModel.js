// Pure derivations shared by the four Electronic Invoicing screens.
// Status is always computed from the invoice's linked payments and due date —
// never stored — so it can never drift from the money actually received.

import { invoices } from '../sampleInvoicing.js'

/** The build's "today", so overdue can be derived deterministically. */
export const TODAY = new Date('2026-08-24T00:00:00')

/** Parses the "24 Aug 2026" form used throughout the sample data. */
export function parseDate(d) {
  if (!d) return null
  return new Date(d.replace(/(\d+) (\w+) (\d+)/, '$2 $1, $3'))
}

const TOLERANCE = 1 // naira, to absorb VAT rounding on the sample figures

/** VAT is stated to two decimals, as it appears on the issued document. */
const round2 = (n) => Math.round(n * 100) / 100

/**
 * The stored `total` is VAT-inclusive and authoritative. Subtotal and VAT are
 * backed out of it, so the invoice can never state a total its own lines
 * disagree with.
 */
export function decorate(inv) {
  const total = inv.total
  const vat = round2(total - total / (1 + inv.vatRate / 100))
  const subtotal = round2(total - vat)
  const paid = inv.payments.reduce((n, p) => n + p.amount, 0)
  const balance = Math.max(0, total - paid)
  const due = parseDate(inv.due)
  const pastDue = due ? due < TODAY : false

  let status
  if (inv.draft) status = 'Draft'
  else if (inv.voidReason) status = 'Void'
  else if (paid >= total - TOLERANCE) status = 'Paid'
  else if (pastDue) status = 'Overdue'
  else if (paid > 0) status = 'Partially Paid'
  else status = 'Issued'

  const daysOverdue = pastDue && status === 'Overdue'
    ? Math.round((TODAY - due) / 86400000)
    : 0

  return { ...inv, subtotal, vat, total, paid, balance, status, pastDue, daysOverdue }
}

export const allInvoices = invoices.map(decorate)

/** Issued, Partially Paid and Overdue invoices — the receivables the PRD asks for. */
export const receivables = allInvoices.filter((i) => ['Issued', 'Partially Paid', 'Overdue'].includes(i.status))

export const outstandingTotal = receivables.reduce((n, i) => n + i.balance, 0)
