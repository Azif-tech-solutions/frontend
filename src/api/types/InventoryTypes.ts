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