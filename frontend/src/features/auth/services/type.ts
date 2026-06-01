export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  [key: string]: any;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  [key: string]: any;
}

export interface SignupPayload {
  [key: string]: any;
}

export interface CheckEmailExistsPayload {
  email: string;
}

export interface ResendVerificationEmailPayload {
  email: string;
}

export interface VerifyEmailPayload {
  token: string;
}
