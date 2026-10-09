export type OnboardingStepKey = "COMPANY" | "BRANCH" | "FACTORY";

export interface OnboardingStep {
  key: OnboardingStepKey;
  done: boolean;
  skipped: boolean;
}

export interface OnboardingStatus {
  completed: boolean;
  completedAt: string | null; // ISO timestamp, e.g. "2026-10-09T15:57:27.473701Z"
  steps: OnboardingStep[];
}

export interface FullOnboardingStatusResponse {
  data: OnboardingStatus;
}


export interface UpdateCompanyCredentials {

  tradingName: string;
  legalName: string;
  registrationNumber: string;
  tin: string;
  vatRegistrationNumber: string;
  businessDescription: string;
  email: string;
  phone: string;
  website: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  stateCode: string;
  lgaCode: string;
  countryCode: string;
  documentFooter: string;
  hasLogo: boolean,
  logoUpdatedAt : string,
  financialYearStartMonth: number;
}


export interface UpdateCompanyResponse {
  data: UpdateCompanyCredentials;

}

export interface FullUpdateCompanyResponseData {
  data: UpdateCompanyResponse;
}

export interface FullGetCompanyProfile{
 data:UpdateCompanyResponse;
}