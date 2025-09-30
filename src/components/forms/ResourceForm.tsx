// forms/ResourceForm.tsx
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Badge } from "../ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourceFormProps {
  mode: "add" | "edit";
  roles: { id: string; name: string }[];
  initialData?: {
    id?: string;
    name: string;
    permissions: {
      action: string;
      roles: { roleId: string; role: { id: string; name: string } }[];
    }[];
  };
  trigger: React.ReactNode;
  onSubmit: (data: any) => Promise<void>;
}

const ACTIONS = ["create", "read", "update", "delete", "manage"] as const;

const permissionSchema = z.object({
  action: z.enum(ACTIONS, { required_error: "Select an action." }),
  roles: z.array(z.string()).min(1, "Pick at least one role."),
});

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  permissions: z
    .array(permissionSchema)
    .min(1, "Add at least one permission.")
    .superRefine((arr, ctx) => {
      const seen = new Set<string>();
      for (let i = 0; i < arr.length; i++) {
        if (seen.has(arr[i].action)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [i, "action"],
            message: "Duplicate action not allowed.",
          });
        }
        seen.add(arr[i].action);
      }
    }),
});

type FormValues = z.infer<typeof formSchema>;

function MultiSelectRoles({
  value,
  onChange,
  options,
  placeholder = "Select roles...",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: { id: string; name: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.filter((o) => value.includes(o.id)),
    [value, options]
  );

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  const clear = () => onChange([]);

  return (
    <div className="space-y-1">
      <div className="flex flex-wrap gap-2">
        {selected.map((r) => (
          <Badge key={r.id} variant="secondary" className="text-xs">
            {r.name}
            <button
              type="button"
              className="ml-1 hover:opacity-80"
              onClick={() => toggle(r.id)}
              aria-label={`Remove ${r.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selected.length > 0
                ? `${selected.length} selected`
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search roles..." />
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {options.map((r) => {
                const active = value.includes(r.id);
                return (
                  <CommandItem
                    key={r.id}
                    onSelect={() => toggle(r.id)}
                    className="flex items-center justify-between"
                  >
                    <span>{r.name}</span>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        active ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">Pick one or more roles</p>
      )}
    </div>
  );
}

const ResourceForm = ({
  mode,
  roles,
  initialData,
  trigger,
  onSubmit,
}: ResourceFormProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: undefined,
      name: "",
      permissions: [{ action: "read", roles: [] }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "permissions",
    keyName: "key", // avoid clobbering any id in data
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const mapped: FormValues = {
        id: initialData.id,
        name: initialData.name || "",
        permissions:
          (initialData.permissions || []).map((p) => ({
            action: (ACTIONS as readonly string[]).includes(p.action)
              ? (p.action as (typeof ACTIONS)[number])
              : "read",
            roles: (p.roles || [])
              .map((x) => x.roleId ?? x.role?.id)
              .filter(Boolean) as string[],
          })) || [],
      };
      form.reset(mapped);
      replace(
        mapped.permissions.length
          ? mapped.permissions
          : [{ action: "read", roles: [] }]
      );
    }
  }, [mode, initialData, form, replace]);

  const handleFormSubmit = async (values: FormValues) => {
    try {
      // Transform roles string[] to expected shape
      const payload = {
        id: values.id,
        name: values.name,
        permissions: values.permissions.map((p) => ({
          action: p.action,
          roles: p.roles.map((roleId) => ({ roleId })),
        })),
      };
      await onSubmit(payload);
      toast({
        title: "Success",
        description:
          mode === "add"
            ? "Resource created successfully"
            : "Resource updated successfully",
      });
      form.reset({
        id: undefined,
        name: "",
        permissions: [{ action: "read", roles: [] }],
      });
      setOpen(false);
    } catch {
      toast({
        title: "Error",
        description:
          mode === "add"
            ? "Failed to create resource"
            : "Failed to update resource",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {mode === "add" ? "Create New Resource" : "Edit Resource"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Register a new resource"
              : "Update the resource details"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              {/* Resource Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter resource name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permissions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Permissions</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ action: "read", roles: [] })}
                  >
                    + Add Permission
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.key}
                      className="rounded-md border p-4 space-y-4"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Action */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.action`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Action</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select action" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ACTIONS.map((a) => (
                                      <SelectItem key={a} value={a}>
                                        {a}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Roles Multi-select */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.roles`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Roles</FormLabel>
                              <FormControl>
                                <MultiSelectRoles
                                  value={field.value || []}
                                  onChange={field.onChange}
                                  options={roles}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between">
                        <p className="text-xs text-muted-foreground">
                          Ensure each action appears at most once for this
                          resource
                        </p>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Fixed footer */}
        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button type="submit" onClick={form.handleSubmit(handleFormSubmit)}>
            {mode === "add" ? "Create Resource" : "Update Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceForm;
