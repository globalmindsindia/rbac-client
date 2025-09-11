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
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

interface LanguageFormProps {
  mode: "add" | "edit";
  initialData?: {
    name: string;
    code: string;
    description?: string;
    imageUrl?: string;
  };
  trigger: React.ReactNode;
  onSubmit: (data: {
    name: string;
    code: string;
    description?: string;
    imageUrl?: string;
  }) => Promise<any>; // Changed to return response for message handling
}

const LanguageForm = ({
  mode,
  initialData,
  trigger,
  onSubmit,
}: LanguageFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      imageUrl: "",
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        code: initialData.code,
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });
    } else if (open && mode === "add") {
      // Reset form when opening add dialog
      form.reset({
        name: "",
        code: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [mode, initialData, form, open]);

  const handleSubmit = async (data: any) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Language form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Language
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Language" : "Edit Language"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new language option."
              : "Edit language details."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Prevent event bubbling
              form.handleSubmit(handleSubmit)(e);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. German" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lang Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. DE" maxLength={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Short description (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Adding..."
                  : mode === "add"
                  ? "Add Language"
                  : "Update Language"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageForm;
