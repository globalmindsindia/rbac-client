// components/newsletter/CampaignAnalytics.tsx
import React, { useState, useEffect } from "react";
import { newsletterService } from "@/services/newsletterService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Mail,
  Eye,
  MousePointer,
  Users,
  Calendar,
  BarChart3,
  PieChart,
} from "lucide-react";
import { format } from "date-fns";

interface CampaignAnalyticsProps {
  campaignId?: string;
}

interface AnalyticsData {
  campaignId: string;
  title: string;
  sentAt: string;
  recipientCount: number;
  deliveredCount: number;
  openCount: number;
  clickCount: number;
  unsubscribeCount: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  topLinks?: Array<{ url: string; clicks: number }>;
  openTimes?: Array<{ hour: number; count: number }>;
}

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  campaignId,
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campaignId) {
      loadAnalytics();
    }
  }, [campaignId]);

  const loadAnalytics = async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      const data = await newsletterService.getCampaignAnalytics(campaignId);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    description,
    trend,
  }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex flex-col items-end">
            <Icon className="h-8 w-8 text-muted-foreground" />
            {trend && (
              <Badge
                variant={trend.type === "positive" ? "default" : "secondary"}
                className="mt-2"
              >
                {trend.value}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Campaign Analytics
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {analytics.title}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                Sent: {format(new Date(analytics.sentAt), "PPp")}
              </p>
              <Badge variant="outline">Campaign #{analytics.campaignId}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Recipients"
          value={analytics.recipientCount.toLocaleString()}
          icon={Users}
          description="Total sent"
        />
        <MetricCard
          title="Open Rate"
          value={`${analytics.openRate.toFixed(1)}%`}
          icon={Eye}
          description={`${analytics.openCount} opens`}
        />
        <MetricCard
          title="Click Rate"
          value={`${analytics.clickRate.toFixed(1)}%`}
          icon={MousePointer}
          description={`${analytics.clickCount} clicks`}
        />
        <MetricCard
          title="Unsubscribes"
          value={analytics.unsubscribeCount}
          icon={TrendingUp}
          description={`${analytics.unsubscribeRate.toFixed(2)}% rate`}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="links">Top Links</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Delivered</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (analytics.deliveredCount /
                                analytics.recipientCount) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {(
                          (analytics.deliveredCount /
                            analytics.recipientCount) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Opened</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${analytics.openRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.openRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clicked</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${analytics.clickRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.clickRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparison to Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Your Open Rate
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics.openRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Industry avg: 21.3%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Your Click Rate
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics.clickRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Industry avg: 2.6%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Open Times Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.openTimes && analytics.openTimes.length > 0 ? (
                <div className="space-y-2">
                  {analytics.openTimes.map((item) => (
                    <div key={item.hour} className="flex items-center gap-3">
                      <span className="text-sm w-16">{item.hour}:00</span>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (item.count /
                                Math.max(
                                  ...analytics.openTimes!.map((h) => h.count)
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No engagement timing data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Clicked Links</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topLinks && analytics.topLinks.length > 0 ? (
                <div className="space-y-3">
                  {analytics.topLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          title={link.url}
                        >
                          {link.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{link.clicks} clicks</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No link click data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignAnalytics;
