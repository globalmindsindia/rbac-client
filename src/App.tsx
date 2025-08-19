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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
