import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/auth";
import { useToast } from "@/hooks/use-toast";
import { getApi } from "@/api/api";

interface AuthCallbackState {
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { login, setSelectedApp } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<AuthCallbackState>({
    loading: true,
    error: null,
    retryCount: 0,
  });

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const handleOAuthCallback = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Add a small delay to ensure cookies are set
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verify authentication by fetching user profile
        const { data } = await getApi().get("/v1/users/profile", {
          withCredentials: true,
          timeout: 15000, // 15 second timeout
        });

        if (!isMounted) return;

        if (data.success && data.user) {
          // ✅ Pass the entire payload to login
          login(data);

          const { redirect, chooseApp, apps } = data;

          // Clear any existing session storage
          sessionStorage.removeItem("oauth_error");

          // Show success message
          toast({
            title: "Login successful",
            description: `Welcome back, ${
              data.user.firstName || data.user.email
            }!`,
            variant: "default",
          });

          // Handle routing
          if (redirect) {
            if (redirect.startsWith("/")) {
              navigate(redirect, { replace: true });
            } else {
              window.location.href = redirect;
            }
          } else if (chooseApp && apps) {
            sessionStorage.setItem("appOptions", JSON.stringify(apps));
            navigate("/choose-app", { replace: true });
          } else {
            // Default redirect
            navigate("/employee/dashboard", { replace: true });
          }
        } else {
          throw new Error(
            data.message || "Authentication failed - invalid response"
          );
        }
      } catch (error: any) {
        if (!isMounted) return;

        console.error("OAuth callback error:", error);

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Authentication failed. Please try again.";

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          retryCount: prev.retryCount + 1,
        }));

        // Store error in session for potential retry
        sessionStorage.setItem("oauth_error", errorMessage);

        // Auto-retry once after a delay
        if (state.retryCount === 0) {
          timeoutId = setTimeout(() => {
            if (isMounted) {
              handleOAuthCallback();
            }
          }, 2000);
        } else {
          // After retry fails, show error and redirect
          toast({
            title: "Authentication failed",
            description: errorMessage,
            variant: "destructive",
          });

          timeoutId = setTimeout(() => {
            if (isMounted) {
              navigate("/?error=" + encodeURIComponent(errorMessage), {
                replace: true,
              });
            }
          }, 3000);
        }
      }
    };

    handleOAuthCallback();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [navigate, login, setSelectedApp, toast, state.retryCount]);

  // Retry handler
  const handleRetry = () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    window.location.reload(); // Simple retry by reloading
  };

  const handleGoToLogin = () => {
    navigate("/", { replace: true });
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Completing your login...
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we verify your authentication with Zoho.
          </p>
          <div className="flex justify-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <div className="space-y-3">
            {state.retryCount === 0 && (
              <button
                onClick={handleRetry}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
              >
                Try Again
              </button>
            )}
            <button
              onClick={handleGoToLogin}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition duration-200"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
