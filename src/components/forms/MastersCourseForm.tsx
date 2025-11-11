import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MastersCourseFormProps {
  mode: "add" | "edit";
  initialData?: any;
  trigger: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
}

const schema = z.object({
  country: z.string().nonempty("Country name is required"),
  universities: z.string().nonempty("Universities list is required"),
  courses: z.string().nonempty("Courses list is required"),
});

export const MastersCourseForm = ({
  mode,
  initialData,
  trigger,
  onSubmit,
}: MastersCourseFormProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "",
      universities: "",
      courses: "",
    },
  });

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        country: initialData.country,
        universities: initialData.universities?.join(", "),
        courses: initialData.courses?.join(", "),
      });
    }
  }, [mode, initialData]);

  const handleSubmit = async (data: any) => {
    try {
      const formattedData = {
        country: data.country.trim(),
        universities: data.universities
          .split(",")
          .map((u: string) => u.trim())
          .filter(Boolean),
        courses: data.courses
          .split(",")
          .map((c: string) => c.trim())
          .filter(Boolean),
      };

      await onSubmit(formattedData);
      toast({
        title: "Success ✅",
        description:
          mode === "add"
            ? "Master course added successfully"
            : "Master course updated successfully",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error ❌",
        description:
          mode === "add"
            ? "Failed to add master course"
            : "Failed to update master course",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Master Course" : "Edit Master Course"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new master course by specifying the country, universities, and courses."
              : "Update existing master course information."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter country name (e.g. Spain)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="universities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Universities (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="University of Barcelona, University of Madrid..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courses (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mechanical Engineering, Computer Science..."
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="w-full">
                {mode === "add" ? "Add Master Course" : "Update Master Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
