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

  // Responsive dimensions calculation
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let size = Math.min(containerWidth - 40, 500); // Max 500px, min container width - padding
        
        // Breakpoint adjustments
        if (window.innerWidth < 640) { // Mobile
          size = Math.min(containerWidth - 20, 350);
        } else if (window.innerWidth < 1024) { // Tablet
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

  // Responsive scaling factors
  const scale = dimensions.width / 500;
  const center = dimensions.width / 2;
  const outerRadius = 180 * scale;
  const innerRadius = 80 * scale;
  const chartRadius = 130 * scale; // Adjusted to keep text within slices
  const borderRadius = 230 * scale;
  const numberRadius = 270 * scale;
  const progressBaseRadius = 240 * scale;

  // Calculate slice angles
  let currentAngle = 0;
  const slicesWithAngles = servicesData.map((service) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (service.value / 100) * 360;
    const midAngle = (startAngle + endAngle) / 2;
    currentAngle = endAngle;
    return { ...service, startAngle, endAngle, midAngle };
  });

  // Polar to Cartesian
  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Build arc for percent
  const buildArc = (
    cx: number,
    cy: number,
    radius: number,
    startDeg: number,
    endDeg: number,
    pct: number
  ) => {
    const progDeg = startDeg + ((endDeg - startDeg) * pct) / 100;
    const startPt = polarToCartesian(cx, cy, radius, endDeg);
    const fullPt = polarToCartesian(cx, cy, radius, startDeg);
    const progPt = polarToCartesian(cx, cy, radius, progDeg);
    const largeArc = progDeg - startDeg > 180 ? 1 : 0;
    const bgPath = ["M", startPt.x, startPt.y, "A", radius, radius, 0, largeArc, 0, fullPt.x, fullPt.y].join(" ");
    const fgPath = ["M", startPt.x, startPt.y, "A", radius, radius, 0, largeArc, 0, progPt.x, progPt.y].join(" ");
    return { bgPath, fgPath };
  };

  // Create slice path
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

  // Get status color based on progress
  const getStepStatusColor = (progress: number) => {
    if (progress === 100) return "text-green-600 bg-green-50 border-green-200";
    if (progress > 0) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-gray-500 bg-gray-50 border-gray-200";
  };

  const getStepIcon = (progress: number) => {
    if (progress === 100) return "✓";
    if (progress > 0) return "⏳";
    return "○";
  };

  // Responsive text sizes
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
    <Card className="mb-8 bg-gradient-card shadow-card">
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
            {/* Outer white border */}
            <circle cx={center} cy={center} r={borderRadius} fill="white" className="drop-shadow-lg" />

            {/* Concentric arcs */}
            {slicesWithAngles.map((s) =>
              hoveredService === s.name && s.purchased && s.progressSteps ? (
                s.progressSteps.map((step, idx) => {
                  const radius = progressBaseRadius + idx * (14 * scale);
                  const { bgPath, fgPath } = buildArc(
                    center,
                    center,
                    radius,
                    s.startAngle,
                    s.endAngle,
                    step.progress
                  );
                  return (
                    <g key={`${s.name}-arc-${idx}`}>
                      <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth={8 * scale} opacity={0.3} strokeLinecap="round" />
                      <path d={fgPath} fill="none" stroke={s.color} strokeWidth={8 * scale} strokeLinecap="round" />
                    </g>
                  );
                })
              ) : null
            )}

            {/* Pie slices */}
            {slicesWithAngles.map((service) => {
              const slicePath = createSlicePath(center, center, innerRadius, outerRadius, service.startAngle, service.endAngle);
              const labelPos = polarToCartesian(center, center, chartRadius, service.midAngle);
              const useAbbr = dimensions.width < 640; // Use abbreviations only on mobile devices
              const displayName = useAbbr ? (abbrMap[service.name] || service.name) : service.name;
              const lines = displayName.split(" ");
              const maxWordLen = Math.max(...lines.map(w => w.length), 1);
              const fontSizeNum = Math.min(10 * scale, (100 * scale) / maxWordLen); // Adjusted to fit within slices
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
                          ? "brightness(1.1)"
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

            {/* Inner circle */}
            <circle cx={center} cy={center} r={85 * scale} fill="white" stroke="#e5e7eb" strokeWidth={4 * scale} className="drop-shadow-md" />
            <text 
              x={center} 
              y={center} 
              textAnchor="middle" 
              dominantBaseline="central" 
              className="font-bold text-foreground"
              fontSize={`${18 * scale}px`}
            >
              {studentName}
            </text>

            {/* Service number & hover % */}
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
                  >
                    {s.number}
                  </text>
                  {hoveredService === s.name && s.overallProgress != null && (
                    <text 
                      x={numPos.x} 
                      y={numPos.y + (30 * scale)} 
                      textAnchor="middle" 
                      dominantBaseline="central" 
                      className="font-bold text-gray-700"
                      fontSize={`${14 * scale}px`}
                    >
                      {s.overallProgress}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Buy button */}
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
                      const x = (270 * scale) * Math.cos(rad);
                      const y = (270 * scale) * Math.sin(rad);
                      return `${x}px,${y}px`;
                    })()})`,
                  }}
                >
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-xl text-xs sm:text-sm"
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

        {/* Service status legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
          {servicesData.map((service) => (
            <div
              key={service.name}
              className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer border-2 ${
                service.purchased
                  ? hoveredService === service.name
                    ? "border-green-300 bg-green-50 shadow-lg scale-105"
                    : "border-green-200 bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-lg"
                  : hoveredService === service.name
                  ? "border-primary/30 bg-primary/10 shadow-lg scale-105"
                  : "border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md"
              }`}
              onMouseEnter={() => handleServiceHover(service.name)}
              onMouseLeave={() => handleServiceHover(null)}
              onClick={() => handleServiceClick(service)}
            >
              {/* Main service info */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-3 border-white shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: service.purchased ? service.color : "#9ca3af" }}
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-lg sm:text-2xl">{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-xs sm:text-sm truncate ${service.purchased ? "text-gray-800" : "text-gray-600"}`}>
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {service.purchased ? (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-1.5 sm:px-2 py-1 rounded-full border border-green-200">
                          ✓ Purchased
                        </span>
                        <div className="text-xs font-bold text-gray-700 bg-white px-1.5 sm:px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                          {service.overallProgress}%
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-1.5 sm:px-2 py-1 rounded-full border border-blue-200">
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress steps - only show on hover for purchased services */}
                {service.purchased && hoveredService === service.name && service.progressSteps && (
                  <div className="mt-3 sm:mt-4 space-y-2 bg-white/70 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/50">
                    <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span>Progress Steps</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                    <div className="grid gap-1.5 sm:gap-2">
                      {service.progressSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-1.5 sm:p-2 rounded-lg border transition-all duration-200 ${getStepStatusColor(step.progress)}`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-medium flex-shrink-0">
                              {getStepIcon(step.progress)}
                            </span>
                            <span className="text-xs font-medium truncate">
                              {step.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            {/* Mini progress bar */}
                            <div className="w-12 sm:w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  step.progress === 100
                                    ? "bg-green-500"
                                    : step.progress > 0
                                    ? "bg-amber-500"
                                    : "bg-gray-300"
                                }`}
                                style={{ width: `${step.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold min-w-[24px] sm:min-w-[28px] text-right">
                              {step.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Hover indicator */}
              {hoveredService === service.name && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}