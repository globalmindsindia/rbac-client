import React, { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ServicesPieChart from "@/components/student/ServicesPieChart";
import CrossSellSection from "@/components/student/CrossSellSection";
import PurchasedServices from "@/components/student/PurchasedServices";
import { Button } from "@/components/ui/button";
import PromoCardSmall from "@/components/promotions/PromoCardSmall";
import PromoCardBig from "@/components/promotions/PromoCardBig";
import PromotionalBanner from "@/components/promotions/PromotionalBanner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import EmailSubscriptionForm from "@/components/promotions/EmailSubscriptionForm"; // Import the .tsx file

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pieHeight, setPieHeight] = React.useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(false); // Typed as boolean

  const handleChartResize = (height: number) => {
    setPieHeight(height); // Keep for reference, but not applied to aside
  };

  let activeTab: string = "overview";
  if (location.pathname === "/student/services") activeTab = "my-services";
  if (location.pathname === "/student/available-services") activeTab = "other-services";

  const handleTabChange = (tab: string) => {
    if (tab === "my-services") navigate("/student/services");
    else if (tab === "other-services") navigate("/student/available-services");
    else navigate(location.pathname);
  };

  const handleSubscribeClick = () => {
    setShowForm(true); // Show the form when "Subscribe Now" is clicked
  };

  return (
    <DashboardLayout>
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 flex-1">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-2">
          {/* Main Content: Services Pie Chart */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8 order-first">
            <ServicesPieChart
              studentName={user?.firstName || "Student"}
              onTabChange={handleTabChange}
              onChartResize={handleChartResize}
            />
          </div>

          {/* Aside: Newsletter, Banner, and Other Promo Cards */}
          <aside 
            className="flex flex-col space-y-4 sm:space-y-6 lg:space-y-8 h-full"
            style={{ height: pieHeight ? `${pieHeight}px` : 'auto' }}
          >
            {/* Newsletter */}
            <a
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault(); // Prevent default link behavior
                handleSubscribeClick();
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer lg:flex-1"
            >
              <PromoCardSmall
                imageUrl="https://img.freepik.com/free-vector/newsletter-concept-illustration_114360-1038.jpg"
                title="📰 Stay Updated with Our Newsletter"
                subtitle="Get the latest updates on study abroad opportunities, German education system insights, scholarships, and tips to make your journey smoother."
                buttonText="Subscribe Now"
                minHeight="min-h-[320px]"
                className="w-full h-full"
              />
            </a>
            {/* Promotional Banner */}
            <div className="min-h-[320px] lg:flex-1">
              <PromotionalBanner className="w-full h-full" />
            </div>
            {/* Other Promo Cards */}
            <a
              href="https://grade.globalmindsgermany.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block lg:flex-1"
            >
              <PromoCardSmall
                imageUrl="https://img.freepik.com/free-photo/calculator-colorful-paper-clips_23-2148475323.jpg"
                title="📊 German Grade Calculator"
                subtitle="Convert your grades to the German grading system."
                buttonText="Try Now"
                minHeight="min-h-[320px]"
                className="w-full h-full"
              />
            </a>
            <a
              href="https://calculator.globalmindsindia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block lg:flex-1"
            >
              <PromoCardSmall
                imageUrl="https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-vector-school-bag-calculator-cyan-cartoon-banner-image_166801.jpg"
                title="💰 Study Cost Calculator"
                subtitle="Estimate your living and tuition costs in Germany."
                buttonText="Calculate Now"
                minHeight="min-h-[320px]" // Reduced height for calculator
                className="w-full h-full"
              />
            </a>
          </aside>
        </div>

        {/* Tabs Section */}
        <div className="mt-4">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsContent value="overview" className="mt-2" />
            <TabsContent value="my-services" className="mt-2">
              <PurchasedServices />
            </TabsContent>
            <TabsContent value="other-services" className="mt-2">
              <div className="mb-4">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  Other Services
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground mt-1">
                  Explore and purchase new services to enhance your learning journey
                </p>
              </div>
              <CrossSellSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {showForm && <EmailSubscriptionForm onClose={() => setShowForm(false)} />}
    </DashboardLayout>
  );
};

export default StudentDashboard;