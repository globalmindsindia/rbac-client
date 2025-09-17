import { getApi } from "@/api/api";

export const leadService = {
  async getLeads(params?: { startDate?: string; endDate?: string }) {
    const { data } = await getApi().get("/v1/leads", { params });
    return data;
  },

  async deleteLead(id: string) {
    const { data } = await getApi().delete(`/v1/leads/${id}`);
    return data;
  },

  async exportLeads(params?: { startDate?: string; endDate?: string }) {
    const response = await getApi().get("/v1/leads/export", {
      params,
      responseType: "blob", // important for file download
    });

    // Create download link
    const disposition = response.headers["content-disposition"];
    let filename = "leads.xlsx";
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/"/g, "");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
