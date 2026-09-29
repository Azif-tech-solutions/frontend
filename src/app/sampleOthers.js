// Others module placeholder data (PRD §5.7).

/** Customer classes the system recognises (see §5.7.14 Dealers Update). */
export const customerTypes = [
  { value: 'dealer', label: 'Authorised Dealer' },
  { value: 'special', label: 'Special Customer' },
  { value: 'ordinary', label: 'Ordinary Customer' },
  { value: 'nocredit', label: 'No Credit / Walk-in' },
]

export const customers = [
  { code: 'CU-0012', name: 'Bendel Stores', type: 'Authorised Dealer', phone: '+234 803 114 2200', address: '7 Akpakpava Road, Benin City, Edo', state: 'Edo', showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', since: '14 May 2022', wallet: 486500, deposit: 0, lifetime: 18420000, status: 'Active' },
  { code: 'CU-0019', name: 'Kano Central Distributors', type: 'Authorised Dealer', phone: '+234 802 447 1190', address: '48 Murtala Mohammed Way, Kano', state: 'Kano', showroom: 'Showroom Abuja', rep: 'Hauwa Ibrahim', since: '02 Nov 2022', wallet: 1240000, deposit: 0, lifetime: 24860000, status: 'Active' },
  { code: 'CU-0031', name: 'Owerri Beverage Depot', type: 'Authorised Dealer', phone: '+234 805 220 6612', address: '18 Douglas Road, Owerri, Imo', state: 'Imo', showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', since: '09 Mar 2024', wallet: 0, deposit: 0, lifetime: 4180000, status: 'Watch' },
  { code: 'CU-0044', name: 'Eko Hotels & Suites', type: 'Special Customer', phone: '+234 701 220 8844', address: '1415 Adetokunbo Ademola St, Victoria Island', state: 'Lagos', showroom: 'Showroom Lekki', rep: 'Tunde Bakare', since: '18 Jan 2025', wallet: 0, deposit: 6400000, lifetime: 12940000, status: 'Active' },
  { code: 'CU-0047', name: 'Zenith Events Ltd', type: 'Special Customer', phone: '+234 809 118 2277', address: '5 Ligali Ayorinde St, Victoria Island', state: 'Lagos', showroom: 'Showroom Lekki', rep: 'Tunde Bakare', since: '22 Apr 2025', wallet: 0, deposit: 1850000, lifetime: 3620000, status: 'Active' },
  { code: 'CU-0052', name: 'Federal Secretariat Catering', type: 'Special Customer', phone: '+234 803 991 4402', address: 'Phase 1, Federal Secretariat, Abuja', state: 'FCT', showroom: 'Showroom Abuja', rep: 'Hauwa Ibrahim', since: '11 Jul 2025', wallet: 0, deposit: 2740000, lifetime: 5810000, status: 'Active' },
  { code: 'CU-0088', name: 'Adaeze Nwosu', type: 'Ordinary Customer', phone: '+234 806 442 1180', address: '22 Ogunlana Drive, Surulere, Lagos', state: 'Lagos', showroom: 'Showroom Ikeja', rep: '—', since: '04 Feb 2026', wallet: 9600, deposit: 0, lifetime: 284000, status: 'Active' },
  { code: 'CU-0091', name: 'Chuka Obi', type: 'No Credit / Walk-in', phone: '+234 802 337 9910', address: '—', state: 'Lagos', showroom: 'Showroom Ikeja', rep: '—', since: '18 Aug 2026', wallet: 4300, deposit: 0, lifetime: 41200, status: 'Active' },
  { code: 'CU-0093', name: 'Walk-in — counter', type: 'No Credit / Walk-in', phone: '—', address: '—', state: '—', showroom: 'Showroom Ikeja', rep: '—', since: '—', wallet: 0, deposit: 0, lifetime: 9840000, status: 'Active' },
]

/** §5.7.1 — every activity recorded against a customer. */
export const customerTransactions = [
  { date: '23 Aug 2026', ref: 'INV-31380', customer: 'Bendel Stores', type: 'Purchase', description: 'Citrus Drink 50cl × 400', amount: 960000, method: 'Wallet', balance: 486500 },
  { date: '21 Aug 2026', ref: 'RT-0451', customer: 'Bendel Stores', type: 'Return', description: 'Citrus Drink 1L × 25 — damaged in transit', amount: -98750, method: 'Wallet credit', balance: 1446500 },
  { date: '19 Aug 2026', ref: 'WF-2204', customer: 'Bendel Stores', type: 'Wallet funding', description: 'Cash deposit at Guaranty Trust Bank', amount: 640000, method: 'Cash deposit', balance: 1347750 },
  { date: '14 Aug 2026', ref: 'WD-0319', customer: 'Bendel Stores', type: 'Withdrawal', description: 'Dealer withdrawal request', amount: -200000, method: 'Bank transfer', balance: 707750 },
  { date: '12 Aug 2026', ref: 'RT-0441', customer: 'Bendel Stores', type: 'Return', description: 'Citrus Drink 50cl × 60 — unsold stock', amount: -144000, method: 'Wallet credit', balance: 907750 },
  { date: '09 Aug 2026', ref: 'INV-31240', customer: 'Bendel Stores', type: 'Purchase', description: 'Mixed order, 1,100 cartons', amount: 2340000, method: 'Fund transfer', balance: 763750 },
  { date: '02 Aug 2026', ref: 'WD-0308', customer: 'Bendel Stores', type: 'Withdrawal', description: 'Correction of over-credit', amount: -85000, method: 'Wallet adjustment', balance: 3103750 },
]

/** §5.7.2 / §5.7.4 — dealer and special-customer activity, with payment split. */
export const distributorActivity = [
  { date: '23 Aug 2026', ref: 'INV-31380', customer: 'Bendel Stores', product: 'ZF-101 · Citrus Drink 50cl', qty: 400, value: 960000, cash: 0, pos: 0, transfer: 0, wallet: 960000, waybill: 'WB-9160' },
  { date: '20 Aug 2026', ref: 'INV-31331', customer: 'Kano Central Distributors', product: 'ZF-315 · Ginger Blend 50cl', qty: 600, value: 1560000, cash: 0, pos: 0, transfer: 1560000, wallet: 0, waybill: 'WB-9142' },
  { date: '20 Aug 2026', ref: 'INV-31331', customer: 'Kano Central Distributors', product: 'OS-01 · Sparkling Water 75cl', qty: 300, value: 825000, cash: 0, pos: 425000, transfer: 400000, wallet: 0, waybill: '—' },
  { date: '18 Aug 2026', ref: 'INV-31300', customer: 'Eko Hotels & Suites', product: 'SP-01 · Citrus Drink 33cl', qty: 1500, value: 2970000, cash: 0, pos: 0, transfer: 0, wallet: 0, deposit: 2970000, waybill: 'WB-9130' },
  { date: '12 Aug 2026', ref: 'INV-31266', customer: 'Zenith Events Ltd', product: 'SP-03 · Ginger Blend 25cl', qty: 960, value: 1574400, cash: 0, pos: 0, transfer: 0, wallet: 0, deposit: 1574400, waybill: 'WB-9110' },
  { date: '09 Aug 2026', ref: 'INV-31240', customer: 'Bendel Stores', product: 'ZF-102 · Citrus Drink 1L', qty: 200, value: 790000, cash: 240000, pos: 0, transfer: 550000, wallet: 0, waybill: 'WB-9101' },
  { date: '06 Aug 2026', ref: 'INV-31220', customer: 'Federal Secretariat Catering', product: 'SP-02 · Malt Classic 50cl', qty: 2400, value: 5400000, cash: 0, pos: 0, transfer: 0, wallet: 0, deposit: 5400000, waybill: 'WB-9090' },
]

/** §5.7.3 — walk-in / non-credit customer activity. */
export const walkInActivity = [
  { date: '23 Aug 2026', ref: 'RCP-88410', customer: 'Walk-in — counter', items: 4, qty: 62, value: 148000, method: 'Cash', cashier: 'F. Adeniyi' },
  { date: '23 Aug 2026', ref: 'RCP-88412', customer: 'Walk-in — counter', items: 2, qty: 40, value: 96500, method: 'POS', cashier: 'B. Okafor' },
  { date: '22 Aug 2026', ref: 'RCP-88399', customer: 'Walk-in — counter', items: 3, qty: 26, value: 62000, method: 'POS', cashier: 'N. Eze' },
  { date: '20 Aug 2026', ref: 'RCP-88370', customer: 'Chuka Obi', items: 1, qty: 8, value: 19200, method: 'Cash', cashier: 'F. Adeniyi' },
  { date: '18 Aug 2026', ref: 'RCP-88344', customer: 'Adaeze Nwosu', items: 2, qty: 14, value: 33600, method: 'Cash', cashier: 'F. Adeniyi' },
  { date: '17 Aug 2026', ref: 'RCP-88320', customer: 'Walk-in — counter', items: 5, qty: 88, value: 212400, method: 'Cash', cashier: 'B. Okafor' },
]

/** §5.7.5 / §5.7.6 — stock adjustments, per showroom and consolidated. */
export const adjustmentRecords = [
  { date: '23 Aug 2026', ref: 'QA-134', showroom: 'Showroom Ikeja', product: 'ZF-101 · Citrus Drink 50cl', direction: 'Negative', qty: 18, unit: 'Cartons', reason: 'Damaged / broken', note: 'Crushed during offloading', by: 'F. Adeniyi' },
  { date: '22 Aug 2026', ref: 'QA-133', showroom: 'Showroom Lekki', product: 'ZF-102 · Citrus Drink 1L', direction: 'Negative', qty: 6, unit: 'Cartons', reason: 'Expired stock write-off', note: 'Past best-before date', by: 'B. Okafor' },
  { date: '21 Aug 2026', ref: 'QA-131', showroom: 'Showroom Ikeja', product: 'OS-01 · Sparkling Water 75cl', direction: 'Positive', qty: 12, unit: 'Cartons', reason: 'Previous miscount correction', note: 'Recount at shift close', by: 'F. Adeniyi' },
  { date: '19 Aug 2026', ref: 'QA-129', showroom: 'Showroom Abuja', product: 'ZF-315 · Ginger Blend 50cl', direction: 'Negative', qty: 24, unit: 'Cartons', reason: 'Suspected theft / loss', note: 'Escalated to internal audit', by: 'N. Eze' },
  { date: '17 Aug 2026', ref: 'QA-126', showroom: 'Showroom Ikeja', product: 'ZF-210 · Malt Classic 33cl', direction: 'Negative', qty: 9, unit: 'Cartons', reason: 'Damaged / broken', note: 'Leaking cans', by: 'F. Adeniyi' },
  { date: '15 Aug 2026', ref: 'QA-124', showroom: 'Showroom Lekki', product: 'ZF-101 · Citrus Drink 50cl', direction: 'Positive', qty: 30, unit: 'Cartons', reason: 'Unrecorded return', note: 'Dealer return not logged at the time', by: 'B. Okafor' },
  { date: '12 Aug 2026', ref: 'QA-121', showroom: 'Showroom Abuja', product: 'OS-02 · Tonic Water 33cl', direction: 'Negative', qty: 15, unit: 'Cartons', reason: 'Stock take variance', note: 'Physical count below system', by: 'N. Eze' },
]

/** §5.7.7 — company-wide statement of comprehensive income. */
export const companyRevenue = [
  { label: 'Showroom sales', current: 25881000, prior: 22140000 },
  { label: 'Dealer and distributor sales', current: 14680000, prior: 12920000 },
  { label: 'Special production revenue', current: 3180000, prior: 2790000 },
  { label: 'By-product sales', current: 1265000, prior: 1050000 },
]

export const companyCostOfSales = [
  { label: 'Raw materials consumed', current: 9860000, prior: 8900000 },
  { label: 'Direct labour', current: 3240000, prior: 3010000 },
  { label: 'Factory overhead', current: 1940000, prior: 1700000 },
  { label: 'Outsourced stock purchases', current: 1993000, prior: 1640000 },
]

export const companyExpenses = [
  { label: 'Administrative expenses', current: 1220000, prior: 1150000 },
  { label: 'Maintenance & repairs', current: 620000, prior: 540000 },
  { label: 'Logistics & distribution', current: 940000, prior: 860000 },
  { label: 'Dealer commissions paid', current: 391180, prior: 486200 },
  { label: 'Depreciation', current: 780000, prior: 740000 },
]

export const companyStockValues = [
  { label: 'Factory stock at period end', current: 12480000, prior: 11260000 },
  { label: 'Showroom stock at period end', current: 7341440, prior: 6890000 },
]

/** §5.7.8 — reprintable copies of every document issued. */
export const transactionDocuments = [
  { ref: 'INV-31380', type: 'Invoice', date: '23 Aug 2026', party: 'Bendel Stores', showroom: 'Showroom Ikeja', value: 960000, issuedBy: 'F. Adeniyi', reprints: 0 },
  { ref: 'WB-9160', type: 'Waybill', date: '23 Aug 2026', party: 'Bendel Stores', showroom: 'Showroom Ikeja', value: 960000, issuedBy: 'F. Adeniyi', reprints: 1 },
  { ref: 'RCP-88410', type: 'Receipt', date: '23 Aug 2026', party: 'Walk-in — counter', showroom: 'Showroom Ikeja', value: 148000, issuedBy: 'F. Adeniyi', reprints: 0 },
  { ref: 'PF-2214', type: 'Pro-forma', date: '23 Aug 2026', party: 'Eko Hotels & Suites', showroom: 'Showroom Lekki', value: 1842000, issuedBy: 'B. Okafor', reprints: 2 },
  { ref: 'WB-9142', type: 'Waybill', date: '21 Aug 2026', party: 'Kano Central Distributors', showroom: 'Showroom Abuja', value: 1560000, issuedBy: 'N. Eze', reprints: 0 },
  { ref: 'INV-31331', type: 'Invoice', date: '20 Aug 2026', party: 'Kano Central Distributors', showroom: 'Showroom Abuja', value: 2385000, issuedBy: 'N. Eze', reprints: 1 },
  { ref: 'INV-31300', type: 'Invoice', date: '18 Aug 2026', party: 'Eko Hotels & Suites', showroom: 'Showroom Lekki', value: 2970000, issuedBy: 'B. Okafor', reprints: 0 },
  { ref: 'WB-9101', type: 'Waybill', date: '10 Aug 2026', party: 'Bendel Stores', showroom: 'Showroom Ikeja', value: 1510000, issuedBy: 'F. Adeniyi', reprints: 3 },
]

/** §5.7.9 — physical cash banked from daily takings. */
export const cashTransfers = [
  { date: '22 Aug 2026', ref: 'LDG-3347', showroom: 'Showroom Ikeja', takings: 1840000, banked: 1800000, retained: 40000, bank: 'Zenith Bank', account: '1014482201', depositedBy: 'F. Adeniyi', teller: 'ZB-77120', status: 'Confirmed' },
  { date: '15 Aug 2026', ref: 'LDG-3330', showroom: 'Showroom Ikeja', takings: 1450000, banked: 1400000, retained: 50000, bank: 'Zenith Bank', account: '1014482201', depositedBy: 'F. Adeniyi', teller: 'ZB-76884', status: 'Confirmed' },
  { date: '11 Aug 2026', ref: 'LDG-3318', showroom: 'Showroom Ikeja', takings: 940000, banked: 900000, retained: 40000, bank: 'Zenith Bank', account: '1014482201', depositedBy: 'B. Okafor', teller: 'ZB-76512', status: 'Confirmed' },
  { date: '04 Aug 2026', ref: 'LDG-3301', showroom: 'Showroom Ikeja', takings: 1240000, banked: 1200000, retained: 40000, bank: 'Zenith Bank', account: '1014482201', depositedBy: 'F. Adeniyi', teller: 'ZB-76140', status: 'Confirmed' },
  { date: '23 Aug 2026', ref: 'LDG-3352', showroom: 'Showroom Lekki', takings: 880000, banked: 850000, retained: 30000, bank: 'Guaranty Trust Bank', account: '0221904471', depositedBy: 'B. Okafor', teller: '—', status: 'Awaiting confirmation' },
]

/** §5.7.10 — estimated selling prices across the catalogue. */
export const priceList = [
  { code: 'ZF-101', product: 'Citrus Drink 50cl', group: 'Citrus Drink', unit: 'Cartons', cost: 1850.00, price: 2400.00, dealerPrice: 2280.00, effective: '01 Aug 2026' },
  { code: 'ZF-102', product: 'Citrus Drink 1L', group: 'Citrus Drink', unit: 'Cartons', cost: 3120.00, price: 3950.00, dealerPrice: 3750.00, effective: '01 Aug 2026' },
  { code: 'ZF-210', product: 'Malt Classic 33cl', group: 'Malt Classic', unit: 'Cartons', cost: 1640.00, price: 2150.00, dealerPrice: 2040.00, effective: '01 Aug 2026' },
  { code: 'ZF-315', product: 'Ginger Blend 50cl', group: 'Citrus Drink', unit: 'Cartons', cost: 1980.00, price: 2600.00, dealerPrice: 2470.00, effective: '01 Aug 2026' },
  { code: 'ZF-420', product: 'Cocoa Wafer 40g', group: 'Cocoa Wafer', unit: 'Pieces', cost: 210.00, price: 320.00, dealerPrice: 304.00, effective: '15 Aug 2026' },
  { code: 'OS-01', product: 'Sparkling Water 75cl', group: 'Outsourced', unit: 'Cartons', cost: 1980.00, price: 2750.00, dealerPrice: 2610.00, effective: '01 Aug 2026' },
  { code: 'OS-02', product: 'Tonic Water 33cl', group: 'Outsourced', unit: 'Cartons', cost: 1450.00, price: 2050.00, dealerPrice: 1950.00, effective: '01 Aug 2026' },
]

/** §5.7.11 — transactions currently open at a till, awaiting payment. */
export const liveTransactions = [
  { ref: 'TXN-4471', cashier: 'F. Adeniyi', showroom: 'Showroom Ikeja', customer: 'Eko Hotels & Suites', customerType: 'Special Customer', items: 4, subtotal: 1284000, started: '2 min ago' },
  { ref: 'TXN-4472', cashier: 'B. Okafor', showroom: 'Showroom Ikeja', customer: 'Walk-in — counter', customerType: 'No Credit / Walk-in', items: 2, subtotal: 86400, started: '5 min ago' },
  { ref: 'TXN-4473', cashier: 'N. Eze', showroom: 'Showroom Abuja', customer: 'Kano Central Distributors', customerType: 'Authorised Dealer', items: 7, subtotal: 2418000, started: '9 min ago' },
]

export const discountHistory = [
  { date: '23 Aug 2026', ref: 'DS-0221', cashier: 'F. Adeniyi', customer: 'Eko Hotels & Suites', original: 1842000, discount: 92100, pct: 5.0, approvedBy: 'M. Okonkwo', reason: 'Contract volume pricing' },
  { date: '22 Aug 2026', ref: 'DS-0218', cashier: 'N. Eze', customer: 'Kano Central Distributors', original: 2920000, discount: 87600, pct: 3.0, approvedBy: 'M. Okonkwo', reason: 'Bulk order concession' },
  { date: '19 Aug 2026', ref: 'DS-0214', cashier: 'B. Okafor', customer: 'Bendel Stores', original: 964000, discount: 48200, pct: 5.0, approvedBy: 'T. Adeyemi', reason: 'Long-standing dealer' },
]

/** §5.7.12 — commission earned but not yet paid out. */
export const unpaidCommissions = [
  { agent: 'Adaeze Nwankwo', code: 'CR-011', region: 'Lagos Mainland', period: 'August 2026', sales: 8420000, earned: 147520, paid: 0, dealers: 6 },
  { agent: 'Tunde Bakare', code: 'CR-014', region: 'Lagos Island', period: 'August 2026', sales: 6180000, earned: 98400, paid: 0, dealers: 4 },
  { agent: 'Hauwa Ibrahim', code: 'CR-018', region: 'North Central', period: 'August 2026', sales: 11240000, earned: 181340, paid: 40000, dealers: 5 },
  { agent: 'Adaeze Nwankwo', code: 'CR-011', region: 'Lagos Mainland', period: 'July 2026', sales: 7960000, earned: 139300, paid: 139300, dealers: 6 },
  { agent: 'Tunde Bakare', code: 'CR-014', region: 'Lagos Island', period: 'July 2026', sales: 5420000, earned: 86720, paid: 60000, dealers: 4 },
]

/** §5.7.13 — sales rep activity and revenue contribution. */
export const repActivity = [
  { rep: 'Adaeze Nwankwo', showroom: 'Showroom Ikeja', customer: 'Bendel Stores', newCustomer: false, transactions: 14, units: 2870, revenue: 6840000 },
  { rep: 'Adaeze Nwankwo', showroom: 'Showroom Ikeja', customer: 'Owerri Beverage Depot', newCustomer: true, transactions: 5, units: 640, revenue: 1580000 },
  { rep: 'Tunde Bakare', showroom: 'Showroom Lekki', customer: 'Eko Hotels & Suites', newCustomer: false, transactions: 9, units: 3200, revenue: 4920000 },
  { rep: 'Tunde Bakare', showroom: 'Showroom Lekki', customer: 'Zenith Events Ltd', newCustomer: true, transactions: 3, units: 960, revenue: 1260000 },
  { rep: 'Hauwa Ibrahim', showroom: 'Showroom Abuja', customer: 'Kano Central Distributors', newCustomer: false, transactions: 18, units: 4180, revenue: 9640000 },
  { rep: 'Hauwa Ibrahim', showroom: 'Showroom Abuja', customer: 'Federal Secretariat Catering', newCustomer: false, transactions: 6, units: 2400, revenue: 1600000 },
]

/** §7.5.15 — goods sold and later returned. */
export const returnRecords = [
  { date: '23 Aug 2026', ref: 'RT-0455', originalInvoice: 'RCP-88390', customer: 'Adaeze Nwosu', customerType: 'Ordinary Customer', product: 'ZF-101 · Citrus Drink 50cl', qty: 4, value: 9600, reason: 'Product defect', condition: 'Damaged — write off', showroom: 'Showroom Ikeja', creditedTo: 'Temporary wallet' },
  { date: '21 Aug 2026', ref: 'RT-0451', originalInvoice: 'INV-31240', customer: 'Bendel Stores', customerType: 'Authorised Dealer', product: 'ZF-102 · Citrus Drink 1L', qty: 25, value: 98750, reason: 'Damaged in transit', condition: 'Damaged — write off', showroom: 'Showroom Ikeja', creditedTo: 'Dealer wallet' },
  { date: '18 Aug 2026', ref: 'RT-0447', originalInvoice: 'RCP-88301', customer: 'Chuka Obi', customerType: 'No Credit / Walk-in', product: 'ZF-210 · Malt Classic 33cl', qty: 2, value: 4300, reason: 'Customer dissatisfaction', condition: 'Resaleable', showroom: 'Showroom Ikeja', creditedTo: 'Temporary wallet' },
  { date: '12 Aug 2026', ref: 'RT-0441', originalInvoice: 'INV-31198', customer: 'Bendel Stores', customerType: 'Authorised Dealer', product: 'ZF-101 · Citrus Drink 50cl', qty: 60, value: 144000, reason: 'Unsold stock — agreed return', condition: 'Resaleable', showroom: 'Showroom Ikeja', creditedTo: 'Dealer wallet' },
  { date: '07 Aug 2026', ref: 'RT-0434', originalInvoice: 'INV-31210', customer: 'Kano Central Distributors', customerType: 'Authorised Dealer', product: 'ZF-315 · Ginger Blend 50cl', qty: 12, value: 31200, reason: 'Wrong item supplied', condition: 'Resaleable', showroom: 'Showroom Abuja', creditedTo: 'Dealer wallet' },
]

/** §5.7.16 — goods sourced from external vendors. */
export const outsourceRecords = [
  { date: '21 Aug 2026', ref: 'OS-1142', product: 'OS-01 · Sparkling Water 75cl', vendor: 'Aquavita Bottling Co.', qty: 320, unit: 'Cartons', unitCost: 1980.00, price: 2750.00, showroom: 'Showroom Ikeja', sold: 180, status: 'In stock' },
  { date: '17 Aug 2026', ref: 'OS-1139', product: 'OS-03 · Fruit Cordial 1L', vendor: 'Sunshine Foods Ltd', qty: 150, unit: 'Cartons', unitCost: 5200.00, price: 6800.00, showroom: 'Showroom Ikeja', sold: 0, status: 'Suspended' },
  { date: '12 Aug 2026', ref: 'OS-1135', product: 'OS-02 · Tonic Water 33cl', vendor: 'Aquavita Bottling Co.', qty: 400, unit: 'Cartons', unitCost: 1450.00, price: 2050.00, showroom: 'Showroom Ikeja', sold: 260, status: 'In stock' },
  { date: '06 Aug 2026', ref: 'OS-1128', product: 'OS-04 · Ginger Ale 33cl', vendor: 'Aquavita Bottling Co.', qty: 280, unit: 'Cartons', unitCost: 1620.00, price: 2280.00, showroom: 'Showroom Lekki', sold: 280, status: 'Sold out' },
]

/** §5.7.18 — OTP requests for wallet withdrawals and quantity adjustments. */
export const otpRequests = [
  { ref: 'OTP-0912', requested: '24 Aug 2026, 09:14', requester: 'R. Danladi', role: 'Accounts Officer', purpose: 'Wallet withdrawal', target: 'Kano Central Distributors', amount: 450000, code: '——————', status: 'Awaiting generation', expires: '—' },
  { ref: 'OTP-0910', requested: '24 Aug 2026, 08:40', requester: 'F. Adeniyi', role: 'Stock Keeper', purpose: 'Quantity adjustment', target: 'ZF-101 · Citrus Drink 50cl', amount: 0, code: '——————', status: 'Awaiting generation', expires: '—' },
  { ref: 'OTP-0908', requested: '23 Aug 2026, 16:22', requester: 'R. Danladi', role: 'Accounts Officer', purpose: 'Wallet withdrawal', target: 'Bendel Stores', amount: 120000, code: '４８２１０６', status: 'Sent', expires: '23 Aug 2026, 16:37' },
  { ref: 'OTP-0905', requested: '22 Aug 2026, 11:08', requester: 'B. Okafor', role: 'Cashier', purpose: 'Wallet withdrawal', target: 'Owerri Beverage Depot', amount: 380000, code: '——————', status: 'Used', expires: '22 Aug 2026, 11:23' },
  { ref: 'OTP-0901', requested: '21 Aug 2026, 14:45', requester: 'N. Eze', role: 'Stock Keeper', purpose: 'Quantity adjustment', target: 'OS-02 · Tonic Water 33cl', amount: 0, code: '——————', status: 'Expired', expires: '21 Aug 2026, 15:00' },
]
