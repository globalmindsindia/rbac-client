import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Settings } from "lucide-react";
import { Button } from "../ui/button";

interface DashboardHeaderProps {
  studentName: string;
  notifications: number;
}

const StudentDashboardHeader = ({
  studentName,
  notifications,
}: DashboardHeaderProps) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <header className="bg-white border border-gray-100 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt={studentName} />
            <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {greeting}, {studentName}!
            </h1>
            <p className="text-sm text-gray-600">
              Global Minds India Student Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StudentDashboardHeader;
