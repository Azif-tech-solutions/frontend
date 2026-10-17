//inventory type.ts
import { Paged } from "../config";

export type ItemTypes = "FINISHED_PRODUCT" | "RAW_MATERIAL"



export interface StockItemLocation {
  id: string;
  code: string;
  name: string;
  type: string;
}

export interface StockItemCategory {
  id: string;
  name: string;
  type: string;
}

export interface StockItemUnitOfMeasure {
  id: string;
  code: string;
  name: string;
  symbol: string;
}

export interface StockItemVatCategory {
  id: string;
  code: string;
  name: string;
  rate: number;
}

export interface StockItemSection {
  id: string;
  code: string;
  name: string;
}

export interface StockItemResponse {
  id: string;
  location: StockItemLocation;
  itemType: ItemTypes;
  code: string;
  name: string;
  category?: StockItemCategory;
  brand: string;
  unitOfMeasure: StockItemUnitOfMeasure;
  reorderLevel: number;
  barcode: string;
  landingCost: number;
  markupCost: number;
  vatCategory: StockItemVatCategory;
  hsnSection: StockItemSection;
  isicSection: StockItemSection;
  status: string;
  createdAt: string;
  quantityOnHand: number;
}


export interface CreateStokeItemResponse{
    data: StockItem;
}

export interface ListStokeItemRespsonse {
  data: Paged<StockItemResponse>;
}

export interface refillFinishedProductsCredentials {
  locationId: string;
  stockItemId: string;
  quantity: number;
  note: string;
}


// in InventoryTypes.ts
export interface refillFinishedProductsResponseData {
  ref: string;
  stockItemId: string;
  quantity: number;
  performedBy: {
    id: string;
    name: string;
    email: string;
  };
  at: string;
}

export interface refillFinishedProductsResponse {
  data: refillFinishedProductsResponseData;
}

export interface refillRawMaterialsCredentials {
  locationId: string;
  stockItemId: string;
  quantity: number;
  note: string;
}


export interface refillFinishedProductsResponseData {
    ref: string;
    stockItemId : string;
    quantity: number;
    performedBy: string;
    at: string;
  
}

export interface refillFinishedProductsResponse {
  data: refillFinishedProductsResponseData;
}


export interface refillRawMaterialsCredentials {
  locationId: string;

  stockItemId: string;
  supplierId: string;
  manufacturerId:string;
  quantity: number;
  unitCost:number;
  manufacturedDate:string;
  expiryDate:string;
  note: string;
}

export interface refillRawMaterialsResponseData {
    
    id: string;
    ref: string;
    stockItemId: string;
    supplierId: string;
    manufacturerId: string;
    quantity: number;
    unitCost: number; 
    manufacturedDate: string;
    expiryDate: string;
    verifiedByUserId: string;
    offloadedAt: string;
    condition: string;  
  
  
}

export interface refillRawMaterialsResponse {
  data: refillRawMaterialsResponseData;
}

export interface driver{
  
      id?: string;
      name: string;
      phone: string;
      vehicleNumber: string;
      licenceNumber: string;
      status?: string;
      createdAt?: string;

}

export interface driverResponse{
  data: driver;
}

export interface listDriverResponse{
  data: Paged<driver>;
}

interface stockTransferLineItem{
  stockItemId: string;
  quantity: number;
  unitPrice: number;
  fromLocationId: string;
  batchNo: string;
}
export interface createStockTransferCredentials{
  
  sourceLocationId: string;
  destinationLocationId: string;
  driverId: string;
  driverName: string;
  driverVehicle: string;
  transferDate: string;
  lines: stockTransferLineItem[]
    


}

export interface CreateStockTransferResponse {
  data: StockTransferResponseData;
}

export interface quantityAdjustmentCredentials {
  locationId: string;
  stockItemId: string;
  mode: "DELTA" | "COUNTED";
  direction: "NEGATIVE" | "POSITIVE";
  quantity: number;
  countedQuantity?: number;
  reason:
    | "DAMAGED_BROKEN"
    | "OTHER"
    | "MISCOUNT_CORRECTION"
    | "EXPIRED_WRITEOFF"
    | "UNRECORDED_RETURN"
    | "SUSPECTED_THEFT"
    | "STOCKTAKE_VARIANCE";
  note: string;
  otpChallengeId: string | null;
}

export interface LiveQuantityAdjustmentResponseData {
  id: string;
  ref: string;
  locationId: string;
  locationName: string;
  rootLocationName: string;
  stockItemId: string;
  productCode: string;
  productName: string;
  unit: string;
  mode: string;
  direction: string;
  quantity: number;
  recordedQuantity: number;
  newQuantity: number;
  reason: string;
  note: string;
  otpVerified: boolean;
  performedBy: string;
  performedByName: string;
  at: string;
}


export interface LiveQuantityAdjustmentResponse {
  data: LiveQuantityAdjustmentResponseData;
}





export interface groupCardFilterCredentials {
  groupBy: "CATEGORY";
  groupId: string;
  locationId?: string;
  from?: string; // date
  to?: string;   // date
  page?: number;
  size?: number;
  q?: string;
}

export interface StockLedgerMember {
  stockItem: {
    id: string;
    code: string;
    name: string;
    itemType: string;
  };
  unit: string;
}

export interface StockLedgerHeader {
  groupType: string;
  group: {
    id: string;
    name: string;
    type: string;
  };
  members: StockLedgerMember[];
  memberCount: number;
  openingBalance: number;
  totalReceived: number;
  totalIssued: number;
  closingBalance: number;
}

export interface StockLedgerRow {
  sn: number;
  date: string;
  itemCode: string;
  itemName: string;
  locationName: string;
  remark: string;
  qtyIn: number;
  qtyOut: number;
  qtyRemain: number;
}

export interface StockLedgerResponseData {
  header: StockLedgerHeader;
  rows: Paged<StockLedgerRow>;   // was StockLedgerRow[]
}

export interface StockLedgerResponse {
  data: StockLedgerResponseData;
}


export interface StockBinLedgerMember {
  stockItem: {
    id: string;
    code: string;
    name: string;
    itemType: string;
  };
  unit: string;
}

export interface StockBinLedgerHeader {
  groupType: string;
  group: {
    id: string;
    name: string;
    type: string;
  };
  members: StockBinLedgerMember[];
  memberCount: number;
  openingBalance: number;
  totalReceived: number;
  totalIssued: number;
  closingBalance: number;
}

export interface StockBinLedgerRow {
  sn: number;
  date: string;
  qtyIn: number;
  qtyOut: number;
  balance: number;
}

export interface StockBinLedgerResponseData {
  header: StockBinLedgerHeader;
  rows: Paged<StockBinLedgerRow>;   // was StockBinLedgerRow[]
}

export interface StockBinLedgerResponse {
  data: StockBinLedgerResponseData;
}
export interface StockAndGroupBinCardFilterCredentials {
  locationId: string;
  includeAreas: boolean; // default to true
  from?: string;
  to?: string;
  page?: number;
  size?: number;
  q?: string;
}

export interface StockLedgerCardSingleProductResponseData {
  sn: number;
  date: string;
  remark: string;
  qtyIn: number;
  qtyOut: number;
  runningBalance: number;
}

export interface StockLedgerCardSingleProductResponse {
  data: Paged<StockLedgerCardSingleProductResponseData>;
}

export interface BinLedgerSingleProductResponseData {
  sn: number;
  date: string;
  qtyIn: number;
  qtyOut: number;
  balance: number;
}

export interface BinLedgerSingleProductResponse {
  data: Paged<BinLedgerSingleProductResponseData>;
}


// ── Stock transfers ──────────────────────────────────────────────
export interface listStockTransferFilterCredentials {
  locationId: string;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface StockTransferResponseLine {
  id: string;
  stockItem: {
    id: string;
    code: string;
    name: string;
    itemType: string;
  };
  unit: string;
  qtySent: number;
  qtyReceived: number | null;
  qtyRejected: number | null;
  outstanding: number;
  fromLocation: unknown;
  receivedIntoLocation: unknown;
  batchNo: string | null;
  rejectionNote: string | null;
}

export interface StockTransferResponseData {
  id: string;
  waybillRef: string;
  sourceLocation: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  destinationLocation: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  status: string;
  driver: {
    id: string;
    name: string;
    phone: string;
  };
  driverVehicle: string;
  transferDate: string;
  dispatchedAt: string;
  receivedDate: string | null;
  receivedAt: string | null;
  receiptNote: string | null;
  totalSent: number;
  totalRejected: number;
  waybillUrl: string;
  lines: StockTransferResponseLine[];
}

export interface listStockTransferResponse {
  data: Paged<StockTransferResponseData>;
}

// ── Movement report ──────────────────────────────────────────────
export interface movementReportFilterCredentials {
  locationId: string;
  stockItemId?: string;
  sourceType?: "TRANSFER_OUT" | "REFILL" | "QUANTITY_ADJUSTMENT";
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface movementReportResponseData {
  sn: number;
  date: string;
  location: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  stockItem: {
    id: string;
    code: string;
    name: string;
    itemType: string;
  };
  sourceType: string;
  sourceReference: string;
  qtyIn: number;
  qtyOut: number;
}

export interface movementReportResponse {
  data: Paged<movementReportResponseData>;
}


