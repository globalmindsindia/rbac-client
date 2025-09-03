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

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles?: string[]; // optional: which roles can access
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

export const menuConfig: MenuSection[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
        roles: ["Super Admin", "Admin"],
      },
      {
        title: "Dashboard",
        url: "/employee/dashboard",
        icon: Home,
        roles: ["Employee"],
      },
      {
        title: "Roles",
        url: "/admin/roles-management",
        icon: Shield,
        roles: ["Super Admin"],
      },
      {
        title: "Applications",
        url: "/admin/application-management",
        icon: BarChart3,
        roles: ["Super Admin"],
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
        roles: ["Super Admin", "Admin"],
      },
      {
        title: "Email Templates",
        url: "/admin/email-templates",
        icon: Mail,
        roles: ["Super Admin"],
      },
      {
        title: "Audit Logs",
        url: "/admin/audit-logs",
        icon: FileText,
        roles: ["Super Admin"],
      },
    ],
  },
  {
    label: "Support",
    items: [{ title: "Help Center", url: "/admin/help", icon: HelpCircle }],
  },
];
