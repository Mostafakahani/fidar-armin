// components/Header.tsx
"use client";

import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  onMenuToggle: () => void;
  deviceNumber: string;
}

const Header = ({ onMenuToggle, deviceNumber }: HeaderProps) => {
  return (
    <header className="bg-card shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={onMenuToggle}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>

        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-48">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <div className="text-foreground font-bold text-sm md:text-base">
          {deviceNumber && `شماره دستگاه: ${deviceNumber}`}
        </div>
      </div>
    </header>
  );
};

export default Header;
