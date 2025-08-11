import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppCard from "@/components/AppCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/auth/auth";

const AppSelector = () => {
  const { setSelectedApp, user, isAuthenticated } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // console.log("In ChooseAppPage - isAuthenticated:", isAuthenticated);
  // console.log("User:", user);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // ✅ Load apps from sessionStorage
  useEffect(() => {
    const storedApps = sessionStorage.getItem("appOptions");
    if (storedApps) {
      setApps(JSON.parse(storedApps));
    }
  }, []);

  // ✅ Filtered apps by search
  const filteredApps = apps.filter((app) =>
    app.appName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Handle click on app
  const handleSelect = (app: any) => {
    if (user) {
      setSelectedApp(app); // user already exists in context
      localStorage.removeItem("userInfo");
      localStorage.removeItem("selectedApp");
      window.location.href = `https://${app.domainUrl}`;
    } else {
      alert("User info missing. Please log in again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back {user ? `${user.firstName} ${user.lastName}` : "User"}{" "}
            👋
          </h1>
          <p className="text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-primary">
              {filteredApps.length}
            </span>{" "}
            active applications
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* App List */}
        {filteredApps.length > 0 ? (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredApps.map((app) => (
              <AppCard
                key={app?.appId}
                id={app?.appId}
                name={app?.appName}
                description={app?.description || "NA"}
                status={app?.status || "NA"}
                lastAccessed={app?.lastAccessed || "NA"}
                category={app?.category || "NA"}
                onClick={() => handleSelect(app)} // 🔗 redirect on click
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-10 w-10 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p>Try adjusting your search term or filters.</p>
            <Button onClick={() => setSearchTerm("")} className="mt-4">
              Clear Search
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppSelector;
