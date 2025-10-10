import DashboardLayout from "@/components/layouts/DashboardLayout";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  memo,
} from "react";
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
import { Calendar } from "@/components/ui/calendar";
import type { Campaign, NewsletterStats } from "@/types/newsletter.types";

/**
 * Types
 */
type CampaignFormData = {
  title: string;
  subject: string;
  content: string;
  attachmentName: string;
  id: string;
  scheduledAt?: Date;
};

type CampaignDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  isEdit?: boolean;
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleRemoveAttachment: (campaignId: string) => Promise<void>;
  resetForm: () => void;
  clearSelectedCampaign: () => void;
};

const DEFAULT_STATS: NewsletterStats = {
  totalCampaigns: 0,
  totalSent: 0,
  totalSubscribers: 0,
  activeSubscribers: 0,
  avgOpenRate: 0,
  avgClickRate: 0,
};

const INITIAL_FORM_DATA: CampaignFormData = {
  title: "",
  subject: "",
  content: "",
  attachmentName: "",
  id: "",
  scheduledAt: undefined,
};

/**
 * Stateless UI Components
 */
const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
});

const StatusBadge = memo(function StatusBadge({
  status,
  openRate,
}: {
  status: Campaign["status"];
  openRate?: number | null;
}) {
  const variants = {
    draft: "secondary",
    scheduled: "default",
    sent: "outline",
  } as const;

  const colors: Record<Campaign["status"], string> = {
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    sent: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={variants[status]} className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
      {status === "sent" && typeof openRate === "number" && (
        <Badge variant="outline">{openRate.toFixed(1)}% open rate</Badge>
      )}
    </div>
  );
});

const CampaignRow = memo(function CampaignRow({
  campaign,
  onPreview,
  onAnalytics,
  onEdit,
  onSend,
  onDelete,
}: {
  campaign: Campaign;
  onPreview: (c: Campaign) => void;
  onAnalytics: (c: Campaign) => void;
  onEdit: (c: Campaign) => void;
  onSend: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const createdAt = useMemo(
    () =>
      campaign.createdAt ? format(new Date(campaign.createdAt), "PPp") : "",
    [campaign.createdAt]
  );
  const scheduledAt = useMemo(
    () =>
      campaign.scheduledAt ? format(new Date(campaign.scheduledAt), "PPp") : "",
    [campaign.scheduledAt]
  );
  const sentAt = useMemo(
    () => (campaign.sentAt ? format(new Date(campaign.sentAt), "PPp") : ""),
    [campaign.sentAt]
  );

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold">{campaign.title}</h3>
          <StatusBadge status={campaign.status} openRate={campaign.openRate} />
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          Subject: {campaign.subject}
        </p>
        <p className="text-xs text-muted-foreground">
          Created: {createdAt}
          {scheduledAt && (
            <span className="ml-2">• Scheduled: {scheduledAt}</span>
          )}
          {sentAt && <span className="ml-2">• Sent: {sentAt}</span>}
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onPreview(campaign)}>
          <Eye className="h-4 w-4" />
        </Button>

        {campaign.status === "sent" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAnalytics(campaign)}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        )}

        {campaign.status === "draft" && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onEdit(campaign)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSend(campaign.id)}
              aria-label="Send campaign now"
              title="Send campaign now"
            >
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}

        {campaign.status !== "sent" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(campaign.id)}
            className="text-red-600 hover:text-red-700"
            aria-label="Delete campaign"
            title="Delete campaign"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
});

const CampaignDialog = memo(function CampaignDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  isEdit = false,
  formData,
  setFormData,
  selectedFile,
  setSelectedFile,
  handleRemoveAttachment,
  resetForm,
  clearSelectedCampaign,
}: CampaignDialogProps) {
  const onClose = useCallback(() => {
    onOpenChange(false);
    resetForm();
    clearSelectedCampaign();
    setSelectedFile(null);
  }, [onOpenChange, resetForm, clearSelectedCampaign, setSelectedFile]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? onOpenChange(true) : onClose())}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
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
                  setFormData((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                placeholder="Enter email subject line"
                required
              />
            </div>

            {/* PDF Upload */}
            <div>
              <Label>PDF Attachment (Optional)</Label>
              <Input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
                className="mt-2"
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              {!selectedFile && formData.attachmentName && (
                <div className="flex items-center justify-between mt-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    Current: {formData.attachmentName}
                  </span>
                  {formData.id && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAttachment(formData.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Date */}
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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.scheduledAt}
                  onSelect={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledAt: date ?? undefined,
                    }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Content Editor */}
          <div>
            <Label>Content</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(content: string) =>
                setFormData((prev) => ({ ...prev, content }))
              }
              placeholder="Write your newsletter content here..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {isEdit ? "Update Campaign" : "Create Campaign"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

/**
 * Main Component
 */
const NewsletterManagement = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const [formData, setFormData] = useState<CampaignFormData>(INITIAL_FORM_DATA);

  const [stats, setStats] = useState<NewsletterStats>(DEFAULT_STATS);
  const [isFetchingStats, setIsFetchingStats] = useState<boolean>(false);

  const statsCooldownRef = useRef<NodeJS.Timeout | null>(null);
  const unmountedRef = useRef<boolean>(false);
  const initialLoadRef = useRef<boolean>(false); // ✅ Prevent multiple initial loads

  // ✅ FIXED: Cleanup on unmount
  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      if (statsCooldownRef.current) {
        clearTimeout(statsCooldownRef.current);
      }
    };
  }, []);

  // ✅ FIXED: Stable resetForm without dependencies
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedFile(null);
  }, []);

  const clearSelectedCampaign = useCallback(() => {
    setSelectedCampaign(null);
  }, []);

  // ✅ FIXED: Remove campaigns dependency from computeFallbackStats
  const computeFallbackStats = useCallback((list: Campaign[]) => {
    const sentCampaigns = list.filter((c) => c.status === "sent");
    const totalSent = sentCampaigns.length;
    const avgOpenRate =
      sentCampaigns.reduce((acc, c) => acc + (c.openRate || 0), 0) /
      (sentCampaigns.length || 1);
    const avgClickRate =
      sentCampaigns.reduce((acc, c) => acc + (c.clickRate || 0), 0) /
      (sentCampaigns.length || 1);

    return {
      totalCampaigns: list.length,
      totalSent,
      avgOpenRate,
      avgClickRate,
    };
  }, []); // ✅ No dependencies

  // ✅ FIXED: loadCampaigns without unstable dependencies
  const loadCampaigns = useCallback(async (): Promise<Campaign[]> => {
    try {
      const response = await newsletterService.listCampaigns();
      const list = Array.isArray(response?.campaigns) ? response.campaigns : [];
      if (!unmountedRef.current) {
        setCampaigns(list);
      }
      return list;
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      if (!unmountedRef.current) {
        setCampaigns([]);
      }
      return [];
    }
  }, []); // ✅ No dependencies

  // ✅ FIXED: loadStats without campaigns dependency
  const loadStats = useCallback(
    async (campaignsData?: Campaign[]) => {
      if (isFetchingStats || unmountedRef.current) return;

      setIsFetchingStats(true);

      try {
        const response = await newsletterService.getStats();
        const data = response?.data;

        if (data && !unmountedRef.current) {
          setStats({
            totalCampaigns: data.totalCampaigns ?? 0,
            totalSent: data.totalSent ?? 0,
            totalSubscribers: data.totalSubscribers ?? 0,
            activeSubscribers: data.activeSubscribers ?? 0,
            avgOpenRate: data.avgOpenRate ?? 0,
            avgClickRate: data.avgClickRate ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to load stats, using fallback:", error);
        if (campaignsData) {
          const fallback = computeFallbackStats(campaignsData);
          if (!unmountedRef.current) {
            setStats((prev) => ({ ...prev, ...fallback }));
          }
        }
      } finally {
        if (statsCooldownRef.current) {
          clearTimeout(statsCooldownRef.current);
        }
        statsCooldownRef.current = setTimeout(() => {
          if (!unmountedRef.current) {
            setIsFetchingStats(false);
          }
        }, 4000);
      }
    },
    [isFetchingStats, computeFallbackStats] // ✅ Only include necessary dependencies
  );

  // ✅ FIXED: Single useEffect for initial load with dependency control
  useEffect(() => {
    if (initialLoadRef.current) return; // ✅ Prevent multiple initial loads

    initialLoadRef.current = true;

    const initialLoad = async () => {
      setLoading(true);
      try {
        const campaignsList = await loadCampaigns();
        await loadStats(campaignsList);
      } catch (error) {
        console.error("Initial load failed:", error);
      } finally {
        if (!unmountedRef.current) {
          setLoading(false);
        }
      }
    };

    initialLoad();
  }, []); // ✅ Empty dependency array for initial load only

  // ✅ FIXED: Create separate reload function that doesn't cause loops
  const reloadAllData = useCallback(async () => {
    try {
      const list = await loadCampaigns();
      await loadStats(list);
    } catch (error) {
      console.error("Failed to reload data:", error);
    }
  }, [loadCampaigns, loadStats]);

  /**
   * Handlers
   */
  const handleCreateCampaign = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const formDataObj = new FormData();
        formDataObj.append("title", formData.title.trim());
        formDataObj.append("subject", formData.subject.trim());
        formDataObj.append("content", formData.content);

        if (formData.scheduledAt && !isNaN(formData.scheduledAt.getTime())) {
          formDataObj.append("scheduledAt", formData.scheduledAt.toISOString());
        }

        if (selectedFile) {
          formDataObj.append("attachment", selectedFile);
        }

        await newsletterService.createCampaignWithAttachment(formDataObj);
        setIsCreateDialogOpen(false);
        resetForm();
        await reloadAllData();
      } catch (error) {
        console.error("Failed to create campaign:", error);
      }
    },
    [formData, selectedFile, resetForm, reloadAllData]
  );

  const handleEditCampaign = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!selectedCampaign) return;

      try {
        const payload: Partial<Campaign> & { scheduledAt?: string } = {
          title: formData.title.trim(),
          subject: formData.subject.trim(),
          content: formData.content,
        };

        if (formData.scheduledAt && !isNaN(formData.scheduledAt.getTime())) {
          payload.scheduledAt = formData.scheduledAt.toISOString();
        }

        await newsletterService.updateCampaign(selectedCampaign.id, payload);
        setIsEditDialogOpen(false);
        clearSelectedCampaign();
        resetForm();
        await reloadAllData();
      } catch (error) {
        console.error("Failed to update campaign:", error);
      }
    },
    [
      formData,
      selectedCampaign,
      resetForm,
      clearSelectedCampaign,
      reloadAllData,
    ]
  );

  const handleDeleteCampaign = useCallback(
    async (campaignId: string) => {
      if (!window.confirm("Are you sure you want to delete this campaign?"))
        return;
      try {
        await newsletterService.deleteCampaign(campaignId);
        await reloadAllData();
      } catch (error) {
        console.error("Failed to delete campaign:", error);
      }
    },
    [reloadAllData]
  );

  const handleSendCampaign = useCallback(
    async (campaignId: string) => {
      if (!window.confirm("Send this campaign now?")) return;
      try {
        await newsletterService.sendCampaign(campaignId);
        await reloadAllData();
      } catch (error) {
        console.error("Failed to send campaign:", error);
      }
    },
    [reloadAllData]
  );

  const handleRemoveAttachment = useCallback(
    async (campaignId: string) => {
      try {
        await newsletterService.removeAttachment(campaignId);
        await reloadAllData();
      } catch (error) {
        console.error("Failed to remove attachment:", error);
      }
    },
    [reloadAllData]
  );

  /**
   * UI Helpers
   */
  const openEditDialog = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      title: campaign.title ?? "",
      subject: campaign.subject ?? "",
      content: campaign.content ?? "",
      attachmentName: campaign.attachmentName || "",
      id: campaign.id,
      scheduledAt: campaign.scheduledAt
        ? new Date(campaign.scheduledAt)
        : undefined,
    });
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  }, []);

  const handleOpenPreview = useCallback((c: Campaign) => {
    setSelectedCampaign(c);
    setIsPreviewOpen(true);
  }, []);

  const handleOpenAnalytics = useCallback((c: Campaign) => {
    setSelectedCampaign(c);
    setIsAnalyticsOpen(true);
  }, []);

  const totalSubscribersDescription = useMemo(
    () => `${stats.totalSubscribers} total`,
    [stats.totalSubscribers]
  );

  const avgRatesDescription = useMemo(
    () => `${(stats.avgClickRate ?? 0).toFixed(1)}% click rate`,
    [stats.avgClickRate]
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
            description={totalSubscribersDescription}
          />
          <StatCard
            title="Avg. Open Rate"
            value={`${(stats.avgOpenRate ?? 0).toFixed(1)}%`}
            icon={TrendingUp}
            description={avgRatesDescription}
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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
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
                      <CampaignRow
                        key={campaign.id}
                        campaign={campaign}
                        onPreview={handleOpenPreview}
                        onAnalytics={handleOpenAnalytics}
                        onEdit={openEditDialog}
                        onSend={handleSendCampaign}
                        onDelete={handleDeleteCampaign}
                      />
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

        {/* Create Dialog */}
        <CampaignDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateCampaign}
          title="Create New Campaign"
          isEdit={false}
          formData={formData}
          setFormData={setFormData}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleRemoveAttachment={handleRemoveAttachment}
          resetForm={resetForm}
          clearSelectedCampaign={clearSelectedCampaign}
        />

        {/* Edit Dialog */}
        <CampaignDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleEditCampaign}
          title="Edit Campaign"
          isEdit
          formData={formData}
          setFormData={setFormData}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleRemoveAttachment={handleRemoveAttachment}
          resetForm={resetForm}
          clearSelectedCampaign={clearSelectedCampaign}
        />

        {/* Preview Dialog */}
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

        {/* Analytics Dialog */}
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
