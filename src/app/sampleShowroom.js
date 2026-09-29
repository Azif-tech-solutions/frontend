// Showroom module placeholder data (PRD §5.2). Separate from sample.js to keep
// the factory dataset legible as the app grows.

export const showrooms = [
  { value: 'sr-ikeja', label: 'Showroom Ikeja', address: '14 Awolowo Way, Ikeja, Lagos' },
  { value: 'sr-lekki', label: 'Showroom Lekki', address: '3B Admiralty Way, Lekki Phase 1, Lagos' },
  { value: 'sr-abuja', label: 'Showroom Abuja', address: '22 Gimbiya Street, Area 11, Garki, Abuja' },
]

export const CURRENT_SHOWROOM = 'Showroom Ikeja'

export const storageAreas = [
  { value: 'shop', label: 'Shop floor' },
  { value: 'warehouse', label: 'Warehouse' },
]

/** §5.2.1 — dispatched consignments awaiting confirmation at this showroom. */
export const incomingConsignments = [
  {
    waybill: 'WB-8942', origin: 'Factory A — Ikeja', originType: 'Factory', driver: 'Musa Danjuma', vehicle: 'LAG-482-XA',
    dispatched: '24 Aug 2026', status: 'Awaiting receipt',
    lines: [
      { product: 'ZF-101 · Citrus Drink 50cl', batch: 'B-3390', sent: 300, unit: 'Cartons' },
      { product: 'ZF-210 · Malt Classic 33cl', batch: 'B-3328', sent: 180, unit: 'Cartons' },
    ],
  },
  {
    waybill: 'WB-8938', origin: 'Showroom Lekki', originType: 'Showroom', driver: 'Emeka Nwosu', vehicle: 'LAG-771-KJ',
    dispatched: '23 Aug 2026', status: 'Awaiting receipt',
    lines: [
      { product: 'ZF-102 · Citrus Drink 1L', batch: 'B-3311', sent: 60, unit: 'Cartons' },
    ],
  },
]

export const receivedConsignments = [
  { waybill: 'WB-8867', origin: 'Factory A — Ikeja', originType: 'Factory', dispatched: '09 Aug 2026', received: '10 Aug 2026', product: 'ZF-210 · Malt Classic 33cl', sent: 400, accepted: 400, rejected: 0, receivedBy: 'F. Adeniyi' },
  { waybill: 'WB-8844', origin: 'Factory A — Ikeja', originType: 'Factory', dispatched: '06 Aug 2026', received: '07 Aug 2026', product: 'ZF-102 · Citrus Drink 1L', sent: 155, accepted: 150, rejected: 5, receivedBy: 'F. Adeniyi' },
  { waybill: 'WB-8830', origin: 'Showroom Abuja', originType: 'Showroom', dispatched: '02 Aug 2026', received: '04 Aug 2026', product: 'ZF-315 · Ginger Blend 50cl', sent: 90, accepted: 88, rejected: 2, receivedBy: 'B. Okafor' },
]

/** §5.2.2 — third-party products, not registered in the company catalogue. */
export const externalSuppliers = [
  { value: 'ex-1', label: 'Chi Limited' },
  { value: 'ex-2', label: 'Rite Foods Ltd' },
  { value: 'ex-3', label: 'La Casera Company' },
  { value: 'ex-4', label: 'Independent local vendor' },
]

export const directEntries = [
  { date: '20 Aug 2026', ref: 'DE-0331', product: 'Chivita 100% Orange 1L', supplier: 'Chi Limited', qty: 240, unit: 'Cartons', unitCost: 4200.00, invoice: 'CHI-88214', enteredBy: 'F. Adeniyi' },
  { date: '16 Aug 2026', ref: 'DE-0328', product: 'Bigi Cola 60cl', supplier: 'Rite Foods Ltd', qty: 400, unit: 'Cartons', unitCost: 2650.00, invoice: 'RF-30112', enteredBy: 'F. Adeniyi' },
  { date: '11 Aug 2026', ref: 'DE-0322', product: 'La Casera Apple 50cl', supplier: 'La Casera Company', qty: 180, unit: 'Cartons', unitCost: 3100.00, invoice: 'LC-7741', enteredBy: 'B. Okafor' },
]

/** §5.2.5 — outsourced products the company has formally registered. */
export const outsourcedProducts = [
  { value: 'os-01', label: 'OS-01 · Sparkling Water 75cl (bottled by Aquavita)', unitCost: 1980.00 },
  { value: 'os-02', label: 'OS-02 · Tonic Water 33cl (bottled by Aquavita)', unitCost: 1450.00 },
  { value: 'os-03', label: 'OS-03 · Fruit Cordial 1L (blended by Sunshine Foods)', unitCost: 5200.00 },
  { value: 'os-04', label: 'OS-04 · Ginger Ale 33cl (bottled by Aquavita)', unitCost: 1620.00 },
]

export const outsourcePartners = [
  { value: 'op-1', label: 'Aquavita Bottling Co.' },
  { value: 'op-2', label: 'Sunshine Foods Ltd' },
]

export const outsourceReceipts = [
  { date: '21 Aug 2026', ref: 'OS-1142', product: 'OS-01 · Sparkling Water 75cl', partner: 'Aquavita Bottling Co.', qty: 320, unit: 'Cartons', unitCost: 1980.00, batch: 'AQ-2210', expiry: '21 Aug 2027', receivedBy: 'F. Adeniyi' },
  { date: '17 Aug 2026', ref: 'OS-1139', product: 'OS-03 · Fruit Cordial 1L', partner: 'Sunshine Foods Ltd', qty: 150, unit: 'Cartons', unitCost: 5200.00, batch: 'SF-0884', expiry: '17 Feb 2027', receivedBy: 'F. Adeniyi' },
  { date: '12 Aug 2026', ref: 'OS-1135', product: 'OS-02 · Tonic Water 33cl', partner: 'Aquavita Bottling Co.', qty: 400, unit: 'Cartons', unitCost: 1450.00, batch: 'AQ-2188', expiry: '12 Aug 2027', receivedBy: 'B. Okafor' },
]

/** §5.2.6 — live showroom stock across shop floor and warehouse. */
export const showroomStock = [
  { detail: 'ZF-101 · Citrus Drink 50cl', group: 'Citrus Drink', source: 'Finished Product', area: 'Shop floor', qty: 420, unitCost: 1850.00, price: 2400.00 },
  { detail: 'ZF-101 · Citrus Drink 50cl', group: 'Citrus Drink', source: 'Finished Product', area: 'Warehouse', qty: 860, unitCost: 1850.00, price: 2400.00 },
  { detail: 'ZF-102 · Citrus Drink 1L', group: 'Citrus Drink', source: 'Finished Product', area: 'Shop floor', qty: 150, unitCost: 3120.00, price: 3950.00 },
  { detail: 'ZF-210 · Malt Classic 33cl', group: 'Malt Classic', source: 'Finished Product', area: 'Warehouse', qty: 640, unitCost: 1640.00, price: 2150.00 },
  { detail: 'ZF-315 · Ginger Blend 50cl', group: 'Citrus Drink', source: 'Finished Product', area: 'Shop floor', qty: 88, unitCost: 1980.00, price: 2600.00 },
  { detail: 'OS-01 · Sparkling Water 75cl', group: 'Outsourced', source: 'Outsource', area: 'Shop floor', qty: 320, unitCost: 1980.00, price: 2750.00 },
  { detail: 'OS-02 · Tonic Water 33cl', group: 'Outsourced', source: 'Outsource', area: 'Warehouse', qty: 400, unitCost: 1450.00, price: 2050.00 },
  { detail: 'Chivita 100% Orange 1L', group: 'Ungrouped', source: 'Direct entry', area: 'Shop floor', qty: 240, unitCost: 4200.00, price: 5400.00 },
  { detail: 'Bigi Cola 60cl', group: 'Ungrouped', source: 'Direct entry', area: 'Shop floor', qty: 400, unitCost: 2650.00, price: 3400.00 },
]

/** §5.2.4 — movement behind the showroom stock and bin cards. */
export const showroomCardOpening = 980
export const showroomCardRows = [
  { sn: 1, date: '02 Aug 2026', remark: 'Received from Factory A — waybill WB-8821', qtyIn: 300, qtyOut: 0 },
  { sn: 2, date: '03 Aug 2026', remark: 'POS sales — shop floor', qtyIn: 0, qtyOut: 142 },
  { sn: 3, date: '05 Aug 2026', remark: 'Warehouse to shop floor replenishment', qtyIn: 0, qtyOut: 0, note: 'Internal move' },
  { sn: 4, date: '07 Aug 2026', remark: 'POS sales — shop floor', qtyIn: 0, qtyOut: 188 },
  { sn: 5, date: '10 Aug 2026', remark: 'Received from Factory A — waybill WB-8867', qtyIn: 400, qtyOut: 0 },
  { sn: 6, date: '12 Aug 2026', remark: 'Return RT-441 from Dealer — Bendel Stores', qtyIn: 60, qtyOut: 0 },
  { sn: 7, date: '14 Aug 2026', remark: 'POS sales — shop floor', qtyIn: 0, qtyOut: 215 },
  { sn: 8, date: '17 Aug 2026', remark: 'Quantity adjustment QA-133 — damaged in handling', qtyIn: 0, qtyOut: 18 },
  { sn: 9, date: '19 Aug 2026', remark: 'Transfer TR-9002 to Showroom Lekki', qtyIn: 0, qtyOut: 120 },
  { sn: 10, date: '22 Aug 2026', remark: 'POS sales — shop floor', qtyIn: 0, qtyOut: 197 },
]

/** §5.2.8 — wallets credited when goods are returned. */
export const dealerWallets = [
  { value: 'dl-bendel', label: 'Bendel Stores', balance: 486500.00, type: 'Dealer' },
  { value: 'dl-kano', label: 'Kano Central Distributors', balance: 1240000.00, type: 'Dealer' },
  { value: 'dl-owerri', label: 'Owerri Beverage Depot', balance: 0.00, type: 'Dealer' },
]

export const returnReasons = [
  { value: 'damaged', label: 'Damaged in transit' },
  { value: 'expired', label: 'Expired / near expiry' },
  { value: 'wrong', label: 'Wrong item supplied' },
  { value: 'defect', label: 'Product defect' },
  { value: 'unsold', label: 'Unsold stock — agreed return' },
  { value: 'customer', label: 'Customer dissatisfaction' },
]

export const recentReturns = [
  { ref: 'RT-0455', date: '23 Aug 2026', party: 'Walk-in — Adaeze N.', type: 'Non-dealer', product: 'ZF-101 · Citrus Drink 50cl', qty: 4, value: 9600.00, reason: 'Product defect', wallet: 'Temporary' },
  { ref: 'RT-0451', date: '21 Aug 2026', party: 'Bendel Stores', type: 'Dealer', product: 'ZF-102 · Citrus Drink 1L', qty: 25, value: 98750.00, reason: 'Damaged in transit', wallet: 'Dealer wallet' },
  { ref: 'RT-0447', date: '18 Aug 2026', party: 'Walk-in — Chuka O.', type: 'Non-dealer', product: 'ZF-210 · Malt Classic 33cl', qty: 2, value: 4300.00, reason: 'Customer dissatisfaction', wallet: 'Temporary' },
  { ref: 'RT-0441', date: '12 Aug 2026', party: 'Bendel Stores', type: 'Dealer', product: 'ZF-101 · Citrus Drink 50cl', qty: 60, value: 144000.00, reason: 'Unsold stock — agreed return', wallet: 'Dealer wallet' },
]

/** §5.2.9 — transfers in and out, split by origin type. */
export const showroomToShowroom = [
  { date: '19 Aug 2026', waybill: 'TR-9002', source: 'Showroom Ikeja', destination: 'Showroom Lekki', driver: 'Emeka Nwosu', product: 'ZF-101 · Citrus Drink 50cl', qty: 120, unit: 'Cartons', received: '20 Aug 2026', status: 'Received' },
  { date: '15 Aug 2026', waybill: 'TR-8994', source: 'Showroom Abuja', destination: 'Showroom Ikeja', driver: 'Ibrahim Sule', product: 'ZF-315 · Ginger Blend 50cl', qty: 90, unit: 'Cartons', received: '17 Aug 2026', status: 'Received' },
  { date: '23 Aug 2026', waybill: 'TR-9011', source: 'Showroom Lekki', destination: 'Showroom Ikeja', driver: 'Emeka Nwosu', product: 'ZF-102 · Citrus Drink 1L', qty: 60, unit: 'Cartons', received: '—', status: 'In transit' },
]

export const factoryToShowroom = [
  { date: '24 Aug 2026', waybill: 'WB-8942', source: 'Factory A — Ikeja', destination: 'Showroom Ikeja', driver: 'Musa Danjuma', product: 'ZF-101 · Citrus Drink 50cl', qty: 300, unit: 'Cartons', received: '—', status: 'In transit' },
  { date: '14 Aug 2026', waybill: 'WB-8905', source: 'Factory A — Ikeja', destination: 'Showroom Abuja', driver: 'Ibrahim Sule', product: 'ZF-315 · Ginger Blend 50cl', qty: 420, unit: 'Cartons', received: '16 Aug 2026', status: 'Received' },
  { date: '09 Aug 2026', waybill: 'WB-8867', source: 'Factory A — Ikeja', destination: 'Showroom Ikeja', driver: 'Musa Danjuma', product: 'ZF-210 · Malt Classic 33cl', qty: 400, unit: 'Cartons', received: '10 Aug 2026', status: 'Received' },
  { date: '06 Aug 2026', waybill: 'WB-8844', source: 'Factory A — Ikeja', destination: 'Showroom Lekki', driver: 'Emeka Nwosu', product: 'ZF-102 · Citrus Drink 1L', qty: 155, unit: 'Cartons', received: '07 Aug 2026', status: 'Received' },
]

/** §5.2.10 — showroom VAT, at the rate configured for that showroom. */
export const showroomVatOutputs = [
  { label: 'Counter sales — finished products', base: 9840000 },
  { label: 'Dealer sales', base: 5260000 },
  { label: 'Outsourced product sales', base: 1480000 },
]

export const showroomVatInputs = [
  { label: 'Direct stock purchases', base: 2068000 },
  { label: 'Outsourced stock receipts', base: 1993000 },
  { label: 'Showroom running costs', base: 412000 },
]

export const showroomVatTransactions = [
  { date: '03 Aug 2026', ref: 'INV-31204', counterparty: 'Counter sales — day total', type: 'Output', description: 'POS sales, 03 Aug', base: 1420000 },
  { date: '06 Aug 2026', ref: 'CHI-88214', counterparty: 'Chi Limited', type: 'Input', description: 'Direct stock purchase — Chivita', base: 1008000 },
  { date: '09 Aug 2026', ref: 'INV-31240', counterparty: 'Bendel Stores', type: 'Output', description: 'Dealer sale — bulk order', base: 2340000 },
  { date: '12 Aug 2026', ref: 'AQ-2188', counterparty: 'Aquavita Bottling Co.', type: 'Input', description: 'Outsourced stock receipt — tonic water', base: 580000 },
  { date: '15 Aug 2026', ref: 'INV-31288', counterparty: 'Counter sales — week total', type: 'Output', description: 'POS sales, week 33', base: 3180000 },
  { date: '16 Aug 2026', ref: 'RF-30112', counterparty: 'Rite Foods Ltd', type: 'Input', description: 'Direct stock purchase — Bigi Cola', base: 1060000 },
  { date: '17 Aug 2026', ref: 'SF-0884', counterparty: 'Sunshine Foods Ltd', type: 'Input', description: 'Outsourced stock receipt — fruit cordial', base: 780000 },
  { date: '20 Aug 2026', ref: 'INV-31331', counterparty: 'Kano Central Distributors', type: 'Output', description: 'Dealer sale — bulk order', base: 2920000 },
  { date: '22 Aug 2026', ref: 'INV-31366', counterparty: 'Counter sales — week total', type: 'Output', description: 'POS sales, week 34', base: 5240000 },
  { date: '23 Aug 2026', ref: 'UTL-2210', counterparty: 'Ikeja Electric', type: 'Input', description: 'Showroom running costs', base: 412000 },
  { date: '23 Aug 2026', ref: 'INV-31380', counterparty: 'Counter sales — outsourced', type: 'Output', description: 'Sparkling and tonic water sales', base: 1480000 },
  { date: '21 Aug 2026', ref: 'AQ-2210', counterparty: 'Aquavita Bottling Co.', type: 'Input', description: 'Outsourced stock receipt — sparkling water', base: 633000 },
]
