import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RouteWise — Immigration Strategy Engine",
  description:
    "Enter your citizenship, budget and profile. RouteWise scores 62 real residence & citizenship programs across 51 countries and builds your personal relocation strategy — calibrated for the Azerbaijani passport.",
  keywords: [
    "immigration", "citizenship", "residency", "golden visa", "digital nomad",
    "Azerbaijan", "relocation strategy", "visa", "second passport",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "RouteWise — Immigration Strategy Engine",
    description:
      "62 programs. 51 countries. One personal relocation strategy.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0f0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
