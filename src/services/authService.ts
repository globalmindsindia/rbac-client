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
    const { data } = await getApi().post("/v1/auth//password-reset", {
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
};
