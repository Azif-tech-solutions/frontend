//AuthApi.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { FundsDisbursementFiltersResponse } from "./types/AccountTypes.ts";
import { AccountCashFlowFilterResponse,AccountCashFlowResponse,AccountCashFlowListItem } from "./types/AccountTypes.ts";
import { FundsDisbursementResponse } from "./types/AccountTypes.ts";
import { ExpenseCategoryFieldsResponse, CashFlowStatementResponse } from "./types/AccountTypes.ts";
import {GetPettyCashAccountStatementCredentials,AccountPettyCashStatementResponse,PettyCashHistoryResponse} from "./types/AccountTypes.ts";
import { ListCashAccountsCredentials, SingleCashAccountResponse, CreateCashAccountCredentials, EditCashAccountCredentials,ListCashAccountsResponse,ChangeCashAccountStatusCredentials } from "./types/AccountTypes.ts";
import { BankStatementFilterResponse,BankStatementListResponse } from "./types/AccountTypes.ts";
import {ListBankAccountsCredentials,ListBankAccountRespsonse,PettyCashHistoryFilterResponse} from "./types/AccountTypes.ts";
import { CreateBankAccountCredentials,GenericBankAccountResponse,EditBankAccountStatusCredentials,UpdateBankAccountCredentials } from "./types/AccountTypes.ts";
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

async listBankAccounts(params: ListBankAccountsCredentials) {
  const data = await this.request<ListBankAccountRespsonse>("/bank-accounts", {
    method: "GET",
    auth: true,
    query: params
  });
  return data
}


async createBankAccount(params: CreateBankAccountCredentials) {
  const data = await this.request<GenericBankAccountResponse>("/bank-accounts", {
    method: "POST",
    auth: true,
    body: params,
  });
  return data

}

async editBankAccountStatus(id: string, params: EditBankAccountStatusCredentials) {
  const data = await this.request<GenericBankAccountResponse>(`/bank-accounts/${id}/status`, {
    method: "PUT",
    auth: true,
    body: params,
  });
  return data


}

async updateBankAccount(id: string, params: UpdateBankAccountCredentials) {
  const data = await this.request<GenericBankAccountResponse>(`/bank-accounts/${id}`, {
    method: "PUT",
    auth: true,
    body: params,
  });
  return data
}
async retreiveBankAccountById(id: string) {
  const data = await this.request<GenericBankAccountResponse>(`/bank-accounts/${id}`, {
    method: "GET",
    auth: true,
  });
  return data
}

async retreiveBankStatementList(id: string,q:any){

  const data = await this.request<BankStatementListResponse>(`/bank-accounts/${id}/statement`, {
    method: "GET",
    auth: true,
    query: q,
  });
  return data
}

async retreiveBankStatementFilter(id: string){
  const data = await this.request<BankStatementFilterResponse>(`/bank-accounts/statement/filters`, {
    method: "GET",
    auth: true,
  });
  return data
}

async retreiveAccountCashFlowFilters(){
  const data = await this.request<AccountCashFlowFilterResponse>(`/cash-flow/filters`, {
    method: "GET",
    auth: true,
  });
  return data
}

async retreiveAccountCashFlow(query:any){
  const data = await this.request<AccountCashFlowResponse>(`/cash-flow`, {
    method: "GET",
    auth: true,
    query: query,
  });
  return data

}

async listCashAccounts(params: ListCashAccountsCredentials) {
  const data = await this.request<ListCashAccountsResponse>("/cash-accounts", {
    method: "GET",
    auth: true,
    query: params
  });
  return data
}

async createCashAccount(params: CreateCashAccountCredentials) {
  const data = await this.request<SingleCashAccountResponse>("/cash-accounts", {
    method: "POST",
    auth: true,
    body: params,
  });
  return data
}
async editCashAccountStatus(id: string, params: ChangeCashAccountStatusCredentials) {
  const data = await this.request<SingleCashAccountResponse>(`/cash-accounts/${id}/status`, {
    method: "PUT",
    auth: true,
    body: params,
  });
  return data
}

async editCashAccount(id: string, params: EditCashAccountCredentials) {
  const data = await this.request<SingleCashAccountResponse>(`/cash-accounts/${id}`, {
    method: "PUT",
    auth: true,
    body: params,
  });
  return data
}


async getPettyCashAccountStatement(params: GetPettyCashAccountStatementCredentials) {
  const data = await this.request<AccountPettyCashStatementResponse>(`/petty-cash/statement`, {
    method: "GET",
    auth: true,
    query: params,
  });
  return data
}

async getPettyCashAccountFilters(){
  const data = await this.request<PettyCashHistoryFilterResponse>(`/petty-cash/payments/history/filters`, {
    method: "GET",
    auth: true,
  });
  return data
}

async getPettyCashAccountHistory(query:any){
  const data = await this.request<PettyCashHistoryResponse>(`/petty-cash/payments/history`, {
    method: "GET",
    auth: true,
    query: query,
  });
  return data
}
}