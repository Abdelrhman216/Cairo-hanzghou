import type { Metadata } from "next";
import PackagesClientPage from "./PackagesClientPage";

export const metadata: Metadata = {
  title: "Egypt & China Packages",
  description:
    "Explore our curated luxury travel packages for Egypt and Hangzhou, China. Bespoke itineraries including the Pharaoh's Legacy, Silk Road Serenity, and Dual Civilization experiences.",
};

export default function PackagesPage() {
  return <PackagesClientPage />;
}
