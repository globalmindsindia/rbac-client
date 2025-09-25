import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

// International students with books, suitable for 'study abroad'
const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80";

const PromotionalBanner = ({ className }) => {
  return (
    <div
      className={`relative rounded-md w-full overflow-hidden min-h-[140px] flex flex-col justify-between ${className}`}
      style={{
        background: `
          linear-gradient(100deg, rgba(37,99,235,0.70) 0%, rgba(126,58,242,0.65) 100%),
          url('${BACKGROUND_IMAGE}') center/cover no-repeat
        `,
      }}
    >
      <div className="p-3 flex-1 flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-white break-words">
            🎉 Special Offer: Get 20% off on Visa Consultation
          </h3>
          <p className="text-[11px] sm:text-xs md:text-sm text-blue-100 break-words mt-1">
            Hurry and grab this limited time offer - Valid until Sept 30th
          </p>
        </div>
        {/* Button container with flex to right-align button at bottom */}
        <div className="flex justify-end pt-2">
          <Button
            variant="default"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-2.5 py-1 text-xs sm:text-sm rounded-md"
            style={{ marginTop: "auto" }}
          >
            Claim Now
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
