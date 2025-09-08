import React from "react";
import { useAuth } from "@/auth/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showSidebarToggle?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showSidebarToggle = true,
}) => {
  const { user, selectedApp } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-6 py-4">
            {showSidebarToggle && (
              <div className="mb-4 md:hidden">
                <SidebarTrigger />
              </div>
            )}

            {children}
          </main>

          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
