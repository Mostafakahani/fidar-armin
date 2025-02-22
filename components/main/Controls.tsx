import { Lock, Unlock, Bell, BellOff, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface ControlsProps {
  deviceNumber: string;
}

export const Controls = ({ deviceNumber }: ControlsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSMSAction = (action: string) => {
    const messages: Record<string, string> = {
      unlock: "باز کردن درب‌ها",
      lock: "قفل کردن درب‌ها",
      bell: "فعال کردن آژیر",
      silent: "غیرفعال کردن آژیر",
      PowerOff:"خاموش کردن",
    };

    const message = messages[action];
    const targetNumber = deviceNumber || "10000000";
    const smsUrl = `sms:${targetNumber}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const controls = [
    { id: "unlock", icon: Unlock, tooltip: "باز کردن" },
    { id: "lock", icon: Lock, tooltip: "قفل کردن" },
    { id: "bell", icon: Bell, tooltip: "زنگ" },
    { id: "silent", icon: BellOff, tooltip: "سکوت" },
    { id: "PowerOff", icon: PowerOff, tooltip: "خاموش"},
  ];

  return (
    <div
      className={`
      flex p-4 bg-card shadow-lg
      ${
        isMobile
          ? "flex-row justify-center fixed bottom-0 w-full gap-4"
          : "flex-col w-20 gap-4"
      }
    `}
    >
      {controls.map((control) => (
        <Tooltip key={control.id} delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12"
              onClick={() => handleSMSAction(control.id)}
            >
              <control.icon className="h-6 w-6" />
              <span className="sr-only">{control.tooltip}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side={isMobile ? "top" : "left"} sideOffset={10}>
            <p>{control.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default Controls;
