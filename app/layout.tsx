import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Mumbai Escorts — Verified Profiles, Direct WhatsApp Booking",
  description: "Browse verified Mumbai profiles and contact them directly on WhatsApp.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark" suppressHydrationWarning><body><ThemeProvider>{children}</ThemeProvider></body></html>;
}
