import { BaseApi } from "./config";
import { CustomerHistoryReportsRequest, CustomerHistoryReportsResponse } from "./types/ReportsTypes";

export default class ReportsApi extends BaseApi {
  constructor() {
    super({ resource: "reports" });
  }
  async getCustomerHistoryReports(id: string, request: CustomerHistoryReportsRequest) {
    return this.request<CustomerHistoryReportsResponse>(`/customers/${id}/history`, {
      method: "GET",
      auth: true,
      query: request,
    });
  }
}