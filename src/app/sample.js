// Placeholder data used purely to give the designs realistic shape.
// No logic depends on it — swap wholesale when real data lands.

export const factories = [
  { value: 'fa', label: 'Factory A — Ikeja' },
  { value: 'fb', label: 'Factory B — Sango Otta' },
]

export const units = [
  { value: 'pcs', label: 'Pieces' },
  { value: 'ctn', label: 'Cartons' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'l', label: 'Litres' },
  { value: 'bag', label: 'Bags' },
]

export const categories = [
  { value: 'beverage', label: 'Beverage' },
  { value: 'confectionery', label: 'Confectionery' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'additive', label: 'Additive' },
]

export const finishedProducts = [
  { value: 'zf-101', label: 'ZF-101 · Citrus Drink 50cl' },
  { value: 'zf-102', label: 'ZF-102 · Citrus Drink 1L' },
  { value: 'zf-210', label: 'ZF-210 · Malt Classic 33cl' },
  { value: 'zf-315', label: 'ZF-315 · Ginger Blend 50cl' },
  { value: 'zf-420', label: 'ZF-420 · Cocoa Wafer 40g' },
]

export const rawMaterials = [
  { value: 'rm-01', label: 'RM-01 · Refined Sugar' },
  { value: 'rm-02', label: 'RM-02 · Citric Acid' },
  { value: 'rm-03', label: 'RM-03 · Concentrate — Citrus' },
  { value: 'rm-04', label: 'RM-04 · PET Preform 28mm' },
  { value: 'rm-05', label: 'RM-05 · Crown Cork' },
  { value: 'rm-06', label: 'RM-06 · Cocoa Powder' },
]

export const suppliers = [
  { value: 'sup-1', label: 'Ardova Commodities Ltd' },
  { value: 'sup-2', label: 'Lagos Packaging Co.' },
  { value: 'sup-3', label: 'Bendel Agro Supplies' },
]

export const manufacturers = [
  { value: 'mfr-1', label: 'Dangote Sugar Refinery' },
  { value: 'mfr-2', label: 'Jubaili Bros' },
  { value: 'mfr-3', label: 'Tetra Pak Nigeria' },
]

/** Rows for the Stock Register list. */
export const registeredProducts = [
  { code: 'ZF-101', name: 'Citrus Drink 50cl', category: 'Beverage', factory: 'Factory A', unit: 'Cartons', reorder: '120', barcode: '6151100101012', status: 'Active' },
  { code: 'ZF-102', name: 'Citrus Drink 1L', category: 'Beverage', factory: 'Factory A', unit: 'Cartons', reorder: '80', barcode: '6151100102019', status: 'Active' },
  { code: 'ZF-210', name: 'Malt Classic 33cl', category: 'Beverage', factory: 'Factory A', unit: 'Cartons', reorder: '150', barcode: '6151100210014', status: 'Active' },
  { code: 'ZF-315', name: 'Ginger Blend 50cl', category: 'Beverage', factory: 'Factory B', unit: 'Cartons', reorder: '60', barcode: '6151100315016', status: 'Active' },
  { code: 'ZF-420', name: 'Cocoa Wafer 40g', category: 'Confectionery', factory: 'Factory B', unit: 'Pieces', reorder: '900', barcode: '6151100420010', status: 'Inactive' },
]

export const registeredMaterials = [
  { code: 'RM-01', name: 'Refined Sugar', category: 'Additive', factory: 'Factory A', unit: 'Bags', reorder: '40', barcode: '6151200010017', status: 'Active' },
  { code: 'RM-02', name: 'Citric Acid', category: 'Additive', factory: 'Factory A', unit: 'Kilograms', reorder: '75', barcode: '6151200020016', status: 'Active' },
  { code: 'RM-03', name: 'Concentrate — Citrus', category: 'Additive', factory: 'Factory A', unit: 'Litres', reorder: '200', barcode: '6151200030015', status: 'Active' },
  { code: 'RM-04', name: 'PET Preform 28mm', category: 'Packaging', factory: 'Factory B', unit: 'Pieces', reorder: '5,000', barcode: '6151200040014', status: 'Active' },
  { code: 'RM-05', name: 'Crown Cork', category: 'Packaging', factory: 'Factory B', unit: 'Pieces', reorder: '8,000', barcode: '6151200050013', status: 'Active' },
]

// ── Stock/Bin Card grouping (PRD §5.1.4–5.1.6) ───────────────────────────────
// Every stock item belongs to a Type (group); each group falls under a brand.

export const brands = [
  { value: 'zifcitrus', label: 'ZifCitrus' },
  { value: 'zifmalt', label: 'ZifMalt' },
  { value: 'zifcocoa', label: 'ZifCocoa' },
]

// `kind` says which refill a group's stock arrives on — Stock Refill › Finished
// Product, or Stock Refill › Raw Material. Both cards report it so a reader
// knows what they are looking at without inferring it from the name.
export const stockGroups = [
  { value: 'citrus-drink', label: 'Citrus Drink', brand: 'ZifCitrus', kind: 'finished', unit: 'Cartons', members: ['50cl', '1L', '75cl'] },
  { value: 'malt-classic', label: 'Malt Classic', brand: 'ZifMalt', kind: 'finished', unit: 'Cartons', members: ['33cl', '50cl'] },
  { value: 'cocoa-wafer', label: 'Cocoa Wafer', brand: 'ZifCocoa', kind: 'finished', unit: 'Cartons', members: ['40g', '80g'] },
  { value: 'refined-sugar', label: 'Refined Sugar', brand: 'Dangote', kind: 'raw', unit: 'Bags', members: ['25kg', '50kg'] },
  { value: 'pet-preform', label: 'PET Preform', brand: 'Indorama', kind: 'raw', unit: 'Pieces', members: ['28mm', '30mm'] },
]

/** How a stock kind is named and toned wherever a card or report reports one. */
export const stockKinds = [
  { value: 'finished', label: 'Finished product', tone: 'brand' },
  { value: 'raw', label: 'Raw material', tone: 'info' },
]

export const stockKindOf = (kind) => stockKinds.find((k) => k.value === kind) || stockKinds[0]

export const cardOpeningBalance = 1200

/** Stock Card (GP): every activity is its own entry, with a remark. */
export const stockCardRows = [
  { sn: 1, date: '01 Aug 2026', remark: 'Production run PR-3310 — Citrus Drink 50cl', qtyIn: 480, qtyOut: 0 },
  { sn: 2, date: '01 Aug 2026', remark: 'Production run PR-3311 — Citrus Drink 1L', qtyIn: 180, qtyOut: 0 },
  { sn: 3, date: '02 Aug 2026', remark: 'Stock transfer TR-8821 to Showroom Ikeja — 50cl', qtyIn: 0, qtyOut: 300 },
  { sn: 4, date: '02 Aug 2026', remark: 'POS sale batch — Showroom Ikeja (50cl)', qtyIn: 0, qtyOut: 95 },
  { sn: 5, date: '04 Aug 2026', remark: 'Stock refill RF-2470 — Citrus Drink 1L', qtyIn: 240, qtyOut: 0 },
  { sn: 6, date: '06 Aug 2026', remark: 'POS sale batch — Showroom Lekki (1L)', qtyIn: 0, qtyOut: 155 },
  { sn: 7, date: '08 Aug 2026', remark: 'Quantity adjustment QA-119 — damaged in handling', qtyIn: 0, qtyOut: 24 },
  { sn: 8, date: '11 Aug 2026', remark: 'Production run PR-3352 — Citrus Drink 75cl', qtyIn: 360, qtyOut: 0 },
  { sn: 9, date: '14 Aug 2026', remark: 'Stock transfer TR-8905 to Showroom Abuja — 75cl', qtyIn: 0, qtyOut: 420 },
  { sn: 10, date: '14 Aug 2026', remark: 'Return RT-441 from Dealer — Citrus Drink 50cl', qtyIn: 60, qtyOut: 0 },
  { sn: 11, date: '20 Aug 2026', remark: 'Factory-to-factory trade FT-207 to Factory B — 1L', qtyIn: 0, qtyOut: 200 },
  { sn: 12, date: '22 Aug 2026', remark: 'Stock refill RF-2478 — Citrus Drink 50cl', qtyIn: 195, qtyOut: 0 },
]

/** Running balance, so the design always reads as arithmetically sound. */
export function withRunningBalance(rows, opening = cardOpeningBalance, key = 'balance') {
  let bal = opening
  return rows.map((r) => {
    bal = bal + (r.qtyIn || 0) - (r.qtyOut || 0)
    return { ...r, [key]: bal }
  })
}

/** Bin Card (GP): the same movements collapsed to one entry per date. */
export function summariseByDate(rows) {
  const order = []
  const byDate = new Map()
  for (const r of rows) {
    if (!byDate.has(r.date)) { byDate.set(r.date, { date: r.date, qtyIn: 0, qtyOut: 0 }); order.push(r.date) }
    const d = byDate.get(r.date)
    d.qtyIn += r.qtyIn || 0
    d.qtyOut += r.qtyOut || 0
  }
  return order.map((d, i) => ({ sn: i + 1, ...byDate.get(d) }))
}

/** Single-product card (PRD §5.1.6) — every product is its own entity. */
export const productCardOpening = 640
export const productCardRows = [
  { sn: 1, date: '01 Aug 2026', remark: 'Production run PR-3310', qtyIn: 480, qtyOut: 0 },
  { sn: 2, date: '02 Aug 2026', remark: 'Stock transfer TR-8821 to Showroom Ikeja', qtyIn: 0, qtyOut: 300 },
  { sn: 3, date: '02 Aug 2026', remark: 'POS sale batch — Showroom Ikeja', qtyIn: 0, qtyOut: 95 },
  { sn: 4, date: '09 Aug 2026', remark: 'Quantity adjustment QA-121 — recount at shift close', qtyIn: 0, qtyOut: 12 },
  { sn: 5, date: '14 Aug 2026', remark: 'Return RT-441 from Dealer', qtyIn: 60, qtyOut: 0 },
  { sn: 6, date: '22 Aug 2026', remark: 'Stock refill RF-2478', qtyIn: 195, qtyOut: 0 },
]

// ── Comprehensive Stock Report (PRD §5.1.8) ──────────────────────────────────

/** Part 1 — finished products AND raw materials, keyed by Category. */
export const comprehensivePart1 = [
  { category: 'Finished Product', detail: 'ZF-101 · Citrus Drink 50cl', unitCost: 1850.00, qtyLeft: 1521 },
  { category: 'Finished Product', detail: 'ZF-102 · Citrus Drink 1L', unitCost: 3120.00, qtyLeft: 742 },
  { category: 'Finished Product', detail: 'ZF-210 · Malt Classic 33cl', unitCost: 1640.00, qtyLeft: 2105 },
  { category: 'Finished Product', detail: 'ZF-315 · Ginger Blend 50cl', unitCost: 1980.00, qtyLeft: 486 },
  { category: 'Finished Product', detail: 'ZF-420 · Cocoa Wafer 40g', unitCost: 210.00, qtyLeft: 7900 },
  { category: 'Raw Material', detail: 'RM-01 · Refined Sugar', unitCost: 48500.00, qtyLeft: 62 },
  { category: 'Raw Material', detail: 'RM-02 · Citric Acid', unitCost: 2750.00, qtyLeft: 148 },
  { category: 'Raw Material', detail: 'RM-03 · Concentrate — Citrus', unitCost: 6400.00, qtyLeft: 315 },
  { category: 'Raw Material', detail: 'RM-04 · PET Preform 28mm', unitCost: 38.50, qtyLeft: 24800 },
  { category: 'Raw Material', detail: 'RM-05 · Crown Cork', unitCost: 9.20, qtyLeft: 61200 },
]

/** Part 2 — finished products only, Category replaced by Group. */
export const comprehensivePart2 = [
  { group: 'Citrus Drink', detail: 'ZF-101 · Citrus Drink 50cl', unitCost: 1850.00, qtyLeft: 1521 },
  { group: 'Citrus Drink', detail: 'ZF-102 · Citrus Drink 1L', unitCost: 3120.00, qtyLeft: 742 },
  { group: 'Citrus Drink', detail: 'ZF-315 · Ginger Blend 50cl', unitCost: 1980.00, qtyLeft: 486 },
  { group: 'Malt Classic', detail: 'ZF-210 · Malt Classic 33cl', unitCost: 1640.00, qtyLeft: 2105 },
  { group: 'Cocoa Wafer', detail: 'ZF-420 · Cocoa Wafer 40g', unitCost: 210.00, qtyLeft: 7900 },
]

// ── Stock Movement Report (PRD §5.1.9) ───────────────────────────────────────

/** Finished Products → Finished Product Report: daily production activity. */
export const productionRuns = [
  { date: '01 Aug 2026', batch: 'B-3310', product: 'ZF-101 · Citrus Drink 50cl', qty: 480, unitCost: 1850.00, materials: 'Refined Sugar, Citric Acid, Concentrate — Citrus, PET Preform' },
  { date: '01 Aug 2026', batch: 'B-3311', product: 'ZF-102 · Citrus Drink 1L', qty: 180, unitCost: 3120.00, materials: 'Refined Sugar, Concentrate — Citrus, PET Preform' },
  { date: '05 Aug 2026', batch: 'B-3328', product: 'ZF-210 · Malt Classic 33cl', qty: 620, unitCost: 1640.00, materials: 'Refined Sugar, Malt Extract, Crown Cork' },
  { date: '11 Aug 2026', batch: 'B-3352', product: 'ZF-315 · Ginger Blend 50cl', qty: 360, unitCost: 1980.00, materials: 'Refined Sugar, Ginger Concentrate, Citric Acid, PET Preform' },
  { date: '17 Aug 2026', batch: 'B-3377', product: 'ZF-420 · Cocoa Wafer 40g', qty: 4200, unitCost: 210.00, materials: 'Cocoa Powder, Refined Sugar, Wheat Flour' },
  { date: '21 Aug 2026', batch: 'B-3390', product: 'ZF-101 · Citrus Drink 50cl', qty: 540, unitCost: 1842.00, materials: 'Refined Sugar, Citric Acid, Concentrate — Citrus, PET Preform' },
]

/** Finished Products → Supplied Report: distribution to showrooms and distributors. */
export const suppliedRuns = [
  { waybill: 'WB-8821', driver: 'Musa Danjuma', supplied: '02 Aug 2026', received: '02 Aug 2026', product: 'ZF-101 · Citrus Drink 50cl', qtySupplied: 300, qtyReceived: 300, qtyRejected: 0, price: 2400.00, destination: 'Showroom Ikeja' },
  { waybill: 'WB-8844', driver: 'Emeka Nwosu', supplied: '06 Aug 2026', received: '07 Aug 2026', product: 'ZF-102 · Citrus Drink 1L', qtySupplied: 155, qtyReceived: 150, qtyRejected: 5, price: 3950.00, destination: 'Showroom Lekki' },
  { waybill: 'WB-8867', driver: 'Musa Danjuma', supplied: '09 Aug 2026', received: '10 Aug 2026', product: 'ZF-210 · Malt Classic 33cl', qtySupplied: 400, qtyReceived: 400, qtyRejected: 0, price: 2150.00, destination: 'Showroom Ikeja' },
  { waybill: 'WB-8905', driver: 'Ibrahim Sule', supplied: '14 Aug 2026', received: '16 Aug 2026', product: 'ZF-315 · Ginger Blend 50cl', qtySupplied: 420, qtyReceived: 408, qtyRejected: 12, price: 2600.00, destination: 'Showroom Abuja' },
  { waybill: 'WB-8931', driver: 'Emeka Nwosu', supplied: '19 Aug 2026', received: '—', product: 'ZF-420 · Cocoa Wafer 40g', qtySupplied: 2400, qtyReceived: 0, qtyRejected: 0, price: 320.00, destination: 'Dealer — Bendel Stores' },
]

/** Raw Materials tab: usage, balance and cost movement. */
export const rawMaterialMovement = [
  { material: 'RM-01 · Refined Sugar', openingDate: '01 Aug 2026', opening: 96, used: 74, unitCost: 48500.00, remaining: 62, arrivals: 40 },
  { material: 'RM-02 · Citric Acid', openingDate: '01 Aug 2026', opening: 210, used: 212, unitCost: 2750.00, remaining: 148, arrivals: 150 },
  { material: 'RM-03 · Concentrate — Citrus', openingDate: '01 Aug 2026', opening: 480, used: 365, unitCost: 6400.00, remaining: 315, arrivals: 200 },
  { material: 'RM-04 · PET Preform 28mm', openingDate: '01 Aug 2026', opening: 31000, used: 18200, unitCost: 38.50, remaining: 24800, arrivals: 12000 },
  { material: 'RM-05 · Crown Cork', openingDate: '01 Aug 2026', opening: 74000, used: 20800, unitCost: 9.20, remaining: 61200, arrivals: 8000 },
  { material: 'RM-06 · Cocoa Powder', openingDate: '01 Aug 2026', opening: 340, used: 168, unitCost: 12400.00, remaining: 172, arrivals: 0 },
]

// ── Production Cost Calculator (PRD §5.1.11–5.1.12) ──────────────────────────

/** Each factory carries its own production line / specialisation. */
export const factoryLines = {
  fa: {
    key: 'fa', name: 'Factory A', location: 'Ikeja', specialisation: 'Beverages — citrus and malt lines',
    products: [
      { value: 'zf-101', label: 'ZF-101 · Citrus Drink 50cl' },
      { value: 'zf-102', label: 'ZF-102 · Citrus Drink 1L' },
      { value: 'zf-210', label: 'ZF-210 · Malt Classic 33cl' },
    ],
  },
  fb: {
    key: 'fb', name: 'Factory B', location: 'Sango Otta', specialisation: 'Confectionery and ginger blends',
    products: [
      { value: 'zf-315', label: 'ZF-315 · Ginger Blend 50cl' },
      { value: 'zf-420', label: 'ZF-420 · Cocoa Wafer 40g' },
    ],
  },
}

/** Recipes registered in-house, selectable alongside raw materials when costing. */
export const inHouseRecipes = [
  { value: 'rc-01', label: 'RC-01 · Citrus Base Syrup', unitCost: 8900.00 },
  { value: 'rc-02', label: 'RC-02 · Malt Concentrate Blend', unitCost: 11400.00 },
  { value: 'rc-03', label: 'RC-03 · Ginger Infusion', unitCost: 9750.00 },
]

/** Unit landing costs for anything consumable in a production run. */
export const inputUnitCosts = {
  'rm-01': 48500.00, 'rm-02': 2750.00, 'rm-03': 6400.00, 'rm-04': 38.50, 'rm-05': 9.20, 'rm-06': 12400.00,
  'rc-01': 8900.00, 'rc-02': 11400.00, 'rc-03': 9750.00,
}

/** Overhead heads that roll into landing cost beyond material consumption. */
export const overheadHeads = [
  { key: 'labour', label: 'Direct labour', value: 184000 },
  { key: 'energy', label: 'Energy & utilities', value: 96500 },
  { key: 'packaging', label: 'Packaging & labelling', value: 142000 },
  { key: 'overhead', label: 'Factory overhead allocation', value: 78000 },
]

/** Prior runs shown for comparison against the run being costed. */
export const priorCostings = [
  { batch: 'B-3390', product: 'Citrus Drink 50cl', unitCost: 1842.00, when: '21 Aug 2026', status: 'Approved' },
  { batch: 'B-3352', product: 'Ginger Blend 50cl', unitCost: 1980.00, when: '11 Aug 2026', status: 'Approved' },
  { batch: 'B-3328', product: 'Malt Classic 33cl', unitCost: 1640.00, when: '05 Aug 2026', status: 'Pending' },
]

// ── Factory-To-Factory Tradeables (PRD §5.1.24–5.1.26) ───────────────────────
// One dataset behind all three screens. `direction` is relative to the factory
// currently signed in (Factory A here): outgoing = we offered it.

export const CURRENT_FACTORY = 'Factory A'

/** Re-order thresholds keyed by material code, for judging whether an offer helps. */
export const materialPosition = {
  'rm-01': { name: 'RM-01 · Refined Sugar', unit: 'Bags', onHand: 62, reorderLevel: 40, unitCost: 48500.00 },
  'rm-02': { name: 'RM-02 · Citric Acid', unit: 'Kilograms', onHand: 148, reorderLevel: 75, unitCost: 2750.00 },
  'rm-03': { name: 'RM-03 · Concentrate — Citrus', unit: 'Litres', onHand: 315, reorderLevel: 200, unitCost: 6400.00 },
  'rm-04': { name: 'RM-04 · PET Preform 28mm', unit: 'Pieces', onHand: 24800, reorderLevel: 5000, unitCost: 38.50 },
  'rm-05': { name: 'RM-05 · Crown Cork', unit: 'Pieces', onHand: 61200, reorderLevel: 8000, unitCost: 9.20 },
  'rm-06': { name: 'RM-06 · Cocoa Powder', unit: 'Kilograms', onHand: 172, reorderLevel: 260, unitCost: 12400.00 },
  'rc-03': { name: 'RC-03 · Ginger Infusion', unit: 'Litres', onHand: 54, reorderLevel: 90, unitCost: 9750.00 },
}

export const factoryTrades = [
  // Incoming — other factories offering to us, awaiting our response.
  { ref: 'FT-0214', direction: 'Incoming', from: 'Factory B', to: 'Factory A', code: 'rm-06', qty: 120, offered: '23 Aug 2026', responded: null, expires: '30 Aug 2026', status: 'Pending', reason: 'Surplus after line changeover', respondedBy: null },
  { ref: 'FT-0212', direction: 'Incoming', from: 'Factory B', to: 'Factory A', code: 'rm-01', qty: 25, offered: '21 Aug 2026', responded: null, expires: '28 Aug 2026', status: 'Pending', reason: 'Excess against revised schedule', respondedBy: null },
  { ref: 'FT-0209', direction: 'Incoming', from: 'Factory B', to: 'Factory A', code: 'rc-03', qty: 30, offered: '15 Aug 2026', responded: '16 Aug 2026', expires: '22 Aug 2026', status: 'Accepted', reason: 'Batch overrun', respondedBy: 'A. Bello' },

  // Outgoing — surplus we listed for other factories.
  { ref: 'FT-0211', direction: 'Outgoing', from: 'Factory A', to: 'Factory B', code: 'rm-05', qty: 18000, offered: '20 Aug 2026', responded: null, expires: '27 Aug 2026', status: 'Open', reason: 'Surplus stock', respondedBy: null },
  { ref: 'FT-0207', direction: 'Outgoing', from: 'Factory A', to: 'Factory B', code: 'rm-04', qty: 6000, offered: '12 Aug 2026', responded: '13 Aug 2026', expires: '19 Aug 2026', status: 'Accepted', reason: 'Surplus stock', respondedBy: 'C. Eze (Factory B)' },
  { ref: 'FT-0203', direction: 'Outgoing', from: 'Factory A', to: 'Factory B', code: 'rm-02', qty: 40, offered: '05 Aug 2026', responded: '07 Aug 2026', expires: '12 Aug 2026', status: 'Rejected', reason: 'Nearing expiry', respondedBy: 'C. Eze (Factory B)' },
]

export const tradeReasons = [
  { value: 'SURPLUS', label: 'Surplus stock' },
  { value: 'EXPIRY', label: 'Nearing expiry' },
  { value: 'CHANGEOVER', label: 'Surplus after line changeover' },
  { value: 'SCHEDULE', label: 'Excess against revised schedule' },
  { value: 'DISCONTINUED', label: 'Product discontinued' },
]

// ── Factory finance (PRD §5.1.18–5.1.23) ─────────────────────────────────────
// Figures below reconcile: cash flow nets to its closing balance, SCI nets to
// profit, and VAT is 7.5% of each stated base.

export const VAT_RATE = 0.075

/** §5.1.18 — inflow from factory + by-product sales and funds from management. */
export const cashInflows = [
  { label: 'Factory sales proceeds', note: 'Finished product', current: 18420000, prior: 16300000 },
  { label: 'By-product sales', note: 'Derived from raw materials', current: 1265000, prior: 1050000 },
  { label: 'Funds received from Management', note: 'Internal operations', current: 4500000, prior: 3800000 },
]

export const cashOutflows = [
  { label: 'Raw material purchases', current: 9860000, prior: 8900000 },
  { label: 'Direct labour & wages', current: 3240000, prior: 3010000 },
  { label: 'Energy & utilities', current: 1485000, prior: 1360000 },
  { label: 'Logistics & haulage', current: 940000, prior: 860000 },
  { label: 'Maintenance & repairs', current: 620000, prior: 540000 },
  { label: 'Administrative expenses', current: 555000, prior: 610000 },
]

export const cashOpeningBalance = 3120000

/** Ledger behind the statement — every entry that rolls into the totals above. */
export const cashLedger = [
  { date: '02 Aug 2026', ref: 'CI-4410', description: 'Factory sales remittance — week 31', head: 'Factory sales proceeds', direction: 'In', amount: 4380000 },
  { date: '04 Aug 2026', ref: 'CO-2201', description: 'Ardova Commodities — refined sugar', head: 'Raw material purchases', direction: 'Out', amount: 2910000 },
  { date: '06 Aug 2026', ref: 'FD-0881', description: 'Operational float from Management', head: 'Funds received from Management', direction: 'In', amount: 2500000 },
  { date: '09 Aug 2026', ref: 'CI-4418', description: 'By-product sale — spent grain to Agro Feeds', head: 'By-product sales', direction: 'In', amount: 615000 },
  { date: '11 Aug 2026', ref: 'CO-2214', description: 'August wages — production floor', head: 'Direct labour & wages', direction: 'Out', amount: 3240000 },
  { date: '13 Aug 2026', ref: 'CI-4426', description: 'Factory sales remittance — week 32', head: 'Factory sales proceeds', direction: 'In', amount: 5140000 },
  { date: '15 Aug 2026', ref: 'CO-2223', description: 'Ikeja Electric — August billing', head: 'Energy & utilities', direction: 'Out', amount: 1485000 },
  { date: '18 Aug 2026', ref: 'CO-2231', description: 'Haulage — Showroom Abuja dispatch', head: 'Logistics & haulage', direction: 'Out', amount: 940000 },
  { date: '19 Aug 2026', ref: 'FD-0894', description: 'Operational float from Management', head: 'Funds received from Management', direction: 'In', amount: 2000000 },
  { date: '20 Aug 2026', ref: 'CI-4437', description: 'Factory sales remittance — week 33', head: 'Factory sales proceeds', direction: 'In', amount: 8900000 },
  { date: '21 Aug 2026', ref: 'CO-2240', description: 'Lagos Packaging Co. — preforms and corks', head: 'Raw material purchases', direction: 'Out', amount: 6950000 },
  { date: '22 Aug 2026', ref: 'CI-4441', description: 'By-product sale — molasses residue', head: 'By-product sales', direction: 'In', amount: 650000 },
  { date: '23 Aug 2026', ref: 'CO-2247', description: 'Boiler servicing and line maintenance', head: 'Maintenance & repairs', direction: 'Out', amount: 620000 },
  { date: '23 Aug 2026', ref: 'CO-2249', description: 'Office running costs — August', head: 'Administrative expenses', direction: 'Out', amount: 555000 },
]

/** §5.1.19 — disbursed funds held until the factory accountant confirms receipt. */
export const fundsAwaiting = [
  { ref: 'FD-0901', disbursedDate: '23 Aug 2026', amount: 1800000, purpose: 'Raw material purchase float — September intake', disbursedBy: 'M. Okonkwo (Management)', channel: 'Bank transfer', factory: 'Factory A', status: 'Awaiting' },
  { ref: 'FD-0899', disbursedDate: '22 Aug 2026', amount: 640000, purpose: 'Generator diesel and plant consumables', disbursedBy: 'M. Okonkwo (Management)', channel: 'Bank transfer', factory: 'Factory A', status: 'Awaiting' },
  { ref: 'FD-0897', disbursedDate: '21 Aug 2026', amount: 285000, purpose: 'Line maintenance — replacement filler valves', disbursedBy: 'T. Adeyemi (Management)', channel: 'Cash', factory: 'Factory B', status: 'Queried' },
  { ref: 'FD-0894', disbursedDate: '19 Aug 2026', amount: 2000000, purpose: 'Operational float — second tranche', disbursedBy: 'M. Okonkwo (Management)', channel: 'Bank transfer', factory: 'Factory A', status: 'Confirmed', confirmedBy: 'A. Bello', confirmedDate: '19 Aug 2026' },
  { ref: 'FD-0881', disbursedDate: '06 Aug 2026', amount: 2500000, purpose: 'Operational float — first tranche', disbursedBy: 'M. Okonkwo (Management)', channel: 'Bank transfer', factory: 'Factory A', status: 'Confirmed', confirmedBy: 'A. Bello', confirmedDate: '06 Aug 2026' },
]

/** §5.1.20 — arrivals with supplier, manufacturer and Stock Keeper verification. */
export const materialReceipts = [
  { date: '02 Aug 2026', ref: 'DL-1128', item: 'RM-01 · Refined Sugar', type: 'Raw material', supplier: 'Ardova Commodities Ltd', manufacturer: 'Dangote Sugar Refinery', qty: 60, unit: 'Bags', mfgDate: '18 Jul 2026', expiry: '18 Jul 2028', verifiedBy: 'A. Bello', offloaded: '02 Aug 2026', condition: 'Accepted' },
  { date: '05 Aug 2026', ref: 'DL-1131', item: 'RM-04 · PET Preform 28mm', type: 'Raw material', supplier: 'Lagos Packaging Co.', manufacturer: 'Tetra Pak Nigeria', qty: 12000, unit: 'Pieces', mfgDate: '22 Jul 2026', expiry: '—', verifiedBy: 'A. Bello', offloaded: '05 Aug 2026', condition: 'Accepted' },
  { date: '09 Aug 2026', ref: 'DL-1134', item: 'RM-02 · Citric Acid', type: 'Raw material', supplier: 'Bendel Agro Supplies', manufacturer: 'Jubaili Bros', qty: 150, unit: 'Kilograms', mfgDate: '30 Jun 2026', expiry: '30 Jun 2027', verifiedBy: 'K. Umeh', offloaded: '10 Aug 2026', condition: 'Accepted with exceptions' },
  { date: '14 Aug 2026', ref: 'DL-1137', item: 'RC-01 · Citrus Base Syrup', type: 'In-house recipe', supplier: 'Internal — Factory A', manufacturer: 'ZifIQ Manufacturing', qty: 480, unit: 'Litres', mfgDate: '02 Aug 2026', expiry: '02 Feb 2027', verifiedBy: 'K. Umeh', offloaded: '14 Aug 2026', condition: 'Accepted' },
  { date: '18 Aug 2026', ref: 'DL-1139', item: 'RM-03 · Concentrate — Citrus', type: 'Raw material', supplier: 'Ardova Commodities Ltd', manufacturer: 'Jubaili Bros', qty: 200, unit: 'Litres', mfgDate: '05 Aug 2026', expiry: '05 Aug 2027', verifiedBy: 'A. Bello', offloaded: '18 Aug 2026', condition: 'Accepted' },
  { date: '22 Aug 2026', ref: 'DL-1140', item: 'RM-05 · Crown Cork', type: 'Raw material', supplier: 'Lagos Packaging Co.', manufacturer: 'Tetra Pak Nigeria', qty: 8000, unit: 'Pieces', mfgDate: '01 Aug 2026', expiry: '—', verifiedBy: '—', offloaded: '—', condition: 'Pending verification' },
]

/** §5.1.21 — items at or below their configured re-order threshold. */
export const reOrderItems = [
  { item: 'RM-06 · Cocoa Powder', category: 'Additive', onHand: 172, reorderLevel: 260, unit: 'Kilograms', supplier: 'Bendel Agro Supplies', leadTime: 21, unitCost: 12400.00, lastOrdered: '02 Jul 2026' },
  { item: 'RM-01 · Refined Sugar', category: 'Additive', onHand: 62, reorderLevel: 40, unit: 'Bags', supplier: 'Ardova Commodities Ltd', leadTime: 10, unitCost: 48500.00, lastOrdered: '28 Jul 2026' },
  { item: 'RM-02 · Citric Acid', category: 'Additive', onHand: 148, reorderLevel: 75, unit: 'Kilograms', supplier: 'Bendel Agro Supplies', leadTime: 14, unitCost: 2750.00, lastOrdered: '05 Aug 2026' },
  { item: 'RM-03 · Concentrate — Citrus', category: 'Additive', onHand: 315, reorderLevel: 200, unit: 'Litres', supplier: 'Ardova Commodities Ltd', leadTime: 18, unitCost: 6400.00, lastOrdered: '14 Aug 2026' },
  { item: 'RC-03 · Ginger Infusion', category: 'In-house recipe', onHand: 54, reorderLevel: 90, unit: 'Litres', supplier: 'Internal — Factory B', leadTime: 3, unitCost: 9750.00, lastOrdered: '10 Aug 2026' },
  { item: 'RM-04 · PET Preform 28mm', category: 'Packaging', onHand: 24800, reorderLevel: 5000, unit: 'Pieces', supplier: 'Lagos Packaging Co.', leadTime: 12, unitCost: 38.50, lastOrdered: '05 Aug 2026' },
  { item: 'RM-05 · Crown Cork', category: 'Packaging', onHand: 61200, reorderLevel: 8000, unit: 'Pieces', supplier: 'Lagos Packaging Co.', leadTime: 12, unitCost: 9.20, lastOrdered: '22 Aug 2026' },
  { item: 'RC-01 · Citrus Base Syrup', category: 'In-house recipe', onHand: 96, reorderLevel: 120, unit: 'Litres', supplier: 'Internal — Factory A', leadTime: 2, unitCost: 8900.00, lastOrdered: '21 Aug 2026' },
]

/** §5.1.22 — Statement of Comprehensive Income at factory level. */
export const sciRevenue = [
  { label: 'Finished product sales', current: 18420000, prior: 16300000 },
  { label: 'By-product sales', current: 1265000, prior: 1050000 },
  { label: 'Special production revenue', current: 3180000, prior: 2790000 },
]

export const sciCostOfSales = [
  { label: 'Raw materials consumed', current: 9860000, prior: 8900000 },
  { label: 'Direct labour', current: 3240000, prior: 3010000 },
  { label: 'Factory overhead', current: 1940000, prior: 1700000 },
]

export const sciOperatingExpenses = [
  { label: 'Administrative expenses', current: 1220000, prior: 1150000 },
  { label: 'Maintenance & repairs', current: 620000, prior: 540000 },
  { label: 'Logistics & distribution', current: 940000, prior: 860000 },
  { label: 'Depreciation', current: 780000, prior: 740000 },
]

/** §5.1.23 — VAT charged on sales and VAT paid on purchases. */
export const vatOutputs = [
  { label: 'Finished product sales', base: 18420000 },
  { label: 'Special production sales', base: 3180000 },
  { label: 'By-product sales', base: 1265000 },
]

export const vatInputs = [
  { label: 'Raw material purchases', base: 9860000 },
  { label: 'Packaging & consumables', base: 1420000 },
  { label: 'Services & utilities', base: 985000 },
]

/** Transaction-level VAT detail behind the summary. */
export const vatTransactions = [
  { date: '02 Aug 2026', ref: 'INV-20411', counterparty: 'Showroom Ikeja', type: 'Output', description: 'Finished product transfer sale', base: 4380000 },
  { date: '04 Aug 2026', ref: 'ACL-99231', counterparty: 'Ardova Commodities Ltd', type: 'Input', description: 'Refined sugar purchase', base: 2910000 },
  { date: '09 Aug 2026', ref: 'INV-20428', counterparty: 'Agro Feeds Ltd', type: 'Output', description: 'By-product sale — spent grain', base: 615000 },
  { date: '13 Aug 2026', ref: 'INV-20440', counterparty: 'Showroom Lekki', type: 'Output', description: 'Finished product transfer sale', base: 5140000 },
  { date: '15 Aug 2026', ref: 'IKE-77120', counterparty: 'Ikeja Electric', type: 'Input', description: 'Electricity — August billing', base: 985000 },
  { date: '18 Aug 2026', ref: 'INV-20455', counterparty: 'Eko Hotels & Suites', type: 'Output', description: 'Special production order SO-0412', base: 3180000 },
  { date: '20 Aug 2026', ref: 'INV-20461', counterparty: 'Showroom Abuja', type: 'Output', description: 'Finished product transfer sale', base: 8900000 },
  { date: '21 Aug 2026', ref: 'LPC-4417', counterparty: 'Lagos Packaging Co.', type: 'Input', description: 'Preforms and crown corks', base: 1420000 },
  { date: '21 Aug 2026', ref: 'ACL-99310', counterparty: 'Ardova Commodities Ltd', type: 'Input', description: 'Citrus concentrate purchase', base: 6950000 },
  { date: '22 Aug 2026', ref: 'INV-20470', counterparty: 'Agro Feeds Ltd', type: 'Output', description: 'By-product sale — molasses residue', base: 650000 },
]

// ── Special Production (PRD §5.1.16–5.1.17) ──────────────────────────────────
// Dedicated to products requested by special clients or customised orders,
// costed and tracked separately from regular factory production.

export const specialClients = [
  { value: 'sc-01', label: 'Eko Hotels & Suites', terms: 'Corporate — contract supply' },
  { value: 'sc-02', label: 'Federal Secretariat Catering', terms: 'Government — tendered' },
  { value: 'sc-03', label: 'Zenith Events Ltd', terms: 'Event — one-off order' },
  { value: 'sc-04', label: 'Ardova Retail Group', terms: 'Private label — recurring' },
]

export const specialProducts = [
  { value: 'sp-01', label: 'SP-01 · Citrus Drink 33cl (Eko Hotels label)' },
  { value: 'sp-02', label: 'SP-02 · Malt Classic 50cl (unbranded bulk)' },
  { value: 'sp-03', label: 'SP-03 · Ginger Blend 25cl (event pack)' },
  { value: 'sp-04', label: 'SP-04 · Cocoa Wafer 100g (private label)' },
]

export const specialProductionRuns = [
  { date: '03 Aug 2026', order: 'SO-0412', batch: 'SB-0771', client: 'Eko Hotels & Suites', product: 'SP-01 · Citrus Drink 33cl', qty: 1800, unit: 'Cartons', unitCost: 1420.00, price: 1980.00, materials: 'Refined Sugar, Citric Acid, Citrus Base Syrup, PET Preform', status: 'Delivered' },
  { date: '07 Aug 2026', order: 'SO-0415', batch: 'SB-0774', client: 'Federal Secretariat Catering', product: 'SP-02 · Malt Classic 50cl', qty: 2400, unit: 'Cartons', unitCost: 1685.00, price: 2250.00, materials: 'Malt Concentrate Blend, Refined Sugar, Crown Cork', status: 'Delivered' },
  { date: '13 Aug 2026', order: 'SO-0421', batch: 'SB-0780', client: 'Zenith Events Ltd', product: 'SP-03 · Ginger Blend 25cl', qty: 960, unit: 'Cartons', unitCost: 1150.00, price: 1640.00, materials: 'Ginger Infusion, Refined Sugar, Citric Acid, PET Preform', status: 'In production' },
  { date: '18 Aug 2026', order: 'SO-0426', batch: 'SB-0788', client: 'Ardova Retail Group', product: 'SP-04 · Cocoa Wafer 100g', qty: 3200, unit: 'Pieces', unitCost: 480.00, price: 720.00, materials: 'Cocoa Liquor Base, Refined Sugar, Wheat Flour', status: 'Delivered' },
  { date: '22 Aug 2026', order: 'SO-0431', batch: 'SB-0794', client: 'Eko Hotels & Suites', product: 'SP-01 · Citrus Drink 33cl', qty: 1500, unit: 'Cartons', unitCost: 1408.00, price: 1980.00, materials: 'Refined Sugar, Citric Acid, Citrus Base Syrup, PET Preform', status: 'Awaiting dispatch' },
]

export const specialStockOpening = 0
export const specialStockCardRows = [
  { sn: 1, date: '03 Aug 2026', remark: 'Special production SB-0771 — order SO-0412', qtyIn: 1800, qtyOut: 0 },
  { sn: 2, date: '05 Aug 2026', remark: 'Dispatched to Eko Hotels & Suites — waybill WB-8849', qtyIn: 0, qtyOut: 1800 },
  { sn: 3, date: '22 Aug 2026', remark: 'Special production SB-0794 — order SO-0431', qtyIn: 1500, qtyOut: 0 },
  { sn: 4, date: '23 Aug 2026', remark: 'Quantity adjustment QA-124 — label defect, withdrawn', qtyIn: 0, qtyOut: 45 },
]

// ── In-House Recipes (PRD §5.1.13–5.1.15) ────────────────────────────────────

/** Materials or recipes are sourced by Direct Importation or In-House Production. */
export const sourcingTypes = [
  { value: 'IN_HOUSE_PRODUCTION', label: 'In-House Production' },
  { value: 'DIRECT_IMPORTATION', label: 'Direct Importation' },
]

export const registeredRecipes = [
  { code: 'RC-01', name: 'Citrus Base Syrup', description: 'Concentrated citrus syrup base for the 50cl and 1L lines', unit: 'Litres', sourcing: 'In-House Production', yield: '480', factory: 'Factory A', status: 'Active' },
  { code: 'RC-02', name: 'Malt Concentrate Blend', description: 'Malt extract blend used across the Malt Classic range', unit: 'Litres', sourcing: 'In-House Production', yield: '360', factory: 'Factory A', status: 'Active' },
  { code: 'RC-03', name: 'Ginger Infusion', description: 'Steeped ginger infusion for the Ginger Blend line', unit: 'Litres', sourcing: 'In-House Production', yield: '240', factory: 'Factory B', status: 'Active' },
  { code: 'RC-04', name: 'Cocoa Liquor Base', description: 'Roasted cocoa liquor for wafer filling', unit: 'Kilograms', sourcing: 'In-House Production', yield: '180', factory: 'Factory B', status: 'Active' },
  { code: 'RC-05', name: 'Caramel Colourant', description: 'Caramel colourant — sourced abroad, registered for traceability', unit: 'Litres', sourcing: 'Direct Importation', yield: '—', factory: 'Factory A', status: 'Inactive' },
]

/** Completed in-house recipe production cycles. */
export const recipeProductionRuns = [
  { date: '02 Aug 2026', batch: 'RB-1204', recipe: 'RC-01 · Citrus Base Syrup', qty: 480, unit: 'Litres', unitCost: 8900.00, materials: 'Refined Sugar, Citric Acid, Concentrate — Citrus' },
  { date: '05 Aug 2026', batch: 'RB-1207', recipe: 'RC-02 · Malt Concentrate Blend', qty: 360, unit: 'Litres', unitCost: 11400.00, materials: 'Malt Extract, Refined Sugar' },
  { date: '10 Aug 2026', batch: 'RB-1211', recipe: 'RC-03 · Ginger Infusion', qty: 240, unit: 'Litres', unitCost: 9750.00, materials: 'Ginger Root, Citric Acid, Refined Sugar' },
  { date: '16 Aug 2026', batch: 'RB-1216', recipe: 'RC-04 · Cocoa Liquor Base', qty: 180, unit: 'Kilograms', unitCost: 14200.00, materials: 'Cocoa Powder, Refined Sugar' },
  { date: '21 Aug 2026', batch: 'RB-1223', recipe: 'RC-01 · Citrus Base Syrup', qty: 420, unit: 'Litres', unitCost: 8845.00, materials: 'Refined Sugar, Citric Acid, Concentrate — Citrus' },
]

/** Stock card view — how an in-house recipe is produced and drawn down over time. */
export const recipeStockOpening = 180
export const recipeStockCardRows = [
  { sn: 1, date: '02 Aug 2026', remark: 'In-house production RB-1204', qtyIn: 480, qtyOut: 0 },
  { sn: 2, date: '04 Aug 2026', remark: 'Consumed — production run PR-3311 (Citrus Drink 1L)', qtyIn: 0, qtyOut: 210 },
  { sn: 3, date: '08 Aug 2026', remark: 'Consumed — production run PR-3328 (Citrus Drink 50cl)', qtyIn: 0, qtyOut: 264 },
  { sn: 4, date: '15 Aug 2026', remark: 'Quantity adjustment QA-120 — evaporation loss', qtyIn: 0, qtyOut: 18 },
  { sn: 5, date: '21 Aug 2026', remark: 'In-house production RB-1223', qtyIn: 420, qtyOut: 0 },
  { sn: 6, date: '23 Aug 2026', remark: 'Consumed — production run PR-3390 (Citrus Drink 50cl)', qtyIn: 0, qtyOut: 492 },
]

// ── Total Cost for Selected Recipes (PRD §5.1.27) ────────────────────────────

/** Landing and usage cost per material over a chosen date range. */
export const recipeCostPool = [
  { key: 'rm-01', name: 'RM-01 · Refined Sugar', unit: 'Bags', qtyUsed: 74, unitCost: 48500.00, qtyOnHand: 62 },
  { key: 'rm-02', name: 'RM-02 · Citric Acid', unit: 'Kilograms', qtyUsed: 212, unitCost: 2750.00, qtyOnHand: 148 },
  { key: 'rm-03', name: 'RM-03 · Concentrate — Citrus', unit: 'Litres', qtyUsed: 365, unitCost: 6400.00, qtyOnHand: 315 },
  { key: 'rm-04', name: 'RM-04 · PET Preform 28mm', unit: 'Pieces', qtyUsed: 18200, unitCost: 38.50, qtyOnHand: 24800 },
  { key: 'rm-05', name: 'RM-05 · Crown Cork', unit: 'Pieces', qtyUsed: 20800, unitCost: 9.20, qtyOnHand: 61200 },
  { key: 'rm-06', name: 'RM-06 · Cocoa Powder', unit: 'Kilograms', qtyUsed: 168, unitCost: 12400.00, qtyOnHand: 172 },
  { key: 'rc-01', name: 'RC-01 · Citrus Base Syrup', unit: 'Litres', qtyUsed: 240, unitCost: 8900.00, qtyOnHand: 96 },
  { key: 'rc-03', name: 'RC-03 · Ginger Infusion', unit: 'Litres', qtyUsed: 118, unitCost: 9750.00, qtyOnHand: 54 },
]

// ── Stock Transfer (PRD §5.1.10) ─────────────────────────────────────────────

export const transferDestinations = [
  { value: 'sr-ikeja', label: 'Showroom Ikeja', kind: 'Showroom', address: '14 Awolowo Way, Ikeja, Lagos' },
  { value: 'sr-lekki', label: 'Showroom Lekki', kind: 'Showroom', address: '3B Admiralty Way, Lekki Phase 1, Lagos' },
  { value: 'sr-abuja', label: 'Showroom Abuja', kind: 'Showroom', address: '22 Gimbiya Street, Area 11, Garki, Abuja' },
  { value: 'dl-bendel', label: 'Bendel Stores (Dealer)', kind: 'Dealer', address: '7 Akpakpava Road, Benin City, Edo' },
  { value: 'dl-kano', label: 'Kano Central Distributors (Dealer)', kind: 'Dealer', address: '48 Murtala Mohammed Way, Kano' },
  { value: 'fb', label: 'Factory B — Sango Otta', kind: 'Factory', address: 'Km 8 Idiroko Road, Sango Otta, Ogun' },
]

export const drivers = [
  { value: 'drv-1', label: 'Musa Danjuma', vehicle: 'LAG-482-XA' },
  { value: 'drv-2', label: 'Emeka Nwosu', vehicle: 'LAG-771-KJ' },
  { value: 'drv-3', label: 'Ibrahim Sule', vehicle: 'ABJ-205-YT' },
]

export const recentTransfers = [
  { ref: 'WB-8931', destination: 'Bendel Stores', qty: '2,400 pcs', when: '19 Aug, 07:20', by: 'A. Bello' },
  { ref: 'WB-8905', destination: 'Showroom Abuja', qty: '420 ctn', when: '14 Aug, 06:45', by: 'A. Bello' },
  { ref: 'WB-8867', destination: 'Showroom Ikeja', qty: '400 ctn', when: '09 Aug, 08:10', by: 'K. Umeh' },
]

// ── Quantity Adjustment (PRD §5.1.7) ─────────────────────────────────────────

export const adjustmentReasons = [
  { value: 'stocktake', label: 'Stock take variance' },
  { value: 'damage', label: 'Damaged / broken' },
  { value: 'expiry', label: 'Expired stock write-off' },
  { value: 'theft', label: 'Suspected theft / loss' },
  { value: 'miscount', label: 'Previous miscount correction' },
  { value: 'return', label: 'Unrecorded return' },
  { value: 'other', label: 'Other (explain in note)' },
]

/** Live recorded quantities, so an adjustment line can show its variance. */
export const liveQuantities = {
  'zf-101': 1521, 'zf-102': 742, 'zf-210': 2105, 'zf-315': 486, 'zf-420': 7900,
  'rm-01': 62, 'rm-02': 148, 'rm-03': 315, 'rm-04': 24800, 'rm-05': 61200, 'rm-06': 172,
}

export const recentAdjustments = [
  { ref: 'QA-121', item: 'Citrus Drink 50cl', change: -12, reason: 'Stock take variance', when: 'Today, 08:40', by: 'A. Bello' },
  { ref: 'QA-119', item: 'Citrus Drink 1L', change: -24, reason: 'Damaged / broken', when: '08 Aug, 15:12', by: 'A. Bello' },
  { ref: 'QA-117', item: 'Crown Cork', change: 350, reason: 'Previous miscount correction', when: '05 Aug, 11:03', by: 'K. Umeh' },
]

/** Recent activity feeds shown alongside entry forms. */
export const recentRefills = [
  { ref: 'RF-2481', product: 'Citrus Drink 50cl', qty: '+240 ctn', when: 'Today, 09:12', by: 'A. Bello' },
  { ref: 'RF-2480', product: 'Malt Classic 33cl', qty: '+180 ctn', when: 'Yesterday, 16:40', by: 'A. Bello' },
  { ref: 'RF-2478', product: 'Ginger Blend 50cl', qty: '+95 ctn', when: '22 Aug, 11:05', by: 'K. Umeh' },
]

export const recentDeliveries = [
  { ref: 'DL-1140', material: 'Refined Sugar', qty: '+60 bags', when: 'Today, 08:05', by: 'K. Umeh' },
  { ref: 'DL-1139', material: 'PET Preform 28mm', qty: '+12,000 pcs', when: 'Yesterday, 14:22', by: 'A. Bello' },
  { ref: 'DL-1137', material: 'Citric Acid', qty: '+150 kg', when: '21 Aug, 10:48', by: 'K. Umeh' },
]
