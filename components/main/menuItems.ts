import { MenuItem } from "./SideMenu";
import {
  Cog,
  Battery,
  Wallet,
  Key,
  Smartphone,
  Plus,
  Trash,
  User,
  LineChart,
  Bell,
  Clock,
  DoorClosed,
  Map,
  Paperclip,
  PenTool,
} from "lucide-react";
export const menuItems: MenuItem[] = [
  {
    icon: Cog,
    label: "مدیریت دستگاه",
  },
  {
    icon: Battery,
    label: "شارژ دستگاه",
  },
  {
    icon: Wallet,
    label: "دریافت میزان اعتبار",
  },
  {
    icon: Key,
    label: "درخواست رمز جدید",
  },
  {
    icon: Smartphone,
    label: "ثبت شماره دستگاه",
    submenu: [
      {
        icon: Plus,
        label: "افزودن دستگاه",
      },
      {
        icon: Trash,
        label: "حذف دستگاه",
      },
    ],
  },
  {
    icon: Cog,
    label: "سایر آپشن ها",
    submenu: [
      {
        icon: User,
        label: "قفل کودک",
      },
      {
        icon: LineChart,
        label: "حالت دزدگیر",
      },
      {
        icon: PenTool,
        label: "وصل شدن به آژیر دزدگیر",
      },
      {
        icon: Bell,
        label: "هشدار در صورت روشن بودن",
      },
      {
        icon: Clock,
        label: "حالت دزدگیر اتوماتیک",
      },
      {
        icon: Clock,
        label: "تایمر 4 ثانیه ای قفل مرکزی",
      },
      {
        icon: DoorClosed,
        label: "تغییر تحریک درب",
      },
    ],
  },
  {
    icon: Map,
    label: "حصار جغرافیایی",
  },
  {
    icon: Paperclip,
    label: "پیوست ها",
  },
];
