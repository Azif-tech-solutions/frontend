// AI module placeholder data (PRD §5.9). Every figure here is a projection or a
// flag for review — none of it is a recorded transaction.

/** Smart Re-Order Forecasting — extends the static Re-Order Report. */
export const reorderForecasts = [
  { item: 'RM-06 · Cocoa Powder', unit: 'Kilograms', onHand: 172, reorderLevel: 260, dailyUse: 8.4, trend: 'rising', forecastDate: '24 Aug 2026', daysToThreshold: 0, suggested: 220, leadTime: 21, confidence: 88, history: 214, spike: false },
  { item: 'RC-01 · Citrus Base Syrup', unit: 'Litres', onHand: 96, reorderLevel: 120, dailyUse: 21.8, trend: 'rising', forecastDate: '24 Aug 2026', daysToThreshold: 0, suggested: 90, leadTime: 2, confidence: 91, history: 198, spike: true },
  { item: 'RC-03 · Ginger Infusion', unit: 'Litres', onHand: 54, reorderLevel: 90, dailyUse: 5.1, trend: 'steady', forecastDate: '24 Aug 2026', daysToThreshold: 0, suggested: 90, leadTime: 3, confidence: 84, history: 176, spike: false },
  { item: 'RM-01 · Refined Sugar', unit: 'Bags', onHand: 62, reorderLevel: 40, dailyUse: 2.6, trend: 'rising', forecastDate: '02 Sep 2026', daysToThreshold: 9, suggested: 60, leadTime: 10, confidence: 82, history: 224, spike: false },
  { item: 'RM-03 · Concentrate — Citrus', unit: 'Litres', onHand: 315, reorderLevel: 200, dailyUse: 12.2, trend: 'steady', forecastDate: '12 Sep 2026', daysToThreshold: 19, suggested: 200, leadTime: 18, confidence: 79, history: 210, spike: false },
  { item: 'RM-02 · Citric Acid', unit: 'Kilograms', onHand: 148, reorderLevel: 75, dailyUse: 6.8, trend: 'falling', forecastDate: '03 Oct 2026', daysToThreshold: 40, suggested: 0, leadTime: 14, confidence: 74, history: 190, spike: false },
  { item: 'RM-04 · PET Preform 28mm', unit: 'Pieces', onHand: 24800, reorderLevel: 5000, dailyUse: 610, trend: 'steady', forecastDate: '25 Sep 2026', daysToThreshold: 32, suggested: 0, leadTime: 12, confidence: 86, history: 220, spike: false },
  // Registered too recently to forecast — falls back to the static threshold.
  { item: 'RM-12 · Vanilla Extract', unit: 'Litres', onHand: 40, reorderLevel: 25, dailyUse: null, trend: null, forecastDate: null, daysToThreshold: null, suggested: null, leadTime: 16, confidence: 12, history: 11, spike: false },
]

/** Recipe Cost Optimizer — substitutions that stay inside registered tolerances. */
export const recipeOptimisations = [
  {
    recipe: 'RC-01 · Citrus Base Syrup', batch: '480 L', currentCost: 8900.00, confidence: 87,
    changes: [
      { material: 'RM-01 · Refined Sugar', from: '96 bags', to: '88 bags', delta: -388000, note: 'Within registered sweetness tolerance' },
      { material: 'RM-03 · Concentrate — Citrus', from: '210 L', to: '222 L', delta: 76800, note: 'Compensates for reduced sugar' },
    ],
    proposedCost: 8250.00, spec: 'Within spec', status: 'Awaiting Management approval',
  },
  {
    recipe: 'RC-02 · Malt Concentrate Blend', batch: '360 L', currentCost: 11400.00, confidence: 71,
    changes: [
      { material: 'RM-01 · Refined Sugar', from: '74 bags', to: '70 bags', delta: -194000, note: 'Within registered tolerance' },
    ],
    proposedCost: 10860.00, spec: 'Within spec', status: 'Awaiting Management approval',
  },
  {
    recipe: 'RC-03 · Ginger Infusion', batch: '240 L', currentCost: 9750.00, confidence: 58,
    changes: [
      { material: 'RM-02 · Citric Acid', from: '48 kg', to: '52 kg', delta: 11000, note: 'Raises acidity — near upper tolerance' },
    ],
    proposedCost: 9690.00, spec: 'Near tolerance limit', status: 'Flagged for QC review',
  },
]

/** Cash Flow Forecasting — projections with an explicit confidence range. */
export const cashForecast = {
  openingPosition: 10605000,
  horizons: [
    { days: 7, inflow: 6240000, outflow: 4180000, low: 1620000, high: 2500000, confidence: 86 },
    { days: 30, inflow: 24800000, outflow: 21400000, low: 1900000, high: 4900000, confidence: 74 },
    { days: 90, inflow: 71200000, outflow: 74600000, low: -6800000, high: 100000, confidence: 61 },
  ],
  weeks: [
    { period: 'Week of 25 Aug', inflow: 6240000, outflow: 4180000, confidence: 86 },
    { period: 'Week of 01 Sep', inflow: 5980000, outflow: 5420000, confidence: 81 },
    { period: 'Week of 08 Sep', inflow: 6410000, outflow: 6900000, confidence: 76 },
    { period: 'Week of 15 Sep', inflow: 6170000, outflow: 4900000, confidence: 72 },
    { period: 'Week of 22 Sep', inflow: 5840000, outflow: 8210000, confidence: 68 },
  ],
  recurring: [
    { label: 'Direct labour & wages', amount: 3240000, due: '28 of each month', source: 'Expenses/Payment List Guide' },
    { label: 'Energy & utilities', amount: 1485000, due: '15 of each month', source: 'Expenses/Payment List Guide' },
    { label: 'Logistics & haulage', amount: 940000, due: 'Weekly', source: 'Expenses/Payment List Guide' },
    { label: 'Raw material purchases', amount: 6950000, due: '21 Sep 2026', source: 'Re-Order Report' },
  ],
}

/** Sales & Demand Forecasting — per product per showroom. */
export const demandForecasts = [
  { product: 'ZF-101 · Citrus Drink 50cl', showroom: 'Showroom Ikeja', sold: 1840, forecast: 2140, stock: 1280, trend: 'rising', seasonality: 'Dry-season uplift', confidence: 89, history: 240 },
  { product: 'ZF-102 · Citrus Drink 1L', showroom: 'Showroom Ikeja', sold: 620, forecast: 710, stock: 150, trend: 'rising', seasonality: 'Dry-season uplift', confidence: 84, history: 240 },
  { product: 'ZF-210 · Malt Classic 33cl', showroom: 'Showroom Ikeja', sold: 1480, forecast: 1390, stock: 640, trend: 'falling', seasonality: 'None', confidence: 81, history: 240 },
  { product: 'ZF-315 · Ginger Blend 50cl', showroom: 'Showroom Abuja', sold: 410, forecast: 560, stock: 88, trend: 'rising', seasonality: 'Promotion active', confidence: 77, history: 190 },
  { product: 'OS-01 · Sparkling Water 75cl', showroom: 'Showroom Ikeja', sold: 180, forecast: 240, stock: 320, trend: 'rising', seasonality: 'None', confidence: 68, history: 96 },
  { product: 'ZF-420 · Cocoa Wafer 40g', showroom: 'Showroom Lekki', sold: 5200, forecast: 4800, stock: 7900, trend: 'falling', seasonality: 'None', confidence: 72, history: 150 },
  // No sales history — must never be presented as data-backed.
  { product: 'SP-04 · Cocoa Wafer 100g', showroom: 'Showroom Lekki', sold: 0, forecast: null, stock: 0, trend: null, seasonality: null, confidence: 0, history: 0 },
]

/** Fraud/Anomaly Detection — a queue for human review, never automatic action. */
export const anomalies = [
  {
    ref: 'AN-0231', detected: '24 Aug 2026, 08:12', subject: 'B. Okafor', role: 'Cashier', location: 'Showroom Lekki',
    category: 'Wallet withdrawal timing', severity: 'High', confidence: 84,
    detail: 'Wallet debit of ₦380,000 against Owerri Beverage Depot recorded 4 minutes after till open, outside this cashier\'s normal withdrawal pattern of 14:00–17:00.',
    evidence: ['WD-0324', 'TXN-4402'], status: 'Awaiting review',
  },
  {
    ref: 'AN-0228', detected: '23 Aug 2026, 17:44', subject: 'B. Okafor', role: 'Cashier', location: 'Showroom Lekki',
    category: 'Repeated round-number discounts', severity: 'Medium', confidence: 76,
    detail: 'Four discounts in one shift, each an exact multiple of ₦5,000. Round-number clustering is 6× this cashier\'s baseline.',
    evidence: ['DS-0218', 'DS-0219', 'DS-0220', 'DS-0221'], status: 'Awaiting review',
  },
  {
    ref: 'AN-0224', detected: '22 Aug 2026, 11:30', subject: 'N. Eze', role: 'Cashier', location: 'Showroom Abuja',
    category: 'Adjustment frequency outlier', severity: 'Medium', confidence: 69,
    detail: 'Seven quantity adjustments logged in 5 days against a location baseline of 1.2 per week.',
    evidence: ['QA-121', 'QA-129'], status: 'Under investigation',
  },
  {
    ref: 'AN-0219', detected: '20 Aug 2026, 09:05', subject: 'F. Adeniyi', role: 'Cashier', location: 'Showroom Ikeja',
    category: 'Receipt voiding pattern', severity: 'Low', confidence: 52,
    detail: 'Three receipts voided after payment confirmation within one shift.',
    evidence: ['RCP-88413'], status: 'Dismissed — false positive',
    dismissedBy: 'M. Okonkwo', dismissedReason: 'Verified as genuine customer cancellations during a power outage.',
  },
  {
    ref: 'AN-0211', detected: '15 Aug 2026, 14:20', subject: 'Showroom Abuja', role: 'Location', location: 'Showroom Abuja',
    category: 'Stock adjustment value outlier', severity: 'High', confidence: 81,
    detail: 'Negative adjustment of 24 cartons cited suspected theft, 3× the location\'s largest prior adjustment.',
    evidence: ['QA-129'], status: 'Confirmed — referred to audit',
    confirmedBy: 'M. Okonkwo',
  },
]

/** Document OCR Capture — extraction awaiting user confirmation. */
export const ocrJobs = [
  { ref: 'OCR-0442', uploaded: '24 Aug 2026, 09:20', file: 'delivery-note-ardova-99310.jpg', docType: 'Delivery note', pages: 1, status: 'Awaiting review', by: 'A. Bello' },
  { ref: 'OCR-0439', uploaded: '23 Aug 2026, 15:02', file: 'invoice-lagos-packaging-4417.pdf', docType: 'Supplier invoice', pages: 2, status: 'Confirmed', by: 'R. Danladi' },
  { ref: 'OCR-0435', uploaded: '22 Aug 2026, 10:41', file: 'delivery-note-aquavita-2210.jpg', docType: 'Delivery note', pages: 1, status: 'Confirmed', by: 'F. Adeniyi' },
]

export const ocrExtraction = {
  ref: 'OCR-0442', file: 'delivery-note-ardova-99310.jpg', docType: 'Delivery note',
  fields: [
    { label: 'Supplier', value: 'Ardova Commodities Ltd', confidence: 96, target: 'Supplier' },
    { label: 'Delivery note no.', value: 'ACL-99310', confidence: 94, target: 'Waybill / invoice no.' },
    { label: 'Material', value: 'Concentrate — Citrus', confidence: 91, target: 'Raw material' },
    { label: 'Quantity', value: '200', confidence: 89, target: 'Qty arrived' },
    { label: 'Unit', value: 'Litres', confidence: 93, target: 'Unit' },
    { label: 'Manufacturer', value: 'Jubaili Bros', confidence: 72, target: 'Manufacturer' },
    { label: 'Manufactured date', value: '05 Aug 2026', confidence: 66, target: 'Manufactured' },
    { label: 'Expiry date', value: null, confidence: 0, target: 'Expiry date' },
    { label: 'Unit cost', value: null, confidence: 0, target: 'Unit cost' },
  ],
}

/** ZifIQ Assistant — a worked multi-turn exchange. */
export const assistantThread = [
  { from: 'user', text: 'What is our closing stock value at Factory A?' },
  {
    from: 'assistant',
    text: 'Factory A holds ₦12,480,000 in stock at landing cost as at 23 Aug 2026, across 10 line items — 5 finished products and 5 raw materials.',
    sources: ['Comprehensive Stock Report'],
    confidence: 94,
  },
  { from: 'user', text: 'And what was the gross margin there last month?' },
  {
    from: 'assistant',
    text: 'Factory A returned a gross profit of ₦7,825,000 on revenue of ₦22,865,000 for August 2026 — a gross margin of 34.2%. That is up from 32.4% in the prior period.',
    sources: ['SCI Factory', 'Production Cost Calculator'],
    confidence: 91,
    calculation: 'Gross profit ÷ revenue = 7,825,000 ÷ 22,865,000 = 34.2%',
  },
  { from: 'user', text: 'Can you move 200 cartons of ZF-101 to Showroom Lekki?' },
  {
    from: 'assistant',
    text: 'I cannot move stock myself — I only retrieve and calculate. Factory A currently holds 1,521 cartons of ZF-101, so the transfer is possible. Open Stock Transfer to complete it.',
    sources: ['Comprehensive Stock Report'],
    confidence: 88,
    deepLink: 'Stock Transfer',
    refused: true,
  },
  { from: 'user', text: 'Which dealer owes us the most right now?' },
  {
    from: 'assistant',
    text: 'Owerri Beverage Depot has the largest outstanding balance at ₦1,284,000 across 3 unpaid invoices, the oldest 62 days past due. That balance also exceeds their ₦500,000 credit limit.',
    sources: ['Debtors List', 'Invoice Status & Payment Tracking'],
    confidence: 96,
  },
]

export const assistantSuggestions = [
  'What is our closing stock value at Factory A?',
  'Which products are below their re-order level?',
  'Show me net profit for August',
  'Quel est le solde du portefeuille de Bendel Stores ?',
]

/** Executive Insights — the scheduled briefing. */
export const briefings = [
  { ref: 'BR-0188', period: 'Week of 18–24 Aug 2026', generated: '24 Aug 2026, 06:00', cadence: 'Weekly', items: 6, flags: 2, status: 'Current' },
  { ref: 'BR-0187', period: 'Week of 11–17 Aug 2026', generated: '17 Aug 2026, 06:00', cadence: 'Weekly', items: 5, flags: 1, status: 'Archived' },
  { ref: 'BR-0186', period: 'Week of 04–10 Aug 2026', generated: '10 Aug 2026, 06:00', cadence: 'Weekly', items: 7, flags: 0, status: 'Archived' },
]

export const briefingItems = [
  {
    kind: 'Sales', tone: 'positive', headline: 'Sales up 12.4% week on week',
    detail: 'Showroom Ikeja recorded ₦25.88M in net sales this week against ₦23.02M last week, led by Citrus Drink 50cl. Average transaction value rose to ₦39,272.',
    sources: ['Sales Report'],
  },
  {
    kind: 'Cash', tone: 'negative', headline: 'Outflow forecast to exceed inflow in week of 22 Sep',
    detail: 'Projected outflow of ₦8.21M against ₦5.84M inflow, driven by a scheduled raw material purchase and monthly wages falling in the same week. Confidence is 68%.',
    sources: ['Cash Flow Forecasting', 'Expenses/Payment List Guide'],
  },
  {
    kind: 'Stock', tone: 'warning', headline: 'Three materials at or below re-order level',
    detail: 'Cocoa Powder, Ginger Infusion and Citrus Base Syrup have all reached their thresholds. Cocoa Powder carries a 21-day lead time, the longest of the three.',
    sources: ['Re-Order Report', 'Smart Re-Order Forecasting'],
  },
  {
    kind: 'Stock', tone: 'warning', headline: 'Ginger Blend 50cl at risk of stockout in Abuja',
    detail: 'Forecast demand of 560 cartons against 88 in stock over the next 30 days. A transfer from Factory B would cover the gap.',
    sources: ['Sales & Demand Forecasting', 'Comprehensive Stock Report'],
  },
  {
    kind: 'Risk', tone: 'negative', headline: 'Two anomalies flagged for review',
    detail: 'A wallet withdrawal timing anomaly and a round-number discount pattern, both against the same cashier at Showroom Lekki. Neither has been actioned automatically.',
    sources: ['Fraud/Anomaly Detection'],
  },
  {
    kind: 'Receivables', tone: 'negative', headline: '₦1.28M overdue past 30 days',
    detail: 'Owerri Beverage Depot accounts for the whole of it, across three invoices, and now sits above their credit limit.',
    sources: ['Debtors List'],
  },
]
