// RoleForm.tsx (relevant changes only)
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { permissionService, PermissionDTO } from "@/services/permissionService";
import { useToast } from "@/hooks/use-toast";
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
import type { RoleFormProps } from "@/types/roles.types";
import { roleService } from "@/services/roleService";

type FormValues = { name: string; description: string; permissions: string[] };

export default function RoleForm(props: RoleFormProps) {
  const isEdit = props.mode === "edit";
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loadingPerms, setLoadingPerms] = useState(false);
  const [perms, setPerms] = useState<PermissionDTO[]>([]);

  const options = useMemo(
    () =>
      perms.map((p) => ({
        id: p.id,
        label: `${p.resource.name}:${p.action}`,
      })),
    [perms]
  );

  const labelToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of perms) map.set(`${p.resource.name}:${p.action}`, p.id);
    return map;
  }, [perms]);

  const form = useForm<FormValues>({
    defaultValues: { name: "", description: "", permissions: [] },
  });

  // Fetch permissions only when dialog opens
  useEffect(() => {
    if (!open) return;
    let active = true;
    (async () => {
      try {
        setLoadingPerms(true);
        const list = await permissionService.getAll();
        if (!active) return;
        setPerms(list);
      } finally {
        setLoadingPerms(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [open]);

  // Initialize form values after permissions load and when switching modes
  useEffect(() => {
    if (!open) return;
    if (isEdit) {
      // props.role.permissions are labels like "Resource:action"
      const selectedIds =
        props.role.permissions
          ?.map((label) => labelToId.get(label))
          .filter((x): x is string => Boolean(x)) ?? [];
      form.reset({
        name: props.role.name,
        description: props.role.description ?? "",
        permissions: selectedIds,
      });
    } else {
      form.reset({
        name: props.initialValues?.name ?? "",
        description: props.initialValues?.description ?? "",
        permissions: props.initialValues?.permissions ?? [],
      });
    }
  }, [open, isEdit, labelToId, props, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        // Compute add/remove diffs from current assignment
        const currentAssignedIds =
          props.role.permissions
            ?.map((label) => labelToId.get(label))
            .filter((x): x is string => Boolean(x)) ?? [];
        const nextIds = new Set(values.permissions);
        const curIds = new Set(currentAssignedIds);

        const toAdd = [...nextIds].filter((id) => !curIds.has(id));
        const toRemove = [...curIds].filter((id) => !nextIds.has(id));

        // Update basic fields
        await props.onSubmit({
          name: values.name || undefined,
          description: values.description || undefined,
        });

        // Apply permission changes
        if (toAdd.length) {
          await roleService.assignPermissions(props.role.id, toAdd);
        }
        if (toRemove.length) {
          await Promise.all(
            toRemove.map((pid) =>
              roleService.removePermission(props.role.id, pid)
            )
          );
        }
      } else {
        // Create role, then assign permissions if selected
        const created = await roleService.createRole({
          name: values.name,
          description: values.description || undefined,
        });
        if (values.permissions.length) {
          await roleService.assignPermissions(created.id, values.permissions);
        }
      }
      toast({
        title: "Success",
        description: isEdit
          ? "Role updated successfully"
          : "Role created successfully",
      });
      form.reset();
      setOpen(false);
    } catch {
      toast({
        title: "Error",
        description: isEdit ? "Failed to update role" : "Failed to create role",
        variant: "destructive",
      });
    }
  };

  return (
    // Replace your <DialogContent> block with this structured version
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className="max-w-lg sm:max-w-xl p-0 max-h-[85vh] flex flex-col">
        {/* Header (non-scrollable) */}
        <DialogHeader className="p-6 border-b">
          <DialogTitle>{isEdit ? "Edit Role" : "Create New Role"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the role details"
              : "Define a new role with specific permissions"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
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
                control={form.control}
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
                  {loadingPerms ? (
                    <span className="text-sm text-muted-foreground">
                      Loading permissions...
                    </span>
                  ) : options.length === 0 ? (
                    <span className="text-sm text-muted-foreground">
                      No permissions available
                    </span>
                  ) : (
                    options.map((opt) => {
                      const selected = form
                        .watch("permissions")
                        .includes(opt.id);
                      return (
                        <label
                          key={opt.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              const current = form.getValues("permissions");
                              form.setValue(
                                "permissions",
                                e.target.checked
                                  ? [...current, opt.id]
                                  : current.filter((p) => p !== opt.id),
                                { shouldDirty: true }
                              );
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer (non-scrollable) */}
        <DialogFooter className="p-6 border-t">
          <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
            {isEdit ? "Update Role" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
