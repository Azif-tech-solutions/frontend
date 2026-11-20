


//CASHIERAPI.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { GetCashierReportsSalesDailyCredentials, GetCashierReportsSalesDailyResponse } from "./types/CashierTypes.ts";
// import { Paged } from "../config";
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

  
}
