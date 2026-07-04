import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/server-store";
import ProfileClientPage from "./ProfileClientPage";

export const metadata: Metadata = {
  title: "My Profile & Bookings | Cairo Hangzhou",
  description:
    "View your flight requests, hotel reservations, visa application statuses, and loyalty points. Secure travel dashboard by Cairo Hangzhou.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ch_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = getSession(token);
  if (!session) {
    redirect("/login");
  }

  return <ProfileClientPage />;
}
