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

interface LevelFormProps {
  mode: "add" | "edit";
  initialData?: {
    name: string;
    order: number;
    description?: string;
    imageUrl?: string;
  };
  trigger: React.ReactNode;
  onSubmit: (data: {
    name: string;
    order: number;
    description?: string;
    imageUrl?: string;
  }) => Promise<void>;
}

const LevelForm = ({
  mode,
  initialData,
  trigger,
  onSubmit,
}: LevelFormProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      order: 0,
      description: "",
      imageUrl: "",
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        name: initialData.name,
        order: initialData.order,
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
      });
    }
  }, [mode, initialData, form]);

  const handleSubmit = async (data: any) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      // Error handling is done in parent component
      console.error("Level form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add Level
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Level" : "Edit Level"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" ? "Add a new level option." : "Edit level details."}
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
                  <FormLabel>Level Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. A1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter order for progression"
                      {...field}
                    />
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
                    <Textarea placeholder="Optional description" {...field} />
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
              <Button type="submit">
                {mode === "add" ? "Add Level" : "Update Level"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LevelForm;
