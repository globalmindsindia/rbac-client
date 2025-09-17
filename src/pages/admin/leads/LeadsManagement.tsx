import DashboardLayout from "@/components/layouts/DashboardLayout";
import LeadTable from "@/components/tables/LeadTable";
import { leadService } from "@/services/leadService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";

const LeadsManagement = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // fetchLeads shouldn’t depend on startDate, endDate
  const fetchLeads = useCallback(async (filters?: any) => {
    try {
      const params: any = {};
      if (filters?.startDate)
        params.startDate = filters.startDate.toISOString();
      if (filters?.endDate) params.endDate = filters.endDate.toISOString();

      const data = await leadService.getLeads(params);
      setLeads(data || []);
    } catch (error) {
      console.error("Failed to load leads:", error);
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  // only run once on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFilter = useCallback(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchLeads({ startDate, endDate });
    }, 300); // 300ms debounce delay
  }, [startDate, endDate, fetchLeads]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Lead?",
      text: "This action will delete the lead permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await leadService.deleteLead(id);
      fetchLeads();

      Swal.fire({
        title: "Lead deleted",
        text: "The Lead has been successfully deleted.",
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to delete lead:", error);
      Swal.fire("Error", "Could not delete lead.", "error");
    }
  };

  const handleExport = async () => {
    await leadService.exportLeads({
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  };

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Lead Management
            </h1>
          </div>

          {/* Filters + Export */}
          <div className="flex flex-wrap gap-3 items-center">
            <DatePicker
              selected={startDate}
              onChange={setStartDate}
              placeholderText="Start Date"
              className="border rounded p-2"
            />
            <DatePicker
              selected={endDate}
              onChange={setEndDate}
              placeholderText="End Date"
              className="border rounded p-2"
            />
            <Button onClick={handleFilter}>Filter</Button>
            <Button variant="outline" onClick={handleExport}>
              Export Excel
            </Button>
          </div>
        </div>

        <LeadTable leads={leads} handleDelete={handleDelete} />
      </div>
    </DashboardLayout>
  );
};

export default LeadsManagement;
