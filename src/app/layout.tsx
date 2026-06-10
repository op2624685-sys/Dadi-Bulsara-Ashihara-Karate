import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dadi Bulsara Ashihara Karate",
  description:
    "Premium Ashihara Karate training — discipline, strength, and character development through the art of Sabaki.",
  keywords: ["Ashihara Karate", "Dadi Bulsara", "martial arts", "Sabaki"],
  openGraph: {
    title: "Dadi Bulsara Ashihara Karate",
    description:
      "Discipline. Strength. Become Unstoppable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body>
        <Navbar />
        {children}</body>
    </html>
  );
}
