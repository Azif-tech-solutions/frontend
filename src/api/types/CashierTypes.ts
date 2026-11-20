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