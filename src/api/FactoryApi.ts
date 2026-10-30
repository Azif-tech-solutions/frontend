//Factory.ts
import { BaseApi } from "./config.ts";
import { CreateCategoryCredentials, CreateCategoryResponse, ListCategoryResponse } from "./types/FactoryTypes.ts";
import {CreateManufacturerCredentials,CreateManufacturerResponse,ListManufacturerResponse,CreateUnitCredentials,CreateUnitResponse,ListUnitResponse} from "./types/FactoryTypes.ts";
import { CreateFactoryCredentials, CreateFactoryResponse,ListFactoryResponse,CreateSupplierCredentials,CreateSupplierResponse,ListSupplierResponse,CreateRecipeCredentials } from "./types/FactoryTypes.ts";
import {ListRecipesCredentrials,ListRecipesResponse } from "./types/FactoryTypes.ts";
import {ListProductionRunCredentials,ListProductionRunResponse} from "./types/FactoryTypes.ts";
import { CreateRecipeResponse } from "./types/FactoryTypes.ts";
import { CreateProductionCostCalculatorCredentials,CreateProductionCostCalculatorResponse,ListProductionTotalCostCredetials,ListProductionTotalCostResponse } from "./types/FactoryTypes.ts";
import { CreateSpecialClientCredentials,CreateSpecialClientResponse,CreateSpecialProductionRunCredentials,CreateSpecialProductionRunResponse } from "./types/FactoryTypes.ts";
import { ListSpecialProductionRunResponse,UpdateSpecialProdctionRunStatusCredentials,UpdateSpecialProdctionRunStatusResponse,ListSpecialProductionRunsCredentials } from "./types/FactoryTypes.ts";
import { TradeOfferRespondResponse,ListTradeOfferResponse,TradeOfferRespondCredentials,ListTradeOfferCredentials } from "./types/FactoryTypes.ts";
import { CreateTradeOfferCredentials,CreateTradeOfferResponse } from "./types/FactoryTypes.ts";
// import { Paged } from "../config";
/** Factory-related endpoints. Only the endpoint-specific logic lives here. */
export default class FactoryApi extends BaseApi {
  constructor() {
    
    super({ resource: "factory" });
  }

     toStoreFactory(f:any) {
        return {
            ...f,
            id: f.id ?? f.code,
            createdAt: f.createdAt ?? Date.now(),
        };
    }
    toStoreCategory(f:CreateCategoryCredentials) {
        return {
            ...f,
            id: f.id,
            createdAt: Date.now(),
        };
    }

    toStoreSupplier(s: any) {
  return {
    id: s.id ?? s.supplierCode, // the API may not return an id, so the code doubles as one
    name: s.companyName,
    code: s.supplierCode,
    email: s.contactEmail,
    phone: s.phone,
    status: 'Active',
    createdAt: s.createdAt ?? Date.now(),
    // contact, address and supplies are left out on purpose: the backend
    // doesn't hold them, so there is nothing to convert.
  }}
  

   toStoreManufacturer(m: CreateManufacturerCredentials) {
  return {
    id: m.id ?? m.manufacturerCode, // the API may not return an id, so the code doubles as one
    name: m.name,
    contact:"",
    code: m.manufacturerCode,
    email: m.contactEmail,
    country:m.country,
    phone: m.phone,
    produces:m.produces,
    status: m.status,
    createdAt: Date.now(),
    // contact, address and supplies are left out on purpose: the backend
    // doesn't hold them, so there is nothing to convert.
  }
  }

  toStoreUnit(m: CreateUnitCredentials) {
    console.log(m)
  return {
    id: m.id ?? m.unitCode, 
    name: m.unitName,
    
    code: m.unitCode,
    symbol: m.symbol,
    createdAt: Date.now(),
    
    
  }
  }


  /** POST <backend>/v1/auth/login */
  async createFactory(credentials: CreateFactoryCredentials) {
    const data = await this.request<CreateFactoryResponse>("setup/factories", {
      method: "POST",
      body: credentials,
      auth: true,
    });
    // // console.log(`THis is the accessToken: ${data.data.accessToken}`)
    // // console.log(`THis is the refreshToken: ${data.data.refreshToken}`)
    
    // this.storeTokens(data.data.accessToken, data.data.refreshToken);
    // // console.log(data)
    return data;

  }

  async listFactories() {
    const data = await this.request<ListFactoryResponse>("setup/factories", {
      method: "GET",
      auth: true,
    });
    return data;
  }

  async updateFactory(id: string, credentials: CreateFactoryCredentials) {
    const data = await this.request<CreateFactoryResponse>(`setup/factories/${id}`, {
      method: "PUT",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async createSupplier(credentials: CreateSupplierCredentials) {
    const data = await this.request<CreateSupplierResponse>("setup/suppliers", {
      method: "POST",
      body: credentials,
      auth: true,
    });
    return data;
  }
  async listSuppliers() {
    const data = await this.request<ListSupplierResponse>("setup/suppliers", {
      method: "GET",
      auth: true,
    });
    return data;
  }

  
 

 async createManufacturer(credentials: CreateManufacturerCredentials) {
    const data = await this.request<CreateManufacturerResponse>("setup/manufacturers", {
      method: "POST",
      body: credentials,
      auth: true,
    });
    return data;
  }
  
  async listManufacturers() {
    const data = await this.request<ListManufacturerResponse>("setup/manufacturers", {
      method: "GET",
      auth: true,
    });
    return data;
  }

  async createUnit(credentials: CreateUnitCredentials) {
    const data = await this.request<CreateUnitResponse>("setup/units", {
      method: "POST",
      body: credentials,
      auth: true,
    });
    return data;
  }
  async listUnits() {
    const data = await this.request<ListUnitResponse>("setup/units", {
      method: "GET",
      auth: true,
    });
    return data;
  }
  async createCategory(credentials: CreateCategoryCredentials) {
    const data = await this.request<CreateCategoryResponse>("setup/categories", {
      method: "POST",
      body: credentials,
      auth: true,
    });
    return data;
  }
  async listCategories() {
    const data = await this.request<ListCategoryResponse>("setup/categories", {
      method: "GET",
      auth: true,
    });
    return data;
  }
  // add CreateRecipeResponse to the existing InventoryTypes import
async createRecipe(d: CreateRecipeCredentials) {
  const data = await this.request<CreateRecipeResponse>("/recipes", {
    method: "POST",
    auth: true,
    body: d,
  });
  return data;
}

async listRecipes(credentials: ListRecipesCredentrials) {
  const data = await this.request<ListRecipesResponse>("/recipes", {
    method: "GET",
    auth: true,
    query: credentials,
  });
  return data;
}

async createSpecialClient(credentials: CreateSpecialClientCredentials) {
  const data = await this.request<CreateSpecialClientResponse>("/special-production/clients", {
    method: "POST",
    auth: true,
    body: credentials,
  });
  return data;
}

async createSpecialProductionRun(credentials: CreateSpecialProductionRunCredentials) {
  const data = await this.request<CreateSpecialProductionRunResponse>("/special-production/runs", {
    method: "POST",
    auth: true,
    body: credentials,
  });
  return data;
}

async updateSpecialProductionRunStatus(id: string, credentials: UpdateSpecialProdctionRunStatusCredentials) {
  const data = await this.request<UpdateSpecialProdctionRunStatusResponse>(`/special-production/runs/${id}/status`, {
    method: "PUT",
    auth: true,
    body: credentials,
  });
  return data;

}

async listSpecialProductionRuns(query: ListSpecialProductionRunsCredentials) {
  const data = await this.request<ListSpecialProductionRunResponse>("/special-production/runs", {
    method: "GET",
    auth: true,
    query: query,
  });
  return data;
}

async createProductionCostCalculator(credentials: CreateProductionCostCalculatorCredentials) {
  const data = await this.request<CreateProductionCostCalculatorResponse>("/production/cost-calculator", {
    method: "POST",
    auth: true,
    body: credentials,
  });
  return data;
}
async listProductionCostRuns(query: ListProductionRunCredentials) {
  const data = await this.request<ListProductionRunResponse>("/production/runs", {
    method: "GET",
    auth: true,
    query: query,
  });
  return data;
}

async listProductionTotalCost(query: ListProductionTotalCostCredetials) {
  // The backend wants recipeIds repeated: ?recipeIds=a&recipeIds=b
  const params = new URLSearchParams();
  query.recipeIds.forEach((id) => params.append("recipeIds", id));

  const data = await this.request<ListProductionTotalCostResponse>(
    `/production/total-cost?${params.toString()}`,
    {
      method: "GET",
      auth: true,
    }
  );
  return data;
}

async createTradeOffer(d: CreateTradeOfferCredentials) {
    const data = await this.request<CreateTradeOfferResponse>("/trades/offer", {
      method: "POST",
      auth: true,
      body: d,
    });
    return data;
  }

  async tradeOfferResponse(id: string,body:TradeOfferRespondCredentials) {
    const data = await this.request<TradeOfferRespondResponse>(`/trades/${id}/respond`, {
      method: "POST",
      auth: true,
      body,
    });
    return data;
  }

  async listTradeOffers(d:ListTradeOfferCredentials) {
    const data = await this.request<ListTradeOfferResponse>("/trades", {
      method: "GET",
      auth: true,
      query: d,
    });
    return data;
  }
}