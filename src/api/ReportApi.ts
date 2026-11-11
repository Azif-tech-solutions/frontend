import { BaseApi } from "./config";
import { GetReportSCICredentials, GetReportSCIResponse } from "./types/ReportTypes";
export default class ReportApi extends BaseApi {
  constructor() {
    
    super({ resource: "reports" });
  }

    /** GET <backend>/v1/reports/sci-credentials */
    async getReportSCICredentials(credentials: GetReportSCICredentials) {
      const data = await this.request<GetReportSCIResponse>("sci", {
        method: "GET",
        auth: true,
        query: credentials
      });
      return data;
    }

}