
export interface CustomerHistoryReportsRequest {
  id: string;
  from: string;
to: string;
products:number
}

export interface CustomerHistoryReportsResponse {
  data: {
    customer: {
      id: string;
      code: string;
      name: string;
      type: string;
      typeLabel: string;
      status: string;
      isTemporary: boolean;
      phone: string;
      email: string;
      tin: string;
      address: string;
      city: string;
      stateCode: string;
      dealerCategoryName: string | null;
      correspondent: {
        id: string;
        code: string;
        name: string;
      } | null;
      location: {
        id: string;
        code: string;
        name: string;
        type: string;
      };
      creditLimit: number;
      walletBalance: number;
      depositBalance: number;
      ref: {
        id: string;
        code: string;
        name: string;
        type: string;
      };
    };
    period: {
      from: string;
      to: string;
      basis: string;
    };
    purchases: {
      orders: number;
      lines: number;
      quantity: number;
      gross: number;
      discounts: number;
      net: number;
      vat: number;
      total: number;
      averageOrderValue: number;
      firstPurchase: string | null;
      lastPurchase: string | null;
      outstanding: number;
      openInvoiceCount: number;
    };
    account: {
      credits: {
        count: number;
        amount: number;
      };
      debits: {
        count: number;
        amount: number;
      };
      net: number;
      wallet: {
        balanceType: string;
        currentBalance: number;
        credits: {
          count: number;
          amount: number;
        };
        debits: {
          count: number;
          amount: number;
        };
        net: number;
      };
      deposit: {
        balanceType: string;
        currentBalance: number;
        credits: {
          count: number;
          amount: number;
        };
        debits: {
          count: number;
          amount: number;
        };
        net: number;
      };
      byType: {
        type: string;
        count: number;
        amount: number;
      }[];
      recentTransactions: {
        id: string;
        date: string;
        type: string;
        amount: number;
      }[];
      truncated: boolean;
    };
    products: {
      stockItem: {
        id: string;
        code: string;
        name: string;
        itemType: string;
      };
      code: string;
      name: string;
      orders: number;
      quantity: number;
      net: number;
      vat: number;
      total: number;
      lastPurchased: string;
      shareOfNetPct: number;
    }[];
    openInvoices: {
      id: string;
      number: string;
      issueDate: string;
      dueDate: string;
      total: number;
      balance: number;
      ref: {
        id: string;
        number: string;
        status: string;
      };
    }[];
    generatedAt: string;
  };
}