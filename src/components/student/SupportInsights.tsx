import React from "react";
import { MessageCircle, CalendarClock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const upcoming = [
  { label: "Submit transcripts", date: "Sep 10" },
  { label: "Visa appointment", date: "Sep 15" },
  { label: "Language test", date: "Oct 01" },
];

const SupportInsights = () => (
  <Card className="p-4 space-y-4 min-h-[330px] mt-4 ">
    {" "}
    {/* 👈 increased height */}
    <h3 className="text-lg font-semibold">Support & Insights</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <Button variant="link" className="p-0 text-primary hover:underline">
          Live Chat Support
        </Button>
      </li>
      <li className="flex items-center gap-2">
        <CalendarClock className="w-4 h-4 text-primary" />
        <span>Upcoming Deadlines:</span>
      </li>
      <ul className="pl-6 space-y-1">
        {upcoming.map((item) => (
          <li key={item.label} className="flex justify-between">
            <span>{item.label}</span>
            <span className="font-medium">{item.date}</span>
          </li>
        ))}
      </ul>
      <li className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-primary" />
        <Button variant="link" className="p-0 text-primary hover:underline">
          Study Tips & Articles
        </Button>
      </li>
    </ul>
  </Card>
);

export default SupportInsights;
