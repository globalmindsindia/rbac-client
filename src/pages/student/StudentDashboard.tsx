// StudentDashboard.tsx

import React from "react";
import { useAuth } from "@/auth/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StudentDashboardHeader from "@/components/student/StudentDashboardHeader";
import ServicesPieChart from "@/components/student/ServicesPieChart";
import PromotionalBanner from "@/components/promotions/PromotionalBanner";
import RecentActivities from "@/components/student/RecentActivities";
import QuickActions from "@/components/student/QuickActions";
import CrossSellSection from "@/components/student/CrossSellSection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SupportInsights from "@/components/student/SupportInsights";
import PromoCard from "@/components/promotions/PromoCard";
import PromoCardBig from "@/components/promotions/PromoCardBig";
import PromoCardSmall from "@/components/promotions/PromoCardSmall";

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="w-full px-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
          {/* Main Content (spans 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <ServicesPieChart studentName={user?.firstName} />
            <RecentActivities />
          </div>

          {/* Sidebar: Quick Actions & Recent Activities */}
          <aside className="space-y-6">
            <PromoCardSmall
              imageUrl="https://img.freepik.com/free-photo/calculator-colorful-paper-clips_23-2148475323.jpg"
              title="📊 German Grade Calculator"
              subtitle="Convert your grades to the German grading system."
              buttonText="Try Now"
              minHeight="h-[570px]" // custom height
            />

            <PromoCardSmall
              imageUrl="https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-vector-school-bag-calculator-cyan-cartoon-banner-image_166801.jpg"
              title="💰 Study Cost Calculator"
              subtitle="Estimate your living and tuition costs in Germany."
              buttonText="Calculate Now"
              minHeight="h-[570px]" // same height for uniformity
            />
            {/* <QuickActions /> */}
            {/* <RecentActivities /> */}
            {/* <PromoCard /> */}
            {/* <SupportInsights /> */}
          </aside>

          {/* Promo Sidebar Column */}
          <aside className="space-y-6">
            <PromotionalBanner />
            <Card className="p-4">
              <h3 className="font-semibold">Special Offer</h3>
              <p className="text-sm">Upgrade to Premium for exclusive perks!</p>
              <Button className="mt-2 w-full">Learn More</Button>
            </Card>
            <PromoCardBig
              minHeight="min-h-[865px]"
              imageUrl="https://source.unsplash.com/800x1200/?passport,travel"
              title="✈️ Study Abroad Made Easy"
              subtitle="Get complete assistance for your university application, visa process, and relocation."
              buttonText="Book Free Consultation"
            />
          </aside>
        </div>

        {/* Cross-Sell Section Full Width */}
        <div className="mt-6">
          <CrossSellSection />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
