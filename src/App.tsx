import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useAuth } from "./auth/auth";
import AppSelector from "./pages/AppSelector";
import { AuthProvider } from "./auth/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";
import RolesManagement from "./pages/admin/RolesManagement";
import ApplicationManagement from "./pages/admin/ApplicationManagement";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import ErrorPage from "./pages/ErrorPage";
import EmployeeDashboard from "./pages/admin/employee/EmployeeDashboard";
import OAuthCallback from "./components/OAuthCallback";
import StudentDashboard from "./pages/student/StudentDashboard";
import OtpForm from "./components/forms/OtpForm";
import { OtpWrapper } from "./pages/OtpWrapper";

const queryClient = new QueryClient();

// Protects private routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/" />;
};

// Handles root "/" route
const RootRedirect = () => {
  const { isAuthenticated, selectedApp, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Login />;

  // User is logged in → redirect based on app/role
  if (selectedApp?.role.toLowerCase().includes("admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (selectedApp?.role.toLowerCase().includes("employee")) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  // Default fallback → App selector
  return <Navigate to="/choose-app" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/otp" element={<OtpWrapper />} />
            <Route
              path="/choose-app"
              element={
                <ProtectedRoute>
                  <AppSelector />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles-management"
              element={
                <ProtectedRoute>
                  <RolesManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/application-management"
              element={
                <ProtectedRoute>
                  <ApplicationManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
