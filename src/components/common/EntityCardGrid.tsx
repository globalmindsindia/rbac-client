// components/common/EntityCardGrid.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ReactNode } from "react";

export function EntityCardGrid<T>({
  items,
  renderCard,
}: {
  items: T[];
  renderCard: (item: T) => ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, i) => renderCard(item))}
    </div>
  );
}
