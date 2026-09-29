// ZifIQ information architecture — derived from PRD v3.0 §5.1–5.11.
// Three levels: module (collapsible section) → item → child.
// `view` is the screen key resolved by the screen registry in screens.js.
// Icon names are Lucide glyph names.
//nav.js
export const navModules = [
  // Overview sits on its own at the top of the sidebar — no wrapper group.
  {
    id: 'home',
    label: 'Overview',
    icon: 'layout-grid',
    standalone: true,
    items: [
      { id: 'overview', label: 'Overview', icon: 'layout-grid', view: 'overview', description: 'Company snapshot and quick actions' },
    ],
  },

  // ── 5.1 Factory ──────────────────────────────────────────────────────────
  {
    id: 'factory',
    label: 'Factory',
    icon: 'factory',
    section: '5.1',
    items: [
      // Setup gate — these have to exist before anything below them can be used.
      {
        id: 'f.setup', label: 'Setup', icon: 'sliders-horizontal',
        children: [
          { id: 'f.factories', label: 'Factories', view: 'factories', description: 'Create the production sites every factory screen records against' },
          { id: 'f.suppliers', label: 'Suppliers', view: 'suppliers', description: 'Register the companies raw materials are bought from' },
          { id: 'f.manufacturers', label: 'Manufacturers', view: 'manufacturers', description: 'Register the companies that produce the materials you receive' },
          { id: 'f.units', label: 'Units of Measure', view: 'units', description: 'Define how materials and products are measured' },
          { id: 'f.categories', label: 'Categories', view: 'categories', description: 'Group products and materials by the type and brand they belong to' },
        ],
      },
      { id: 'f.register', label: 'Stock Register', icon: 'package', view: 'f.register', ref: '5.1.3', description: 'Register finished products and raw materials' },
      {
        id: 'f.refill', label: 'Stock Refill', icon: 'package-plus', ref: '5.1.1–5.1.2',
        children: [
          { id: 'f.refill.finished', label: 'Finished Product', view: 'f.refill.finished', ref: '5.1.1', description: 'Record incoming finished product into factory stock' },
          { id: 'f.refill.raw', label: 'Raw Material', view: 'f.refill.raw', ref: '5.1.2', description: 'Record incoming raw material into factory stock' },
          { id: 'f.refill.drafts', label: 'Saved Drafts', view: 'f.refill.drafts', description: 'Every unposted refill and delivery, in full' },
        ],
      },
      {
        id: 'f.cards', label: 'All Product Stock/Bin Card', icon: 'layers', ref: '5.1.4–5.1.6',
        children: [
          { id: 'f.cards.stockgp', label: 'Stock Card (GP)', view: 'f.cards.stockgp', ref: '5.1.4', description: 'Grouped stock card across all products' },
          { id: 'f.cards.bingp', label: 'Bin Card (GP)', view: 'f.cards.bingp', ref: '5.1.5', description: 'Grouped bin card across all products' },
          { id: 'f.cards.single', label: 'Stock/Bin Card', view: 'f.cards.single', ref: '5.1.6', description: 'Single-product stock and bin card' },
        ],
      },
      { id: 'f.adjust', label: 'Quantity Adjustment', icon: 'sliders-horizontal', view: 'f.adjust', ref: '5.1.7', description: 'Correct factory stock quantities with a reason' },
      { id: 'f.compstock', label: 'Comprehensive Stock Report', icon: 'clipboard-list', view: 'f.compstock', ref: '5.1.8', description: 'Full factory stock position and value' },
      { id: 'f.movement', label: 'Stock Movement Report', icon: 'arrow-left-right', view: 'f.movement', ref: '5.1.9', description: 'All in/out movements over a period' },
      { id: 'f.transfer', label: 'Stock Transfer', icon: 'truck', view: 'f.transfer', ref: '5.1.10', description: 'Transfer stock to another factory or showroom' },
      {
        id: 'f.costcalc', label: 'Production Cost Calculator', icon: 'calculator', ref: '5.1.11–5.1.12',
        children: [
          { id: 'f.costcalc.a', label: 'Factory A', view: 'f.costcalc', params: { factoryKey: 'fa' }, ref: '5.1.11', description: 'Landing-cost calculation for Factory A runs' },
          { id: 'f.costcalc.b', label: 'Factory B', view: 'f.costcalc', params: { factoryKey: 'fb' }, ref: '5.1.12', description: 'Landing-cost calculation for Factory B runs' },
        ],
      },
      { id: 'f.recipecost', label: 'Total Cost for Selected Recipes', icon: 'receipt-text', view: 'f.recipecost', ref: '5.1.27', description: 'Aggregate cost across chosen recipes' },
      {
        id: 'f.recipes', label: 'In-House Recipes', icon: 'book-open', ref: '5.1.13–5.1.15',
        children: [
          { id: 'f.recipes.register', label: 'Register', view: 'f.recipes.register', ref: '5.1.13', description: 'Define a recipe and its material composition' },
          { id: 'f.recipes.production', label: 'Production', view: 'f.recipes.production', ref: '5.1.14', description: 'Run production against a registered recipe' },
          { id: 'f.recipes.reports', label: 'Reports', view: 'f.recipes.reports', ref: '5.1.15', description: 'Recipe production history and yields' },
        ],
      },
      {
        id: 'f.special', label: 'Special Production', icon: 'sparkles', ref: '5.1.16–5.1.17',
        children: [
          { id: 'f.special.production', label: 'Production', view: 'f.special.production', ref: '5.1.16', description: 'One-off production outside registered recipes' },
          { id: 'f.special.reports', label: 'Reports', view: 'f.special.reports', ref: '5.1.17', description: 'Special production history' },
        ],
      },
      { id: 'f.cashflow', label: 'Cash Inflow/Outflow', icon: 'banknote-arrow-up', view: 'f.cashflow', ref: '5.1.18', description: 'Factory-level cash movement statement' },
      { id: 'f.fundsawaiting', label: 'Funds Awaiting Reception', icon: 'hourglass', view: 'f.fundsawaiting', ref: '5.1.19', description: 'Inbound funds not yet confirmed received' },
      { id: 'f.receive', label: 'Material/Recipe Receive Report', icon: 'inbox', view: 'f.receive', ref: '5.1.20', description: 'What was received, from whom, and when' },
      { id: 'f.reorder', label: 'Re-Order Report', icon: 'refresh-cw', view: 'f.reorder', ref: '5.1.21', description: 'Items at or below their reorder threshold' },
      { id: 'f.sci', label: 'SCI Factory', icon: 'trending-up', view: 'f.sci', ref: '5.1.22', description: 'Statement of comprehensive income, factory scope' },
      { id: 'f.vat', label: 'Factory VAT Report', icon: 'percent', view: 'f.vat', ref: '5.1.23', description: 'VAT collected and payable by the factory' },
      {
        id: 'f.trade', label: 'Factory-To-Factory Tradeables', icon: 'handshake', ref: '5.1.24–5.1.26',
        children: [
          { id: 'f.trade.offer', label: 'Offer Trade', view: 'f.trade.offer', ref: '5.1.24', description: 'Offer stock to another factory' },
          { id: 'f.trade.pending', label: 'Pending Trade', view: 'f.trade.pending', ref: '5.1.25', description: 'Trades awaiting acceptance or rejection' },
          { id: 'f.trade.report', label: 'Trade Report', view: 'f.trade.report', ref: '5.1.26', description: 'Completed inter-factory trade history' },
        ],
      },
    ],
  },

  // ── 5.2 Showroom ─────────────────────────────────────────────────────────
  {
    id: 'showroom',
    label: 'Showroom',
    icon: 'store',
    section: '5.2',
    items: [
      { id: 's.receive', label: 'Receive Product', icon: 'package-check', view: 's.receive', ref: '5.2.1', description: 'Confirm receipt of stock transferred in' },
      { id: 's.direct', label: 'Stock Entry (Direct)', icon: 'square-plus', view: 's.direct', ref: '5.2.2', description: 'Add stock directly at the showroom' },
      { id: 's.adjust', label: 'Quantity Adjustment', icon: 'sliders-horizontal', view: 's.adjust', ref: '5.2.3', description: 'Correct showroom stock quantities' },
      {
        id: 's.cards', label: 'Stock/Bin Card', icon: 'layers', ref: '5.2.4',
        children: [
          { id: 's.cards.group', label: 'Group', view: 's.cards', params: { grouped: true }, ref: '5.2.4', description: 'Grouped stock and bin card' },
          { id: 's.cards.nongroup', label: 'Non-Group', view: 's.cards', params: { grouped: false }, ref: '5.2.4', description: 'Ungrouped stock and bin card' },
        ],
      },
      { id: 's.outsource', label: 'Outsource Stock', icon: 'external-link', view: 's.outsource', ref: '5.2.5', description: 'Stock sourced outside company production' },
      { id: 's.compstock', label: 'Comprehensive Stock Report', icon: 'clipboard-list', view: 's.compstock', ref: '5.2.6', description: 'Full showroom stock position and value' },
      { id: 's.transfer', label: 'Showroom-To-Showroom Transfer', icon: 'arrow-left-right', view: 's.transfer', ref: '5.2.7', description: 'Move stock between showrooms' },
      {
        id: 's.returns', label: 'Returns', icon: 'undo-2', ref: '5.2.8',
        children: [
          { id: 's.returns.nondealer', label: 'Non-Dealer', view: 's.returns', params: { dealer: false }, ref: '5.2.8', description: 'Process a walk-in customer return' },
          { id: 's.returns.dealer', label: 'Dealer', view: 's.returns', params: { dealer: true }, ref: '5.2.8', description: 'Process a dealer/distributor return' },
        ],
      },
      { id: 's.transferreport', label: 'General Transfer Report', icon: 'file-text', view: 's.transferreport', ref: '5.2.9', description: 'All transfers in and out of the showroom' },
      { id: 's.vat', label: 'Showroom VAT Report', icon: 'percent', view: 's.vat', ref: '5.2.10', description: 'VAT collected and payable by the showroom' },
    ],
  },

  // ── 5.3 Account ──────────────────────────────────────────────────────────
  {
    id: 'account',
    label: 'Account',
    icon: 'wallet',
    section: '5.3',
    items: [
      { id: 'a.cashflow', label: 'Cash Inflow/Outflow', icon: 'banknote-arrow-up', view: 'a.cashflow', ref: '5.3.1', description: 'Company-wide cash movement statement' },
      {
        id: 'a.bankpetty', label: 'Bank/Petty Cash', icon: 'landmark', ref: '5.3.2–5.3.4',
        children: [
          { id: 'a.bankpetty.bank', label: 'Bank Statement', view: 'a.bankpetty.bank', ref: '5.3.2', description: 'Transactions per registered bank account' },
          { id: 'a.bankpetty.pchist', label: 'Petty Cash Payment Hist.', view: 'a.bankpetty.pchist', ref: '5.3.3', description: 'History of petty cash payments made' },
          { id: 'a.bankpetty.pcstmt', label: 'Petty Cash Statement', view: 'a.bankpetty.pcstmt', ref: '5.3.4', description: 'Running petty cash balance and movements' },
        ],
      },
      { id: 'a.running', label: 'Payment/Running Cost', icon: 'credit-card', view: 'a.running', ref: '5.3.5', description: 'Record and review operating cost payments' },
      { id: 'a.tenderable', label: 'Tenderable', icon: 'coins', view: 'a.tenderable', ref: '5.3.6', description: 'Cash on hand available to be tendered' },
      { id: 'a.expguide', label: 'Expenses/Payment List Guide', icon: 'list-checks', view: 'a.expguide', ref: '5.3.7', description: 'Maintain the expense category list' },
      { id: 'a.bankregister', label: 'Bank Register', icon: 'building-2', view: 'a.bankregister', ref: '5.3.8', description: 'Register company bank accounts' },
      { id: 'a.creditpetty', label: 'Credit Petty Cash', icon: 'plus-circle', view: 'a.creditpetty', ref: '5.3.9', description: 'Top up a petty cash float' },
      { id: 'a.posconfirm', label: 'POS/Fund Transfer Confirmation', icon: 'check-check', view: 'a.posconfirm', ref: '5.3.10', description: 'Confirm POS and transfer payments received' },
      { id: 'a.fundsawaiting', label: 'Funds Awaiting', icon: 'hourglass', view: 'a.fundsawaiting', ref: '5.3.11', description: 'Funds pending confirmation' },
      {
        id: 'a.petty', label: 'Petty Cash', icon: 'piggy-bank', ref: '5.3.12–5.3.14',
        children: [
          { id: 'a.petty.fund', label: 'Fund Petty Cash', view: 'a.petty.fund', ref: '5.3.12', description: 'Allocate funds into a petty cash account' },
          { id: 'a.petty.payment', label: 'Payment / Wallet Withdrawal', view: 'a.petty.payment', ref: '5.3.13', description: 'Pay out petty cash or process a wallet withdrawal' },
          { id: 'a.petty.pending', label: 'Accept or Reject Pending', view: 'a.petty.pending', ref: '5.3.14', description: 'Approve or decline pending petty cash requests' },
        ],
      },
    ],
  },

  // ── 5.4 Cashier ──────────────────────────────────────────────────────────
  {
    id: 'cashier',
    label: 'Cashier',
    icon: 'scan-line',
    section: '5.4',
    items: [
      { id: 'c.sales', label: 'Sales Report', icon: 'chart-column', view: 'c.sales', ref: '5.4.1', description: 'Sales by period, channel, and cashier' },
      { id: 'c.proforma', label: 'Pro-Forma Invoice', icon: 'file-text', view: 'c.proforma', ref: '5.4.2', description: 'Issue a quotation before sale' },
      { id: 'c.waybill', label: 'Generate Waybill', icon: 'truck', view: 'c.waybill', ref: '5.4.3', description: 'Produce a waybill for goods leaving' },
    ],
  },

  // ── 5.5 Process Guide ────────────────────────────────────────────────────
  {
    id: 'process',
    label: 'Process Guide',
    icon: 'settings-2',
    section: '5.5',
    items: [
      { id: 'p.fx', label: 'Exchange Rate', icon: 'arrow-right-left', view: 'p.fx', ref: '5.5.1', description: 'Maintain currency conversion rates' },
      { id: 'p.password', label: 'Change My Password', icon: 'key-round', view: 'p.password', ref: '5.5.2', description: 'Update your own account password' },
      { id: 'p.showroomreg', label: 'Showroom Register', icon: 'store', view: 'p.showroomreg', ref: '5.5.3', description: 'Register and configure showrooms' },
      { id: 'p.commsguide', label: 'Comms. Guide', icon: 'book-open', view: 'p.commsguide', ref: '5.5.4', description: 'Define commission rules and rates' },
      { id: 'p.commsalloc', label: 'Comms Allocator', icon: 'split', view: 'p.commsalloc', ref: '5.5.5', description: 'Assign commission to dealers and reps' },
      { id: 'p.errorhandler', label: 'Error Handler', icon: 'triangle-alert', view: 'p.errorhandler', ref: '5.5.6', description: 'Review and resolve system-flagged errors' },
      { id: 'p.recyclebin', label: 'Recycle Bin', icon: 'trash-2', view: 'p.recyclebin', ref: '5.5.7', description: 'Restore or permanently remove deleted records' },
      { id: 'p.correspondent', label: 'Correspondent', icon: 'user-round-cog', view: 'p.correspondent', ref: '5.5.8', description: 'Manage sales representatives' },
      { id: 'p.vatcontrol', label: 'VAT Control', icon: 'percent', view: 'p.vatcontrol', ref: '5.5.9', description: 'Configure VAT rates and applicability' },
    ],
  },

  // ── 5.6 History ──────────────────────────────────────────────────────────
  {
    id: 'history',
    label: 'History',
    icon: 'history',
    section: '5.6',
    items: [
      { id: 'h.waybill', label: 'Waybill History', icon: 'truck', view: 'h.waybill', ref: '5.6.1', description: 'Every waybill generated, searchable' },
      { id: 'h.expenses', label: 'Expenses/Payment Reports', icon: 'receipt', view: 'h.expenses', ref: '5.6.2', description: 'Historical expense and payment records' },
      { id: 'h.movement', label: 'Stock Movement Hist.', icon: 'arrow-left-right', view: 'h.movement', ref: '5.6.3', description: 'Long-range stock movement audit trail' },
      { id: 'h.violations', label: 'Violations/Fraud History', icon: 'shield-alert', view: 'h.violations', ref: '5.6.4', description: 'Flagged violations and fraud investigations' },
      { id: 'h.withdrawal', label: 'Wallet Withdrawal History', icon: 'banknote-arrow-down', view: 'h.withdrawal', ref: '5.6.5', description: 'All dealer and customer wallet withdrawals' },
    ],
  },

  // ── 5.7 Others ───────────────────────────────────────────────────────────
  {
    id: 'others',
    label: 'Others',
    icon: 'grid-2x2',
    section: '5.7',
    items: [
      { id: 'o.customerhistory', label: 'Customer History', icon: 'user-round-search', view: 'o.customerhistory', ref: '5.7.1', description: 'Full transaction history for a customer' },
      {
        id: 'o.custcomp', label: 'Customers/Distributors', icon: 'users-round', ref: '5.7.2–5.7.4',
        children: [
          { id: 'o.custcomp.distributors', label: 'Distributors', view: 'o.custcomp', params: { kind: 'distributors' }, ref: '5.7.2', description: 'Comprehensive distributor listing' },
          { id: 'o.custcomp.nocredit', label: 'No Credit Customers', view: 'o.custcomp', params: { kind: 'nocredit' }, ref: '5.7.3', description: 'Walk-in customers with no credit line' },
          { id: 'o.custcomp.special', label: 'Special Customer', view: 'o.custcomp', params: { kind: 'special' }, ref: '5.7.4', description: 'Project customers holding a deposit' },
        ],
      },
      {
        id: 'o.adjustments', label: 'Adjustments', icon: 'sliders-horizontal', ref: '5.7.5–5.7.6',
        children: [
          { id: 'o.adjustments.showroom', label: 'Showroom Report', view: 'o.adjustments', params: { scoped: true }, ref: '5.7.5', description: 'Adjustments made at showroom level' },
          { id: 'o.adjustments.general', label: 'General Report', view: 'o.adjustments', params: { scoped: false }, ref: '5.7.6', description: 'All adjustments across the business' },
        ],
      },
      { id: 'o.sci', label: 'SCI Report', icon: 'trending-up', view: 'o.sci', ref: '5.7.7', description: 'Company-wide statement of comprehensive income' },
      { id: 'o.receipts', label: 'Transaction Receipts', icon: 'receipt-text', view: 'o.receipts', ref: '5.7.8', description: 'Reprint and search issued receipts' },
      { id: 'o.cashtransfer', label: 'Cash Transfer History', icon: 'arrow-left-right', view: 'o.cashtransfer', ref: '5.7.9', description: 'Cash moved between locations and accounts' },
      { id: 'o.pricelist', label: 'Price List', icon: 'tag', view: 'o.pricelist', ref: '5.7.10', description: 'Maintain selling prices per product' },
      { id: 'o.discount', label: 'Instant Discount', icon: 'badge-percent', view: 'o.discount', ref: '5.7.11', description: 'Apply and govern point-of-sale discounts' },
      { id: 'o.commsreport', label: 'Comms. Report', icon: 'chart-column', view: 'o.commsreport', ref: '5.7.12', description: 'Commission earned and paid' },
      { id: 'o.correspondents', label: 'Correspondents Report', icon: 'user-round-check', view: 'o.correspondents', ref: '5.7.13', description: 'Sales rep performance and activity' },
      { id: 'o.dealersupdate', label: 'Dealers Update', icon: 'user-round-cog', view: 'o.dealersupdate', ref: '5.7.14', description: 'Amend dealer records and terms' },
      { id: 'o.returns', label: 'Return Reports', icon: 'undo-2', view: 'o.returns', ref: '5.7.15', description: 'All returns across showrooms' },
      { id: 'o.outsource', label: 'Out-Source Stock Report', icon: 'external-link', view: 'o.outsource', ref: '5.7.16', description: 'Position and movement of outsourced stock' },
      { id: 'o.contacts', label: 'Customer Contacts', icon: 'contact-round', view: 'o.contacts', ref: '5.7.17', description: 'Customer contact directory' },
      { id: 'o.otp', label: 'Wallet Withdrawal OTP', icon: 'shield-check', view: 'o.otp', ref: '5.7.18', description: 'Issue and verify withdrawal one-time codes' },
      { id: 'o.pendingsupply', label: 'Pending Supply Reports', icon: 'clock', view: 'o.pendingsupply', ref: '5.7.19', description: 'Orders paid for but not yet supplied' },
    ],
  },

  // ── 5.8 Menu Button ──────────────────────────────────────────────────────
  {
    id: 'menu',
    label: 'Menu Button',
    icon: 'square-menu',
    section: '5.8',
    items: [
      { id: 'm.dealerreg', label: 'Dealer Register', icon: 'user-round-plus', view: 'm.dealerreg', ref: '5.8.1', description: 'Register a dealer or distributor' },
      { id: 'm.pos', label: 'POS', icon: 'scan-line', view: 'm.pos', ref: '5.8.2', description: 'Point-of-sale transaction terminal' },
      { id: 'm.debtors', label: 'Debtors List', icon: 'file-warning', view: 'm.debtors', ref: '5.8.3', description: 'Outstanding customer and dealer balances' },
      { id: 'm.userreg', label: 'User Register', icon: 'user-round-cog', view: 'm.userreg', ref: '5.8.4', description: 'Create users and assign roles' },
    ],
  },

  // ── 5.9 AI-Powered Features ──────────────────────────────────────────────
  {
    id: 'ai',
    label: 'AI',
    icon: 'sparkles',
    section: '5.9',
    items: [
      { id: 'ai.assistant', label: 'ZifIQ Assistant', icon: 'message-circle', view: 'ai.assistant', ref: '5.9', description: 'Ask questions about stock, sales, and cash' },
      { id: 'ai.reorder', label: 'Smart Re-Order Forecasting', icon: 'refresh-cw', view: 'ai.reorder', ref: '5.9', description: 'Trend-aware reorder date and quantity forecasts' },
      { id: 'ai.recipe', label: 'Recipe Cost Optimizer', icon: 'flask-conical', view: 'ai.recipe', ref: '5.9', description: 'Lower-cost material mixes within spec' },
      { id: 'ai.cashflow', label: 'Cash Flow Forecasting', icon: 'trending-up', view: 'ai.cashflow', ref: '5.9', description: 'Projected inflows, outflows, and shortfalls' },
      { id: 'ai.demand', label: 'Sales & Demand Forecasting', icon: 'chart-line', view: 'ai.demand', ref: '5.9', description: 'Predicted demand per product and showroom' },
      { id: 'ai.fraud', label: 'Fraud/Anomaly Detection', icon: 'shield-alert', view: 'ai.fraud', ref: '5.9', description: 'Flagged irregularities for human review' },
      { id: 'ai.ocr', label: 'Document OCR Capture', icon: 'scan-text', view: 'ai.ocr', ref: '5.9', description: 'Extract data from scanned invoices and receipts' },
      { id: 'ai.briefing', label: 'Executive Insights', icon: 'newspaper', view: 'ai.briefing', ref: '5.9', description: 'Automated management briefing' },
    ],
  },

  // ── 5.10 Electronic Invoicing ────────────────────────────────────────────
  {
    id: 'invoicing',
    label: 'Electronic Invoicing',
    icon: 'file-text',
    section: '5.10',
    items: [
      { id: 'i.generate', label: 'Invoice Generation', icon: 'file-plus', view: 'i.generate', ref: '5.10', description: 'Create an invoice from a sale or pro-forma' },
      { id: 'i.delivery', label: 'PDF & Email Delivery', icon: 'send', view: 'i.delivery', ref: '5.10', description: 'Render and send invoices to buyers' },
      { id: 'i.status', label: 'Status & Payment Tracking', icon: 'circle-check-big', view: 'i.status', ref: '5.10', description: 'Track paid, partial, and overdue invoices' },
      { id: 'i.history', label: 'Invoice History & Search', icon: 'search', view: 'i.history', ref: '5.10', description: 'Find any issued invoice' },
    ],
  },

  // ── 5.11 Barcode & QR ────────────────────────────────────────────────────
  {
    id: 'barcode',
    label: 'Barcode & QR',
    icon: 'qr-code',
    section: '5.11',
    items: [
      { id: 'b.scan', label: 'Scan & Label', icon: 'qr-code', view: 'b.scan', ref: '5.11', description: 'Scan codes and generate printable product labels' },
    ],
  },

  // ── Settings ─────────────────────────────────────────────────────────────
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    items: [
      { id: 's.company', label: 'Company Settings', icon: 'building-2', view: 's.company', description: 'Company name, address, and contact details' },
      { id: 's.branches', label: 'Branches', icon: 'map-pin', view: 'branches', description: 'Locations beyond your primary company address' },
      // Factories, Suppliers, Manufacturers and Units live under Factory › Setup.
      // They were duplicated here; one home only, so there is no question which is authoritative.
      { id: 's.users', label: 'Users & Roles', icon: 'users', view: 'm.userreg', description: 'Add people to this company and assign their roles' },
    ],
  },
]

/** Flat list of every navigable leaf (items without children, plus all children). */
export const navLeaves = navModules.flatMap((m) =>
  m.items.flatMap((i) => (i.children ? i.children.map((c) => ({ ...c, moduleId: m.id, parentId: i.id })) : [{ ...i, moduleId: m.id }]))
)

export const navById = Object.fromEntries(navLeaves.map((l) => [l.id, l]))

/** moduleId → module, for breadcrumbs. */
export const moduleById = Object.fromEntries(navModules.map((m) => [m.id, m]))

/**
 * Breadcrumb targets. A module or parent-item label resolves to the first leaf
 * beneath it, so clicking "Factory" or "Stock Refill" in a breadcrumb goes
 * somewhere sensible instead of nowhere.
 */
const firstLeafOf = (item) => (item.children ? item.children[0] : item)

export const crumbTargetByLabel = Object.fromEntries([
  ...navModules.map((m) => [m.label, firstLeafOf(m.items[0])]),
  ...navModules.flatMap((m) => m.items.filter((i) => i.children).map((i) => [i.label, i.children[0]])),
].filter(([label, leaf]) => label && leaf?.view))

/** leaf id → its parent item label, for breadcrumbs. */
export const parentLabelById = Object.fromEntries(
  navModules.flatMap((m) => m.items.filter((i) => i.children).flatMap((i) => i.children.map((c) => [c.id, i.label])))
)
