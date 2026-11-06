//CustomerTypes.ts

import { StockEntryLocation, StockEntryUser } from "./ShowroomTypes.ts";
import { Paged } from "../config.ts";
interface DealerCategory{
    id: string;
    name: string;
    discountPct: number;
    suggestedCreditLimit: number;
    sortOrder: number;
    status: string;
    dealerCount: number;
}


export interface CreateDealerCategoryCredentials{
  name: string;
  discountPct: number;
  suggestedCreditLimit: number;
  sortOrder: number;
}

export interface CreateDealerCategoryResponse{
    data: DealerCategory;
}

export interface ListDealerCategoryCredentials{
    status: "ACTIVE" | "INACTIVE";
    q: string;
}

export interface ListDealerCategoryResponse{
    data:DealerCategory[];
}


export interface ChangeDealerCategoryStatusCredentials{
    status: "ACTIVE" | "INACTIVE";
    
}

export interface ChangeDealerCategoryStatusResponse{
    data: DealerCategory;
}

export interface EditDealerCategoryCredentials{
   
    name: string;
    discountPct: number;
    suggestedCreditLimit: number;
    sortOrder: number;
}

export interface EditDealerCategoryResponse{
    data: DealerCategory;
}


export interface CreateCorrespondentCredentials {
  name: string;
  phone: string;
  email: string;
  userId?: string;
  region: string;
  locationId: string;
  responsibilities: string;
}

export interface Correspondent {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  region: string;
  location: StockEntryLocation;
  status: string;
  assignedAt: string;
  customerCount: number;
  dealerCount: number;
  responsibilities: string;
  userLinked: boolean;
}

export interface CorrespondentHistory {
  action: string;
  region: string;
  location: StockEntryLocation;
  effectiveFrom: string;
  note: string;
  performedBy: StockEntryUser;
  createdAt: string;
}

export interface CreateCorrespondentResponse {
  data: {
    correspondent: Correspondent;
    history: CorrespondentHistory[];
    affectedCustomers: number;
  };
}

export interface ListCorrespondentCredentials {
  q?: string;
  status?: string[];
  region?: string[];
  locationId?: string;
  userLinked?: boolean;
  hasCustomers?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

export interface ListCorrespondentResponse {
  data: Paged<Correspondent>;
}

export interface UpdateCorrespondentCredentials {
  name: string;
  phone: string;
  email: string;
  userId?: string;
  responsibilities: string;
}

export interface UpdateCorrespondentResponse {
  data: {
    correspondent: Correspondent;
    history: CorrespondentHistory[];
    affectedCustomers: number;
  };
}

export interface GetCorrespondentByIdResponse {
  data: {
    correspondent: Correspondent;
    history: CorrespondentHistory[];
    affectedCustomers: number;
  };
}


export interface Assign_ReassignCorrespondentCredentials {
  region: string;
  locationId: string;
  effectiveFrom: string;
  note: string;
}

export interface Assign_ReassignCorrespondentResponse {
  data: {
    correspondent: Correspondent;
    history: CorrespondentHistory[];
    affectedCustomers: number;
  };
}

export interface DeassignCorrespondentCredentials {
    effectiveFrom: string;
  note: string;
}


export type CustomerDealerType =
  | 'NO_CREDIT_WALKIN'
  | 'ORDINARY_CUSTOMER'
  | 'SPECIAL_CUSTOMER'
  | 'AUTHORISED_DEALER';

export interface CreateCustomerDealerCredentials {
  type: CustomerDealerType;
  name: string;
  contactPerson: string;
  phone: string;
  alternatePhone: string;
  email: string;
  tin: string;
  businessDescription: string;
  streetAddress: string;
  city: string;
  stateCode: string;
  lgaCode: string;
  locationId: string;
  correspondentId: string;
  dealerCategoryId: string;
  creditLimit: number;
  customerSince: string;
  userId?: string;
  customAttributes: Record<string, unknown>;
}

export interface CustomerDealerLocation {
  id: string;
  code: string;
  name: string;
}

export interface CustomerDealerCorrespondent {
  id: string;
  code: string;
  name: string;
  status: string;
}

export interface CustomerDealerCategory {
  id: string;
  name: string;
  discountPct: number;
}

interface Customer{

    id: string;
    code: string;
    type: string;
    isTemporary: boolean;
    name: string;
    contactPerson: string;
    phone: string;
    alternatePhone: string;
    email: string;
    tin: string;
    businessDescription: string;
    streetAddress: string;
    city: string;
    stateCode: string;
    stateName: string;
    lgaCode: string;
    lgaName: string;
    countryCode: string;
    location: CustomerDealerLocation;
    correspondent: CustomerDealerCorrespondent;
    dealerCategory: CustomerDealerCategory;
    creditLimit: number;
    walletBalance: number;
    depositBalance: number;
    lifetimeValue: number;
    lastPurchaseAt: string;
    customerSince: string;
    status: string;
    statusReason: string;
    user: StockEntryLocation;
    customAttributes: Record<string, unknown>;
    createdAt: string;

}
export interface CreateCustomerDealerResponse {
  data: Customer
}


export interface CustomerDealerFilterOption {
  value: string;
  label: string;
}

export interface CustomerDealerFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: CustomerDealerFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface CustomerDealerFilterCollection {
  key: string;
  label: string;
}

export interface CustomerDealerFilterSort {
  field: string;
  dir: string;
}

export interface CustomerFilterData {
  fields: CustomerDealerFilterField[];
  collections: CustomerDealerFilterCollection[];
  primaryDate: string;
  defaultSort: CustomerDealerFilterSort[];
  periodPresets: string[];
}

export interface CustomerFilterResponse {
  data: CustomerFilterData;
}

export interface CustomerListItem {
  id: string;
  code: string;
  type: CustomerDealerType;
  isTemporary: boolean;
  name: string;
  contactPerson: string;
  phone: string;
  stateCode: string;
  stateName: string;
  location: StockEntryLocation;
  correspondent: StockEntryLocation;
  dealerCategoryName: string;
  creditLimit: number;
  walletBalance: number;
  depositBalance: number;
  lifetimeValue: number;
  lastPurchaseAt: string;
  customerSince: string;
  status: string;
}

export interface CustomerListResponse {
  data: Paged<CustomerListItem>;
}

export interface UpdateCustomerCorrespondentCredentials {
  correspondentId: string;
}

export interface UpdateCustomerCorrespondentResponse {
  data: Customer;
}

export interface EditCustomerCredentials {
  name: string;
  contactPerson: string;
  phone: string;
  alternatePhone: string;
  email: string;
  tin: string;
  businessDescription: string;
  streetAddress: string;
  city: string;
  stateCode: string;
  lgaCode: string;
  locationId: string;
  correspondentId: string;
  creditLimit: number;
  userId?: string;
  customAttributes: Record<string, unknown>;
}

export interface EditCustomerResponse {
  data: Customer;
}

export interface CustomerDetailResponse {
  data: Customer;
}


type Status = 'ACTIVE' | 'WATCH'|'SUSPENDED';


export interface UpdateCustomerStatusCredentials {
  status: Status;
  reason: string;
}

export interface UpdateCustomerStatusResponse {
  data: Customer;
}
