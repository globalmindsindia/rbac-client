import DashboardLayout from "@/components/layouts/DashboardLayout";
import React, { useState, useEffect } from "react";
import { newsletterService } from "@/services/newsletterService";
import SubscriberManagement from "@/components/newsletter/SubscriberManagement";
import RichTextEditor from "@/components/newsletter/RichTextEditor";
import CampaignAnalytics from "@/components/newsletter/CampaignAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CalendarIcon,
  Send,
  Plus,
  Eye,
  Users,
  Mail,
  TrendingUp,
  Edit,
  Trash2,
  BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Campaign, NewsletterStats } from "@/types/newsletter.types";
import { Calendar } from "@/components/ui/calendar";

const NewsletterManagement = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
    scheduledAt: undefined as Date | undefined,
  });

  const [stats, setStats] = useState<NewsletterStats>({
    totalCampaigns: 0,
    totalSent: 0,
    totalSubscribers: 0,
    activeSubscribers: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await newsletterService.listCampaigns();
      const campaignsData = response.campaigns || [];
      setCampaigns(campaignsData);

      // Now pass those campaigns to loadStats
      await loadStats(campaignsData);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await newsletterService.listCampaigns();
      setCampaigns(response.campaigns || []);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (campaignsData?: Campaign[]) => {
    try {
      const response = await newsletterService.getStats();
      setStats({
        totalCampaigns: response.totalCampaigns,
        totalSent: response.totalSent,
        totalSubscribers: response.totalSubscribers,
        activeSubscribers: response.activeSubscribers,
        avgOpenRate: response.avgOpenRate,
        avgClickRate: response.avgClickRate,
      });
    } catch (error) {
      console.error("Failed to load stats, falling back:", error);
      const list = campaignsData || campaigns; // fallback if not provided
      const sentCampaigns = list.filter((c) => c.status === "sent");
      const totalSent = sentCampaigns.length;
      const avgOpenRate =
        sentCampaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) /
        (sentCampaigns.length || 1);
      const avgClickRate =
        sentCampaigns.reduce((acc, c) => acc + (c.clickRate || 0), 0) /
        (sentCampaigns.length || 1);

      setStats((prev) => ({
        ...prev,
        totalCampaigns: list.length,
        totalSent,
        avgOpenRate,
        avgClickRate,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subject: "",
      content: "",
      scheduledAt: undefined,
    });
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
      };
      if (formData.scheduledAt) {
        payload.scheduledAt = formData.scheduledAt.toISOString();
      }
      await newsletterService.createCampaign(payload);
      setIsCreateDialogOpen(false);
      resetForm();
      await loadCampaigns();
      await loadStats();
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const handleEditCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;
    try {
      const payload: any = {
        title: formData.title,
        subject: formData.subject,
        content: formData.content,
      };
      if (formData.scheduledAt) {
        payload.scheduledAt = formData.scheduledAt.toISOString();
      }
      await newsletterService.updateCampaign(selectedCampaign.id, payload);
      setIsEditDialogOpen(false);
      setSelectedCampaign(null);
      resetForm();
      await loadCampaigns();
      await loadStats();
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await newsletterService.deleteCampaign(campaignId);
      await loadCampaigns();
      await loadStats();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm("Send this campaign now?")) return;
    try {
      await newsletterService.sendCampaign(campaignId);
      await loadCampaigns();
      await loadStats();
    } catch (error) {
      console.error("Failed to send campaign:", error);
    }
  };

  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title,
      subject: campaign.subject,
      content: campaign.content,
      scheduledAt: campaign.scheduledAt
        ? new Date(campaign.scheduledAt)
        : undefined,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: Campaign["status"]) => {
    const variants = {
      draft: "secondary",
      scheduled: "default",
      sent: "outline",
    } as const;
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800",
    };
    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  const CampaignDialog = ({
    isOpen,
    onOpenChange,
    onSubmit,
    title: dialogTitle,
    isEdit = false,
  }: any) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter campaign title"
                required
              />
            </div>
            <div>
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, subject: e.target.value }))
                }
                placeholder="Enter email subject line"
                required
              />
            </div>
          </div>

          <div>
            <Label>Schedule Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.scheduledAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.scheduledAt
                    ? format(formData.scheduledAt, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.scheduledAt}
                  onSelect={(date) =>
                    setFormData((prev) => ({ ...prev, scheduledAt: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
              placeholder="Write your newsletter content here..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Campaign" : "Create Campaign"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
                setSelectedCampaign(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Newsletter Management
            </h1>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Campaigns"
            value={stats.totalCampaigns}
            icon={Mail}
            description="All campaigns created"
          />
          <StatCard
            title="Campaigns Sent"
            value={stats.totalSent}
            icon={Send}
            description="Successfully delivered"
          />
          <StatCard
            title="Active Subscribers"
            value={stats.activeSubscribers}
            icon={Users}
            description={`${stats.totalSubscribers} total`}
          />
          <StatCard
            title="Avg. Open Rate"
            value={`${stats.avgOpenRate.toFixed(1)}%`}
            icon={TrendingUp}
            description={`${stats.avgClickRate.toFixed(1)}% click rate`}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Campaigns ({campaigns.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No campaigns created yet
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      Create your first campaign
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{campaign.title}</h3>
                            {getStatusBadge(campaign.status)}
                            {campaign.status === "sent" &&
                              campaign.openRate && (
                                <Badge variant="outline">
                                  {campaign.openRate.toFixed(1)}% open rate
                                </Badge>
                              )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Subject: {campaign.subject}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Created:{" "}
                            {format(new Date(campaign.createdAt), "PPp")}
                            {campaign.scheduledAt && (
                              <span className="ml-2">
                                • Scheduled:{" "}
                                {format(new Date(campaign.scheduledAt), "PPp")}
                              </span>
                            )}
                            {campaign.sentAt && (
                              <span className="ml-2">
                                • Sent:{" "}
                                {format(new Date(campaign.sentAt), "PPp")}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {campaign.status === "sent" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setIsAnalyticsOpen(true);
                              }}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          )}

                          {campaign.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(campaign)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendCampaign(campaign.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {campaign.status !== "sent" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <SubscriberManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {selectedCampaign?.status === "sent" ? (
              <CampaignAnalytics campaignId={selectedCampaign.id} />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Select a sent campaign to view analytics
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Analytics are available for campaigns that have been sent to
                    subscribers
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <CampaignDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateCampaign}
          title="Create New Campaign"
        />

        <CampaignDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleEditCampaign}
          title="Edit Campaign"
          isEdit
        />

        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Campaign Preview</DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold text-lg">
                    {selectedCampaign.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Subject: {selectedCampaign.subject}
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <div className="whitespace-pre-wrap">
                    {selectedCampaign.content}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Campaign Analytics</DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <CampaignAnalytics campaignId={selectedCampaign.id} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default NewsletterManagement;
