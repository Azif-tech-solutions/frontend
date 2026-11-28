//Factory.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { StateListResponse,IssueInvoiceCredentials,SingleInvoiceResponse,EditInvoiceHeaderCredentials,EditInvoiceHeaderResponse,VoidInvoiceCredentials,VoidInvoiceResponse } from "./types/InvoiceTypes.ts";
import {ListInvoicePaymentsResponse,RecordInvoicePaymentCredentials,RecordInvoicePaymentResponse} from "./types/InvoiceTypes.ts";
import {CreateInvoiceDeliveryCredentials,CreateInvoiceDeliveryResponse} from "./types/InvoiceTypes.ts";
import {ListInvoiceDeliveriesResponse} from "./types/InvoiceTypes.ts";
import {CreateInvoiceCreditNotedCredentials,CreateInvoiceCreditNotedResponse} from "./types/InvoiceTypes.ts";
import {InvoiceHistoryResponse,InvoiceHistoryFilterResponse} from "./types/InvoiceTypes.ts";



/** invoice-related endpoints. Only the endpoint-specific logic lives here. */

export default class InvoiceApi extends BaseApi {
  constructor() {
    
    super({ resource: "invoicing" });
  }

    /** GET <backend>/v1/settings/state-list */
    async getLGAList(stateCode:string) {
      const data = await this.request<StateListResponse>("/reference/lgas", {
        method: "GET",
        auth: true,
        query: {
          stateCode,
        }
      });
      return data;
    }

    /** GET <backend>/v1/settings/onboarding */
    async getStateList() {
      const data = await this.request<StateListResponse>("/reference/states", {
        method: "GET",
        auth: true,
      });
      return data;
    }

    async issueInvoice(id:string,credentials:IssueInvoiceCredentials){
      const data = await this.request<SingleInvoiceResponse>(`/invoices/${id}/issue`, {
        method: "POST",
        auth: true,
        body: credentials,
      });
      return data;
    }
    async getInvoice(id:string){
      const data = await this.request<SingleInvoiceResponse>(`/invoices/${id}`, {
        method: "GET",
        auth: true,
      });
      return data;
    }

    async editInvoice(id:string,credentials:EditInvoiceHeaderCredentials){
      //Edit a drafts header;planned issue date,terms,due date,note,buyer email (lines come the source)
      const data = await this.request<EditInvoiceHeaderResponse>(`/invoices/${id}`, {
        method: "PUT",
        auth: true,
        body: credentials,
      });
      return data;
    }

    async voidInvoice(id:string,credentials:VoidInvoiceCredentials){
      //either  a walk in custmer or a created customer already
      //void with a reason(only when nothing is paid or credited) or void and reissue to a correct buyer
      const data = await this.request<VoidInvoiceResponse>(`/invoices/${id}/void`, {
        method: "POST",
        auth: true,
        body: credentials,
      });
      return data;
    } 

    async paymentListInInvoice(id:string){
      //the invoce payments with their receipt status
      const data = await this.request<ListInvoicePaymentsResponse>(`/invoices/${id}/payments`, {
        method: "GET",
        auth: true,
      });
      return data;
    }

    async createPaymentForInvoice(id:string,credentials:RecordInvoicePaymentCredentials){
      //create a payment for an invoice : An account receipt (cash posts now; POS,TRANSFER and Cheque wait for confirmation) never more than the balance
      const data = await this.request<RecordInvoicePaymentResponse>(`/invoices/${id}/payments`, {
        method: "POST",
        auth: true,
        body: credentials,
      });
      return data;
    }

    async reversePaymentForInvoice(id:string,paymentId:string,reason:string){
      //reverse a payment for an invoice : An account receipt (cash posts now; POS,TRANSFER and Cheque wait for confirmation) never more than the balance
      //only if the payment status is PENDING
      const data = await this.request<SingleInvoiceResponse>(`/invoices/${id}/payments/${paymentId}/reverse`, {
        method: "POST",
        auth: true,
        body: {
          reason,
        },
      });
      return data;
    }

    async listInvoiceDeliveries(id:string){
      //the invoice's email deliveries,newest first
      const data = await this.request<ListInvoiceDeliveriesResponse>(`/invoices/${id}/deliveries`, {
        method: "GET",
        auth: true,
      });
      return data;
    }
    async createInvoiceDelivery(id:string,credentials:CreateInvoiceDeliveryCredentials){
      //create a delivery for an invoice : An email delivery to the buyer
      const data = await this.request<CreateInvoiceDeliveryResponse>(`/invoices/${id}/deliveries`, {
        method: "POST",
        auth: true,
        body: credentials,
      });
      return data;
    }

    async issueCreditNoteInvoice(id:string,credentials:CreateInvoiceCreditNotedCredentials){
      //issue a credit note for an invoice : An email credit note to the buyer
      const data = await this.request<CreateInvoiceCreditNotedResponse>(`/invoices/${id}/credit-notes`, {
        method: "POST",
        auth: true,
        body: credentials,
      });
      return data;
    }

    async getInvoicesHistory(q:any){
      //the invoice history,status filter include the derived PARTIALLY_PAID,PAID AND OVERDUE
      // q.status = "PARTIALLY_PAID,PARTIALLY_CREDITED";
      const data = await this.request<InvoiceHistoryResponse>("/invoices", {
        method: "GET",
        auth: true,
        query: q,
      });
      return data;
    }

    async getInvoiceHistoryFilter(){
      const data = await this.request<InvoiceHistoryFilterResponse>("/invoices/filter", {
        method: "GET",
        auth: true,
      });
      return data;
    }
  }


