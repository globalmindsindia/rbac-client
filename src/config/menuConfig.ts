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
  User,
  LayoutDashboard,
  ClipboardList,
  Key,
  AppWindow,
  UserCog,
  GraduationCap,
  PhoneCall,
  Wrench,
  PencilRuler,
  FolderCog,
  Database,
  Newspaper,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  roles?: string[];
  permissions?: string[];
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
        icon: LayoutDashboard,
        roles: ["Super Admin", "Admin"],
        permissions: ["read:dashboard"],
      },
      {
        title: "Resource Management",
        url: "/admin/resource-management",
        icon: Database,
        roles: ["Super Admin"],
      },
      {
        title: "Permission Management",
        url: "/admin/permission-management",
        icon: Key,
        roles: ["Super Admin"],
      },
      {
        title: "Roles Management",
        url: "/admin/roles-management",
        icon: Shield,
        roles: ["Super Admin"],
      },
      {
        title: "Apps Management",
        url: "/admin/application-management",
        icon: AppWindow,
        roles: ["Super Admin"],
      },
      {
        title: "Users Management",
        url: "/admin/user-management",
        icon: Users,
        roles: ["Super Admin", "Sop Admin"],
      },
      {
        title: "Course Management",
        url: "/course/course-management",
        icon: GraduationCap,
        roles: ["Super Admin"],
      },
      {
        title: "Lead Management",
        url: "/lead/lead-management",
        icon: PhoneCall,
        roles: ["Super Admin"],
      },
      {
        title: "Dashboard",
        url: "/employee/dashboard",
        icon: LayoutDashboard,
        roles: ["Employee", "SOP_ADMIN"],
      },
      {
        title: "SOP Generator",
        url: "/admin/sop-generator",
        icon: PencilRuler,
        roles: ["Super Admin", "SOP_ADMIN"],
      },
      {
        title: "Newsletter Management",
        url: "/admin/newsletter-management",
        icon: Newspaper,
        roles: ["Super Admin"],
      },
      {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: LayoutDashboard,
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
