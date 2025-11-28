// src/services/mastersCourseService.ts
import axios from "axios";

// const BASE_URL = "https://rbacapi.globalmindsindia.in";
const BASE_URL = "http://localhost:5080";

export const masterCourseService = {
  /**
   * 🟢 Bulk create/update (used by "Create" button in combobox)
   */
  async upsert(payload: any) {
    const res = await axios.post(`${BASE_URL}/v1/masters-courses`, payload);
    return res.data;
  },

  /**
   * 🟢 Get countries with pagination and optional search
   */
  async getPaginated(page = 1, limit = 20, search = "") {
    const res = await axios.get(`${BASE_URL}/v1/masters-courses/paginated`, {
      params: { page, limit, search },
    });
    return res.data;
  },

  /**
   * 🟢 Get universities by country (supports pagination & search)
   */
  async getUniversities(country: string, page = 1, limit = 25, search = "") {
    const res = await axios.get(
      `${BASE_URL}/v1/masters-courses/${encodeURIComponent(
        country
      )}/universities`,
      {
        params: { page, limit, search },
      }
    );
    return res.data;
  },

  /**
   * 🟢 Get courses by country (supports pagination & search)
   */
  async getCourses(country: string, page = 1, limit = 25, search = "") {
    const res = await axios.get(
      `${BASE_URL}/v1/masters-courses/${encodeURIComponent(country)}/courses`,
      {
        params: { page, limit, search },
      }
    );
    return res.data;
  },
};
