import { Star, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import icons
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
  testimonial: string;
  features: string[];
  isPopular?: boolean;
}

const CrossSellSection = () => {
  const availableServices: CrossSellService[] = [
    {
      id: "1",
      name: "BLOCKED ACCOUNT",
      usp: "Secure your blocked account in 24hrs!",
      price: "₹7,500",
      originalPrice: "₹10,000",
      discount: "25% OFF",
      icon: blockedAccountIcon,
      testimonial: "",
      features: ["Fast approval", "Document support", "24/7 assistance"],
      isPopular: true,
    },
    {
      id: "2",
      name: "FOREIGN LANGUAGE",
      usp: "Master German/French with native tutors!",
      price: "₹16,800",
      originalPrice: "₹25,000",
      discount: "33% OFF",
      icon: languageIcon,
      testimonial: "",
      features: [
        "Native tutors",
        "Flexible schedule",
        "Certification included",
      ],
    },
    {
      id: "3",
      name: "VISA",
      usp: "Expert visa guidance for 100% success!",
      price: "₹12,500",
      originalPrice: "₹15,000",
      discount: "17% OFF",
      icon: visaIcon,
      testimonial: "",
      features: ["Expert consultation", "Document review", "100% success rate"],
    },
    {
      id: "4",
      name: "UNIVERSITY SHORTLISTING",
      usp: "Find your perfect university match!",
      price: "₹6,600",
      originalPrice: "₹8,300",
      discount: "20% OFF",
      icon: blockedAccountIcon, // Using placeholder icon
      testimonial: "",
      features: [
        "Personalized matching",
        "Application guidance",
        "Success guarantee",
      ],
    },
    {
      id: "5",
      name: "ACCOMMODATION",
      usp: "Secure comfortable housing near campus!",
      price: "₹8,300",
      originalPrice: "₹10,000",
      discount: "17% OFF",
      icon: languageIcon, // Using placeholder icon
      testimonial: "",
      features: ["Verified properties", "Near campus", "Student-friendly"],
    },
  ];

  return (
    <section>
      <Card className="bg-gradient-primary text-primary-foreground p-6 mb-8 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Enhance Your Journey</h2>
            <p className="text-primary-foreground/90">
              Unlock additional services to maximize your study abroad success
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableServices.map((service, index) => (
          <Card
            key={service.id}
            className={`bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0 group relative animate-scale-in ${
              service.isPopular ? "ring-2 ring-primary/30" : ""
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {service.isPopular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-accent text-accent-foreground px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            )}

            {service.discount && (
              <Badge className="absolute top-4 right-4 bg-gradient-secondary text-success-foreground">
                {service.discount}
              </Badge>
            )}

            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-3">
                  <img
                    src={service.icon}
                    alt={service.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg">
                    {service.name}
                  </h3>
                  <p className="text-primary font-semibold text-sm">
                    {service.usp}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-foreground">
                    {service.price}
                  </span>
                  {service.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {service.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <Button
                  className="w-full group-hover:shadow-lg transition-all duration-300"
                  variant="gradient"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CrossSellSection;
