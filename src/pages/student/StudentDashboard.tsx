import React, { useEffect } from "react";
import { useAuth } from "@/auth/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ServicesPieChart from "@/components/student/ServicesPieChart";
import CrossSellSection from "@/components/student/CrossSellSection";
import PurchasedServices from "@/components/student/PurchasedServices";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PromoCardSmall from "@/components/promotions/PromoCardSmall";
import PromoCardBig from "@/components/promotions/PromoCardBig";
import PromotionalBanner from "@/components/promotions/PromotionalBanner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  let activeTab = "overview";
  if (location.pathname === "/student/services") activeTab = "my-services";
  if (location.pathname === "/student/available-services") activeTab = "other-services";

  const handleTabChange = (tab: string) => {
    if (tab === "my-services") navigate("/student/services");
    else if (tab === "other-services") navigate("/student/available-services");
    else navigate(location.pathname);
  };

  return (
    <DashboardLayout>
      <div className="w-full px-2">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ServicesPieChart studentName={user?.firstName} onTabChange={handleTabChange} />
          </div>

          <aside className="space-y-6 flex flex-col">
            <a
              href="https://grade.globalmindsgermany.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <PromoCardSmall
                imageUrl="https://img.freepik.com/free-photo/calculator-colorful-paper-clips_23-2148475323.jpg"
                title="📊 German Grade Calculator"
                subtitle="Convert your grades to the German grading system."
                buttonText="Try Now"
                minHeight="h-[480px]"
              />
            </a>
            <a
              href="https://calculator.globalmindsindia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6"
            >
              <PromoCardSmall
                imageUrl="https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-vector-school-bag-calculator-cyan-cartoon-banner-image_166801.jpg"
                title="💰 Study Cost Calculator"
                subtitle="Estimate your living and tuition costs in Germany."
                buttonText="Calculate Now"
                minHeight="h-[485px]"
              />
            </a>
          </aside>

          <aside className="space-y-6">
            <PromotionalBanner />
            <Card className="p-4">
              <h3 className="font-semibold">Special Offer</h3>
              <p className="text-sm">Upgrade to Premium for exclusive perks!</p>
              <Button className="mt-2 w-full">Learn More</Button>
            </Card>
            <PromoCardBig
              minHeight="min-h-[690px]"
              imageUrl="https://source.unsplash.com/800x1200/?passport,travel"
              title="✈️ Study Abroad Made Easy"
              subtitle="Get complete assistance for your university application, visa process, and relocation."
              buttonText="Book Free Consultation"
            />
          </aside>
        </div>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsContent value="overview" className="mt-6" />

            <TabsContent value="my-services" className="mt-6">
              <PurchasedServices />
            </TabsContent>

            <TabsContent value="other-services" className="mt-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Other Services</h1>
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

export default StudentDashboard;
