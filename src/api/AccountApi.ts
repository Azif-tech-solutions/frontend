//AuthApi.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { FundsDisbursementFiltersResponse } from "./types/AccountTypes.ts";
import { FundsDisbursementResponse } from "./types/AccountTypes.ts";
import { ExpenseCategoryFieldsResponse, CashFlowStatementResponse } from "./types/AccountTypes.ts";
import { HsnSectionsResponse, IsicSectionsResponse, VatCategoryResponse, ListExpenseCategoriesRequest, ListExpenseCategoriesResponse, SingleExpenseCategoriesResponse, EditExpenseCategoriesRequest, UpdateStatusExpenseCategoriesRequest } from "./types/AccountTypes.ts";
/** Account-related endpoints. Only the endpoint-specific logic lives here. */
export default class AccountApi extends BaseApi {
  constructor() {
    // Sets the route to <backend>/v1/account; everything else uses the defaults.
    super({ resource: "account" });
  }

  convertVat(data:any) {
    return data.map((c:any) => {
    //   c.taxRate = c.taxRate / 100

      return {
        ...c,
        label: c.name,
        value: c.id,
      }
    })
  }
  async getVatCategories() {
    const data = await this.request<VatCategoryResponse>("/vat-control/vat-categories", {
      method: "GET",
      auth: true,
    });

    // return data;
    return this.convertVat(data.data)

  }

  async getIsicSections() {
    const data = await this.request<IsicSectionsResponse>("/vat-control/isic-sections", {
      method: "GET",
      auth: true,
    });

    // return data;
    return this.convertVat(data.data)

  }

  async getHsnSections() {
    const data = await this.request<HsnSectionsResponse>("/vat-control/hsn-sections", {
      method: "GET",
      auth: true,
    });
    return this.convertVat(data.data)
  } 
  

  async listExpenseCategories(params: ListExpenseCategoriesRequest) {
    const data = await this.request<ListExpenseCategoriesResponse>("/expense-categories", {
      method: "GET",
      auth: true,
      query: params,
    });
    return data.data
  }

  async getExpenseCategories(id: string) {
    const data = await this.request<SingleExpenseCategoriesResponse>(`/expense-categories/${id}`, {
      method: "GET",
      auth: true,
    });
    return data.data
  }

  async editExpenseCategories(id: string, params: EditExpenseCategoriesRequest) {
    const data = await this.request<SingleExpenseCategoriesResponse>(`/expense-categories/${id}`, {
      method: "PUT",
      auth: true,
      body: params,
    });
    return data.data
  }

  async updateStatusExpenseCategories(id: string, body: UpdateStatusExpenseCategoriesRequest) {
    const data = await this.request<SingleExpenseCategoriesResponse>(`/expense-categories/${id}/status`, {
      method: "PUT",
      auth: true,
      body: body,
    });
    return data.data
  }

  async updateExpenseCategories(id: string, body: EditExpenseCategoriesRequest) {
    const data = await this.request<SingleExpenseCategoriesResponse>(`/expense-categories/${id}`, {
      method: "PUT",
      auth: true,
      body: body,
    });
    return data.data
  }
  async getCashFlowFieldFilters() {
    const data = await this.request<ExpenseCategoryFieldsResponse>("/cash-flow/filters", {
      method: "GET",
      auth: true,
    });
    return data.data
  }
  async getCashFlowStatement(query:any) {
    const data = await this.request<CashFlowStatementResponse>("/cash-flow", {
      method: "GET",
      auth: true,
      query: query,
    });
    return data
  }
async getFundsDisbursementFilters(): Promise<FundsDisbursementFiltersResponse> {
  const data = await this.request<FundsDisbursementFiltersResponse>(
    "/fund-disbursements/filters",
    {
      method: "GET",
      auth: true,
    }
  );

  return data;
}

async getFundsDisbursements(
  query: any
): Promise<FundsDisbursementResponse> {
  const data = await this.request<FundsDisbursementResponse>(
    "/fund-disbursements",
    {
      method: "GET",
      auth: true,
      query,
    }
  );

  return data;
}
}