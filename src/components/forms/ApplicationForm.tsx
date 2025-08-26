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
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

interface ApplicationFormProps {
  mode: "add" | "edit";
  initialData?: { name: string; domain_url: string };
  trigger: React.ReactNode; // Button or Icon
  onSubmit: (data: { name: string; domain_url: string }) => Promise<void>;
}

const ApplicationForm = ({
  mode,
  initialData,
  trigger,
  onSubmit,
}: ApplicationFormProps) => {
  const [open, setOpen] = useState(false); // control dialog state
  const applicationForm = useForm({
    defaultValues: {
      name: "",
      domain_url: "",
    },
  });

  const { toast } = useToast();

  // Pre-fill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      applicationForm.reset(initialData);
    }
  }, [mode, initialData, applicationForm]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description:
          mode === "add"
            ? "Application created successfully"
            : "Application updated successfully",
      });
      applicationForm.reset();
      setOpen(false); // ✅ close modal after success
    } catch (error) {
      toast({
        title: "Error",
        description:
          mode === "add"
            ? "Failed to create application"
            : "Failed to update application",
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
            {mode === "add" ? "Create New Application" : "Edit Application"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Register a new application with its domain"
              : "Update the application details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...applicationForm}>
          <form
            onSubmit={applicationForm.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={applicationForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter application name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={applicationForm.control}
              name="domain_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {mode === "add" ? "Create Application" : "Update Application"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;
