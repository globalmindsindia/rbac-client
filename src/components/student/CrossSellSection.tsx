import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import blockedAccountIcon from "@/assets/blocked-account-icon.png";
import languageIcon from "@/assets/language-icon.png";
import visaIcon from "@/assets/visa-icon.png";

interface CrossSellService {
  id: string;
  name: string;
  usp: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  icon: string;
  features: string[];
  isPopular?: boolean;
}

const services: CrossSellService[] = [
  {
    id: "1",
    name: "Blocked Account",
    usp: "Secure account in 24hrs",
    price: "₹7,500",
    originalPrice: "₹10,000",
    discount: "25% OFF",
    icon: blockedAccountIcon,
    features: ["Fast approval", "Document support", "24/7 assistance"],
    isPopular: true,
  },
  {
    id: "2",
    name: "Language Course",
    usp: "Native tutors, flexible schedule",
    price: "₹16,800",
    originalPrice: "₹25,000",
    discount: "33% OFF",
    icon: languageIcon,
    features: ["Native tutors", "Flexible schedule", "Certification"],
  },
  {
    id: "3",
    name: "Visa Guidance",
    usp: "Expert guidance, 100% success",
    price: "₹12,500",
    originalPrice: "₹15,000",
    discount: "17% OFF",
    icon: visaIcon,
    features: ["Consultation", "Doc review", "Success guarantee"],
  },
];

const CrossSellSection = () => (
  <section className="px-3 xs:px-4 sm:px-6">
    <Card className="bg-gradient-primary text-primary-foreground p-3 xs:p-4 sm:p-5 mb-4 xs:mb-5 sm:mb-6 shadow-md">
      <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
        <div className="p-2 xs:p-2.5 sm:p-3 bg-white/20 rounded-full">
          <ShoppingCart className="w-5 xs:w-6 sm:w-7 h-5 xs:h-6 sm:h-7" />
        </div>
        <div>
          <h2 className="text-base xs:text-lg sm:text-xl font-semibold">Enhance Your Journey</h2>
          <p className="text-xs xs:text-sm sm:text-base text-primary-foreground/90">
            Unlock services to maximize your success
          </p>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
      {services.map((svc) => (
        <Card
          key={svc.id}
          className={`relative overflow-hidden border-0 p-2 xs:p-3 sm:p-4 flex flex-col ${
            svc.isPopular ? "ring-2 ring-accent/30" : ""
          }`}
        >
          {svc.isPopular && (
            <Badge className="absolute top-2 xs:top-3 sm:top-4 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-1.5 xs:px-2 sm:px-2.5 py-0.5 text-[0.65rem] xs:text-xs sm:text-sm">
              <Star className="inline w-2.5 xs:w-3 sm:w-3.5 h-2.5 xs:h-3 sm:h-3.5 mr-1" />
              Popular
            </Badge>
          )}
          {svc.discount && (
            <Badge className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 bg-secondary text-secondary-foreground px-1.5 xs:px-2 sm:px-2.5 py-0.5 text-[0.65rem] xs:text-xs sm:text-sm">
              {svc.discount}
            </Badge>
          )}
          <CardContent className="p-3 xs:p-4 sm:p-5 flex flex-col h-full">
            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mb-2 xs:mb-3 sm:mb-4">
              <div className="p-1.5 xs:p-2 sm:p-2.5 bg-primary/10 rounded-lg">
                <img
                  src={svc.icon}
                  alt={svc.name}
                  className="w-5 xs:w-6 sm:w-7 h-5 xs:h-6 sm:h-7"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm xs:text-base sm:text-lg">{svc.name}</h3>
                <p className="text-[0.65rem] xs:text-xs sm:text-sm text-primary font-medium">
                  {svc.usp}
                </p>
              </div>
            </div>

            <div className="mb-2 xs:mb-3 sm:mb-4">
              <span className="text-base xs:text-lg sm:text-xl font-bold">{svc.price}</span>
              {svc.originalPrice && (
                <span className="text-[0.65rem] xs:text-xs sm:text-sm line-through text-muted-foreground ml-1 xs:ml-2">
                  {svc.originalPrice}
                </span>
              )}
            </div>

            <ul className="flex-1 mb-3 xs:mb-4 sm:mb-5 space-y-1 xs:space-y-1.5 sm:space-y-2 text-[0.65rem] xs:text-xs sm:text-sm text-muted-foreground">
              {svc.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                  <span className="w-1 xs:w-1.5 sm:w-2 h-1 xs:h-1.5 sm:h-2 bg-primary rounded-full" />
                  {feat}
                </li>
              ))}
            </ul>

            <Button
              variant="default"
              className="w-full py-1 xs:py-1.5 sm:py-2 mt-auto text-xs xs:text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-md transition"
            >
              <ShoppingCart className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5 mr-1" />
              Purchase
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default CrossSellSection;