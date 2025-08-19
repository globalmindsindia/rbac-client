import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Mail,
  Settings,
  Trash2,
  Edit,
} from "lucide-react";
import React, { useState } from "react";
import { roleService } from "@/services/roleService";
import RoleForm from "@/components/forms/RoleForm";

const mockRoles = [
  {
    id: "1",
    name: "admin",
    description: "Full system access",
    permissions: ["read", "write", "delete", "manage_users"],
    userCount: 1,
  },
  {
    id: "2",
    name: "moderator",
    description: "Content management access",
    permissions: ["read", "write", "moderate"],
    userCount: 1,
  },
  {
    id: "3",
    name: "user",
    description: "Basic user access",
    permissions: ["read"],
    userCount: 2,
  },
];

const RolesManagement = () => {
  const [roles, setRoles] = useState(mockRoles);

  const handleAddRole = async (data: any) => {
    await roleService.createRole(data);
  };

  const handleEditRole = async (data: any) => {
    await roleService.updateRole(data.id, data);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <SidebarInset className="flex-1">
          {/* Global Page Header */}
          <Header />

          <main className="flex-1 container mx-auto px-6 py-8 space-y-8">
            {/* Page Title + Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-3xl font-bold text-foreground">
                  Roles Management
                </h1>
              </div>

              {/* Add Role */}
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

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="h-full flex flex-col">
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg capitalize">
                        {role.name}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
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
                        {role.permissions.map((permission) => (
                          <Badge
                            key={permission}
                            variant="secondary"
                            className="text-xs"
                          >
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RolesManagement;
