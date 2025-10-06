import DashboardLayout from "@/components/layouts/DashboardLayout";
import React from "react";

const UserManagement = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
