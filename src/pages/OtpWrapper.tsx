import OtpForm from "@/components/forms/OtpForm";
import { useLocation, Navigate } from "react-router-dom";

export const OtpWrapper: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  if (!email) {
    // redirect if no email provided
    return <Navigate to="/login" replace />;
  }

  return <OtpForm email={email} />;
};
