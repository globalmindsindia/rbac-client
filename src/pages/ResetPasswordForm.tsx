import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

  const [formData, setFormData] = useState({
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  /* ────────── Validation ────────── */
  const validate = () => {
    const newErrors: { password?: string; confirm?: string } = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "At least 6 characters";

    if (formData.confirm !== formData.password)
      newErrors.confirm = "Passwords do not match";
    return newErrors;
  };

  /* ────────── Submit ────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    if (!token) {
      toast({
        title: "Login failed",
        description: "Invalid or missing token",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/v1/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Password updated.",
          description: "Please log in.",
          variant: "default",
        });
        navigate("/");
      } else {
        toast({
          title: "Password reset failed.",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Unable to reset password.",
        description: "Please try again.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ────────── UI ────────── */
  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl px-10 py-12 md:px-14 md:py-14 border border-slate-100">
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-2">
          Reset your password
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, confirm: e.target.value })
            }
            placeholder="Confirm new password"
            className={inputBase}
            autoComplete="new-password"
          />
          {errors.confirm && (
            <p className="mt-1 text-sm text-red-500">{errors.confirm}</p>
          )}
        </div>

        {/* Button */}
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
  );
};

export default ResetPasswordForm;
