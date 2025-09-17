import {
  Users,
  Shield,
  Settings,
  Home,
  BarChart3,
  Mail,
  FileText,
  HelpCircle,
  BookOpen,
  ShoppingCart,
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
      // admin menu
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: Home,
        roles: ["Super Admin", "Admin"],
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
      {
        title: "Course Management",
        url: "/course/course-management",
        icon: BookOpen,
        roles: ["Super Admin"],
      },
      {
        title: "Lead Management",
        url: "/lead/lead-management",
        icon: BookOpen,
        roles: ["Super Admin"],
      },

      // employee menu
      {
        title: "Dashboard",
        url: "/employee/dashboard",
        icon: Home,
        roles: ["Employee"],
      },

      // student menu
      {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: Home,
        roles: ["Student"],
      },
      {
        title: "My Services",
        url: "/student/services",
        icon: BookOpen,
        roles: ["Student"],
      },
      {
        title: "Other Services",
        url: "/student/available-services",
        icon: ShoppingCart,
        roles: ["Student"],
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
