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

  // Aircraft position state
  const [aircraftX, setAircraftX] = useState(0);
  const [targetX, setTargetX] = useState(300);

  useEffect(() => {
    if (headerRef.current) {
      const spans = headerRef.current.querySelectorAll('span');
      const widths = Array.from(spans).map(
        (span) => span.offsetLeft + span.offsetWidth
      );
      const maxWidth = Math.max(...widths, 0);
      setTargetX(maxWidth + AIRCRAFT_GAP);
    }
  }, [line1, line2, studentName]);

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
  }, [line1, line2, studentName]);

  // Reveal words only if aircraft has passed their position
  const renderWords = (words: string[], offset: number) =>
    words.map((word, i) => (
      <span
        key={i}
        style={{
          visibility: aircraftX > (wordPositions[offset + i] || 0) ? "visible" : "hidden",
          transition: "visibility 0.2s",
          marginRight: "6px"
        }}
      >
        {word}
      </span>
    ));

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" alt={studentName} />
        <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
          {getInitials(studentName)}
        </AvatarFallback>
      </Avatar>
      <div className="relative flex flex-col" ref={headerRef}>
        {/* Aircraft */}
        <img
          src={aircraftImg}
          alt="Aircraft"
          style={{
            position: "absolute",
            left: `${aircraftX}px`,
            top: -3,
            height: "50px",
            width: "60px",
            transition: "left 0.1s linear",
            zIndex: 2,
          }}
        />
        <p className="text-sm font-medium text-foreground" style={{ position: "relative", zIndex: 1 }}>
          {renderWords(words1, 0)}
        </p>
        <p className="text-xs text-muted-foreground" style={{ position: "relative", zIndex: 1 }}>
          {renderWords(words2, words1.length)}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboardHeader;
