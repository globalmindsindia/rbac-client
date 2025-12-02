import React, { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";

/* ────────────────────────────────────────── */
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

const ResetPasswordForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  // NEW: states for show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsChecking(false);
      setIsValid(false);
      return;
    }

    authService
      .verifyResetToken(token)
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false))
      .finally(() => setIsChecking(false));
  }, [token]);

  if (isChecking) {
    return <p className="text-center">Validating reset link...</p>;
  }

  if (!isValid) {
    navigate("/error", {
      state: {
        message: "Reset link has expired or is invalid",
        redirectPath: "/forgot-password",
        redirectLabel: "Request New Reset Link",
      },
    });
    return null;
  }

  /* ────────── Validation ────────── */
  const validate = () => {
    const newErrors: { password?: string; confirm?: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "At least 6 characters";
    }

    if (formData.confirm !== formData.password) {
      newErrors.confirm = "Passwords do not match";
    }

    return newErrors;
  };

  /* ────────── Submit ────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) return;

    if (!token) {
      navigate("/error", {
        state: {
          message: "Reset token is missing",
          redirectPath: "/forgot-password",
          redirectLabel: "Request New Reset Link",
        },
      });
      return;
    }

    setLoading(true);

    try {
      const data = await authService.resetPassword(
        token!,
        formData.password,
        formData.confirm
      );

      if (data.success) {
        toast({
          title: "Password updated.",
          description: "Please log in with your new password.",
          variant: "default",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        "Please try again or request a new reset link.";

      toast({
        title: "Password reset failed.",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  if (!token) return null;

  /* ────────── UI ────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl px-10 py-12 md:px-14 md:py-14 border border-slate-100">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-2">
            Set your password
          </h3>
          <p className="text-slate-500">
            Choose a strong new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              placeholder="New password"
              className={`${inputBase} pr-12`}
              autoComplete="new-password"
            />

            {/* Eye Icon */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 text-xl select-none"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              value={formData.confirm}
              onChange={handleInputChange("confirm")}
              placeholder="Confirm new password"
              className={`${inputBase} pr-12`}
              autoComplete="new-password"
            />

            {/* Eye Icon */}
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 text-xl select-none"
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>

            {errors.confirm && (
              <p className="mt-1 text-sm text-red-500">{errors.confirm}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-blue-600 to-green-500
              hover:from-blue-700 hover:to-green-600 text-white font-semibold
              rounded-lg transition-all duration-200 shadow-md
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              text-lg ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
