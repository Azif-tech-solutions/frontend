// Electronic Invoicing placeholder data (PRD §5.10).
//
// `total` is VAT-inclusive and authoritative — it is the figure printed on the
// invoice and the amount the customer owes. Subtotal and VAT are derived from it.
//
// Scope note carried from the PRD: this phase is internal digital invoicing
// only. The regulatory identifier fields below (irn, cryptographicStamp, qrCode)
// are reserved in the shape the NRS/FIRS Merchant-Buyer Solution will need, but
// stay null — nothing is transmitted to an Access Point Provider in this phase.

export const INVOICE_STATUSES = ['Draft', 'Issued', 'Partially Paid', 'Paid', 'Overdue', 'Void']

export const STATUS_TONE = {
  Draft: 'neutral',
  Issued: 'info',
  'Partially Paid': 'warning',
  Paid: 'success',
  Overdue: 'danger',
  Void: 'neutral',
}

export const DELIVERY_TONE = {
  Sent: 'success',
  Failed: 'danger',
  'No email on file': 'warning',
  'Not sent': 'neutral',
}

/** Reserved for a future compliance phase; never populated in this build. */
const regulatoryPlaceholders = { irn: null, cryptographicStamp: null, qrCode: null, apSubmittedAt: null }

export const invoices = [
  {
    number: 'INV-31392', issued: '24 Aug 2026', due: '24 Aug 2026', customer: 'Bendel Stores', customerType: 'Authorised Dealer',
    email: 'accounts@bendelstores.ng', showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-4481', proforma: null,
    total: 980400, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'Sent', deliveredAt: '24 Aug 2026, 10:14', voidReason: null,
    payments: [{ date: '24 Aug 2026', method: 'Dealer wallet', amount: 980400 }],
    waybills: ['WB-9160'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31380', issued: '23 Aug 2026', due: '22 Sep 2026', customer: 'Bendel Stores', customerType: 'Authorised Dealer',
    email: 'accounts@bendelstores.ng', showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-4470', proforma: null,
    total: 960000, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'Sent', deliveredAt: '23 Aug 2026, 16:40', voidReason: null,
    payments: [{ date: '23 Aug 2026', method: 'Dealer wallet', amount: 960000 }],
    waybills: ['WB-9160'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31366', issued: '22 Aug 2026', due: '21 Sep 2026', customer: 'Eko Hotels & Suites', customerType: 'Special Customer',
    email: 'procurement@ekohotels.com', showroom: 'Showroom Lekki', source: 'Pro-forma', sourceRef: 'PF-2211', proforma: 'PF-2211',
    total: 5240000, vatRate: 7.5, issuedBy: 'B. Okafor', delivery: 'Sent', deliveredAt: '22 Aug 2026, 09:02', voidReason: null,
    payments: [{ date: '22 Aug 2026', method: 'Deposit drawdown', amount: 3000000 }],
    waybills: [], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31331', issued: '20 Aug 2026', due: '19 Sep 2026', customer: 'Kano Central Distributors', customerType: 'Authorised Dealer',
    email: 'finance@kanocentral.ng', showroom: 'Showroom Abuja', source: 'POS sale', sourceRef: 'TXN-4402', proforma: null,
    total: 2385000, vatRate: 7.5, issuedBy: 'N. Eze', delivery: 'Sent', deliveredAt: '20 Aug 2026, 14:28', voidReason: null,
    payments: [], waybills: ['WB-9142'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31300', issued: '18 Aug 2026', due: '17 Sep 2026', customer: 'Eko Hotels & Suites', customerType: 'Special Customer',
    email: 'procurement@ekohotels.com', showroom: 'Showroom Lekki', source: 'Pro-forma', sourceRef: 'PF-2205', proforma: 'PF-2205',
    total: 2970000, vatRate: 7.5, issuedBy: 'B. Okafor', delivery: 'Sent', deliveredAt: '18 Aug 2026, 11:47', voidReason: null,
    payments: [{ date: '18 Aug 2026', method: 'Deposit drawdown', amount: 2970000 }],
    waybills: ['WB-9130'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31290', issued: '15 Aug 2026', due: '14 Sep 2026', customer: 'Federal Secretariat Catering', customerType: 'Special Customer',
    email: 'catering.accounts@fedsec.gov.ng', showroom: 'Showroom Abuja', source: 'Pro-forma', sourceRef: 'PF-2198', proforma: 'PF-2198',
    total: 5400000, vatRate: 7.5, issuedBy: 'N. Eze', delivery: 'Failed', deliveredAt: '15 Aug 2026, 08:33', voidReason: null,
    payments: [{ date: '15 Aug 2026', method: 'Fund transfer', amount: 4990000 }],
    waybills: ['WB-9090'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31274', issued: '14 Aug 2026', due: '13 Sep 2026', customer: 'Ibadan Beverage Traders', customerType: 'Authorised Dealer',
    email: 'femi@ibadanbeverage.ng', showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-4361', proforma: null,
    total: 366000, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'Sent', deliveredAt: '14 Aug 2026, 15:05', voidReason: null,
    payments: [], waybills: ['WB-9118'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31240', issued: '09 Aug 2026', due: '08 Sep 2026', customer: 'Bendel Stores', customerType: 'Authorised Dealer',
    email: 'accounts@bendelstores.ng', showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-4288', proforma: null,
    total: 2340000, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'Sent', deliveredAt: '09 Aug 2026, 12:20', voidReason: null,
    payments: [{ date: '09 Aug 2026', method: 'Fund transfer', amount: 1550000 }, { date: '19 Aug 2026', method: 'Cash', amount: 790000 }],
    waybills: ['WB-9101'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31210', issued: '07 Aug 2026', due: '06 Sep 2026', customer: 'Kano Central Distributors', customerType: 'Authorised Dealer',
    email: 'finance@kanocentral.ng', showroom: 'Showroom Abuja', source: 'POS sale', sourceRef: 'TXN-4250', proforma: null,
    total: 31200, vatRate: 7.5, issuedBy: 'N. Eze', delivery: 'Sent', deliveredAt: '07 Aug 2026, 10:11',
    voidReason: 'Wrong item supplied — replaced by INV-31215 under void-and-reissue.',
    payments: [], waybills: [], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31188', issued: '03 Aug 2026', due: '02 Sep 2026', customer: 'Ibadan Beverage Traders', customerType: 'Authorised Dealer',
    email: 'femi@ibadanbeverage.ng', showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-4201', proforma: null,
    total: 474000, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'Sent', deliveredAt: '03 Aug 2026, 09:52', voidReason: null,
    payments: [{ date: '09 Aug 2026', method: 'POS', amount: 200000 }],
    waybills: ['WB-9080'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31022', issued: '19 Jul 2026', due: '18 Aug 2026', customer: 'Owerri Beverage Depot', customerType: 'Authorised Dealer',
    email: null, showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-3990', proforma: null,
    total: 234000, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'No email on file', deliveredAt: null, voidReason: null,
    payments: [{ date: '25 Jul 2026', method: 'Cash', amount: 42000 }],
    waybills: ['WB-8990'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-30944', issued: '02 Jul 2026', due: '01 Aug 2026', customer: 'Owerri Beverage Depot', customerType: 'Authorised Dealer',
    email: null, showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-3902', proforma: null,
    total: 432000, vatRate: 7.5, issuedBy: 'B. Okafor', delivery: 'No email on file', deliveredAt: null, voidReason: null,
    payments: [{ date: '18 Jun 2026', method: 'Cash', amount: 200000 }],
    waybills: ['WB-8912'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-30880', issued: '22 Jun 2026', due: '22 Jul 2026', customer: 'Owerri Beverage Depot', customerType: 'Authorised Dealer',
    email: null, showroom: 'Showroom Ikeja', source: 'POS sale', sourceRef: 'TXN-3810', proforma: null,
    total: 860000, vatRate: 7.5, issuedBy: 'F. Adeniyi', delivery: 'No email on file', deliveredAt: null, voidReason: null,
    payments: [], waybills: ['WB-8844'], ...regulatoryPlaceholders,
  },
  {
    number: 'INV-31401', issued: null, due: null, customer: 'Zenith Events Ltd', customerType: 'Special Customer',
    email: 'ops@zenithevents.ng', showroom: 'Showroom Lekki', source: 'Pro-forma', sourceRef: 'PF-2214', proforma: 'PF-2214',
    total: 1842000, vatRate: 7.5, issuedBy: 'B. Okafor', delivery: 'Not sent', deliveredAt: null, voidReason: null,
    payments: [], waybills: [], draft: true, ...regulatoryPlaceholders,
  },
]

/** Line detail for the invoice being previewed. */
export const invoiceLines = {
  'INV-31392': [
    { product: 'ZF-101 · Citrus Drink 50cl', qty: 300, unit: 'Cartons', price: 2280.00 },
    { product: 'ZF-210 · Malt Classic 33cl', qty: 110, unit: 'Cartons', price: 2040.00 },
  ],
  'INV-31331': [
    { product: 'ZF-315 · Ginger Blend 50cl', qty: 600, unit: 'Cartons', price: 2470.00 },
    { product: 'OS-01 · Sparkling Water 75cl', qty: 300, unit: 'Cartons', price: 2610.00 },
  ],
  'INV-31401': [
    { product: 'SP-03 · Ginger Blend 25cl', qty: 960, unit: 'Cartons', price: 1640.00 },
    { product: 'ZF-101 · Citrus Drink 50cl', qty: 60, unit: 'Cartons', price: 2400.00 },
  ],
}

export const emailTemplates = [
  { value: 'standard', label: 'Standard invoice notice' },
  { value: 'reminder', label: 'Payment reminder' },
  { value: 'statement', label: 'Statement of account' },
]
