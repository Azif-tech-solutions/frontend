//OTPTypes.ts

export interface OtpChallengeCredentials{
    purpose: "WALLET_WITHDRAWAL" | "QUANTITY_ADJUSTMENT";
    targetReference: string;//can be an empty string
    context?: {
        amount?: number;//in cents
    }
}

export interface OtpChallengeResponse{
   data:{ 
    challengeId: string;
    status: string;
    expiresAt: string;
}}

export interface OtpIssureResponse{
   data:{ 
    challengeId: string;
    code: string;
    expiresAt: string;
}}

export interface OtpVerifyCredentials{
    code: string;
}
export interface OtpVerifyResponse{
   data:{ 
    verified: boolean;
    
}}