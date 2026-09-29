// Menu Button module placeholder data (PRD §5.8), plus the roles matrix from §7.

/** §5.8.1 — registered dealers and their wallet position. */
export const dealerRegister = [
  { code: 'DL-0012', name: 'Bendel Stores', category: 'Platinum', contact: 'Kelechi Osagie', phone: '+234 803 114 2200', address: '7 Akpakpava Road, Benin City, Edo', state: 'Edo', showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', wallet: 486500, creditLimit: 2000000, registered: '14 May 2022', status: 'Active' },
  { code: 'DL-0019', name: 'Kano Central Distributors', category: 'Platinum', contact: 'Aisha Yusuf', phone: '+234 802 447 1190', address: '48 Murtala Mohammed Way, Kano', state: 'Kano', showroom: 'Showroom Abuja', rep: 'Hauwa Ibrahim', wallet: 1240000, creditLimit: 3000000, registered: '02 Nov 2022', status: 'Active' },
  { code: 'DL-0031', name: 'Owerri Beverage Depot', category: 'Silver', contact: 'Chinedu Eze', phone: '+234 805 220 6612', address: '18 Douglas Road, Owerri, Imo', state: 'Imo', showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', wallet: 0, creditLimit: 500000, registered: '09 Mar 2024', status: 'Watch' },
  { code: 'DL-0038', name: 'Ibadan Beverage Traders', category: 'Gold', contact: 'Femi Adeyinka', phone: '+234 807 331 5540', address: '12 Ring Road, Ibadan, Oyo', state: 'Oyo', showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', wallet: 320000, creditLimit: 1200000, registered: '21 Jan 2026', status: 'Active' },
]

export const dealerCategories = [
  { value: 'platinum', label: 'Platinum', discount: '5%', limit: 3000000 },
  { value: 'gold', label: 'Gold', discount: '3.5%', limit: 1500000 },
  { value: 'silver', label: 'Silver', discount: '2%', limit: 500000 },
  { value: 'bronze', label: 'Bronze', discount: '0%', limit: 200000 },
]

/** §5.8.2 — the till's product catalogue with live stock at the showroom. */
export const posCatalogue = [
  { code: 'ZF-101', name: 'Citrus Drink 50cl', unit: 'Cartons', price: 2400.00, dealerPrice: 2280.00, stock: 420, barcode: '6151100101012', group: 'Citrus Drink' },
  { code: 'ZF-102', name: 'Citrus Drink 1L', unit: 'Cartons', price: 3950.00, dealerPrice: 3750.00, stock: 150, barcode: '6151100102019', group: 'Citrus Drink' },
  { code: 'ZF-210', name: 'Malt Classic 33cl', unit: 'Cartons', price: 2150.00, dealerPrice: 2040.00, stock: 640, barcode: '6151100210014', group: 'Malt Classic' },
  { code: 'ZF-315', name: 'Ginger Blend 50cl', unit: 'Cartons', price: 2600.00, dealerPrice: 2470.00, stock: 88, barcode: '6151100315016', group: 'Citrus Drink' },
  { code: 'OS-01', name: 'Sparkling Water 75cl', unit: 'Cartons', price: 2750.00, dealerPrice: 2610.00, stock: 320, barcode: '6151300010018', group: 'Outsourced' },
  { code: 'OS-02', name: 'Tonic Water 33cl', unit: 'Cartons', price: 2050.00, dealerPrice: 1950.00, stock: 400, barcode: '6151300020017', group: 'Outsourced' },
  { code: 'CHI-01', name: 'Chivita 100% Orange 1L', unit: 'Cartons', price: 5400.00, dealerPrice: 5130.00, stock: 240, barcode: '—', group: 'Ungrouped' },
  { code: 'BIG-01', name: 'Bigi Cola 60cl', unit: 'Cartons', price: 3400.00, dealerPrice: 3230.00, stock: 400, barcode: '—', group: 'Ungrouped' },
]

/** Buyers selectable at the till. A dealer brings a wallet and a rep with them. */
export const posCustomers = [
  { value: 'walkin', label: 'Walk-in customer', type: 'Retail', wallet: null, rep: '—' },
  { value: 'dl-0012', label: 'Bendel Stores', type: 'Authorised Dealer', wallet: 486500, rep: 'Adaeze Nwankwo', category: 'Platinum' },
  { value: 'dl-0019', label: 'Kano Central Distributors', type: 'Authorised Dealer', wallet: 1240000, rep: 'Hauwa Ibrahim', category: 'Platinum' },
  { value: 'dl-0031', label: 'Owerri Beverage Depot', type: 'Authorised Dealer', wallet: 0, rep: 'Adaeze Nwankwo', category: 'Silver' },
  { value: 'cu-0044', label: 'Eko Hotels & Suites', type: 'Special Customer', wallet: null, deposit: 6400000, rep: 'Tunde Bakare' },
]

export const paymentChannels = [
  { key: 'cash', label: 'Cash', icon: 'banknote' },
  { key: 'pos', label: 'POS', icon: 'credit-card' },
  { key: 'transfer', label: 'Fund transfer', icon: 'arrow-left-right' },
  { key: 'wallet', label: 'Dealer wallet', icon: 'wallet' },
]

/** §5.8.3 — customers and dealers with money owed to the company. */
export const debtors = [
  {
    code: 'DL-0031', name: 'Owerri Beverage Depot', type: 'Authorised Dealer', phone: '+234 805 220 6612',
    showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', outstanding: 1284000, creditLimit: 500000,
    oldestDays: 62, lastPayment: '18 Jun 2026', invoices: 3,
    transactions: [
      { date: '22 Jun 2026', ref: 'INV-30880', description: 'Malt Classic 33cl × 400', value: 860000, paid: 0, balance: 860000, dueDate: '22 Jul 2026' },
      { date: '02 Jul 2026', ref: 'INV-30944', description: 'Citrus Drink 50cl × 180', value: 432000, paid: 200000, balance: 232000, dueDate: '01 Aug 2026' },
      { date: '19 Jul 2026', ref: 'INV-31022', description: 'Ginger Blend 50cl × 90', value: 234000, paid: 42000, balance: 192000, dueDate: '18 Aug 2026' },
    ],
  },
  {
    code: 'DL-0038', name: 'Ibadan Beverage Traders', type: 'Authorised Dealer', phone: '+234 807 331 5540',
    showroom: 'Showroom Ikeja', rep: 'Adaeze Nwankwo', outstanding: 640000, creditLimit: 1200000,
    oldestDays: 21, lastPayment: '09 Aug 2026', invoices: 2,
    transactions: [
      { date: '03 Aug 2026', ref: 'INV-31188', description: 'Citrus Drink 1L × 120', value: 474000, paid: 200000, balance: 274000, dueDate: '02 Sep 2026' },
      { date: '14 Aug 2026', ref: 'INV-31274', description: 'Tonic Water 33cl × 180', value: 366000, paid: 0, balance: 366000, dueDate: '13 Sep 2026' },
    ],
  },
  {
    code: 'CU-0052', name: 'Federal Secretariat Catering', type: 'Special Customer', phone: '+234 803 991 4402',
    showroom: 'Showroom Abuja', rep: 'Hauwa Ibrahim', outstanding: 410000, creditLimit: 2000000,
    oldestDays: 9, lastPayment: '15 Aug 2026', invoices: 1,
    transactions: [
      { date: '15 Aug 2026', ref: 'INV-31290', description: 'Special production balance — SO-0415', value: 5400000, paid: 4990000, balance: 410000, dueDate: '14 Sep 2026' },
    ],
  },
]

/** §5.8.4 — system users and the roles that govern their access. */
export const systemRoles = [
  { value: 'admin', label: 'Administrator', view: 'All', create: true, edit: true, approve: true, del: true, note: 'Unrestricted access across every module.' },
  { value: 'management', label: 'Management', view: 'All, including cost data', create: false, edit: false, approve: true, del: false, note: 'Sees landing cost and approves; does not create or edit records.' },
  { value: 'accounts', label: 'Accounts Personnel', view: 'All', create: true, edit: true, approve: true, del: false, note: 'Approves financial transactions only.' },
  { value: 'stockkeeper', label: 'Stock Keeper', view: 'All', create: true, edit: false, approve: false, del: false, note: 'Creates stock entries and adjustments.' },
  { value: 'qc', label: 'Quality Control', view: 'Limited, no cost data', create: true, edit: false, approve: false, del: false, note: 'Creates production entries without seeing cost.' },
  { value: 'cashier', label: 'Cashier', view: 'Own transactions', create: true, edit: false, approve: false, del: false, note: 'Creates POS sales and invoices.' },
  { value: 'correspondent', label: 'Correspondent (Sales Rep)', view: 'Own customers', create: false, edit: false, approve: false, del: false, note: 'Read-only across their own customer base.' },
  { value: 'dealer', label: 'Dealer / Customer', view: 'Own account', create: false, edit: false, approve: false, del: false, note: 'Self-service view of their own account only.' },
]

export const systemUsers = [
  { username: 'm.okonkwo', name: 'M. Okonkwo', role: 'Administrator', showroom: 'All locations', phone: '+234 802 000 0001', lastSignIn: '24 Aug 2026, 07:52', created: '12 Mar 2019', status: 'Active' },
  { username: 't.adeyemi', name: 'T. Adeyemi', role: 'Management', showroom: 'All locations', phone: '+234 802 000 0004', lastSignIn: '23 Aug 2026, 18:14', created: '04 Sep 2020', status: 'Active' },
  { username: 'r.danladi', name: 'R. Danladi', role: 'Accounts Personnel', showroom: 'Showroom Ikeja', phone: '+234 803 221 8890', lastSignIn: '24 Aug 2026, 08:31', created: '22 Aug 2021', status: 'Active' },
  { username: 'f.adeniyi', name: 'F. Adeniyi', role: 'Cashier', showroom: 'Showroom Ikeja', phone: '+234 806 114 2201', lastSignIn: '24 Aug 2026, 07:40', created: '04 Feb 2023', status: 'Active' },
  { username: 'b.okafor', name: 'B. Okafor', role: 'Cashier', showroom: 'Showroom Lekki', phone: '+234 809 337 4412', lastSignIn: '23 Aug 2026, 17:22', created: '19 Jun 2024', status: 'Suspended' },
  { username: 'n.eze', name: 'N. Eze', role: 'Cashier', showroom: 'Showroom Abuja', phone: '+234 805 990 1123', lastSignIn: '24 Aug 2026, 08:05', created: '11 Jan 2025', status: 'Active' },
  { username: 'a.bello', name: 'A. Bello', role: 'Stock Keeper', showroom: 'Factory A', phone: '+234 802 447 3301', lastSignIn: '24 Aug 2026, 06:58', created: '15 Mar 2020', status: 'Active' },
  { username: 'k.umeh', name: 'K. Umeh', role: 'Quality Control', showroom: 'Factory A', phone: '+234 807 220 5518', lastSignIn: '23 Aug 2026, 15:44', created: '08 Jul 2021', status: 'Active' },
]
