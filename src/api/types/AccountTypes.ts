

export interface VatCategory {
  id:string;
  code: string;
  name: string;
  rate: number;
  inputVatRecoverable: boolean;
  description: string;
  nrsTaxCategoryCode: string;
}

export interface VatCategoryResponse {
  
  data: VatCategory[];
}


export interface IsicSections {
  id:string;
  code: string;
  name: string;
}

export interface IsicSectionsResponse {
  data: IsicSections[];
}

export interface HsnSections {
  id:string;
  code: string;
  chapterRange: string;
  name: string;
}

export interface HsnSectionsResponse {
  data: HsnSections[];
}