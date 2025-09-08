import { CheckCircle, Calendar, ExternalLink } from "lucide-react";
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
          <Badge className="bg-gradient-primary text-primary-foreground">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gradient-secondary text-success-foreground">
            Completed
          </Badge>
        );
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <section className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          My Active Services
        </h2>
        <p className="text-muted-foreground">
          Access and manage your purchased services
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedServices.map((service, index) => (
          <Card
            key={service.id}
            className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-0 group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-2">
                    <img
                      src={service.icon}
                      alt={service.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                  </div>
                </div>
                {getStatusBadge(service.status)}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="w-4 h-4" />
                Purchased: {new Date(service.purchaseDate).toLocaleDateString()}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-primary to-purple-500 text-white"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
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
