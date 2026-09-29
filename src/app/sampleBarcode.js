// Barcode & QR placeholder data (PRD §5.11).
// Codes mirror those already registered in the stock, outsource and POS data,
// so a scan here resolves to the same item the other modules would select.

export const scannableItems = [
  { code: 'ZF-101', name: 'Citrus Drink 50cl', kind: 'Finished product', barcode: '6151100101012', symbology: 'EAN-13', unit: 'Cartons', price: 2400.00, stock: 420, location: 'Showroom Ikeja', status: 'Active' },
  { code: 'ZF-102', name: 'Citrus Drink 1L', kind: 'Finished product', barcode: '6151100102019', symbology: 'EAN-13', unit: 'Cartons', price: 3950.00, stock: 150, location: 'Showroom Ikeja', status: 'Active' },
  { code: 'ZF-210', name: 'Malt Classic 33cl', kind: 'Finished product', barcode: '6151100210014', symbology: 'EAN-13', unit: 'Cartons', price: 2150.00, stock: 640, location: 'Showroom Ikeja', status: 'Active' },
  { code: 'ZF-315', name: 'Ginger Blend 50cl', kind: 'Finished product', barcode: '6151100315016', symbology: 'EAN-13', unit: 'Cartons', price: 2600.00, stock: 88, location: 'Showroom Ikeja', status: 'Active' },
  { code: 'ZF-420', name: 'Cocoa Wafer 40g', kind: 'Finished product', barcode: '6151100420010', symbology: 'EAN-13', unit: 'Pieces', price: 320.00, stock: 7900, location: 'Factory B', status: 'Suspended' },
  { code: 'RM-01', name: 'Refined Sugar', kind: 'Raw material', barcode: '6151200010017', symbology: 'EAN-13', unit: 'Bags', price: 48500.00, stock: 62, location: 'Factory A', status: 'Active' },
  { code: 'RM-02', name: 'Citric Acid', kind: 'Raw material', barcode: '6151200020016', symbology: 'EAN-13', unit: 'Kilograms', price: 2750.00, stock: 148, location: 'Factory A', status: 'Active' },
  { code: 'RM-04', name: 'PET Preform 28mm', kind: 'Raw material', barcode: '6151200040014', symbology: 'EAN-13', unit: 'Pieces', price: 38.50, stock: 24800, location: 'Factory B', status: 'Active' },
  { code: 'RC-01', name: 'Citrus Base Syrup', kind: 'In-house recipe', barcode: 'ZIQ-RC-01-0480', symbology: 'QR', unit: 'Litres', price: 8900.00, stock: 96, location: 'Factory A', status: 'Active' },
  { code: 'RC-03', name: 'Ginger Infusion', kind: 'In-house recipe', barcode: 'ZIQ-RC-03-0240', symbology: 'QR', unit: 'Litres', price: 9750.00, stock: 54, location: 'Factory B', status: 'Active' },
  { code: 'OS-01', name: 'Sparkling Water 75cl', kind: 'Outsourced product', barcode: '6151300010018', symbology: 'EAN-13', unit: 'Cartons', price: 2750.00, stock: 320, location: 'Showroom Ikeja', status: 'Active' },
  { code: 'OS-02', name: 'Tonic Water 33cl', kind: 'Outsourced product', barcode: '6151300020017', symbology: 'EAN-13', unit: 'Cartons', price: 2050.00, stock: 400, location: 'Showroom Ikeja', status: 'Active' },
  // Registered but never labelled — surfaces in the "needs a label" view.
  { code: 'RM-06', name: 'Cocoa Powder', kind: 'Raw material', barcode: null, symbology: null, unit: 'Kilograms', price: 12400.00, stock: 172, location: 'Factory B', status: 'Active' },
  { code: 'RC-04', name: 'Cocoa Liquor Base', kind: 'In-house recipe', barcode: null, symbology: null, unit: 'Kilograms', price: 14200.00, stock: 0, location: 'Factory B', status: 'Active' },
]

/** Screens the PRD lists as scan-enabled. Each keeps manual entry as a fallback. */
export const scanPoints = [
  { module: 'Stock Refill', detail: 'Finished product and raw material intake', icon: 'package-plus', role: 'Stock Keeper' },
  { module: 'Stock Transfer', detail: 'Selecting items to move between locations', icon: 'truck', role: 'Stock Keeper' },
  { module: 'Quantity Adjustment', detail: 'Identifying the item being corrected', icon: 'sliders-horizontal', role: 'Stock Keeper' },
  { module: 'Receive Product', detail: 'Checking goods in against a waybill', icon: 'package-check', role: 'Showroom Staff' },
  { module: 'POS', detail: 'Adding an item to a sale', icon: 'scan-line', role: 'Cashier' },
]

/** A short scan log, including a code that matches nothing. */
export const recentScans = [
  { time: '09:42:18', code: '6151100101012', result: 'Matched', item: 'ZF-101 · Citrus Drink 50cl', context: 'POS', by: 'F. Adeniyi' },
  { time: '09:41:52', code: '6151300010018', result: 'Matched', item: 'OS-01 · Sparkling Water 75cl', context: 'POS', by: 'F. Adeniyi' },
  { time: '09:38:04', code: '5901234123457', result: 'Not recognised', item: '—', context: 'Stock Refill', by: 'A. Bello' },
  { time: '09:35:11', code: 'ZIQ-RC-01-0480', result: 'Matched', item: 'RC-01 · Citrus Base Syrup', context: 'Recipe production', by: 'K. Umeh' },
  { time: '09:30:47', code: '6151100420010', result: 'Blocked', item: 'ZF-420 · Cocoa Wafer 40g', context: 'POS', by: 'B. Okafor', note: 'Product suspended from sale' },
  { time: '09:22:30', code: '6151200010017', result: 'Matched', item: 'RM-01 · Refined Sugar', context: 'Stock Refill', by: 'A. Bello' },
]

export const labelSizes = [
  { value: '40x25', label: '40 × 25 mm — small product' },
  { value: '58x40', label: '58 × 40 mm — standard' },
  { value: '100x50', label: '100 × 50 mm — carton' },
  { value: 'a4', label: 'A4 sheet — 24 per page' },
]
