//Factory.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { StateListResponse } from "./types/InvoiceTypes.ts";
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
}