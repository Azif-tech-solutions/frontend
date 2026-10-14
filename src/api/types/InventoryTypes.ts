//inventory type.ts

export type ItemTypes = "FINISHED_PRODUCT" | "RAW_MATERIAL"

export interface StockItem {
  id?: string;//returned upon creation
  locationId: string;
  itemType: ItemTypes;
  code: string;
  name: string;
  categoryId: string;
  brand: string;
  unitOfMeasureId: string;
  reorderLevel: number;
  barcode: string;
  quantity?:number;
  landingCost: number;
  markupCost: number;
  vatCategoryId: string;
  hsnSectionId: string;
  isicSectionId: string;
  status?: string;//returned upon creation
  createdAt?: string;//returned upon creation
}


export interface CreateStokeItemResponse{
    data: StockItem;
}

export interface ListStokeItemRespsonse{
  data:StockItem
}

export interface refillFinishedProductsCredentials {
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
  data: driver[];
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

export interface StockTransferResponseLine {
  id: string;
  stockItemId: string;
  stockItemCode: string;
  stockItemName: string;
  unit: string;
  qtySent: number;
  qtyReceived: number;
  qtyRejected: number;
  outstanding: number;
  fromLocationId: string;
  fromLocationName: string;
  receivedIntoLocationId: string;
  receivedIntoLocationName: string;
  batchNo: string;
  rejectionNote: string;
}

export interface StockTransferResponseData {
  id: string;
  waybillRef: string;
  sourceLocationId: string;
  sourceLocationName: string;
  sourceLocationType: string;
  destinationLocationId: string;
  destinationLocationName: string;
  destinationLocationType: string;
  status: string;
  driverId: string;
  driverName: string;
  driverVehicle: string;
  transferDate: string;
  dispatchedAt: string;
  receivedDate: string;
  receivedAt: string;
  receiptNote: string;
  totalSent: number;
  totalRejected: number;
  waybillUrl: string;
  lines: StockTransferResponseLine[];
}

export interface CreateStockTransferResponse {
  data: StockTransferResponseData;
}

export interface listStockTransferFilterCredentials {
  locationId: string;
  q?: string;
  // sourceType?: "TRANSFER_OUT" | "REFILL" | "QUANTITY_ADJUSTMENT";
   from?:string;//date
  to?:string;//date
}
export interface listStockTransferResponse {
  data: StockTransferResponseData[];
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

export interface movementReportFilterCredentials {
  locationId: string;
  stockItemId?: string;
  sourceType?: "TRANSFER_OUT" | "REFILL" | "QUANTITY_ADJUSTMENT";
   from?:string;//date
  to?:string;//date
}

export interface movementReportResponseData {
  
      sn: number;
      date: string;
      locationId: string;
      stockItemId: string;
      itemCode: string;
      itemName: string;
      sourceType: string;
      sourceReference: string;
      qtyIn: number;
      qtyOut: number; 
    
}
export interface movementReportResponse {
  data: movementReportResponseData[];
}


export interface groupCardFilterCredentials{
  groupBy:"CATEGORY";
  groupId: string;
  locationId?: string;
  from?:string;//date
  to?:string;//date
}

export interface StockLedgerMember {
  stockItemId: string;
  code: string;
  name: string;
  unit: string;
}

export interface StockLedgerHeader {
  groupType: string;
  groupId: string;
  groupName: string;
  members: StockLedgerMember[];
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
  rows: StockLedgerRow[];
}

export interface StockLedgerResponse {
  data: StockLedgerResponseData;
}



export interface StockBinLedgerMember {
  stockItemId: string;
  code: string;
  name: string;
  unit: string;
}

export interface StockBinLedgerHeader {
  groupType: string;
  groupId: string;
  groupName: string;
  members: StockBinLedgerMember[];
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
  rows: StockBinLedgerRow[];
}

export interface StockBinLedgerResponse {
  data: StockBinLedgerResponseData;
}


export interface StockAndGroupBinCardFilterCredentials{

  locationId: string;
  includeAreas: boolean;//default to true

  from?:string;//date
  to?:string;//date

}

export interface StockLedgerCardSingleProductResponseData{
sn: number;
      date: string;
      remark: string;
      qtyIn: number;
      qtyOut: number;
      runningBalance: number;
}

export interface StockLedgerCardSingleProductResponse {
  data: StockLedgerCardSingleProductResponseData[];
}


export interface BinLedgerSingleProductResponseData{
 
      sn: number;
      date: string;
      qtyIn: number;
      qtyOut: number;
      balance: number;
    
}
export interface BinLedgerSingleProductResponse {
  data: BinLedgerSingleProductResponseData[];
}
