// hooks/useNewsletter.ts
import { useState, useEffect } from "react";
import { newsletterService } from "@/services/newsletterService";
import {
  Campaign,
  Subscriber,
  NewsletterStats,
} from "@/types/newsletter.types";

export const useNewsletterCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsletterService.listCampaigns();
      setCampaigns(response.campaigns || []);
    } catch (err) {
      setError("Failed to load campaigns");
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (payload: any) => {
    try {
      await newsletterService.createCampaign(payload);
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      console.error("Failed to create campaign:", err);
      return { success: false, error: "Failed to create campaign" };
    }
  };

  const updateCampaign = async (id: string, payload: any) => {
    try {
      await newsletterService.updateCampaign(id, payload);
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      console.error("Failed to update campaign:", err);
      return { success: false, error: "Failed to update campaign" };
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      await newsletterService.deleteCampaign(id);
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      return { success: false, error: "Failed to delete campaign" };
    }
  };

  const sendCampaign = async (id: string) => {
    try {
      await newsletterService.sendCampaign(id);
      await loadCampaigns();
      return { success: true };
    } catch (err) {
      console.error("Failed to send campaign:", err);
      return { success: false, error: "Failed to send campaign" };
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    refetch: loadCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    sendCampaign,
  };
};

export const useNewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsletterService.listSubscribers();
      setSubscribers(response.subscribers || []);
    } catch (err) {
      setError("Failed to load subscribers");
      console.error("Failed to load subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSubscriber = async (email: string, source?: string) => {
    try {
      await newsletterService.subscribe(email, source);
      await loadSubscribers();
      return { success: true };
    } catch (err) {
      console.error("Failed to add subscriber:", err);
      return { success: false, error: "Failed to add subscriber" };
    }
  };

  const removeSubscriber = async (id: string) => {
    try {
      await newsletterService.deleteSubscriber(id);
      await loadSubscribers();
      return { success: true };
    } catch (err) {
      console.error("Failed to remove subscriber:", err);
      return { success: false, error: "Failed to remove subscriber" };
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  return {
    subscribers,
    loading,
    error,
    refetch: loadSubscribers,
    addSubscriber,
    removeSubscriber,
  };
};

export const useNewsletterStats = () => {
  const [stats, setStats] = useState<NewsletterStats>({
    totalCampaigns: 0,
    totalSent: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsletterService.getStats();
      setStats(response);
    } catch (err) {
      setError("Failed to load stats");
      console.error("Failed to load stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
};
