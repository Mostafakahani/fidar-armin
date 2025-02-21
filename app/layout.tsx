// app/layout.tsx
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "فیدرا آرمین - نقشه تعاملی",
  description: "Interactive map for Fidra Armin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={vazir.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
