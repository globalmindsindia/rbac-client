import React, { useCallback, useEffect, useState } from "react";
import { roleService, Role } from "@/services/roleService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Shield, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminSidebar } from "@/components/AdminSidebar";
import RoleForm from "@/components/forms/RoleForm";

const RolesManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const list = await roleService.getRoles(); // returns Role[]
      setRoles(list);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const handleAddRole = useCallback(
    async (data: Omit<Role, "id" | "userCount" | "permissions">) => {
      await roleService.createRole({
        name: data.name,
        description: data.description,
      });
      await fetchRoles();
    },
    [fetchRoles]
  );

  const handleEditRole = useCallback(
    async (id: string, data: Partial<Pick<Role, "name" | "description">>) => {
      await roleService.updateRole(id, {
        name: data.name,
        description: data.description,
      });
      await fetchRoles();
    },
    [fetchRoles]
  );

  const handleDeleteRole = useCallback(
    async (id: string) => {
      const ok = window.confirm("Delete this role? This cannot be undone.");
      if (!ok) return;
      await roleService.deleteRole(id);
      await fetchRoles();
    },
    [fetchRoles]
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex-1">
          <Header />
          <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-3xl font-bold text-foreground">
                  Roles Management
                </h1>
              </div>
              <RoleForm
                mode="add"
                onSubmit={handleAddRole}
                trigger={
                  <Button size="sm" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Add Role
                  </Button>
                }
              />
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading roles...</p>
            ) : roles.length === 0 ? (
              <p className="text-muted-foreground">No roles found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <Card key={role.id} className="h-full flex flex-col">
                    <CardHeader className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg capitalize">
                          {role.name}
                        </CardTitle>
                        <CardDescription>
                          {role.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        {/* Enable edit when ready */}
                        <RoleForm
                          mode="edit"
                          role={role}
                          onSubmit={(data) => handleEditRole(role.id, data)}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Users: {role.userCount}
                      </p>
                      <div>
                        <p className="text-sm font-medium mb-2">Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.length > 0 ? (
                            role.permissions.map((permission) => (
                              <Badge
                                key={`${role.id}-${permission}`}
                                variant="secondary"
                                className="text-xs"
                              >
                                {permission}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No permissions
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RolesManagement;
