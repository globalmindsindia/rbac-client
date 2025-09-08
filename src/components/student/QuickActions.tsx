import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  FileText,
  MessageCircle,
  Calendar,
  CreditCard,
  Download,
  Upload,
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    { icon: FileText, label: "Documents", color: "text-blue-600" },
    { icon: MessageCircle, label: "Support", color: "text-green-600" },
    { icon: Calendar, label: "Book Call", color: "text-purple-600" },
    { icon: CreditCard, label: "Payments", color: "text-orange-600" },
    { icon: Download, label: "Downloads", color: "text-indigo-600" },
    { icon: Upload, label: "Upload", color: "text-pink-600" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="h-16 flex-col gap-1 hover:bg-gray-50"
            >
              <action.icon className={`h-4 w-4 ${action.color}`} />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
