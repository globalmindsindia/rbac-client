import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { newsletterService } from "@/services/newsletterService"; // Import newsletterService

interface EmailSubscriptionFormProps {
  onClose: () => void;
}

const EmailSubscriptionForm: React.FC<EmailSubscriptionFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Directly use the newsletterService API
      await newsletterService.subscribe(email, "webform"); // Source can be modified as needed for tracking
      // On success
      setMessage("Thank you for subscribing!");
      setEmail("");
      setTimeout(onClose, 2000); // Close after 2 seconds
    } catch (err: any) {
      // err may be AxiosError or generic
      const apiError =
        err?.response?.data?.error ||
        err?.message ||
        "An error occurred. Please try again later.";
      setError(apiError);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out hover:shadow-3xl">
        <div className="absolute -top-10 -left-10 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" fill="#4CAF50"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Subscribe to Newsletter
        </h2>
        {error && (
          <p className="text-red-600 mb-4 flex items-center space-x-2">
            <span className="text-red-500">!</span>
            <span>{error}</span>
          </p>
        )}
        {message ? (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Check className="w-6 h-6 text-green-500" />
            <p className="text-lg font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 placeholder-gray-400"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
            </div>
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="mt-2 bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="mt-2 bg-green-500 text-white hover:bg-green-600 transition duration-200"
              >
                Subscribe Now
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailSubscriptionForm;
