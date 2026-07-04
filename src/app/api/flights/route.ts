import { NextResponse } from "next/server";
import { getFlights } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const flts = await getFlights(lang);
  return NextResponse.json({ flights: flts });
}
