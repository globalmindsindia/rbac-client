import React from "react";

const LoginBrandingSection = () => {
  return (
    <div
      className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 py-16 relative overflow-hidden"
      style={{
        background: `
          linear-gradient(
            135deg, 
            rgba(248, 250, 252, 0.95) 0%, 
            rgba(241, 245, 249, 0.95) 50%,
            rgba(226, 232, 240, 0.95) 100%
          ),
          url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="%23e2e8f0" stroke-width="1" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>')`,
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/30 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

      <div className="max-w-lg relative z-10">
        {/* Logo Section */}
        {/* <div className="mb-12">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-white font-bold text-2xl">GMI</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-700">
                Global Minds
              </h3>
              <p className="text-sm text-slate-500">India</p>
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-slate-800 leading-tight">
              Welcome to
            </h1>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Global Minds India
            </h2>
          </div>

          {/* Mission Statement */}
          <div className="space-y-4 pt-4">
            <p className="text-xl text-slate-600 font-medium">
              Let's Fly, Learn and Earn
            </p>
            <p className="text-base text-slate-500 leading-relaxed max-w-md">
              Empowering minds through education and opportunities. Join us on a
              journey of growth, learning, and success.
            </p>
          </div>

          {/* Call to Action */}
          <div className="pt-6">
            <a
              href="https://globalmindsindia.com"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              Know More
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-sm text-slate-400 mb-3">
              Trusted by professionals worldwide
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-500">10K+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-500">500+ Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-slate-500">95% Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBrandingSection;
