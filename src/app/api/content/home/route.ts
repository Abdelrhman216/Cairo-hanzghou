import { NextResponse } from "next/server";
import { getHomeContent } from "@/lib/server-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "en";

  const content = await getHomeContent(lang);
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}
