import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface DashboardHeaderProps {
  studentName: string;
}

const StudentDashboardHeader = ({
  studentName,
}: DashboardHeaderProps) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
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
        <p className="text-sm font-medium text-foreground">
          {greeting}, {studentName}!
        </p>
        <p className="text-xs text-muted-foreground">
          Welcome to your study abroad journey
        </p>
      </div>
    </div>
  );
};

export default StudentDashboardHeader;
