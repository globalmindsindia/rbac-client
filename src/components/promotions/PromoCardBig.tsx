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
  minHeight = "min-h-[250px] xs:min-h-[300px] sm:min-h-[350px]",
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-lg ${minHeight}`}
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
      <div className="relative z-10 flex flex-col justify-between h-full p-4 xs:p-6 sm:p-8 text-white">
        <div className="space-y-3 xs:space-y-4 sm:space-y-6">
          <h3 className="font-bold text-xl xs:text-2xl sm:text-3xl leading-snug">{title}</h3>
          <p className="text-sm xs:text-base sm:text-lg text-gray-200">{subtitle}</p>

          {/* Feature Highlights */}
          <ul className="space-y-2 xs:space-y-3 sm:space-y-4 text-xs xs:text-sm sm:text-base">
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <span>✅</span> Personalized university recommendations
            </li>
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <span>✅</span> End-to-end visa consultation
            </li>
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <span>✅</span> Scholarship and funding guidance
            </li>
            <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <span>✅</span> Pre-departure support
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-4 xs:mt-5 sm:mt-6">
          <Button
            variant="default"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-4 xs:px-5 sm:px-6 py-1 xs:py-1.5 sm:py-2 text-xs xs:text-sm sm:text-lg rounded-xl"
          >
            {buttonText}
            <ArrowRight className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 ml-1 xs:ml-1.5 sm:ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoCardBig;