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