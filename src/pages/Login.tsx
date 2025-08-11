import React from "react";
import LoginBrandingSection from "../components/LoginBrandingSection";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <LoginBrandingSection />

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
