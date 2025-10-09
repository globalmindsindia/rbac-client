// components/newsletter/SubscriberManagement.tsx
import React, { useState, useEffect } from "react";
import { newsletterService } from "@/services/newsletterService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Download, Upload, Search, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { Subscriber } from "@/types/newsletter.types";

const SubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const response = await newsletterService.listSubscribers();
      setSubscribers(response.subscribers || []);
    } catch (error) {
      console.error("Failed to load subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await newsletterService.subscribe(newEmail, "admin-added");
      setNewEmail("");
      setIsAddDialogOpen(false);
      await loadSubscribers();
    } catch (error) {
      console.error("Failed to add subscriber:", error);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      try {
        await newsletterService.deleteSubscriber(subscriberId);
        await loadSubscribers();
      } catch (error) {
        console.error("Failed to delete subscriber:", error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await newsletterService.exportSubscribers("csv");
      // Create and download file
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export subscribers:", error);
    }
  };

  const filteredSubscribers = subscribers.filter((subscriber) =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subscribers.filter((s) => s.isActive).length;
  const inactiveCount = subscribers.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Subscriber
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subscriber</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubscriber} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Add Subscriber
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <div className="text-sm text-muted-foreground">
              Total Subscribers
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeCount}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {inactiveCount}
            </div>
            <div className="text-sm text-muted-foreground">Unsubscribed</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Subscribers ({filteredSubscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No subscribers match your search"
                  : "No subscribers yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{subscriber.email}</span>
                      <Badge
                        variant={subscriber.isActive ? "default" : "secondary"}
                      >
                        {subscriber.isActive ? "Active" : "Unsubscribed"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Subscribed:{" "}
                      {format(new Date(subscriber.subscribedAt), "PPp")}
                      {subscriber.source && (
                        <span className="ml-2">
                          • Source: {subscriber.source}
                        </span>
                      )}
                      {subscriber.unsubscribedAt && (
                        <span className="ml-2">
                          • Unsubscribed:{" "}
                          {format(new Date(subscriber.unsubscribedAt), "PPp")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriberManagement;
