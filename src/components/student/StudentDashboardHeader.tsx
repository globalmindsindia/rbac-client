import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
    <header className="bg-gradient-card shadow-soft rounded-xl p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-4 ring-primary/20">
            <AvatarImage src="" alt={studentName} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {studentName}!
            </h1>
            <p className="text-muted-foreground">
              Welcome to Global Minds India Student Dashboard
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentDashboardHeader;
