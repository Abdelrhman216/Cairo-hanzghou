import type { Metadata } from "next";
import FlightsClientPage from "./FlightsClientPage";

export const metadata: Metadata = {
  title: "Premium Flight Booking | Cairo Hangzhou",
  description:
    "Book luxury business and first-class flights to any global destination. Compare routes, premium airlines, and enjoy exclusive flight fares with Cairo Hangzhou.",
  openGraph: {
    title: "Premium Flight Booking | Cairo Hangzhou",
    description: "Fly elite class. Compare international flights and premium airfares worldwide.",
  },
};

export default function FlightsPage() {
  return <FlightsClientPage />;
}
