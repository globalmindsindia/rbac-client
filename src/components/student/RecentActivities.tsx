import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      action: "Document uploaded",
      description: "Passport copy submitted",
      timestamp: "2 hours ago",
      status: "completed",
      icon: CheckCircle,
    },
    {
      id: 2,
      action: "Payment processed",
      description: "Visa consultation fee",
      timestamp: "1 day ago",
      status: "completed",
      icon: CheckCircle,
    },
    {
      id: 3,
      action: "Action required",
      description: "Complete profile information",
      timestamp: "2 days ago",
      status: "pending",
      icon: AlertCircle,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
            >
              <activity.icon
                className={`h-4 w-4 mt-0.5 ${
                  activity.status === "completed"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {activity.timestamp}
                  </span>
                  <Badge
                    variant={
                      activity.status === "completed" ? "default" : "secondary"
                    }
                    className="h-4 text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
