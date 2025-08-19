import { getApi } from "@/api/api";

export const roleService = {
  async createRole(appData: any) {
    const { data } = await getApi().post("/v1/roles", appData);
    return data;
  },

  async updateRole(id: string, appData: any) {
    const { data } = await getApi().put(`/v1/roles/${id}`, appData);
    return data;
  },

  async deleteRole(id: string) {
    const { data } = await getApi().delete(`/v1/roles/${id}`);
    return data;
  },
};
