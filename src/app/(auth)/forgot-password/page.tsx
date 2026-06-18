import type { Metadata } from "next";
import ForgotPasswordPage from "./ForgotPasswordPage";


export const metadata: Metadata = {
  title: "Forget Password | Dadi Bulsara Ashihara Karate",
  description: "User Forget Password for the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <ForgotPasswordPage />;
}