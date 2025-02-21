"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Header from "@/components/layout/Header";
import Controls from "@/components/main/Controls";
import LoginModal from "@/components/main/LoginModal";
import SideMenu from "@/components/main/SideMenu";
import Map from "@/components/map/Map";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [deviceNumber, setDeviceNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedDeviceNumber = localStorage.getItem("deviceNumber");
    if (!savedDeviceNumber) {
      setIsModalOpen(true);
    } else {
      setDeviceNumber(savedDeviceNumber);
    }
    setIsLoading(false);
  }, []);

  if (!isMounted || isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <main className="min-h-screen bg-background relative">
      <Header
        onMenuToggle={() => setIsSideMenuOpen(!isSideMenuOpen)}
        deviceNumber={deviceNumber}
      />
      {!isModalOpen && (
        <>
          <div className="flex h-[calc(100vh-4rem)]">
            <Map />
            <Controls deviceNumber={deviceNumber} />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-20 left-4 md:left-24 z-50"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </>
      )}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => {
          if (localStorage.getItem("deviceNumber")) {
            setIsModalOpen(false);
          }
        }}
        onSubmit={(number) => {
          setDeviceNumber(number);
          setIsModalOpen(false);
        }}
      />
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        deviceNumber={deviceNumber}
      />
    </main>
  );
}
