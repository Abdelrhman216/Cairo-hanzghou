import type { Metadata } from "next";
import HotelsClientPage from "./HotelsClientPage";

export const metadata: Metadata = {
  title: "Luxury Hotels & Boutique Stays | Cairo Hangzhou",
  description:
    "Discover handpicked 5-star hotels, high-end resorts, and historic sanctuaries across the globe. Seamless hotel booking and white-glove concierge with Cairo Hangzhou.",
  openGraph: {
    title: "Luxury Hotels & Boutique Stays | Cairo Hangzhou",
    description: "Book curated luxury accommodations and 5-star properties worldwide.",
  },
};

export default function HotelsPage() {
  return <HotelsClientPage />;
}
