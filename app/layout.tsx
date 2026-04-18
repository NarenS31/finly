import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700", "800"],
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "FinPath — Financial literacy for kids & teens",
  description:
    "Free financial education for ages 8–17. No teacher needed. Built for the whole world.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--color-bg)] font-[var(--font-body)] antialiased">
        <Providers>
          <Navbar />
          <PageTransition>
            <main className="w-full min-h-[70vh]">{children}</main>
          </PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
