import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/auth";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/" />;
};
