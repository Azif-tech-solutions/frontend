//OPTAPI.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { OtpChallengeCredentials, OtpChallengeResponse, OtpVerifyResponse, OtpVerifyCredentials } from "./types/OtpTypes.ts";
// import { Paged } from "../config";
/** otp-related endpoints. Only the endpoint-specific logic lives here. */
export default class OtpApi extends BaseApi {
  constructor() {
    
    super({ resource: "otp" });
  }

  async createOtpChallenge(b: OtpChallengeCredentials) {  
    //
    const data = await this.request<OtpChallengeResponse>("/challenges", {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async issueOtp(challengeId: string) {
    const data = await this.request<OtpChallengeResponse>(`/challenges/${challengeId}/issue`, {
      method: "POST",
      auth: true,
    });
    return data;
  }

  async verifyOtp(challengeId: string, b: OtpVerifyCredentials) {
    //
    const data = await this.request<OtpVerifyResponse>(`/challenges/${challengeId}/verify`, {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }
  
}