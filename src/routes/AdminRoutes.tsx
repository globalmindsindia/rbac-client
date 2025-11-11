import EmployeeDashboard from "@/pages/admin/employee/EmployeeDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RolesManagement from "@/pages/admin/RolesManagement";
import ApplicationManagement from "@/pages/admin/ApplicationManagement";
import CourseManagement from "@/pages/admin/course/CourseManagement";
import LeadsManagement from "@/pages/admin/leads/LeadsManagement";
import UserManagement from "@/pages/admin/UserManagement";
import ResourceManagement from "@/pages/admin/ResourceManagement";
import PermissionManagement from "@/pages/admin/PermissionManagement";
import SopGenerator from "@/pages/admin/employee/SopGenerator";
import NewsletterManagement from "@/pages/admin/NewsletterManagement";
import MastersCourseManagement from "@/pages/admin/MastersCourseManagement";

export const AdminRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/roles-management",
    element: (
      <ProtectedRoute>
        <RolesManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/application-management",
    element: (
      <ProtectedRoute>
        <ApplicationManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employee/dashboard",
    element: (
      <ProtectedRoute>
        <EmployeeDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/course/course-management",
    element: (
      <ProtectedRoute>
        <CourseManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/lead/lead-management",
    element: (
      <ProtectedRoute>
        <LeadsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/user-management",
    element: (
      <ProtectedRoute>
        <UserManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/resource-management",
    element: (
      <ProtectedRoute>
        <ResourceManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/permission-management",
    element: (
      <ProtectedRoute>
        <PermissionManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/sop-generator",
    element: (
      <ProtectedRoute>
        <SopGenerator />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/newsletter-management",
    element: (
      <ProtectedRoute>
        <NewsletterManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/masters-course-management",
    element: (
      <ProtectedRoute>
        <MastersCourseManagement />
      </ProtectedRoute>
    ),
  },
];
