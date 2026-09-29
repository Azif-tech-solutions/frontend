// Account module placeholder data (PRD §5.3).
// Figures deliberately tie together: petty cash payments below appear as
// outflows in the showroom cash statement, and lodgements appear as bank credits.

export const banks = [
  { value: 'bk-zenith', label: 'Zenith Bank', account: '1014482201', type: 'Current', branch: 'Ikeja GRA', signatory: 'M. Okonkwo' },
  { value: 'bk-gtb', label: 'Guaranty Trust Bank', account: '0221904471', type: 'Current', branch: 'Allen Avenue', signatory: 'M. Okonkwo' },
  { value: 'bk-access', label: 'Access Bank', account: '0771120384', type: 'Collections', branch: 'Sango Otta', signatory: 'T. Adeyemi' },
  { value: 'bk-uba', label: 'United Bank for Africa', account: '2088341902', type: 'Payroll', branch: 'Marina', signatory: 'M. Okonkwo' },
]

export const bankRegister = banks.map((b) => ({
  bank: b.label, accountNo: b.account, accountType: b.type, branch: b.branch,
  signatory: b.signatory, status: b.value === 'bk-uba' ? 'Dormant' : 'Active',
  opened: b.value === 'bk-zenith' ? '12 Mar 2019' : b.value === 'bk-gtb' ? '04 Sep 2020' : b.value === 'bk-access' ? '21 Jan 2022' : '08 Jun 2021',
}))

/** §5.3.2 — statement for the selected bank account. */
export const bankOpeningBalance = 4850000
export const bankTransactions = [
  { date: '04 Aug 2026', ref: 'LDG-3301', description: 'Cash lodgement — Showroom Ikeja', type: 'Credit', amount: 1200000 },
  { date: '05 Aug 2026', ref: 'PCF-0071', description: 'Transfer to petty cash account', type: 'Debit', amount: 500000 },
  { date: '11 Aug 2026', ref: 'LDG-3318', description: 'Cash lodgement — Showroom Ikeja', type: 'Credit', amount: 900000 },
  { date: '12 Aug 2026', ref: 'PAY-2204', description: 'Ardova Commodities Ltd — raw material purchase', type: 'Debit', amount: 2910000 },
  { date: '15 Aug 2026', ref: 'LDG-3330', description: 'Cash lodgement — Showroom Ikeja', type: 'Credit', amount: 1400000 },
  { date: '18 Aug 2026', ref: 'POS-8841', description: 'POS settlement — week 33', type: 'Credit', amount: 3240000 },
  { date: '19 Aug 2026', ref: 'PCF-0078', description: 'Transfer to petty cash account', type: 'Debit', amount: 350000 },
  { date: '21 Aug 2026', ref: 'PAY-2219', description: 'Lagos Packaging Co. — preforms and corks', type: 'Debit', amount: 1420000 },
  { date: '22 Aug 2026', ref: 'LDG-3347', description: 'Cash lodgement — Showroom Ikeja', type: 'Credit', amount: 1800000 },
  { date: '23 Aug 2026', ref: 'FTF-4412', description: 'Fund transfer received — Kano Central Distributors', type: 'Credit', amount: 2920000 },
]

/** §5.3.7 — expense categories used across payments and petty cash. */
export const expenseCategories = [
  { code: 'EX-01', name: 'Electrical Bills', description: 'Electricity supply and metering charges', account: 'Utilities', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-02', name: 'Transportation', description: 'Staff and goods movement within the city', account: 'Logistics', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-03', name: 'Loading Charges', description: 'Labour for loading goods at dispatch', account: 'Logistics', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-04', name: 'Offloading Charges', description: 'Labour for offloading goods on arrival', account: 'Logistics', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-05', name: 'Maintenance Expenses', description: 'Plant, vehicle and premises upkeep', account: 'Maintenance', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-06', name: 'Fuel Expenses', description: 'Generator diesel and vehicle fuel', account: 'Utilities', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-07', name: 'Communication Expenses', description: 'Airtime, data and internet subscriptions', account: 'Administrative', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-08', name: 'Office Supplies', description: 'Stationery and consumables', account: 'Administrative', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-09', name: 'Other Operational Costs', description: 'Uncategorised operational expenditure', account: 'Administrative', pettyCashAllowed: 'Yes', status: 'Active' },
  { code: 'EX-10', name: 'Bank Charges', description: 'Transfer fees and account maintenance', account: 'Finance', pettyCashAllowed: 'No', status: 'Active' },
  { code: 'EX-11', name: 'Legal & Professional', description: 'Retainers, filings and consultancy', account: 'Administrative', pettyCashAllowed: 'No', status: 'Inactive' },
]

/** §5.3.4 / §5.3.9 / §5.3.12 — how petty cash was funded and spent. */
export const pettyCashOpening = 180000
export const pettyCashFunding = [
  { date: '05 Aug 2026', ref: 'PCF-0071', description: 'Funded from Zenith Bank current account', source: 'Zenith Bank', amount: 500000, fundedBy: 'M. Okonkwo' },
  { date: '19 Aug 2026', ref: 'PCF-0078', description: 'Replenishment — mid-month top-up', source: 'Zenith Bank', amount: 350000, fundedBy: 'M. Okonkwo' },
]

export const pettyCashPayments = [
  { date: '06 Aug 2026', ref: 'PCP-1140', description: 'Staff movement — Ikeja to Apapa', category: 'Transportation', amount: 42000, paidTo: 'O. Ajayi', approvedBy: 'R. Danladi' },
  { date: '08 Aug 2026', ref: 'PCP-1143', description: 'Loading labour — waybill WB-8844', category: 'Loading Charges', amount: 28500, paidTo: 'Casual labour team', approvedBy: 'R. Danladi' },
  { date: '11 Aug 2026', ref: 'PCP-1148', description: 'Generator diesel — 200 litres', category: 'Fuel Expenses', amount: 65000, paidTo: 'Rainoil Station', approvedBy: 'R. Danladi' },
  { date: '13 Aug 2026', ref: 'PCP-1152', description: 'Ikeja Electric — August prepaid units', category: 'Electrical Bills', amount: 118000, paidTo: 'Ikeja Electric', approvedBy: 'M. Okonkwo' },
  { date: '16 Aug 2026', ref: 'PCP-1157', description: 'Offloading labour — outsource delivery', category: 'Offloading Charges', amount: 31000, paidTo: 'Casual labour team', approvedBy: 'R. Danladi' },
  { date: '20 Aug 2026', ref: 'PCP-1163', description: 'Airtime and data — sales team', category: 'Communication Expenses', amount: 24500, paidTo: 'MTN Nigeria', approvedBy: 'R. Danladi' },
  { date: '22 Aug 2026', ref: 'PCP-1169', description: 'Delivery van servicing', category: 'Maintenance Expenses', amount: 87000, paidTo: 'Autoworks Ikeja', approvedBy: 'M. Okonkwo' },
  { date: '23 Aug 2026', ref: 'PCP-1172', description: 'Stationery restock — showroom office', category: 'Office Supplies', amount: 19800, paidTo: 'Bookshop House', approvedBy: 'R. Danladi' },
]

/** §5.3.1 — physical cash movement at the selected showroom. */
export const showroomCashOpening = 240000
export const showroomCashLedger = [
  { date: '03 Aug 2026', remark: 'Counter cash sales — 03 Aug', inflow: 1420000, outflow: 0 },
  { date: '04 Aug 2026', remark: 'Cash lodgement to Zenith Bank — LDG-3301', inflow: 0, outflow: 1200000 },
  { date: '06 Aug 2026', remark: 'Petty cash payment PCP-1140 — transportation', inflow: 0, outflow: 42000 },
  { date: '08 Aug 2026', remark: 'Counter cash sales — 08 Aug', inflow: 980000, outflow: 0 },
  { date: '08 Aug 2026', remark: 'Petty cash payment PCP-1143 — loading charges', inflow: 0, outflow: 28500 },
  { date: '11 Aug 2026', remark: 'Cash lodgement to Zenith Bank — LDG-3318', inflow: 0, outflow: 900000 },
  { date: '11 Aug 2026', remark: 'Petty cash payment PCP-1148 — fuel', inflow: 0, outflow: 65000 },
  { date: '13 Aug 2026', remark: 'Counter cash sales — 13 Aug', inflow: 1650000, outflow: 0 },
  { date: '13 Aug 2026', remark: 'Petty cash payment PCP-1152 — electrical bills', inflow: 0, outflow: 118000 },
  { date: '15 Aug 2026', remark: 'Cash lodgement to Zenith Bank — LDG-3330', inflow: 0, outflow: 1400000 },
  { date: '16 Aug 2026', remark: 'Petty cash payment PCP-1157 — offloading charges', inflow: 0, outflow: 31000 },
  { date: '20 Aug 2026', remark: 'Counter cash sales — 20 Aug', inflow: 2100000, outflow: 0 },
  { date: '20 Aug 2026', remark: 'Petty cash payment PCP-1163 — communication', inflow: 0, outflow: 24500 },
  { date: '22 Aug 2026', remark: 'Cash lodgement to Zenith Bank — LDG-3347', inflow: 0, outflow: 1800000 },
  { date: '22 Aug 2026', remark: 'Petty cash payment PCP-1169 — maintenance', inflow: 0, outflow: 87000 },
  { date: '23 Aug 2026', remark: 'Counter cash sales — 23 Aug', inflow: 1240000, outflow: 0 },
  { date: '23 Aug 2026', remark: 'Petty cash payment PCP-1172 — office supplies', inflow: 0, outflow: 19800 },
]

/** §5.3.6 — cashier reconciliation across payment channels. */
export const cashiers = [
  { value: 'cs-1', label: 'F. Adeniyi' },
  { value: 'cs-2', label: 'B. Okafor' },
  { value: 'cs-3', label: 'N. Eze' },
]

export const tenderablePayable = [
  { date: '20 Aug 2026', cashier: 'F. Adeniyi', ftf: 480000, cash: 920000, pos: 640000, wallet: 210000, refund: 18000 },
  { date: '20 Aug 2026', cashier: 'B. Okafor', ftf: 310000, cash: 740000, pos: 520000, wallet: 0, refund: 0 },
  { date: '20 Aug 2026', cashier: 'N. Eze', ftf: 0, cash: 440000, pos: 380000, wallet: 145000, refund: 9500 },
  { date: '21 Aug 2026', cashier: 'F. Adeniyi', ftf: 620000, cash: 1080000, pos: 710000, wallet: 0, refund: 0 },
  { date: '21 Aug 2026', cashier: 'B. Okafor', ftf: 0, cash: 560000, pos: 430000, wallet: 380000, refund: 22000 },
  { date: '22 Aug 2026', cashier: 'F. Adeniyi', ftf: 890000, cash: 1240000, pos: 960000, wallet: 415000, refund: 0 },
  { date: '22 Aug 2026', cashier: 'N. Eze', ftf: 240000, cash: 680000, pos: 350000, wallet: 0, refund: 14500 },
  { date: '23 Aug 2026', cashier: 'F. Adeniyi', ftf: 520000, cash: 980000, pos: 830000, wallet: 190000, refund: 0 },
  { date: '23 Aug 2026', cashier: 'B. Okafor', ftf: 180000, cash: 620000, pos: 470000, wallet: 0, refund: 7200 },
]

export const tenderableReceipts = [
  { date: '23 Aug 2026', receipt: 'RCP-88410', cashier: 'F. Adeniyi', customer: 'Walk-in — counter', channel: 'Cash', amount: 148000, status: 'Issued' },
  { date: '23 Aug 2026', receipt: 'RCP-88411', cashier: 'F. Adeniyi', customer: 'Bendel Stores', channel: 'Wallet', amount: 190000, status: 'Issued' },
  { date: '23 Aug 2026', receipt: 'RCP-88412', cashier: 'B. Okafor', customer: 'Walk-in — counter', channel: 'POS', amount: 96500, status: 'Issued' },
  { date: '23 Aug 2026', receipt: 'RCP-88413', cashier: 'B. Okafor', customer: 'Walk-in — counter', channel: 'Cash', amount: 7200, status: 'Voided' },
  { date: '22 Aug 2026', receipt: 'RCP-88398', cashier: 'F. Adeniyi', customer: 'Kano Central Distributors', channel: 'Fund transfer', amount: 890000, status: 'Issued' },
  { date: '22 Aug 2026', receipt: 'RCP-88399', cashier: 'N. Eze', customer: 'Walk-in — counter', channel: 'POS', amount: 62000, status: 'Issued' },
]

export const walletFunding = [
  { date: '22 Aug 2026', ref: 'WF-2210', dealer: 'Kano Central Distributors', method: 'Fund transfer', amount: 2920000, bank: 'Zenith Bank', confirmedBy: 'R. Danladi', status: 'Confirmed' },
  { date: '19 Aug 2026', ref: 'WF-2204', dealer: 'Bendel Stores', method: 'Cash deposit', amount: 640000, bank: 'Guaranty Trust Bank', confirmedBy: 'R. Danladi', status: 'Confirmed' },
  { date: '15 Aug 2026', ref: 'WF-2198', dealer: 'Bendel Stores', method: 'Return credit', amount: 144000, bank: '—', confirmedBy: 'System', status: 'Confirmed' },
  { date: '23 Aug 2026', ref: 'WF-2214', dealer: 'Owerri Beverage Depot', method: 'POS', amount: 380000, bank: 'Access Bank', confirmedBy: '—', status: 'Awaiting confirmation' },
]

/** §5.3.10 — POS and fund transfer payments awaiting verification. */
export const posTransferQueue = [
  { ref: 'TX-77412', date: '23 Aug 2026', channel: 'POS', cashier: 'B. Okafor', customer: 'Walk-in — counter', amount: 96500, terminal: 'POS-IKJ-02', bank: 'Access Bank', status: 'Pending' },
  { ref: 'TX-77410', date: '23 Aug 2026', channel: 'Fund transfer', cashier: 'F. Adeniyi', customer: 'Kano Central Distributors', amount: 2920000, terminal: '—', bank: 'Zenith Bank', status: 'Pending' },
  { ref: 'TX-77405', date: '23 Aug 2026', channel: 'POS', cashier: 'N. Eze', customer: 'Walk-in — counter', amount: 62000, terminal: 'POS-IKJ-01', bank: 'Access Bank', status: 'Pending' },
  { ref: 'TX-77398', date: '22 Aug 2026', channel: 'Fund transfer', cashier: 'F. Adeniyi', customer: 'Bendel Stores', amount: 640000, terminal: '—', bank: 'Guaranty Trust Bank', status: 'Approved', reviewedBy: 'R. Danladi', reviewedOn: '22 Aug 2026' },
  { ref: 'TX-77391', date: '22 Aug 2026', channel: 'POS', cashier: 'B. Okafor', customer: 'Walk-in — counter', amount: 41800, terminal: 'POS-IKJ-02', bank: 'Access Bank', status: 'Declined', reviewedBy: 'R. Danladi', reviewedOn: '22 Aug 2026', note: 'No matching settlement received' },
]

/** §5.3.11 — funds disbursed to branches, confirmed with a possible shortfall. */
export const branchFunds = [
  { ref: 'BF-0912', date: '23 Aug 2026', branch: 'Showroom Abuja', purpose: 'Monthly operating float', sent: 1500000, channel: 'Bank transfer', sentBy: 'M. Okonkwo', status: 'Awaiting' },
  { ref: 'BF-0910', date: '22 Aug 2026', branch: 'Showroom Lekki', purpose: 'Generator repair and diesel', sent: 420000, channel: 'Bank transfer', sentBy: 'M. Okonkwo', status: 'Awaiting' },
  { ref: 'BF-0906', date: '20 Aug 2026', branch: 'Showroom Ikeja', purpose: 'Operating float — week 34', sent: 900000, received: 900000, rejected: 0, channel: 'Bank transfer', sentBy: 'M. Okonkwo', status: 'Confirmed', confirmedBy: 'R. Danladi' },
  { ref: 'BF-0901', date: '16 Aug 2026', branch: 'Showroom Abuja', purpose: 'Showroom running costs', sent: 650000, received: 600000, rejected: 50000, channel: 'Cash', sentBy: 'T. Adeyemi', status: 'Partially confirmed', confirmedBy: 'B. Okafor', note: 'Shortfall of ₦50,000 raised with dispatching officer' },
]

/** §5.3.14 — petty cash allocations sent to branches, pending accept or reject. */
export const pendingPettyCash = [
  { ref: 'PPC-0441', date: '23 Aug 2026', branch: 'Showroom Abuja', amount: 250000, purpose: 'Branch petty cash — September float', sentBy: 'M. Okonkwo', status: 'Pending' },
  { ref: 'PPC-0439', date: '22 Aug 2026', branch: 'Showroom Lekki', amount: 180000, purpose: 'Branch petty cash — replenishment', sentBy: 'M. Okonkwo', status: 'Pending' },
  { ref: 'PPC-0435', date: '19 Aug 2026', branch: 'Showroom Ikeja', amount: 350000, purpose: 'Branch petty cash — mid-month top-up', sentBy: 'M. Okonkwo', status: 'Accepted', respondedBy: 'R. Danladi', respondedOn: '19 Aug 2026' },
  { ref: 'PPC-0430', date: '14 Aug 2026', branch: 'Showroom Abuja', amount: 120000, purpose: 'Branch petty cash — top-up', sentBy: 'T. Adeyemi', status: 'Rejected', respondedBy: 'B. Okafor', respondedOn: '15 Aug 2026', note: 'Amount not received in branch account' },
]

/** §5.3.5 — payments and running costs already recorded. */
export const runningCosts = [
  { date: '23 Aug 2026', ref: 'RC-2288', description: 'Stationery restock — showroom office', category: 'Office Supplies', amount: 19800, method: 'Petty cash', payee: 'Bookshop House', status: 'Approved', approvedBy: 'R. Danladi' },
  { date: '22 Aug 2026', ref: 'RC-2285', description: 'Delivery van servicing', category: 'Maintenance Expenses', amount: 87000, method: 'Petty cash', payee: 'Autoworks Ikeja', status: 'Approved', approvedBy: 'M. Okonkwo' },
  { date: '23 Aug 2026', ref: 'RC-2290', description: 'Warehouse roof repair — deposit', category: 'Maintenance Expenses', amount: 340000, method: 'Bank transfer', payee: 'Buildwell Ltd', status: 'Pending approval', approvedBy: '—' },
  { date: '20 Aug 2026', ref: 'RC-2281', description: 'Airtime and data — sales team', category: 'Communication Expenses', amount: 24500, method: 'Petty cash', payee: 'MTN Nigeria', status: 'Approved', approvedBy: 'R. Danladi' },
  { date: '23 Aug 2026', ref: 'RC-2291', description: 'Legal retainer — August', category: 'Legal & Professional', amount: 275000, method: 'Bank transfer', payee: 'Okoro & Co.', status: 'Rejected', approvedBy: 'M. Okonkwo', note: 'Category inactive — reclassify before resubmitting' },
]

export const paymentMethods = [
  { value: 'petty', label: 'Petty cash' },
  { value: 'transfer', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
]
