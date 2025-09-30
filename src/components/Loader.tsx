import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="w-[280px]"
      >
        <Card className="rounded-2xl shadow-lg border-none bg-white">
          <CardContent className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            {text && (
              <p className="text-sm text-gray-700 font-medium text-center">
                {text}
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
