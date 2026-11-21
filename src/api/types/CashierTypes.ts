import { Paged } from "../config.ts";

export interface GetCashierReportsSalesDailyCredentials{
    locationId:string;
    cashierUserId:string;
    from:string;
    to:string;
}


export interface GetCashierReportsSalesDailyResponse {
  data: {
    rows: CashierSalesDailyRow[];
    totals: CashierSalesDailyTotals;
    stats: CashierSalesDailyStats;
  };
}

export interface CashierSalesDailyRow {
  date: string;
  showroom: CashierSalesDailyShowroom;
  transactions: number;
  units: number;
  gross: number;
  discount: number;
  net: number;
  vat: number;
  avgSale: number;
}

export interface CashierSalesDailyTotals {
  date: string;
  showroom: CashierSalesDailyShowroom;
  transactions: number;
  units: number;
  gross: number;
  discount: number;
  net: number;
  vat: number;
  avgSale: number;
}

export interface CashierSalesDailyShowroom {
  id: string;
  code: string;
  name: string;
}

export interface CashierSalesDailyStats {
  netSales: number;
  transactions: number;
  units: number;
  averageTransaction: number;
  bestDay: string;
}






interface ProformasQuotation {
  
    id: string;
    ref: string;
    status: string;
    location: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    customer: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    customerName: string;
    customerType: string;
    prospect: {
      name: string;
      address: string;
      contact: string;
      email: string;
    } | null;
    priceBasis: string;
    issueDate: string;
    validUntil: string;
    paymentTerms: string;
    deliveryTerms: string;
    note: string;
    lines: {
      lineNo: number;
      stockItem: {
        kind: string;
        id: string;
        code: string;
        name: string;
      };
      name: string;
      unit: string;
      quantity: number;
      unitPrice: number;
      lineDiscount: number;
      lineNet: number;
      vatRate: number;
      vatAmount: number;
      lineTotal: number;
      availabilityWarning: boolean;
    }[];
    totals: {
      gross: number;
      discount: number;
      net: number;
      vatEnabled: boolean;
      vatRate: number;
      vat: number;
      total: number;
    };
    preparedBy: {
      id: string;
      name: string;
      email: string;
    };
    declineReason: string | null;
    convertedSale: {
      kind: string;
      id: string;
      code: string;
      name: string;
    } | null;
  };


export interface CreateProformasQuotationCredentials{
   
  locationId: string;
  customerId: string;
  prospect: {
    name: string;
    address: string;
    contact: string;
    email: string;
  },
  issueDate: string;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  note: string;
  lines: 
    {
      stockItemId: string;
      quantity: number;
      lineDiscount: number;
    }[]
  

}


export interface CreateProformasQuotationResponse {
  data: ProformasQuotation;
}


 export interface SingleProformasQuotationResponse {
  data: ProformasQuotation;
}

export interface SendProformasQuotationResponse extends SingleProformasQuotationResponse {
  
}

export interface RejectDiscountProformasQuotationRequest{
    reason: string;
}

export interface RejectProformasQuotationResponse extends SingleProformasQuotationResponse{
}

export interface ReissueProformasQuotationResponse extends SingleProformasQuotationResponse{
}


export interface DeclineProformasQuotationRequest{
    reason: string;
}

export interface DeclineProformasQuotationResponse extends SingleProformasQuotationResponse{
}

export interface ConvertProformasQuotationRequest{
  issueAs: string;
  paymentTermsDays: number;
  paymentTermsNote: string;
  creditOverrideReason: string;
}

export interface ConvertProformasQuotationResponse extends SingleProformasQuotationResponse{
}

export interface CancelProformasQuotationRequest{
    reason: string;
}

export interface CancelProformasQuotationResponse extends SingleProformasQuotationResponse{
}

export interface ApproveProformasQuotationResponse extends SingleProformasQuotationResponse{

}


export interface ListProformasQuotationCredentials{
  status?:string;
  locationId?:string;
  customerId?:string;
  ref?:string;
  from?:string;
  to?:string;
  page: number;
  size: number;
}


export interface ListProformasQuotationsResponse {
  data: Paged<{
    id: string;
    ref: string;
    status: string;
    location: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    customer: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    customerName: string;
    date: string;
    validUntil: string;
    items: number;
    value: number;
    preparedBy: {
      id: string;
      name: string;
      email: string;
    };
    convertedSale: {
      kind: string;
      id: string;
      code: string;
      name: string;
    } | null;
  }>;
}


export interface Sale{
    id: string;
    ref: string;
    status: string;
    version: number;
    channel: string;
    till: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    location: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    cashier: {
      id: string;
      name: string;
      email: string;
    };
    customer: {
      customer: {
        kind: string;
        id: string;
        code: string;
        name: string;
      };
      type: string;
      category: string;
      correspondent: {
        kind: string;
        id: string;
        code: string;
        name: string;
      };
      walletBalance: number;
      depositBalance: number;
      creditLimit: number;
      outstanding: number;
      creditAvailable: number;
      overLimit: boolean;
    };
    customerName: string;
    priceBasis: string;
    lines: {
      lineNo: number;
      stockItem: {
        kind: string;
        id: string;
        code: string;
        name: string;
      };
      code: string;
      name: string;
      unit: string;
      category: string;
      quantity: number;
      unitPrice: number;
      priceBasis: string;
      lineDiscount: number;
      instantDiscountShare: number;
      lineNet: number;
      vatRate: number;
      vatAmount: number;
      lineTotal: number;
      available: number;
      insufficient: boolean;
      supplied: number;
      outstanding: number;
    }[];
    totals: {
      gross: number;
      lineDiscounts: number;
      instantDiscount: number;
      net: number;
      vatEnabled: boolean;
      vatRate: number;
      vat: number;
      total: number;
    };
    payments: {
      method: string;
      methodLabel: string;
      amount: number;
      receipt: {
        kind: string;
        id: string;
        code: string;
        name: string;
      } | null;
      receiptRef: string | null;
      confirmationStatus: string;
      terminalRef: string | null;
      payerReference: string | null;
    }[];
    paidNow: number;
    onAccount: number;
    cashTendered: number;
    changeGiven: number;
    allowedMethods: string[];
    instantDiscount: {
      id: string;
      ref: string;
      amount: number;
      pctOfBase: number;
      reason: string;
      status: string;
    } | null;
    invoice: {
      kind: string;
      id: string;
      code: string;
      name: string;
    } | null;
    invoiceNumber: string | null;
    correspondent: {
      kind: string;
      id: string;
      code: string;
      name: string;
    } | null;
    supplyStatus: string;
    saleDate: string;
    startedAt: string;
    completedAt: string | null;
    creditOverrideReason: string | null;
    creditOverrideBy: {
      id: string;
      name: string;
      email: string;
    } | null;
    voidedAt: string | null;
    voidedBy: {
      id: string;
      name: string;
      email: string;
    } | null;
    voidReason: string | null;
    voidableUntil: string | null;
  };
export interface SingleSaleResponse {
  data: Sale
}

export interface VoidSaleCredential{
  reason: string;
}

export interface LoadproformaSaleCredentials{
  proFormaId: string;
  version:number;

}

export interface CreateSaleInvoiceCredentials{
  buyer: {
    name: string;
    email: string;
    phone: string;
    tin: string;
    address: string;
    stateCode: string;
  }
}

export interface CompleteSaleCredentials {
  id: string;
  version: number;
  payments: {
    method: string;
    amount: number;
    tendered: number;
    terminalRef: string;
    payerReference: string;
    receivingBankAccountId: string;
  }[];
  onAccount: number;
  supply: {
    lineNo: number;
    supplyNow: number;
    fromLocationId: string;
  }[];
  invoiceBuyer: {
    name: string;
    email: string;
    phone: string;
    tin: string;
    address: string;
    stateCode: string;
  };
  creditOverrideReason: string;
  fromLocationId: string;
}


export interface AbandonSaleCredentials{
  // id: string;
  version: number;
}


export interface ShowroomCatalogueCredentials{
  locationId?: string;
  q?: string;
  // category?: string;
  customerId:string;
  includeOutOfStock?: boolean;
  page?: number;
  size?: number;
}
export interface ShowroomCatalogueResponse {
  data: Paged<{
    stockItem: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    code: string;
    barcode: string;
    name: string;
    category: string;
    unit: string;
    price: number;
    retailPrice: number;
    dealerPrice: number;
    available: number;
    lowStock: boolean;
  }>;
}


export interface ListSalesCredentials{
  locationId?:string;
  cashierUserId:string;
  customerId:string;
  status?:string;
  from?:string;
  to?:string;
  ref?:string; //txn orinv number
  page?: number;
  size?: number;
}