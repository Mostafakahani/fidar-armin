// components/LoginModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deviceNumber: string) => void;
}

const LoginModal = ({ isOpen, onClose, onSubmit }: LoginModalProps) => {
  const [name, setName] = useState("");
  const [deviceNumber, setDeviceNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !deviceNumber) return;

    localStorage.setItem("userName", name);
    localStorage.setItem("deviceNumber", deviceNumber);
    onSubmit(deviceNumber);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>لطفا اطلاعات خود را وارد کنید</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">نام</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deviceNumber">شماره دستگاه</Label>
            <Input
              id="deviceNumber"
              value={deviceNumber}
              onChange={(e) => setDeviceNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            تایید
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
