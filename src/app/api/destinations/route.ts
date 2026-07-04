import { NextResponse } from "next/server";
import { getDestinations } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const destinations = await getDestinations(lang);
  return NextResponse.json({ destinations });
}
