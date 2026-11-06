//CustomerApi.ts


import { BaseApi } from "./config.ts";
import { ListDealerCategoryResponse, ChangeDealerCategoryStatusResponse, EditDealerCategoryResponse, EditDealerCategoryCredentials, UpdateCustomerCorrespondentCredentials, UpdateCustomerCorrespondentResponse, CreateCustomerDealerCredentials, CreateCustomerDealerResponse } from "./types/CustomerTypes.ts";
import { CreateDealerCategoryResponse, CreateDealerCategoryCredentials } from "./types/CustomerTypes.ts";
import { CustomerDetailResponse, CustomerListResponse } from "./types/CustomerTypes.ts";
import { UpdateCustomerStatusCredentials, UpdateCustomerStatusResponse } from "./types/CustomerTypes.ts";
import { EditCustomerCredentials, EditCustomerResponse } from "./types/CustomerTypes.ts";
import { Assign_ReassignCorrespondentCredentials, Assign_ReassignCorrespondentResponse,DeassignCorrespondentCredentials } from "./types/CustomerTypes.ts";
import { GetCorrespondentByIdResponse, UpdateCorrespondentCredentials, UpdateCorrespondentResponse, ListCorrespondentCredentials, ListCorrespondentResponse,CreateCorrespondentCredentials,CreateCorrespondentResponse } from "./types/CustomerTypes.ts";
/** Customer-related endpoints. Only the endpoint-specific logic lives here. */

export default class CustomerApi extends BaseApi {
  constructor() {
    
    super({ resource: "customers" });
  }

 async listDealerCategories() {
     const data = await this.request<ListDealerCategoryResponse>("/dealer-categories", {
       method: "GET",
       auth: true,
     });
     return data;
   }

  async changeCategoryStatus(id: string, status: "ACTIVE" | "INACTIVE") {
    const data = await this.request<ChangeDealerCategoryStatusResponse>(`/dealer-categories/${id}/status`, {
      method: "POST",
      auth: true,
      body: { status },
    });
    return data;
  }
  async editCategory(id: string, credentials: EditDealerCategoryCredentials) {
    const data = await this.request<EditDealerCategoryResponse>(`/dealer-categories/${id}`, {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }
 
  async createCategory(credentials: CreateDealerCategoryCredentials) {
    const data = await this.request<CreateDealerCategoryResponse>("/dealer-categories", {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async getCorrespondentById(id: string) {
    const data = await this.request<GetCorrespondentByIdResponse>(`/correspondents/${id}`, {
      method: "GET",
      auth: true,
    });
    return data;
  }

  async updateCorrespondent(id: string, credentials: UpdateCorrespondentCredentials) {
    const data = await this.request<UpdateCorrespondentResponse>(`/correspondents/${id}`, {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async listCorrespondents(q: ListCorrespondentCredentials) {
    const data = await this.request<ListCorrespondentResponse>("/correspondents", {
      method: "GET",
      auth: true,
      query: q,
    });
    return data;
  }

  async createCorrespondent(credentials: CreateCorrespondentCredentials) {
    const data = await this.request<CreateCorrespondentResponse>("/correspondents", {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async assignCorrespondent(id: string, credentials: Assign_ReassignCorrespondentCredentials) {
    const data = await this.request<Assign_ReassignCorrespondentResponse>(`/correspondents/${id}/assign`, {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }
async reassignCorrespondent(id: string, credentials: Assign_ReassignCorrespondentCredentials) {
    const data = await this.request<Assign_ReassignCorrespondentResponse>(`/correspondents/${id}/reassign`, {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async deassignCorrespondent(id: string, credentials: DeassignCorrespondentCredentials) {
    const data = await this.request<Assign_ReassignCorrespondentResponse>(`/correspondents/${id}/deassign`, {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async getCustomerDetail(id: string) {
    const data = await this.request<CustomerDetailResponse>(`/${id}`, {
      method: "GET",
      auth: true,
    });
    return data;
  }

  async editCustomer(id: string, credentials: EditCustomerCredentials) {
    const data = await this.request<EditCustomerResponse>(`/${id}`, {
      method: "PUT",
      auth: true,
      body: credentials,
    });
    return data;
  }
 async link_unlinkCustomerCorrespondent(id: string, credentials: UpdateCustomerCorrespondentCredentials) {
    const data = await this.request<UpdateCustomerCorrespondentResponse>(`/${id}/correspondents`,  {
      method: "PUT",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async listCustomers(q:any) {
    const data = await this.request<CustomerListResponse>("", {
      method: "GET",
      auth: true,
      query: q,
    });
    return data;
  }

  async createCustomer(credentials: CreateCustomerDealerCredentials) {

    //used to create a regular customer or a dealer customer or a special customer
    const data = await this.request<CreateCustomerDealerResponse>("", {
      method: "POST",
      auth: true,
      body: credentials,
    });
    return data;
  }

  async updateCustomerStatus(id: string, credentials: UpdateCustomerStatusCredentials) {
    const data = await this.request<UpdateCustomerStatusResponse>(`/${id}/status`, {
      method: "PUT",
      auth: true,
      body: credentials,
    });
    return data;
  }
}