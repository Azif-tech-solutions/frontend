


//CASHIERAPI.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { GetCashierReportsSalesDailyCredentials, GetCashierReportsSalesDailyResponse, RejectDiscountProformasQuotationRequest, SingleSaleResponse } from "./types/CashierTypes.ts";
import {CreateProformasQuotationCredentials,CreateProformasQuotationResponse,SingleProformasQuotationResponse,DeclineProformasQuotationRequest,ConvertProformasQuotationRequest,ConvertProformasQuotationResponse} from "./types/CashierTypes.ts";  
// import { Paged } from "../config";
import { ListProformasQuotationCredentials, ListProformasQuotationsResponse } from "./types/CashierTypes.ts";
import { LoadproformaSaleCredentials,CreateSaleInvoiceCredentials ,CompleteSaleCredentials,AbandonSaleCredentials,ShowroomCatalogueCredentials,ShowroomCatalogueResponse} from "./types/CashierTypes.ts";
/** otp-related endpoints. Only the endpoint-specific logic lives here. */
export default class CashierApi extends BaseApi {
  constructor() {
    
    super({ resource: "cashier" });
  }

  async getCashierReportsSalesDaily(b: GetCashierReportsSalesDailyCredentials) {  
    //
    const data = await this.request<GetCashierReportsSalesDailyResponse>("/reports/sales-daily", {  
      method: "GET",
      auth: true,
      query: b,
    });
    return data;
  }

  async createProformasQuotation(send:boolean, b: CreateProformasQuotationCredentials) {  
    // //send=true also sends it
    // send=false
    const data = await this.request<CreateProformasQuotationResponse>("/pro-formas", {  
      method: "POST",
      auth: true,
      body: b,
      query: {send},
    });
    return data;
  }

  async sendProformasQuotation(id:string) {  
    // 
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/send`, {  
      method: "POST",
      auth: true,
    });
    return data;
  }
  async rejectDiscountProformasQuotation(id:string, b: RejectDiscountProformasQuotationRequest) {  
    // reject the line discount (back to draft to reduce them)
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/reject-discount`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }
  
  async reissueProformasQuotation(id:string) {  
    // reissue an expired or declined proforma as a new draft at today's prices
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/reissue`, {  
      method: "POST",
      auth: true,
    });
    return data;
  }
  async declineProformasQuotation(id:string, b: DeclineProformasQuotationRequest) {  
    // the customer declined the proforma quote
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/decline`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }
  async convertProformasQuotation(id:string, b: ConvertProformasQuotationRequest) {  
    // convert the proforma quote to a sale
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/convert`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async cancelProformasQuotation(id:string,reason:string) {  
    // cancel/widthraw the proforma quote
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/cancel`, {  
      method: "POST",
      auth: true,
      body: {reason},
    });
    return data;
  }
  async approveProformasDiscountQuotation(id:string) {  
    // approve the line discount on a proforma awaiting approval
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}/approve-discount`, {  
      method: "POST",
      auth: true,
    });
    return data;
  }

  async listProformasQuotations(b: ListProformasQuotationCredentials) {  
    // list all proformas quotes
    const data = await this.request<ListProformasQuotationsResponse>("/pro-formas", {  
      method: "GET",
      auth: true,
      query: b,
    });
    return data;
  }
  
  async editProformasQuotation(id:string, b: CreateProformasQuotationCredentials) {  
    // edit the proforma quote after it's been sent
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async getProformasQuotation(id:string) {  
    // get the proforma quote details
    const data = await this.request<SingleProformasQuotationResponse>(`/pro-formas/${id}`, {  
      method: "GET",
      auth: true,
    });
    return data;
  }

  async createSale(customerId:string) {  
    // start a sale on the caller's open till (an empty cart)
    const data = await this.request<SingleSaleResponse>("/sales", {  
      method: "POST",
      auth: true,
      body: {customerId},
    });
    return data;

  }

  async voidSale(id:string,reason:string) {  
    // void a complete sale within the void windo:stock back,receipts and wallet debits reversed,invoice voided
    const data = await this.request<SingleSaleResponse>(`/sales/${id}/void`, {  
      method: "POST",
      auth: true,
      body: {reason},
    });
    return data;
  }

  async loadProformaforsale(id:string,b:LoadproformaSaleCredentials) {  
    // load a sent ,valid pro-forma into this open sale (its cusotmer,lines and quoted price)
    const data = await this.request<SingleSaleResponse>(`/sales/${id}/load-pro-forma`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async issueSaleInvoice(id:string,b:CreateSaleInvoiceCredentials) {  
    // issue the sale invoice for a walk-in sale after the fact
    const data = await this.request<SingleSaleResponse>(`/sales/${id}/invoice`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }
  async completeSale(id:string,b:CompleteSaleCredentials) {  
    // complete the sale:
    const data = await this.request<SingleSaleResponse>(`/sales/${id}/complete`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async abandonSale(id:string,b:AbandonSaleCredentials) {  
    // abandon the sale:Clears the sale (no stock or money was touched)
    const data = await this.request<SingleSaleResponse>(`/sales/${id}/abandon`, {  
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async getSale(id:string) {  
    // get the sale details
    const data = await this.request<SingleSaleResponse>(`/sales/${id}`, {  
      method: "GET",
      auth: true,
    });
    return data;
  }
  async getShowroomCatalogue(b:ShowroomCatalogueCredentials) {  
    // get sellable items at the showroom (defaults to the caller's open till's):price for the customer, available stock
    const data = await this.request<ShowroomCatalogueResponse>("/showroom-catalogue", {  
      method: "GET",
      auth: true,
      query: b,
    });
    return data;
  }

}
