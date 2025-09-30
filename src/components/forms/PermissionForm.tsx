// components/forms/PermissionForm.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type BaseProps = {
  trigger: React.ReactNode;
  resources: { id: string; name: string }[]; // injected options
};

type AddProps = BaseProps & {
  mode: "add";
  onSubmit: (data: { action: string; resourceId: string }) => Promise<void>;
};

type EditProps = BaseProps & {
  mode: "edit";
  permission: {
    id: string;
    action: string;
    resource: { id: string; name: string };
  };
  onSubmit: (data: { action?: string; resourceId?: string }) => Promise<void>;
};

export type PermissionFormProps = AddProps | EditProps;

type FormValues = { action: string; resourceId: string };

export default function PermissionForm(props: PermissionFormProps) {
  const isEdit = props.mode === "edit";
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: { action: "", resourceId: "" },
  });

  React.useEffect(() => {
    if (!open) return;
    if (isEdit) {
      form.reset({
        action: props.permission.action,
        resourceId: props.permission.resource.id,
      });
    } else {
      form.reset({ action: "", resourceId: props.resources[0]?.id ?? "" });
    }
  }, [open, isEdit, props, form]);

  const submit = async (values: FormValues) => {
    if (isEdit) {
      await props.onSubmit({
        action: values.action || undefined,
        resourceId: values.resourceId || undefined,
      });
    } else {
      await props.onSubmit({
        action: values.action,
        resourceId: values.resourceId,
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-lg p-0 max-h-[85vh] flex flex-col">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>
            {isEdit ? "Edit Permission" : "Add Permission"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the permission details"
              : "Create a new permission"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
              <FormField
                control={form.control}
                name="action"
                rules={{ required: "Action is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., read, write, delete"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resourceId"
                rules={{ required: "Resource is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        {...field}
                      >
                        {props.resources.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 border-t">
          <Button onClick={form.handleSubmit(submit)} type="button">
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
