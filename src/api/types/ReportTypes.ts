export interface GetReportSCICredentials{
    scope: string;//COMPANY
    locationId?:string;
    from:string;
    to:string;
    compare:string;//PRIOR_PERIOD
}

export interface ReportSCIPeriod {
  from: string;
  to: string;
  basis: string;
}

export interface ReportSCILine {
  label: string;
  values: number[];
  changePct: number;
  note: string;
}

export interface ReportSCISection {
  title: string;
  cost: boolean;
  lines: ReportSCILine[];
  subtotal: ReportSCILine;
}

export interface GetReportSCIResponseData {
  scope: string;
  period: ReportSCIPeriod;
  comparison: ReportSCIPeriod;
  columns: string[];
  sections: ReportSCISection[];
  result: ReportSCILine;
  stats: Record<string, unknown>;
  basisOfPreparation: string;
  costVisible: boolean;
}

export interface GetReportSCIResponse {
  data: GetReportSCIResponseData;
}