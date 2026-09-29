// History module placeholder data (PRD §5.6). Audit-oriented: read-only records
// spanning long periods, drawn from activity recorded elsewhere in the system.

/** §5.6.1 — every waybill raised against an invoice, for multi-delivery tracing. */
export const waybillHistory = [
  { invoice: 'INV-31240', customer: 'Bendel Stores', invoiceDate: '09 Aug 2026', waybill: 'WB-9101', supplied: '10 Aug 2026', product: 'ZF-101 · Citrus Drink 50cl', ordered: 500, qty: 300, driver: 'Musa Danjuma', receivedBy: 'K. Osagie', status: 'Delivered' },
  { invoice: 'INV-31240', customer: 'Bendel Stores', invoiceDate: '09 Aug 2026', waybill: 'WB-9101', supplied: '10 Aug 2026', product: 'ZF-102 · Citrus Drink 1L', ordered: 200, qty: 200, driver: 'Musa Danjuma', receivedBy: 'K. Osagie', status: 'Delivered' },
  { invoice: 'INV-31240', customer: 'Bendel Stores', invoiceDate: '09 Aug 2026', waybill: '—', supplied: '—', product: 'ZF-210 · Malt Classic 33cl', ordered: 400, qty: 0, driver: '—', receivedBy: '—', status: 'Outstanding' },
  { invoice: 'INV-31331', customer: 'Kano Central Distributors', invoiceDate: '20 Aug 2026', waybill: 'WB-9142', supplied: '21 Aug 2026', product: 'ZF-315 · Ginger Blend 50cl', ordered: 600, qty: 240, driver: 'Ibrahim Sule', receivedBy: 'A. Yusuf', status: 'Delivered' },
  { invoice: 'INV-31331', customer: 'Kano Central Distributors', invoiceDate: '20 Aug 2026', waybill: '—', supplied: '—', product: 'OS-01 · Sparkling Water 75cl', ordered: 300, qty: 0, driver: '—', receivedBy: '—', status: 'Outstanding' },
  { invoice: 'INV-31204', customer: 'Eko Hotels & Suites', invoiceDate: '03 Aug 2026', waybill: 'WB-9066', supplied: '04 Aug 2026', product: 'ZF-101 · Citrus Drink 50cl', ordered: 240, qty: 240, driver: 'Emeka Nwosu', receivedBy: 'D. Bassey', status: 'Delivered' },
  { invoice: 'INV-31204', customer: 'Eko Hotels & Suites', invoiceDate: '03 Aug 2026', waybill: 'WB-9072', supplied: '07 Aug 2026', product: 'ZF-210 · Malt Classic 33cl', ordered: 300, qty: 180, driver: 'Emeka Nwosu', receivedBy: 'D. Bassey', status: 'Delivered' },
  { invoice: 'INV-31204', customer: 'Eko Hotels & Suites', invoiceDate: '03 Aug 2026', waybill: 'WB-9088', supplied: '12 Aug 2026', product: 'ZF-210 · Malt Classic 33cl', ordered: 300, qty: 120, driver: 'Musa Danjuma', receivedBy: 'D. Bassey', status: 'Delivered' },
]

/** §5.6.3 — every movement that changed a product's stock level, from any source. */
export const stockMovementHistory = [
  { date: '02 Aug 2026', ref: 'RF-2470', product: 'ZF-102 · Citrus Drink 1L', location: 'Factory A', source: 'Stock Refill', direction: 'In', qty: 240, by: 'A. Bello' },
  { date: '02 Aug 2026', ref: 'WB-8821', product: 'ZF-101 · Citrus Drink 50cl', location: 'Factory A', source: 'Stock Transfer', direction: 'Out', qty: 300, by: 'A. Bello' },
  { date: '04 Aug 2026', ref: 'WB-9066', product: 'ZF-101 · Citrus Drink 50cl', location: 'Showroom Ikeja', source: 'Customer waybill', direction: 'Out', qty: 240, by: 'F. Adeniyi' },
  { date: '05 Aug 2026', ref: 'PR-3328', product: 'ZF-210 · Malt Classic 33cl', location: 'Factory A', source: 'Production run', direction: 'In', qty: 620, by: 'K. Umeh' },
  { date: '08 Aug 2026', ref: 'QA-119', product: 'ZF-102 · Citrus Drink 1L', location: 'Factory A', source: 'Quantity Adjustment', direction: 'Out', qty: 24, by: 'A. Bello' },
  { date: '10 Aug 2026', ref: 'WB-8867', product: 'ZF-210 · Malt Classic 33cl', location: 'Showroom Ikeja', source: 'Receive Product', direction: 'In', qty: 400, by: 'F. Adeniyi' },
  { date: '11 Aug 2026', ref: 'PR-3352', product: 'ZF-315 · Ginger Blend 50cl', location: 'Factory B', source: 'Production run', direction: 'In', qty: 360, by: 'K. Umeh' },
  { date: '12 Aug 2026', ref: 'RT-0441', product: 'ZF-101 · Citrus Drink 50cl', location: 'Showroom Ikeja', source: 'Dealer return', direction: 'In', qty: 60, by: 'F. Adeniyi' },
  { date: '14 Aug 2026', ref: 'WB-8905', product: 'ZF-315 · Ginger Blend 50cl', location: 'Factory B', source: 'Stock Transfer', direction: 'Out', qty: 420, by: 'K. Umeh' },
  { date: '17 Aug 2026', ref: 'QA-133', product: 'ZF-101 · Citrus Drink 50cl', location: 'Showroom Ikeja', source: 'Quantity Adjustment', direction: 'Out', qty: 18, by: 'F. Adeniyi' },
  { date: '19 Aug 2026', ref: 'TR-9002', product: 'ZF-101 · Citrus Drink 50cl', location: 'Showroom Ikeja', source: 'Showroom transfer', direction: 'Out', qty: 120, by: 'F. Adeniyi' },
  { date: '20 Aug 2026', ref: 'FT-0207', product: 'RM-04 · PET Preform 28mm', location: 'Factory A', source: 'Factory trade', direction: 'Out', qty: 6000, by: 'A. Bello' },
  { date: '21 Aug 2026', ref: 'OS-1142', product: 'OS-01 · Sparkling Water 75cl', location: 'Showroom Ikeja', source: 'Outsource receipt', direction: 'In', qty: 320, by: 'F. Adeniyi' },
  { date: '22 Aug 2026', ref: 'RF-2478', product: 'ZF-101 · Citrus Drink 50cl', location: 'Factory A', source: 'Stock Refill', direction: 'In', qty: 195, by: 'A. Bello' },
  { date: '23 Aug 2026', ref: 'POS-88410', product: 'ZF-101 · Citrus Drink 50cl', location: 'Showroom Ikeja', source: 'POS sale', direction: 'Out', qty: 62, by: 'F. Adeniyi' },
]

/** §5.6.4 — staff records under internal audit. Status is deliberately explicit. */
export const staffMembers = [
  { value: 'st-1', label: 'F. Adeniyi', role: 'Cashier', showroom: 'Showroom Ikeja', joined: '04 Feb 2023' },
  { value: 'st-2', label: 'B. Okafor', role: 'Cashier', showroom: 'Showroom Lekki', joined: '19 Jun 2024' },
  { value: 'st-3', label: 'N. Eze', role: 'Cashier', showroom: 'Showroom Abuja', joined: '11 Jan 2025' },
  { value: 'st-4', label: 'R. Danladi', role: 'Accounts Officer', showroom: 'Showroom Ikeja', joined: '22 Aug 2021' },
  { value: 'st-5', label: 'A. Bello', role: 'Stock Keeper', showroom: 'Factory A', joined: '15 Mar 2020' },
]

export const violations = [
  {
    ref: 'VN-0072', staff: 'B. Okafor', showroom: 'Showroom Lekki', date: '22 Aug 2026',
    category: 'Dealer fund tampering', description: 'Wallet debit of ₦380,000 recorded against Owerri Beverage Depot without a matching withdrawal authorisation.',
    amount: 380000, raisedBy: 'System anomaly check', status: 'Under investigation', severity: 'High',
  },
  {
    ref: 'VN-0068', staff: 'B. Okafor', showroom: 'Showroom Lekki', date: '12 Aug 2026',
    category: 'Unauthorised discount', description: 'Instant discount of 18% applied at point of sale, above the 10% ceiling permitted for the role.',
    amount: 41200, raisedBy: 'R. Danladi', status: 'Substantiated', severity: 'Medium',
  },
  {
    ref: 'VN-0064', staff: 'N. Eze', showroom: 'Showroom Abuja', date: '06 Aug 2026',
    category: 'Cash shortfall', description: 'End-of-shift cash count short by ₦14,500 against recorded takings. Reconciled the following day.',
    amount: 14500, raisedBy: 'System reconciliation', status: 'Resolved', severity: 'Low',
  },
  {
    ref: 'VN-0059', staff: 'F. Adeniyi', showroom: 'Showroom Ikeja', date: '28 Jul 2026',
    category: 'Receipt voiding', description: 'Three receipts voided after payment confirmation within a single shift. Explained as customer cancellations and verified.',
    amount: 0, raisedBy: 'System anomaly check', status: 'Dismissed', severity: 'Low',
  },
  {
    ref: 'VN-0051', staff: 'N. Eze', showroom: 'Showroom Abuja', date: '14 Jul 2026',
    category: 'Unauthorised financial action', description: 'Petty cash payment processed without an approving officer recorded against the entry.',
    amount: 62000, raisedBy: 'Internal audit', status: 'Substantiated', severity: 'Medium',
  },
]

/** §5.6.5 — every debit against a dealer wallet, and who initiated it. */
export const walletWithdrawals = [
  { ref: 'WD-0331', date: '23 Aug 2026', dealer: 'Kano Central Distributors', amount: 450000, balanceBefore: 1690000, initiatedBy: 'Dealer', reason: 'Dealer withdrawal request', processedBy: 'R. Danladi', method: 'Bank transfer', otp: 'Verified', status: 'Completed' },
  { ref: 'WD-0328', date: '21 Aug 2026', dealer: 'Bendel Stores', amount: 120000, balanceBefore: 606500, initiatedBy: 'Company', reason: 'Recovery of excess commission', processedBy: 'M. Okonkwo', method: 'Wallet adjustment', otp: 'Not required', status: 'Completed' },
  { ref: 'WD-0324', date: '18 Aug 2026', dealer: 'Owerri Beverage Depot', amount: 380000, balanceBefore: 380000, initiatedBy: 'Company', reason: 'Settlement against outstanding invoice', processedBy: 'B. Okafor', method: 'Wallet adjustment', otp: 'Not required', status: 'Under review' },
  { ref: 'WD-0319', date: '14 Aug 2026', dealer: 'Bendel Stores', amount: 200000, balanceBefore: 806500, initiatedBy: 'Dealer', reason: 'Dealer withdrawal request', processedBy: 'R. Danladi', method: 'Bank transfer', otp: 'Verified', status: 'Completed' },
  { ref: 'WD-0312', date: '08 Aug 2026', dealer: 'Kano Central Distributors', amount: 275000, balanceBefore: 1965000, initiatedBy: 'Dealer', reason: 'Dealer withdrawal request', processedBy: 'R. Danladi', method: 'Cash', otp: 'Verified', status: 'Completed' },
  { ref: 'WD-0308', date: '02 Aug 2026', dealer: 'Bendel Stores', amount: 85000, balanceBefore: 891500, initiatedBy: 'Company', reason: 'Correction of over-credit', processedBy: 'M. Okonkwo', method: 'Wallet adjustment', otp: 'Not required', status: 'Completed' },
]
