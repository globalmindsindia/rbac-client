import ErrorPage from "@/pages/ErrorPage";
import { createBrowserRouter } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { StudentRoutes } from "./StudentRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />, // 👈 catches errors for all children
    children: [...PublicRoutes, ...AdminRoutes, ...StudentRoutes],
  },
]);
