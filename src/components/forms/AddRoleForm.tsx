import { useToast } from "@/hooks/use-toast";
import React from "react";
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
import { Shield } from "lucide-react";
import { roleService } from "@/services/roleService";

const AddRoleForm = () => {
  const { toast } = useToast();
  const addRoleForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      permissions: [] as string[],
    },
  });

  const handleCreateRole = async (data: any) => {
    try {
      const result = await roleService.createRole(data);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        addRoleForm.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Add Role
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with specific permissions
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <Form {...addRoleForm}>
            <form
              onSubmit={addRoleForm.handleSubmit(handleCreateRole)}
              className="space-y-4"
            >
              <FormField
                control={addRoleForm.control}
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
                control={addRoleForm.control}
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
                  {["read", "write", "delete", "manage_users", "moderate"].map(
                    (permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{permission}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Create Role</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddRoleForm;
