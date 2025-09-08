import { Route } from "react-router-dom";
import EmployeeDashboard from "@/pages/admin/employee/EmployeeDashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import RolesManagement from "@/pages/admin/RolesManagement";
import ApplicationManagement from "@/pages/admin/ApplicationManagement";

export const AdminRoutes = [
  <Route
    key="admin-dashboard"
    path="/admin/dashboard"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="roles-management"
    path="/admin/roles-management"
    element={
      <ProtectedRoute>
        <RolesManagement />
      </ProtectedRoute>
    }
  />,
  <Route
    key="application-management"
    path="/admin/application-management"
    element={
      <ProtectedRoute>
        <ApplicationManagement />
      </ProtectedRoute>
    }
  />,
  <Route
    key="employee-dashboard"
    path="/employee/dashboard"
    element={
      <ProtectedRoute>
        <EmployeeDashboard />
      </ProtectedRoute>
    }
  />,
];
