// src/components/forms/CreateRoleForm.tsx
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CreateRoleForm({ form, onSubmit }) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
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
          name="description"
          control={form.control}
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
        {/* Add your permissions fields here, as checkboxes or a select */}
        <Button type="submit">Create Role</Button>
      </form>
    </Form>
  );
}
