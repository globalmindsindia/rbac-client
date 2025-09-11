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
      <div className="w-full px-3 xs:px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mt-4 xs:mt-5 sm:mt-6">
          <div className="sm:col-span-2 lg:col-span-2 space-y-4 xs:space-y-5 sm:space-y-6">
            <ServicesPieChart studentName={user?.firstName || "Student"} onTabChange={handleTabChange} />
          </div>

          <aside className="space-y-4 xs:space-y-5 sm:space-y-6 flex flex-col">
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
                minHeight="min-h-[360px] xs:min-h-[400px] sm:min-h-[440px] lg:min-h-[640px]"
              />
            </a>
            <a
              href="https://calculator.globalmindsindia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 xs:mt-5 sm:mt-6"
            >
              <PromoCardSmall
                imageUrl="https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-vector-school-bag-calculator-cyan-cartoon-banner-image_166801.jpg"
                title="💰 Study Cost Calculator"
                subtitle="Estimate your living and tuition costs in Germany."
                buttonText="Calculate Now"
                minHeight="min-h-[360px] xs:min-h-[400px] sm:min-h-[440px] lg:min-h-[640px]"
              />
            </a>
          </aside>

          <aside className="space-y-4 xs:space-y-5 sm:space-y-8">
            <PromotionalBanner />
            <Card className="p-4 xs:p-6 sm:p-10 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-md border border-blue-200">
  <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-blue-700">
    Special Offer
  </h3>
  <p className="text-xs xs:text-sm sm:text-base text-blue-800 mt-2 xs:mt-3 leading-relaxed">
    Register Now and get upto <span className="font-bold text-blue-900">1 lakh</span> offer on our premium services!
  </p>
  <Button className="mt-4 xs:mt-5 w-full text-xs xs:text-sm sm:text-base py-2 xs:py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-300">
    Learn More
  </Button>
</Card>

            <PromoCardBig
              minHeight="min-h-[520px] xs:min-h-[580px] sm:min-h-[640px] lg:min-h-[850px]"
              imageUrl="https://source.unsplash.com/800x1200/?passport,travel"
              title="✈️ Study Abroad Made Easy"
              subtitle="Get complete assistance for your university application, visa process, and relocation."
              buttonText="Book Free Consultation"
            />
          </aside>
        </div>

        <div className="mt-4 xs:mt-5 sm:mt-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsContent value="overview" className="mt-4 xs:mt-5 sm:mt-6" />

            <TabsContent value="my-services" className="mt-4 xs:mt-5 sm:mt-6">
              <PurchasedServices />
            </TabsContent>

            <TabsContent value="other-services" className="mt-4 xs:mt-5 sm:mt-6">
              <div className="mb-4 xs:mb-5 sm:mb-6">
                <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground">
                  Other Services
                </h1>
                <p className="text-xs xs:text-sm sm:text-base text-muted-foreground mt-1 xs:mt-2">
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