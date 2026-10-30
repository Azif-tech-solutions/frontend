//Showroom.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import { RoleListResponse } from "./types/TenantTypes.ts";
import { CreateTenantMemberCredentials, CreateTenantMemberResponse, TenantMemberListCredentials, TenantMemberListResponse, TenantMemberStatusChangeCredentials  } from "./types/TenantTypes.ts";
// import { Paged } from "../config";
/** tenant-related endpoints. Only the endpoint-specific logic lives here. */
export default class TenantApi extends BaseApi {
  constructor() {
    
    super({ resource: "tenants" });
  }

  async createTenantMember(b: CreateTenantMemberCredentials) {  
    //for getting the location id you might need to query the ShowroomApi for showroom list and the factoryApi for factory list
    const data = await this.request<CreateTenantMemberResponse>("/members", {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async getTenantMemberList(b: TenantMemberListCredentials) {
    const data = await this.request<TenantMemberListResponse>("/members", {
      method: "GET",
      auth: true,
      query: b,
    });
    return data;
  }

  async changeTenantMemberStatus(userId:string,b: TenantMemberStatusChangeCredentials) {
    const data = await this.request<CreateTenantMemberResponse>(`/members/${userId}/status`, {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }



   async getRoleList() {
    const data = await this.request<RoleListResponse>("/roles", {
      method: "GET",
      auth: true,
    });
    return data;
  }

  
}