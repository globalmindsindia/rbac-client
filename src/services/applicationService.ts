import { getApi } from "@/api/api";

export const applicationService = {
  async getApplications() {
    const { data } = await getApi().get("/v1/admin/applications");
    return data;
  },

  async upsertApplication(appData: any) {
    const { data } = await getApi().post(
      "/v1/admin/applications/upsert",
      appData
    );
    return data;
  },

  async updateApplication(id: string, appData: any) {
    const { data } = await getApi().put(`/v1/applications/${id}`, appData);
    return data;
  },

  async deleteApplication(id: string) {
    const { data } = await getApi().delete(`/v1/applications/${id}`);
    return data;
  },
};
