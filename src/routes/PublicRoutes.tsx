import OAuthCallback from "@/components/OAuthCallback";
import ErrorPage from "@/pages/ErrorPage";
import ForgotPasswordForm from "@/pages/ForgotPasswordForm";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { OtpWrapper } from "@/pages/OtpWrapper";
import ResetPasswordForm from "@/pages/ResetPasswordForm";

export const PublicRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordForm />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordForm />,
  },
  {
    path: "/auth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/error",
    element: <ErrorPage />,
  },
  {
    path: "/otp",
    element: <OtpWrapper />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
