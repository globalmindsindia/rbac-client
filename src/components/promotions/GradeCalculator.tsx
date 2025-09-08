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

const GradeCalculator: React.FC<PromoCardSmallProps> = ({
  imageUrl,
  title,
  subtitle,
  buttonText = "Explore Now",
  minHeight = "min-h-[300px]",
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
      <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
        <div className="space-y-4">
          <h3 className="font-bold text-2xl">{title}</h3>
          <p className="text-base text-gray-200">{subtitle}</p>
        </div>

        {/* CTA Button */}
        <div className="mt-4">
          <Button
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-4 py-2 rounded-lg"
          >
            {buttonText}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;
