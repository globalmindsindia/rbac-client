import { BrowserRouter, Routes } from "react-router-dom";
import { AdminRoutes } from "./routes/AdminRoutes";
import { StudentRoutes } from "./routes/StudentRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "./auth/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {PublicRoutes}
            {AdminRoutes}
            {StudentRoutes}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
