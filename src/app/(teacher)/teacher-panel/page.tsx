import type { Metadata } from "next";
import TeacherPanelPage from "./TeacherPanelPage";
 
export const metadata: Metadata = {
  title: "Teacher Panel | Dadi Bulsara Ashihara Karate",
  description: "Teacher Panel for the dadi bulsara ashihara karate federation platform.",
};
 
export default function Page() {
  return <TeacherPanelPage />;
}