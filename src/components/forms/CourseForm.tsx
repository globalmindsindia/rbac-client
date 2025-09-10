import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import LanguageForm from "./LanguageForm";
import LevelForm from "./LevelForm";
import { languageService } from "@/services/languageService";
import { levelService } from "@/services/levelService";

interface CourseFormProps {
  mode: "add" | "edit";
  initialData?: {
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
  };
  languages: { id: string; name: string }[];
  levels: { id: string; name: string }[];
  trigger: React.ReactNode;
  onSubmit: (data: {
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
  }) => Promise<void>;
}

const CourseForm = ({
  mode,
  initialData,
  languages: initialLanguages,
  levels: initialLevels,
  trigger,
  onSubmit,
}: CourseFormProps) => {
  const [open, setOpen] = useState(false);
  const [languages, setLanguages] = useState(initialLanguages);
  const [levels, setLevels] = useState(initialLevels);

  const refreshLanguages = async () => {
    try {
      const updatedLanguages = await languageService.getLanguages();
      setLanguages(updatedLanguages);
    } catch (error) {
      console.error("Failed to refresh languages:", error);
    }
  };

  const refreshLevels = async () => {
    try {
      const updatedLevels = await levelService.getLevels();
      setLevels(updatedLevels);
    } catch (error) {
      console.error("Failed to refresh languages:", error);
    }
  };

  const handleLanguageSubmit = async (newLang: any) => {
    try {
      const response = await languageService.createLanguage(newLang);
      await refreshLanguages();

      // Show success message
      toast({
        title: "Success",
        description: response.message || "Language added successfully",
      });

      return response;
    } catch (error: any) {
      // Show error message
      toast({
        title: "Error",
        description: error.message || "Failed to add language",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleLevelSubmit = async (newLevel: any) => {
    try {
      const response = await levelService.createLevel(newLevel);
      await refreshLevels();

      // Show success message
      toast({
        title: "Success",
        description: response.message || "Level added successfully",
      });

      return response;
    } catch (error: any) {
      // Show error message
      toast({
        title: "Error",
        description: error.message || "Failed to add level",
        variant: "destructive",
      });
      throw error;
    }
  };

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      languageId: "",
      levelId: "",
      price: 0,
      duration: undefined,
      maxStudents: undefined,
      startDate: "",
      endDate: "",
      imageUrl: "",
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description ?? "",
        languageId: initialData.languageId,
        levelId: initialData.levelId,
        price: initialData.price,
        duration: initialData.duration,
        maxStudents: initialData.maxStudents,
        startDate: initialData.startDate?.slice(0, 10) ?? "",
        endDate: initialData.endDate?.slice(0, 10) ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });
    }
  }, [mode, initialData, form]);

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description:
          mode === "add"
            ? "Course created successfully"
            : "Course updated successfully",
      });
      form.reset();
      setOpen(false);
    } catch {
      toast({
        title: "Error",
        description:
          mode === "add"
            ? "Failed to create course"
            : "Failed to update course",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Create New Course" : "Edit Course"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Define course details and pricing"
              : "Modify the course information"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Course Name & Price side by side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Full-width Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Course description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language & Level side by side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="languageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    {/* LanguageForm is OUTSIDE the Course form */}
                    <div className="mt-1">
                      <LanguageForm
                        mode="add"
                        trigger={
                          <Button
                            type="button" // Important: prevents form submission
                            variant="ghost"
                            size="sm"
                            className="underline"
                          >
                            + Add Language
                          </Button>
                        }
                        onSubmit={handleLanguageSubmit}
                      />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="levelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <div className="mt-1">
                      <LevelForm
                        mode="add"
                        trigger={
                          <Button
                            type="button" // ✅ not submit
                            variant="ghost"
                            size="sm"
                            className="underline"
                          >
                            + Add Level
                          </Button>
                        }
                        onSubmit={handleLevelSubmit}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Duration & Max Students side by side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 40" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxStudents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Students</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Start Date & End Date side by side */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Full-width Image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {mode === "add" ? "Create Course" : "Update Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseForm;
