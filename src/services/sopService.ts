// src/services/sopService.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // Flask backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

export const sopService = {
  // Send FormData with "payload" (JSON string) and "resume" (File)
  async submitSop(appData: FormData) {
    const { data } = await api.post("/api/v1/sop/submit", appData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data as { message: string; id: number };
  },

  // Quality check
  async sopQualityCheck(sop_id: number) {
    const { data } = await api.post(`/api/v1/sop/quality-check/${sop_id}`);
    return data as {
      success: boolean;
      error: string | null;
      details: any;
      data: {
        phase: string;
        quality_result: {
          current_score: number;
          questions_to_improve: string[];
        };
      };
    };
  },

  // Improvement suggestions
  async improvementSuggestions(
    sop_id: number,
    payload: { improvement_answers: Record<string, string> }
  ) {
    const { data } = await api.post(`/api/v1/sop/finalize/${sop_id}`, payload);
    return data as {
      message: string;
      sop_path: string;
      email_sent: boolean;
    };
  },

  async finalize(sop_id: number): Promise<Blob> {
    const { data } = await api.post(
      `/api/v1/sop/admin/finalize/${sop_id}`,
      {},
      {
        responseType: "blob", // 👈 important
      }
    );
    return data; // this will be the PDF binary blob
  },
};
