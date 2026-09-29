// Process Guide module placeholder data (PRD §5.5).

/** §5.5.1 — daily rates of other currencies to NGN. */
export const exchangeRates = [
  { code: 'USD', currency: 'US Dollar', symbol: '$', buy: 1478.50, sell: 1492.00, previous: 1471.20, updated: '24 Aug 2026, 08:15', updatedBy: 'M. Okonkwo' },
  { code: 'GBP', currency: 'Pound Sterling', symbol: '£', buy: 1886.40, sell: 1904.75, previous: 1892.10, updated: '24 Aug 2026, 08:15', updatedBy: 'M. Okonkwo' },
  { code: 'EUR', currency: 'Euro', symbol: '€', buy: 1602.30, sell: 1618.90, previous: 1598.45, updated: '24 Aug 2026, 08:15', updatedBy: 'M. Okonkwo' },
  { code: 'CNY', currency: 'Chinese Yuan', symbol: '¥', buy: 204.15, sell: 208.60, previous: 205.80, updated: '23 Aug 2026, 16:40', updatedBy: 'T. Adeyemi' },
  { code: 'ZAR', currency: 'South African Rand', symbol: 'R', buy: 79.85, sell: 82.10, previous: 79.40, updated: '23 Aug 2026, 16:40', updatedBy: 'T. Adeyemi' },
  { code: 'GHS', currency: 'Ghanaian Cedi', symbol: '₵', buy: 96.20, sell: 99.05, previous: 96.20, updated: '21 Aug 2026, 09:05', updatedBy: 'T. Adeyemi' },
]

/** §5.5.3 — showrooms, with branch codes generated on registration. */
export const showroomRegister = [
  { code: 'BR-001', name: 'Showroom Ikeja', address: '14 Awolowo Way, Ikeja, Lagos', state: 'Lagos', manager: 'F. Adeniyi', phone: '+234 802 114 0021', opened: '12 Mar 2019', vatRate: '7.5%', status: 'Active' },
  { code: 'BR-002', name: 'Showroom Lekki', address: '3B Admiralty Way, Lekki Phase 1, Lagos', state: 'Lagos', manager: 'B. Okafor', phone: '+234 803 220 8814', opened: '04 Sep 2020', vatRate: '7.5%', status: 'Active' },
  { code: 'BR-003', name: 'Showroom Abuja', address: '22 Gimbiya Street, Area 11, Garki, Abuja', state: 'FCT', manager: 'N. Eze', phone: '+234 806 771 3390', opened: '21 Jan 2022', vatRate: '7.5%', status: 'Active' },
  { code: 'BR-004', name: 'Showroom Port Harcourt', address: '9 Aba Road, Port Harcourt, Rivers', state: 'Rivers', manager: '—', phone: '+234 809 445 2201', opened: '—', vatRate: '0%', status: 'Pending opening' },
]

export const nigerianStates = [
  { value: 'lagos', label: 'Lagos' }, { value: 'fct', label: 'FCT — Abuja' },
  { value: 'rivers', label: 'Rivers' }, { value: 'kano', label: 'Kano' },
  { value: 'edo', label: 'Edo' }, { value: 'ogun', label: 'Ogun' },
  { value: 'oyo', label: 'Oyo' }, { value: 'anambra', label: 'Anambra' },
]

/** §5.5.4 — commission rate assigned to each finished product. */
export const commissionGuide = [
  { code: 'ZF-101', product: 'Citrus Drink 50cl', group: 'Citrus Drink', unit: 'Cartons', price: 2400.00, rateType: 'Per unit', rate: 45.00, effective: '01 Aug 2026', status: 'Active' },
  { code: 'ZF-102', product: 'Citrus Drink 1L', group: 'Citrus Drink', unit: 'Cartons', price: 3950.00, rateType: 'Per unit', rate: 70.00, effective: '01 Aug 2026', status: 'Active' },
  { code: 'ZF-210', product: 'Malt Classic 33cl', group: 'Malt Classic', unit: 'Cartons', price: 2150.00, rateType: 'Per unit', rate: 38.00, effective: '01 Aug 2026', status: 'Active' },
  { code: 'ZF-315', product: 'Ginger Blend 50cl', group: 'Citrus Drink', unit: 'Cartons', price: 2600.00, rateType: 'Percentage', rate: 2.0, effective: '01 Aug 2026', status: 'Active' },
  { code: 'ZF-420', product: 'Cocoa Wafer 40g', group: 'Cocoa Wafer', unit: 'Pieces', price: 320.00, rateType: 'Per unit', rate: 4.50, effective: '15 Aug 2026', status: 'Active' },
  { code: 'OS-01', product: 'Sparkling Water 75cl', group: 'Outsourced', unit: 'Cartons', price: 2750.00, rateType: 'Percentage', rate: 1.5, effective: '01 Jul 2026', status: 'Inactive' },
]

/** §5.5.5 — quantities each dealer sold in the period, for the allocation run. */
export const commissionSales = [
  { dealer: 'Bendel Stores', code: 'ZF-101', qty: 1840 },
  { dealer: 'Bendel Stores', code: 'ZF-102', qty: 620 },
  { dealer: 'Bendel Stores', code: 'ZF-315', qty: 410 },
  { dealer: 'Kano Central Distributors', code: 'ZF-101', qty: 2260 },
  { dealer: 'Kano Central Distributors', code: 'ZF-210', qty: 1480 },
  { dealer: 'Kano Central Distributors', code: 'ZF-420', qty: 5200 },
  { dealer: 'Owerri Beverage Depot', code: 'ZF-102', qty: 380 },
  { dealer: 'Owerri Beverage Depot', code: 'ZF-210', qty: 940 },
]

export const commissionRuns = [
  { ref: 'CA-0088', period: 'July 2026', dealers: 3, total: 486200.00, runOn: '02 Aug 2026', runBy: 'M. Okonkwo', status: 'Paid' },
  { ref: 'CA-0084', period: 'June 2026', dealers: 3, total: 412750.00, runOn: '03 Jul 2026', runBy: 'M. Okonkwo', status: 'Paid' },
  { ref: 'CA-0079', period: 'May 2026', dealers: 2, total: 298400.00, runOn: '04 Jun 2026', runBy: 'T. Adeyemi', status: 'Paid' },
]

/** §5.5.6 — product records flagged as containing errors. */
export const productErrors = [
  { id: 'ER-041', code: 'ZF-315', field: 'Product name', current: 'Ginger Blnd 50cl', suggested: 'Ginger Blend 50cl', flaggedBy: 'System spell check', flagged: '23 Aug 2026', usedIn: 42, severity: 'Spelling' },
  { id: 'ER-039', code: 'RM-03', field: 'Description', current: 'Concentrate — Citrs', suggested: 'Concentrate — Citrus', flaggedBy: 'K. Umeh', flagged: '22 Aug 2026', usedIn: 18, severity: 'Spelling' },
  { id: 'ER-036', code: 'OS-02', field: 'Product name', current: 'Tonic Water 33cl (bottled by Aquavitta)', suggested: 'Tonic Water 33cl (bottled by Aquavita)', flaggedBy: 'F. Adeniyi', flagged: '21 Aug 2026', usedIn: 9, severity: 'Spelling' },
  { id: 'ER-034', code: 'ZF-420', field: 'Unit', current: 'Peices', suggested: 'Pieces', flaggedBy: 'System spell check', flagged: '20 Aug 2026', usedIn: 61, severity: 'Spelling' },
  { id: 'ER-031', code: 'RM-06', field: 'Description', current: 'Coco Powder', suggested: 'Cocoa Powder', flaggedBy: 'A. Bello', flagged: '18 Aug 2026', usedIn: 27, severity: 'Naming' },
]

/** §5.5.7 — deleted products held for recovery, and products suspended from sale. */
export const deletedItems = [
  { code: 'ZF-505', product: 'Citrus Drink 25cl (discontinued)', qty: 148, unitCost: 1240.00, deletedBy: 'M. Okonkwo', deleted: '19 Aug 2026', reason: 'Discontinued line', retention: '18 Sep 2026' },
  { code: 'OS-07', product: 'Lemon Tonic 33cl', qty: 62, unitCost: 1380.00, deletedBy: 'F. Adeniyi', deleted: '14 Aug 2026', reason: 'Partner contract ended', retention: '13 Sep 2026' },
  { code: 'RM-11', product: 'Artificial Sweetener', qty: 0, unitCost: 8400.00, deletedBy: 'K. Umeh', deleted: '08 Aug 2026', reason: 'Replaced by RM-02', retention: '07 Sep 2026' },
]

export const suspendedProducts = [
  { code: 'OS-03', product: 'Fruit Cordial 1L', qty: 150, unitCost: 5200.00, price: 6800.00, suspendedBy: 'M. Okonkwo', suspended: '22 Aug 2026', reason: 'Exchange rate volatility — imported input', review: '01 Sep 2026' },
  { code: 'ZF-420', product: 'Cocoa Wafer 40g', qty: 7900, unitCost: 210.00, price: 320.00, suspendedBy: 'M. Okonkwo', suspended: '20 Aug 2026', reason: 'Monitoring market demand before repricing', review: '30 Aug 2026' },
]

/** §5.5.8 — sales representatives and their assignments. */
export const correspondents = [
  { code: 'CR-011', name: 'Adaeze Nwankwo', phone: '+234 803 441 2290', region: 'Lagos Mainland', showroom: 'Showroom Ikeja', dealers: 6, assigned: '04 Feb 2025', status: 'Assigned' },
  { code: 'CR-014', name: 'Tunde Bakare', phone: '+234 802 118 7734', region: 'Lagos Island', showroom: 'Showroom Lekki', dealers: 4, assigned: '19 Jun 2025', status: 'Assigned' },
  { code: 'CR-018', name: 'Hauwa Ibrahim', phone: '+234 806 220 4418', region: 'North Central', showroom: 'Showroom Abuja', dealers: 5, assigned: '11 Jan 2026', status: 'Assigned' },
  { code: 'CR-022', name: 'Chidi Okeke', phone: '+234 809 337 1102', region: 'South East', showroom: '—', dealers: 0, assigned: '—', status: 'Unassigned' },
  { code: 'CR-009', name: 'Femi Alabi', phone: '+234 805 662 9930', region: 'South West', showroom: '—', dealers: 0, assigned: '02 Sep 2024', status: 'De-assigned' },
]

export const regions = [
  { value: 'lagos-mainland', label: 'Lagos Mainland' },
  { value: 'lagos-island', label: 'Lagos Island' },
  { value: 'north-central', label: 'North Central' },
  { value: 'north-west', label: 'North West' },
  { value: 'south-east', label: 'South East' },
  { value: 'south-south', label: 'South South' },
  { value: 'south-west', label: 'South West' },
]

/** §5.5.9 — VAT configuration per showroom. */
export const vatSettings = [
  { code: 'BR-001', showroom: 'Showroom Ikeja', rate: 7.5, enabled: true, effective: '01 Jan 2026', updatedBy: 'M. Okonkwo', registration: 'NG-VAT-4471029' },
  { code: 'BR-002', showroom: 'Showroom Lekki', rate: 7.5, enabled: true, effective: '01 Jan 2026', updatedBy: 'M. Okonkwo', registration: 'NG-VAT-4471029' },
  { code: 'BR-003', showroom: 'Showroom Abuja', rate: 7.5, enabled: true, effective: '01 Jan 2026', updatedBy: 'T. Adeyemi', registration: 'NG-VAT-4471030' },
  { code: 'BR-004', showroom: 'Showroom Port Harcourt', rate: 0, enabled: false, effective: '—', updatedBy: '—', registration: '—' },
]
