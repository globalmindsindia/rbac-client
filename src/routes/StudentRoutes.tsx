import { ProtectedRoute } from "./ProtectedRoute";
import StudentDashboard from "@/pages/student/StudentDashboard";
import Services from "@/pages/student/Services";
import AvailableServices from "@/pages/student/AvailableServices";

export const StudentRoutes = [
  {
    path: "/student/dashboard",
    element: (
      <ProtectedRoute>
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/services",
    element: (
      <ProtectedRoute>
        <Services />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/available-services",
    element: (
      <ProtectedRoute>
        <AvailableServices />
      </ProtectedRoute>
    ),
  },
];
