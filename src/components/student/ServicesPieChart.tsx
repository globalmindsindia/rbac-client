import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProgressStep {
  name: string;
  progress: number;
}

interface ServiceData {
  name: string;
  value: number;
  purchased: boolean;
  color: string;
  number: string;
  icon: string;
  progressSteps?: ProgressStep[];
  overallProgress?: number;
}

export default function ServicesPieChart({
  studentName,
  onTabChange,
  onChartResize,
}: {
  studentName: string;
  onTabChange?: (tab: string) => void;
  onChartResize?: (h: number) => void;
}) {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [hoveredRayIndex, setHoveredRayIndex] = useState<number | null>(null);
  const hoveredRef = useRef({ overSlice: false, overRay: false });
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const servicesData: ServiceData[] = [
    {
      name: "APS",
      value: 12.5,
      purchased: true,
      color: "#3b82f6",
      number: "01",
      icon: "📋",
      overallProgress: 75,
      progressSteps: [
        { name: "Registration", progress: 100 },
        { name: "Document Upload", progress: 100 },
        { name: "Review", progress: 60 },
        { name: "Approval", progress: 0 },
        { name: "Certificate Issued", progress: 0 },
      ],
    },
    {
      name: "IELTS",
      value: 12.5,
      purchased: true,
      color: "#ec4899",
      number: "02",
      icon: "📚",
      overallProgress: 90,
      progressSteps: [
        { name: "Registration", progress: 100 },
        { name: "Preparation", progress: 100 },
        { name: "Test Completed", progress: 100 },
        { name: "Results Received", progress: 20 },
      ],
    },
    {
      name: "SOP",
      value: 12.5,
      purchased: true,
      color: "#10b981",
      number: "03",
      icon: "📝",
      overallProgress: 40,
      progressSteps: [
        { name: "Draft Creation", progress: 100 },
        { name: "Review", progress: 80 },
        { name: "Finalization", progress: 0 },
        { name: "Submission", progress: 0 },
      ],
    },
    {
      name: "BLOCKED ACCOUNT",
      value: 12.5,
      purchased: false,
      color: "#9ca3af",
      number: "04",
      icon: "🏦",
    },
    {
      name: "FOREIGN LANGUAGE",
      value: 12.5,
      purchased: false,
      color: "#9ca3af",
      number: "05",
      icon: "🗣️",
    },
    {
      name: "UNIVERSITY SHORTLISTING",
      value: 12.5,
      purchased: false,
      color: "#9ca3af",
      number: "06",
      icon: "🎓",
    },
    {
      name: "VISA",
      value: 12.5,
      purchased: false,
      color: "#9ca3af",
      number: "07",
      icon: "✈️",
    },
    {
      name: "ACCOMODATION",
      value: 12.5,
      purchased: false,
      color: "#9ca3af",
      number: "08",
      icon: "🏠",
    },
  ];

  const abbrMap: Record<string, string> = {
    APS: "APS",
    IELTS: "IELTS",
    SOP: "SOP",
    "BLOCKED ACCOUNT": "Blocked Account",
    "FOREIGN LANGUAGE": "Foreign Language",
    "UNIVERSITY SHORTLISTING": "University Shortlist",
    VISA: "VISA",
    ACCOMODATION: "Accomo..",
  };

  const [dimensions, setDimensions] = useState({ width: 700, height: 700 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let size = Math.min(containerWidth - 40, 500);
        if (window.innerWidth < 640) {
          size = Math.min(containerWidth - 20, 350);
        } else if (window.innerWidth < 1024) {
          size = Math.min(containerWidth - 30, 450);
        } else if (window.innerWidth < 1366) {
          size = Math.min(containerWidth - 40, 550);
        }
        setDimensions({ width: size, height: size });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    onChartResize?.(dimensions.height);
  }, [dimensions.height, onChartResize]);

  const scale = dimensions.width / 500;
  const center = dimensions.width / 2;
  const outerRadius = 180 * scale;
  const innerRadius = 80 * scale;
  const chartRadius = 130 * scale;
  const borderRadius = 230 * scale;
  const numberRadius = 280 * scale;
  const svgHeight = dimensions.width * (530 / 500);

  let currentAngle = 0;
  const slicesWithAngles = servicesData.map((service) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (service.value / 100) * 360;
    const midAngle = (startAngle + endAngle) / 2;
    currentAngle = endAngle;
    return { ...service, startAngle, endAngle, midAngle };
  });

  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const createSlicePath = (
    cx: number,
    cy: number,
    innerR: number,
    outerR: number,
    startDeg: number,
    endDeg: number
  ) => {
    const start = polarToCartesian(cx, cy, outerR, endDeg);
    const end = polarToCartesian(cx, cy, outerR, startDeg);
    const innerStart = polarToCartesian(cx, cy, innerR, endDeg);
    const innerEnd = polarToCartesian(cx, cy, innerR, startDeg);
    const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
    return [
      "M",
      start.x,
      start.y,
      "A",
      outerR,
      outerR,
      0,
      largeArc,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerR,
      innerR,
      0,
      largeArc,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ");
  };

  function handleServiceSliceEnter(serviceName: string) {
    hoveredRef.current.overSlice = true;
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setHoveredService(serviceName);
  }
  function handleServiceSliceLeave() {
    hoveredRef.current.overSlice = false;
    clearTimer.current = setTimeout(() => {
      if (!hoveredRef.current.overRay && !hoveredRef.current.overSlice) {
        setHoveredService(null);
        setHoveredRayIndex(null);
      }
    }, 150);
  }
  function handleRayEnter(rayIndex: number, serviceName: string) {
    hoveredRef.current.overRay = true;
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setHoveredRayIndex(rayIndex);
    setHoveredService(serviceName);
  }
  function handleRayLeave() {
    hoveredRef.current.overRay = false;
    clearTimer.current = setTimeout(() => {
      if (!hoveredRef.current.overRay && !hoveredRef.current.overSlice) {
        setHoveredService(null);
        setHoveredRayIndex(null);
      } else {
        setHoveredRayIndex(null);
      }
    }, 150);
  }

  function handleServiceClick(service: ServiceData) {
    const tab = service.purchased ? "my-services" : "other-services";
    if (onTabChange) onTabChange(tab);
    else navigate(`/services?tab=${tab}`);
  }

  const sunRayMinLength = 30 * scale;
  const sunRayMaxLength = 50 * scale;
  const startOffset = 4 * scale;
  const iconOffset = 8 * scale;
  const offsetDist = 4 * scale;

  // Tooltip using foreignObject for pixel-perfect placement
  const svgTooltip = (ray: { x: number; y: number }, stepName: string) => (
    <foreignObject
      x={ray.x - 60}
      y={ray.y - 36}
      width={120}
      height={36}
      style={{ pointerEvents: "none" }}
    >
      <div
        style={{
          width: 120,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.90)",
          color: "#fff",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 500,
          boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
          userSelect: "none",
        }}
      >
        {stepName}
      </div>
    </foreignObject>
  );

  const getStepStatusColor = (progress: number) => {
    if (progress === 100) return "#22c55e";
    if (progress > 0) return "#f59e42";
    return "#64748b";
  };
  const getStepIcon = (progress: number) => {
    if (progress === 100) return "✓";
    if (progress > 0) return "⏳";
    return "○";
  };
  const getTextSize = () => {
    if (dimensions.width < 350) return "text-xs";
    if (dimensions.width < 400) return "text-sm";
    return "text-base";
  };
  const getIconSize = () => {
    if (dimensions.width < 350) return "text-sm";
    if (dimensions.width < 400) return "text-base";
    return "text-lg";
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-gray-50 to-white shadow-xl">
      <CardContent className="p-3 sm:p-6">
        <div
          ref={containerRef}
          className="relative flex justify-center overflow-visible pt-6 sm:pt-12"
          style={{ minHeight: svgHeight + 100 }}
        >
          <svg
            width={dimensions.width}
            height={svgHeight}
            style={{ overflow: "visible" }}
            className="max-w-full h-auto"
          >
            <defs>
              <filter
                id="textGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter
                id="flareGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={center} cy={center} r={borderRadius} fill="white" className="drop-shadow-lg" />
            {/* Gradient for background rays */}
            <defs>
              <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#e5e7eb", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#d1d5db", stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>

            {/* Pie slices */}
{slicesWithAngles.map((service) => {
  const slicePath = createSlicePath(
    center,
    center,
    innerRadius,
    outerRadius,
    service.startAngle,
    service.endAngle
  );

  // Slightly push label position outward for better spacing
  const labelPos = polarToCartesian(center, center, chartRadius + 10 * scale, service.midAngle);

  const useAbbr = dimensions.width < 640;
  const displayName = useAbbr ? abbrMap[service.name] || service.name : service.name;

  // Wrap long names into two lines intelligently
  let words = displayName.split(" ");
  let lines = [];
  if (displayName.length > 14 && words.length > 1) {
    const mid = Math.ceil(words.length / 2);
    lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  } else {
    lines = [displayName];
  }

  const maxWordLen = Math.max(...lines.map((w) => w.length), 1);

  // Keep font readable while ensuring no overlap
  const baseFontSize = 16 * scale;
  const fontSizeNum =
    lines.length > 1
      ? Math.max(10 * scale, baseFontSize - maxWordLen * 0.2)
      : Math.max(12 * scale, baseFontSize - maxWordLen * 0.15);

  const lineHeight = fontSizeNum * 1.25;
  const n = lines.length;
  const firstDy = -(((n - 1) * lineHeight) / 2);
  const iconFontSizeNum = 18 * scale;
  const spacing = 3 * scale;
  const firstCenter = labelPos.y + firstDy;
  const iconY = firstCenter - fontSizeNum / 2 - spacing - iconFontSizeNum / 2;

  return (
    <g
      key={service.name}
      onMouseEnter={() => handleServiceSliceEnter(service.name)}
      onMouseLeave={handleServiceSliceLeave}
      onClick={() => handleServiceClick(service)}
      className="cursor-pointer"
      tabIndex={0}
    >
      {/* Slice Shape */}
      <path
        d={slicePath}
        fill={
          hoveredService === service.name && !service.purchased
            ? "#6366f1"
            : service.color
        }
        stroke="white"
        strokeWidth={3 * scale}
        style={{
          filter:
            hoveredService === service.name
              ? "brightness(1.1) drop-shadow(0 0 5px rgba(0,0,0,0.2))"
              : !service.purchased
              ? "brightness(0.7)"
              : "none",
          opacity: !service.purchased ? 0.6 : 1,
          transition: "fill 0.2s ease",
        }}
      />

      {/* Slice Icon */}
      <text
        x={labelPos.x}
        y={iconY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={`${iconFontSizeNum}px`}
        style={{ filter: "url(#textGlow)" }}
      >
        {service.icon}
      </text>

      {/* Slice Text */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-white"
        fontSize={`${fontSizeNum}px`}
        style={{
          filter: "url(#textGlow)",
          fontWeight: "500",
          userSelect: "none",
        }}
      >
        {lines.map((w, i) => (
          <tspan key={i} x={labelPos.x} dy={i === 0 ? firstDy : lineHeight}>
            {w}
          </tspan>
        ))}
      </text>
    </g>
  );
})}

            {/* Render sun rays */}
            {slicesWithAngles.map(
              (s) =>
                s.purchased &&
                s.progressSteps && (
                  <g key={`rays-${s.name}`}>
                    {hoveredService === s.name
                      ? s.progressSteps.map((step, idx) => {
                          const angleSpread = s.endAngle - s.startAngle;
                          const raysCount = s.progressSteps!.length;
                          const spreadStep = angleSpread / raysCount;
                          const rayAngle = s.startAngle + (idx + 0.5) * spreadStep;
                          const startR = outerRadius + startOffset;
                          const rayStart = polarToCartesian(center, center, startR, rayAngle);
                          const extensionLength =
                            sunRayMinLength +
                            ((sunRayMaxLength - sunRayMinLength) * step.progress) / 100;
                          const endR = startR + extensionLength;
                          const rayEnd = polarToCartesian(center, center, endR, rayAngle);

                          const dirRad = ((rayAngle - 90) * Math.PI) / 180;
                          const ux = Math.cos(dirRad),
                            uy = Math.sin(dirRad);
                          const getOffset = (sign: number) => ({
                            px: sign * -uy * offsetDist,
                            py: sign * ux * offsetDist,
                          });
                          const offLeft = getOffset(1.5);
                          const offRight = getOffset(-1.5);
                          const startLeft = {
                            x: rayStart.x + offLeft.px,
                            y: rayStart.y + offLeft.py,
                          };
                          const endLeft = {
                            x: rayEnd.x + offLeft.px,
                            y: rayEnd.y + offLeft.py,
                          };
                          const startRight = {
                            x: rayStart.x + offRight.px,
                            y: rayStart.y + offRight.py,
                          };
                          const endRight = {
                            x: rayEnd.x + offRight.px,
                            y: rayEnd.y + offRight.py,
                          };
                          const iconR = endR + iconOffset;
                          const iconPos = polarToCartesian(center, center, iconR, rayAngle);
                          const rayLength = Math.hypot(rayEnd.x - rayStart.x, rayEnd.y - rayStart.y);
                          const isRayHovered = hoveredRayIndex === idx;

                          // Create polygon path for wide invisible hover area
                          const pathD = `
                            M${startLeft.x},${startLeft.y}
                            L${endLeft.x},${endLeft.y}
                            L${endRight.x},${endRight.y}
                            L${startRight.x},${startRight.y}
                            Z`;

                          return (
                            <g
                              key={idx}
                              onMouseEnter={() => handleRayEnter(idx, s.name)}
                              onMouseLeave={handleRayLeave}
                              style={{ pointerEvents: "all", cursor: "pointer" }}
                            >
                              <path d={pathD} fill="transparent" />
                              <line
                                x1={rayStart.x}
                                y1={rayStart.y}
                                x2={rayEnd.x}
                                y2={rayEnd.y}
                                stroke={`url(#rayGradient-${s.name}-${idx})`}
                                strokeWidth={isRayHovered ? 11 * scale : 7 * scale}
                                strokeLinecap="round"
                                style={{
                                  transition: "stroke-width 0.2s",
                                }}
                              />
                              <g>
                                <circle
                                  cx={iconPos.x}
                                  cy={iconPos.y}
                                  r={isRayHovered ? 13 * scale : 10 * scale}
                                  fill="white"
                                  stroke={s.color}
                                  strokeWidth={2.5 * scale}
                                />
                                <text
                                  x={iconPos.x}
                                  y={iconPos.y}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fontSize={`${16 * scale}px`}
                                  style={{ fontWeight: "bold", fill: s.color }}
                                >
                                  {getStepIcon(step.progress)}
                                </text>
                              </g>
                              {isRayHovered && svgTooltip(iconPos, step.name)}
                              <defs>
                                <linearGradient
                                  id={`rayGradient-${s.name}-${idx}`}
                                  x1="0%"
                                  y1="0%"
                                  x2="100%"
                                  y2="100%"
                                >
                                  <stop offset="0%" style={{ stopColor: s.color, stopOpacity: 0.95 }} />
                                  <stop offset="50%" style={{ stopColor: s.color, stopOpacity: 0.7 }} />
                                  <stop offset="100%" style={{ stopColor: s.color, stopOpacity: 0.3 }} />
                                </linearGradient>
                              </defs>
                            </g>
                          );
                        })
                      : null}
                  </g>
                )
            )}
            <circle cx={center} cy={center} r={85 * scale} fill="white" stroke="#e5e7eb" strokeWidth={4 * scale} className="drop-shadow-md" />
            <text x={center} y={center} textAnchor="middle" dominantBaseline="central" className="font-bold text-foreground" fontSize={`${18 * scale}px`} style={{ filter: "url(#textGlow)" }}>
              {studentName}
            </text>
            {slicesWithAngles.map(s => {
              const numPos = polarToCartesian(center, center, numberRadius, s.midAngle);
              return (
                <g key={`${s.name}-num`}>
                  <circle
                    cx={numPos.x}
                    cy={numPos.y}
                    r={14 * scale}
                    fill={s.purchased ? s.color : "#9ca3af"}
                    stroke="white"
                    strokeWidth={3 * scale}
                  />
                  <text
                    x={numPos.x}
                    y={numPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-bold text-white"
                    fontSize={`${14 * scale}px`}
                    style={{ filter: "url(#textGlow)" }}
                  >
                    {s.number}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 max-w-full">
          {servicesData.map((service) => (
            <div
              key={service.name}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer border-2 ${
                service.purchased
                  ? hoveredService === service.name
                    ? "border-green-300 bg-green-50 shadow-lg scale-105"
                    : "border-green-200 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-lg"
                  : hoveredService === service.name
                  ? "border-blue-300 bg-blue-50 shadow-lg scale-105"
                  : "border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md"
              }`}
              onMouseEnter={() => handleServiceSliceEnter(service.name)}
              onMouseLeave={handleServiceSliceLeave}
              onClick={() => handleServiceClick(service)}
            >
              <div className="p-2 xs:p-3 sm:p-4">
                <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">
                    {service.purchased ? (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: service.color }}
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">○</span>
                      </div>
                    )}
                    <span className={`${getIconSize()} flex-shrink-0`}>{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium text-[0.65rem] xs:text-xs sm:text-sm truncate ${
                        service.purchased ? "text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0">
                    {service.purchased ? (
                      <span className="text-[0.6rem] xs:text-xs font-medium bg-green-100 text-green-700 px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-1 rounded-full border border-green-200">
                        ✓ Purchased
                      </span>
                    ) : (
                      <span className="text-[0.6rem] xs:text-xs font-medium bg-blue-100 text-blue-700 px-1 xs:px-1.5 sm:px-2 py-0.5 xs:py-1 rounded-full border border-blue-200">
                        Available
                      </span>
                    )}
                  </div>
                </div>
                {service.purchased &&
                  hoveredService === service.name &&
                  service.progressSteps && (
                    <div className="mt-2 xs:mt-3 sm:mt-4 space-y-1.5 xs:space-y-2 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 xs:p-2 sm:p-3 border border-white/50 shadow-sm">
                      <div className="text-[0.6rem] xs:text-xs font-semibold text-gray-700 mb-1.5 xs:mb-2 flex items-center gap-1">
                        <span>Progress Steps</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                      </div>
                      <div className="grid gap-1 xs:gap-1.5 sm:gap-2">
                        {service.progressSteps.map((step, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between p-1 xs:p-1.5 sm:p-2 rounded-lg border transition-all duration-200 ${
                              hoveredRayIndex === i ? "bg-green-100 border-green-400" : ""
                            }`}
                            style={{
                              borderColor: getStepStatusColor(step.progress),
                              background: hoveredRayIndex === i ? "#dcfce7" : "#f9fafb",
                            }}
                          >
                            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0 flex-1">
                              <span
                                className="text-[0.6rem] xs:text-xs sm:text-sm font-medium flex-shrink-0"
                                style={{ color: getStepStatusColor(step.progress) }}
                              >
                                {getStepIcon(step.progress)}
                              </span>
                              <span className="text-[0.6rem] xs:text-xs font-medium truncate">{step.name}</span>
                            </div>
                            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0">
                              <div className="w-10 xs:w-12 sm:w-16 h-1 xs:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-300`}
                                  style={{ width: `${step.progress}%`, backgroundColor: getStepStatusColor(step.progress) }}
                                ></div>
                              </div>
                              <span
                                className="text-[0.6rem] xs:text-xs font-bold min-w-[20px] xs:min-w-[24px] sm:min-w-[28px] text-right"
                                style={{ color: getStepStatusColor(step.progress) }}
                              >
                                {step.progress}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
              {hoveredService === service.name && (
                <div className="absolute top-1 xs:top-2 right-1 xs:right-2">
                  <div className="w-1.5 xs:w-2 h-1.5 xs:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}