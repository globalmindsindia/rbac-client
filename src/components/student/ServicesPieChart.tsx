import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProgressStep {
  name: string;
  progress: number; // 0–100
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
}: {
  studentName: string;
  onTabChange?: (tab: string) => void;
}) {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const svgRef = useRef<SVGSVGElement>(null);
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
    "APS": "APS",
    "IELTS": "IELTS",
    "SOP": "SOP",
    "BLOCKED ACCOUNT": "Blocked Account",
    "FOREIGN LANGUAGE": "Foreign Language",
    "UNIVERSITY SHORTLISTING": "University Shortlist",
    "VISA": "VISA",
    "ACCOMODATION": "Accomo..",
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let size = Math.min(containerWidth - 40, 500);
        if (window.innerWidth < 640) {
          size = Math.min(containerWidth - 20, 350);
        } else if (window.innerWidth < 1024) {
          size = Math.min(containerWidth - 30, 400);
        }
        setDimensions({ width: size, height: size });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleServiceClick = (service: ServiceData) => {
    const tab = service.purchased ? "my-services" : "other-services";
    if (onTabChange) onTabChange(tab);
    else navigate(`/services?tab=${tab}`);
  };

  const handleServiceHover = (serviceName: string | null) => {
    setHoveredService(serviceName);
  };

  const scale = dimensions.width / 500;
  const center = dimensions.width / 2;
  const outerRadius = 180 * scale;
  const innerRadius = 80 * scale;
  const chartRadius = 130 * scale;
  const borderRadius = 230 * scale;
  const numberRadius = 280 * scale;

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
      "M", start.x, start.y,
      "A", outerR, outerR, 0, largeArc, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerR, innerR, 0, largeArc, 1, innerStart.x, innerStart.y,
      "Z",
    ].join(" ");
  };

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

  const getGridCols = () => {
    if (dimensions.width < 640) return "grid-cols-1";
    if (dimensions.width < 1024) return "grid-cols-2";
    if (dimensions.width < 1280) return "grid-cols-3";
    return "grid-cols-4";
  };

  // Sun rays config
  const sunRayMinLength = 30 * scale;
  const sunRayMaxLength = 50 * scale;
  const startOffset = 8 * scale;
  const iconOffset = 8 * scale;
  const offsetDist = 2 * scale;

  return (
    <Card className="mb-8 bg-gradient-to-br from-gray-50 to-white shadow-xl">
      <CardContent className="p-3 sm:p-6">
        <div
          ref={containerRef}
          className="relative flex justify-center overflow-visible pt-6 sm:pt-12"
        >
          <svg
            width={dimensions.width}
            height={dimensions.height}
            ref={svgRef}
            style={{ overflow: "visible" }}
            className="max-w-full h-auto"
          >
            <defs>
              <filter id="rayGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="flareGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx={center} cy={center} r={borderRadius} fill="white" className="drop-shadow-lg" />
            {/* Enhanced interactive sun rays design */}
            {slicesWithAngles.map((s) =>
              hoveredService === s.name && s.purchased && s.progressSteps ? (
                (() => {
                  const angleSpread = s.endAngle - s.startAngle;
                  const raysCount = s.progressSteps!.length;
                  const spreadStep = angleSpread / raysCount;
                  return s.progressSteps!.map((step, idx) => {
                    const rayAngle = s.startAngle + (idx + 0.5) * spreadStep;
                    const startR = outerRadius + startOffset;
                    const rayStart = polarToCartesian(center, center, startR, rayAngle);
                    const extensionLength = sunRayMinLength + ((sunRayMaxLength - sunRayMinLength) * step.progress / 100);
                    const endR = startR + extensionLength;
                    const rayEnd = polarToCartesian(center, center, endR, rayAngle);
                    const fullEndR = startR + sunRayMaxLength;
                    const fullRayEnd = polarToCartesian(center, center, fullEndR, rayAngle);
                    const iconR = endR + iconOffset;
                    const iconPos = polarToCartesian(center, center, iconR, rayAngle);
                    // Direction unit vector
                    const dirRad = ((rayAngle - 90) * Math.PI) / 180;
                    const ux = Math.cos(dirRad);
                    const uy = Math.sin(dirRad);
                    // Perpendicular offsets
                    const getOffset = (sign: number) => ({
                      px: sign * (-uy) * offsetDist,
                      py: sign * ux * offsetDist,
                    });
                    const offLeft = getOffset(1.5);
                    const offRight = getOffset(-1.5);
                    const startLeft = { x: rayStart.x + offLeft.px, y: rayStart.y + offLeft.py };
                    const endLeft = { x: rayEnd.x + offLeft.px, y: rayEnd.y + offLeft.py };
                    const startRight = { x: rayStart.x + offRight.px, y: rayStart.y + offRight.py };
                    const endRight = { x: rayEnd.x + offRight.px, y: rayEnd.y + offRight.py };
                    // Lens flare positions
                    const flareR1 = startR + extensionLength * 0.25;
                    const flareR2 = startR + extensionLength * 0.65;
                    const flarePos1 = polarToCartesian(center, center, flareR1, rayAngle);
                    const flarePos2 = polarToCartesian(center, center, flareR2, rayAngle);
                    const rayLength = Math.hypot(rayEnd.x - rayStart.x, rayEnd.y - rayStart.y);
                    const animDelay = 0.15 * idx;
                    const drawDur = 0.7 + animDelay;
                    return (
                      <g key={`${s.name}-ray-${idx}`}>
                        {/* Background full ray with subtle pulse */}
                        <line
                          x1={rayStart.x}
                          y1={rayStart.y}
                          x2={fullRayEnd.x}
                          y2={fullRayEnd.y}
                          stroke="url(#rayGradient)"
                          strokeWidth={4 * scale}
                          strokeDasharray={`${6 * scale} ${6 * scale}`}
                          opacity={0.3}
                        >
                          <animate
                            attributeName="opacity"
                            values="0.3;0.5;0.3"
                            dur="2s"
                            repeatCount="indefinite"
                            begin={`${animDelay}s`}
                          />
                        </line>
                        {/* Main progress ray with gradient and drawing animation */}
                        <line
                          id={`mainRay-${s.name}-${idx}`}
                          x1={rayStart.x}
                          y1={rayStart.y}
                          x2={rayEnd.x}
                          y2={rayEnd.y}
                          stroke={`url(#rayGradient-${s.name}-${idx})`}
                          strokeWidth={6 * scale}
                          strokeLinecap="round"
                          strokeDasharray={`${rayLength} ${rayLength}`}
                          strokeDashoffset={rayLength}
                          filter="url(#rayGlow)"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            from={`${rayLength}`}
                            to="0"
                            dur={`${drawDur}s`}
                            begin="0s"
                            fill="freeze"
                          />
                          <animate
                            attributeName="stroke-width"
                            values={`${6 * scale};${7 * scale};${6 * scale}`}
                            dur="1.5s"
                            repeatCount="indefinite"
                            begin={`${drawDur}s`}
                          />
                        </line>
                        {/* Parallel accent rays with slight pulse */}
                        <line
                          x1={startLeft.x}
                          y1={startLeft.y}
                          x2={endLeft.x}
                          y2={endLeft.y}
                          stroke={s.color}
                          strokeWidth={2.5 * scale}
                          opacity={0.5}
                          strokeLinecap="round"
                          filter="url(#rayGlow)"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.5;0.7;0.5"
                            dur="1.8s"
                            repeatCount="indefinite"
                            begin={`${0.2 + animDelay}s`}
                          />
                        </line>
                        <line
                          x1={startRight.x}
                          y1={startRight.y}
                          x2={endRight.x}
                          y2={endRight.y}
                          stroke={s.color}
                          strokeWidth={2.5 * scale}
                          opacity={0.5}
                          strokeLinecap="round"
                          filter="url(#rayGlow)"
                        >
                          <animate
                            attributeName="opacity"
                            values="0.5;0.7;0.5"
                            dur="1.8s"
                            repeatCount="indefinite"
                            begin={`${0.3 + animDelay}s`}
                          />
                        </line>
                        {/* Lens flare effects with pulsating scale */}
                        <circle
                          cx={flarePos1.x}
                          cy={flarePos1.y}
                          r={5 * scale}
                          fill={s.color}
                          opacity="0"
                          filter="url(#flareGlow)"
                        >
                          <animate
                            attributeName="opacity"
                            from="0"
                            to="0.6"
                            dur="0.4s"
                            begin={`${0.3 + animDelay}s`}
                            fill="freeze"
                          />
                          <animate
                            attributeName="r"
                            values={`${5 * scale};${6 * scale};${5 * scale}`}
                            dur="1.5s"
                            repeatCount="indefinite"
                            begin={`${0.3 + animDelay}s`}
                          />
                        </circle>
                        <circle
                          cx={flarePos2.x}
                          cy={flarePos2.y}
                          r={4 * scale}
                          fill={s.color}
                          opacity="0"
                          filter="url(#flareGlow)"
                        >
                          <animate
                            attributeName="opacity"
                            from="0"
                            to="0.8"
                            dur="0.4s"
                            begin={`${0.5 + animDelay}s`}
                            fill="freeze"
                          />
                          <animate
                            attributeName="r"
                            values={`${4 * scale};${5 * scale};${4 * scale}`}
                            dur="1.3s"
                            repeatCount="indefinite"
                            begin={`${0.5 + animDelay}s`}
                          />
                        </circle>
                        {/* Decorative end shape (starburst) with rotation */}
                        <path
                          d={`M ${rayEnd.x} ${rayEnd.y - 10 * scale} 
                              L ${rayEnd.x + 3 * scale} ${rayEnd.y - 3 * scale} 
                              L ${rayEnd.x + 10 * scale} ${rayEnd.y} 
                              L ${rayEnd.x + 3 * scale} ${rayEnd.y + 3 * scale} 
                              L ${rayEnd.x} ${rayEnd.y + 10 * scale} 
                              L ${rayEnd.x - 3 * scale} ${rayEnd.y + 3 * scale} 
                              L ${rayEnd.x - 10 * scale} ${rayEnd.y} 
                              L ${rayEnd.x - 3 * scale} ${rayEnd.y - 3 * scale} Z`}
                          fill={s.color}
                          stroke="white"
                          strokeWidth={1.5 * scale}
                          opacity="0"
                          filter="url(#rayGlow)"
                        >
                          <animate
                            attributeName="opacity"
                            from="0"
                            to="1"
                            dur="0.5s"
                            begin={`${0.6 + animDelay}s`}
                            fill="freeze"
                          />
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from={`0 ${rayEnd.x} ${rayEnd.y}`}
                            to={`360 ${rayEnd.x} ${rayEnd.y}`}
                            dur="10s"
                            repeatCount="indefinite"
                            begin={`${0.6 + animDelay}s`}
                          />
                        </path>
                        {/* Step icon in circle with scale animation */}
                        <g filter="url(#rayGlow)">
                          <circle
                            cx={iconPos.x}
                            cy={iconPos.y}
                            r={9 * scale}
                            fill="white"
                            stroke={s.color}
                            strokeWidth={2.5 * scale}
                          >
                            <animate
                              attributeName="r"
                              values={`${9 * scale};${10 * scale};${9 * scale}`}
                              dur="1.7s"
                              repeatCount="indefinite"
                              begin={`${0.9 + animDelay}s`}
                            />
                          </circle>
                          <text
                            x={iconPos.x}
                            y={iconPos.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={`${14 * scale}px`}
                            style={{ fontWeight: "bold", fill: s.color }}
                          >
                            {getStepIcon(step.progress)}
                          </text>
                          <animate
                            attributeName="opacity"
                            from="0"
                            to="1"
                            dur="0.6s"
                            begin={`${0.9 + animDelay}s`}
                            fill="freeze"
                          />
                        </g>
                        {/* Gradient for main ray */}
                        <defs>
                          <linearGradient id={`rayGradient-${s.name}-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: s.color, stopOpacity: 0.95 }} />
                            <stop offset="50%" style={{ stopColor: s.color, stopOpacity: 0.7 }} />
                            <stop offset="100%" style={{ stopColor: s.color, stopOpacity: 0.3 }} />
                          </linearGradient>
                        </defs>
                      </g>
                    );
                  });
                })()
              ) : null
            )}
            {/* Gradient for background rays */}
            <defs>
              <linearGradient id="rayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#e5e7eb", stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: "#d1d5db", stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>

            {/* Pie slices */}
            {slicesWithAngles.map((service) => {
              const slicePath = createSlicePath(center, center, innerRadius, outerRadius, service.startAngle, service.endAngle);
              const labelPos = polarToCartesian(center, center, chartRadius, service.midAngle);
              const useAbbr = dimensions.width < 640;
              const displayName = useAbbr ? (abbrMap[service.name] || service.name) : service.name;
              const lines = displayName.split(" ");
              const maxWordLen = Math.max(...lines.map(w => w.length), 1);
              const fontSizeNum = Math.min(10 * scale, (100 * scale) / maxWordLen);
              const lineHeight = fontSizeNum * 1.2;
              const n = lines.length;
              const firstDy = -((n - 1) * lineHeight / 2);
              const iconFontSizeNum = 18 * scale;
              const spacing = 2 * scale;
              const firstCenter = labelPos.y + firstDy;
              const iconY = firstCenter - (fontSizeNum / 2) - spacing - (iconFontSizeNum / 2);
              return (
                <g
                  key={service.name}
                  onMouseEnter={() => handleServiceHover(service.name)}
                  onMouseLeave={() => handleServiceHover(null)}
                  onClick={() => handleServiceClick(service)}
                  className="cursor-pointer"
                >
                  <path
                    d={slicePath}
                    fill={hoveredService === service.name && !service.purchased ? "#6366f1" : service.color}
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
                    }}
                  />
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
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`text-white ${getTextSize()}`}
                    fontSize={`${fontSizeNum}px`}
                    style={{ filter: "url(#textGlow)" }}
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

            <circle cx={center} cy={center} r={85 * scale} fill="white" stroke="#e5e7eb" strokeWidth={4 * scale} className="drop-shadow-md" />
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="central"
              className="font-bold text-foreground"
              fontSize={`${18 * scale}px`}
              style={{ filter: "url(#textGlow)" }}
            >
              {studentName}
            </text>

            {/* Service number */}
            {slicesWithAngles.map((s) => {
              const numPos = polarToCartesian(center, center, numberRadius, s.midAngle);
              return (
                <g key={`${s.name}-num`}>
                  <circle cx={numPos.x} cy={numPos.y} r={14 * scale} fill={s.purchased ? s.color : "#9ca3af"} stroke="white" strokeWidth={3 * scale} />
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

          {hoveredService &&
            !servicesData.find((s) => s.name === hoveredService)?.purchased && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="absolute pointer-events-auto"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%,-50%) translate(${(() => {
                      const s = slicesWithAngles.find((x) => x.name === hoveredService);
                      if (!s) return "0,0";
                      const rad = ((s.midAngle - 90) * Math.PI) / 180;
                      const x = (280 * scale) * Math.cos(rad);
                      const y = (280 * scale) * Math.sin(rad);
                      return `${x}px,${y}px`;
                    })()})`,
                  }}
                >
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-xl text-xs sm:text-sm"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceClick(servicesData.find((x) => x.name === hoveredService)!);
                    }}
                  >
                    🛒 Buy {hoveredService}
                  </Button>
                </div>
              </div>
            )}
        </div>

        <div className={`grid ${getGridCols()} gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6 max-w-full`}>
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
              onMouseEnter={() => handleServiceHover(service.name)}
              onMouseLeave={() => handleServiceHover(null)}
              onClick={() => handleServiceClick(service)}
            >
              <div className="p-2 xs:p-3 sm:p-4">
                <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-2 xs:mb-3">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
                    <div
                      className="w-3 xs:w-4 sm:w-5 h-3 xs:h-4 sm:h-5 rounded-full border-2 sm:border-3 border-white shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: service.purchased ? service.color : "#9ca3af" }}
                    >
                      <div className="w-1 xs:w-1.5 sm:w-2 h-1 xs:h-1.5 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className={`${getIconSize()} flex-shrink-0`}>{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-[0.65rem] xs:text-xs sm:text-sm truncate ${service.purchased ? "text-gray-800" : "text-gray-600"}`}>
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
                {service.purchased && hoveredService === service.name && service.progressSteps && (
                  <div className="mt-2 xs:mt-3 sm:mt-4 space-y-1.5 xs:space-y-2 bg-white/90 backdrop-blur-sm rounded-lg p-1.5 xs:p-2 sm:p-3 border border-white/50 shadow-sm">
                    <div className="text-[0.6rem] xs:text-xs font-semibold text-gray-700 mb-1.5 xs:mb-2 flex items-center gap-1">
                      <span>Progress Steps</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                    <div className="grid gap-1 xs:gap-1.5 sm:gap-2">
                      {service.progressSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-1 xs:p-1.5 sm:p-2 rounded-lg border transition-all duration-200`}
                          style={{
                            borderColor: getStepStatusColor(step.progress),
                            background: "#f9fafb",
                          }}
                        >
                          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0 flex-1">
                            <span
                              className="text-[0.6rem] xs:text-xs sm:text-sm font-medium flex-shrink-0"
                              style={{ color: getStepStatusColor(step.progress) }}
                            >
                              {getStepIcon(step.progress)}
                            </span>
                            <span className="text-[0.6rem] xs:text-xs font-medium truncate">
                              {step.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0">
                            <div className="w-10 xs:w-12 sm:w-16 h-1 xs:h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300`}
                                style={{
                                  width: `${step.progress}%`,
                                  backgroundColor: getStepStatusColor(step.progress),
                                }}
                              ></div>
                            </div>
                            <span className="text-[0.6rem] xs:text-xs font-bold min-w-[20px] xs:min-w-[24px] sm:min-w-[28px] text-right" style={{ color: getStepStatusColor(step.progress) }}>
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
