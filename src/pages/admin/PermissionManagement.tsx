// app/admin/permissions/PermissionManagement.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit } from "lucide-react";
import { permissionService, PermissionDTO } from "@/services/permissionService";
import { resourceService } from "@/services/resourceService";
import PermissionForm from "@/components/forms/PermissionForm";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layouts/DashboardLayout";

type ResourceDTO = { id: string; name: string };

export default function PermissionManagement() {
  const { toast } = useToast();
  const [items, setItems] = React.useState<PermissionDTO[]>([]);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [q, setQ] = React.useState("");
  const [resources, setResources] = React.useState<ResourceDTO[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);

      // 1) Critical path: permissions
      const list = await permissionService.list({ page, size, q });
      setItems(Array.isArray(list.items) ? list.items : []);
      setTotal(Number.isFinite(list.total) ? list.total : 0);
      setTotalPages(Number.isFinite(list.totalPages) ? list.totalPages : 1);

      // 2) Best-effort: resources for form select (don’t block the page)
      if (resources.length === 0) {
        resourceService
          .listAll()
          .then((res) => {
            if (Array.isArray(res)) setResources(res);
          })
          .catch(() => {
            toast({
              title: "Warning",
              description: "Resources failed to load; editing may be limited",
              variant: "destructive",
            });
          });
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, size, q, resources.length, toast]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (data: { action: string; resourceId: string }) => {
    await permissionService.create(data);
    await load();
    toast({ title: "Created", description: "Permission created successfully" });
  };

  const handleUpdate = async (
    id: string,
    data: { action?: string; resourceId?: string }
  ) => {
    await permissionService.update(id, data);
    await load();
    toast({ title: "Updated", description: "Permission updated successfully" });
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this permission? This cannot be undone.");
    if (!ok) return;
    await permissionService.delete(id);
    await load();
    toast({ title: "Deleted", description: "Permission deleted successfully" });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Permission Management</h1>
          <PermissionForm
            mode="add"
            resources={resources}
            onSubmit={handleCreate}
            trigger={
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Permission
              </Button>
            }
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by resource or action..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline" onClick={() => setPage(1)}>
                Search
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Resource</th>
                    <th className="text-left py-2 px-3">Action</th>
                    <th className="text-left py-2 px-3">Label</th>
                    <th className="text-left py-2 px-3 w-32">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-4 px-3" colSpan={4}>
                        Loading...
                      </td>
                    </tr>
                  ) : !Array.isArray(items) || items.length === 0 ? (
                    <tr>
                      <td className="py-4 px-3" colSpan={4}>
                        No permissions found
                      </td>
                    </tr>
                  ) : (
                    items.map((p) => (
                      <tr key={p.id} className="border-b">
                        <td className="py-2 px-3">{p.resource?.name ?? "-"}</td>
                        <td className="py-2 px-3">{p.action}</td>
                        <td className="py-2 px-3">{p.label}</td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <PermissionForm
                              mode="edit"
                              permission={p}
                              resources={resources}
                              onSubmit={(data) => handleUpdate(p.id, data)}
                              trigger={
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages} • {total} total
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
                <select
                  className="ml-2 rounded-md border border-input bg-background px-2 py-1 text-xs"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} / page
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
