import { NextResponse } from "next/server";
import { getHotels } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const htls = await getHotels(lang);
  return NextResponse.json({ hotels: htls });
}
