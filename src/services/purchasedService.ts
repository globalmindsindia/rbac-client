import { getApi } from "@/api/api";

export const purchasedService = {
  async getApplications(email: string) {
    const { data } = await getApi().post(
      "/v1/student-services/purchased-services",
      {
        email,
      }
    );
    return data?.data || [];
  },

  async getRedirectUrl(email: string, appId: string) {
    try {
      const { data } = await getApi().post("/v1/student-services/redirect", {
        email,
        appId,
      });

      // Return the redirect URL
      return data?.redirectUrl || null;
    } catch (err) {
      console.error("Failed to fetch redirect URL:", err);
      return null;
    }
  },
};
