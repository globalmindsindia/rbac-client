import { getApi } from "@/api/api";

export const zohoService = {
  //   async zohoOAuth(code: string) {
  //     const { data } = await getApi().post(
  //       "/v1/users/zoho/login",
  //       { code },
  //       { withCredentials: true }
  //     );
  //     return data;
  //   },

  async getEmployeeProfile() {
    const { data } = await getApi().get("/v1/users/zoho/profile", {
      withCredentials: true,
    });
    return data;
  },
};
