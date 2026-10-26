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