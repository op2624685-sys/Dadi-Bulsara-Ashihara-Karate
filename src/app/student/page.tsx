import type { Metadata } from "next";
import StudentPage from "./StudentPage";

 
export const metadata: Metadata = {
  title: "Join | Dadi Bulsara Ashihara Karate",
  description: "Register for the dadi bulsara ashihara karate federation platform.",
};
 
export default function Page() {
  return <StudentPage />;
}