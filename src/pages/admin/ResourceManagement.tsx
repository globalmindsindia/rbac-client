// ResourceManagement.tsx

import ResourceForm from "@/components/forms/ResourceForm";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  AppWindow,
  Pencil,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { resourceService } from "@/services/resourceService";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { applicationService } from "@/services/applicationService";

const ACTION_COLORS: Record<string, string> = {
  create: "bg-emerald-100 text-emerald-700",
  read: "bg-blue-100 text-blue-700",
  update: "bg-amber-100 text-amber-800",
  delete: "bg-rose-100 text-rose-700",
  manage: "bg-purple-100 text-purple-700",
};

const ResourceManagement = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5; // resources per page

  // Fetch all resources
  const fetchResources = async () => {
    try {
      const data = await resourceService.getResources();
      setResources(data || []);
    } catch (error) {
      console.error("Failed to load resources:", error);
    }
  };

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const data = await applicationService.getApplications();
      setRoles(data.roles || []);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  useEffect(() => {
    fetchResources();
    fetchRoles();
  }, []);

  const filtered = useMemo(() => {
    return (resources || [])
      .filter((r) => r.name?.toLowerCase().includes(query.trim().toLowerCase()))
      .filter((r) => {
        if (!actionFilter) return true;
        return r.permissions?.some((p: any) => p.action === actionFilter);
      })
      .filter((r) => {
        if (!roleFilter) return true;
        return r.permissions?.some((p: any) =>
          p.roles?.some(
            (rr: any) => rr.roleId === roleFilter || rr.role?.id === roleFilter
          )
        );
      });
  }, [resources, query, actionFilter, roleFilter]);

  // paginate filtered resources
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // reset to page 1 if filters/search change
  useEffect(() => {
    setPage(1);
  }, [query, actionFilter, roleFilter]);

  return (
    <DashboardLayout>
      <div className="flex-1 container mx-auto px-6 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Resource Management
          </h1>
          <ResourceForm
            mode="add"
            roles={roles}
            onSubmit={async (data) => {
              await resourceService.upsertResource(data);
              fetchResources();
            }}
            trigger={
              <Button size="sm" className="flex items-center gap-2">
                <AppWindow className="h-4 w-4" />
                Add Resource
              </Button>
            }
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                {["create", "read", "update", "delete", "manage"].map((a) => (
                  <DropdownMenuCheckboxItem
                    key={a}
                    checked={actionFilter === a}
                    onCheckedChange={(v) => setActionFilter(v ? a : null)}
                  >
                    {a}
                  </DropdownMenuCheckboxItem>
                ))}
                <Separator className="my-2" />
                <DropdownMenuLabel>Role</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => setRoleFilter(null)}
                  className={!roleFilter ? "font-semibold" : ""}
                >
                  Any role
                </DropdownMenuItem>
                {roles.map((r: any) => (
                  <DropdownMenuCheckboxItem
                    key={r.id}
                    checked={roleFilter === r.id}
                    onCheckedChange={(v) => setRoleFilter(v ? r.id : null)}
                  >
                    {r.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[28%]">Resource</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No resources match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((res: any) => (
                  <TableRow key={res.id}>
                    <TableCell className="font-medium">{res.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {(res.permissions || []).map((p: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex flex-wrap items-center gap-2"
                          >
                            <span
                              className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                                ACTION_COLORS[p.action] ||
                                "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {p.action}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            {(p.roles || []).map((r: any) => (
                              <Badge
                                key={r.roleId || r.role?.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {r.role?.name ?? r.roleName ?? r.name}
                              </Badge>
                            ))}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <ResourceForm
                        mode="edit"
                        roles={roles}
                        initialData={res}
                        onSubmit={async (data) => {
                          await resourceService.upsertResource(data);
                          fetchResources();
                        }}
                        trigger={
                          <Button
                            size="sm"
                            variant="outline"
                            className="inline-flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResourceManagement;
