import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Settings } from "lucide-react";
import appIcon from "@/assets/app-icon.png";

interface AppCardProps {
  id: string;
  name: string;
  // description: string;
  // status: "active" | "inactive" | "trial";
  // lastAccessed: string;
  // category: string;
  onClick?: () => void;
}

const AppCard = ({
  id,
  name,
  // description,
  // status,
  // lastAccessed,
  // category,
  onClick,
}: AppCardProps) => {
  const statusColors = {
    active: "bg-success text-success-foreground",
    inactive: "bg-muted text-muted-foreground",
    trial: "bg-warning text-warning-foreground",
  };

  const handleOpenApp = () => {
    // console.log(`Opening app: ${name}`);
    if (onClick) {
      onClick(); // ✅ Trigger passed onClick from AppSelector
    }
    // Navigate to app logic here
  };

  const handleManageApp = () => {
    // console.log(`Managing app: ${name}`);
    // Navigate to app settings logic here
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-card-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-primary p-2">
              <img
                src={appIcon}
                alt={`${name} icon`}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground">
                {name}
              </CardTitle>
              {/* <Badge variant="outline" className="mt-1 text-xs">
                {category}
              </Badge> */}
            </div>
          </div>
          {/* <Badge className={`${statusColors[status]} text-xs`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge> */}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
          {description}
        </CardDescription> */}

        {/* <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Last accessed: {lastAccessed}</span>
        </div> */}

        <div className="flex gap-2">
          <Button
            onClick={handleOpenApp}
            className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
            size="sm"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open App
          </Button>
          {/* <Button
            onClick={handleManageApp}
            variant="outline"
            size="sm"
            className="hover:bg-secondary-hover"
          >
            <Settings className="w-4 h-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppCard;
