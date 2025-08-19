import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/forms/ApplicationForm";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { applicationService } from "@/services/applicationService";
import { AppWindow, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";

const ApplicationManagement = () => {
  const [applications, setApplications] = useState<any[]>([]);

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      const data = await applicationService.getApplications(); // ← Make sure this calls GET /applications
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpsert = async (data: any) => {
    await applicationService.upsertApplication(data);
    fetchApplications(); // refresh table
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <SidebarInset className="flex-1">
          {/* Global Page Header */}
          <Header />

          <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
            {/* Page Title + Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-3xl font-bold text-foreground">
                  Application Management
                </h1>
              </div>

              {/* Add Application Button */}
              <ApplicationForm
                mode="add"
                onSubmit={handleUpsert}
                trigger={
                  <Button size="sm" className="flex items-center gap-2">
                    <AppWindow className="h-4 w-4" />
                    Add Application
                  </Button>
                }
              />
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Domain</th>
                    <th className="px-4 py-2 border">Roles</th>
                    <th className="px-4 py-2 border">Users</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{app.name}</td>
                        <td className="px-4 py-2 border">{app.domain_url}</td>
                        <td className="px-4 py-2 border">
                          {app.roles?.length || 0}
                        </td>
                        <td className="px-4 py-2 border">
                          {app.userRoles?.length || 0}
                        </td>
                        <td className="px-4 py-2 border">
                          <ApplicationForm
                            mode="edit"
                            initialData={app}
                            onSubmit={handleUpsert}
                            trigger={
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <Pencil className="h-4 w-4" /> Edit
                              </Button>
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        No applications found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>

          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ApplicationManagement;
