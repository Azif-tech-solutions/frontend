// Cashier module placeholder data (PRD §5.4).

/** §5.4.1 — daily sales summary. Net = gross − discount; VAT is 7.5% of net. */
export const dailySales = [
  { date: '17 Aug 2026', showroom: 'Showroom Ikeja', transactions: 84, units: 1240, gross: 3180000, discount: 62000 },
  { date: '18 Aug 2026', showroom: 'Showroom Ikeja', transactions: 71, units: 980, gross: 2540000, discount: 0 },
  { date: '19 Aug 2026', showroom: 'Showroom Ikeja', transactions: 96, units: 1510, gross: 3920000, discount: 118000 },
  { date: '20 Aug 2026', showroom: 'Showroom Ikeja', transactions: 112, units: 1870, gross: 4640000, discount: 94000 },
  { date: '21 Aug 2026', showroom: 'Showroom Ikeja', transactions: 88, units: 1320, gross: 3410000, discount: 41000 },
  { date: '22 Aug 2026', showroom: 'Showroom Ikeja', transactions: 134, units: 2240, gross: 5820000, discount: 156000 },
  { date: '23 Aug 2026', showroom: 'Showroom Ikeja', transactions: 79, units: 1090, gross: 2870000, discount: 28000 },
]

/** Products a cashier can quote or sell, with current selling prices. */
export const sellableProducts = [
  { value: 'zf-101', label: 'ZF-101 · Citrus Drink 50cl', price: 2400.00, unit: 'Cartons' },
  { value: 'zf-102', label: 'ZF-102 · Citrus Drink 1L', price: 3950.00, unit: 'Cartons' },
  { value: 'zf-210', label: 'ZF-210 · Malt Classic 33cl', price: 2150.00, unit: 'Cartons' },
  { value: 'zf-315', label: 'ZF-315 · Ginger Blend 50cl', price: 2600.00, unit: 'Cartons' },
  { value: 'os-01', label: 'OS-01 · Sparkling Water 75cl', price: 2750.00, unit: 'Cartons' },
]

export const quoteCustomers = [
  { value: 'cu-1', label: 'Bendel Stores', type: 'Dealer', address: '7 Akpakpava Road, Benin City, Edo', contact: '+234 803 114 2200' },
  { value: 'cu-2', label: 'Kano Central Distributors', type: 'Dealer', address: '48 Murtala Mohammed Way, Kano', contact: '+234 802 447 1190' },
  { value: 'cu-3', label: 'Eko Hotels & Suites', type: 'Corporate', address: '1415 Adetokunbo Ademola St, Victoria Island', contact: '+234 701 220 8844' },
  { value: 'cu-4', label: 'Walk-in customer', type: 'Retail', address: '—', contact: '—' },
]

export const proformaHistory = [
  { ref: 'PF-2214', date: '23 Aug 2026', customer: 'Eko Hotels & Suites', items: 3, value: 1842000, validUntil: '30 Aug 2026', status: 'Sent' },
  { ref: 'PF-2211', date: '21 Aug 2026', customer: 'Bendel Stores', items: 2, value: 964000, validUntil: '28 Aug 2026', status: 'Converted' },
  { ref: 'PF-2208', date: '18 Aug 2026', customer: 'Kano Central Distributors', items: 4, value: 2410000, validUntil: '25 Aug 2026', status: 'Expired' },
  { ref: 'PF-2205', date: '15 Aug 2026', customer: 'Eko Hotels & Suites', items: 1, value: 386000, validUntil: '22 Aug 2026', status: 'Declined' },
]

/**
 * §5.4.3 — invoices whose goods were not all supplied at the point of sale.
 * `supplied` is the quantity already released across previous waybills.
 */
export const openInvoices = [
  {
    invoice: 'INV-31240', date: '09 Aug 2026', customer: 'Bendel Stores', customerType: 'Dealer',
    address: '7 Akpakpava Road, Benin City, Edo', contact: '+234 803 114 2200',
    lines: [
      { product: 'ZF-101 · Citrus Drink 50cl', unit: 'Cartons', purchased: 500, supplied: 300, price: 2400.00 },
      { product: 'ZF-102 · Citrus Drink 1L', unit: 'Cartons', purchased: 200, supplied: 200, price: 3950.00 },
      { product: 'ZF-210 · Malt Classic 33cl', unit: 'Cartons', purchased: 400, supplied: 0, price: 2150.00 },
    ],
    history: [
      { waybill: 'WB-9101', date: '10 Aug 2026', driver: 'Musa Danjuma', product: 'ZF-101 · Citrus Drink 50cl', qty: 300, receivedBy: 'K. Osagie' },
      { waybill: 'WB-9101', date: '10 Aug 2026', driver: 'Musa Danjuma', product: 'ZF-102 · Citrus Drink 1L', qty: 200, receivedBy: 'K. Osagie' },
    ],
  },
  {
    invoice: 'INV-31331', date: '20 Aug 2026', customer: 'Kano Central Distributors', customerType: 'Dealer',
    address: '48 Murtala Mohammed Way, Kano', contact: '+234 802 447 1190',
    lines: [
      { product: 'ZF-315 · Ginger Blend 50cl', unit: 'Cartons', purchased: 600, supplied: 240, price: 2600.00 },
      { product: 'OS-01 · Sparkling Water 75cl', unit: 'Cartons', purchased: 300, supplied: 0, price: 2750.00 },
    ],
    history: [
      { waybill: 'WB-9142', date: '21 Aug 2026', driver: 'Ibrahim Sule', product: 'ZF-315 · Ginger Blend 50cl', qty: 240, receivedBy: 'A. Yusuf' },
    ],
  },
  {
    invoice: 'INV-31366', date: '22 Aug 2026', customer: 'Eko Hotels & Suites', customerType: 'Corporate',
    address: '1415 Adetokunbo Ademola St, Victoria Island', contact: '+234 701 220 8844',
    lines: [
      { product: 'ZF-101 · Citrus Drink 50cl', unit: 'Cartons', purchased: 180, supplied: 0, price: 2400.00 },
      { product: 'ZF-210 · Malt Classic 33cl', unit: 'Cartons', purchased: 120, supplied: 0, price: 2150.00 },
    ],
    history: [],
  },
]
