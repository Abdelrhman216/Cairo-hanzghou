import type { Metadata } from "next";
import VisaClientPage from "./VisaClientPage";

export const metadata: Metadata = {
  title: "Global Visa Services & Fast-Track Consultancy | Cairo Hangzhou",
  description:
    "Apply for tourist, business, student, or work visas for 195+ countries worldwide. Expert visa document reviews, fast-track processing, and 99.2% approval rates with Cairo Hangzhou.",
  openGraph: {
    title: "Global Visa Services & Fast-Track Consultancy | Cairo Hangzhou",
    description: "Get visa approvals for Schengen, USA, UK, Japan, China, and 195+ countries.",
  },
};

export default function VisaPage() {
  return <VisaClientPage />;
}
