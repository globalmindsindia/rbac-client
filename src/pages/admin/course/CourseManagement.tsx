import CourseForm from "@/components/forms/CourseForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { languageService } from "@/services/languageService";
import { levelService } from "@/services/levelService";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

// Handler to call your createCourse API through the service/controller
async function handleCreateCourse(data: {
  name: string;
  description?: string;
  languageId: string;
  levelId: string;
  price: number;
  duration?: number;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
}) {
  // call your service or repository here, e.g.:
  // await courseService.createCourse(data);
  // then refresh your list or show toast
}

const CourseManagement = () => {
  const [languages, setLanguages] = useState<{ id: string; name: string }[]>(
    []
  );
  const [levels, setLevels] = useState<{ id: string; name: string }[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [languagesData, levelsData] = await Promise.all([
          languageService.getLanguages(),
          levelService.getLevels(),
        ]);
        setLanguages(languagesData);
        setLevels(levelsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              Course Management
            </h1>
          </div>

          {/* Add course Button */}
          {!loading && (
            <CourseForm
              mode="add"
              languages={languages}
              levels={levels}
              onSubmit={handleCreateCourse}
              trigger={
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>
              }
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseManagement;
