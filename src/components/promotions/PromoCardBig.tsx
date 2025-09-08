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
  minHeight = "min-h-[150px]",
}) => {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-lg ${minHeight}`}
    >
      {/* Background image */}
      <img
        // src={imageUrl}
        src="https://i.pinimg.com/736x/ff/f1/77/fff177eb8e027ec5744f3f7713bfded8.jpg"
        alt="Promotion"
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
        <div className="space-y-6">
          <h3 className="font-bold text-3xl leading-snug">{title}</h3>
          <p className="text-lg text-gray-200">{subtitle}</p>

          {/* Feature Highlights */}
          <ul className="space-y-4 text-base">
            <li>✅ Personalized university recommendations</li>
            <li>✅ End-to-end visa consultation</li>
            <li>✅ Scholarship and funding guidance</li>
            <li>✅ Pre-departure support</li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-6">
          <Button
            variant="secondary"
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 flex items-center px-6 py-3 text-lg rounded-xl"
          >
            Book Free Consultation
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromoCardBig;
