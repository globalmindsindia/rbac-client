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
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApplicationFormProps {
  mode: "add" | "edit";
  initialData?: any;
  roles: { id: string; name: string }[];
  trigger: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
}

const ApplicationForm = ({
  mode,
  roles,
  initialData,
  trigger,
  onSubmit,
}: ApplicationFormProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const applicationForm = useForm({
    defaultValues: {
      name: "",
      domain_url: "",
      roles: [],
      applicationType: "INTERNAL",
      status: "ACTIVE",
    },
  });

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
      setOpen(false);
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
              ? "Register a new application with its domain and type"
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

            {/* Application Type */}
            <FormField
              control={applicationForm.control}
              name="applicationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INTERNAL">Internal</SelectItem>
                        <SelectItem value="CROSS_SELLING">
                          Cross Selling
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={applicationForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="UNDER_CONSTRUCTION">
                          Under Construction
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Roles */}
            <FormField
              control={applicationForm.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Roles</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <label
                          key={role.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value.includes(role.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, role.name]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (r: string) => r !== role.name
                                  )
                                );
                              }
                            }}
                          />
                          <span>{role.name}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
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
