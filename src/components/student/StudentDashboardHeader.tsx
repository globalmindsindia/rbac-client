import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import aircraftImg from "@/assets/aircraft.png";

interface DashboardHeaderProps {
  studentName: string;
}

const ANIMATION_DURATION = 1800; // ms
const AIRCRAFT_GAP = 8; // px space between text end and aircraft

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

  const words1 = line1.split(" ");
  const words2 = line2.split(" ");

  const headerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(300);

  // Aircraft position state
  const [aircraftX, setAircraftX] = useState(0);
  const [targetX, setTargetX] = useState(300);

  // Responsive scaling factor
  const getScale = () => {
    if (containerWidth < 320) return 0.8; // Mobile
    if (containerWidth < 640) return 0.9; // Larger mobile
    if (containerWidth < 1024) return 1.0; // Tablet
    return 1.2; // Desktop
  };

  // Update container width and targetX
  useEffect(() => {
    const updateDimensions = () => {
      if (headerRef.current) {
        const width = headerRef.current.offsetWidth;
        setContainerWidth(width);
        const spans = headerRef.current.querySelectorAll('span');
        const widths = Array.from(spans).map(
          (span) => span.offsetLeft + span.offsetWidth
        );
        const maxWidth = Math.min(Math.max(...widths, 0), width - 60 * getScale()); // Prevent overflow
        setTargetX(maxWidth + AIRCRAFT_GAP * getScale());
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [line1, line2, studentName]);

  // Aircraft animation
  useEffect(() => {
    let start: number | null = null;
    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setAircraftX(progress * targetX);
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [targetX]);

  // Calculate left positions for words for reveal
  const [wordPositions, setWordPositions] = useState<number[]>([]);

  useEffect(() => {
    if (headerRef.current) {
      const spans = headerRef.current.querySelectorAll('span');
      const positions = Array.from(spans).map(
        (span) => span.offsetLeft + span.offsetWidth / 2
      );
      setWordPositions(positions);
    }
  }, [line1, line2, studentName, containerWidth]);

  // Render words with responsive reveal
  const renderWords = (words: string[], offset: number) =>
    words.map((word, i) => (
      <span
        key={i}
        style={{
          visibility: aircraftX > (wordPositions[offset + i] || 0) ? "visible" : "hidden",
          transition: "visibility 0.2s",
          marginRight: `${4 * getScale()}px`, // Responsive word spacing
        }}
        className="inline-block"
      >
        {word}
      </span>
    ));

  const scale = getScale();

  return (
    <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
      <Avatar className="h-6 xs:h-7 sm:h-8 w-6 xs:w-7 sm:w-8">
        <AvatarImage src="" alt={studentName} />
        <AvatarFallback className="bg-blue-500 text-white text-xs xs:text-sm sm:text-base font-medium">
          {getInitials(studentName)}
        </AvatarFallback>
      </Avatar>
      <div className="relative flex flex-col max-w-full" ref={headerRef}>
        {/* Aircraft */}
        <img
          src={aircraftImg}
          alt="Aircraft"
          style={{
            position: "absolute",
            left: `${aircraftX}px`,
            top: -3 * scale,
            height: `${40 * scale}px`,
            width: `${48 * scale}px`,
            transition: "left 0.1s linear",
            zIndex: 2,
          }}
          className="max-w-none"
        />
        <p className="text-xs xs:text-sm sm:text-base font-medium text-foreground" style={{ position: "relative", zIndex: 1 }}>
          {renderWords(words1, 0)}
        </p>
        <p className="text-[0.65rem] xs:text-xs sm:text-sm text-muted-foreground" style={{ position: "relative", zIndex: 1 }}>
          {renderWords(words2, words1.length)}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboardHeader;