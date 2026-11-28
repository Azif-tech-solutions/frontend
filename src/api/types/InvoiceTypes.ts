//invoice types
import { Paged } from "../config";
export interface state{
    code:string;
    stateCode?:string;//state code is returned for lga objects to refernet the state the lga belongs to
    name:string;

}

export interface StateListResponse{
    data:state[];
}



export interface SingleInvoiceResponse {
  data: {
    id: string;
    number: string;
    status: string;
    displayStatus: string;
    invoiceTypeCode: string;
    invoiceKind: string;
    issueDate: string;
    issueTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    dueDate: string;
    paymentTermsDays: number;
    paymentTermsNote: string;
    daysOverdue: number;
    issuedBy: { id: string; name: string; email: string };
    issuedAt: string;
    createdAt: string;
    showroom: { id: string; name: string };
    issuer: {
      tradingName: string;
      legalName: string;
      tin: string;
      vatRegistrationNumber: string;
      nrsBusinessId: string;
      email: string;
      phone: string;
      address: string;
      locationName: string;
      locationAddress: string;
    };
    buyer: {
      customer: { kind: string; id: string; code: string; name: string };
      code: string;
      name: string;
      type: string;
      email: string;
      phone: string;
      tin: string;
      businessDescription: string;
      address: string;
      stateCode: string;
      lgaCode: string;
      countryCode: string;
    };
    lines: {
      id: string;
      lineNo: number;
      stockItem: { kind: string; id: string; code: string; name: string };
      code: string;
      name: string;
      quantity: number;
      unit: string;
      nrsUnitCode: string;
      unitPrice: number;
      discountAmount: number;
      discountRate: number;
      lineNet: number;
      vatCategory: string;
      nrsTaxCategory: string;
      vatRate: number;
      vatAmount: number;
      lineTotal: number;
      isService: boolean;
      hsnCode: string;
      hsnSectionCode: string;
      productCategory: string;
      isicCode: string;
      serviceCategory: string;
    }[];
    totals: {
      lineExtension: number;
      discount: number;
      vat: number;
      total: number;
      paid: number;
      credited: number;
      balance: number;
      pendingConfirmation: number;
    };
    vat: {
      enabled: boolean;
      rate: number;
    };
    linked: {
      sourceType: string;
      sourceRef: string;
      proForma: string;
      waybills: {
        id: string;
        ref: string;
        date: string;
      }[];
      payments: {
        id: string;
        date: string;
        method: string;
        methodLabel: string;
        amount: number;
        receipt: { kind: string; id: string; code: string; name: string } | null;
        status: string;
        source: string;
        reversalReason: string | null;
      }[];
      creditNotes: {
        id: string;
        number: string;
        issuedAt: string;
        reason: string;
        total: number;
        appliedToInvoice: number;
        excessRefunded: number;
      }[];
      reissueOf: { id: string; number: string } | null;
      replacedBy: { id: string; number: string } | null;
    };
    delivery: {
      code: string;
      status: string;
      lastAttemptAt: string | null;
      recipient: string;
      attempts: number;
    };
    regulatory: {
      irn: string;
      cryptographicStampId: string;
      qrCode: string;
      accessPointSubmission: string;
      nrsSubmissionStatus: string;
    };
    voidReason: string | null;
    voidedBy: { id: string; name: string; email: string } | null;
    voidedAt: string | null;
  };
}
export interface IssueInvoiceCredentials{
  issueDate: string;
  paymentTermsDays: number;
  dueDate: string;
  paymentTermsNote: string;
  buyerEmail: string;
}


export interface EditInvoiceHeaderCredentials{
  issueDate: string;
  paymentTermsDays: number;
  dueDate: string;
  paymentTermsNote: string;
  buyerEmail: string;
}

export interface EditInvoiceHeaderResponse extends SingleInvoiceResponse{
 
}

export interface VoidInvoiceCredentials{
  reason: string;
   reissue: {
    customerId: string;
    walkInBuyer: {
      name: string;
      email: string;
      phone: string;
      tin: string;
      address: string;
      stateCode: string;
    },
    buyerEmail: string;
  }
}

export interface VoidInvoiceResponse extends SingleInvoiceResponse{
 
}

export interface ListInvoicePaymentsResponse {
  data: {
    id: string;
    date: string;
    method: string;
    methodLabel: string;
    amount: number;
    receipt: { kind: string; id: string; code: string; name: string };
    status: string;
    source: string;
    reversalReason: string | null;
  }[];
}

export interface  RecordInvoicePaymentCredentials
  {
  method: "DEPOST"| "FUND_TRANSFER" | "CHEQUE"|"WALLET" |"POS";
  amount: number;
  paidAt: string;
  cashAccountId: string;
  receivingBankAccountId: string;
  terminalRef: string;
  payerReference: string;
}


export interface RecordInvoicePaymentResponse {
  data: {
    paymentId: string;
    receipt: { kind: string; id: string; code: string; name: string };
    confirmationStatus: string;
    invoice: {
      id: string;
      number: string;
      status: string;
      displayStatus: string;
      invoiceTypeCode: string;
      invoiceKind: string;
      issueDate: string;
      issueTime: {
        hour: number;
        minute: number;
        second: number;
        nano: number;
      };
      dueDate: string;
      paymentTermsDays: number;
      paymentTermsNote: string;
      daysOverdue: number;
      issuedBy: { id: string; name: string; email: string };
      issuedAt: string;
      createdAt: string;
      showroom: { id: string; name: string };
      issuer: {
        tradingName: string;
        legalName: string;
        tin: string;
        vatRegistrationNumber: string;
        nrsBusinessId: string;
        email: string;
        phone: string;
        address: string;
        locationName: string;
        locationAddress: string;
      };
      buyer: {
        customer: { kind: string; id: string; code: string; name: string };
        code: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        tin: string;
        businessDescription: string;
        address: string;
        stateCode: string;
        lgaCode: string;
        countryCode: string;
      };
      lines: {
        id: string;
        lineNo: number;
        stockItem: { kind: string; id: string; code: string; name: string };
        code: string;
        name: string;
        quantity: number;
        unit: string;
        nrsUnitCode: string;
        unitPrice: number;
        discountAmount: number;
        discountRate: number;
        lineNet: number;
        vatCategory: string;
        nrsTaxCategory: string;
        vatRate: number;
        vatAmount: number;
        lineTotal: number;
        isService: boolean;
        hsnCode: string;
        hsnSectionCode: string;
        productCategory: string;
        isicCode: string;
        serviceCategory: string;
      }[];
      totals: {
        lineExtension: number;
        discount: number;
        vat: number;
        total: number;
        paid: number;
        credited: number;
        balance: number;
        pendingConfirmation: number;
      };
      vat: {
        enabled: boolean;
        rate: number;
      };
      linked: {
        sourceType: string;
        sourceRef: string;
        proForma: string;
        waybills: {
          id: string;
          ref: string;
          date: string;
        }[];
        payments: {
          id: string;
          date: string;
          method: string;
          methodLabel: string;
          amount: number;
          receipt: { kind: string; id: string; code: string; name: string };
          status: string;
          source: string;
          reversalReason: string;
        }[];
        creditNotes: {
          id: string;
          number: string;
          issuedAt: string;
          reason: string;
          total: number;
          appliedToInvoice: number;
          excessRefunded: number;
        }[];
        reissueOf: { id: string; number: string } | null;
        replacedBy: { id: string; number: string } | null;
      };
      delivery: {
        code: string;
        status: string;
        lastAttemptAt: string | null;
        recipient: string;
        attempts: number;
      };
      regulatory: {
        irn: string;
        cryptographicStampId: string;
        qrCode: string;
        accessPointSubmission: string;
        nrsSubmissionStatus: string;
      };
      voidReason: string | null;
      voidedBy: { id: string; name: string; email: string } | null;
      voidedAt: string | null;
    };
  };

}



export interface ListInvoiceDeliveriesResponse {
  data: {
    id: string;
    invoice: { kind: string; id: string; code: string; name: string };
    recipient: string;
    template: string;
    trigger: string;
    status: string;
    requestedAt: string;
    sentAt: string | null;
    requestedBy: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

export interface CreateInvoiceDeliveryCredentials {
  recipientEmail: string;
  template: "REMINDER" | "STANDARD";
  message: string;
}

export interface CreateInvoiceDeliveryResponse {
  data: {
    id: string;
    invoice: { kind: string; id: string; code: string; name: string };
    recipient: string;
    template: string;
    trigger: string;
    status: string;
    requestedAt: string;
    sentAt: string | null;
    requestedBy: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface CreateInvoiceCreditNotedCredentials {
  reason:
    | "OVERCHARGE"
    | "DISCOUNT_GRANTED_AFTER_ISSUE"
    | "OTHER"
    | "PRICING_ERROR"
    | "DUPLICATE_BILLING"
    | "GOODWILL";
  reasonNote: string;
  lines: {
    invoiceLineId: string;
    quantity: number;
    amount: number;
  }[];
}

export interface CreateInvoiceCreditNotedResponse {
  data: {
    id: string;
    number: string;
    invoiceTypeCode: string;
    invoice: {
      id: string;
      number: string;
    };
    invoiceIssueDate: string;
    customer: { kind: string; id: string; code: string; name: string };
    buyerName: string;
    showroom: {
      id: string;
      name: string;
    };
    reason: string;
    reasonNote: string;
    lines: {
      id: string;
      invoiceLineId: string;
      lineNo: number;
      code: string;
      name: string;
      quantity: number;
      amount: number;
      unitPrice: number;
      vatRate: number;
      lineNet: number;
      vatAmount: number;
      lineTotal: number;
    }[];
    lineExtension: number;
    vat: number;
    total: number;
    appliedToInvoice: number;
    excessRefunded: number;
    issuedBy: {
      id: string;
      name: string;
      email: string;
    };
    issuedAt: string;
  };
}


export interface InvoiceHistoryResponse {
  data: Paged<{
    id: string;
    number: string;
    status: string;
    displayStatus: string;
    issued: string;
    due: string;
    customer: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    buyerName: string;
    customerType: string;
    location: {
      kind: string;
      id: string;
      code: string;
      name: string;
    };
    sourceType: string;
    source: string;
    sourceRef: string;
    proForma: string;
    waybills: string[];
    total: number;
    paid: number;
    credited: number;
    balance: number;
    daysOverdue: number;
    delivery: string;
  }>;
}

export interface InvoiceHistoryFilterResponse {
  data: {
    fields: {
      key: string;
      label: string;
      type: string;
      operators: string[];
      options: {
        value: string;
        label: string;
      }[];
      lookup: string | null;
      facetable: boolean;
      sortable: boolean;
      qualifierAliases: string[];
    }[];
    collections: unknown[];
    primaryDate: string | null;
    defaultSort: {
      field: string;
      dir: string;
    }[];
    periodPresets: string[];
  };
}