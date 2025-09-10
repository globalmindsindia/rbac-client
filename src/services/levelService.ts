import { getApi } from "@/api/api";

export const levelService = {
  // Create a new level
  async createLevel(payload: any) {
    const { data } = await getApi().post("/v1/levels/", payload);
    return data;
  },

  // Get all levels
  async getLevels() {
    const { data } = await getApi().get("/v1/levels/");
    return data;
  },

  // Get single level by ID
  async getLevelById(id: string) {
    const { data } = await getApi().get(`/v1/levels/${id}`);
    return data;
  },

  // Update level
  async updateLevel(id: string, payload: any) {
    const { data } = await getApi().put(`/v1/levels/${id}`, payload);
    return data;
  },

  // Delete level (hard delete)
  async deleteLevel(id: string) {
    const { data } = await getApi().delete(`/v1/levels/${id}`);
    return data;
  },
};
