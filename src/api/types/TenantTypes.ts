import { Paged } from "../config";
export interface MemberData{
    userId:string;
    displayName:string;
    email:string;
    phone:string;
    status:string;
    role:{
        id:string;
        name:string;
    };

    location:{
        id:string;
        code:string;
        name:string;
    };
    invitedAt:string;
    accessScope:string;
}
export interface CreateTenantMemberCredentials {

//   id: string;
//   code: string;
  displayName: string;
  email: string;
  phone: string;
  roleId: string;
  locationId: string;//location is basically the factories and showrooms combined so there would be a need to query the 2 different endpoints in their respective api classes
}

export interface CreateTenantMemberResponse {
  data: MemberData;
}

export interface TenantMemberListCredentials {
    q?:string;
    status?:string;
page: number;
  size: number;
}
export interface TenantMemberListResponse {
  data: Paged<MemberData>;
}

export interface TenantMemberStatusChangeCredentials {
    status:"ACTIVE"|"PENDING"|"SUSPENDED";
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleListResponse {
  data: Role[];
}