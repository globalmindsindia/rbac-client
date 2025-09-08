import React from "react";
import { useSearchParams } from "react-router-dom";
import PurchasedServices from "@/components/student/PurchasedServices";
import CrossSellSection from "@/components/student/CrossSellSection";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "my-services";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsContent value="my-services" className="mt-6">
              <PurchasedServices />
            </TabsContent>
            <TabsContent value="other-services" className="mt-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">
                  Other Services
                </h1>
                <p className="text-muted-foreground mt-2">
                  Explore and purchase new services to enhance your learning journey
                </p>
              </div>
              <CrossSellSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Services;
