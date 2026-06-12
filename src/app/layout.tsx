import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Montserrat, Inter } from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Dadi Bulsara Ashihara Karate",
  description:
    "Premium Ashihara Karate training — discipline, strength, and character development through the art of Sabaki.",
  keywords: ["Ashihara Karate", "Dadi Bulsara", "martial arts", "Sabaki"],
  openGraph: {
    title: "Dadi Bulsara Ashihara Karate",
    description: "Discipline. Strength. Become Unstoppable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${montserrat.variable} ${inter.variable}`}
    >
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}