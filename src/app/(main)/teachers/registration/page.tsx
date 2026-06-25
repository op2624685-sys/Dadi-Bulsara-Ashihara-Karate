import type { Metadata } from "next";
import TeacherRegistrationPage from "./TeacherRegistrationPage";


export const metadata: Metadata = {
  title: "Teacher Registration | Dadi Bulsara Ashihara Karate",
  description: "Register for the teachers for the dadi bulsara ashihara karate federation platform.",
};
 
export default function Page() {
  return <TeacherRegistrationPage />;
}