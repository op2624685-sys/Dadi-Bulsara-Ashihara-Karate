import type { Metadata } from "next";
import ContactPage from "./ContactPage";

export const metadata: Metadata = {
  title: "Contact | Dadi Bulsara Ashihara Karate",
  description: "Contact the Dadi Bulsara Ashihara Karate federation.",
};

export default function Page() {
  return <ContactPage />;
}
