export interface GetVatReportCredentials{
    locationId:string;
    from:string;
    to:string;
    type?:string;
}
export interface GetVatReportResponse {
  data: {
    header: {
      location: { kind: string; id: string; code: string; name: string };
      vatEnabled: boolean;
      currentRate: number;
      rateChanges: {
        rate: number;
        effectiveFrom: string;
      }[];
      outputVat: number;
      outputBase: number;
      inputVat: number;
      inputBase: number;
      netVatPayable: number;
      costVisible: boolean;
    };
    rows: {
      date: string;
      document: string;
      counterparty: string;
      counterpartyTin: string;
      description: string;
      type: string;
      taxableAmount: number;
      rate: number;
      vat: number;
    }[];
  };
}