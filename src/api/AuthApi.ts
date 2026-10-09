//AuthApi.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { LoginCredentials, LoginResponse,RegistrationCredentials,FullRegistrationResponseData } from "./types/AuthTypes.ts";
import { UpdateCompanyCredentials,FullUpdateCompanyResponseData,FullGetCompanyProfile } from "./types/AuthTypes.ts";
/** Auth-related endpoints. Only the endpoint-specific logic lives here. */
export default class AuthApi extends BaseApi {
  constructor() {
    // Sets the route to <backend>/v1/auth; everything else uses the defaults.
    super({ resource: "auth" });
  }

  /** POST <backend>/v1/auth/login */
  async login(credentials: LoginCredentials) {
    const data = await this.request<LoginResponse>("login", {
      method: "POST",
      body: credentials,
    });
    // console.log(`THis is the accessToken: ${data.data.accessToken}`)
    // console.log(`THis is the refreshToken: ${data.data.refreshToken}`)
    
    this.storeTokens(data.data.accessToken, data.data.refreshToken);
    // console.log(data)
    return data;
  }
  async register(credentials: RegistrationCredentials) {
    const data = await this.request<FullRegistrationResponseData>("register-tenant", {
      method: "POST",
      body: credentials,
    });
    console.log("Data gotten from register-tenant:",data)
    this.storeTokens(data.data.tokenResponse.accessToken, data.data.tokenResponse.refreshToken);
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