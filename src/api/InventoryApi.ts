//InventoryApi.ts

import { BaseApi } from "./config.ts";
import { StockItem, ItemTypes, CreateStokeItemResponse, ListStokeItemRespsonse } from "./types/InventoryTypes.ts";

/**
 * Lists the page already has, used to turn ids from the API into the labels
 * the register shows. Categories and units are { value, label } option lists
 * (what categoryOptions() and unitOptions() return); factories are store records.
 */
export interface StockLookups {
  factories: { id: string; name: string }[];
  categories: { value: string; label: string }[];
  units: { value: string; label: string }[];
}

/** inventory-related endpoints. Only the endpoint-specific logic lives here. */
export default class InventoryApi extends BaseApi {
  constructor() {
    // Sets the route to <backend>/v1/inventory; everything else uses the defaults.
    super({ resource: "inventory" });
  }

  /**
   * Converts a stock item from the API into the shape the store and the
   * register table use. It matches what registerProduct() used to build locally,
   * so every screen that reads `products` keeps working.
   */
  toStoreProduct(p: StockItem, lookups: StockLookups) {
    const labelFor = (list: { value: string; label: string }[], id: string) =>
      list.find((o) => o.value === id)?.label ?? "";

    // "ACTIVE" -> "Active". The register's badge checks for "Active".
    const status = p.status ? p.status.charAt(0) + p.status.slice(1).toLowerCase() : "Active";

    return {
      // identity
      id: p.id ?? p.code,
      kind: p.itemType === "RAW_MATERIAL" ? "raw" : "finished",
      code: p.code,
      name: p.name,

      // factory: the API only gives the id, so the name comes from the lookup
      factoryId: p.locationId,
      factoryName: lookups.factories.find((f) => f.id === p.locationId)?.name ?? "",

      // labels the register table shows, plus the ids they came from
      category: labelFor(lookups.categories, p.categoryId),
      categoryId: p.categoryId,
      unit: labelFor(lookups.units, p.unitOfMeasureId),
      unitOfMeasureId: p.unitOfMeasureId,
      reorder: p.reorderLevel == null ? "" : String(p.reorderLevel),
      barcode: p.barcode ?? "",
      status,
      createdAt: Date.parse(p.createdAt ?? "") || Date.now(),

      // the rest of what the backend holds
      brand: p.brand,
      landingCost: p.landingCost,
      markupCost: p.markupCost,
      vatCategoryId: p.vatCategoryId,
      hsnSectionId: p.hsnSectionId,
      isicSectionId: p.isicSectionId,

      // defaults so these products work with the variation flow, same as registerProduct
      details: {},
      fixedFields: {},
      variantFieldIds: [],
    };
  }

  /** POST <backend>/v1/inventory/stock-items */
  async createInventory(d: StockItem) {
    const data = await this.request<CreateStokeItemResponse>("/stock-items", {
      method: "POST",
      auth: true,
      body: d,
    });
    return data;
  }

  /** GET <backend>/v1/inventory/stock-items?locationId=...&itemType=... */
  async listStockItems(locationId: string, itemType?: ItemTypes) {
    // `query` skips undefined values, so leaving itemType out doesn't send "undefined".
    const data = await this.request<ListStokeItemRespsonse>("/stock-items", {
      method: "GET",
      auth: true,
      query: { locationId, itemType },
    });
    return data;
  }
}