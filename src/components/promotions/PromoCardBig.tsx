import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface PromotionalCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  minHeight?: string; // e.g. "min-h-[150px]"
}

const PromoCardBig: React.FC<PromotionalCardProps> = ({
  imageUrl,
  title,
  subtitle,
  buttonText = "Claim Now",
  minHeight = "min-h-[340px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px]",
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-lg ${minHeight} w-full max-w-[100%]`}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt="Promotion"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-6 md:p-8 text-white">
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight line-clamp-2">
            {title}
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 line-clamp-3">
            {subtitle}
          </p>

          {/* Feature Highlights */}
          <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg">
            <li className="flex items-center gap-2">
              <span>✅</span> Personalized university recommendations
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span> End-to-end visa consultation
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span> Scholarship and funding guidance
            </li>
            <li className="flex items-center gap-2">
              <span>✅</span> Pre-departure support
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <Button
            variant="default"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center justify-center px-5 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl rounded-xl w-full"
          >
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoCardBig;
