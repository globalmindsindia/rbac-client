import { useAuth } from "@/auth/auth";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/gmi_logo.png";
// import SocialLoginButtons from "./SocialLoginButtons";

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// Base input styles for light theme
const inputBase = [
  "w-full",
  "px-4 py-3",
  "bg-white",
  "border border-gray-300",
  "rounded-lg",
  "text-gray-800",
  "placeholder-gray-400",
  "focus:outline-none",
  "focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
  "transition duration-200",
].join(" ");

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const { login, setSelectedApp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      const { email, password } = formData;

      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/v1/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log(data);

        if (data.success && data.user) {
          const { app, apps, redirect, chooseApp } = data;

          if (app && app.role === "Super Admin") {
            login(data.user);
            sessionStorage.setItem("appOptions", JSON.stringify(apps));
            navigate("/admin/dashboard");
          } else if (redirect && app) {
            setSelectedApp(app);
            window.location.href = redirect;
          } else if (chooseApp && apps) {
            login(data.user);
            sessionStorage.setItem("appOptions", JSON.stringify(apps));
            navigate("/choose-app");
          } else {
            toast({
              title: "Login failed",
              description: data.message || "Please try again.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Login failed",
            description: data.message || "Please try again.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Login failed", err);
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-4"
          style={{ width: "150px", height: "100px" }}
        >
          <img
            src={logo} // Replace with your actual logo path
            alt="Company Logo"
            className="w-full h-full object-contain"
          />
        </div>

        <h4 className="text-xl font-semibold text-slate-700 mb-4">
          Login to your account
        </h4>
        <p className="text-slate-400 text-base">
          It's nice to see you again.
          <br />
          Ready to{" "}
          <span className="font-medium text-blue-600">fly, learn and earn</span>
          ?
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username/Email Input */}
        <div>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={inputBase}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Your password"
            className={inputBase}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-400"
            />
            <span className="ml-2 text-sm text-slate-600">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3
            bg-gradient-to-r from-blue-600 to-green-500
            hover:from-blue-700 hover:to-green-600
            text-white font-semibold
            rounded-lg
            transition-all duration-200
            shadow-md
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-2
            text-lg
            flex items-center justify-center
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          {loading && (
            <svg
              className="mr-2 h-5 w-5 animate-spin text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-40"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        {/* <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-white text-gray-300">or</span>
          </div>
        </div> */}

        {/* SocialLoginButtons here if needed */}
        {/* <SocialLoginButtons /> */}

        {/* Sign Up Link */}
        {/* <div className="text-center pt-2">
          <p className="text-gray-500 text-base">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Sign up
            </a>
          </p>
        </div> */}
      </form>
    </div>
  );
};

export default LoginForm;
