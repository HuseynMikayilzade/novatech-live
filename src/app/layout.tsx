import "@fontsource-variable/unbounded";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "NovaTech canlı sorğu",
  description: "«İş yerində rəqəmsal transformasiyanın tətbiqi» təqdimatı üçün canlı sorğu və KPI paneli.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0e1528",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
