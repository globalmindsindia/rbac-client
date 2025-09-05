import { useAuth } from "@/auth/AuthContext";
import React from "react";
import Header from "@/components/Header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import StudentDashboardHeader from "@/components/student/StudentDashboardHeader";
import ServicesPieChart from "@/components/student/ServicesPieChart";
import CrossSellSection from "@/components/student/CrossSellSection";

const StudentDashboard = () => {
  const { user, selectedApp } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Header & Toggle */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div className="p-6">
                <div className="max-w-7xl mx-auto">
                  <StudentDashboardHeader
                    studentName={user?.firstName || "Student"}
                    notifications={0}
                  />

                  <div className="space-y-8">
                    <ServicesPieChart studentName={user?.firstName} />
                    <CrossSellSection />
                  </div>
                </div>
              </div>
            </div>

            {/* Add more dashboard content here */}
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
