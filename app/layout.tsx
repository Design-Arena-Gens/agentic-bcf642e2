import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Dealer Onboarding Agents Hub",
  description:
    "AI-augmented onboarding control center to orchestrate dealer activation, compliance, and go-live readiness."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={clsx(
          inter.variable,
          "min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 antialiased"
        )}
      >
        {children}
      </body>
    </html>
  );
}
