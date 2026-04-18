import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Finly - Financial Literacy for Kids & Teens",
  description:
    "Free global financial literacy for ages 8-17. Learn budgeting, saving, investing, and real-world money skills.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="font-[var(--font-sans)]">
        <Navbar />
        <PageTransition>
          <main className="mx-auto min-h-[70vh] w-full max-w-[1200px] px-5 py-10 sm:px-6 lg:px-8 lg:py-12">{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
