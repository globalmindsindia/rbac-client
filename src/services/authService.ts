import { getApi } from "@/api/api";

export const authService = {
  async forgotPassword(email: string) {
    const { data } = await getApi().post("/v1/auth/password-reset-request", {
      email,
    });
    return data;
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const { data } = await getApi().post("/v1/auth/password-reset", {
      token,
      newPassword,
      confirmPassword,
    });
    return data;
  },

  async verifyResetToken(token: string) {
    const { data } = await getApi().get("/v1/auth/verify-reset-token", {
      params: { token },
    });
    return data;
  },

  // Request a new OTP for the given email
  async requestOtp(email: string) {
    const { data } = await getApi().post("/v1/users/otp/request", { email });
    return data;
  },

  // Verify the OTP + email combination
  async verifyOtp(email: string, otp: string) {
    const { data } = await getApi().get("/v1/users/otp/verify", {
      params: { email, code: otp },
    });
    return data;
  },

  // Resend OTP for the given email
  async resendOtp(email: string) {
    const { data } = await getApi().post("/v1/users/otp/request", { email });
    return data;
  },

  async loginWithOtp(email: string) {
    const { data } = await getApi().post("/v1/users/login-with-otp", { email });
    return data;
  },
};
