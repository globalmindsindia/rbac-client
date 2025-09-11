import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/forms/ApplicationForm";
import Header from "@/components/Header";
import ApplicationTable from "@/components/tables/ApplicationTable";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { applicationService } from "@/services/applicationService";
import { AppWindow, Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const ApplicationManagement = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      const data = await applicationService.getApplications();
      setApplications(data.applications || []);
      setRoles(data.roles || []);
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

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Application?",
      text: "This action will mark the application as deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      // Soft delete
      await applicationService.deleteApplication(id);
      fetchApplications();

      // Undo option
      Swal.fire({
        title: "Application deleted",
        text: "You can undo this action within 5 seconds.",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Undo",
        cancelButtonText: "Dismiss",
        timer: 5000,
        timerProgressBar: true,
      }).then(async (undoResult) => {
        if (undoResult.isConfirmed) {
          try {
            await applicationService.restoreApplication(id);
            fetchApplications();
            Swal.fire(
              "Restored!",
              "The application has been restored.",
              "success"
            );
          } catch (err) {
            console.error("Failed to restore application:", err);
            Swal.fire("Error", "Could not restore the application.", "error");
          }
        } else {
          console.log("Application deletion finalized");
        }
      });
    } catch (error) {
      console.error("Failed to delete application:", error);
      Swal.fire("Error", "Could not delete application.", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Application Management
            </h1>
          </div>

          {/* Add Application Button */}
          <ApplicationForm
            mode="add"
            roles={roles}
            onSubmit={handleUpsert}
            trigger={
              <Button size="sm" className="flex items-center gap-2">
                <AppWindow className="h-4 w-4" />
                Add Application
              </Button>
            }
          />
        </div>

        <ApplicationTable
          roles={roles}
          applications={applications}
          handleUpsert={handleUpsert}
          handleDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default ApplicationManagement;
