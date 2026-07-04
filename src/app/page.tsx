import type { Metadata } from "next";
import HomeClientPage from "./HomeClientPage";

export const metadata: Metadata = {
  title: "Cairo Hangzhou | Premium Global Visa & Travel Services",
  description:
    "Expert visa consultancy, premium flight bookings, luxury hotel reservations, and custom travel packages for 195+ countries worldwide. Experience seamless global travel with Cairo Hangzhou.",
  openGraph: {
    title: "Cairo Hangzhou | Premium Global Visa & Travel Services",
    description: "Expert visa consultancy, luxury travel planning, and concierge services for 195+ countries.",
    url: "https://cairohangzhou.com",
  },
};

export default function HomePage() {
  return <HomeClientPage />;
}
