import React, { useState, useRef } from "react";
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
  const svgRef = useRef<SVGSVGElement>(null);

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

  const handleServiceClick = (service: ServiceData) => {
    const tab = service.purchased ? "my-services" : "other-services";
    if (onTabChange) onTabChange(tab);
    else navigate(`/services?tab=${tab}`);
  };

  const handleServiceHover = (serviceName: string | null) => {
    setHoveredService(serviceName);
  };

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

  return (
    <Card className="mb-8 bg-gradient-card shadow-card">
      <CardContent className="p-6">
        <div className="relative flex justify-center overflow-visible pt-12">
          <svg width={500} height={500} ref={svgRef} style={{ overflow: "visible" }}>
            {/* Outer white border */}
            <circle cx={250} cy={250} r={230} fill="white" className="drop-shadow-lg" />

            {/* Concentric arcs */}
            {slicesWithAngles.map((s) =>
              hoveredService === s.name && s.purchased && s.progressSteps ? (
                s.progressSteps.map((step, idx) => {
                  const radius = 240 + idx * 14;
                  const { bgPath, fgPath } = buildArc(
                    250,
                    250,
                    radius,
                    s.startAngle,
                    s.endAngle,
                    step.progress
                  );
                  return (
                    <g key={`${s.name}-arc-${idx}`}>
                      <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth={8} opacity={0.3} strokeLinecap="round" />
                      <path d={fgPath} fill="none" stroke={s.color} strokeWidth={8} strokeLinecap="round" />
                    </g>
                  );
                })
              ) : null
            )}

            {/* Pie slices */}
            {slicesWithAngles.map((service) => {
              const slicePath = createSlicePath(250, 250, 100, 180, service.startAngle, service.endAngle);
              const labelPos = polarToCartesian(250, 250, 140, service.midAngle);
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
                    strokeWidth={3}
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
                  <text x={labelPos.x} y={labelPos.y - 10} textAnchor="middle" dominantBaseline="central" className="text-lg">
                    {service.icon}
                  </text>
                  <text x={labelPos.x} y={labelPos.y + 12} textAnchor="middle" dominantBaseline="central" className="font-semibold text-white text-xs">
                    {service.name.split(" ").map((w, i) => (
                      <tspan key={i} x={labelPos.x} dy={i === 0 ? -6 : 10}>
                        {w}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}

            {/* Inner circle */}
            <circle cx={250} cy={250} r={85} fill="white" stroke="#e5e7eb" strokeWidth={4} className="drop-shadow-md" />
            <text x={250} y={250} textAnchor="middle" dominantBaseline="central" className="font-bold text-foreground text-lg">
              {studentName}
            </text>

            {/* Service number & hover % */}
            {slicesWithAngles.map((s) => {
              const numPos = polarToCartesian(250, 250, 270, s.midAngle);
              return (
                <g key={`${s.name}-num`}>
                  <circle cx={numPos.x} cy={numPos.y} r={14} fill={s.purchased ? s.color : "#9ca3af"} stroke="white" strokeWidth={3} />
                  <text x={numPos.x} y={numPos.y} textAnchor="middle" dominantBaseline="central" className="text-sm font-bold text-white">
                    {s.number}
                  </text>
                  {hoveredService === s.name && s.overallProgress != null && (
                    <text x={numPos.x} y={numPos.y + 30} textAnchor="middle" dominantBaseline="central" className="text-sm font-bold text-gray-700">
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
                      const x = 270 * Math.cos(rad);
                      const y = 270 * Math.sin(rad);
                      return `${x}px,${y}px`;
                    })()})`,
                  }}
                >
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-xl"
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
        <div className="grid grid-cols-2 gap-4 mt-6">
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
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: service.purchased ? service.color : "#9ca3af" }}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${service.purchased ? "text-gray-800" : "text-gray-600"}`}>
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.purchased ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                          ✓ Purchased
                        </span>
                        <div className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                          {service.overallProgress}%
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                        Available
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress steps - only show on hover for purchased services */}
                {service.purchased && hoveredService === service.name && service.progressSteps && (
                  <div className="mt-4 space-y-2 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <span>Progress Steps</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>
                    <div className="grid gap-2">
                      {service.progressSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${getStepStatusColor(step.progress)}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {getStepIcon(step.progress)}
                            </span>
                            <span className="text-xs font-medium">
                              {step.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Mini progress bar */}
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
                            <span className="text-xs font-bold min-w-[28px] text-right">
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
