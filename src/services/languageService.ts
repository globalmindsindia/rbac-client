import { getApi } from "@/api/api";

export const languageService = {
  // Create a new language
  async createLanguage(payload: any) {
    const { data } = await getApi().post("/v1/languages/", payload);
    return data;
  },

  // Get all languages
  async getLanguages() {
    const { data } = await getApi().get("/v1/languages/");
    return data;
  },

  // Get single language by ID
  async getLanguageById(id: string) {
    const { data } = await getApi().get(`/v1/languages/${id}`);
    return data;
  },

  // Update language
  async updateLanguage(id: string, payload: any) {
    const { data } = await getApi().put(`/v1/languages/${id}`, payload);
    return data;
  },

  // Deactivate (soft delete)
  async deactivateLanguage(id: string) {
    const { data } = await getApi().delete(`/v1/languages/${id}`);
    return data;
  },
};
