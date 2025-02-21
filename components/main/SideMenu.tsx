// components/SideMenu.tsx
"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { menuItems } from "./menuItems";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  deviceNumber: string;
}

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  submenu?: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }[];
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userName");
      localStorage.removeItem("deviceNumber");
      onClose();
      window.location.reload();
    }
  };

  const MenuItem = ({ item }: { item: MenuItem }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpen = openSubmenu === item.label;

    if (hasSubmenu) {
      return (
        <Collapsible
          open={isOpen}
          onOpenChange={() => setOpenSubmenu(isOpen ? null : item.label)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2">
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-right">{item.label}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pr-4">
            {item.submenu?.map((subitem, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-1.5"
                onClick={subitem.onClick}
              >
                <subitem.icon className="h-4 w-4" />
                <span className="flex-1 text-right">{subitem.label}</span>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 px-2"
        onClick={item.onClick}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1 text-right">{item.label}</span>
      </Button>
    );
  };

  // Don't render anything until mounted
  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[280px] p-0">
        <SheetTitle className="sr-only">منوی جانبی</SheetTitle>
        <div className="flex flex-col gap-1 p-4">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-2 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="flex-1 text-right">خروج</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
