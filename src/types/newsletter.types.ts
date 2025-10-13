// types/newsletter.ts
export interface Campaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  recipientCount?: number;
  openRate?: number;
  clickRate?: number;
  attachmentName?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string;
  source?: string;
}

export interface NewsletterStats {
  totalCampaigns: number;
  totalSent: number;
  totalSubscribers: number;
  activeSubscribers: number;
  avgOpenRate: number;
  avgClickRate: number;
}

export interface CreateCampaignPayload {
  title: string;
  subject: string;
  content: string;
  scheduledAt?: string | Date;
}
