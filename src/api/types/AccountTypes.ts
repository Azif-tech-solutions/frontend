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
  floatLimit: number;
 
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