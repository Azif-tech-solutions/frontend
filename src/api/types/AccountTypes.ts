import { Paged } from "../config";
export type AccountHead = "FINANCE" | "ADMINISTRATIVE" | "UTILITIES" | "LOGISTICS" |"MAINTENANCE";

export interface VatCategory {
  id:string;
  code: string;
  name: string;
  rate: number;
  inputVatRecoverable: boolean;
  description: string;
  nrsTaxCategoryCode: string;
}

export interface VatCategoryResponse {
  
  data: VatCategory[];
}


export interface IsicSections {
  id:string;
  code: string;
  name: string;
}

export interface IsicSectionsResponse {
  data: IsicSections[];
}

export interface HsnSections {
  id:string;
  code: string;
  chapterRange: string;
  name: string;
}

export interface HsnSectionsResponse {
  data: HsnSections[];
}

export interface ExpenseCategories{
  id:string;
  code:string;
  name: string;
  description: string|null;
  accountHead: AccountHead;
  monthlyCap: string|null;
  pettyCashAllowed: boolean;
  status: string;
  spentThisMonth:number;
  overCap:boolean;
  createdAt:string;
  
}


export interface CreateExpenseCategoriesRequest {
  code:string;
  name: string;
  description: string|null;
  accountHead: AccountHead;
  monthlyCap: number;
  pettyCashAllowed: boolean;
}

export interface CreateExpenseCategoriesResponse {
  data: ExpenseCategories;
}

export interface ListExpenseCategoriesRequest {
  q: string; //query
  accountHead: AccountHead[];
  status: string;
  pettyCashAllowed: boolean;
  overCap: boolean;
  sort: string;
}
export interface ListExpenseCategoriesResponse {
  data: ExpenseCategories[];
}

export interface SingleExpenseCategoriesResponse {
  data: ExpenseCategories;
}

export interface EditExpenseCategoriesRequest {
  code:string;
  name: string;
  description: string|null;
  accountHead: AccountHead;
  monthlyCap: string|null;
  pettyCashAllowed: boolean;
}

export interface UpdateStatusExpenseCategoriesRequest {
  status: "ACTIVE" | "INACTIVE";
}



export interface ExpenseCategoryLookup {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: LookupOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface LookupOption {
  value: string;
  label: string;
}

export interface ExpenseCategoryFieldsResponse {
  data: {
    fields: ExpenseCategoryField[];
    collections: unknown[];
    primaryDate: string;
    defaultSort: unknown[];
    periodPresets: PeriodPreset[];
  };
}

export interface ExpenseCategoryField {
  key: string;
  label: string;
  type: FieldType;
  operators: FieldOperator[];
  options: LookupOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export type FieldType = "ENUM" | "UUID" | "MONEY" | "DATE";

export type FieldOperator =
  | "eq"
  | "ne"
  | "in"
  | "not_in"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in_period"
  | "is_null"
  | "is_not_null";

export type PeriodPreset =
  | "TODAY"
  | "YESTERDAY"
  | "THIS_WEEK"
  | "LAST_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "THIS_QUARTER"
  | "LAST_QUARTER"
  | "THIS_YEAR"
  | "LAST_YEAR"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "MONTH_TO_DATE"
  | "YEAR_TO_DATE";


export interface CashFlowStatementItem {
    sn: string,
    id: string,
    date: string,
    reference: string,
    remark: string,
    inflflow: number,
    outflow: number,
    balance: number,
    accountCode: string,
    accountName: string,
    kind: string,
    sourceType: string,
    expenseCategoryName: string | null
}

export interface CashFlowStatementResponse {
  data: Paged<CashFlowStatementItem>;
}



export interface FundsDisbursementFiltersResponse {
  data: {
    fields: FundsDisbursementFilterField[];
    collections: unknown[];
    primaryDate: string;
    defaultSort: SortConfig[];
    periodPresets: PeriodPreset[];
  };
}

export interface FundsDisbursementFilterField {
  key: string;
  label: string;
  type: FundsDisbursementFieldType;
  operators: FundsDisbursementOperator[];
  options: FilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortConfig {
  field: string;
  dir: "asc" | "desc";
}

export type FundsDisbursementFieldType =
  | "LOCATION"
  | "ENUM"
  | "BOOLEAN"
  | "UUID"
  | "MONEY"
  | "DATETIME";

export type FundsDisbursementOperator =
  | "eq"
  | "ne"
  | "in"
  | "not_in"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in_period"
  | "is_null"
  | "is_not_null";

export type PeriodPreset =
  | "TODAY"
  | "YESTERDAY"
  | "THIS_WEEK"
  | "LAST_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "THIS_QUARTER"
  | "LAST_QUARTER"
  | "THIS_YEAR"
  | "LAST_YEAR"
  | "LAST_7_DAYS"
  | "LAST_30_DAYS"
  | "LAST_90_DAYS"
  | "MONTH_TO_DATE"
  | "YEAR_TO_DATE";

  export interface FundsDisbursementResponse {
  data: Paged<FundsDisbursement>;
}

export interface FundsDisbursement {
  id: string;
  ref: string;
  date: string;
  destinationLocation: Location;
  purpose: string;
  channel: string;
  sourceAccount: string;
  destinationAccount: string;
  sentBy: UserSummary;
  sent: number;
  received: number;
  shortfall: number;
  shortfallReason: string;
  status: string;
  confirmedBy: UserSummary;
  dateReceived: string;
  rejectionReason: string;
}

export interface Location {
  kind: string;
  id: string;
  "visible$zifiq_backend": boolean;
  "details$zifiq_backend": Record<string, unknown>;
  code: string;
  name: string;
  fields: Record<string, unknown>;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
}

export interface Paged<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  totalIsEstimate?: boolean;
  facets?: Record<string, FacetOption[]>;
  summary?: unknown;
  meta?: ResponseMeta;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface ResponseMeta {
  appliedFilters: Record<string, string>;
  ignoredQualifiers: string[];
  suggestions: string[];
  matches: Record<string, MatchSnippet[]>;
}

export interface MatchSnippet {
  field: string;
  snippet: string;
}



export interface BankAccountLocation {
  id: string;
  code: string;
  name: string;
}

export interface BankAccount {
  id: string;
  code: string;
  bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  accountNumberMasked: string;
  accountType: string;
  currencyCode: string;
  sortCodeOrBic: string;
  authorisedSignatory: string;
  relationshipManager: string;
  dateOpened: string;
  openingBalance: number;
  openingBalanceDate: string;
  currentBalance: number;
  location: BankAccountLocation;
  status: string;
  createdAt: string;
}

export type BankAccountType = 'COLLECTIONS'|'SINGLE'|'PAYROLL'|'CURRENT'|'SAVINGS';


export interface CreateBankAccountCredentials {
  bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  accountType: BankAccountType;
  currencyCode: string;
  sortCodeOrBic: string;
  authorisedSignatory: string;
  relationshipManager: string;
  dateOpened: string;
  openingBalance: number;
  openingBalanceDate: string;
  locationId: string;
  active: boolean;
}

export interface GenericBankAccountResponse {
  data: BankAccount;
}



export  interface UpdateBankAccountCredentials{
   bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  sortCodeOrBic: string,
  authorisedSignatory: string,
  relationshipManager: string,
  dateOpened: string,
  locationId: string
}


export interface EditBankAccountStatusCredentials{
  status: "ACTIVE" | "DORMANT";
}

export interface ListBankAccountsCredentials{
  q?:string;
  status?:'ACTIVE'|'DORMANT';
  locationId?:string;
  currencyCode?:string;
}

export interface ListBankAccountRespsonse{
  data:BankAccount[]
}



export interface BankStatementFilterOption {
  value: string;
  label: string;
}

export interface BankStatementFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: BankStatementFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface BankStatementFilterSort {
  field: string;
  dir: string;
}

export interface BankStatementFilterData {
  fields: BankStatementFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: BankStatementFilterSort[];
  periodPresets: string[];
}

export interface BankStatementFilterResponse {
  data: BankStatementFilterData;
}

export interface BankStatementListItem {
  id: string;
  date: string;
  reference: string;
  description: string;
  type: string;
  credit: number;
  debit: number;
  balance: number;
  sourceType: string;
  expenseCategoryName: string;
  createdAt: string;
}

export interface BankStatementListResponse {
  data: Paged<BankStatementListItem>;
}












//CASHFLOW FILTER

export interface AccountCashFlowFilterOption {
  value: string;
  label: string;
}

export interface AccountCashFlowFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: AccountCashFlowFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface AccountCashFlowFilterSort {
  field: string;
  dir: string;
}

export interface AccountCashFlowFilterData {
  fields: AccountCashFlowFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: AccountCashFlowFilterSort[];
  periodPresets: string[];
}

export interface AccountCashFlowFilterResponse {
  data: AccountCashFlowFilterData;
}

export interface AccountCashFlowListItem {
  sn: number;
  id: string;
  date: string;
  reference: string;
  remark: string;
  inflow: number;
  outflow: number;
  balance: number;
  accountCode: string;
  accountName: string;
  kind: string;
  sourceType: string;
  expenseCategoryName: string;
}

export interface AccountCashFlowResponse {
  data: Paged<AccountCashFlowListItem>;
}


type CASH_ACCOUNT_KIND = 'PETTY_CASH'|'TILL'|'VAULT';
type CASH_ACCOUNT_STATUS = 'ACTIVE'|'INACTIVE';
 interface CashAccountLocation {
  id: string;
  code: string;
  name: string;
}

 interface CashAccount {
  id: string;
  code: string;
  name: string;
  kind: CASH_ACCOUNT_KIND;
  location: CashAccountLocation;
  currencyCode: string;
  openingBalance: number;
  currentBalance: number;
  floatLimit: number;
  belowFloat: boolean;
  posTerminalRef: string;
  posSettlementBankAccount: CashAccountLocation;
  status: CASH_ACCOUNT_STATUS;
  createdAt: string;
}

export interface CreateCashAccountCredentials {
  code: string;
  name: string;
  kind: CASH_ACCOUNT_KIND;
  locationId: string;
  currencyCode: string;
  openingBalance: number;
  floatLimit?: number;
 
  posTerminalRef: string;
  posSettlementBankAccountIdId: string;
}

export interface SingleCashAccountResponse {
  data: CashAccount;
}

export interface ListCashAccountsCredentials {
  q?:string;
  kind?:CASH_ACCOUNT_KIND[];
  locationId?:string;
  currencyCode?:string;
  status?:CASH_ACCOUNT_STATUS;
}
export interface ListCashAccountsResponse {
  data: CashAccount[];
}

export interface ChangeCashAccountStatusCredentials {
  status: CASH_ACCOUNT_STATUS;
}


export interface EditCashAccountCredentials {

  name: string;
  floatLimit: number;

  posTerminalRef: string;
  posSettlementBankAccountIdId: string;
}








export interface GetPettyCashAccountStatementCredentials {
  pettyCashAccountId?: string;
  locationId?: string;
  from?:string;
  to?:string;
  page?:number;
  size?:number;
}





export interface PettyCashStatementAccount {
  id: string;
  code: string;
  name: string;
  locationName: string;
}

export interface PettyCashStatementPeriod {
  from: string;
  to: string;
}

export interface PettyCashLedgerItem {
  date: string;
  ref: string;
  description: string;
  category: string | null;
  direction: string;
  in: number;
  out: number;
  balance: number;
  accountCode: string;
}

export interface PettyCashLedger {
  items: PettyCashLedgerItem[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  totalIsEstimate: boolean;
  facets: unknown | null;
  summary: unknown | null;
  meta: {
    appliedFilters: Record<string, unknown>;
    ignoredQualifiers: string[];
    suggestions: string[];
    matches: Record<string, unknown>;
  };
}

export interface PettyCashFunding {
  openingBalance: number;
  entries: unknown[];
  totalAvailable: number;
}

export interface PettyCashUtilisationCategory {
  category: string;
  amount: number;
}

export interface PettyCashStatement {
  funding: PettyCashFunding;
  utilisationByCategory: PettyCashUtilisationCategory[];
  totalUtilised: number;
  closingBalance: number;
  utilisedPct: number;
}

export interface AccountPettyCashStatementResponse {
  data: {
    accounts: PettyCashStatementAccount[];
    period: PettyCashStatementPeriod;
    ledger: PettyCashLedger;
    statement: PettyCashStatement;
  };
}













export interface PettyCashFilterOption {
  value: string;
  label: string;
}

export interface PettyCashFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: PettyCashFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface PettyCashFilterSort {
  field: string;
  dir: string;
}

export interface PettyCashFilterData {
  fields: PettyCashFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: PettyCashFilterSort[];
  periodPresets: string[];
}

export interface PettyCashHistoryFilterResponse {
  data: PettyCashFilterData;
}



export interface PettyCashHistoryItem {
  sn: number;
  id: string;
  date: string;
  ref: string;
  description: string;
  category: string;
  paidTo: string;
  approvedBy: string;
  amount: number;
  source: string;
  status: string;
  pettyCashAccountCode: string;
}

export interface PettyCashHistoryFacet {
  value: string;
  label: string;
  count: number;
}

export interface PettyCashHistoryMatch {
  field: string;
  snippet: string;
}

export interface PettyCashHistoryMeta {
  appliedFilters: Record<string, unknown>;
  ignoredQualifiers: string[];
  suggestions: string[];
  matches: Record<string, PettyCashHistoryMatch[]>;
}

export interface PettyCashHistoryResponse {
  data: {
    items: PettyCashHistoryItem[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    totalIsEstimate: boolean;
    facets: Record<string, PettyCashHistoryFacet[]> | null;
    summary: Record<string, unknown> | null;
    meta: PettyCashHistoryMeta;
  };
}

type PAYMENT_METHOD = "CHEQUE" | "CASH" |"BANK_TRANSFER" |"CHEQUE";

export interface RunningCost {
  id: string;
  ref: string;
  date: string;
  description: string;
  expenseCategory: {
    id: string;
    code: string;
    name: string;
  };
  payee: string;
  method: string;
  payingAccountId: string;
  payingAccount: string;
  amount: number;
  inputVatAmount: number;
  supplierTin: string;
  invoiceOrReceiptNo: string;
  chequeNumber: string;
  location: {
    id: string;
    code: string;
    name: string;
  };
  status: string;
  exceedsMonthlyCap: boolean;
  submittedBy: {
    id: string;
    name: string;
    email: string;
  };
  submittedAt: string;
  approvedBy?: {
    id: string;
    name: string;
    email: string;
  };
  approvedAt: string;
  rejectionReason: string;
  reversalReason: string;
  createdAt: string;
}

export interface SingleRunningCostResponse{
  data: RunningCost;
}
export interface CreateRunningCostCredentials
  {
  locationId: string;
  expenseCategoryId: string;
  payee: string;
  amount: number;
  paymentMethod: PAYMENT_METHOD;
  payingCashAccountId: string;
  payingBankAccountId: string;
  chequeNumber: string;
  invoiceOrReceiptNo: string;
  inputVatAmount: number;
  supplierTin: string;
  paymentDate: string;
  description: string;
  submit: boolean;
}

export interface ReverseRunningCostCredentials{
  reason: string;
}

export  interface RejectRunningCostCredentials{
  rejectionReason: string;
}


export interface RunningCostFilterOption {
  value: string;
  label: string;
}

export interface RunningCostFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: RunningCostFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface RunningCostFilterSort {
  field: string;
  dir: string;
}

export interface RunningCostFilterData {
  fields: RunningCostFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: RunningCostFilterSort[];
  periodPresets: string[];
}

export interface GetRunningCostFiltersResponse {
  data: RunningCostFilterData;
}


export interface ListRunningCostResponse{
  data: Paged<RunningCost>;
}


type PETTY_CASH_SOURCE_KIND = "CASH" | "BANK";

interface PettyCashFundingData {
  id: string;
  ref: string;
  date: string;
  pettyCashAccount: {
    id: string;
    code: string;
    name: string;
  };
  sourceKind: string;
  sourceName: string;
  amount: number;
  transferOrChequeReference: string;
  authorisedBy: string;
  description: string;
  fundedBy: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  reversalReason: string;
  createdAt: string;
}
export interface SinglePettyCashFundingResponse{
  data: PettyCashFundingData;
}
export interface CreatePettyCashFunding{
  pettyCashAccountId: string;
  sourceKind: PETTY_CASH_SOURCE_KIND;
  sourceBankAccountId: string;
  sourceCashAccountId   : string;
  amount: number;
  fundingDate: string;
  transferOrChequeReference: string;
  authorisedBy: string;
  description: string;
}

export interface ReversePettyCashFundingCredentials{
  reason: string;
}


export interface PettyCashFundingFilterOption {
  value: string;
  label: string;
}

export interface PettyCashFundingFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: PettyCashFundingFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface PettyCashFundingFilterSort {
  field: string;
  dir: string;
}

export interface PettyCashFundingFilterData {
  fields: PettyCashFundingFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: PettyCashFundingFilterSort[];
  periodPresets: string[];
}

export interface PettyCashFundingFilterResponse {
  data: PettyCashFundingFilterData;
}

export interface ListPettyCashFundingResponse{
  data: Paged<PettyCashFundingData>;
}


export interface GetTenderableWalletFundsCredentials{
  customerId:string;
  from:string;
  to:string;
  page:number;
  size:number;
}

export interface GetTenderableWalletFundsResponse {
  data: Paged<{
    ref: string;
    date: string;
    customer: {
      id: string;
      code: string;
      name: string;
      type: string;
    };
    dealer: string;
    method: string;
    bank: string | null;
    amount: number;
    confirmedBy: string | null;
    status: string;
  }>;
}

export interface GetTenderablePayableCreedntials{
  locationId:string;
  from:string;
  to:string;
  page:number;
  size:number;
}

export interface GetTenderablePayableResponse {
  data: Paged<{
    date: string;
    cashier: {
      id: string;
      code: string;
      name: string;
      type: string;
    };
    ftf: number;
    cash: number;
    pos: number;
    wallet: number;
    deposit: number;
    refund: number;
    total: number;
    pendingConfirmation: number;
    declined: number;
  }>;
}

export interface GetTenderableReceiptsResponse {
  data: Paged<{
    id: string;
    ref: string;
    kind: string;
    receivedAt: string;
    location: {
      id: string;
      code: string;
      name: string;
    };
    cashAccount: {
      id: string;
      code: string;
      name: string;
    };
    cashier: {
      id: string;
      name: string;
      email: string;
    };
    customer: {
      id: string;
      code: string;
      name: string;
    };
    customerName: string;
    channel: string;
    amount: number;
    sourceModule: string;
    sourceType: string;
    sourceRef: string;
    incomeCategory: string;
    description: string;
    receivingBankAccount: {
      id: string;
      code: string;
      name: string;
    };
    terminalRef: string;
    payerReference: string;
    confirmationStatus: string;
    reviewedBy: {
      id: string;
      name: string;
      email: string;
    };
    reviewedAt: string;
    declineNote: string;
    status: string;
    voidReason: string;
  }>;
}


export interface GetTenderableGeneralReportCredentials{
  locationId:string;
  from:string;
  to:string;

}

export interface GetTenderableGeneralReportResponse {
  data: {
    period: {
      from: string | null;
      to: string | null;
    };
    rows: {
      cashier: {
        id: string;
        name: string;
        email: string;
      };
      daysActive: number;
      ftf: number;
      cash: number;
      pos: number;
      wallet: number;
      deposit: number;
      refund: number;
      total: number;
    }[];
    totals: {
      cashier: {
        id: string;
        name: string;
        email: string;
      };
      daysActive: number;
      ftf: number;
      cash: number;
      pos: number;
      wallet: number;
      deposit: number;
      refund: number;
      total: number;
    } | null;
  };
}


export interface FundsDisbursement {
  id: string;
  ref: string;
  date: string;
  destinationLocation:Location;
  purpose: string;
  channel: string;
  sourceAccount: string;
  destinationAccount: string;
  sentBy: {
    id: string;
    name: string;
    email: string;
  };
  sent: number;
  received: number;
  shortfall: number;
  shortfallReason: string;
  status: string;
  confirmedBy: {
    id: string;
    name: string;
    email: string;
  };
  dateReceived: string;
  rejectionReason: string;
}
export interface CreateFundsDisbursementRequest {
  channel: "BANK_TRANSFER"|"CASH";
  sourceBankAccountId: string;
  sourceCashAccountId: string;
  destinationLocationId: string;
  destinationBankAccountId: string;
  destinationCashAccountId: string;
  purpose: string;
  sentAmount: number;
}
export interface SingleFundsDisbursementResponse {
  data: FundsDisbursement;
}


export interface RejectFundsDisbursementRequest {
reason: string;
}

export interface ConfirmFundsDisbursementRequest {
  receivedAmount: number;
  dateReceived: string;
  bankCreditReference: string;
  shortfallReason: string;
}


export interface FundsDisbursementFilterOption {
  value: string;
  label: string;
}

export interface FundsDisbursementFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: FundsDisbursementFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface FundsDisbursementFilterSort {
  field: string;
  dir: string;
}

export interface FundsDisbursementFilterData {
  fields: FundsDisbursementFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: FundsDisbursementFilterSort[];
  periodPresets: string[];
}

export interface FundsDisbursementFilterResponse {
  data: FundsDisbursementFilterData;
}


export interface ListFundsDisbursementsResponse {
  data: Paged<FundsDisbursement>;
}












export interface PettyCashPaymentsCredentials{
   pettyCashAccountId: string;
  expenseCategoryId: string;
  amount: number;
  paidTo: string;
  paymentDate: string;
  approvedBy: string;
  description: string;
}


export interface PettyCashPayment {
  id: string;
  ref: string;
  date: string;
  pettyCashAccount: {
    id: string;
    code: string;
    name: string;
  };
  expenseCategory: {
    id: string;
    code: string;
    name: string;
  };
  amount: number;
  paidTo: string;
  approvedBy: string;
  description: string;
  status: string;
  reversalReason: string;
  balanceAfter: number;
  createdAt: string;
}

export interface SinglePettyCashPaymentResponse {
  data: PettyCashPayment;
}


export interface ReversePettyCashPaymentRequest {
  reason: string;
}

export interface PettyCashHistoryResponse {
  data: Paged<{
    sn: number;
    id: string;
    date: string;
    ref: string;
    description: string;
    category: string;
    paidTo: string;
    approvedBy: string;
    amount: number;
    source: string;
    status: string;
    pettyCashAccountCode: string;
  }>;
}

export interface PettyCashHistoryFilterOption {
  value: string;
  label: string;
}

export interface PettyCashHistoryFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: PettyCashHistoryFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface PettyCashHistoryFilterSort {
  field: string;
  dir: string;
}

export interface PettyCashHistoryFilterData {
  fields: PettyCashHistoryFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: PettyCashHistoryFilterSort[];
  periodPresets: string[];
}

export interface PettyCashHistoryFilterResponse {
  data: PettyCashHistoryFilterData;
}


export interface CreateWalletWithdrawalRequest {
  customerId: string;
  balanceType: 'WALLET' | 'DEPOSIT';
  reason:
    | 'EXCESS_COMMISSION_RECOVERY'
    | 'OVER_CREDIT_CORRECTION'
    | 'DEALER_REQUEST'
    | 'INVOICE_SETTLEMENT'
    | 'DEPOSIT_REFUND';
  amount: number;
  payoutKind: 'CASH' | 'BANK' | 'NONE';
  payoutBankAccountId: string;
  payoutCashAccountId: string;
  paidVia: string;
  otpChallengeId: string;
  authorisedByUserId: string;
  withdrawalDate: string;
  locationId: string;
  note: string;
}

export interface CreateWalletWithdrawalResponse {
  data: {
    id: string;
    ref: string;
    date: string;
    customer: {
      kind: string;
      id: string;
 code: string;
      name: string;
    };
    customerCode: string;
    customerName: string;
    balanceType: string;
    initiatedBy: string;
    reason: string;
    balanceBefore: number;
    amount: number;
    balanceAfter: number;
    payoutKind: string;
    payoutAccount: string;
    paidVia: string;
    otp: string;
    authorisedBy: {
      id: string;
      name: string;
      email: string;
    };
    processedBy: {
      id: string;
      name: string;
      email: string;
    };
    auditStatus: string;
    reversalReason: string;
    note: string;
    createdAt: string;
  };
}

interface PettyCashAllocation{
   
    id: string;
    ref: string;
    date: string;
    sourceName: string;
    destinationLocation: {
      kind: string;
      id: string;
      code: string;
      name: string;
      
    },
    destinationAccountCode: string;
    purpose: string;
    sentBy: {
      id: string;
      name: string;
      email: string;
    };
    amount: number;
    status: string;
    respondedBy: {
      id: string;
      name: string;
      email: string;
    };
    respondedOn: string;
    note: string;
  }

export interface CreatePettyCashAllocationCredentials{
    sourceKind: "BANK"|"CASH";
    sourceBankAccountId: string;
    sourceCashAccountId: string;
    destinationPettyCashAccountId: string;
    amount: number;
    purpose: string;
}

export interface SinglePettyCashAllocationResponse{
    data: PettyCashAllocation;
}

export interface CreatePettyCashAllocationResponse extends SinglePettyCashAllocationResponse{
}

export interface RejectPettyCashAllocationRequest{
    note: string;
}

export interface RejectPettyCashAllocationResponse extends SinglePettyCashAllocationResponse{
}

export interface AcceptPettyCashAllocationResponse extends SinglePettyCashAllocationResponse{
  
}

export interface ListPettyCashAllocationResponse{
    data: Paged<PettyCashAllocation>;
}



export interface PettyCashAllocationFilterResponse {
  data: {
    fields: PettyCashAllocationFilterField[];
    collections: unknown[];
    primaryDate: string;
    defaultSort: PettyCashAllocationSort[];
    periodPresets: string[];
  };
}

export interface PettyCashAllocationFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: PettyCashAllocationFilterOption[];
  lookup: unknown | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface PettyCashAllocationFilterOption {
  value: string;
  label: string;
}

export interface PettyCashAllocationSort {
  field: string;
  dir: "asc" | "desc";
}







export interface AccountReceipt{ 
    id: string;
    ref: string;
    kind: string;
    receivedAt: string;
    location: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    cashAccount: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    cashier: {
      id: string;
      name: string;
      email: string;
    };
    customer: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    customerName: string;
    channel: string;
    amount: number;
    sourceModule: string;
    sourceType: string;
    sourceRef: string;
    incomeCategory: string;
    description: string;
    receivingBankAccount: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    terminalRef: string;
    payerReference: string;
    confirmationStatus: string;
    reviewedBy: {
      id: string;
      name: string;
      email: string;
    };
    reviewedAt: string;
    declineNote: string;
    status: string;
    voidReason: string;
  };


export interface SingleAccountReceiptResponse{
    data: AccountReceipt;
}
export interface VoidAccountReceiptResponse extends SingleAccountReceiptResponse{
  }

export interface DeclineAccountReceiptResponse extends SingleAccountReceiptResponse{
  }

export interface ApprovedAccountReceiptResponse extends SingleAccountReceiptResponse{
  }



  export interface ConfirmationStats{
    
    data: {
      pendingCount: number;
      pendingValue: number;
      approvedToday: number;
      declinedToday: number;
    
 
  }
  }

export interface ListAccountReceiptResponse {
  data: Paged<{
    id: string;
    ref: string;
    kind: string;
    receivedAt: string;
    location: {
      id: string;
      code: string;
      name: string;
      type: string;
    };
    cashAccount: {
      id: string;
      code: string;
      name: string;
      kind: string;
    } | null;
    cashier: {
      id: string;
      name: string;
      email: string;
    };
    customer: {
      id: string;
      code: string;
      name: string;
      type: string;
    } | null;
    customerName: string;
    channel: string;
    amount: number;
    sourceModule: string;
    sourceType: string;
    sourceRef: string;
    incomeCategory: string | null;
    description: string;
    receivingBankAccount: {
      id: string;
      code: string;
      bankName: string;
      accountName: string;
    } | null;
    terminalRef: string | null;
    payerReference: string | null;
    confirmationStatus: string;
    reviewedBy: {
      id: string;
      name: string;
      email: string;
    } | null;
    reviewedAt: string | null;
    declineNote: string | null;
    status: string;
    voidReason: string | null;
  }>;

}
  

export interface ListAccountReceiptFilterResponse {
  data: {
    fields: {
      key: string;
      label: string;
      type: string;
      operators: string[];
      options: {
        value: string;
        label: string;
      }[];
      lookup: string | null;
      facetable: boolean;
      sortable: boolean;
      qualifierAliases: string[];
    }[];
    collections: unknown[];
    primaryDate: string | null;
    defaultSort: {
      field: string;
      dir: string;
    }[];
    periodPresets: string[];
  };
}