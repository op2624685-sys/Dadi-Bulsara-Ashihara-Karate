import type { Metadata } from "next";
import AdminDashboardPage from "./AdminDashboardPage";



export const metadata: Metadata = {
  title: "Admin Panel | Dadi Bulsara Ashihara Karate",
  description: "Admin Panel of the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <AdminDashboardPage />;
}