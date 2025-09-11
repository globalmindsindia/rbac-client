import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { useForm } from "react-hook-form";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { AdminSidebar } from "@/components/AdminSidebar";
import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Mock data - Replace with your backend integration
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "moderator",
    status: "inactive",
    lastActive: "1 week ago",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "user",
    status: "pending",
    lastActive: "Never",
  },
];

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

// Abstract API functions - Replace with your backend calls
const API = {
  // User management
  async inviteUser(userData: any) {
    console.log("API: Inviting user", userData);
    // TODO: Implement your backend call
    return { success: true, message: "User invited successfully" };
  },

  async updateUser(userId: string, userData: any) {
    console.log("API: Updating user", userId, userData);
    // TODO: Implement your backend call
    return { success: true, message: "User updated successfully" };
  },

  async deleteUser(userId: string) {
    console.log("API: Deleting user", userId);
    // TODO: Implement your backend call
    return { success: true, message: "User deleted successfully" };
  },

  // Role management
  async createRole(roleData: any) {
    console.log("API: Creating role", roleData);
    // TODO: Implement your backend call
    return { success: true, message: "Role created successfully" };
  },

  async updateRole(roleId: string, roleData: any) {
    console.log("API: Updating role", roleId, roleData);
    // TODO: Implement your backend call
    return { success: true, message: "Role updated successfully" };
  },

  async deleteRole(roleId: string) {
    console.log("API: Deleting role", roleId);
    // TODO: Implement your backend call
    return { success: true, message: "Role deleted successfully" };
  },
};

const AdminDashboard = () => {
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");
  const { toast } = useToast();

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inviteUserForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const addRoleForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      permissions: [] as string[],
    },
  });

  const handleInviteUser = async (data: any) => {
    try {
      const result = await API.inviteUser(data);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        inviteUserForm.reset();
        // In real implementation, refresh users list from backend
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invite user",
        variant: "destructive",
      });
    }
  };

  const handleCreateRole = async (data: any) => {
    try {
      const result = await API.createRole(data);
      if (result.success) {
        toast({ title: "Success", description: result.message });
        addRoleForm.reset();
        // In real implementation, refresh roles list from backend
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await API.deleteUser(userId);
      if (result.success) {
        setUsers(users.filter((user) => user.id !== userId));
        toast({ title: "Success", description: result.message });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header with Sidebar Toggle */}
        <div className="mb-8 flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Total Users"
            value={users.length}
            icon={Users}
            iconColor="text-primary"
          />

          <StatsCard
            label="Active Users"
            value={users.filter((u) => u.status === "active").length}
            icon={Users}
            iconColor="text-success"
          />

          <StatsCard
            label="Total Roles"
            value={roles.length}
            icon={Shield}
            iconColor="text-primary"
          />

          <StatsCard
            label="Pending Users"
            value={users.filter((u) => u.status === "pending").length}
            icon={UserPlus}
            iconColor="text-warning"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === "users" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            <Button
              variant={activeTab === "roles" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("roles")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Roles
            </Button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage and invite users to your system
                  </CardDescription>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New User</DialogTitle>
                      <DialogDescription>
                        Send an invitation to a new user
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...inviteUserForm}>
                      <form
                        onSubmit={inviteUserForm.handleSubmit(handleInviteUser)}
                        className="space-y-4"
                      >
                        <FormField
                          control={inviteUserForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter full name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inviteUserForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Enter email address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={inviteUserForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type="submit">Send Invitation</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "active"
                              ? "default"
                              : user.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastActive}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Role Management</CardTitle>
                  <CardDescription>
                    Create and manage user roles and permissions
                  </CardDescription>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Shield className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new role with specific permissions
                      </DialogDescription>
                    </DialogHeader>
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
                                <Input
                                  placeholder="Enter role name"
                                  {...field}
                                />
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
                                <Input
                                  placeholder="Enter role description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div>
                          <FormLabel>Permissions</FormLabel>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {[
                              "read",
                              "write",
                              "delete",
                              "manage_users",
                              "moderate",
                            ].map((permission) => (
                              <label
                                key={permission}
                                className="flex items-center space-x-2"
                              >
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm">{permission}</span>
                              </label>
                            ))}
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
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
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Users: {role.userCount}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Permissions:
                          </p>
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </DashboardLayout>
  );
};

export default AdminDashboard;
