import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SideNav } from "@/components/app-shell/side-nav";
import { TopBar } from "@/components/app-shell/top-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "GTM Agent Coordinator — LeanData",
  description:
    "Control plane for AI agents operating across your GTM stack — identity, preflight, collision detection, policy, attribution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable} ${serif.variable}`}
    >
      <body className="antialiased min-h-screen bg-canvas text-ink-900 font-sans">
        <div className="flex min-h-screen">
          <SideNav />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
