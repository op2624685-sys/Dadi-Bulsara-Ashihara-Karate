import type { Metadata } from "next";
import CampDetailsPage from "./CampDetails";

export const metadata: Metadata = {
  title: "About Camp | Dadi Bulsara Ashihara Karate",
  description: "Camp details of the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <CampDetailsPage />;
}