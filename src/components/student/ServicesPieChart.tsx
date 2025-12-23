import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applicationService } from "@/services/applicationService";
import { useAuth } from "@/auth/AuthContext";

interface Service {
  id: string;
  name: string;
  domain_url: string;
  purchased: boolean;
  comingSoon: boolean;
  color?: string;
  value?: number;
  icon?: string;
}

const ServicesPieChart: React.FC<{
  studentName?: string;
  onTabChange?: (tab: string) => void;
  onChartResize?: (height: number) => void;
}> = ({ studentName = "Student", onTabChange, onChartResize }) => {
  const { user } = useAuth();
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // EFFECT TO LOAD ZOHO SCRIPT (no design/JSX changes)
  useEffect(() => {
    const scriptId = "zoho-desk-feedback-widget";
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://desk.zoho.com/portal/api/feedbackwidget/1247602000000421003?orgId=907603622&displayType=popout";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Optional: remove on unmount if you don't want it global
      // const existing = document.getElementById(scriptId);
      // if (existing) existing.remove();
    };
  }, []);

  // Vibrant colors with good white text contrast (for purchased services only)
  const vibrantColors = [
    "#A5C9FF", // Sky Blue
    "#C8A2FF", // Lavender
    "#8FE3FF", // Aqua
    "#9FE7C3", // Mint Green
    "#FFE08C", // Soft Amber
    "#FFA97A", // Soft Coral / Peach
    "#7DD6C6", // Teal Mist
    "#B5B8FF", // Periwinkle
    "#FFBE88", // Peach Orange
    "#C5E47A", // Fresh Lime
    "#E2B6FF", // Light Fuchsia (very subtle violet tone)
    "#A7E0F3", // Icy Blue
  ];

  // Gray color for unpurchased and coming soon services
  const grayColor = "#9ca3af";

  // Service icons mapping
  const iconMap: Record<string, string> = {
    APS: "📋",
    "English Language Training": "🌍",
    SOP: "📝",
    "Blocked Account": "🏦",
    "Foreign Language": "🗣️",
    "University Shortlist": "🎓",
    Visa: "✈️",
    Accomodation: "🏠",
  };

  // Abbreviations for mobile
  const abbrMap: Record<string, string> = {
    APS: "APS",
    "English Language Training": "English",
    SOP: "SOP",
    "Blocked Account": "Blocked Acc.",
    "Foreign Language": "Language",
    "University Shortlist": "University",
    Visa: "Visa",
    Accomodation: "Accom.",
  };

  // Shuffle colors for randomization
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize services data
  useEffect(() => {
    if (!user?.email) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await applicationService.getCrossSellingApplications(
          user.email
        );

        if (res?.success && res.data) {
          const combined: Service[] = [];
          const shuffledColors = shuffleArray(vibrantColors);
          let colorIndex = 0;

          const totalServices =
            res.data.purchased.length +
            res.data.notPurchased.length +
            res.data.comingSoon.length;

          // Add purchased services with vibrant colors
          res.data.purchased.forEach((s: any) => {
            combined.push({
              ...s,
              value: 100 / totalServices,
              purchased: true,
              comingSoon: false,
              color: shuffledColors[colorIndex % shuffledColors.length],
              icon: iconMap[s.name] || "📦",
            });
            colorIndex++;
          });

          // Add not purchased services with gray color
          res.data.notPurchased.forEach((s: any) => {
            combined.push({
              ...s,
              value: 100 / totalServices,
              purchased: false,
              comingSoon: false,
              color: grayColor,
              icon: iconMap[s.name] || "📦",
            });
          });

          // Add coming soon services with gray color
          res.data.comingSoon.forEach((s: any) => {
            combined.push({
              ...s,
              value: 100 / totalServices,
              purchased: false,
              comingSoon: true,
              color: grayColor,
              icon: iconMap[s.name] || "📦",
            });
          });

          setServicesData(combined);
        }
      } catch (error) {
        console.error("❌ Failed to fetch cross-selling applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user?.email]);

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let size = Math.min(containerWidth - 40, 600);
        if (window.innerWidth < 640) {
          size = Math.min(containerWidth - 20, 400);
        } else if (window.innerWidth < 1024) {
          size = Math.min(containerWidth - 30, 500);
        }
        setDimensions({ width: size, height: size });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    onChartResize?.(dimensions.height + 100);
  }, [dimensions.height, onChartResize]);

  const handleServiceClick = (service: Service) => {
    if (service.purchased && !service.comingSoon) {
      window.open(`https://${service.domain_url}`, "_blank");
    } else if (!service.purchased && !service.comingSoon) {
      onTabChange?.("other-services");
    }
  };

  const handleServiceHover = (serviceName: string | null) => {
    setHoveredService(serviceName);
  };

  if (loading) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-gray-50 to-white shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <div className="text-gray-500 font-medium">
              Loading your services...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const scale = dimensions.width / 600;
  const center = dimensions.width / 2;
  const outerRadius = 220 * scale;
  const innerRadius = 100 * scale;
  const chartRadius = 160 * scale;

  let currentAngle = 0;
  const slicesWithAngles = servicesData.map((service) => {
    const startAngle = currentAngle;
    const endAngle = currentAngle + (service.value || 12.5) * 3.6;
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

  const getTextSize = () => {
    if (dimensions.width < 350) return "text-xs";
    if (dimensions.width < 400) return "text-sm";
    return "text-base";
  };

  const getGridCols = () => {
    if (dimensions.width < 640) return "grid-cols-1";
    if (dimensions.width < 1024) return "grid-cols-2";
    if (dimensions.width < 1280) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="scale-90 md:scale-95 origin-top">
      <Card className="mb-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-md border-0">
        <CardContent className="p-2.5 sm:p-3">
          <div
            ref={containerRef}
            className="relative flex justify-center overflow-visible pt-4 sm:pt-5"
          >
            <svg
              width={dimensions.width}
              height={dimensions.height}
              ref={svgRef}
              style={{ overflow: "visible" }}
              className="max-w-full h-auto"
            >
              <defs>
                <filter
                  id="dropShadow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="1" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  id="textGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="1.5"
                    result="blur"
                  />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
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
                const labelPos = polarToCartesian(
                  center,
                  center,
                  chartRadius,
                  service.midAngle
                );
                const useAbbr = dimensions.width < 450;
                const displayName = useAbbr
                  ? abbrMap[service.name] || service.name
                  : service.name;
                const lines = displayName.split(" ");
                const maxWordLen = Math.max(...lines.map((w) => w.length), 1);
                const fontSizeNum = Math.min(
                  12 * scale,
                  (120 * scale) / maxWordLen
                );
                const lineHeight = fontSizeNum * 1.25;
                const n = lines.length;
                const firstDy = -(((n - 1) * lineHeight) / 2);
                const iconFontSizeNum = 20 * scale;
                const spacing = 5 * scale;
                const firstCenter = labelPos.y + firstDy;
                const iconY =
                  firstCenter - fontSizeNum / 2 - spacing - iconFontSizeNum / 2;

                return (
                  <g
                    key={service.id}
                    onMouseEnter={() => handleServiceHover(service.name)}
                    onMouseLeave={() => handleServiceHover(null)}
                    onClick={() => handleServiceClick(service)}
                    className="cursor-pointer transition-all duration-200"
                  >
                    {/* Slice */}
                    <path
                      d={slicePath}
                      fill={service.color}
                      stroke="white"
                      strokeWidth={3 * scale}
                      style={{
                        filter:
                          hoveredService === service.name
                            ? "url(#dropShadow) brightness(1.1)"
                            : "url(#dropShadow)",
                        transition: "all 0.2s ease",
                        transform:
                          hoveredService === service.name
                            ? `scale(1.03)`
                            : "scale(1)",
                        transformOrigin: "center",
                      }}
                    />

                    {service.comingSoon && (
                      <path
                        d={slicePath}
                        fill="rgba(0, 0, 0, 0.3)"
                        stroke="none"
                        style={{ pointerEvents: "none" }}
                      />
                    )}

                    {/* Icon */}
                    <text
                      x={labelPos.x}
                      y={iconY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={`${iconFontSizeNum}px`}
                      style={{
                        filter: "url(#textGlow)",
                        pointerEvents: "none",
                      }}
                    >
                      {service.icon}
                    </text>

                    {/* Label */}
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-white font-semibold"
                      fontSize={`${fontSizeNum}px`}
                      style={{
                        filter: "url(#textGlow)",
                        pointerEvents: "none",
                      }}
                    >
                      {lines.map((word, i) => (
                        <tspan
                          key={i}
                          x={labelPos.x}
                          dy={i === 0 ? firstDy : lineHeight}
                        >
                          {word}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}

              {/* Center circle */}
              <circle
                cx={center}
                cy={center}
                r={100 * scale}
                fill="white"
                stroke="#e5e7eb"
                strokeWidth={4 * scale}
                style={{ filter: "url(#dropShadow)" }}
              />
              <text
                x={center}
                y={center - 10 * scale}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold text-gray-800"
                fontSize={`${22 * scale}px`}
              >
                {studentName}
              </text>
              <text
                x={center}
                y={center + 15 * scale}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-medium text-gray-500"
                fontSize={`${13 * scale}px`}
              >
                Services
              </text>
            </svg>

            {/* Hover button */}
            {hoveredService && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="pointer-events-auto transition-all duration-200"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%,-50%) translate(${(() => {
                      const s = slicesWithAngles.find(
                        (x) => x.name === hoveredService
                      );
                      if (!s) return "0,0";
                      const rad = ((s.midAngle - 90) * Math.PI) / 180;
                      const distance = outerRadius + 35 * scale;
                      const x = distance * Math.cos(rad);
                      const y = distance * Math.sin(rad);
                      return `${x}px,${y}px`;
                    })()})`,
                  }}
                >
                  {(() => {
                    const service = servicesData.find(
                      (x) => x.name === hoveredService
                    );
                    if (!service) return null;

                    if (service.purchased && !service.comingSoon) {
                      const buttonText = (service.name === 'APS Application' || service.name === 'Visa') ? 'Upload' : '🚀 Open';
                      return (
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow text-[0.7rem] sm:text-xs font-semibold whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceClick(service);
                          }}
                        >
                          {buttonText}
                        </Button>
                      );
                    } else if (!service.purchased && !service.comingSoon) {
                      return (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow text-[0.7rem] sm:text-xs font-semibold whitespace-nowrap"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceClick(service);
                          }}
                        >
                          🛒 Buy
                        </Button>
                      );
                    } else {
                      return (
                        <div className="bg-gray-500 text-white px-3 py-1 rounded-full shadow text-[0.7rem] sm:text-xs font-semibold whitespace-nowrap">
                          ⏳ Coming Soon
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Cards grid */}
          <div className={`grid ${getGridCols()} gap-2 sm:gap-3 mt-4 sm:mt-5`}>
            {servicesData.map((service) => (
              <div
                key={service.id}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer border ${
                  service.purchased && !service.comingSoon
                    ? hoveredService === service.name
                      ? "border-green-400 shadow-lg scale-105 bg-gradient-to-br from-green-50 to-green-100"
                      : "border-green-300 shadow-md bg-gradient-to-br from-green-50 to-white hover:shadow-lg"
                    : hoveredService === service.name
                    ? "border-gray-400 shadow-md scale-105 bg-gradient-to-br from-gray-100 to-gray-200"
                    : "border-gray-300 shadow-sm bg-gradient-to-br from-gray-50 to-white hover:shadow-md"
                }`}
                onMouseEnter={() => handleServiceHover(service.name)}
                onMouseLeave={() => handleServiceHover(null)}
                onClick={() => handleServiceClick(service)}
              >
                <div className="p-2.5 sm:p-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                    <div
                      className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg flex items-center justify-center text-lg sm:text-xl shadow-sm flex-shrink-0"
                      style={{ backgroundColor: service.color }}
                    >
                      {service.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-bold text-[0.7rem] sm:text-sm mb-[2px] line-clamp-2 ${
                          service.purchased && !service.comingSoon
                            ? "text-gray-800"
                            : "text-gray-600"
                        }`}
                      >
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-1 flex-wrap">
                        {service.purchased && !service.comingSoon ? (
                          <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold bg-green-100 text-green-700 px-1.5 py-[1px] rounded-full border border-green-300">
                            ✓ Active
                          </span>
                        ) : service.comingSoon ? (
                          <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold bg-yellow-100 text-yellow-700 px-1.5 py-[1px] rounded-full border border-yellow-300">
                            ⏳ Soon
                          </span>
                        ) : (
                          <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold bg-gray-100 text-gray-600 px-1.5 py-[1px] rounded-full border border-gray-300">
                            🛒 Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {hoveredService === service.name && (
                  <div className="absolute top-1.5 right-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-sm ${
                        service.purchased && !service.comingSoon
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesPieChart;
