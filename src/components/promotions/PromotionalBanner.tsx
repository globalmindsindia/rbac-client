import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Star } from "lucide-react";

const PromotionalBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 xs:p-3 sm:p-4 text-white w-full max-w-lg mx-auto overflow-x-hidden">
      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 xs:gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-1 xs:gap-1.5 sm:gap-2 flex-1 break-words">
          <div className="flex items-center gap-0.5 xs:gap-1">
          
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-xs xs:text-sm sm:text-base break-words">
              🎉 Special Offer: Get 20% off on Visa Consultation
            </h3>
            <p className="text-[0.65rem] xs:text-xs sm:text-sm text-blue-100 break-words">
              Hurry and grab this limited time offer - Valid until Sept 30th
            </p>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 text-xs xs:text-sm sm:text-base rounded-lg w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0"
        >
          Claim Now
          <ArrowRight className="h-2.5 xs:h-3 sm:h-4 w-2.5 xs:w-3 sm:w-4 ml-1 xs:ml-1.5 sm:ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionalBanner;