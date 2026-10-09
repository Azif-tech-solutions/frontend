/* ------------------------------------------------------------------ */
/*  AuthApi  Types                                                  */
/* ------------------------------------------------------------------ */

/** Shape of the data sent to the login endpoint. */
export interface LoginCredentials {
  email: string;
  password: string;
}


/** Shape of the Auth response. Adjust to match your backend. */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  activeTenantId: string;
  userId: string;
  tokenType?: string;
  expiresInSeconds?: number;
}

// The refresh endpoint returns the same shape as login

export interface LoginResponse {
  data: TokenResponse;
}

export interface RegistrationCredentials {
  adminEmail: string;
  adminDisplayName: string;
  companyName?: string;
  password: string;
}


export interface RegistrationResponseData {
 
  tenantId: string;
  userId: string;
  companyName: string;
  adminEmail: string;
  tokenResponse: TokenResponse;
}

export interface FullRegistrationResponseData  {
  data: RegistrationResponseData;
}



export type RefreshResponse = LoginResponse;
