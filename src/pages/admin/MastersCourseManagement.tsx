// src/pages/admin/MastersCourseManagement.tsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { MastersCourseForm } from "@/components/forms/MastersCourseForm";
import MastersCourseTable from "@/components/tables/MastersCourseTable";
import { Button } from "@/components/ui/button";
import { AppWindow, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { masterCourseService } from "@/services/mastersCourseService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CsvImportPanel from "@/components/CsvImportPanel";

const MastersCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const { toast } = useToast();
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const fetchCourses = async () => {
    try {
      const data = await masterCourseService.getAll();
      setCourses(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch master courses",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpsert = async (data: any) => {
    try {
      await masterCourseService.upsert(data);
      toast({
        title: "Success",
        description: "Course saved successfully",
      });
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to save master course",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await masterCourseService.delete(id);
      toast({
        title: "Deleted",
        description: "Master course deleted successfully",
      });
      fetchCourses();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete master course",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Masters Course Management
            </h1>
            <p className="text-muted-foreground">
              Manage all master courses, countries, and their respective
              details.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Import Button (opens dialog) */}
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Import CSV
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Import Master Courses via CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file to bulk import or update master course
                    data.
                  </DialogDescription>
                </DialogHeader>
                <CsvImportPanel
                  onDone={() => {
                    setImportDialogOpen(false);
                    fetchCourses();
                  }}
                />
              </DialogContent>
            </Dialog>

            {/* Add Button */}
            <MastersCourseForm
              mode="add"
              onSubmit={handleUpsert}
              trigger={
                <Button size="sm" className="flex items-center gap-2">
                  <AppWindow className="h-4 w-4" />
                  Add Course
                </Button>
              }
            />
          </div>
        </div>

        {/* Table */}
        <MastersCourseTable
          courses={courses}
          handleUpsert={handleUpsert}
          handleDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default MastersCourseManagement;
