import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const PromotionalBanner = ({ className }) => {
  return (
    <div
      className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-md px-3 py-2 text-white w-full overflow-x-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 min-w-0">
          <div className="min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm md:text-base break-words">
              🎉 Special Offer: Get 20% off on Visa Consultation
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-blue-100 break-words mt-1">
              Hurry and grab this limited time offer - Valid until Sept 30th
            </p>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-2.5 py-1 text-xs sm:text-sm rounded-md w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0"
        >
          Claim Now
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionalBanner;
