import { Paged } from '../config';
export interface ShowroomModel{
    id:string;
    code:string;
    name:string;
    streetAddress:string;
    city:string;
    stateCode:string;
    stateName:string;
    managerName:string;
    phone:string;
    dateOpened:string;
    vatRate:number;
    vatEnabled:boolean;
    status:string;
    areaCount:number;
}
export interface ListShowroomCredentials{
  q?:string;
  status?:string[];
  stateCode?:string[];
}

export interface ListShowroomResponse{
  data:{ 
    items:ShowroomModel[];
    stats: {
      active:number;
      pendingOpening:number;
      suspended:number;
    }
  }

}



export interface CreateShowroomCredentials{
  name:string;
  stateCode:string;
  streetAddress:string;
  city:string;
  phone:string;
  email:string;
  managerName:string|null;
  managerUserId:string|null;
  dateOpened:string;
  storageCapacity:string;
  operatingHours:string;
  active:boolean;
  createDefaultAreas:boolean;
}



export interface ShowroomManager {
  id: string;
  name: string;
  email: string;
}

export interface ShowroomArea {
  id: string;
  code: string;
  name: string;
  kind: string;
  status: string;
  unitsOnHand: number;
}

export interface ShowroomLocation {
  kind: string;
  id: string;
  visible$zifiq_backend: boolean;
  details$zifiq_backend: Record<string, unknown>;
  code: string;
  name: string;
  fields: Record<string, unknown>;
}

export interface CreateShowroomData {
  id: string;
  code: string;
  name: string;
  stateCode: string;
  stateName: string;
  streetAddress: string;
  city: string;
  phone: string;
  email: string;
  managerName: string;
  manager: ShowroomManager;
  dateOpened: string;
  storageCapacity: string;
  operatingHours: string;
  status: string;
  vatRate: number;
  vatEnabled: boolean;
  vatRegistrationNumber: string;
  areas: ShowroomArea[];
  defaultReceivingLocation: ShowroomLocation;
  defaultSellingLocation: ShowroomLocation;
  createdAt: string;
  warnings: string[];
}

export interface CreateShowroomResponse {
  data: CreateShowroomData;
}

export interface StatusChangeCredentials{
  status:"ACTIVE"|"PENDING"|"SUSPENDED";
  reason:string;
}

export interface StatusChangeResponse{
  data:ShowroomModel;
}



export interface AddAreaToShowRoomCredentials{
  kind:string;//Accpets QUARANTINE
  name:string;
}

export interface UpdateDefaultReceivingAndSellingAreas{
  defaultReceivingLocationId:string;
  defaultSellingLocationId:string;
}

export interface ShowroomLookupPickerWithAreasCredentials{
  q?:string;
  status?:string[];
}
export interface ShowroomLookupPickerWithAreasResponse{
  data:{id:string,code:string,label:string,
    status:string,
    areas:ShowroomArea[];
  }[];
}
export interface CreateDirectStockEntryLine {
  description: string;
  quantity: number;
  unitOfMeasureId: string;
  unitCost: number;
  inputVatRate: number;
  sellingPrice: number;
  dealerPrice: number;
  batchNo: string;
  expiryDate: string;
}

export interface CreateDirectStockEntryCredentials {
  locationId: string;
  intoLocationId: string;
  supplierId: string;
  supplierName: string;
  supplierInvoiceNo: string;
  paymentTerms: string;
  receivedDate: string;
  vatCategoryId: string;
  lines: CreateDirectStockEntryLine[];
}




export interface StockEntryLocation {
  kind: string;
  id: string;
  visible$zifiq_backend: boolean;
  details$zifiq_backend: Record<string, unknown>;
  code: string;
  name: string;
  fields: Record<string, unknown>;
}

export interface StockEntryUser {
  id: string;
  name: string;
  email: string;
}

export interface StockEntryLine {
  lineNo: number;
  stockItem: StockEntryLocation;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  lineCost: number;
  inputVatRate: number;
  inputVatAmount: number;
  sellingPrice: number;
  batchNo: string;
  expiryDate: string;
}

export interface CreateDirectStockEntryResponseData {
  id: string;
  ref: string;
  kind: string;
  location: StockEntryLocation;
  intoLocation: StockEntryLocation;
  supplier?: StockEntryLocation;
  manufacturer: StockEntryLocation;
  partnerName: string;
  partnerReference: string;
  paymentTerms: string;
  checkedBy: string;
  receivedDate: string;
  lines: StockEntryLine[];
  totalCost: number;
  totalInputVat: number;
  enteredBy: StockEntryUser;
  createdAt: string;
  costVisible: boolean;
  warnings: string[];
}

export interface CreateDirectStockEntryResponse {
  data: CreateDirectStockEntryResponseData;
}

export interface DirectEntryFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: unknown[];
  lookup: unknown | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface DirectEntryFilterSort {
  field: string;
  dir: string;
}

export interface DirectEntryFilterData {
  fields: DirectEntryFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: DirectEntryFilterSort[];
  periodPresets: string[];
}

export interface DirectEntryFilterResponse {
  data: DirectEntryFilterData;
}

export interface DirectEntryListItem {
  entryId: string;
  lineId: string;
  date: string;
  ref: string;
  kind: string;
  location: StockEntryLocation;
  stockItem: StockEntryLocation;
  product: string;
  party: string;
  partnerReference: string;
  batchNo: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  unitCost: number;
  lineCost: number;
  inputVatAmount: number;
  enteredBy: StockEntryUser;
}

export interface DirectEntryListResponse {
  data: Paged<DirectEntryListItem>;
}


export interface ReceiveRegisteredOutsourceProductsCredentials{
 
  locationId: string;
  intoLocationId: string;
  manufacturerId: string;
  // "manufacturerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  partnerReference: string;
  checkedBy: string;
  receivedDate: string;
  lines: 
    {
      stockItemId: string;
      quantity: number;
      inputVatRate: number;
      batchNo: string;
      expiryDate: string;
    }[]
}

export interface ReceiveRegisteredOutsourceProductsResponse{
  data: CreateDirectStockEntryResponseData;
}


export interface OutsourceReceiptFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: unknown[];
  lookup: unknown | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface OutsourceReceiptFilterSort {
  field: string;
  dir: string;
}

export interface OutsourceReceiptFilterData {
  fields: OutsourceReceiptFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: OutsourceReceiptFilterSort[];
  periodPresets: string[];
}

export interface OutsourceReceiptFilterResponse {
  data: OutsourceReceiptFilterData;
}

export interface OutsourceReceiptListResponse{
  data:Paged<DirectEntryListItem>
}






export interface ShowroomTransferFilterOption {
  value: string;
  label: string;
}

export interface ShowroomTransferFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: ShowroomTransferFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface ShowroomTransferFilterSort {
  field: string;
  dir: string;
}

export interface ShowroomTransferFilterData {
  fields: ShowroomTransferFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: ShowroomTransferFilterSort[];
  periodPresets: string[];
}

export interface ShowroomTransferFilterResponse {
  data: ShowroomTransferFilterData;
}


export interface ShowroomTransferListItem {
  transfer: StockEntryLocation;
  lineId: string;
  date: string;
  source: string;
  sourceType: string;
  destination: string;
  destinationType: string;
  route: string;
  driver: string;
  vehicle: string;
  productCode: string;
  product: string;
  qtySent: number;
  qtyReceived: number;
  qtyRejected: number;
  unit: string;
  receivedDate: string;
  status: string;
}

export interface ShowroomTransferListResponse {
  data: Paged<ShowroomTransferListItem>;
}



export type ShowroomReturnType = 'DEALER' | 'NON_DEALER';

export interface ShowroomReturnWalkIn {
  name: string;
  phone: string;
}

export interface ShowroomReturnLineCredentials {
  stockItemId: string;
  quantity: number;
  reason: string;
  condition: string;
  intoLocationId: string;
  note: string;
}

export interface RecordShowroomReturnCredentials {
  returnType: ShowroomReturnType;
  locationId: string;
  customerId: string;
  walkIn?: ShowroomReturnWalkIn;
  originalDocumentRef: string;
  returnDate: string;
  note: string;
  lines: ShowroomReturnLineCredentials[];
}

export interface ShowroomReturnShowroom {
  id: string;
  code: string;
  name: string;
  type: string;
  temporary: boolean;
}

export interface ShowroomReturnLine {
  lineNo: number;
  stockItem: StockEntryLocation;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineValue: number;
  reason: string;
  condition: string;
  intoLocation: StockEntryLocation;
  note: string;
}

export interface RecordShowroomReturnResponseData {
  id: string;
  ref: string;
  returnType: string;
  location: StockEntryLocation;
  customer: ShowroomReturnShowroom;
  originalDocumentRef: string;
  returnDate: string;
  note: string;
  lines: ShowroomReturnLine[];
  totalValue: number;
  writeOffValue: number;
  walletBalanceBefore: number;
  walletCredit: number;
  walletBalanceAfter: number;
  status: string;
  reversedReason: string;
  reversedAt: string;
  processedBy: StockEntryUser;
  createdAt: string;
}

export interface RecordShowroomReturnResponse {
  data: RecordShowroomReturnResponseData;
}







export interface CustomerReturnFilterOption {
  value: string;
  label: string;
}

export interface CustomerReturnFilterField {
  key: string;
  label: string;
  type: string;
  operators: string[];
  options: CustomerReturnFilterOption[];
  lookup: string | null;
  facetable: boolean;
  sortable: boolean;
  qualifierAliases: string[];
}

export interface CustomerReturnFilterSort {
  field: string;
  dir: string;
}

export interface CustomerReturnFilterData {
  fields: CustomerReturnFilterField[];
  collections: unknown[];
  primaryDate: string;
  defaultSort: CustomerReturnFilterSort[];
  periodPresets: string[];
}

export interface CustomerReturnFilterResponse {
  data: CustomerReturnFilterData;
}



export interface CustomerReturnListItem {
  returnId: string;
  lineId: string;
  date: string;
  ref: string;
  returnType: string;
  originalDocumentRef: string;
  customer: StockEntryLocation;
  customerCode: string;
  customerName: string;
  customerType: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineValue: number;
  reason: string;
  condition: string;
  location: StockEntryLocation;
  creditedTo: string;
  status: string;
}

export interface CustomerReturnListResponse {
  data: Paged<CustomerReturnListItem>;
}