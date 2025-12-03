import { useEffect, useState } from "react";
import { Calendar, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { purchasedService } from "@/services/purchasedService";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/auth/AuthContext";

interface Service {
  id: string;
  name: string;
  domain_url?: string;
  status?: "active" | "completed" | "pending";
  purchaseDate?: string;
  description?: string;
  icon?: string;
}

interface ServiceState {
  loading: boolean;
  error: string;
}

const PurchasedServices = () => {
  const { user, loading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serviceStates, setServiceStates] = useState<
    Record<string, ServiceState>
  >({});

  useEffect(() => {
    if (authLoading) return;

    const fetchServices = async () => {
      if (!user?.email) {
        setLoading(false);
        setError("No user email found — please log in again.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await purchasedService.getApplications(user.email);
        setServices(data || []);

        // Initialize per-service state
        const initStates: Record<string, ServiceState> = {};
        (data || []).forEach((s) => {
          initStates[s.id] = { loading: false, error: "" };
        });
        setServiceStates(initStates);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to load your purchased services. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user, authLoading]);

  const handleRedirect = async (service: Service) => {
    if (!user?.email) return;

    const newTab = window.open("about:blank", "_blank");
    if (!newTab) {
      alert("Popup blocked! Please allow popups for this website.");
      return;
    }

    setServiceStates((prev) => ({
      ...prev,
      [service.id]: { ...prev[service.id], loading: true, error: "" },
    }));

    try {
      const rawUrl = await purchasedService.getRedirectUrl(
        user.email,
        service.id
      );

      const normalizeUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) {
          return url;
        }
        return `https://${url}`;
      };

      const finalUrl = normalizeUrl(rawUrl);
      newTab.location.href = finalUrl;
    } catch (err) {
      console.error(err);
      newTab.close();

      setServiceStates((prev) => ({
        ...prev,
        [service.id]: {
          ...prev[service.id],
          error: "Something went wrong while opening this service.",
        },
      }));
    } finally {
      setServiceStates((prev) => ({
        ...prev,
        [service.id]: { ...prev[service.id], loading: false },
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-xs">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Unknown
          </Badge>
        );
    }
  };

  const LoaderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4 space-y-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-6 w-full mt-2" />
        </Card>
      ))}
    </div>
  );

  return (
    <section className="px-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          My Active Services
        </h2>
        <p className="text-sm text-muted-foreground">
          Access and manage your purchased services
        </p>
      </div>

      {(loading || authLoading) && <LoaderSkeleton />}

      {!loading && !authLoading && error && (
        <div className="text-center py-8 text-red-500 font-medium">{error}</div>
      )}

      {!loading && !authLoading && !error && services.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-base">
          You haven’t purchased any services yet.
        </div>
      )}

      {!loading && !authLoading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="bg-gradient-card shadow-card flex flex-col"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {service.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {service.description || "Purchased service access"}
                    </p>
                  </div>
                  {getStatusBadge(service.status || "active")}
                </div>

                {service.purchaseDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    Purchased:{" "}
                    {new Date(service.purchaseDate).toLocaleDateString()}
                  </div>
                )}

                <Button
                  variant="default"
                  onClick={() => handleRedirect(service)}
                  disabled={serviceStates[service.id]?.loading}
                  className="w-full py-2 mt-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-md transition"
                >
                  {serviceStates[service.id]?.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access Service
                    </>
                  )}
                </Button>

                {serviceStates[service.id]?.error && (
                  <p className="text-xs text-red-500 mt-1">
                    {serviceStates[service.id].error}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default PurchasedServices;
