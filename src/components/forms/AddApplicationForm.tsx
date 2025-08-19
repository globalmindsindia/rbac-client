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
import { AppWindow } from "lucide-react"; // icon for app
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { applicationService } from "@/services/applicationService";

const AddApplicationForm = () => {
  const applicationForm = useForm({
    defaultValues: {
      name: "",
      domain_url: "",
    },
  });

  const { toast } = useToast();

  const handleCreateApplication = async (data: any) => {
    try {
      const result = await applicationService.createApplication(data);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        applicationForm.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create application",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="flex items-center gap-2">
            <AppWindow className="h-4 w-4" />
            Add Application
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Application</DialogTitle>
            <DialogDescription>
              Register a new application with its domain
            </DialogDescription>
          </DialogHeader>

          <Form {...applicationForm}>
            <form
              onSubmit={applicationForm.handleSubmit(handleCreateApplication)}
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
                <Button type="submit">Create Application</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddApplicationForm;
