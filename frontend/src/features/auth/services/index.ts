// Export the auth resource for use with hooks
export { authResource } from "../api/resource";

// Type exports for payloads
export type {
  CheckEmailExistsPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResendVerificationEmailPayload,
  ResetPasswordPayload,
  SignupPayload,
  VerifyEmailPayload,
} from "./type";
