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
  const token = searchParams.get("token"); // e.g., ?token=abc123
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isChecking, setIsChecking] = useState(true); // while verifying token
  const [isValid, setIsValid] = useState(false); // token valid or not

  const [formData, setFormData] = useState({
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // no token at all → mark invalid immediately
    if (!token) {
      setIsChecking(false);
      setIsValid(false);
      return;
    }

    // verify async
    authService
      .verifyResetToken(token)
      .then(() => {
        setIsValid(true);
      })
      .catch(() => {
        setIsValid(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [token]);

  // While verifying token → show loader / spinner / blank
  if (isChecking) {
    return <p className="text-center">Validating reset link...</p>;
  }

  // If invalid token → redirect once, no form flash
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

      // Safely grab message from backend
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

  // Don't render the form if there's no token
  if (!token) {
    return null; // Component will redirect in useEffect
  }

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
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              placeholder="New password"
              className={inputBase}
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <input
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleInputChange("confirm")}
              placeholder="Confirm new password"
              className={inputBase}
              autoComplete="new-password"
            />
            {errors.confirm && (
              <p className="mt-1 text-sm text-red-500">{errors.confirm}</p>
            )}
          </div>

          {/* Submit Button */}
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
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            text-lg
            ${loading ? "opacity-60 cursor-not-allowed" : ""}
          `}
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
