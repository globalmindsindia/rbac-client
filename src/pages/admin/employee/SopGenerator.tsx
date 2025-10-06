import DashboardLayout from "@/components/layouts/DashboardLayout";
import SOPGenerator from "@/components/SopGenerator";
import React from "react";

const SopGenerator = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Sop Generator
            </h1>
          </div>
        </div>
      </div>
      <SOPGenerator />
    </DashboardLayout>
  );
};

export default SopGenerator;
