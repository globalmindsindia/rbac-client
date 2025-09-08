import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Star } from "lucide-react";

const PromotionalBanner = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">
              🎉 Special Offer: Get 20% off on Visa Consultation
            </h3>
            <p className="text-xs text-blue-100">
              Limited time offer - Valid until Sept 30th
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          Claim Now
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionalBanner;
