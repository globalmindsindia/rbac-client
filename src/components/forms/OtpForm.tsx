import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface OtpFormProps {
  email: string;
}

const OtpForm: React.FC<OtpFormProps> = ({ email }) => {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const { login, setSelectedApp } = useAuth();
  const navigate = useNavigate();
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const { toast } = useToast();

  // Focus first box on mount & start countdown & request initial OTP
  useEffect(() => {
    inputsRef.current[0]?.focus();
    setCanResend(false);
    setTimer(60);
  }, [email]);

  // Countdown effect
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = "";
      setDigits(newDigits);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Complete the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Step 1: Call backend verifyOtp (which now also logs in)
      const verifyData = await authService.verifyOtp(email, otp);
      // console.log(verifyData);

      if (verifyData.success) {
        toast({
          title: "Login Successful",
          description: verifyData.message || "You are now logged in",
          variant: "default",
        });

        const path = login(verifyData);
        navigate(path || "/", { replace: true });
      } else {
        toast({
          title: "Login failed",
          description: verifyData.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "OTP verification failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(60);
    try {
      const data = await authService.resendOtp(email);
      if (data.success) {
        toast({
          title: "OTP Sent",
          description: data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Resend failed",
          description: data.message,
          variant: "destructive",
        });
        setCanResend(true);
      }
    } catch {
      toast({
        title: "Error",
        description: "Could not resend OTP",
        variant: "destructive",
      });
      setCanResend(true);
    }
  };

  const inputBase = [
    "w-12",
    "h-12",
    "text-center",
    "text-lg",
    "bg-white",
    "border border-gray-300",
    "rounded-lg",
    "focus:outline-none",
    "focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
    "transition duration-200",
  ].join(" ");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg mx-auto bg-white shadow-xl rounded-2xl px-10 py-12 md:px-14 md:py-14 border border-slate-100">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-slate-800 mb-2">
            Enter your OTP
          </h3>
          <p className="text-slate-500">We’ve sent a 6-digit code to {email}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between space-x-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(el) => (inputsRef.current[idx] = el)}
                className={inputBase}
              />
            ))}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend}
              className={`text-blue-600 hover:text-blue-500 font-medium transition-colors ${
                !canResend ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {canResend ? "Resend code" : `Resend in ${timer}s`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
