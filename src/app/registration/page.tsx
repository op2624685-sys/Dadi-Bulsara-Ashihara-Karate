import type { Metadata } from "next";
import StudentRegistrationForm from "./StudentRegistrationForm";


export const metadata: Metadata = {
    title: "Student registration | Dadi Bulsara Ashihara Karate",
    description: "Register for the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
    return <StudentRegistrationForm />;
}