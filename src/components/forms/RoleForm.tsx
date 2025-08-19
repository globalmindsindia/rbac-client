import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
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

interface RoleFormProps {
  mode: "add" | "edit";
  initialData?: { name: string; description: string; permissions: string[] };
  trigger: React.ReactNode;
  onSubmit: (data: {
    name: string;
    description: string;
    permissions: string[];
  }) => Promise<void>;
}

const RoleForm = ({ mode, initialData, trigger, onSubmit }: RoleFormProps) => {
  const { toast } = useToast();
  const roleForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      permissions: [] as string[],
    },
  });

  const allPermissions = [
    "read",
    "write",
    "delete",
    "manage_users",
    "moderate",
  ];

  // Pre-fill in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      roleForm.reset(initialData);
    }
  }, [mode, initialData, roleForm]);

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description:
          mode === "add"
            ? "Role created successfully"
            : "Role updated successfully",
      });
      roleForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          mode === "add" ? "Failed to create role" : "Failed to update role",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Create New Role" : "Edit Role"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Define a new role with specific permissions"
              : "Update the role details"}
          </DialogDescription>
        </DialogHeader>

        <Form {...roleForm}>
          <form
            onSubmit={roleForm.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={roleForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={roleForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions */}
            <div>
              <FormLabel>Permissions</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {allPermissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={roleForm
                        .watch("permissions")
                        .includes(permission)}
                      onChange={(e) => {
                        const currentPermissions =
                          roleForm.getValues("permissions");
                        if (e.target.checked) {
                          roleForm.setValue("permissions", [
                            ...currentPermissions,
                            permission,
                          ]);
                        } else {
                          roleForm.setValue(
                            "permissions",
                            currentPermissions.filter((p) => p !== permission)
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {mode === "add" ? "Create Role" : "Update Role"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleForm;
