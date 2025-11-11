// src/services/mastersCourseService.ts
import { getApi } from "@/api/api";

export const masterCourseService = {
  async getAll() {
    const res = await getApi().get("/v1/masters-courses");
    return res.data?.data || []; // ✅ unwrap the array
  },

  async getById(id: string) {
    const res = await getApi().get(`/v1/masters-courses/${id}`);
    return res.data?.data || null; // ✅ unwrap the object
  },

  async upsert(payload: any) {
    const res = await getApi().post("/v1/masters-courses", payload);
    return res.data; // could be { success, message }
  },

  async delete(id: string) {
    const res = await getApi().delete(`/v1/masters-courses/${id}`);
    return res.data;
  },

  async downloadTemplate() {
    const api = getApi();
    const res = await api.get("/v1/masters-courses/template/download", {
      responseType: "blob",
    });
    return res.data;
  },

  async importCsv(formData: FormData, onUploadProgress?: (e: any) => void) {
    const api = getApi();
    const res = await api.post("/v1/masters-courses/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return res.data;
  },
};
