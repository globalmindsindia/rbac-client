import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface PromoCardSmallProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  minHeight?: string; // optional to control height
}

const PromoCardSmall: React.FC<PromoCardSmallProps> = ({
  imageUrl,
  title,
  subtitle,
  buttonText = "Explore Now",
  minHeight = "min-h-[200px] xs:min-h-[250px] sm:min-h-[300px]",
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-md ${minHeight}`}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt="Promotion"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-4 xs:p-5 sm:p-6 text-white">
        <div className="space-y-2 xs:space-y-3 sm:space-y-4">
          <h3 className="font-bold text-lg xs:text-xl sm:text-2xl">{title}</h3>
          <p className="text-xs xs:text-sm sm:text-base text-gray-200">{subtitle}</p>
        </div>

        {/* CTA Button */}
        <div className="mt-3 xs:mt-4 sm:mt-5">
          <Button
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-3 xs:px-4 sm:px-5 py-1 xs:py-1.5 sm:py-2 rounded-lg text-xs xs:text-sm sm:text-base"
          >
            {buttonText}
            <ArrowRight className="h-3 xs:h-4 sm:h-5 w-3 xs:w-4 sm:w-5 ml-1 xs:ml-1.5 sm:ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoCardSmall;