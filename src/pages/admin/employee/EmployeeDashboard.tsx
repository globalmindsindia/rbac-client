import React, { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import Footer from "@/components/Footer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Header from "@/components/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Mail,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  CalendarCheck,
  Wallet,
  FileText,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "@/auth/AuthContext";

export default function EmployeeDashboard() {
  const { user, selectedApp } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "profile" | "activity" | "settings"
  >("profile");
  const [moreOpen, setMoreOpen] = useState(false);

  // --- Dummy data; replace with real API data ---
  const salaryData = [
    { date: "Jan ’11", A: 44, B: 13, C: 11, D: 21 },
    { date: "02 Jan", A: 55, B: 23, C: 17, D: 7 },
    { date: "03 Jan", A: 41, B: 20, C: 15, D: 25 },
    { date: "04 Jan", A: 67, B: 8, C: 15, D: 13 },
    { date: "05 Jan", A: 22, B: 13, C: 21, D: 22 },
    { date: "06 Jan", A: 43, B: 27, C: 14, D: 8 },
  ];
  const revenueData = [
    { name: "USA", value: 400 },
    { name: "UK", value: 300 },
    { name: "Australia", value: 300 },
    { name: "Europe", value: 200 },
  ];
  const COLORS = ["#4F46E5", "#6D28D9", "#A78BFA", "#C4B5FD"];
  const balanceData = [
    { date: "Jan", balance: 15000 },
    { date: "Feb", balance: 18000 },
    { date: "Mar", balance: 14000 },
    { date: "Apr", balance: 21000 },
    { date: "May", balance: 12000 },
    { date: "Jun", balance: 20508 },
  ];

  const stats = [
    {
      label: "Name",
      value: user ? `${user.firstName} ${user.lastName}` : "—",
      icon: Users,
      iconColor: "text-primary",
    },
    {
      label: "Email",
      value: user?.email ?? "—",
      icon: Mail,
      iconColor: "text-primary",
    },
    {
      label: "Role",
      value: selectedApp?.role ?? "—",
      icon: BadgeCheck,
      iconColor: "text-success",
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />

        <SidebarInset className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Header & Toggle */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">
                  Welcome, {user?.firstName || "User"}
                </h1>
                <p className="text-muted-foreground">
                  Measure how fast you’re growing monthly recurring revenue
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Users */}
              <div className="relative bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition">
                <span className="absolute top-3 right-3 bg-green-200 text-green-700 text-sm font-semibold px-2 py-1 rounded-md">
                  5
                </span>
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-700">Users</p>
              </div>

              {/* Holidays */}
              <div className="relative bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition">
                <CalendarDays className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-gray-700">Holidays</p>
              </div>

              {/* Events */}
              <div className="relative bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition">
                <span className="absolute top-3 right-3 bg-indigo-700 text-white text-sm font-semibold px-2 py-1 rounded-md">
                  8
                </span>
                <CalendarCheck className="w-8 h-8 text-indigo-600 mb-2" />
                <p className="text-sm font-medium text-gray-700">Events</p>
              </div>

              {/* Payroll */}
              <div className="relative bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition">
                <Wallet className="w-8 h-8 text-emerald-600 mb-2" />
                <p className="text-sm font-medium text-gray-700">Payroll</p>
              </div>

              {/* Accounts */}
              <div className="relative bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition">
                <FileText className="w-8 h-8 text-orange-600 mb-2" />
                <p className="text-sm font-medium text-gray-700">Accounts</p>
              </div>

              {/* Report */}
              <div className="relative bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition">
                <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-sm font-medium text-gray-700">Report</p>
              </div>
            </div>

            {/* Analytics Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Salary Statistics */}
              <Card className="col-span-2">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle>SALARY STATISTICS</CardTitle>
                  <Button variant="ghost" size="icon">
                    <ChevronUp className="w-5 h-5" />
                  </Button>
                </CardHeader>
                <CardContent style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar stackId="a" dataKey="A" fill="#4F46E5" />
                      <Bar stackId="a" dataKey="B" fill="#6D28D9" />
                      <Bar stackId="a" dataKey="C" fill="#A78BFA" />
                      <Bar stackId="a" dataKey="D" fill="#C4B5FD" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Pie */}
              <Card>
                <CardHeader>
                  <CardTitle>REVENUE</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={revenueData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={40}
                        outerRadius={80}
                      >
                        {revenueData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="mt-4 text-2xl font-semibold">
                    1,24,301 <span className="text-green-500">+3.7%</span>
                  </p>
                  <Button className="mt-4">Send Report</Button>
                </CardContent>
              </Card>

              {/* My Balance */}
              <Card>
                <CardHeader>
                  <CardTitle>MY BALANCE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Balance</p>
                  <p className="text-2xl font-semibold mb-4">$20,508</p>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={balanceData}>
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Bank of America</span>
                      <span>$15,025</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-800 w-[75%]"></div>
                    </div>
                    <div className="flex justify-between">
                      <span>RBC Bank</span>
                      <span>$1,843</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-400 w-[10%]"></div>
                    </div>
                    <div className="flex justify-between">
                      <span>Frost Bank</span>
                      <span>$3,641</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-600 w-[18%]"></div>
                    </div>
                  </div>
                  <Button className="mt-4">View More</Button>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
