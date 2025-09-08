import { Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import StudentDashboard from "@/pages/student/StudentDashboard";
import Services from "@/pages/student/Services";
import AvailableServices from "@/pages/student/AvailableServices";

export const StudentRoutes = [
  <Route
    key="student-dashboard"
    path="/student/dashboard"
    element={
      <ProtectedRoute>
        <StudentDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-services"
    path="/student/services"
    element={
      <ProtectedRoute>
        <Services />
      </ProtectedRoute>
    }
  />,
  <Route
    key="student-available-services"
    path="/student/available-services"
    element={
      <ProtectedRoute>
        <AvailableServices />
      </ProtectedRoute>
    }
  />,
];
