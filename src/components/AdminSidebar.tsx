import {
  Users,
  Shield,
  Settings,
  Home,
  BarChart3,
  Mail,
  FileText,
  HelpCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const sections = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", url: "/admin", icon: Home },
      { title: "Users", url: "/admin/users", icon: Users },
      { title: "Roles", url: "/admin/roles", icon: Shield },
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Settings", url: "/admin/settings", icon: Settings },
      { title: "Email Templates", url: "/admin/email-templates", icon: Mail },
      { title: "Audit Logs", url: "/admin/audit-logs", icon: FileText },
    ],
  },
  {
    label: "Support",
    items: [{ title: "Help Center", url: "/admin/help", icon: HelpCircle }],
  },
];

// Utility to apply classes based on active status
const getLinkClass = (isActive: boolean) =>
  isActive
    ? "bg-blue-600 text-white font-medium rounded-md"
    : "hover:bg-blue-100 text-gray-700 hover:text-blue-800 rounded-md";

// Utility to apply icon color separately
const getIconClass = (isActive: boolean) =>
  isActive ? "text-white" : "text-blue-500";

export function AdminSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `${getLinkClass(
                            isActive
                          )} flex items-center gap-3 px-4 py-2 w-full transition-colors`
                        }
                      >
                        <item.icon className={`h-4 w-4 ${getIconClass}`} />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
