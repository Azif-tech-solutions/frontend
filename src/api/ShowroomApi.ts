//Showroom.ts

import { getBaseUrl } from "./config.ts";
import { BaseApi } from "./config.ts";
import {DirectEntryListResponse} from "./types/ShowroomTypes.ts";
import {DirectEntryFilterResponse} from "./types/ShowroomTypes.ts";
import { CreateDirectStockEntryCredentials, CreateDirectStockEntryResponse } from "./types/ShowroomTypes.ts";
import { UpdateDefaultReceivingAndSellingAreas } from "./types/ShowroomTypes.ts";
import { ShowroomLookupPickerWithAreasCredentials,ShowroomLookupPickerWithAreasResponse } from "./types/ShowroomTypes.ts";
import { AddAreaToShowRoomCredentials, CreateShowroomCredentials, CreateShowroomResponse, ListShowroomCredentials, ListShowroomResponse} from "./types/ShowroomTypes.ts";
import { StatusChangeCredentials, StatusChangeResponse } from "./types/ShowroomTypes.ts";
/** invoice-related endpoints. Only the endpoint-specific logic lives here. */
export default class ShowroomApi extends BaseApi {
  constructor() {
    
    super({ resource: "showroom" });
  }

  async createShowroom(b: CreateShowroomCredentials) {
    const data = await this.request<CreateShowroomResponse>("/showrooms", {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }
  async retrieveShowroom(id:string){
    //this gives all the details with areas and defaults
    const data = await this.request<CreateShowroomResponse>(`/showrooms/${id}`, {
      method: "GET",
      auth: true,
    });
    return data;
  }
  async editShowroom(id:string,b:CreateShowroomCredentials){
    const data = await this.request<CreateShowroomResponse>(`/showrooms/${id}`, {
      method: "PUT",
      auth: true,
      body: b,
    });
    return data;
  }
  async listShowrooms(q: ListShowroomCredentials) {
    const data = await this.request<ListShowroomResponse>("/showrooms", {
      method: "GET",
      auth: true,
      query: q,
    });
    return data;
  }
  async changeStatus(id:string,b:StatusChangeCredentials){
    const data = await this.request<StatusChangeResponse>(`/showrooms/${id}/status`, {
      method: "PUT",
      auth: true,
      body: b,
    });
    return data;
  }

  async addAreaToShowRoom(id:string,b:AddAreaToShowRoomCredentials){
    const data = await this.request<CreateShowroomResponse>(`/showrooms/${id}/areas`, {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }

  async updateDefaultReceivingAndSellingAreas(id:string,b:UpdateDefaultReceivingAndSellingAreas){
    const data = await this.request<CreateShowroomResponse>(`/showrooms/${id}/defaults`, {
      method: "PUT",
      auth: true,
      body: b,
    });
    return data;
  }
  async lookupPickerWithAreas(q:ShowroomLookupPickerWithAreasCredentials){
    const data = await this.request<ShowroomLookupPickerWithAreasResponse>("/showrooms/lookup", {
      method: "GET",
      auth: true,
      query: q,
    });
    return data;
  }
  async createDirectStockEntry(b:CreateDirectStockEntryCredentials){
    //this is the correct endpoint for create a direct entry stock in showroom showroom
    const data = await this.request<CreateDirectStockEntryResponse>("/direct-entries", {
      method: "POST",
      auth: true,
      body: b,
    });
    return data;
  }
  async listDirectStockEntries(q:any){
    //q should be the filter gotten from the filter endpoint
    const data = await this.request<DirectEntryListResponse>("/direct-entries", {
      method: "GET",
      auth: true,
      query: q,
    });
    return data;
  }
  async getDirectStockListFilters(){
    //q should be the filter gotten from the filter endpoint
    const data = await this.request<DirectEntryFilterResponse>("/direct-entries/filters", {
      method: "GET",
      auth: true,
    });
    return data;
  }
}