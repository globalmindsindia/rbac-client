// src/services/sopService.ts
import axios from "axios";

// Create axios instance with your base URL
const api = axios.create({
  baseURL: "https://api.sop.globalmindsindia.in",
});

export const sopService = {
  // Validate resume name match
  async validateResume(name: string, resume: File) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("resume", resume);

    const { data } = await api.post("/api/v1/sop/validate_resume", formData);
    return data as { key: boolean; message?: string };
  },

  // Send FormData with "payload" (JSON string) and "resume" (File)
  async submitSop(appData: FormData) {
    const { data } = await api.post("/api/v1/sop/submit", appData);
    return data as { message: string; id: number };
  },

  // Quality Check
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

  // Improvement Suggestions
  async improvementSuggestions(
    sop_id: number,
    payload: { improvement_answers: Record<string, string> }
  ) {
    const { data } = await api.post(`/api/v1/sop/finalize/${sop_id}`, payload);
    return data as {
      message: string;
      sop_id: string;
      success: boolean;
    };
  },

  // Verify Payment (if needed)
  async verifyPayment(sop_id: number) {
    const { data } = await api.post(`/api/v1/sop/verify-payment/${sop_id}`);
    return data as { message: string; success: boolean };
  },
};
