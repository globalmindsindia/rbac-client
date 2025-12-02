import { getApi } from "@/api/api";

export const studentService = {
  async getStudents() {
    const { data } = await getApi().get("/v1/students");
    return data;
  },

  async createStudent(payload) {
    const { data } = await getApi().post("/v1/students", payload);
    return data;
  },

  async updateStudent(id, payload) {
    const { data } = await getApi().put(`/v1/students/${id}`, payload);
    return data;
  },

  async deleteStudent(id) {
    const { data } = await getApi().delete(`/v1/students/${id}`);
    return data;
  },

  // Reinvite
  async sendInvite(email) {
    const { data } = await getApi().post("/v1/students/reinvite", { email });
    return data;
  },

  // Applications
  async getAllApplications() {
    const { data } = await getApi().get("/v1/students/applications/all");
    return data;
  },

  async getUserApplications(id) {
    const { data } = await getApi().get(`/v1/students/${id}/applications`);
    return data;
  },

  async updateUserApplications(id, applicationIds) {
    const { data } = await getApi().put(`/v1/students/${id}/applications`, {
      applicationIds,
    });
    return data;
  },
};
