import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import blockedAccountIcon from "@/assets/blocked-account-icon.png";
import languageIcon from "@/assets/language-icon.png";
import visaIcon from "@/assets/visa-icon.png";
import { applicationService } from "@/services/applicationService";

const iconMap: Record<string, string> = {
  "English Language Training": languageIcon,
  "Foreign Language": languageIcon,
  Visa: visaIcon,
  "APS Application": blockedAccountIcon,
  SOP: blockedAccountIcon,
};

const CrossSellSection = ({ email }: { email: string }) => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const response = await applicationService.getCrossSellingApplications(
        email
      );

      // Merge notPurchased + comingSoon
      const formatted = [
        ...response.data.notPurchased,
        ...response.data.comingSoon,
      ].map((item: any) => ({
        ...item,
        icon: iconMap[item.name] ?? blockedAccountIcon,
      }));

      setServices(formatted);
    })();
  }, [email]);

  return (
    <section className="px-3 xs:px-4 sm:px-6">
      {/* Section Header */}
      <Card className="bg-gradient-primary text-primary-foreground p-4 sm:p-5 mb-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-full">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              Enhance Your Journey
            </h2>
            <p className="text-sm text-primary-foreground/90">
              Unlock more services for a smoother experience
            </p>
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc) => (
          <Card
            key={svc.id}
            className="relative overflow-hidden p-4 flex flex-col shadow-sm"
          >
            {/* Coming Soon Badge */}
            {svc.comingSoon && (
              <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                Coming Soon
              </Badge>
            )}

            <CardContent className="p-0 flex flex-col h-full">
              {/* Icon + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <img src={svc.icon} alt={svc.name} className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg">{svc.name}</h3>
              </div>

              {/* Domain Info */}
              <p className="text-sm text-muted-foreground mb-6">
                {svc.domain_url}
              </p>

              {/* Action Button */}
              <a
                href={`https://${svc.domain_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  disabled={svc.comingSoon}
                  className={`w-full mt-auto ${
                    svc.comingSoon
                      ? "bg-muted text-muted-foreground"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  }`}
                >
                  {svc.comingSoon ? "Coming Soon" : "Get Access"}
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CrossSellSection;
