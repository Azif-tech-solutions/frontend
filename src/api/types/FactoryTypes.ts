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


// Important: Your