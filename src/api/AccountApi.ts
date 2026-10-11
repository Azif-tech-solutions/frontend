//AuthApi.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { HsnSectionsResponse, IsicSectionsResponse, VatCategoryResponse } from "./types/AccountTypes.ts";
/** Account-related endpoints. Only the endpoint-specific logic lives here. */
export default class AccountApi extends BaseApi {
  constructor() {
    // Sets the route to <backend>/v1/account; everything else uses the defaults.
    super({ resource: "account" });
  }

  convertVat(data) {
    return data.map((c) => {
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
  
}