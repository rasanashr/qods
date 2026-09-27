import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "شبکه قدس | سوپر اپ شهروندان",
  description:
    "شبکه قدس، سوپر اپ یکپارچه شهروندان؛ دسترسی به شهرداری، نیازمندی‌ها، املاک، سامانه ۱۳۷، پیامرسان، فروشگاه، سرگرمی، نقشه شهر، اشیاء گمشده، مسابقه و خرید قسطی.",
  keywords: [
    "شبکه قدس",
    "سوپر اپ",
    "شهروندان",
    "شهرداری",
    "نیازمندی‌ها",
    "املاک",
    "سامانه ۱۳۷",
    "پیامرسان",
    "فروشگاه",
  ],
  authors: [{ name: "شبکه قدس" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "شبکه قدس | سوپر اپ شهروندان",
    description: "سوپر اپ یکپارچه شهروندان شهر قدس",
    type: "website",
    locale: "fa_IR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`${vazirmatn.variable} font-sans antialiased bg-muted/30 text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
