import { Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import apsIcon from "@/assets/aps-icon.png";
import ieltsIcon from "@/assets/ielts-icon.png";
import sopIcon from "@/assets/sop-icon.png";
import languageIcon from "@/assets/language-icon.png";

interface Service {
  id: string;
  name: string;
  status: "active" | "completed" | "pending";
  purchaseDate: string;
  icon: string;
  description: string;
}

const PurchasedServices = () => {
  const purchasedServices: Service[] = [
    {
      id: "1",
      name: "APS",
      status: "active",
      purchaseDate: "2024-08-15",
      icon: apsIcon,
      description: "Academic Programs and Services application processing",
    },
    {
      id: "2",
      name: "IELTS",
      status: "active",
      purchaseDate: "2024-07-20",
      icon: ieltsIcon,
      description: "Complete IELTS test preparation course",
    },
    {
      id: "3",
      name: "SOP",
      status: "active",
      purchaseDate: "2024-08-25",
      icon: sopIcon,
      description: "Professional Statement of Purpose writing service",
    },
    {
      id: "4",
      name: "Foreign Language",
      status: "active",
      purchaseDate: "2024-09-01",
      icon: languageIcon,
      description: "Comprehensive foreign language learning program",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[0.65rem] xs:text-xs sm:text-sm">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-[0.65rem] xs:text-xs sm:text-sm">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-[0.65rem] xs:text-xs sm:text-sm">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[0.65rem] xs:text-xs sm:text-sm">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <section className="px-3 xs:px-4 sm:px-6 mb-4 xs:mb-6 sm:mb-8">
      <div className="text-center mb-4 xs:mb-6 sm:mb-8">
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground mb-1 xs:mb-2 sm:mb-3">
          My Active Services
        </h2>
        <p className="text-xs xs:text-sm sm:text-base text-muted-foreground">
          Access and manage your purchased services
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
        {purchasedServices.map((service, index) => (
          <Card
            key={service.id}
            className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0 group animate-slide-up flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-3 xs:p-4 sm:p-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-2 xs:mb-3 sm:mb-4">
                <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                  <div className="w-10 xs:w-11 sm:w-12 h-10 xs:h-11 sm:h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-1.5 xs:p-2 sm:p-2.5">
                    <img
                      src={service.icon}
                      alt={service.name}
                      className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm xs:text-base sm:text-lg text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-[0.65rem] xs:text-xs sm:text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>

              <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[0.65rem] xs:text-xs sm:text-sm text-muted-foreground mb-2 xs:mb-3 sm:mb-4">
                <Calendar className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5" />
                Purchased: {new Date(service.purchaseDate).toLocaleDateString()}
              </div>

              <Button
                variant="default"
                className="w-full py-1 xs:py-1.5 sm:py-2 mt-auto text-xs xs:text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-md transition"
                size="sm"
              >
                <ExternalLink className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5 mr-1 xs:mr-1.5 sm:mr-2" />
                Access Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PurchasedServices;