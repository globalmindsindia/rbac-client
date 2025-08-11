import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";

/* ──────────────────────────────────────────
   Re-use the same base styles you defined
   in LoginForm for perfect visual parity
────────────────────────────────────────── */
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

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  /* ────────── Validation ────────── */
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /* ────────── Submit ────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Email format is invalid");
      return;
    }

    setError("");
    setLoading(true);

    try {
      /* Call your API */
      const res = await fetch(
        "http://localhost:5000/v1/users/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();

      if (data.success) {
        toast({
          title: "Check your inbox.",
          description: data.message || "Password-reset link sent",
          variant: "default",
        });
        setEmail("");
      } else {
        toast({
          title: "Something went wrong",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ────────── UI ────────── */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl px-10 py-12 md:px-14 md:py-14 border border-slate-100">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-2">
            Forgot your password?
          </h3>
          <p className="text-slate-500">
            Enter the email associated with your account and we’ll send you a
            link to reset it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="your@email.com"
              className={inputBase}
              autoComplete="email"
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

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
            {loading ? "Sending..." : "Send reset link"}
          </button>

          <div className="text-center pt-2">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Back to login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
