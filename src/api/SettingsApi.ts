//Factory.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { UpdateCompanyCredentials,FullUpdateCompanyResponseData,FullGetCompanyProfile } from "./types/SettingTypes.ts";
import { FullOnboardingStatusResponse } from "./types/SettingTypes.ts";
/** Settings-related endpoints. Only the endpoint-specific logic lives here. */
export default class SettingsApi extends BaseApi {
  constructor() {
    
    super({ resource: "settings" });
  }

    /** GET <backend>/v1/settings/onboarding */
    async getOnboardingStatus() {
      const data = await this.request<FullOnboardingStatusResponse>("onboarding", {
        method: "GET",
        auth: true,
      });
      return data;
    }

    async updateCompany(credentials: UpdateCompanyCredentials) {
    const data= await this.request<FullUpdateCompanyResponseData>("company", {
      method: "PUT",
      body: credentials,
      resource: "settings", // this call goes to /v1/settings/company
      auth: true,
    });
    console.log("Data gotten from update company: ", data)
    return data
  }
  async RetrieveCompanyProfile() {
    const data= await this.request<FullGetCompanyProfile>("company", {
      method: "GET",
      resource: "settings", // this call goes to /v1/settings/company
      auth: true,
    });
    console.log("Data gotten from RetrieveCompanyProfile: ", data)
    return data
  }
}