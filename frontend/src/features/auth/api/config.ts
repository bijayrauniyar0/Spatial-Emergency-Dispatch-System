import { Config } from "@/lib/api-shared";

export const authConfig: Config = {
  resource: "auth",
  paths: {
    post: {
      login: "/auth/login",
      register: "/auth/signup",
      forgotPassword: "/auth/forgot-password",
      resetPassword: "/auth/reset-forgot-password",
      checkEmailExists: "/auth/check-email-exists",
      resendVerificationEmail: "/auth/resend-verification-mail",
      verifyEmail: "/auth/verify-email",
      logoutUser: "/auth/log-out",
    },
    get: {
      checkLogin: "/auth/check-login",
    },
  },
};
