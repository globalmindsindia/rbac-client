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

          <main className="flex-1 px-3 xs:px-4 sm:px-6 py-3 xs:py-4 sm:py-6">
            {showSidebarToggle && (
              <div className="mb-3 xs:mb-4 sm:mb-6 md:hidden">
                <SidebarTrigger className="p-1.5 xs:p-2 rounded-md text-xs xs:text-sm hover:bg-accent hover:text-accent-foreground" />
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