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
  <section>
    <Card className="bg-gradient-primary text-primary-foreground p-4 mb-6 shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-white/20 rounded-full">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Enhance Your Journey</h2>
          <p className="text-sm text-primary-foreground/90">
            Unlock services to maximize your success
          </p>
        </div>
      </div>
    </Card>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {services.map((svc, idx) => (
        <Card
          key={svc.id}
          className={`relative overflow-hidden border-0 p-3 ${
            svc.isPopular ? "ring-2 ring-accent/30" : ""
          }`}
        >
          {svc.isPopular && (
            <Badge className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-2 py-0.5 text-xs">
              <Star className="inline w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {svc.discount && (
            <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-0.5 text-xs">
              {svc.discount}
            </Badge>
          )}
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <img src={svc.icon} alt={svc.name} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-base">{svc.name}</h3>
                <p className="text-xs text-primary font-medium">{svc.usp}</p>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-lg font-bold">{svc.price}</span>
              {svc.originalPrice && (
                <span className="text-xs line-through text-muted-foreground ml-2">
                  {svc.originalPrice}
                </span>
              )}
            </div>

            <ul className="flex-1 mb-4 space-y-1 text-sm text-muted-foreground">
              {svc.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {feat}
                </li>
              ))}
            </ul>

            <Button
              variant="gradient"
              className="w-full py-2 mt-auto hover:shadow-md transition"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Purchase
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default CrossSellSection;
