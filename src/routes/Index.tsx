import { createBrowserRouter } from "react-router-dom";
import { AdminRoutes } from "./AdminRoutes";
import { PublicRoutes } from "./PublicRoutes";
import { StudentRoutes } from "./StudentRoutes";

export const router = createBrowserRouter([
  ...PublicRoutes,
  ...AdminRoutes,
  ...StudentRoutes,
]);
