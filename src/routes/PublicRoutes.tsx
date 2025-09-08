import OAuthCallback from "@/components/OAuthCallback";
import ErrorPage from "@/pages/ErrorPage";
import ForgotPasswordForm from "@/pages/ForgotPasswordForm";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { OtpWrapper } from "@/pages/OtpWrapper";
import ResetPasswordForm from "@/pages/ResetPasswordForm";
import { Route } from "react-router-dom";

export const PublicRoutes = [
  <Route key="login" path="/" element={<Login />} />,
  <Route
    key="forgot"
    path="/forgot-password"
    element={<ForgotPasswordForm />}
  />,
  <Route key="reset" path="/reset-password" element={<ResetPasswordForm />} />,
  <Route key="callback" path="/auth/callback" element={<OAuthCallback />} />,
  <Route key="error" path="/error" element={<ErrorPage />} />,
  <Route key="otp" path="/otp" element={<OtpWrapper />} />,
  <Route key="notfound" path="*" element={<NotFound />} />,
];
