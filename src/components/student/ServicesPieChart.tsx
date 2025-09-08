import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ServiceData {
  name: string;
  value: number;
  purchased: boolean;
  color: string;
  number: string;
  icon: string;
}


const ServicesPieChart = ({ studentName, onTabChange }: { studentName: string; onTabChange?: (tab: string) => void }) => {
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
    },
    {
      name: "IELTS",
      value: 12.5,
      purchased: true,
      color: "#ec4899",
      number: "02",
      icon: "📚",
    },
    {
      name: "SOP",
      value: 12.5,
      purchased: true,
      color: "#10b981",
      number: "03",
      icon: "📝",
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
    console.log("ServicesPieChart: handleServiceClick called", { service: service.name, purchased: service.purchased, onTabChange: !!onTabChange });
    if (onTabChange) {
      if (!service.purchased) {
        console.log("ServicesPieChart: calling onTabChange with 'other-services'");
        onTabChange("other-services");
      } else {
        console.log("ServicesPieChart: calling onTabChange with 'my-services'");
        onTabChange("my-services");
      }
    } else {
      console.log("ServicesPieChart: onTabChange not provided, using navigate");
      if (!service.purchased) {
        navigate("/services?tab=other-services");
      } else {
        navigate("/services?tab=my-services");
      }
    }
  };

  useEffect(() => {
    console.log("ServicesPieChart: hoveredService changed to", hoveredService);
  }, [hoveredService]);

  const handleServiceHover = (serviceName: string | null) => {
    setHoveredService(serviceName);
  };

  // Calculate angles for each slice
  const getSliceAngles = () => {
    let currentAngle = 0;
    return servicesData.map((service) => {
      const startAngle = currentAngle;
      const endAngle = currentAngle + (service.value / 100) * 360;
      const midAngle = (startAngle + endAngle) / 2;
      currentAngle = endAngle;
      return {
        ...service,
        startAngle,
        endAngle,
        midAngle,
      };
    });
  };

  const slicesWithAngles = getSliceAngles();

  // Create SVG path for each slice
  const createSlicePath = (
    centerX: number,
    centerY: number,
    innerRadius: number,
    outerRadius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      endAngle
    );
    const innerEnd = polarToCartesian(
      centerX,
      centerY,
      innerRadius,
      startAngle
    );

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Get text position for each slice
  const getTextPosition = (
    centerX: number,
    centerY: number,
    radius: number,
    angle: number
  ) => {
    const radian = ((angle - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };

  return (
    <Card className="mb-8 bg-gradient-card shadow-card">
      <CardContent className="p-6">
        <div className="h-[500px] w-full relative flex items-center justify-center">
          <div className="relative">
            <svg
              width="400"
              height="400"
              className="drop-shadow-xl"
              ref={svgRef}
            >
              {/* Outer white border */}
              <circle
                cx="200"
                cy="200"
                r="190"
                fill="white"
                className="drop-shadow-lg"
              />

              {/* Service slices */}
              {slicesWithAngles.map((service, index) => {
                const path = createSlicePath(
                  200,
                  200,
                  80,
                  180,
                  service.startAngle,
                  service.endAngle
                );
                const outerTextPos = getTextPosition(
                  200,
                  200,
                  165,
                  service.midAngle
                );
                const numberPos = getTextPosition(
                  200,
                  200,
                  125,
                  service.midAngle
                );
                const innerTextPos = getTextPosition(
                  200,
                  200,
                  125,
                  service.midAngle
                );

                return (
                  <g key={service.name}>
                    {/* Slice path */}
                    <path
                      d={path}
                      fill={
                        hoveredService === service.name && !service.purchased
                          ? "#6366f1"
                          : service.color
                      }
                      stroke="white"
                      strokeWidth="3"
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        filter:
                          hoveredService === service.name
                            ? "brightness(1.1)"
                            : !service.purchased
                            ? "brightness(0.7)"
                            : "none",
                        opacity: !service.purchased ? 0.6 : 1,
                      }}
                      onMouseEnter={() => handleServiceHover(service.name)}
                      onMouseLeave={() => handleServiceHover(null)}
                      onClick={(e) => {
                        console.log("ServicesPieChart: SVG path clicked for", service.name);
                        e.stopPropagation();
                        handleServiceClick(service);
                      }}
                    />

                    {/* Service icon positioned at top */}
                    <text
                      x={innerTextPos.x}
                      y={innerTextPos.y - 15}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-lg"
                      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {service.icon}
                    </text>

                    {/* Service name positioned below icon with better spacing */}
                    <text
                      x={innerTextPos.x}
                      y={innerTextPos.y + 5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`font-semibold text-white ${
                        service.name.length > 12 ? "text-xs" : "text-xs"
                      }`}
                      style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                    >
                      {service.name.length > 12
                        ? service.name.split(" ").map((word, i) => (
                            <tspan
                              key={i}
                              x={innerTextPos.x}
                              dy={i === 0 ? -8 : 10}
                            >
                              {word}
                            </tspan>
                          ))
                        : service.name}
                    </text>
                  </g>
                );
              })}

              {/* Center circle with student info */}
              <circle
                cx="200"
                cy="200"
                r="75"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="4"
                className="drop-shadow-md"
              />
              <text
                x="200"
                y="200"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold text-foreground text-sm"
              >
                {studentName}
              </text>
            </svg>

            {/* Floating buy button for hovered non-purchased service - positioned outside chart */}
            {hoveredService &&
              !servicesData.find((s) => s.name === hoveredService)
                ?.purchased && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div
                    className="absolute pointer-events-auto"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, -50%) translate(${(() => {
                        const service = slicesWithAngles.find(
                          (s) => s.name === hoveredService
                        );
                        if (!service) return "0px, 0px";
                        const angle = service.midAngle;
                        const radius = 220; // Position outside the chart
                        const radian = ((angle - 90) * Math.PI) / 180;
                        const x = radius * Math.cos(radian);
                        const y = radius * Math.sin(radian);
                        return `${x}px, ${y}px`;
                      })()})`,
                    }}
                  >
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium shadow-xl animate-bounce whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTabChange) {
                          onTabChange("other-services");
                        } else {
                          navigate("/services?tab=other-services");
                        }
                      }}
                    >
                      🛒 Buy {hoveredService}
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Service status legend */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          {servicesData.map((service, index) => (
            <div
              key={service.name}
              className={`flex items-center gap-3 text-sm p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                service.purchased
                  ? "hover:bg-green-50 hover:border-green-200 border border-transparent"
                  : "hover:bg-primary/5 hover:border-primary/20 border border-transparent"
              }`}
              onClick={(e) => {
                console.log("ServicesPieChart: Legend item clicked for", service.name);
                e.stopPropagation();
                handleServiceClick(service);
              }}
              onMouseEnter={() => handleServiceHover(service.name)}
              onMouseLeave={() => handleServiceHover(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{
                    backgroundColor: service.purchased
                      ? service.color
                      : "#9ca3af",
                  }}
                />
                <span className="text-lg">{service.icon}</span>
              </div>
              <span
                className={`flex-1 ${
                  service.purchased
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {service.name}
              </span>
              {service.purchased ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                    ✓ Purchased
                  </span>
                  {hoveredService === service.name && (
                    <Button
                      size="sm"
                      className="text-xs px-2 py-1 h-6 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTabChange) {
                          onTabChange("my-services");
                        } else {
                          navigate("/services?tab=my-services");
                        }
                      }}
                    >
                      Access
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-medium">
                    Available
                  </span>
                  {hoveredService === service.name && (
                    <Button
                      size="sm"
                      className="text-xs px-2 py-1 h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onTabChange) {
                          onTabChange("other-services");
                        } else {
                          navigate("/services?tab=other-services");
                        }
                      }}
                    >
                      Buy
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesPieChart;
