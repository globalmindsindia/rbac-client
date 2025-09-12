import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface PromotionalCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  minHeight?: string; // e.g. "min-h-[150px]" or "min-h-[200px]"
}

const PromoCardBig: React.FC<PromotionalCardProps> = ({
  imageUrl,
  title,
  subtitle,
  buttonText = "Claim Now",
  minHeight = "min-h-[392px] xs:min-h-[442px] sm:min-h-[492px] md:min-h-[542px] lg:max-h-[592px]",
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-lg ${minHeight} overflow-hidden`}
    >
      {/* Background image */}
      <img
        src="https://i.pinimg.com/736x/ff/f1/77/fff177eb8e027ec5744f3f7713bfded8.jpg"
        alt="Promotion"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 text-white">
        <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5">
          <h3 className="font-bold text-base xs:text-lg sm:text-xl md:text-2xl leading-tight line-clamp-2">{title}</h3>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2">{subtitle}</p>

          {/* Feature Highlights */}
          <ul className="space-y-1 xs:space-y-2 sm:space-y-3 md:space-y-4 text-xs xs:text-sm sm:text-base md:text-lg">
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
              <span>✅</span> Personalized university recommendations
            </li>
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
              <span>✅</span> End-to-end visa consultation
            </li>
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
              <span>✅</span> Scholarship and funding guidance
            </li>
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-2.5">
              <span>✅</span> Pre-departure support
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-5">
          <Button
            variant="default"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-4 xs:px-5 sm:px-6 md:px-7 py-2 xs:py-2.5 sm:py-3 md:py-3.5 text-sm xs:text-base sm:text-lg md:text-xl rounded-xl w-full flex-shrink-0"
          >
            {buttonText}
            <ArrowRight className="h-4 xs:h-5 sm:h-6 md:h-7 w-4 xs:w-5 sm:w-6 md:w-7 ml-2 xs:ml-2.5 sm:ml-3 md:ml-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoCardBig;