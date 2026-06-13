import type { Metadata } from "next";
import AboutPage from "./AboutPage";

export const metadata: Metadata = {
  title: "About | Dadi Bulsara Ashihara Karate",
  description: "About the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <AboutPage />;
}