import type { Metadata } from "next";
import EventsPage from "./EventsPage";


export const metadata: Metadata = {
  title: "Events | Dadi Bulsara Ashihara Karate",
  description: "Dadi Bulsara Ashihara Karate events and tournmanents held in the dadi bulsara ashihara karate federation platform.",
};

export default function Page() {
  return <EventsPage />;
}