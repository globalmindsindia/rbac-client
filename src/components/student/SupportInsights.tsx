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
  <Card className="p-3 xs:p-4 sm:p-5 space-y-3 xs:space-y-4 sm:space-y-5 min-h-[250px] xs:min-h-[280px] sm:min-h-[330px] mt-3 xs:mt-4 sm:mt-5">
    <h3 className="text-base xs:text-lg sm:text-xl font-semibold">Support & Insights</h3>
    <ul className="space-y-2 xs:space-y-3 sm:space-y-4 text-xs xs:text-sm sm:text-base">
      <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
        <MessageCircle className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5 text-primary" />
        <Button
          variant="link"
          className="p-0 text-primary hover:underline text-xs xs:text-sm sm:text-base"
        >
          Live Chat Support
        </Button>
      </li>
      <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
        <CalendarClock className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5 text-primary" />
        <span>Upcoming Deadlines:</span>
      </li>
      <ul className="pl-4 xs:pl-5 sm:pl-6 space-y-1 xs:space-y-1.5 sm:space-y-2">
        {upcoming.map((item) => (
          <li key={item.label} className="flex justify-between text-[0.65rem] xs:text-xs sm:text-sm">
            <span>{item.label}</span>
            <span className="font-medium">{item.date}</span>
          </li>
        ))}
      </ul>
      <li className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
        <BookOpen className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5 text-primary" />
        <Button
          variant="link"
          className="p-0 text-primary hover:underline text-xs xs:text-sm sm:text-base"
        >
          Study Tips & Articles
        </Button>
      </li>
    </ul>
  </Card>
);

export default SupportInsights;