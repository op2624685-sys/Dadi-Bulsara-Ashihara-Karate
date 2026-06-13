import type { Metadata } from "next";
import TeacherPage from "./TeacherPage";


export const metadata: Metadata = {
  title: "Teacher | Dadi Bulsara Ashihara Karate",
  description: "All the teachers for the dadi bulsara ashihara karate federation platform.",
};
 
export default function Page() {
  return <TeacherPage />;
}