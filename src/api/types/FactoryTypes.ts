/* ------------------------------------------------------------------ */
/*  FactoryApi  Types                                                  */
/* ------------------------------------------------------------------ */
import { StockItemLocation,StockItemUnitOfMeasure } from './InventoryTypes';
import { Paged } from '../config';
export interface CreateFactoryCredentials {
  code:string;
  name:string;
  address:string;
  state: string;
  phone: string;
  vatRate: number;
  vatEnabled: boolean;
  vatRegistrationNumber: string;
}


export interface FactoryProfile {
    id:string;
     code:string;
  name:string;
  address:string;
  state: string;
  phone: string;
  managerUserId: string;
  vatRate: number;
  vatEnabled: boolean;
  vatRegistrationNumber: string;
  status: string;
}

export interface CreateFactoryResponse{
    data:FactoryProfile;
}

export interface ListFactoryResponse{
    data:FactoryProfile[];
}

export interface CreateSupplierCredentials {
  id?:string;
  supplierCode:string;
  companyName:string;
  contactEmail:string;
  phone:string;
  // email:string;
  // supplies:string;
}

export interface CreateSupplierResponse{
  data:CreateSupplierCredentials;
}

export interface ListSupplierResponse{
  data:CreateSupplierCredentials[];
}

export interface CreateManufacturerCredentials {
  id?:string;
  manufacturerCode:string;
  name:string;
  country:string;
  contactEmail:string;
  phone:string;
  produces:string;
  status?:string //ACTIVE ,PENDING OR SUSPENDED
}
export interface CreateManufacturerResponse{
  data:CreateManufacturerCredentials;
}

export interface ListManufacturerResponse{
  data:CreateManufacturerCredentials[];
}

export interface CreateUnitCredentials {
  id?:string;
  unitCode:string;
  unitName:string;
  symbol:string;
  
}
export interface CreateUnitResponse{
  data:CreateUnitCredentials;
}
export interface ListUnitResponse{
  data:CreateUnitCredentials[];
}

export interface CreateCategoryCredentials {
  id?:string;
  name:string;
  type:string;
  description:string;
}
export interface CreateCategoryResponse{
  data:CreateCategoryCredentials;
}
export interface ListCategoryResponse{
  data:CreateCategoryCredentials[];
}

export type RecipeSourcing =
  | "DIRECT_IMPORTATION"
  | "IN_HOUSE_PRODUCTION";

export interface RecipeIngredient {
  rawMaterialStockItemId: string;
  quantity: number;
  unitId: string;
}

export interface CreateRecipeCredentials {
  locationId: string;
  code: string;
  name: string;
  description: string;
  sourcing: RecipeSourcing;
  yieldQty: number;
  yieldUnitId: string;
  shelfLifeDays: number;
  reorderLevel: number;
  ingredients: RecipeIngredient[];
}

export interface RecipeResponseIngredient {
  rawMaterialStockItem: {
    id: string;
    code: string;
    name: string;
    itemType: string;
  };
  quantity: number;
  unit: StockItemUnitOfMeasure;
}

export interface RecipeResponseData {
  id: string;
  code: string;
  name: string;
  location: StockItemLocation;
  sourcing: RecipeSourcing;
  yieldQty: number;
  yieldUnit: StockItemUnitOfMeasure;
  status: string;
  ingredients: RecipeResponseIngredient[];
}

export interface CreateRecipeResponse {
  data: RecipeResponseData;
}

export interface ListRecipesCredentrials {
  status?:string;
  locationId?:string;
  page: number;

  size: number;
}
export interface ListRecipesResponse {
  data: Paged<RecipeResponseData>;
}

export interface CreateSpecialClientCredentials{
  id?:string;//returned from server once created
  name:string;
  terms:string;
  // conditions:string;
}

export interface CreateSpecialClientResponse{
  data:CreateSpecialClientCredentials;
}


export interface CreateSpecialProductionRunCredentials {
  locationId: string;
  clientId: string;
  targetStockItemId: string;
  productDescription: string;
  quantity: number;
  unitId: string;
  unitCost: number;
  price: number;
  materials: {
    stockItemId: string;
    quantity: number;
  }[];
}

export interface CreateSpecialProductionRunResponseData {
  id: string;
  orderRef: string;
  batchRef: string;
  client: {
    kind: string;
    id: string;
    "details$zifiq_backend": {
      [key: string]: unknown;
    };
    "visible$zifiq_backend": boolean;
    code: string;
    name: string;
    fields: {
      [key: string]: unknown;
    };
  };
  quantity: number;
  price: number;
  status: string;
}

export interface CreateSpecialProductionRunResponse {
  data: CreateSpecialProductionRunResponseData;
}

export interface ListSpecialProductionRunResponse {
  data: Paged<CreateSpecialProductionRunResponseData>;
}
export interface UpdateSpecialProdctionRunStatusCredentials {
  
  status: string///ACTIVE ,PENDING OR DELIVERED
}

export interface UpdateSpecialProdctionRunStatusResponse {
  data: CreateSpecialProductionRunResponseData;
}

export interface ListSpecialProductionRunsCredentials {
  clientId?:string;
  locationId?:string;
  page: number;

  size: number;
}


export interface CreateProductionCostCalculatorCredentials {
  locationId: string;
  targetStockItemId: string;
  recipeId: string;
  batchSizeQty: number;
  materials: {
    stockItemId: string;
    quantity: number;
  }[];
  overheads: {
    label: string;
    amount: number;
  }[];
}

export interface CreateProductionCostCalculatorResponseData {
  id: string;
  targetStockItem: {
    kind: string;
    id: string;
    "details$zifiq_backend": {
      [key: string]: unknown;
    };
    "visible$zifiq_backend": boolean;
    code: string;
    name: string;
    fields: {
      [key: string]: unknown;
    };
  };
  batchSizeQty: number;
  status: string;
  computedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateProductionCostCalculatorResponse {
  data: CreateProductionCostCalculatorResponseData;
}

export interface ProductionRunTargetStockItem {
  kind: string;
  id: string;
  "details$zifiq_backend": {
    [key: string]: unknown;
  };
  "visible$zifiq_backend": boolean;
  code: string;
  name: string;
  fields: {
    [key: string]: unknown;
  };
}

export interface ProductionRunResponseData {
  batchRef: string;
  targetStockItem: ProductionRunTargetStockItem;
  quantityProduced: number;
  unitLandingCost: number;
  totalLandingCost: number;
  runAt: string;
}

export interface ListProductionRunCredentials {
  locationId?: string;
  from?: string;
  to?: string;
  page: number;
  size: number;
}

export interface ListProductionRunResponse {
  data: Paged<ProductionRunResponseData>;
}

export interface ListProductionTotalCostCredetials{
  recipeIds:string[];

}

export interface ListProductionTotalCostResponseData{
  recipe:{
    id:string;
    code:string;
    name:string;
    // itemType:string;
  };
  qtyUsed:number;
  totalCost:number;
}
export interface ListProductionTotalCostResponse{
  data:ListProductionTotalCostResponseData[];
}

export interface CreateTradeOfferCredentials{
  fromLocationId: string;
  toLocationId: string;
  stockItemId: string;
  quantity: number; 
  reason: string;
  expiresAt: string;
}

interface TradeOffer{
  id:string;
  fromLocationId:StockItemLocation;
  toLocationId:StockItemLocation;
  stockItemId:{
    id:string;
    code:string;
    name:string;
    // itemType:string;
  };
  quantity:number;
  reason:string;
  status:string;
  offeredAt:string;
  // acceptedAt:string;
  expiresAt:string;
}
export interface CreateTradeOfferResponse{
  data:TradeOffer;
}

export interface TradeOfferRespondCredentials{
  // id:string;
  decistion:"ACCEPTED"|"REJECTED";
}

export interface TradeOfferRespondResponse{
  data:TradeOffer;
}

export interface ListTradeOfferCredentials{
  locationId?:string;
  status?:"PENDING"|"ACCEPTED"|"REJECTED";
  page: number;
  size: number;
}



export interface ListTradeOfferResponse{
  data: Paged<TradeOffer>;
}
// Important: Your
// Important: Your