import type { Metadata } from "next";
import LoginPage from "./LoginPage";


export const metadata: Metadata = {
  title: "Login | Dadi Bulsara Ashihara Karate",
  description: "Login for the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <LoginPage />;
}