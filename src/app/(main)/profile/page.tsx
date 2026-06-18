import type { Metadata } from "next";
import StudentProfilePage from "./StudentProfilePage";

export const metadata: Metadata = {
  title: "Profile | Dadi Bulsara Ashihara Karate",
  description: "Profile for the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <StudentProfilePage />;
}