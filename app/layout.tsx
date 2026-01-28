"use client";

import type { Metadata } from "next";
import { Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ProgressBarProvider } from "@/provider/ProgressBarProvider";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/provider/ThemeProvider";
import dynamic from "next/dynamic";
const ServiceWorkerRegisterProvider = dynamic(
  () =>
    import("@/provider/ServiceWorkerRegisterProvider").then(
      (mod) => mod.ServiceWorkerRegisterProvider
    ),
  { ssr: false }
);

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "ConnectPay",
//   description:
//     "Real-time communication platform with messaging and calling features.",
//   manifest: "/manifest.json",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#666AEE",
                color: "#fff",
              },
              success: {
                duration: 2000,
              },
              error: {
                duration: 3000,
              },
            }}
          />
          <ProgressBarProvider>
            <ServiceWorkerRegisterProvider />
            {children}
          </ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
