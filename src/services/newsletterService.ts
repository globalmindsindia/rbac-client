// services/newsletterService.ts
import { getApi } from "@/api/api";
import {
  Campaign,
  Subscriber,
  NewsletterStats,
  CreateCampaignPayload,
} from "@/types/newsletter.types";

export const newsletterService = {
  // Campaign operations
  async createCampaign(payload: CreateCampaignPayload) {
    const { data } = await getApi().post("/v1/newsletter/campaign", payload);
    return data;
  },

  async updateCampaign(
    campaignId: string,
    payload: Partial<CreateCampaignPayload>
  ) {
    const { data } = await getApi().put(
      `/v1/newsletter/campaign/${campaignId}`,
      payload
    );
    return data;
  },

  async deleteCampaign(campaignId: string) {
    const { data } = await getApi().delete(
      `/v1/newsletter/campaign/${campaignId}`
    );
    return data;
  },

  async sendCampaign(campaignId: string) {
    const { data } = await getApi().post(
      `/v1/newsletter/campaign/${campaignId}/send`
    );
    return data;
  },

  async listCampaigns(params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data } = await getApi().get("/v1/newsletter/campaigns", { params });
    return data;
  },

  async getCampaign(campaignId: string) {
    const { data } = await getApi().get(
      `/v1/newsletter/campaign/${campaignId}`
    );
    return data;
  },

  // Subscriber operations
  async subscribe(email: string, source?: string) {
    const { data } = await getApi().post("/v1/newsletter/subscribe", {
      email,
      source,
    });
    return data;
  },

  async unsubscribe(email: string) {
    const { data } = await getApi().post("/v1/newsletter/unsubscribe", {
      email,
    });
    return data;
  },

  async listSubscribers(params?: {
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { data } = await getApi().get("/v1/newsletter/subscribers", {
      params,
    });
    return data;
  },

  async deleteSubscriber(subscriberId: string) {
    const { data } = await getApi().delete(
      `/v1/newsletter/subscriber/${subscriberId}`
    );
    return data;
  },

  // Analytics and stats
  async getStats() {
    const { data } = await getApi().get("/v1/newsletter/stats");
    return data;
  },

  async getCampaignAnalytics(campaignId: string) {
    const { data } = await getApi().get(
      `/v1/newsletter/campaign/${campaignId}/analytics`
    );
    return data;
  },

  // Bulk operations
  async importSubscribers(subscribers: { email: string; source?: string }[]) {
    const { data } = await getApi().post(
      "/v1/newsletter/subscribers/bulk-import",
      { subscribers }
    );
    return data;
  },

  async exportSubscribers(format: "csv" | "json" = "csv") {
    const { data } = await getApi().get(
      `/v1/newsletter/subscribers/export?format=${format}`
    );
    return data;
  },

  // Campaign attachments (using getApi instead of fetch)
  async createCampaignWithAttachment(formData: FormData) {
    const { data } = await getApi().post("/v1/newsletter/campaigns", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async updateCampaignWithAttachment(id: string, formData: FormData) {
    const { data } = await getApi().put(
      `/v1/newsletter/campaigns/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  },

  async removeAttachment(campaignId: string) {
    const { data } = await getApi().delete(
      `/v1/newsletter/campaigns/${campaignId}/attachment`
    );
    return data;
  },
};
