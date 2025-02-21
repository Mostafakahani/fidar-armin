// components/Map.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Define types for custom icons
interface CustomIcon extends L.DivIcon {
  options: L.DivIconOptions & {
    html: string;
    className: string;
    iconSize: [number, number];
    iconAnchor: [number, number];
  };
}

type CustomIconCreator = () => CustomIcon;

// Extend the global Window interface
declare global {
  interface Window {
    customIcons: {
      createStartIcon: CustomIconCreator;
      createEndIcon: CustomIconCreator;
      createWaypointIcon: CustomIconCreator;
    };
  }
}

// Dynamically import components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// داده‌های نمونه برای مسیرهای کاربر
interface RoutePoint {
  id: number;
  position: [number, number];
  timestamp: Date;
  description: string;
}

interface RouteData {
  day: string;
  date: string;
  points: RoutePoint[];
}

// داده‌های تستی برای هفت روز گذشته
const generateTestRoutes = (): RouteData[] => {
  const routes: RouteData[] = [];
  const days = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
  ];

  // مرکز تهران
  const centerTehran: [number, number] = [35.6892, 51.389];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const formattedDate = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;
    const points: RoutePoint[] = [];

    // ایجاد 4 تا 8 نقطه برای هر روز
    const pointCount = Math.floor(Math.random() * 5) + 4;

    for (let j = 0; j < pointCount; j++) {
      // ایجاد نقاط تصادفی در اطراف مرکز تهران
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;

      const timestamp = new Date(date);
      timestamp.setHours(9 + Math.floor((j * 12) / pointCount));
      timestamp.setMinutes(Math.floor(Math.random() * 60));

      points.push({
        id: j,
        position: [centerTehran[0] + latOffset, centerTehran[1] + lngOffset],
        timestamp,
        description: `موقعیت ${j + 1} در ${timestamp.getHours()}:${String(
          timestamp.getMinutes()
        ).padStart(2, "0")}`,
      });
    }

    routes.push({
      day: days[date.getDay()],
      date: formattedDate,
      points,
    });
  }

  return routes;
};

// Custom loading component
const MapLoading = () => (
  <div className="w-full h-full flex items-center justify-center bg-card">
    <div className="text-foreground">در حال بارگذاری نقشه...</div>
  </div>
);

const Map = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    35.6892, 51.389,
  ]);
  const [zoom, setZoom] = useState(13);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  // ایجاد داده‌های تستی
  const routes = useMemo(() => generateTestRoutes(), []);

  useEffect(() => {
    setIsMounted(true);

    // Fix Leaflet icon issues in Next.js
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const L = require("leaflet");
      delete L.Icon.Default.prototype._getIconUrl;

      // تعریف آیکون‌های پیش‌فرض
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/marker-icon-2x.png",
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
      });

      // تعریف آیکون SVG سفارشی
      const createCustomIcon = (
        color: string,
        type: "start" | "end" | "point"
      ): L.DivIcon => {
        let svgIcon = "";

        if (type === "start") {
          // آیکون نقطه شروع
          svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
              <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="${color}" stroke-width="2"/>
              <path d="M12 8v8M8 12h8" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `;
        } else if (type === "end") {
          // آیکون نقطه پایان
          svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
              <circle cx="12" cy="12" r="10" fill="#ffffff" stroke="${color}" stroke-width="2"/>
              <circle cx="12" cy="12" r="4" fill="${color}"/>
            </svg>
          `;
        } else {
          // آیکون نقاط میانی
          svgIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
              <circle cx="12" cy="12" r="8" fill="#ffffff" stroke="${color}" stroke-width="2"/>
            </svg>
          `;
        }

        return L.divIcon({
          html: svgIcon,
          className: "",
          iconSize: [24, 24] as L.PointExpression,
          iconAnchor: [12, 12] as L.PointExpression,
        });
      };

      // افزودن آیکون‌های سفارشی به global scope
      window.customIcons = {
        createStartIcon: () =>
          createCustomIcon("#4CAF50", "start") as CustomIcon,
        createEndIcon: () => createCustomIcon("#F44336", "end") as CustomIcon,
        createWaypointIcon: () =>
          createCustomIcon("#2196F3", "point") as CustomIcon,
      };
    }
  }, []);

  // انتخاب مسیر فعلی
  const currentRoute = routes[selectedRouteIndex];

  // تنظیم مرکز نقشه بر اساس نقطه انتخاب شده
  useEffect(() => {
    if (selectedPoint) {
      setMapCenter(selectedPoint.position);
      setZoom(15);
    } else if (currentRoute && currentRoute.points.length > 0) {
      setMapCenter(currentRoute.points[0].position);
      setZoom(13);
    }
  }, [selectedPoint, currentRoute]);

  if (!isMounted) {
    return <MapLoading />;
  }

  const handlePointSelect = (point: RoutePoint) => {
    setSelectedPoint(point);
  };

  const handleDaySelect = (index: number) => {
    setSelectedRouteIndex(index);
    setSelectedPoint(null);
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative">
      {/* دکمه باز/بسته کردن پنل */}
      <button
        onClick={togglePanel}
        className="absolute top-2 right-2 z-10 bg-white p-2 rounded-md shadow-md md:hidden"
        aria-label={isPanelVisible ? "بستن پنل" : "باز کردن پنل"}
      >
        {isPanelVisible ? (
          // آیکون X
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // آیکون منو
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* دکمه باز/بسته کردن پنل - نسخه دسکتاپ */}
      <button
        onClick={togglePanel}
        className="absolute top-2 right-2 dark:bg-black z-10 bg-white p-2 rounded-md shadow-md hidden md:block"
        aria-label={isPanelVisible ? "بستن پنل" : "باز کردن پنل"}
      >
        {isPanelVisible ? (
          // آیکون بستن (فلش به راست)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // آیکون باز کردن (فلش به چپ)
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* پنل اطلاعات */}
      <div
        className={`
        ${isPanelVisible ? "block" : "hidden"} 
        w-full md:w-64 p-4 bg-card text-card-foreground overflow-y-auto
        transition-all duration-200 ease-in-out
        ${isPanelVisible ? "md:translate-x-0" : "md:translate-x-full"}
      `}
      >
        <h3 className="text-lg font-bold mb-4">مسیرهای اخیر</h3>

        {/* انتخاب روز */}
        <div className="mb-6">
          <p className="text-sm mb-2 font-medium">انتخاب روز:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {routes.map((route, idx) => (
              <button
                key={`day-${idx}`}
                onClick={() => handleDaySelect(idx)}
                className={`p-2 rounded-md text-right ${
                  selectedRouteIndex === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div>{route.day}</div>
                <div className="text-xs opacity-80">{route.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* جزئیات نقاط مسیر */}
        {currentRoute && (
          <div>
            <p className="text-sm mb-2 font-medium">
              نقاط مسیر {currentRoute.day}:
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {currentRoute.points.map((point, idx) => (
                <button
                  key={`point-${idx}`}
                  onClick={() => handlePointSelect(point)}
                  className={`w-full p-2 text-right rounded-md text-sm ${
                    selectedPoint?.id === point.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent"
                  }`}
                >
                  <div className="font-medium">
                    {point.timestamp.getHours()}:
                    {String(point.timestamp.getMinutes()).padStart(2, "0")}
                  </div>
                  <div className="text-xs">{point.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* نمایش اطلاعات نقطه انتخاب شده */}
        {selectedPoint && (
          <div className="mt-6 p-3 border rounded-md bg-muted">
            <h4 className="font-medium mb-2">جزئیات نقطه</h4>
            <p className="text-sm mb-1">
              زمان: {selectedPoint.timestamp.toLocaleTimeString("fa-IR")}
            </p>
            <p className="text-sm mb-1">
              موقعیت: {selectedPoint.position[0].toFixed(5)},{" "}
              {selectedPoint.position[1].toFixed(5)}
            </p>
            <p className="text-sm">{selectedPoint.description}</p>
          </div>
        )}
      </div>

      {/* نقشه */}
      <div
        className={`
        flex-1 relative h-64 md:h-full
        transition-all duration-200 ease-in-out
        ${isPanelVisible ? "md:mr-0" : "md:mr-0"}
      `}
      >
        {isMounted && (
          <MapContainer
            center={mapCenter as L.LatLngExpression}
            zoom={zoom}
            className="h-full w-full"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* نمایش مسیر با خط پیوسته */}
            {currentRoute && currentRoute.points.length > 1 && (
              <Polyline
                pathOptions={{ color: "#3B82F6", weight: 4, opacity: 0.7 }}
                positions={currentRoute.points.map(
                  (p) => p.position as L.LatLngExpression
                )}
              />
            )}

            {/* نمایش نقاط مسیر */}
            {currentRoute &&
              currentRoute.points.map((point, idx) => {
                let icon;

                // انتخاب آیکون مناسب برای هر نقطه
                if (idx === 0) {
                  // نقطه شروع
                  icon = window.customIcons?.createStartIcon();
                } else if (idx === currentRoute.points.length - 1) {
                  // نقطه پایان
                  icon = window.customIcons?.createEndIcon();
                } else {
                  // نقاط میانی
                  icon = window.customIcons?.createWaypointIcon();
                }

                return (
                  <Marker
                    key={`marker-${idx}`}
                    position={point.position as L.LatLngExpression}
                    icon={icon}
                    eventHandlers={{
                      click: () => handlePointSelect(point),
                    }}
                  >
                    <Popup>
                      <div dir="rtl" className="text-sm">
                        <p className="font-bold mb-1">{point.description}</p>
                        <p>
                          زمان: {point.timestamp.toLocaleTimeString("fa-IR")}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

            {/* کنترل زوم در گوشه پایین راست */}
            <ZoomControl position="bottomright" />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default Map;
