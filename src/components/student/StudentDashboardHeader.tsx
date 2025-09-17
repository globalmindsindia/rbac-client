import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import aircraftImg from "@/assets/aircraft.png";

interface DashboardHeaderProps {
  studentName: string;
}

const ANIMATION_DURATION = 1800;
const AIRCRAFT_EXTRA_MARGIN = 8; // Minimal gap in px after the text
const AIRCRAFT_IMG_WIDTH = 48;
const AIRCRAFT_IMG_HEIGHT = 40;

function getInitials(name: string): string {
  const words = name.trim().split(" ");
  if (words.length === 1) {
    const word = words[0];
    return (
      (word.length > 0 ? word[0].toUpperCase() : "") +
      (word.length > 1 ? word[1].toUpperCase() : "")
    );
  }
  const firstWord = words[0];
  const lastWord = words[words.length - 1];
  return (
    (firstWord.length > 0 ? firstWord[0].toUpperCase() : "") +
    (lastWord.length > 0 ? lastWord[0].toUpperCase() : "")
  );
}

const StudentDashboardHeader: React.FC<DashboardHeaderProps> = ({
  studentName,
}) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";
  const line1 = `${greeting}, ${studentName}!`;
  const line2 = "Welcome to your study abroad journey";

  const containerRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);

  const [containerWidth, setContainerWidth] = useState(300);
  const [greetingWidth, setGreetingWidth] = useState(0);
  const [aircraftX, setAircraftX] = useState(0);

  useEffect(() => {
    // Update on mount and resize
    const updateWidths = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      if (greetingRef.current) {
        setGreetingWidth(greetingRef.current.offsetWidth);
      }
    };
    updateWidths();
    window.addEventListener("resize", updateWidths);
    return () => window.removeEventListener("resize", updateWidths);
  }, [studentName]);

  // Animate aircraft to the exact position after greeting
  useEffect(() => {
    let start: number | null = null;
    const target = greetingWidth + AIRCRAFT_EXTRA_MARGIN;
    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setAircraftX(progress * target);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    return () => setAircraftX(0);
  }, [greetingWidth, studentName]);

  // Responsive scaling for aircraft
  const getScale = () => {
    if (containerWidth < 320) return 0.8;
    if (containerWidth < 640) return 0.9;
    if (containerWidth < 1024) return 1.0;
    return 1.2;
  };
  const scale = getScale();

  return (
    <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
      <Avatar className="h-6 xs:h-7 sm:h-8 w-6 xs:w-7 sm:w-8">
        <AvatarImage src="" alt={studentName} />
        <AvatarFallback className="bg-blue-500 text-white text-xs xs:text-sm sm:text-base font-medium">
          {getInitials(studentName)}
        </AvatarFallback>
      </Avatar>
      <div className="relative flex flex-col max-w-full" ref={containerRef}>
        <div style={{ position: "relative", minHeight: `${AIRCRAFT_IMG_HEIGHT * scale}px` }}>
          {/* Greeting Text */}
          <span
            ref={greetingRef}
            className="text-xs xs:text-sm sm:text-base font-medium text-foreground"
            style={{ whiteSpace: "nowrap", zIndex: 1 }}
          >
            {line1}
          </span>
          {/* Animated Aircraft */}
          <img
            src={aircraftImg}
            alt="Aircraft"
            style={{
              position: "absolute",
              left: `${aircraftX}px`,
              top: -3 * scale,
              height: `${AIRCRAFT_IMG_HEIGHT * scale}px`,
              width: `${AIRCRAFT_IMG_WIDTH * scale}px`,
              transition: "left 0.1s linear",
              zIndex: 2,
              pointerEvents: "none",
            }}
            className="max-w-none"
          />
        </div>
        <p className="text-[0.65rem] xs:text-xs sm:text-sm text-muted-foreground" style={{ marginTop: "2px" }}>
          {line2}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboardHeader;
