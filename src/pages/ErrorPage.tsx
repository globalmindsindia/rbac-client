// ErrorPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get error details from navigation state
  const errorMessage =
    location.state?.message || "An unexpected error occurred";
  const redirectPath = location.state?.redirectPath || "/";
  const redirectLabel = location.state?.redirectLabel || "Go Home";

  const handleRedirect = () => {
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl px-8 py-10 text-center border border-slate-100">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">{errorMessage}</p>
        </div>

        <button
          onClick={handleRedirect}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          {redirectLabel}
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
