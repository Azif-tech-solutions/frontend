//ComplianceApi.ts
import { BaseApi } from "./config.ts";
import { GetVatReportCredentials, GetVatReportResponse } from "./types/ComplainceTypes.ts";

export class ComplianceApi extends BaseApi {
      constructor() {
        
        super({ resource: "compliance" });
      }
    
      async getVatReport(b: GetVatReportCredentials) {  
        //
        const data = await this.request<GetVatReportResponse>("/vat/report", {
          method: "GET",
          auth: true,
          query: b,
        });
        return data;
      }
}