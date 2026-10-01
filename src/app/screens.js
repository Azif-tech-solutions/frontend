// view key → screen component. Anything absent falls back to Placeholder,
// so every nav item in nav.js resolves whether or not it has been designed yet.
// screens.js
import Overview from './Overview'
import StockRegistration from './StockRegistration'
import ProductVariation from './ProductVariation'
import StockRecords from './StockRecords'
import Branches from './Branches'

// ── 5.1 Factory ──
import StockRefillFinished from './factory/StockRefillFinished'
import StockRefillRaw from './factory/StockRefillRaw'
import RefillDrafts from './factory/RefillDrafts'
import StockRegister from './factory/StockRegister'
import StockCardGP from './factory/StockCardGP'
import BinCardGP from './factory/BinCardGP'
import StockBinCard from './factory/StockBinCard'
import QuantityAdjustment from './factory/QuantityAdjustment'
import ComprehensiveStockReport from './factory/ComprehensiveStockReport'
import StockMovementReport from './factory/StockMovementReport'
import StockTransfer from './factory/StockTransfer'
import ProductionCostCalculator from './factory/ProductionCostCalculator'
import TotalCostSelectedRecipes from './factory/TotalCostSelectedRecipes'
import RecipesRegister from './factory/RecipesRegister'
import RecipesProduction from './factory/RecipesProduction'
import RecipesReports from './factory/RecipesReports'
import SpecialProduction from './factory/SpecialProduction'
import SpecialProductionReports from './factory/SpecialProductionReports'
import CashFlowStatement from './factory/CashFlowStatement'
import FundsAwaitingReception from './factory/FundsAwaitingReception'
import MaterialReceiveReport from './factory/MaterialReceiveReport'
import ReOrderReport from './factory/ReOrderReport'
import SCIFactory from './factory/SCIFactory'
import FactoryVATReport from './factory/FactoryVATReport'
import TradeOffer from './factory/TradeOffer'
import TradePending from './factory/TradePending'
import TradeReport from './factory/TradeReport'

// ── 5.2 Showroom ──
import ReceiveProduct from './showroom/ReceiveProduct'
import StockEntryDirect from './showroom/StockEntryDirect'
import ShowroomAdjustment from './showroom/ShowroomAdjustment'
import ShowroomCards from './showroom/ShowroomCards'
import OutsourceStock from './showroom/OutsourceStock'
import ShowroomStockReport from './showroom/ShowroomStockReport'
import ShowroomTransfer from './showroom/ShowroomTransfer'
import Returns from './showroom/Returns'
import GeneralTransferReport from './showroom/GeneralTransferReport'
import ShowroomVATReport from './showroom/ShowroomVATReport'

// ── 5.3 Account ──
import AccountCashFlow from './account/AccountCashFlow'
import BankStatement from './account/BankStatement'
import PettyCashPaymentHistory from './account/PettyCashPaymentHistory'
import PettyCashStatement from './account/PettyCashStatement'
import RunningCost from './account/RunningCost'
import Tenderable from './account/Tenderable'
import ExpenseGuide from './account/ExpenseGuide'
import BankRegisterScreen from './account/BankRegisterScreen'
import FundPettyCash from './account/FundPettyCash'
import POSConfirmation from './account/POSConfirmation'
import FundsAwaitingBranch from './account/FundsAwaitingBranch'
import PettyCashPayment from './account/PettyCashPayment'
import PendingPettyCash from './account/PendingPettyCash'

// ── 5.4 Cashier ──
import SalesReport from './cashier/SalesReport'
import ProFormaInvoice from './cashier/ProFormaInvoice'
import GenerateWaybill from './cashier/GenerateWaybill'

// ── 5.5 Process Guide ──
import ExchangeRate from './process/ExchangeRate'
import ChangePassword from './process/ChangePassword'
import ShowroomRegister from './process/ShowroomRegister'
import CommsGuide from './process/CommsGuide'
import CommsAllocator from './process/CommsAllocator'
import ErrorHandler from './process/ErrorHandler'
import RecycleBin from './process/RecycleBin'
import Correspondent from './process/Correspondent'
import VATControl from './process/VATControl'

// ── 5.6 History ──
import WaybillHistory from './history/WaybillHistory'
import ExpensesReport from './history/ExpensesReport'
import StockMovementHistory from './history/StockMovementHistory'
import ViolationsHistory from './history/ViolationsHistory'
import WalletWithdrawalHistory from './history/WalletWithdrawalHistory'

// ── 5.7 Others ──
import CustomerHistory from './others/CustomerHistory'
import CustomersComprehensive from './others/CustomersComprehensive'
import AdjustmentsReport from './others/AdjustmentsReport'
import SCIReport from './others/SCIReport'
import TransactionReceipts from './others/TransactionReceipts'
import CashTransferHistory from './others/CashTransferHistory'
import PriceList from './others/PriceList'
import InstantDiscount from './others/InstantDiscount'
import CommsReport from './others/CommsReport'
import CorrespondentsReport from './others/CorrespondentsReport'
import DealersUpdate from './others/DealersUpdate'
import ReturnReports from './others/ReturnReports'
import OutsourceStockReport from './others/OutsourceStockReport'
import CustomerContacts from './others/CustomerContacts'
import WalletWithdrawalOTP from './others/WalletWithdrawalOTP'
import PendingSupplyReports from './others/PendingSupplyReports'

// ── 5.8 Menu Button ──
import DealerRegister from './menu/DealerRegister'
import POS from './menu/POS'
import DebtorsList from './menu/DebtorsList'
import UserRegister from './menu/UserRegister'

// ── 5.10 Electronic Invoicing ──
import InvoiceGeneration from './invoicing/InvoiceGeneration'
import InvoiceDelivery from './invoicing/InvoiceDelivery'
import InvoiceStatus from './invoicing/InvoiceStatus'
import InvoiceHistory from './invoicing/InvoiceHistory'

// ── 5.11 Barcode & QR ──
import ScanAndLabel from './barcode/ScanAndLabel'

// ── 5.9 AI-Powered Features ──
import Assistant from './ai/Assistant'
import ReorderForecast from './ai/ReorderForecast'
import RecipeOptimizer from './ai/RecipeOptimizer'
import CashFlowForecast from './ai/CashFlowForecast'
import DemandForecast from './ai/DemandForecast'
import AnomalyDetection from './ai/AnomalyDetection'
import DocumentOCR from './ai/DocumentOCR'
import ExecutiveBriefing from './ai/ExecutiveBriefing'

// ── Settings ──
import CompanySettings from './settings/CompanySettings'
import Factories from './settings/Factories'
import Suppliers from './settings/Suppliers'
import Units from './settings/Units'
import Categories from './settings/Categories'
import Manufacturers from './settings/Manufacturers'

export const screens = {
  overview: Overview,

  // 5.1 Factory — block A1
  'f.refill.finished': StockRefillFinished,
  'f.refill.raw': StockRefillRaw,
  'f.refill.drafts': RefillDrafts,
  'f.register': StockRegister,

  // 5.1 Factory — block A2
  'f.cards.stockgp': StockCardGP,
  'f.cards.bingp': BinCardGP,
  'f.cards.single': StockBinCard,

  // 5.1 Factory — block A3
  'f.adjust': QuantityAdjustment,
  'f.compstock': ComprehensiveStockReport,
  'f.movement': StockMovementReport,

  // 5.1 Factory — block A4
  'f.transfer': StockTransfer,

  // 5.1 Factory — block A5 (Factory A/B share one screen, differing by production line)
  'f.costcalc': ProductionCostCalculator,
  'f.recipecost': TotalCostSelectedRecipes,

  // 5.1 Factory — block A6
  'f.recipes.register': RecipesRegister,
  'f.recipes.production': RecipesProduction,
  'f.recipes.reports': RecipesReports,

  // 5.1 Factory — block A7
  'f.special.production': SpecialProduction,
  'f.special.reports': SpecialProductionReports,

  // 5.1 Factory — block A8
  'f.cashflow': CashFlowStatement,
  'f.fundsawaiting': FundsAwaitingReception,
  'f.receive': MaterialReceiveReport,
  'f.reorder': ReOrderReport,
  'f.sci': SCIFactory,
  'f.vat': FactoryVATReport,

  // 5.1 Factory — block A9 (completes the module)
  'f.trade.offer': TradeOffer,
  'f.trade.pending': TradePending,
  'f.trade.report': TradeReport,

  // 5.2 Showroom
  's.receive': ReceiveProduct,
  's.direct': StockEntryDirect,
  's.adjust': ShowroomAdjustment,
  's.cards': ShowroomCards,
  's.outsource': OutsourceStock,
  's.compstock': ShowroomStockReport,
  's.transfer': ShowroomTransfer,
  's.returns': Returns,
  's.transferreport': GeneralTransferReport,
  's.vat': ShowroomVATReport,

  // 5.3 Account (Credit Petty Cash and Fund Petty Cash are the same feature per PRD)
  'a.cashflow': AccountCashFlow,
  'a.bankpetty.bank': BankStatement,
  'a.bankpetty.pchist': PettyCashPaymentHistory,
  'a.bankpetty.pcstmt': PettyCashStatement,
  'a.running': RunningCost,
  'a.tenderable': Tenderable,
  'a.expguide': ExpenseGuide,
  'a.bankregister': BankRegisterScreen,
  'a.creditpetty': FundPettyCash,
  'a.posconfirm': POSConfirmation,
  'a.fundsawaiting': FundsAwaitingBranch,
  'a.petty.fund': FundPettyCash,
  'a.petty.payment': PettyCashPayment,
  'a.petty.pending': PendingPettyCash,

  // 5.4 Cashier
  'c.sales': SalesReport,
  'c.proforma': ProFormaInvoice,
  'c.waybill': GenerateWaybill,

  // 5.5 Process Guide
  'p.fx': ExchangeRate,
  'p.password': ChangePassword,
  'p.showroomreg': ShowroomRegister,
  'p.commsguide': CommsGuide,
  'p.commsalloc': CommsAllocator,
  'p.errorhandler': ErrorHandler,
  'p.recyclebin': RecycleBin,
  'p.correspondent': Correspondent,
  'p.vatcontrol': VATControl,

  // 5.6 History
  'h.waybill': WaybillHistory,
  'h.expenses': ExpensesReport,
  'h.movement': StockMovementHistory,
  'h.violations': ViolationsHistory,
  'h.withdrawal': WalletWithdrawalHistory,

  // 5.7 Others
  'o.customerhistory': CustomerHistory,
  'o.custcomp': CustomersComprehensive,
  'o.adjustments': AdjustmentsReport,
  'o.sci': SCIReport,
  'o.receipts': TransactionReceipts,
  'o.cashtransfer': CashTransferHistory,
  'o.pricelist': PriceList,
  'o.discount': InstantDiscount,
  'o.commsreport': CommsReport,
  'o.correspondents': CorrespondentsReport,
  'o.dealersupdate': DealersUpdate,
  'o.returns': ReturnReports,
  'o.outsource': OutsourceStockReport,
  'o.contacts': CustomerContacts,
  'o.otp': WalletWithdrawalOTP,
  'o.pendingsupply': PendingSupplyReports,

  // 5.8 Menu Button
  'm.dealerreg': DealerRegister,
  'm.pos': POS,
  'm.debtors': DebtorsList,
  'm.userreg': UserRegister,

  // 5.10 Electronic Invoicing
  'i.generate': InvoiceGeneration,
  'i.delivery': InvoiceDelivery,
  'i.status': InvoiceStatus,
  'i.history': InvoiceHistory,

  // 5.11 Barcode & QR
  'b.scan': ScanAndLabel,

  // 5.9 AI-Powered 
  'ai.assistant': Assistant,
  'ai.reorder': ReorderForecast,
  'ai.recipe': RecipeOptimizer,
  'ai.cashflow': CashFlowForecast,
  'ai.demand': DemandForecast,
  'ai.fraud': AnomalyDetection,
  'ai.ocr': DocumentOCR,
  'ai.eri':DocumentOCR,
  'ai.briefing': ExecutiveBriefing,

  // Settings
  's.company': CompanySettings,
  factories: Factories,
  suppliers: Suppliers,
  units: Units,
  categories: Categories,
  manufacturers: Manufacturers,

  // Pre-PRD screens, kept as visual reference until their PRD equivalents land.
  stockregister: StockRegistration,
  productVariation: ProductVariation,
  stockrecords: StockRecords,
  branches: Branches,
}
