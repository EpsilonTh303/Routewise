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
    "Explore residence and citizenship routes, compare your profile and plan conditional study-to-work pathways with dated official sources.",
  keywords: [
    "immigration", "citizenship", "residency", "golden visa", "digital nomad",
    "Azerbaijan", "relocation strategy", "visa", "second passport",
  ],
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH??''}/routewise-icon.svg`,
  },
  openGraph: {
    title: "RouteWise — Immigration Strategy Engine",
    description:
      "Residence and citizenship routes. One personal relocation strategy.",
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
